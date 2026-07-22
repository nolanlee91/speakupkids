# ASSET_SPECS — SpeakUp Kids

Bảng đặc tả hình minh hoạ cho giao diện "thế giới phiêu lưu sách tranh".
Sau khi khung bố cục đã hoàn thiện, đây là danh sách asset **đang dùng** và asset **còn thiếu** cần Claude Design vẽ.

Art direction chung: 3D-render ấm áp, thủ công, hơi phép thuật, dẫn dắt bởi **Maple** (bé hải ly Canada — nơ lá phong, áo cardigan xanh mòng két, viền coral, chân váy navy, ba lô, giày sneaker). Bảng màu: kem `#fef6ec`, teal `#17a2a2`, coral `#ff7a59`, nắng `#ffcc33`, tím `#a05be0`. Tránh: màu quá "trẻ mẫu giáo", viền cứng, bố cục dashboard.

---

## 1. Asset ĐANG DÙNG (đã có, đạt yêu cầu)

| Tên file | Kích thước | Nền | Dùng ở đâu |
|---|---|---|---|
| `vancouver-hero-maple-girl-v3.png` | 1844×853 (2.16:1) | full-bg | Home — arrival scene; Splash |
| `shadowing-background.png` | 1672×941 (1.78:1) | full-bg | Speak Lab — stage; Shadowing Studio |
| `gen/mascot-wave.png` | 627×627 | transparent | Adventure — Maple tại checkpoint hiện tại |
| `gen/mascot-headphones.png` | 627×627 | transparent | Speak Lab — Maple trên sân khấu |
| `gen/mascot-book.png` | 627×627 | transparent | Collection — header sổ tay; upsell modal |
| `gen/mascot-star.png` | 627×627 | transparent | Reward modal |
| `badges/badge-*.png` (12) | 320×320 | transparent | Collection — kệ huy hiệu |
| `gen/thumb-*.png` (6) | 836×313 | full-bg | Speak Lab — filmstrip (bài chưa có video thật) |

---

## 2. Asset CÒN THIẾU — cần vẽ (đang là placeholder CSS/emoji)

> Thứ tự ưu tiên theo "vertical slice": **A → B → C**. Vẽ theo batch nhỏ, hoàn thiện 1 mạch trước khi nhân rộng.

### A. Vùng đất Adventure (thay silhouette CSS + tint bằng tranh vùng đất)
Hiện mỗi vùng chỉ là gradient + silhouette SVG đơn giản (nhà/cây/núi/sách/sao). Cần tranh nền vùng đất để bản đồ thành thế giới thật.

| Tên đề xuất | Mô tả hình | Tỷ lệ / kích thước | Nền | Dùng ở đâu |
|---|---|---|---|---|
| `world-everyday-town.png` | Phố nhỏ Canada ấm áp: cửa hàng, cây phong, đường mòn uốn | 3:4 dọc · 1200×1600 | full-bg (mép trên trong suốt để nối vùng trên) | Adventure — dải vùng Everyday Town |
| `world-school.png` | Sân trường, cột cờ, xe buýt vàng, lá rơi | 3:4 · 1200×1600 | full-bg mép hoà tan | Adventure — vùng School Adventure |
| `world-forest.png` | Rừng thông bí ẩn, sương, đom đóm, con vật thấp thoáng | 3:4 · 1200×1600 | full-bg mép hoà tan | Adventure — Mystery Forest |
| `world-vancouver.png` | Bờ biển Vancouver, núi tuyết, cầu Lions Gate | 3:4 · 1200×1600 | full-bg mép hoà tan | Adventure — Vancouver Journey |
| `world-story.png` | Thư viện phép thuật, sách bay, ánh nến ấm | 3:4 · 1200×1600 | full-bg mép hoà tan | Adventure — Story Kingdom |
| `world-space.png` | Bầu trời đêm/vũ trụ dịu, hành tinh, sao băng | 3:4 · 1200×1600 | full-bg mép hoà tan | Adventure — Space Mission |
| `checkpoint-icons` (bộ 6) | Icon hoạt động: 🔎 kính lúp, 🧩 mảnh ghép, 🦉 cú, 💬 bong bóng, 🎤 mic, 🎬 phim — vẽ tay tròn | 1:1 · 256×256 mỗi cái | transparent | Adventure/Home — nút checkpoint (thay emoji) |
| `signpost-frame.png` | Khung biển gỗ treo (đặt icon vùng lên) | 1:1 · 256×256 | transparent | Adventure — signpost mỗi vùng |

### B. Cổng trò chơi (Games) — thay emoji-trong-vòng bằng cảnh game
Mỗi game cần 1 tranh "cổng" nhận diện môi trường riêng. Kích thước đã ghi sẵn trong app (badge góc portal).

| Tên đề xuất | Mô tả hình | Tỷ lệ / kích thước | Nền | Dùng ở đâu |
|---|---|---|---|---|
| `game-picdet.png` | Maple cầm kính lúp soi bức tranh (thám tử) | 4:3 · 800×600 | full-bg | Games — portal featured Picture Detective |
| `game-talk.png` | Maple trước khung tranh, bong bóng thoại | 4:3 · 800×600 | full-bg | Games — portal Picture Talk |
| `game-puzzle.png` | Các mảnh chữ gỗ ghép thành câu | 4:3 · 800×600 | full-bg | Games — portal Sentence Puzzle |
| `game-riddle.png` | Cú thông thái + dấu hỏi phép thuật | 4:3 · 800×600 | full-bg | Games — portal English Riddles |

### C. Cảnh trong game & sticker (thay "scene emoji" trong app/games.tsx)
Hiện màn chơi hiển thị lưới emoji làm cảnh — cần tranh thật để trẻ quan sát & mô tả.

| Tên đề xuất | Mô tả hình | Tỷ lệ / kích thước | Nền | Dùng ở đâu |
|---|---|---|---|---|
| `scene-park.png` | Công viên: cây, chó, chim, bóng, 2 bé, nắng | 4:3 · 1600×1200 | full-bg | Picture Detective `pd-park` + Picture Talk `pt-park` |
| `scene-kitchen.png` | Nhà bếp: táo, chuối, sữa, đầu bếp | 4:3 · 1600×1200 | full-bg | Picture Detective `pd-kitchen` |
| `sticker-set` (bộ 8) | Sticker sưu tầm: kính lúp, cú, mảnh ghép, sao, mic, bản đồ, lá phong, vương miện — kiểu die-cut bóng | 1:1 · 512×512 mỗi cái | transparent (viền trắng die-cut) | Collection — ô sticker (thay emoji) |
| `maple-pose-cheer.png` | Maple reo mừng (cho reward/hoàn thành) | 1:1 · 627×627 | transparent | Reward modal, empty states |
| `maple-pose-think.png` | Maple suy nghĩ (cho câu đố/gợi ý) | 1:1 · 627×627 | transparent | Riddle/hint states |

---

## 3. Ghi chú kỹ thuật cho người vẽ
- **Nền vùng đất** (world-*.png): để **mép trên mờ dần / trong suốt ~15%** để các vùng nối liền thành một dải liên tục khi cuộn dọc; con đường mòn nên **thoát ra ở giữa cạnh dưới** để nối sang vùng kế.
- **Maple** luôn cùng một thiết kế nhân vật (xem art direction). Xuất **PNG nền trong suốt**, chừa bóng đổ mềm.
- **Sticker & checkpoint icon**: nền trong suốt, có viền/đổ bóng nhẹ để "dán" lên trang giấy.
- Tất cả asset tối ưu < 400KB (trừ nền lớn < 900KB). Ưu tiên WebP nếu pipeline hỗ trợ; hiện dùng PNG.
- Vị trí đặt & khung đã cố định trong CSS (`app/globals.css`): chỉ cần thay đúng tỷ lệ là khớp, không cần chỉnh layout.
