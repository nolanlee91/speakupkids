// ============================================================================
// MODULE PHIÊU LƯU — chiến dịch kể chuyện ĐỘC LẬP (Season → Chapter).
// Nguyên tắc bắt buộc (theo README của bộ asset):
//  - Adventure KHÔNG lấy tiến độ/câu hỏi từ Learn hay Games. Dữ liệu nằm ở đây.
//  - Bản đồ chỉ là ẢNH NỀN; node/đường đi/khoá/hoàn thành/Maple đều render bằng React overlay.
//  - Vị trí node lưu bằng phần trăm (không phải pixel), độc lập với ảnh.
//  - Mở khoá tuần tự: xong chương N → mở chương N+1. Chương đã xong chơi lại được,
//    nhưng KHÔNG cấp lại phần thưởng tiến trình (item/clue) lần hai.
// ============================================================================

/* ---------- Các bước trong một chương (toàn bộ chữ là HTML, không nằm trên ảnh) ---------- */
export type StoryStep =
  // Kể chuyện / hội thoại (không chấm điểm) — ai đang nói + câu tiếng Anh + dịch.
  | { kind: "dialogue"; who: "maple" | "narrator" | "stranger"; name?: string; en: string; vi: string }
  // Quan sát tranh: chọn chi tiết đúng trong ảnh cảnh (đọc hiểu bằng mắt).
  | { kind: "observation"; prompt: string; vi: string; options: { label: string; correct: boolean; feedback: string }[] }
  // Trắc nghiệm đọc hiểu / suy luận.
  | { kind: "multipleChoice"; prompt: string; vi: string; options: string[]; answer: string; explainVi: string }
  // Xếp câu (nhiệm vụ ngôn ngữ ngắn).
  | { kind: "arrangeSentence"; prompt: string; vi: string; solution: string[]; say?: string; explainVi?: string }
  // Lộ manh mối / vật phẩm câu chuyện (không chấm điểm, dẫn sang chương sau).
  | { kind: "clueReveal"; title: string; en: string; vi: string; itemId?: string };

export type ChapterReward = {
  stars: number;          // sao tối đa của chương
  itemId?: string;        // vật phẩm câu chuyện CHÍNH nhận được (một lần) — hiển thị ở màn kết quả
  extraItemIds?: string[]; // vật phẩm phụ nhận thêm cùng lúc (vd lá phong ép, la bàn hoàn chỉnh)
  clueTitle: string;      // tiêu đề manh mối
  clueVi: string;         // mô tả manh mối (VI)
};

export type ChapterNode = { x: number; y: number; key: string };

export type AdventureChapter = {
  id: string;             // ID ổn định, vd "s01-ch01" (KHÔNG dùng index để lưu tiến độ)
  seasonId: string;
  chapterNumber: number;
  title: string;          // tên tiếng Anh
  vi: string;             // tên tiếng Việt ngắn
  shortDescription: string;
  estimatedMinutes: number;
  node: ChapterNode;
  sceneImage?: string;    // ảnh cảnh 4:3; chưa có với chương 4–8
  storySteps?: StoryStep[]; // chưa có với chương 4–8 (locked/coming-soon)
  reward?: ChapterReward;
  nextChapterId?: string;
};

// Vật phẩm câu chuyện của Adventure (KHÔNG phải huy hiệu toàn app).
// image: ảnh evidence nền trong suốt (nếu có); nếu chưa có → dùng emoji trung tính.
export type AdventureItem = { id: string; name: string; vi: string; emoji: string; image?: string; planned?: boolean };

export type AdventureSeason = {
  id: string;
  title: string;          // tên tiếng Anh của mùa
  vi: string;             // tên tiếng Việt
  subtitle: string;       // câu giới thiệu ngắn
  mapImage: string;       // ảnh bản đồ (chỉ nền)
  chapters: AdventureChapter[];
  items: AdventureItem[];  // bộ vật phẩm câu chuyện dự kiến của mùa
  itemsTagline: string;    // câu mô tả kệ vật phẩm ("Thu thập… để …")
};

const A = "/assets/images/adventure/season-01-lost-maple-compass/";

/* ============================================================================
 * SEASON 01 — THE LOST MAPLE COMPASS
 * ==========================================================================*/

// Vật phẩm câu chuyện, xếp theo thứ tự nhận trong hành trình. Chưa có ảnh riêng → dùng emoji.
// Cốt lõi: thu thập ĐẾ la bàn + BA mảnh tam giác để ghép lại La bàn Maple ở Hidden Garden.
const S01_ITEMS: AdventureItem[] = [
  { id: "wet-postcard", name: "Wet Postcard", vi: "Tấm bưu thiếp ướt", emoji: "✉️" },        // Ch1
  { id: "ferry-ticket", name: "Ferry Ticket", vi: "Vé phà", emoji: "🎫" },                    // Ch2
  { id: "forest-map", name: "Forest Map", vi: "Bản đồ khu rừng", emoji: "🗺️" },              // Ch3
  { id: "museum-key", name: "Brass Museum Key", vi: "Chìa khoá đồng bảo tàng", emoji: "🗝️" }, // Ch4
  { id: "compass-piece-01", name: "Compass Piece 1", vi: "Mảnh la bàn 1", emoji: "🔺" },       // Ch5
  { id: "compass-base", name: "Compass Base", vi: "Đế la bàn", emoji: "⭕" },                  // Ch6
  { id: "compass-piece-02", name: "Compass Piece 2", vi: "Mảnh la bàn 2", emoji: "🔺" },       // Ch7
  { id: "pressed-maple-leaf", name: "Pressed Maple Leaf", vi: "Lá phong ép", emoji: "🍁" },   // Ch7 (phụ)
  { id: "compass-piece-03", name: "Compass Piece 3", vi: "Mảnh la bàn 3", emoji: "🔺" },       // Ch8
  { id: "completed-compass", name: "The Maple Compass", vi: "La bàn Maple hoàn chỉnh", emoji: "🧭" }, // Ch8 (phụ)
];

const S01_CHAPTERS: AdventureChapter[] = [
  /* ---------------- Chapter 1 — The Message at the Harbour ---------------- */
  // Ảnh: Maple cầm bưu thiếp; mặt cầu cảng ướt bóng; thùng gỗ có lá phong đỏ (góc phải);
  // phà + nhân viên bến cảng phía sau. KHÔNG có bảng tin.
  {
    id: "s01-ch01", seasonId: "s01", chapterNumber: 1,
    title: "The Message at the Harbour", vi: "Lời nhắn ở bến cảng",
    shortDescription: "Maple tìm được một tấm bưu thiếp ướt ở bến cảng — manh mối đầu tiên về chiếc la bàn của ông.",
    estimatedMinutes: 5,
    node: { x: 15, y: 70, key: "harbour-message" },
    sceneImage: A + "chapters/chapter-01-harbour-message.webp",
    nextChapterId: "s01-ch02",
    reward: { stars: 3, itemId: "wet-postcard", clueTitle: "Wet Postcard", clueVi: "Tấm bưu thiếp ướt in hình một chiếc phà — chỉ đường tới bến phà." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "It is a bright morning at the harbour. The wooden boards are still wet and shiny from the rain.",
        vi: "Buổi sáng nắng đẹp ở bến cảng. Sàn gỗ vẫn còn ướt bóng sau cơn mưa." },
      { kind: "dialogue", who: "maple", en: "Grandpa's compass is gone. His letter said to begin here, by the water. I found this old postcard on the bench.",
        vi: "La bàn của ông biến mất. Lá thư của ông dặn hãy bắt đầu ở đây, bên bến nước. Mình vừa nhặt được tấm bưu thiếp cũ này trên ghế." },
      { kind: "observation",
        prompt: "Near the boy on the right, a wooden crate stands on the dock. What symbol is printed on it?",
        vi: "Cạnh cậu bé bên phải có một chiếc thùng gỗ. Trên thùng in biểu tượng gì?",
        options: [
          { label: "A red maple leaf", correct: true, feedback: "Đúng rồi! Chiếc lá phong đỏ — chính là dấu hiệu bí mật của ông Maple. Hãy để ý biểu tượng này." },
          { label: "A blue star", correct: false, feedback: "Nhìn lại nhé — trên thùng là một chiếc lá, không phải ngôi sao." },
          { label: "A yellow sun", correct: false, feedback: "Chưa đúng — đó là hình một chiếc lá màu đỏ." },
        ] },
      { kind: "multipleChoice",
        prompt: "The postcard in Maple's hands shows a photo of a ferry crossing the water. What is the clue telling the group to do?",
        vi: "Tấm bưu thiếp trên tay Maple in hình một chiếc phà đang băng qua mặt nước. Manh mối muốn cả nhóm làm gì?",
        options: ["Go to the ferry dock", "Buy a new camera", "Wait here until dark"],
        answer: "Go to the ferry dock",
        explainVi: "Hình chiếc phà trên bưu thiếp gợi ý điểm đến tiếp theo là bến phà." },
      { kind: "arrangeSentence",
        prompt: "Maple asks the harbour worker for directions. Put the words in order:",
        vi: "Maple hỏi đường người nhân viên bến cảng. Hãy xếp các từ thành câu:",
        solution: ["Where", "do", "the", "ferries", "leave", "from"],
        say: "Where do the ferries leave from?",
        explainVi: "\"Where\" dùng để hỏi nơi chốn — hỏi những chuyến phà rời bến từ đâu." },
      { kind: "clueReveal", title: "Wet Postcard", itemId: "wet-postcard",
        en: "The group keeps the wet postcard safe. Its ferry photo points them to the ferry terminal across the harbour.",
        vi: "Cả nhóm cất kỹ tấm bưu thiếp ướt. Hình chiếc phà trên đó dẫn họ tới bến phà bên kia cảng." },
    ],
  },

  /* ---------------- Chapter 2 — The Wrong Ferry ---------------- */
  // Ảnh: cổng XANH DƯƠNG (trái) và cổng ĐỎ (phải); phà xanh và phà đỏ-cam; vé trong tay bạn gái
  // có icon phà; nhân viên phà nữ. KHÔNG có chữ "Ferry A"/"Pine Island" trong ảnh.
  {
    id: "s01-ch02", seasonId: "s01", chapterNumber: 2,
    title: "The Wrong Ferry", vi: "Nhầm chuyến phà",
    shortDescription: "Hai chuyến phà cùng rời bến. Nhóm bạn phải nhìn màu sắc và hỏi cho chắc để không đi nhầm.",
    estimatedMinutes: 6,
    node: { x: 49, y: 79, key: "wrong-ferry" },
    sceneImage: A + "chapters/chapter-02-wrong-ferry.webp",
    nextChapterId: "s01-ch03",
    reward: { stars: 3, itemId: "ferry-ticket", clueTitle: "Ferry Ticket", clueVi: "Tấm vé phà đúng chuyến đi đảo Pine, nơi có con đường rừng." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "Inside the ferry terminal, two ferries wait by two big gates. One gate is blue, the other is red.",
        vi: "Trong nhà chờ bến phà, hai chuyến phà đợi bên hai cổng lớn. Một cổng màu xanh dương, cổng kia màu đỏ." },
      { kind: "dialogue", who: "stranger", name: "Ferry worker", en: "Listen carefully: the ferry at the blue gate sails to Pine Island. The red gate ferry goes back to the city.",
        vi: "Nghe kỹ nhé: chuyến phà ở cổng xanh đi đảo Pine. Phà ở cổng đỏ thì quay về thành phố." },
      { kind: "observation",
        prompt: "From far away, how can the group tell the two ferries apart?",
        vi: "Từ xa, nhóm bạn có thể phân biệt hai chuyến phà bằng cách nào?",
        options: [
          { label: "By their colours — one ferry is blue, the other is red", correct: true, feedback: "Chính xác! Không cần đọc chữ — chỉ cần nhìn màu là phân biệt được hai phà." },
          { label: "By reading the names painted on them", correct: false, feedback: "Trong tranh không thấy rõ tên nào cả — hãy dựa vào màu sắc." },
          { label: "They look exactly the same", correct: false, feedback: "Không đâu — một phà xanh, một phà đỏ, rất khác nhau." },
        ] },
      { kind: "multipleChoice",
        prompt: "The girl's ticket shows a small blue ferry. The worker said the blue gate goes to Pine Island. What does this tell the group?",
        vi: "Tấm vé của bạn gái in hình một chiếc phà xanh nhỏ. Nhân viên bảo cổng xanh đi đảo Pine. Điều này cho nhóm biết gì?",
        options: ["Their ferry is the blue one at the blue gate", "They should take the red ferry", "Their ticket is for a train"],
        answer: "Their ferry is the blue one at the blue gate",
        explainVi: "Ghép hai manh mối: vé màu xanh + cổng xanh đi Pine → chọn phà xanh." },
      { kind: "arrangeSentence",
        prompt: "Maple checks once more with the worker. Put the words in order:",
        vi: "Maple hỏi lại nhân viên cho chắc. Hãy xếp các từ:",
        solution: ["Is", "this", "the", "ferry", "to", "Pine", "Island"],
        say: "Is this the ferry to Pine Island?",
        explainVi: "Câu hỏi Yes/No bắt đầu bằng \"Is\" khi hỏi về \"this ferry\"." },
      { kind: "clueReveal", title: "Ferry Ticket", itemId: "ferry-ticket",
        en: "The worker stamps the group's ticket for the blue ferry. It carries them to Pine Island, where a forest trail begins.",
        vi: "Nhân viên đóng dấu vé cho nhóm lên phà xanh. Chuyến phà đưa họ tới đảo Pine, nơi một con đường rừng bắt đầu." },
    ],
  },

  /* ---------------- Chapter 3 — Footprints in the Forest ---------------- */
  // Ảnh: dấu chân THÚ (paw) trái, dấu GIÀY người giữa, vết BÁNH XE ĐẠP cong; bản đồ vẽ tay
  // trên tay bạn gái; dải ruy-băng XANH gần cầu; cột gỗ khắc lá phong + cầu gỗ; nhà gỗ phía xa.
  {
    id: "s01-ch03", seasonId: "s01", chapterNumber: 3,
    title: "Footprints in the Forest", vi: "Dấu chân trong rừng",
    shortDescription: "Trên đảo Pine, nhóm bạn dùng bản đồ vẽ tay để phân biệt các dấu vết dẫn tới căn nhà gỗ.",
    estimatedMinutes: 6,
    node: { x: 27, y: 43, key: "forest-footprints" },
    sceneImage: A + "chapters/chapter-03-forest-footprints.webp",
    nextChapterId: "s01-ch04",
    reward: { stars: 3, itemId: "forest-map", clueTitle: "Forest Map", clueVi: "Bản đồ vẽ tay cùng dấu giày và ruy-băng xanh đều chỉ về căn nhà gỗ." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "The forest is cool and quiet. At the trailhead, the group picked up a hand-drawn map with a leaf, some footprints, a paw and a bicycle drawn on it.",
        vi: "Khu rừng mát và yên tĩnh. Ở đầu đường mòn, nhóm bạn nhặt được một tấm bản đồ vẽ tay có hình chiếc lá, vài dấu chân, một dấu chân thú và một chiếc xe đạp." },
      { kind: "observation",
        prompt: "Three different tracks cross the ground. Which set was made by a person's shoes?",
        vi: "Có ba loại dấu vết khác nhau trên mặt đất. Dấu nào là của giày một người?",
        options: [
          { label: "The boot prints in the middle of the path", correct: true, feedback: "Đúng! Dấu giày (boot prints) ở giữa lối đi là của một người." },
          { label: "The small paw prints on the left", correct: false, feedback: "Đó là dấu chân thú (paw prints), không phải của người." },
          { label: "The long curved bicycle track", correct: false, feedback: "Đó là vết bánh xe đạp — do một chiếc xe để lại, không phải bàn chân." },
        ] },
      { kind: "multipleChoice",
        prompt: "Near the wooden bridge, the group spots a bright blue ribbon tied by the path. What is it most likely for?",
        vi: "Gần cây cầu gỗ, nhóm thấy một dải ruy-băng xanh buộc bên đường. Nó có thể dùng để làm gì?",
        options: ["A marker to show the way", "A lost hair tie that means nothing", "A snake hiding in the grass"],
        answer: "A marker to show the way",
        explainVi: "Ruy-băng buộc bên đường thường là dấu chỉ đường (a trail marker) để không bị lạc." },
      { kind: "arrangeSentence",
        prompt: "The group follows the shoe prints. Put Maple's question in order:",
        vi: "Nhóm bạn lần theo dấu giày. Hãy xếp câu hỏi của Maple:",
        solution: ["Where", "do", "these", "footprints", "lead"],
        say: "Where do these footprints lead?",
        explainVi: "\"Where\" hỏi nơi chốn — những dấu chân này dẫn tới đâu." },
      { kind: "dialogue", who: "maple", en: "The boot prints, the blue ribbon and the map all point the same way — to the little wooden cabin.",
        vi: "Dấu giày, dải ruy-băng xanh và tấm bản đồ đều chỉ về một hướng — căn nhà gỗ nhỏ." },
      { kind: "clueReveal", title: "Forest Map", itemId: "forest-map",
        en: "The hand-drawn forest map now clearly marks a little cabin across the bridge. That is where the group heads next.",
        vi: "Tấm bản đồ rừng vẽ tay giờ đánh dấu rõ một căn nhà gỗ nhỏ bên kia cầu. Đó là nơi nhóm bạn tới tiếp theo." },
    ],
  },

  /* ---------------- Chapter 4 — The Cabin Clue ---------------- */
  // Ảnh: trong nhà gỗ; bạn gái nghiêng BỨC TRANH TREO LỆCH để lộ CHÌA KHOÁ ĐỒNG + THẺ BẢO TÀNG;
  // bạn trai với lấy đèn dầu trên kệ (có la bàn tròn, chim gỗ); NGĂN KÉO MỞ; vệt lá phong đỏ + dấu giày trên sàn.
  // Trọng tâm: bằng chứng, must/might/cannot, sắp xếp quan sát, hé lộ LOGIC BA MẢNH LA BÀN.
  {
    id: "s01-ch04", seasonId: "s01", chapterNumber: 4,
    title: "The Cabin Clue", vi: "Manh mối trong căn nhà gỗ",
    shortDescription: "Trong căn nhà gỗ, nhóm bạn tìm chìa khoá đồng và biết được bí mật: chiếc la bàn đã bị chia làm ba mảnh.",
    estimatedMinutes: 7,
    node: { x: 59, y: 58, key: "cabin-clue" },
    sceneImage: A + "chapters/chapter-04-cabin-clue.webp",
    nextChapterId: "s01-ch05",
    reward: { stars: 3, itemId: "museum-key", clueTitle: "Brass Museum Key", clueVi: "Chìa khoá đồng gắn thẻ hình bảo tàng — mở một hiện vật ở bảo tàng hàng hải." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "Inside the dim cabin it is dusty and quiet. A trail of red maple leaves and fresh boot prints crosses the wooden floor.",
        vi: "Trong căn nhà gỗ tối mờ, bụi phủ và tĩnh lặng. Một vệt lá phong đỏ cùng dấu giày còn mới vắt ngang sàn gỗ." },
      { kind: "observation",
        prompt: "The pictures on the wall hang straight — except one, which is tilted. What might that mean?",
        vi: "Các bức tranh trên tường treo ngay ngắn — trừ một bức bị lệch. Điều đó có thể nghĩa là gì?",
        options: [
          { label: "Something could be hidden behind it", correct: true, feedback: "Đúng! Một bức tranh lệch là dấu hiệu (bằng chứng) có thể có gì đó giấu phía sau." },
          { label: "The wall is made of water", correct: false, feedback: "Không hợp lý — tường làm bằng gỗ mà." },
          { label: "It is only decoration and means nothing", correct: false, feedback: "Đừng bỏ qua bằng chứng — một bức lệch bất thường thường có lý do." },
        ] },
      { kind: "multipleChoice",
        prompt: "Behind the tilted picture hangs a brass key on a tag shaped like a museum building. What can the group be sure of?",
        vi: "Sau bức tranh lệch là một chìa khoá đồng gắn thẻ hình toà bảo tàng. Nhóm có thể chắc chắn điều gì?",
        options: ["The key must be for something at the museum", "The key cannot be important at all", "The key is only a toy and means nothing"],
        answer: "The key must be for something at the museum",
        explainVi: "Thẻ hình bảo tàng là bằng chứng mạnh → dùng \"must\" (chắc chắn) cho kết luận: chìa khoá dành cho bảo tàng." },
      { kind: "dialogue", who: "narrator", en: "In the open drawer lies a note in Grandpa's handwriting: \"I separated the compass into three pieces to protect its secret. Find the base, then all three, and make it whole again.\"",
        vi: "Trong ngăn kéo mở có một mảnh giấy nét chữ của ông: \"Ông đã tách chiếc la bàn thành ba mảnh để bảo vệ bí mật của nó. Hãy tìm phần đế, rồi cả ba mảnh, và ghép lại cho hoàn chỉnh.\"" },
      { kind: "arrangeSentence",
        prompt: "The group decides where to go next. Put the words in order:",
        vi: "Nhóm bạn quyết định đi đâu tiếp theo. Hãy xếp các từ:",
        solution: ["We", "must", "go", "to", "the", "museum", "next"],
        say: "We must go to the museum next.",
        explainVi: "\"must\" thể hiện điều chắc chắn cần làm — bước tiếp theo là tới bảo tàng." },
      { kind: "clueReveal", title: "Brass Museum Key", itemId: "museum-key",
        en: "The group takes the brass key with its museum tag. Grandpa's compass is in three pieces — the search for the first piece leads to the maritime museum.",
        vi: "Nhóm cầm theo chìa khoá đồng cùng chiếc thẻ bảo tàng. La bàn của ông đang ở dạng ba mảnh — hành trình tìm mảnh đầu tiên dẫn tới bảo tàng hàng hải." },
    ],
  },

  /* ---------------- Chapter 5 — The Museum Mystery ---------------- */
  // Ảnh: bảo tàng hàng hải, xương cá voi treo trần; Maple dùng chìa mở RƯƠNG lộ MẢNH TAM GIÁC VÀNG;
  // bạn gái cầm ảnh nhà gỗ; bạn trai chỉ DÃY 3 MÔ HÌNH HẢI ĐĂNG có MŨI TÊN ĐỎ; tranh hải đăng bão.
  // Trọng tâm: so sánh vật thể, vị trí tương đối, tìm điểm khác, kết luận từ hai manh mối.
  {
    id: "s01-ch05", seasonId: "s01", chapterNumber: 5,
    title: "The Museum Mystery", vi: "Bí ẩn bảo tàng",
    shortDescription: "Chìa khoá đồng mở một chiếc rương ở bảo tàng — bên trong là mảnh la bàn đầu tiên.",
    estimatedMinutes: 7,
    node: { x: 56, y: 29, key: "museum-mystery" },
    sceneImage: A + "chapters/chapter-05-museum-mystery.webp",
    nextChapterId: "s01-ch06",
    reward: { stars: 3, itemId: "compass-piece-01", clueTitle: "Compass Piece 1", clueVi: "Mảnh tam giác vàng đầu tiên — một trong ba mảnh của chiếc la bàn." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "The maritime museum is huge and hushed. A giant whale skeleton hangs overhead, above old ships and brass instruments.",
        vi: "Bảo tàng hàng hải rộng lớn và tĩnh lặng. Một bộ xương cá voi khổng lồ treo trên cao, phía trên những con tàu cũ và dụng cụ đồng." },
      { kind: "dialogue", who: "maple", en: "The brass key fits this old display chest. Let's open it carefully.",
        vi: "Chìa khoá đồng vừa khít chiếc rương trưng bày cũ này. Mình mở ra thật cẩn thận nhé." },
      { kind: "observation",
        prompt: "Three model lighthouses stand in a row. How is one of them different from the other two?",
        vi: "Ba mô hình hải đăng đứng thành hàng. Một cái khác hai cái còn lại ở điểm nào?",
        options: [
          { label: "A small red arrow points to one of them", correct: true, feedback: "Đúng! Một mũi tên đỏ nhỏ chỉ vào một mô hình — đó là điểm khác biệt cần chú ý." },
          { label: "One of them is painted bright pink", correct: false, feedback: "Không phải — cả ba đều không có màu hồng." },
          { label: "They are all exactly the same", correct: false, feedback: "Nhìn kỹ lại: có một mũi tên đỏ chỉ vào một mô hình." },
        ] },
      { kind: "multipleChoice",
        prompt: "The photo from the cabin shows a stormy shore, and the arrow points toward the waterfront outside. Putting these two clues together, where should the group go next?",
        vi: "Bức ảnh từ nhà gỗ chụp một bờ biển đầy bão, còn mũi tên chỉ ra phía bến nước ngoài kia. Ghép hai manh mối lại, nhóm nên đi đâu tiếp theo?",
        options: ["To the stormy waterfront", "Back into the forest", "Up onto the whale skeleton"],
        answer: "To the stormy waterfront",
        explainVi: "Hai manh mối (ảnh bờ biển bão + mũi tên chỉ ra bến nước) cùng dẫn tới một nơi: bến nước." },
      { kind: "arrangeSentence",
        prompt: "Maple describes where the piece is. Put the words in order:",
        vi: "Maple mô tả vị trí của mảnh la bàn. Hãy xếp các từ:",
        solution: ["The", "gold", "piece", "is", "inside", "the", "chest"],
        say: "The gold piece is inside the chest.",
        explainVi: "\"inside\" chỉ vị trí ở BÊN TRONG — mảnh vàng nằm trong rương." },
      { kind: "clueReveal", title: "Compass Piece 1", itemId: "compass-piece-01",
        en: "Inside the chest lies the first golden triangle — one of the three compass pieces! The stormy painting warns of rough weather at the waterfront ahead.",
        vi: "Trong rương là mảnh tam giác vàng đầu tiên — một trong ba mảnh la bàn! Bức tranh bão báo trước thời tiết dữ dội ở bến nước phía trước." },
    ],
  },

  /* ---------------- Chapter 6 — The Stormy Waterfront ---------------- */
  // Ảnh: đêm bão, mưa, sóng, hải âu; Maple cầm mảnh tam giác trong túi nhựa + chỉ tay; bạn gái cầm bản đồ
  // + Ô LỘN NGƯỢC vì gió; bạn trai BUỘC THUYỀN ĐỎ vào cọc; THÙNG GỖ CÓ LÁ PHONG NỔI trên nước; HẢI ĐĂNG chiếu sáng.
  // Trọng tâm: thời tiết, should/shouldn't, nhân–quả, chọn tuyến đường an toàn.
  {
    id: "s01-ch06", seasonId: "s01", chapterNumber: 6,
    title: "The Stormy Waterfront", vi: "Bến nước trong bão",
    shortDescription: "Một cơn bão đêm nổi lên. Nhóm bạn phải chọn cách an toàn để vớt chiếc thùng chứa đế la bàn.",
    estimatedMinutes: 7,
    node: { x: 71, y: 30, key: "stormy-waterfront" },
    sceneImage: A + "chapters/chapter-06-stormy-waterfront.webp",
    nextChapterId: "s01-ch07",
    reward: { stars: 3, itemId: "compass-base", clueTitle: "Compass Base", clueVi: "Phần đế tròn của la bàn — nơi ba mảnh tam giác sẽ được ghép vào." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "A storm has rolled in over the waterfront. Rain pours down, waves crash against the pier, and seagulls cry in the wind.",
        vi: "Một cơn bão ập tới bến nước. Mưa trút xuống, sóng đập vào cầu tàu, và lũ hải âu kêu trong gió." },
      { kind: "observation",
        prompt: "Something is floating in the choppy water near the rocks. What is on the side of the wooden crate?",
        vi: "Có vật gì đó trôi trên mặt nước gợn sóng gần mấy tảng đá. Trên thành chiếc thùng gỗ có gì?",
        options: [
          { label: "A red maple leaf — Grandpa's mark", correct: true, feedback: "Đúng! Lại là chiếc lá phong đỏ — dấu hiệu của ông. Chiếc thùng này quan trọng." },
          { label: "A big yellow smiley face", correct: false, feedback: "Không phải — đó là một chiếc lá phong đỏ." },
          { label: "Nothing at all", correct: false, feedback: "Nhìn kỹ thành thùng: có in một chiếc lá phong đỏ." },
        ] },
      { kind: "multipleChoice",
        prompt: "The waves are crashing over the edge of the pier. To reach the floating crate safely, what should the group do?",
        vi: "Sóng đang tràn qua mép cầu tàu. Để vớt chiếc thùng nổi một cách an toàn, nhóm nên làm gì?",
        options: ["Use the tied-up rowboat and stay low", "Run to the very edge and lean over the rail", "Swim out into the cold, rough sea"],
        answer: "Use the tied-up rowboat and stay low",
        explainVi: "Trong bão nên chọn cách an toàn: dùng chiếc thuyền đã buộc chắc và cúi thấp, không lao ra mép hay bơi ra biển động." },
      { kind: "arrangeSentence",
        prompt: "Maple reminds everyone to be careful. Put the words in order:",
        vi: "Maple nhắc mọi người cẩn thận. Hãy xếp các từ:",
        solution: ["We", "should", "stay", "away", "from", "the", "edge"],
        say: "We should stay away from the edge.",
        explainVi: "\"should\" dùng để khuyên điều nên làm — nên tránh xa mép cầu tàu cho an toàn." },
      { kind: "dialogue", who: "maple", en: "Theo ties the rowboat tightly so it cannot drift away. Then we row out and lift the crate together.",
        vi: "Theo buộc chặt chiếc thuyền để nó không trôi đi. Rồi cả nhóm chèo ra và cùng nhấc chiếc thùng lên." },
      { kind: "clueReveal", title: "Compass Base", itemId: "compass-base",
        en: "Inside the crate sits the round compass base, with three empty triangular slots. Above the rocks, the lighthouse beam sweeps the sea and points the way onward.",
        vi: "Bên trong thùng là phần đế la bàn tròn, với ba khe tam giác còn trống. Trên những tảng đá, luồng sáng hải đăng quét qua mặt biển và chỉ đường đi tiếp." },
    ],
  },

  /* ---------------- Chapter 7 — The Lighthouse Code ---------------- */
  // Ảnh: đỉnh hải đăng, đèn Fresnel; 3 ĐÈN MÀU đỏ–vàng–teal chiếu 3 tia; Maple đặt mảnh tam giác vào
  // ĐẾ TRÒN CÓ 3 KHE; bạn gái cầm bảng MÃ CHẤM–GẠCH (short-short-long); bạn trai xoay VÔ-LĂNG;
  // NGĂN BÍ MẬT MỞ có mảnh tam giác + LÁ PHONG; cửa sổ nhìn ra ĐẢO VƯỜN sáng đèn.
  // Trọng tâm: mẫu/chuỗi, hướng dẫn, câu điều kiện if, giải thích lời giải nhiều bước.
  {
    id: "s01-ch07", seasonId: "s01", chapterNumber: 7,
    title: "The Lighthouse Code", vi: "Mật mã ngọn hải đăng",
    shortDescription: "Trên đỉnh hải đăng, nhóm bạn giải mã ánh sáng và căn ba màu để mở ngăn giấu mảnh la bàn thứ hai.",
    estimatedMinutes: 7,
    node: { x: 84, y: 59, key: "lighthouse-code" },
    sceneImage: A + "chapters/chapter-07-lighthouse-code.webp",
    nextChapterId: "s01-ch08",
    reward: { stars: 3, itemId: "compass-piece-02", extraItemIds: ["pressed-maple-leaf"],
      clueTitle: "Compass Piece 2", clueVi: "Mảnh tam giác thứ hai cùng một chiếc lá phong ép trong ngăn bí mật." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "At the top of the lighthouse, the great lamp glows. On a panel, three coloured lights — red, yellow and teal — shine out over the sea.",
        vi: "Trên đỉnh hải đăng, ngọn đèn lớn toả sáng. Trên một bảng điều khiển, ba đèn màu — đỏ, vàng và teal — chiếu ra mặt biển." },
      { kind: "observation",
        prompt: "Look at the three glass lights on the control panel, from top to bottom. What colours are they?",
        vi: "Nhìn ba đèn kính trên bảng điều khiển, từ trên xuống dưới. Chúng màu gì?",
        options: [
          { label: "Red, yellow and teal", correct: true, feedback: "Đúng! Đỏ ở trên, vàng ở giữa, teal ở dưới — ba màu cần căn cho khớp." },
          { label: "Black, white and grey", correct: false, feedback: "Không phải — hãy nhìn lại ba ô kính sáng màu." },
          { label: "Pink, purple and brown", correct: false, feedback: "Chưa đúng — ba màu là đỏ, vàng và teal." },
        ] },
      { kind: "multipleChoice",
        prompt: "The old logbook shows the lighthouse signal: short – short – long. Which flash pattern matches it?",
        vi: "Cuốn nhật ký cũ ghi tín hiệu hải đăng: ngắn – ngắn – dài. Chuỗi nhấp nháy nào khớp?",
        options: ["Blink · blink · hold  (● ● ▬)", "Hold · hold · hold  (▬ ▬ ▬)", "Blink · blink · blink  (● ● ●)"],
        answer: "Blink · blink · hold  (● ● ▬)",
        explainVi: "\"short\" là nháy nhanh (●), \"long\" là giữ sáng (▬) → ngắn-ngắn-dài là ● ● ▬." },
      { kind: "arrangeSentence",
        prompt: "The group works out the rule. Put the words in order:",
        vi: "Nhóm bạn tìm ra quy tắc. Hãy xếp các từ:",
        solution: ["The", "door", "opens", "if", "we", "match", "the", "colours"],
        say: "The door opens if we match the colours.",
        explainVi: "\"if\" nêu điều kiện: cửa mở NẾU căn khớp ba màu." },
      { kind: "dialogue", who: "maple", en: "Step by step: Theo turns the wheel, we line up red, yellow and teal, and tap the code short-short-long. A hidden compartment clicks open!",
        vi: "Từng bước một: Theo xoay vô-lăng, cả nhóm căn thẳng đỏ, vàng và teal, rồi gõ mã ngắn-ngắn-dài. Một ngăn bí mật bật mở!" },
      { kind: "clueReveal", title: "Compass Piece 2", itemId: "compass-piece-02",
        en: "Inside the compartment are the second golden triangle and a pressed maple leaf. A single beam now points across the water to a hidden garden.",
        vi: "Trong ngăn là mảnh tam giác vàng thứ hai và một chiếc lá phong ép. Một luồng sáng giờ chỉ thẳng qua mặt nước tới một khu vườn bí mật." },
    ],
  },

  /* ---------------- Chapter 8 — The Hidden Garden ---------------- */
  // Ảnh (bản mới, Maple là hải ly): vườn hoàng hôn; BÀN ĐÁ khắc COMPASS ROSE; Maple đặt mảnh tam giác vào
  // ĐẾ CÓ KHE; bạn gái & bạn trai mỗi người cầm một MẢNH TAM GIÁC; LÁ PHONG ĐỎ trên bàn; LÁ THƯ niêm phong; MŨ CỦA ÔNG.
  // Trọng tâm: quá khứ đơn, kể lại hành trình, suy luận từ bằng chứng, thể hiện thành tựu, tóm tắt.
  {
    id: "s01-ch08", seasonId: "s01", chapterNumber: 8,
    title: "The Hidden Garden", vi: "Khu vườn bí mật",
    shortDescription: "Chặng cuối: nhóm bạn ghép ba mảnh vào đế để hoàn thành La bàn Maple, và đọc lá thư của ông.",
    estimatedMinutes: 8,
    node: { x: 84, y: 25, key: "hidden-garden" },
    sceneImage: A + "chapters/chapter-08-hidden-garden.webp",
    reward: { stars: 3, itemId: "compass-piece-03", extraItemIds: ["completed-compass"],
      clueTitle: "The Maple Compass", clueVi: "Mảnh thứ ba khớp vào đế — chiếc La bàn Maple đã hoàn chỉnh." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "At last, the hidden garden glows at sunset. In the middle stands a round stone table carved with a compass rose. Grandpa's hat and a sealed letter rest on it.",
        vi: "Cuối cùng, khu vườn bí mật rực rỡ trong ánh hoàng hôn. Chính giữa là một chiếc bàn đá tròn khắc hình hoa la bàn. Chiếc mũ của ông và một lá thư niêm phong đặt trên bàn." },
      { kind: "dialogue", who: "maple", en: "We found the base and two pieces — and here is the third, right beside Grandpa's hat!",
        vi: "Chúng mình đã tìm được phần đế và hai mảnh — và đây là mảnh thứ ba, ngay cạnh chiếc mũ của ông!" },
      { kind: "observation",
        prompt: "A red maple leaf lies on the stone table. What is carved into the centre of the table to match it?",
        vi: "Một chiếc lá phong đỏ nằm trên bàn đá. Ở giữa bàn có khắc hình gì để khớp với nó?",
        options: [
          { label: "A leaf-shaped hollow and a compass rose", correct: true, feedback: "Đúng! Một chỗ lõm hình lá và hoa la bàn — chiếc lá phong ép vừa khít vào đó." },
          { label: "A picture of a fast racing car", correct: false, feedback: "Không phải — bàn đá khắc hoa la bàn và một chỗ lõm hình lá." },
          { label: "Smooth empty stone with nothing carved", correct: false, feedback: "Nhìn kỹ lại: mặt bàn có hình hoa la bàn được khắc rõ." },
        ] },
      { kind: "multipleChoice",
        prompt: "The group placed all three pieces into the base and the compass glowed. The letter says Grandpa planned every stop. What does this tell Maple?",
        vi: "Cả nhóm đặt cả ba mảnh vào đế và chiếc la bàn phát sáng. Lá thư nói ông đã sắp đặt từng chặng. Điều đó cho Maple biết gì?",
        options: ["Grandpa designed the whole journey as a final challenge for her", "The compass was never real", "They took the wrong path the whole time"],
        answer: "Grandpa designed the whole journey as a final challenge for her",
        explainVi: "Bằng chứng (mọi chặng đều được sắp đặt) + lá thư xác nhận: ông thiết kế hành trình này như một thử thách cuối cho Maple." },
      { kind: "arrangeSentence",
        prompt: "Maple tells the story of what they did. Put the words in order:",
        vi: "Maple kể lại những gì cả nhóm đã làm. Hãy xếp các từ:",
        solution: ["We", "followed", "the", "clues", "and", "finished", "the", "journey"],
        say: "We followed the clues and finished the journey.",
        explainVi: "Quá khứ đơn: followed và finished — kể lại và tóm tắt cả hành trình đã hoàn thành." },
      { kind: "clueReveal", title: "The Maple Compass", itemId: "compass-piece-03",
        en: "The three pieces click into the base and the pressed leaf fits the carving. The Maple Compass is whole again! Grandpa's letter says he built this journey so Maple could find her own way. Season complete.",
        vi: "Ba mảnh khớp vào đế và chiếc lá ép vừa in với hình khắc. Chiếc La bàn Maple đã liền lại! Lá thư của ông viết rằng ông tạo ra hành trình này để Maple tự tìm được đường đi của mình. Hoàn thành mùa." },
    ],
  },
];

export const SEASON_LOST_COMPASS: AdventureSeason = {
  id: "s01",
  title: "The Lost Maple Compass",
  vi: "Chiếc la bàn thất lạc của Maple",
  subtitle: "Dùng vốn tiếng Anh để giải bí ẩn và khám phá những vùng đất mới.",
  mapImage: A + "map/season-01-world-map.webp",
  chapters: S01_CHAPTERS,
  items: S01_ITEMS,
  itemsTagline: "Thu thập manh mối để ghép lại chiếc la bàn của Maple.",
};

/* ============================================================================
 * SEASON 02 — THE SILENT HARBOUR SIGNAL
 * Chiến dịch khoa học cộng đồng: tìm lại phao nghiên cứu Blue 7 mất tín hiệu.
 * Không lặp mô-típ "3 mảnh" của S1 — mỗi chương cho MỘT bằng chứng (thông tin để suy luận).
 * ==========================================================================*/
const B = "/assets/images/adventure/season-02-silent-harbour-signal/";

// 8 bằng chứng, mỗi chương một món (có ảnh evidence nền trong suốt).
const S02_ITEMS: AdventureItem[] = [
  { id: "research-station-token", name: "Research Station Token", vi: "Thẻ đồng trạm nghiên cứu", emoji: "🪙", image: B + "items/research-station-token.webp" }, // Ch1
  { id: "blue-7-record", name: "Blue 7 Record", vi: "Bản ghi của Blue 7", emoji: "📼", image: B + "items/blue-7-record.webp" },                          // Ch2
  { id: "harbour-photograph", name: "Harbour Photograph", vi: "Tấm ảnh bến cảng", emoji: "🖼️", image: B + "items/harbour-photograph.webp" },            // Ch3
  { id: "tide-route-map", name: "Tide Route Map", vi: "Bản đồ hướng thuỷ triều", emoji: "🗺️", image: B + "items/tide-route-map.webp" },                 // Ch4
  { id: "radio-bearing", name: "Radio Bearing", vi: "Phương vị sóng radio", emoji: "📡", image: B + "items/radio-bearing.webp" },                        // Ch5
  { id: "broken-anchor-clip", name: "Broken Anchor Clip", vi: "Móc neo gãy", emoji: "⚓", image: B + "items/broken-anchor-clip.webp" },                   // Ch6
  { id: "recovered-blue-7", name: "Recovered Blue 7", vi: "Phao Blue 7 được cứu", emoji: "🛟", image: B + "items/recovered-blue-7.webp" },                // Ch7
  { id: "harbour-listener-badge", name: "Harbour Listener Badge", vi: "Huy hiệu Người nghe bến cảng", emoji: "🎖️", image: B + "items/harbour-listener-badge.webp" }, // Ch8
];

const S02_CHAPTERS: AdventureChapter[] = [
  /* ---------------- Chapter 1 — The Letter That Hummed ---------------- */
  // Ảnh: vườn hoàng hôn, bàn đá khắc hoa la bàn; Maple cầm PHONG BÌ niêm phong (đưa tay lên tai nghe);
  // trên bàn: ĐỒNG XU/THẺ ĐỒNG, TẤM THẺ GẤP in 3 CHIẾC ĐỒNG HỒ (3 mốc giờ), MÁY GHI ÂM phát sáng xanh.
  {
    id: "s02-ch01", seasonId: "s02", chapterNumber: 1,
    title: "The Letter That Hummed", vi: "Lá thư ngân nga",
    shortDescription: "Maple mở lá thư niêm phong từ Khu vườn bí mật. Một máy ghi âm phát ra chuỗi tín hiệu lạ trộn nhiều âm thanh.",
    estimatedMinutes: 6,
    node: { x: 12, y: 67, key: "letter-hummed" },
    sceneImage: B + "chapters/chapter-01-letter-that-hummed.webp",
    nextChapterId: "s02-ch02",
    reward: { stars: 3, itemId: "research-station-token", clueTitle: "Research Station Token", clueVi: "Thẻ đồng khắc dấu — chỉ đường tới một trạm nghiên cứu hải dương." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "In the Hidden Garden, Maple opens the sealed letter she found at the end of her last journey.",
        vi: "Trong Khu vườn bí mật, Maple mở lá thư niêm phong em tìm được ở cuối hành trình trước." },
      { kind: "dialogue", who: "maple", en: "There's a brass token, a card with three times, and a small recorder. The note says: \"Some messages are not written. They are heard.\"",
        vi: "Có một thẻ đồng, một tấm thẻ ghi ba mốc giờ, và một máy ghi âm nhỏ. Mảnh giấy viết: \"Có những lời nhắn không được viết ra. Chúng được lắng nghe.\"" },
      { kind: "observation",
        prompt: "On the stone table, which object shows three different times?",
        vi: "Trên bàn đá, vật nào ghi ba mốc giờ khác nhau?",
        options: [
          { label: "The folded card printed with three clocks", correct: true, feedback: "Đúng rồi! Tấm thẻ gấp in ba mặt đồng hồ — ba mốc giờ quan trọng." },
          { label: "The brass token", correct: false, feedback: "Thẻ đồng chỉ khắc một dấu hiệu, không ghi giờ." },
          { label: "The glowing recorder", correct: false, feedback: "Máy ghi âm phát ra âm thanh, nhưng không hiển thị ba mốc giờ." },
        ] },
      { kind: "multipleChoice",
        prompt: "The recorder plays a boat engine, crying seagulls, and a deep call. Which sound comes from UNDER the water?",
        vi: "Máy ghi phát tiếng động cơ thuyền, tiếng hải âu kêu, và một tiếng gọi trầm. Âm thanh nào đến từ DƯỚI nước?",
        options: ["The deep underwater call", "The seagulls crying", "The boat engine"],
        answer: "The deep underwater call",
        explainVi: "Tiếng động cơ và hải âu ở TRÊN mặt nước; chỉ tiếng gọi trầm vọng lên là từ DƯỚI nước." },
      { kind: "arrangeSentence",
        prompt: "Maple describes what she hears. Put the words in order:",
        vi: "Maple tả điều em nghe được. Hãy xếp các từ:",
        solution: ["I", "can", "hear", "a", "call", "under", "the", "water"],
        say: "I can hear a call under the water.",
        explainVi: "\"I can hear...\" dùng để nói điều mình NGHE thấy — một tiếng gọi ở dưới nước." },
      { kind: "clueReveal", title: "Research Station Token", itemId: "research-station-token",
        en: "The brass token is marked with a wave symbol. It points the group to a marine research station across the harbour.",
        vi: "Thẻ đồng khắc biểu tượng sóng nước. Nó chỉ cả nhóm tới một trạm nghiên cứu hải dương bên kia bến cảng." },
    ],
  },

  /* ---------------- Chapter 2 — The Missing Buoy ---------------- */
  // Ảnh: trạm nghiên cứu, cửa kính nhìn ra cảng Vancouver; Dr. Maya Chen (áo teal, logo sóng);
  // bàn có HẢI ĐỒ (Maple chỉ điểm đỏ), 3 THIẾT BỊ GHI có màn sóng, 3 TẤM ẢNH PHAO, SỔ NHẬT KÝ bảo trì;
  // màn hình tường: đồ thị sóng + biểu tượng MÂY MƯA (bão).
  {
    id: "s02-ch02", seasonId: "s02", chapterNumber: 2,
    title: "The Missing Buoy", vi: "Chiếc phao mất tích",
    shortDescription: "Ở trạm nghiên cứu, Dr. Chen kể phao Blue 7 ngừng phát sau bão. Nhóm tìm ra nó vẫn phát một tín hiệu cuối.",
    estimatedMinutes: 7,
    node: { x: 36, y: 34, key: "missing-buoy" },
    sceneImage: B + "chapters/chapter-02-missing-buoy.webp",
    nextChapterId: "s02-ch03",
    reward: { stars: 3, itemId: "blue-7-record", clueTitle: "Blue 7 Record", clueVi: "Bản ghi cuối của Blue 7 — bằng chứng cho thấy nó vẫn trôi và vẫn phát sau bão." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Dr. Maya Chen", en: "Welcome. Blue 7 is a research buoy. It records ocean sounds — but it stopped transmitting right after the storm.",
        vi: "Chào các em. Blue 7 là một chiếc phao nghiên cứu. Nó ghi lại âm thanh đại dương — nhưng đã ngừng phát tín hiệu ngay sau cơn bão." },
      { kind: "observation",
        prompt: "Three photos of buoys lie on the table. How is one buoy different from the others?",
        vi: "Ba tấm ảnh phao đặt trên bàn. Một chiếc phao khác hai chiếc kia ở điểm nào?",
        options: [
          { label: "One buoy is leaning over, the others stand straight", correct: true, feedback: "Đúng! Một chiếc nghiêng hẳn sang bên — chi tiết khác biệt cần chú ý." },
          { label: "One buoy is bright pink", correct: false, feedback: "Không — cả ba chiếc phao đều màu xanh." },
          { label: "All three look exactly the same", correct: false, feedback: "Nhìn kỹ lại: một chiếc đang nghiêng, khác hai chiếc đứng thẳng." },
        ] },
      { kind: "multipleChoice",
        prompt: "The maintenance log shows Blue 7 sent one last signal AFTER the storm ended. What does this tell the group?",
        vi: "Sổ nhật ký cho thấy Blue 7 phát một tín hiệu cuối SAU khi bão tan. Điều này cho nhóm biết gì?",
        options: ["It kept moving and drifted away while still working", "Its battery died during the storm", "Someone turned it off on purpose"],
        answer: "It kept moving and drifted away while still working",
        explainVi: "Nếu còn phát tín hiệu SAU bão thì phao chưa hỏng pin — nhiều khả năng nó vẫn hoạt động và bị trôi đi." },
      { kind: "arrangeSentence",
        prompt: "Maple reads the log aloud. Put the words in order:",
        vi: "Maple đọc to dòng nhật ký. Hãy xếp các từ:",
        solution: ["Blue", "7", "was", "last", "checked", "on", "Friday"],
        say: "Blue 7 was last checked on Friday.",
        explainVi: "Quá khứ đơn \"was checked\" + mốc thời gian \"on Friday\" — kể lại việc đã xảy ra." },
      { kind: "dialogue", who: "maple", en: "So the buoy didn't just break. It floated away — and we can follow where it went.",
        vi: "Vậy là chiếc phao không chỉ bị hỏng. Nó đã trôi đi — và mình có thể lần theo nơi nó tới." },
      { kind: "clueReveal", title: "Blue 7 Record", itemId: "blue-7-record",
        en: "Dr. Chen gives the group a copy of Blue 7's last recording. It proves the buoy drifted while still transmitting.",
        vi: "Dr. Chen đưa nhóm một bản sao bản ghi cuối của Blue 7. Nó chứng minh chiếc phao đã trôi đi khi vẫn còn phát tín hiệu." },
    ],
  },

  /* ---------------- Chapter 3 — Voices at the Market ---------------- */
  // Ảnh: chợ cá bến cảng; Maple cầm SỔ TAY + bút; 3 nhân chứng: NGƯỜI BÁN CÁ (chỉ tay), CÔ CHÈO KAYAK (mái chèo),
  // BẠN CHỤP ẢNH CHIM (máy ảnh, cầm TẤM ẢNH in phao + tháp). Quầy đá có cá. Các nhân chứng chỉ hướng khác nhau.
  {
    id: "s02-ch03", seasonId: "s02", chapterNumber: 3,
    title: "Voices at the Market", vi: "Những lời kể ở khu chợ",
    shortDescription: "Ba nhân chứng đều thấy vật màu xanh trôi qua cảng, nhưng lời kể mâu thuẫn. Một người có tấm ảnh đáng tin hơn.",
    estimatedMinutes: 7,
    node: { x: 54, y: 45, key: "market-voices" },
    sceneImage: B + "chapters/chapter-03-voices-at-the-market.webp",
    nextChapterId: "s02-ch04",
    reward: { stars: 3, itemId: "harbour-photograph", clueTitle: "Harbour Photograph", clueVi: "Tấm ảnh chụp phao gần một tháp cũ — bằng chứng khách quan đáng tin nhất." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "At the fish market, three people saw a blue object drift by. A fish seller, a kayaker, and a young photographer — but their stories disagree.",
        vi: "Ở chợ cá, ba người từng thấy một vật màu xanh trôi qua. Người bán cá, cô chèo kayak, và một bạn chụp ảnh nhỏ — nhưng lời kể của họ mâu thuẫn nhau." },
      { kind: "observation",
        prompt: "Which witness is holding an actual photograph as proof?",
        vi: "Nhân chứng nào đang cầm một tấm ảnh thật để làm bằng chứng?",
        options: [
          { label: "The young photographer with the camera", correct: true, feedback: "Đúng! Bạn nhỏ đeo máy ảnh đang cầm một tấm ảnh chụp phao — bằng chứng nhìn thấy được." },
          { label: "The fish seller pointing away", correct: false, feedback: "Người bán cá chỉ tay và kể lại, nhưng không có ảnh." },
          { label: "The kayaker with the paddle", correct: false, feedback: "Cô chèo kayak cầm mái chèo, không cầm ảnh." },
        ] },
      { kind: "multipleChoice",
        prompt: "The seller and the kayaker disagree about the time and direction. The photo shows the sun and a real landmark. Which clue is most reliable?",
        vi: "Người bán cá và cô kayak kể khác nhau về giờ và hướng. Tấm ảnh lại có mặt trời và một mốc cảnh thật. Manh mối nào đáng tin nhất?",
        options: ["The photograph, because it shows real details", "The loudest voice", "The person who spoke first"],
        answer: "The photograph, because it shows real details",
        explainVi: "Lời kể có thể nhớ nhầm; tấm ảnh cho chi tiết khách quan (vị trí mặt trời, mốc cảnh) nên đáng tin hơn." },
      { kind: "arrangeSentence",
        prompt: "Maple writes down what the kayaker told her. Put the words in order:",
        vi: "Maple ghi lại lời cô chèo kayak. Hãy xếp các từ:",
        solution: ["She", "said", "that", "she", "saw", "a", "blue", "buoy"],
        say: "She said that she saw a blue buoy.",
        explainVi: "Câu tường thuật: \"She said that...\" dùng để kể lại lời người khác." },
      { kind: "clueReveal", title: "Harbour Photograph", itemId: "harbour-photograph",
        en: "The photographer lends the group the photo. It shows Blue 7 near an old tide marker — a solid clue to follow.",
        vi: "Bạn chụp ảnh cho nhóm mượn tấm ảnh. Nó cho thấy Blue 7 gần một cột mốc thuỷ triều cũ — một manh mối chắc chắn để lần theo." },
    ],
  },

  /* ---------------- Chapter 4 — The Library of Tides ---------------- */
  // Ảnh: thư viện cổ, cửa vòm nhìn ra cảng có thuyền buồm; bàn gỗ có HẢI ĐỒ lớn + COMPA đo (tuyến đỏ/xanh + mũi tên),
  // BẢNG TIDE dạng CỘT + đồng hồ, TẤM ẢNH phao xanh gần một hòn đảo; kệ có QUẢ ĐỊA CẦU + MÔ HÌNH THUYỀN.
  {
    id: "s02-ch04", seasonId: "s02", chapterNumber: 4,
    title: "The Library of Tides", vi: "Thư viện thuỷ triều",
    shortDescription: "Dựa vào giờ trong ảnh và hướng thuỷ triều rút, nhóm ước lượng phao đã trôi về phía đảo Pine.",
    estimatedMinutes: 7,
    node: { x: 80, y: 48, key: "library-tides" },
    sceneImage: B + "chapters/chapter-04-library-of-tides.webp",
    nextChapterId: "s02-ch05",
    reward: { stars: 3, itemId: "tide-route-map", clueTitle: "Tide Route Map", clueVi: "Bản đồ đánh dấu hướng thuỷ triều rút — dẫn về đảo Pine." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "In the library, the group spreads out an old current map and a simple tide table next to the photograph.",
        vi: "Trong thư viện, nhóm trải một tấm hải đồ dòng chảy cũ và một bảng thuỷ triều đơn giản cạnh tấm ảnh." },
      { kind: "multipleChoice",
        prompt: "The tide table shows the water level dropping hour by hour. This means the tide was...",
        vi: "Bảng thuỷ triều cho thấy mực nước hạ dần theo từng giờ. Điều đó nghĩa là thuỷ triều đang...",
        options: ["falling", "rising", "staying the same"],
        answer: "falling",
        explainVi: "Mực nước hạ dần = thuỷ triều RÚT (falling). Nước rút sẽ kéo vật trôi ra xa bờ." },
      { kind: "observation",
        prompt: "Three drift routes are drawn on the chart. The falling tide pulled the water toward Pine Island. Which route fits the clues?",
        vi: "Trên hải đồ vẽ ba tuyến trôi. Thuỷ triều rút kéo nước về phía đảo Pine. Tuyến nào khớp với manh mối?",
        options: [
          { label: "The route following the current toward Pine Island", correct: true, feedback: "Đúng! Tuyến đi theo dòng chảy về đảo Pine khớp với hướng nước rút." },
          { label: "The route going back toward the city", correct: false, feedback: "Không hợp lý — nước rút RA xa bờ, không quay lại thành phố." },
          { label: "The route in a small circle", correct: false, feedback: "Dòng chảy đẩy theo một hướng, không xoay vòng tại chỗ." },
        ] },
      { kind: "arrangeSentence",
        prompt: "Maple explains the movement. Put the words in order:",
        vi: "Maple giải thích chuyển động của nước. Hãy xếp các từ:",
        solution: ["The", "water", "was", "falling", "toward", "the", "island"],
        say: "The water was falling toward the island.",
        explainVi: "\"was falling\" (quá khứ tiếp diễn) mô tả nước đang rút về phía hòn đảo lúc đó." },
      { kind: "dialogue", who: "maple", en: "If the tide was falling, Blue 7 drifted this way — out toward Pine Island. That's where we go next.",
        vi: "Nếu thuỷ triều đang rút thì Blue 7 trôi theo hướng này — ra phía đảo Pine. Đó là nơi mình tới tiếp theo." },
      { kind: "clueReveal", title: "Tide Route Map", itemId: "tide-route-map",
        en: "The group marks the drift route on the map. All the clues point to Pine Island.",
        vi: "Nhóm đánh dấu tuyến trôi trên bản đồ. Mọi manh mối đều chỉ về đảo Pine." },
    ],
  },

  /* ---------------- Chapter 5 — The Island Radio ---------------- */
  // Ảnh: đài radio bỏ không trên đảo Pine, chạng vạng, nhìn ra vịnh; Maple đeo TAI NGHE, tay trên MÁY RADIO có 3 ĐỒNG HỒ ĐO
  // (vạch xanh/vàng/đỏ); bạn gái xoay VÔ-LĂNG chỉnh 1 ANTENNA; bạn trai chỉnh ANTENNA thứ 2; có 3 ANTENNA hướng khác nhau.
  {
    id: "s02-ch05", seasonId: "s02", chapterNumber: 5,
    title: "The Island Radio", vi: "Đài radio trên đảo",
    shortDescription: "Một đài radio bỏ không đang lặp lại tín hiệu của phao. Nhóm xoay ba ăng-ten, so cường độ để tìm vịnh phía bắc.",
    estimatedMinutes: 7,
    node: { x: 88, y: 23, key: "island-radio" },
    sceneImage: B + "chapters/chapter-05-island-radio.webp",
    nextChapterId: "s02-ch06",
    reward: { stars: 3, itemId: "radio-bearing", clueTitle: "Radio Bearing", clueVi: "Phương vị của tín hiệu mạnh nhất — chỉ về một vịnh nhỏ phía bắc." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "On Pine Island, an empty radio station keeps repeating Blue 7's signal. But the station is not where the signal starts.",
        vi: "Trên đảo Pine, một đài radio bỏ không cứ lặp lại tín hiệu của Blue 7. Nhưng đài không phải là nơi phát ra tín hiệu." },
      { kind: "multipleChoice",
        prompt: "The station repeats the signal but did not create it. What is a station like this called?",
        vi: "Đài lặp lại tín hiệu nhưng không tạo ra nó. Một đài như vậy gọi là gì?",
        options: ["A relay that passes the signal on", "The real source of the signal", "A broken radio with no use"],
        answer: "A relay that passes the signal on",
        explainVi: "Nơi tạo tín hiệu là \"source\"; đài chỉ chuyển tiếp gọi là \"relay\". Phải tìm nguồn thật, không phải đài." },
      { kind: "observation",
        prompt: "Three antennas face different ways. The radio has three meters: weak, medium and strong. Which antenna points toward the buoy?",
        vi: "Ba ăng-ten hướng khác nhau. Máy radio có ba đồng hồ đo: yếu, vừa, mạnh. Ăng-ten nào chỉ về phía phao?",
        options: [
          { label: "The one with the strongest signal", correct: true, feedback: "Đúng! Tín hiệu MẠNH nhất chỉ đúng hướng có phao nhất." },
          { label: "The one with the weakest signal", correct: false, feedback: "Tín hiệu yếu nghĩa là hướng đó xa nguồn — không phải hướng cần tìm." },
          { label: "Any antenna, they are all the same", correct: false, feedback: "Không — ba đồng hồ chỉ ba mức khác nhau, hãy chọn mức mạnh nhất." },
        ] },
      { kind: "arrangeSentence",
        prompt: "Maple gives the instruction to aim the antenna. Put the words in order:",
        vi: "Maple hướng dẫn chỉnh ăng-ten. Hãy xếp các từ:",
        solution: ["Turn", "the", "antenna", "slowly", "to", "the", "north"],
        say: "Turn the antenna slowly to the north.",
        explainVi: "Câu mệnh lệnh chỉ hướng: \"Turn ... to the north\" — xoay ăng-ten về phía bắc." },
      { kind: "clueReveal", title: "Radio Bearing", itemId: "radio-bearing",
        en: "The strongest signal points to a small bay in the north. The group notes the bearing and heads that way.",
        vi: "Tín hiệu mạnh nhất chỉ về một vịnh nhỏ phía bắc. Nhóm ghi lại phương vị và đi về hướng đó." },
    ],
  },

  /* ---------------- Chapter 6 — The Cave at Low Tide ---------------- */
  // Ảnh: hang biển lúc triều thấp, cửa hang nhìn ra hoàng hôn; Maple + 2 bạn + Dr. Chen đội ĐÈN TRÁN, đi ủng;
  // cúi xem VỆT KÉO LÊ trên cát + GỖ TRÔI tươi; bạn trai cầm KHÚC GỖ TRÔI; dưới đất: MÓC NEO GÃY + MẢNH VỎ NHỰA XANH.
  {
    id: "s02-ch06", seasonId: "s02", chapterNumber: 6,
    title: "The Cave at Low Tide", vi: "Hang biển khi triều rút",
    shortDescription: "Hang chỉ vào được lúc triều thấp. Bên trong chỉ còn móc neo gãy và mảnh vỏ phao — triều lên đã kéo Blue 7 ra lại.",
    estimatedMinutes: 7,
    node: { x: 58, y: 74, key: "cave-low-tide" },
    sceneImage: B + "chapters/chapter-06-cave-at-low-tide.webp",
    nextChapterId: "s02-ch07",
    reward: { stars: 3, itemId: "broken-anchor-clip", clueTitle: "Broken Anchor Clip", clueVi: "Móc neo gãy và vệt kéo lê — bằng chứng Blue 7 đã bị triều kéo ra khỏi hang." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Dr. Maya Chen", en: "This cave is only safe at low tide. We go in together, and we come out before the water returns.",
        vi: "Hang này chỉ an toàn khi triều thấp. Chúng ta vào cùng nhau, và ra ngoài trước khi nước quay lại." },
      { kind: "multipleChoice",
        prompt: "The tide will come back in about an hour. What SHOULD the group do?",
        vi: "Khoảng một tiếng nữa triều sẽ lên lại. Nhóm NÊN làm gì?",
        options: ["Explore with the adult and leave before the tide returns", "Split up and stay as long as they like", "Wait inside until the water rises"],
        answer: "Explore with the adult and leave before the tide returns",
        explainVi: "An toàn là trên hết: đi cùng người lớn và RA trước khi triều lên (\"leave before the tide returns\")." },
      { kind: "observation",
        prompt: "On the cave floor, what does the group find?",
        vi: "Trên nền hang, nhóm tìm thấy gì?",
        options: [
          { label: "A broken anchor clip and a piece of blue casing", correct: true, feedback: "Đúng! Móc neo gãy và một mảnh vỏ nhựa xanh — của Blue 7, nhưng KHÔNG có chiếc phao." },
          { label: "The whole buoy, safe and sound", correct: false, feedback: "Nhìn lại — chỉ có mảnh vỡ; chiếc phao đã không còn ở đây." },
          { label: "A wooden treasure chest", correct: false, feedback: "Đây là câu chuyện khoa học, không phải săn kho báu — chỉ có mảnh vỡ của phao." },
        ] },
      { kind: "multipleChoice",
        prompt: "There are drag marks on the sand and fresh driftwood by the water. What do these clues mean?",
        vi: "Có vệt kéo lê trên cát và gỗ trôi còn mới cạnh mép nước. Những manh mối này nói lên điều gì?",
        options: ["The returning tide pulled Blue 7 back out of the cave", "The buoy was never here at all", "Someone carried the buoy up the cliff"],
        answer: "The returning tide pulled Blue 7 back out of the cave",
        explainVi: "Vệt kéo lê + gỗ trôi mới → nhân quả: triều lên đã kéo Blue 7 trôi ngược ra khỏi hang." },
      { kind: "arrangeSentence",
        prompt: "Maple reminds the team about safety. Put the words in order:",
        vi: "Maple nhắc cả nhóm về an toàn. Hãy xếp các từ:",
        solution: ["We", "must", "leave", "before", "the", "tide", "comes", "back"],
        say: "We must leave before the tide comes back.",
        explainVi: "\"must\" + \"before\" nêu điều bắt buộc: phải rời đi TRƯỚC khi triều lên lại." },
      { kind: "clueReveal", title: "Broken Anchor Clip", itemId: "broken-anchor-clip",
        en: "The group keeps the broken anchor clip. The drag marks show Blue 7 left the cave with the returning tide.",
        vi: "Nhóm giữ lại chiếc móc neo gãy. Vệt kéo lê cho thấy Blue 7 đã rời hang cùng con nước lên." },
    ],
  },

  /* ---------------- Chapter 7 — Signal in the Storm ---------------- */
  // Ảnh: bến tàu cũ trong mưa bão, đêm; Maple cầm BỘ ĐÀM (đang nói); bạn gái giữ HẢI ĐỒ trên giá; bạn trai nhìn ỐNG NHÒM;
  // Dr. Chen cầm bộ đàm; ngoài biển động: THUYỀN CỨU HỘ có 2 người ÁO PHAO CAM; PHAO "7" mắc cạnh BÈ GỖ/gỗ trôi gần chân bến.
  {
    id: "s02-ch07", seasonId: "s02", chapterNumber: 7,
    title: "Signal in the Storm", vi: "Tín hiệu trong bão",
    shortDescription: "Mưa bão ập tới. Maple thấy Blue 7 mắc kẹt gần bến tàu cũ và đọc vị trí qua bộ đàm để đội cứu hộ vớt lên an toàn.",
    estimatedMinutes: 7,
    node: { x: 71, y: 16, key: "storm-signal" },
    sceneImage: B + "chapters/chapter-07-signal-in-the-storm.webp",
    nextChapterId: "s02-ch08",
    reward: { stars: 3, itemId: "recovered-blue-7", clueTitle: "Recovered Blue 7", clueVi: "Blue 7 được đội cứu hộ vớt lên an toàn nhờ chỉ dẫn rõ ràng của Maple." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "Rain and wind arrive early. From a safe railing, Maple spots Blue 7 tangled in driftwood near the old pier.",
        vi: "Mưa và gió ập tới sớm. Từ lan can an toàn, Maple phát hiện Blue 7 mắc trong đám gỗ trôi gần bến tàu cũ." },
      { kind: "observation",
        prompt: "Where is Blue 7 stuck?",
        vi: "Blue 7 đang mắc kẹt ở đâu?",
        options: [
          { label: "Tangled in the driftwood near the old pier", correct: true, feedback: "Đúng! Chiếc phao số 7 mắc trong đám gỗ trôi ngay cạnh bến tàu cũ." },
          { label: "Far out in the open sea", correct: false, feedback: "Không — nó ở gần bến tàu, không phải ngoài khơi xa." },
          { label: "High up on the dry beach", correct: false, feedback: "Nhìn lại — phao còn ở dưới nước, mắc vào gỗ trôi cạnh bến." },
        ] },
      { kind: "multipleChoice",
        prompt: "Maple must tell the rescue crew exactly where the buoy is. Which is the CLEAR instruction?",
        vi: "Maple phải báo đội cứu hộ chính xác vị trí phao. Câu chỉ dẫn nào RÕ RÀNG?",
        options: ["It's near the pier, tangled in the driftwood on the right", "It's over there somewhere", "Just go and find it"],
        answer: "It's near the pier, tangled in the driftwood on the right",
        explainVi: "Chỉ dẫn rõ cần vị trí cụ thể (gần bến, trong gỗ trôi, bên phải) — không nói mơ hồ \"đâu đó\"." },
      { kind: "dialogue", who: "maple", en: "Radio check: \"Do you mean the wooden pier on the left?\" — Yes. Move the boat closer to the pier, slowly.",
        vi: "Hỏi lại qua bộ đàm: \"Ý cô là bến gỗ bên trái phải không?\" — Đúng. Cho thuyền tiến lại gần bến, thật chậm." },
      { kind: "arrangeSentence",
        prompt: "Maple guides the rescue boat. Put the words in order:",
        vi: "Maple hướng dẫn thuyền cứu hộ. Hãy xếp các từ:",
        solution: ["Move", "the", "boat", "closer", "to", "the", "pier"],
        say: "Move the boat closer to the pier.",
        explainVi: "\"Move ... closer to ...\" là mẫu câu chỉ hướng di chuyển lại gần một điểm." },
      { kind: "clueReveal", title: "Recovered Blue 7", itemId: "recovered-blue-7",
        en: "Following Maple's clear directions, the trained crew lifts Blue 7 safely from the water. The buoy is found at last!",
        vi: "Nhờ chỉ dẫn rõ ràng của Maple, đội cứu hộ được huấn luyện vớt Blue 7 lên an toàn. Cuối cùng cũng tìm được chiếc phao!" },
    ],
  },

  /* ---------------- Chapter 8 — The Song Beneath the Harbour ---------------- */
  // Ảnh: trở lại trạm, hoàng hôn; Maple cầm BẢNG BẰNG CHỨNG (ảnh bến, 3 LỚP SÓNG đỏ/vàng/xanh, mảnh bản đồ, hoa la bàn, móc neo);
  // 2 bạn ĐEO TAI NGHE; Dr. Chen cầm HUY HIỆU tròn khắc sóng; giữa bàn: PHAO "7" nối cáp, đèn xanh sáng; màn hình 3 LỚP SÓNG;
  // ngoài cửa: PHAO + ĐÀN CÁ VOI ORCA bơi qua lúc hoàng hôn.
  {
    id: "s02-ch08", seasonId: "s02", chapterNumber: 8,
    title: "The Song Beneath the Harbour", vi: "Bài ca dưới lòng cảng",
    shortDescription: "Chặng cuối: nhóm khôi phục Blue 7, tách ba lớp âm thanh trong bản ghi, và kể lại toàn bộ hành trình.",
    estimatedMinutes: 8,
    node: { x: 24, y: 31, key: "harbour-song" },
    sceneImage: B + "chapters/chapter-08-song-beneath-the-harbour.webp",
    reward: { stars: 3, itemId: "harbour-listener-badge", clueTitle: "Harbour Listener Badge", clueVi: "Huy hiệu Người nghe bến cảng — phần thưởng cho việc giải xong bí ẩn bằng bằng chứng." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "Back at the station, the team replaces Blue 7's battery, reconnects its cable, and downloads the final recording.",
        vi: "Trở lại trạm, cả nhóm thay pin cho Blue 7, nối lại dây cáp, và tải về bản ghi cuối cùng." },
      { kind: "multipleChoice",
        prompt: "The mystery signal was actually THREE sounds mixed together. What were they?",
        vi: "Tín hiệu bí ẩn thực ra là BA âm thanh trộn vào nhau. Đó là những gì?",
        options: [
          "The buoy hitting driftwood, the island radio relay, and an orca call",
          "Three different broken engines",
          "A secret human voice message",
        ],
        answer: "The buoy hitting driftwood, the island radio relay, and an orca call",
        explainVi: "Ba lớp: phao gõ vào gỗ trôi, đài radio chuyển tiếp, và tiếng gọi của đàn cá voi orca — chồng lên nhau." },
      { kind: "observation",
        prompt: "On the screen, three waves are shown. Which one is the orca call?",
        vi: "Trên màn hình có ba dạng sóng. Dạng nào là tiếng gọi của cá voi orca?",
        options: [
          { label: "The smooth, rolling blue wave", correct: true, feedback: "Đúng! Sóng xanh mượt, uốn lượn là tiếng gọi tự nhiên của cá voi orca." },
          { label: "The sharp, jagged red wave", correct: false, feedback: "Sóng đỏ lởm chởm là tiếng phao va vào gỗ trôi — tiếng gõ, không phải cá voi." },
          { label: "The square, stepped yellow wave", correct: false, feedback: "Sóng vàng vuông vức là tín hiệu radio chuyển tiếp — do máy móc tạo ra." },
        ] },
      { kind: "arrangeSentence",
        prompt: "Maple retells the investigation. Put the words in order:",
        vi: "Maple kể lại cuộc điều tra. Hãy xếp các từ:",
        solution: ["The", "most", "important", "clue", "was", "the", "photograph"],
        say: "The most important clue was the photograph.",
        explainVi: "\"The most important clue was...\" — mẫu câu tóm tắt, nhấn mạnh manh mối quan trọng nhất." },
      { kind: "multipleChoice",
        prompt: "What did the whole investigation prove?",
        vi: "Cả cuộc điều tra đã chứng minh điều gì?",
        options: [
          "The signal was never broken — it was three real sounds together",
          "Blue 7 was never real",
          "The orcas were sending a message to Maple",
        ],
        answer: "The signal was never broken — it was three real sounds together",
        explainVi: "Bằng chứng cho thấy tín hiệu \"lạ\" không phải lỗi — đó là ba âm thanh thật chồng lên nhau. Tiếng cá voi là nghiên cứu động vật, không phải lời nhắn cho Maple." },
      { kind: "dialogue", who: "maple", en: "We first found the clues, then we followed the tide, and finally we found Blue 7. Listen — it's recording the harbour again!",
        vi: "Đầu tiên bọn mình tìm manh mối, rồi lần theo thuỷ triều, và cuối cùng tìm ra Blue 7. Nghe kìa — nó lại đang ghi âm bến cảng rồi!" },
      { kind: "clueReveal", title: "Harbour Listener Badge", itemId: "harbour-listener-badge",
        en: "Dr. Chen gives Maple the Harbour Listener Badge. As the orcas pass by, Blue 7 picks up a faint new signal — from the mountains. Season complete.",
        vi: "Dr. Chen trao cho Maple Huy hiệu Người nghe bến cảng. Khi đàn cá voi bơi qua, Blue 7 bắt được một tín hiệu mới mờ nhạt — từ phía những ngọn núi. Hoàn thành mùa." },
    ],
  },
];

export const SEASON_SILENT_SIGNAL: AdventureSeason = {
  id: "s02",
  title: "The Silent Harbour Signal",
  vi: "Tín hiệu lặng của bến cảng",
  subtitle: "Lắng nghe, so sánh manh mối và suy luận để tìm lại chiếc phao nghiên cứu Blue 7.",
  mapImage: B + "map/season-02-world-map.webp",
  chapters: S02_CHAPTERS,
  items: S02_ITEMS,
  itemsTagline: "Thu thập bằng chứng để tìm lại phao nghiên cứu Blue 7.",
};

export const SEASONS: AdventureSeason[] = [SEASON_LOST_COMPASS, SEASON_SILENT_SIGNAL];
export const seasonById = (id: string) => SEASONS.find((s) => s.id === id);
export const chapterById = (seasonId: string, chapterId: string) =>
  seasonById(seasonId)?.chapters.find((c) => c.id === chapterId);
export const itemById = (season: AdventureSeason, id: string) => season.items.find((i) => i.id === id);

/* ---------- Trạng thái hiển thị của một node trên bản đồ ---------- */
export type ChapterUiState = "locked" | "available" | "inProgress" | "completed";

// Một chương "chơi được" là chương đã có storySteps.
export const chapterPlayable = (ch: AdventureChapter) => Array.isArray(ch.storySteps) && ch.storySteps.length > 0;

// Suy ra trạng thái từng chương theo tiến độ Adventure (mở khoá tuần tự).
// completed: đã hoàn thành · available: mở & chơi được · inProgress: đang là chương hiện tại chưa xong ·
// locked: chưa mở HOẶC đã mở nhưng chưa có nội dung (coming soon) → không chơi được.
export function chapterStatesFor(
  season: AdventureSeason,
  isCompleted: (chapterId: string) => boolean,
  currentChapterId?: string,
): ChapterUiState[] {
  let prevDone = true; // chương đầu luôn mở
  return season.chapters.map((ch) => {
    const done = isCompleted(ch.id);
    const unlocked = prevDone;
    prevDone = done;
    if (done) return "completed";
    if (!unlocked) return "locked";
    // đã mở khoá nhưng chưa có nội dung → coi như locked (coming soon) để không chơi giả
    if (!chapterPlayable(ch)) return "locked";
    return ch.id === currentChapterId ? "inProgress" : "available";
  });
}

// Chương nên gợi ý chơi tiếp: chương available/inProgress đầu tiên (chưa hoàn thành, chơi được).
export function resumeChapter(
  season: AdventureSeason,
  isCompleted: (chapterId: string) => boolean,
  currentChapterId?: string,
): AdventureChapter | undefined {
  const states = chapterStatesFor(season, isCompleted, currentChapterId);
  const idx = season.chapters.findIndex((_, i) => states[i] === "available" || states[i] === "inProgress");
  return idx >= 0 ? season.chapters[idx] : undefined;
}
