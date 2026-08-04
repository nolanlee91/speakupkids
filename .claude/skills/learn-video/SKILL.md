---
name: learn-video
description: "Dựng và gắn clip mở cảnh cho bài Learn của SpeakUp Kids — xử lý video nguồn, thêm narration giọng nữ (edge-tts), ducking nhạc nền, encode web, rồi gắn vào lib/learn.ts. Dùng khi cần thay ảnh scene của một bài học bằng video, hoặc khi có file mới trong video-inbox."
---

# Clip mở cảnh cho bài Learn

Quy trình đã chạy thật lần đầu ở Level 1 · Unit 1 "At the Park" (commit 7b4d977).
Mục tiêu dài hạn: thay dần ảnh scene tĩnh bằng clip cho các bài Learn.

## Nguyên tắc không được phá

- **Giữ nguyên audio gốc** (nhạc, tiếng cười, tiếng động vật) — narration chỉ chồng lên,
  nền hạ xuống ~27% trong lúc đọc rồi trả lại mức tự nhiên.
- **Không giọng nam, không giọng SAPI/Windows mặc định.** Thiếu edge-tts thì DỪNG bước
  narration và báo, giữ nguyên video nguồn — thà không có narration còn hơn giọng robot.
- **Không upscale, không đổi thời lượng, không subtitle, không lip-sync.**
- **Không copy video nguồn nặng vào repo** — chỉ file hoàn thiện nằm trong `public/`.
- Bài chưa có clip phải giữ nguyên ảnh và layout y như cũ.

## Bước 1 — Dựng file

```bash
bash .claude/skills/learn-video/scripts/make-learn-video.sh \
  --src "C:/Users/thang/OneDrive/Desktop/15. Englishapp/video-inbox/<ten-nguon>.mp4" \
  --text "The children are running along the path, and the excited dog is chasing the ball." \
  --out "public/assets/videos/learn/level-1/level-1-unit-01-at-the-park.mp4"
```

Mặc định: giọng `en-CA-ClaraNeural` (nữ Canada, ấm, hợp trẻ 9–12) · `--rate=-10%` ·
narration bắt đầu `--start 0.8` · nền hạ `--duck 0.27` · `--crf 26`.

Script tự probe nguồn, sinh narration, ghép ducking có ramp, encode H.264 + AAC +
faststart, rồi **tự đo lại**: dung lượng, SSIM so với nguồn, faststart, mức ducking thật.

Tuỳ chọn hay dùng: `--voice en-US-AvaMultilingualNeural` (giọng Mỹ ấm hơn) ·
`--rate=-0%` nếu câu dài bị tràn cuối clip · `--crf 28` nếu cần file nhẹ hơn ·
`--no-narration` khi clip đã có sẵn lời.

**Chuẩn nghiệm thu:** 720p giữ nguyên · SSIM ≥ 0,98 · faststart OK · ~1–3 MB cho clip 10s ·
narration kết thúc trước khi clip còn 0,5s. Script cảnh báo nếu lệch.

⚠️ **Luôn nghe thử file trước khi commit.** Script đo được số, không đánh giá được giọng
đọc nghe có tự nhiên không.

## Bước 2 — Gắn vào bài học

Chỉ cần **một dòng** trong `lib/learn.ts`, ngay dưới `sceneImage` của bài đó:

```ts
sceneVideo: "/assets/videos/learn/level-1/level-1-unit-01-at-the-park.mp4",
```

Hạ tầng đã có sẵn, KHÔNG cần sửa gì thêm:
- `Lesson.sceneVideo?: string` (lib/learn.ts) — bài không có trường này giữ nguyên ảnh.
- `LessonHeroMedia` (app/learn.tsx) — ưu tiên video, `sceneImage` làm poster và fallback,
  không autoplay, nút Play to rõ, `playsInline`, `preload="metadata"`, controls sau khi
  phát, nút "Xem lại" khi hết, video lỗi → tự quay về ảnh, rời màn → pause + stopSpeaking.
- CSS dùng chung class `.lh-img` nên crop desktop 300px giống hệt bài chỉ có ảnh.

**KHÔNG sửa `lib/catalog.gen.ts`** — file tự sinh, và catalog chỉ lưu title + sceneImage
nên thêm clip không ảnh hưởng gì tới nó.

## Bước 3 — Kiểm tra

```bash
npm run lint && npm test -- --run && npm run build
```

Xem giao diện thật (app có cổng đăng nhập nếu `.env.local` bật cloud → build bản offline):

```bash
NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY= npm run build
cd out && python -m http.server 3111 --bind 127.0.0.1
```

Rồi mở `http://127.0.0.1:3111/` và kiểm ở **1440 / 820 / 390 px**. Cần xác nhận:
- Màn danh sách bài **không tạo thẻ `<video>` nào**.
- Trước khi bấm Play chỉ tải vài trăm byte metadata, không kéo cả file.
- Một bài KHÔNG có clip vẫn là `IMG.lh-img` trực tiếp, không wrapper.

Kiểm nhanh bằng console:
```js
document.querySelectorAll('video').length            // ở màn danh sách phải = 0
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.mp4'))
  .reduce((s, r) => s + r.transferSize, 0)            // trước khi Play: vài trăm byte
```

**Tắt server tĩnh trước khi `npm run build` lại**, không thì lỗi `EBUSY rmdir out/`.
Xong nhớ build lại bản production (có `.env.local`) trước khi commit.

## Ghi chú môi trường

- `bc` không có trên máy này — mọi phép tính số thực dùng `python -c`.
- Python trong Bash tool phải nhận **đường dẫn Windows** (`r'C:\...'`); đường dẫn kiểu
  `/c/...` sẽ FileNotFoundError.
- edge-tts gọi dịch vụ của Microsoft để tổng hợp giọng — câu narration được gửi ra ngoài.
  Nội dung bài học trẻ em thì không nhạy cảm, nhưng nên nói rõ với chủ dự án.
- Dev server hay chiếm sẵn cổng 3000; dùng cổng khác cho bản test.
