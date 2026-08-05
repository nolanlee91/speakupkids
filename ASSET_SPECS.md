# ASSET_SPECS — SpeakUp Kids

Bảng đặc tả hình minh hoạ cho giao diện "thế giới phiêu lưu sách tranh".
Sau khi khung bố cục đã hoàn thiện, đây là danh sách asset **đang dùng** và asset **còn thiếu** cần Claude Design vẽ.

Art direction chung: 3D-render ấm áp, thủ công, hơi phép thuật, dẫn dắt bởi **Maple** (bé hải ly Canada — nơ lá phong, áo cardigan xanh mòng két, viền coral, chân váy navy, ba lô, giày sneaker). Bảng màu: kem `#fef6ec`, teal `#17a2a2`, coral `#ff7a59`, nắng `#ffcc33`, tím `#a05be0`. Tránh: màu quá "trẻ mẫu giáo", viền cứng, bố cục dashboard.

---

## 1. Asset ĐANG DÙNG (đã có, đạt yêu cầu)

| Tên file | Kích thước | Nền | Dùng ở đâu |
|---|---|---|---|
| `vancouver-hero-maple-girl-v3.webp` | 1844×853 · 94KB | full-bg | Home — arrival scene; Splash |
| `shadowing-background.webp` | 1672×941 · 43KB | full-bg | Speak Lab — stage; Shadowing Studio |
| `gen/mascot-wave.webp` | 627×627 · 27KB | transparent | Adventure — Maple tại checkpoint hiện tại |
| `gen/mascot-headphones.webp` | 627×627 · 31KB | transparent | Speak Lab — Maple trên sân khấu |
| `gen/mascot-book.webp` | 627×627 · 28KB | transparent | Collection — header sổ tay; upsell modal |
| `gen/mascot-star.webp` | 627×627 · 28KB | transparent | Reward modal |
| `badges/badge-*.webp` (12) | 320×320 · ~20KB | transparent | Collection — kệ huy hiệu |
| `gen/thumb-*.webp` (6) | 836×313 · ~38KB | full-bg | Speak Lab — filmstrip (bài chưa có video thật) |
| `gen/scene-park.webp` | 4:3 · 277KB | full-bg | Picture Detective `pd-park` + Picture Talk `pt-park` ✅ **đã vẽ** |
| `gen/scene-kitchen.webp` | 4:3 · 159KB | full-bg | Picture Detective `pd-kitchen` ✅ **đã vẽ** |
| `gen/game-picdet.webp` | 4:3 · 280KB | full-bg | Games — portal Picture Detective ✅ **đã vẽ** |

> Đợt 1 đã tích hợp 3 ảnh WebP trên (Maple hero làm tham chiếu phong cách). Emoji vẫn giữ làm fallback nếu game chưa có `image`. Đã xoá 3 PNG gốc (~7 MB).

---

## 2. Asset CÒN THIẾU — cần vẽ (đang là placeholder CSS/emoji)

> Thứ tự ưu tiên theo "vertical slice": **A → B → C**. Vẽ theo batch nhỏ, hoàn thiện 1 mạch trước khi nhân rộng.

### A. Vùng đất Adventure (thay silhouette CSS + tint bằng tranh vùng đất)
Hiện mỗi vùng chỉ là gradient + silhouette SVG đơn giản (nhà/cây/núi/sách/sao). Cần tranh nền vùng đất để bản đồ thành thế giới thật.

| Tên đề xuất | Mô tả hình | Tỷ lệ / kích thước | Nền | Dùng ở đâu |
|---|---|---|---|---|
| `world-everyday-town.webp` | Phố nhỏ Canada ấm áp: café và cây phong bên trái, bookshop và trạm xe bên phải; hành lang gameplay thoáng ở giữa, không vẽ sẵn đường mòn | 16:9 ngang · 1600×900 | full-bg | Adventure — dải vùng Everyday Town · đã hoàn thành |
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

---

## 4. Maple House — asset dựng từ 3D rồi render về sprite 2D (2026-08-04)

> **Vì sao:** 5 sprite sheet nội thất hiện tại được sinh ở các đợt khác nhau, mỗi món một
> góc camera và một hướng sáng riêng → xếp chung vào phòng thì không ra cùng một không gian.
> Cách chữa KHÔNG phải là chuyển app sang 3D, mà là **dựng model 3D rồi render tất cả về
> sprite 2D qua ĐÚNG MỘT camera và ĐÚNG MỘT bộ đèn**. Runtime vẫn nhẹ như hiện nay.

### 4.1 Camera chuẩn (bắt buộc giống nhau cho mọi món)
| Thông số | Giá trị | Ghi chú |
|---|---|---|
| Kiểu | Perspective, tiêu cự **50mm** | Không dùng orthographic — phòng nền là ảnh phối cảnh thật |
| Góc xoay ngang | **0°** (nhìn thẳng vào tường sau) | Đồ lệch trái/phải do VỊ TRÍ, không do xoay camera |
| Góc ngẩng | **12° từ trên xuống** | Khớp tầm mắt của ảnh phòng hiện tại |
| Chiều cao camera | 1,55m so với sàn | Ngang tầm mắt trẻ đứng |
| Khoảng cách | 4,2m tới tâm vật thể | Giữ nguyên cho mọi món để tỉ lệ nhất quán |

### 4.2 Đèn chuẩn
- **Key light:** từ **phía sau-trái, cao 40°** (khớp cửa sổ hoàng hôn trong ảnh phòng), 5200K, ấm.
- **Fill:** đối diện, cường độ 25% key, hơi lạnh (6500K) cho ra bóng xanh nhẹ.
- **Rim:** sau-phải yếu, tách vật thể khỏi nền.
- **Không bake bóng đổ xuống sàn vào sprite** — app tự vẽ bóng tiếp đất (`.room-shop-item::after`).
  Sprite có sẵn bóng sàn sẽ thành hai lớp bóng chồng nhau.

### 4.3 Xuất file
- PNG nền trong suốt → nén WebP q85 (như đợt nén sheet cũ: 7,3MB → 1,04MB).
- **Ô vuông 1:1**, vật thể canh **đáy** ô (chân vật chạm ~92% chiều cao ô), chừa lề 4% mỗi bên.
  App neo món theo tâm ô nên chân vật lệch là món sẽ "lơ lửng".
- Sheet 4 cột × N hàng, mỗi ô 512×512 (khớp `background-size: 400% 200%` hiện tại).

### 4.4 Cần thêm cho từng món ngồi được
Món nào Maple ngồi/nằm vào (giường, ghế, beanbag, pod đọc sách) nên render **2 lớp**:
- `<id>-back.webp` — phần sau lưng Maple (nệm, thân ghế)
- `<id>-front.webp` — phần che trước (chăn, tay vịn, lưng ghế)

Hiện app đã tạo được cảm giác "ngồi lọt vào" bằng cách vẽ **cả món** đè lên Maple
(`sitIn` trong `app/clubhouse.tsx`). Tách 2 lớp là bước nâng cấp sau, cho phép thấy
cả đầu lẫn chân bé thò ra đúng chỗ.

### 4.5 Vị trí mặc định theo TỪNG phòng (việc còn thiếu, quan trọng)
Hiện mỗi món chỉ có **một** toạ độ `x/y` dùng chung cho cả 5 phòng → mua cây bonsai ở
phòng khách thì nó nằm giữa tường vì phòng đó không có mặt bàn ở đúng chỗ ấy.
Cần khai báo cho mỗi phòng: vùng **sàn**, vùng **mặt bàn**, vùng **tường treo được**,
và toạ độ mặc định của từng món theo phòng.
