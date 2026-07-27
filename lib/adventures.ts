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

/* ============================================================================
 * SEASON 03 — THE SKY GARDEN CHALLENGE
 * Thử thách THIẾT KẾ (không phải bí ẩn): thiết kế – thử – chỉnh – khánh thành
 * một khu vườn sân thượng phục vụ nhiều nhu cầu cộng đồng. Mỗi chương một bằng chứng.
 * ==========================================================================*/
const C = "/assets/images/adventure/season-03-sky-garden-challenge/";

const S03_ITEMS: AdventureItem[] = [
  { id: "rooftop-survey", name: "Rooftop Survey", vi: "Bản khảo sát sân thượng", emoji: "📋", image: C + "items/rooftop-survey.webp" },              // Ch1
  { id: "combined-garden-plan", name: "Combined Garden Plan", vi: "Bản thiết kế vườn kết hợp", emoji: "🗺️", image: C + "items/combined-garden-plan.webp" }, // Ch2
  { id: "lightweight-planter", name: "Lightweight Planter", vi: "Chậu trồng nhẹ", emoji: "🪴", image: C + "items/lightweight-planter.webp" },           // Ch3
  { id: "rainwater-system", name: "Rainwater System", vi: "Hệ thu nước mưa", emoji: "🛢️", image: C + "items/rainwater-system.webp" },                  // Ch4
  { id: "wind-test-result", name: "Wind Test Result", vi: "Kết quả thử gió", emoji: "🌬️", image: C + "items/wind-test-result.webp" },                  // Ch5
  { id: "sky-garden-builder-badge", name: "Sky Garden Builder Badge", vi: "Huy hiệu Kiến tạo vườn trời", emoji: "🏅", image: C + "items/sky-garden-builder-badge.webp" }, // Ch6
];

const S03_CHAPTERS: AdventureChapter[] = [
  /* ---------------- Chapter 1 — The Empty Rooftop ---------------- */
  // Ảnh: sân thượng trống; cô Rivera cầm bảng ghi; Maple chỉ xuống; Mai cầm máy tính bảng; Kai đo bằng THƯỚC DÂY;
  // cầu thang KÍNH (cửa có biển XE LĂN), tường gạch + cây phong + VÒI NƯỚC ở tường xa, 2 MIỆNG THOÁT NƯỚC, CỜ/DẢI GIÓ bay;
  // bàn gỗ có BẢN VẼ cuộn + bút. Skyline Vancouver.
  {
    id: "s03-ch01", seasonId: "s03", chapterNumber: 1,
    title: "The Empty Rooftop", vi: "Sân thượng trống",
    shortDescription: "Maple cùng Mai, Kai và cô Rivera khảo sát một sân thượng trống để lên kế hoạch làm vườn cho cộng đồng.",
    estimatedMinutes: 6,
    node: { x: 17, y: 70, key: "empty-rooftop" },
    sceneImage: C + "chapters/chapter-01-empty-rooftop.webp",
    nextChapterId: "s03-ch02",
    reward: { stars: 3, itemId: "rooftop-survey", clueTitle: "Rooftop Survey", clueVi: "Bản khảo sát sân thượng: nắng, gió, nước, lối đi — nền tảng cho mọi bản thiết kế." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Cô Rivera", en: "Welcome to the rooftop! Our goal is to design a garden that works for the whole community.",
        vi: "Chào mừng lên sân thượng! Mục tiêu của chúng ta là thiết kế một khu vườn phù hợp cho cả cộng đồng." },
      { kind: "dialogue", who: "maple", en: "Before we plan, let's survey the roof: where is the sun, the wind, the water, and how do people get up here?",
        vi: "Trước khi lên kế hoạch, hãy khảo sát sân thượng: nắng ở đâu, gió thế nào, nước ở đâu, và mọi người lên đây bằng cách nào?" },
      { kind: "observation",
        prompt: "The ribbon on the flagpole is streaming out straight. What does that tell the group?",
        vi: "Dải cờ trên cột đang bay thẳng căng. Điều đó cho nhóm biết gì?",
        options: [
          { label: "It is windy up here", correct: true, feedback: "Đúng! Dải cờ bay căng nghĩa là trên sân thượng có gió — một yếu tố quan trọng cần tính đến." },
          { label: "It is night time", correct: false, feedback: "Không — trời vẫn sáng; dải cờ cho biết về GIÓ, không phải thời gian." },
          { label: "The garden is finished", correct: false, feedback: "Chưa đâu — sân thượng còn trống. Dải cờ chỉ cho biết trời đang có gió." },
        ] },
      { kind: "multipleChoice",
        prompt: "Which of these is an OBSERVATION (a fact you can see), not an opinion?",
        vi: "Câu nào là QUAN SÁT (điều nhìn thấy được), không phải ý kiến?",
        options: ["There are two drains in the floor.", "This is the best rooftop in the world.", "Gardens are boring."],
        answer: "There are two drains in the floor.",
        explainVi: "Quan sát là điều nhìn thấy/đo được (có hai miệng thoát nước). \"Tuyệt nhất\" hay \"chán\" là ý kiến." },
      { kind: "arrangeSentence",
        prompt: "Maple notes where the water is. Put the words in order:",
        vi: "Maple ghi lại vị trí nguồn nước. Hãy xếp các từ:",
        solution: ["There", "is", "a", "tap", "on", "the", "wall"],
        say: "There is a tap on the wall.",
        explainVi: "\"There is …\" + cụm chỉ nơi chốn \"on the wall\" — mô tả có một vòi nước ở trên tường." },
      { kind: "clueReveal", title: "Rooftop Survey", itemId: "rooftop-survey",
        en: "The group records the sun, shade, wind, water, and access. This rooftop survey is the base for every design choice.",
        vi: "Nhóm ghi lại nắng, bóng râm, gió, nước và lối tiếp cận. Bản khảo sát này là nền tảng cho mọi lựa chọn thiết kế." },
    ],
  },

  /* ---------------- Chapter 2 — Three Garden Plans ---------------- */
  // Ảnh: 3 MÔ HÌNH vườn: (trái) vườn RAU có luống + giàn; (giữa) vườn THỤ PHẤN có hoa dại + nhà côn trùng + chong chóng;
  // (phải) vườn ĐỌC SÁCH có ghế dưới mái che + hình người XE LĂN; mô hình GHÉP ở giữa có token màu; thẻ icon (nắng/bướm/ghế); bản vẽ + bút.
  {
    id: "s03-ch02", seasonId: "s03", chapterNumber: 2,
    title: "Three Garden Plans", vi: "Ba bản thiết kế vườn",
    shortDescription: "Nhóm so ba mô hình — vườn rau, vườn thụ phấn, vườn đọc sách — rồi bắt đầu ghép thành một bản kết hợp.",
    estimatedMinutes: 7,
    node: { x: 32, y: 54, key: "three-plans" },
    sceneImage: C + "chapters/chapter-02-three-garden-plans.webp",
    nextChapterId: "s03-ch03",
    reward: { stars: 3, itemId: "combined-garden-plan", clueTitle: "Combined Garden Plan", clueVi: "Bản thiết kế kết hợp điểm mạnh của cả ba mô hình thay vì chọn một." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "On the table sit three model gardens: a food garden with vegetables, a pollinator garden with wildflowers, and a quiet reading garden with a bench.",
        vi: "Trên bàn có ba mô hình vườn: vườn rau, vườn thụ phấn đầy hoa dại, và vườn đọc sách yên tĩnh có ghế ngồi." },
      { kind: "observation",
        prompt: "Which model has a bench under a shade for quiet reading?",
        vi: "Mô hình nào có ghế ngồi dưới mái che để đọc sách yên tĩnh?",
        options: [
          { label: "The reading garden on the right", correct: true, feedback: "Đúng! Mô hình bên phải có ghế dưới mái che — vườn đọc sách." },
          { label: "The food garden with vegetables", correct: false, feedback: "Đó là vườn rau với các luống rau, không có ghế đọc sách." },
          { label: "The pollinator garden with flowers", correct: false, feedback: "Đó là vườn thụ phấn với hoa dại và nhà côn trùng." },
        ] },
      { kind: "multipleChoice",
        prompt: "The food garden needs the most water. The pollinator garden helps bees but has no seating. What should the group do?",
        vi: "Vườn rau cần nhiều nước nhất. Vườn thụ phấn giúp ong nhưng không có chỗ ngồi. Nhóm nên làm gì?",
        options: ["Combine the best parts of each plan", "Pick only one plan and drop the rest", "Cancel the whole garden"],
        answer: "Combine the best parts of each plan",
        explainVi: "Mỗi mô hình có điểm mạnh riêng → kết hợp phần hay nhất của cả ba là giải pháp thoả hiệp tốt nhất." },
      { kind: "arrangeSentence",
        prompt: "Maple compares the plans. Put the words in order:",
        vi: "Maple so sánh các mô hình. Hãy xếp các từ:",
        solution: ["The", "reading", "garden", "is", "quieter", "than", "the", "others"],
        say: "The reading garden is quieter than the others.",
        explainVi: "So sánh hơn: \"quieter than\" (yên tĩnh hơn) — dùng để đối chiếu các lựa chọn." },
      { kind: "dialogue", who: "maple", en: "That's a good idea. However, the food garden needs more water. We could take one bed from each plan.",
        vi: "Ý hay đấy. Tuy nhiên, vườn rau cần nhiều nước hơn. Chúng ta có thể lấy một luống từ mỗi bản thiết kế." },
      { kind: "clueReveal", title: "Combined Garden Plan", itemId: "combined-garden-plan",
        en: "The group starts a combined layout: a few vegetable beds, a strip of pollinator flowers, and a small reading corner.",
        vi: "Nhóm bắt đầu một bản bố cục kết hợp: vài luống rau, một dải hoa thụ phấn, và một góc đọc sách nhỏ." },
    ],
  },

  /* ---------------- Chapter 3 — The Weight Problem ---------------- */
  // Ảnh: chú KỸ SƯ (áo phản quang cam) + cô Rivera + 3 bạn; CÂN THĂNG BẰNG cân khối; CHẬU ĐÁ nặng + BỒN NƯỚC lớn;
  // Maple nhấc chậu bê-tông nặng; Mai cầm TÚI VẢI TRỒNG nhẹ có cây con; Kai đặt CHẬU NHẸ lên mô hình lưới; khối đỏ/xanh + mũi tên phân bổ tải.
  {
    id: "s03-ch03", seasonId: "s03", chapterNumber: 3,
    title: "The Weight Problem", vi: "Bài toán trọng lượng",
    shortDescription: "Chú kỹ sư cảnh báo đất ướt và chậu đá quá nặng cho một vùng mái. Nhóm đổi sang chậu nhẹ và dàn đều tải.",
    estimatedMinutes: 7,
    node: { x: 14, y: 40, key: "weight-problem" },
    sceneImage: C + "chapters/chapter-03-weight-problem.webp",
    nextChapterId: "s03-ch04",
    reward: { stars: 3, itemId: "lightweight-planter", clueTitle: "Lightweight Planter", clueVi: "Chậu trồng nhẹ thay cho chậu đá — an toàn hơn cho sân thượng." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Chú kỹ sư", en: "I checked the model. Wet soil, big stone planters, and a full water tank would be too heavy for this roof zone.",
        vi: "Chú đã kiểm tra mô hình. Đất ướt, chậu đá lớn và bồn nước đầy sẽ quá nặng cho vùng mái này." },
      { kind: "observation",
        prompt: "The engineer weighs a stone planter and a light fabric planter. Which is safer for the roof?",
        vi: "Chú kỹ sư cân một chậu đá và một chậu vải nhẹ. Loại nào an toàn hơn cho mái?",
        options: [
          { label: "The light fabric planter", correct: true, feedback: "Đúng! Chậu vải nhẹ hơn nhiều nên an toàn hơn cho sân thượng." },
          { label: "The heavy stone planter", correct: false, feedback: "Chậu đá quá nặng — đúng thứ khiến mái quá tải." },
          { label: "Both weigh exactly the same", correct: false, feedback: "Không — trên cân, chậu đá trĩu xuống nặng hơn hẳn." },
        ] },
      { kind: "multipleChoice",
        prompt: "When the soil gets wet with rain, what happens to its weight?",
        vi: "Khi đất bị ướt vì mưa, trọng lượng của nó thay đổi thế nào?",
        options: ["It gets heavier", "It gets lighter", "It stays exactly the same"],
        answer: "It gets heavier",
        explainVi: "Nước thấm vào làm đất NẶNG hơn — vì thế phải tính cả lúc đất ướt (nhân–quả)." },
      { kind: "arrangeSentence",
        prompt: "Maple warns the team about safety. Put the words in order:",
        vi: "Maple nhắc cả nhóm về an toàn. Hãy xếp các từ:",
        solution: ["We", "must", "not", "put", "heavy", "pots", "here"],
        say: "We must not put heavy pots here.",
        explainVi: "\"must not\" = tuyệt đối không được — không đặt chậu nặng ở vùng mái yếu." },
      { kind: "dialogue", who: "maple", en: "So we revise the plan: use lightweight planters and spread the load, because the roof is stronger near the walls.",
        vi: "Vậy mình chỉnh lại: dùng chậu nhẹ và dàn đều tải, vì mái chắc hơn ở gần các bức tường." },
      { kind: "clueReveal", title: "Lightweight Planter", itemId: "lightweight-planter",
        en: "The heavy stone pots are swapped for lightweight planters, and the loads are spread across stronger roof areas.",
        vi: "Những chậu đá nặng được thay bằng chậu nhẹ, và tải được dàn ra các vùng mái chắc hơn." },
    ],
  },

  /* ---------------- Chapter 4 — Saving Every Drop ---------------- */
  // Ảnh: ỐNG từ mái kính dẫn vào THÙNG NƯỚC MƯA (xanh) có vòi — Maple mở vòi; Mai chỉnh DÂY NHỎ GIỌT (drip); Kai tưới BÌNH TƯỚI;
  // dưới đất có 4 ỐNG NGHIỆM ĐO ẨM (mực nước/đất khác nhau) + cắm QUE ĐO ẨM màu trong luống.
  {
    id: "s03-ch04", seasonId: "s03", chapterNumber: 4,
    title: "Saving Every Drop", vi: "Tiết kiệm từng giọt",
    shortDescription: "Một vòi nước không đủ tưới cả vườn. Nhóm thử thùng nước mưa, dây nhỏ giọt và bình tưới rồi kết hợp lại.",
    estimatedMinutes: 7,
    node: { x: 71, y: 34, key: "saving-water" },
    sceneImage: C + "chapters/chapter-04-saving-every-drop.webp",
    nextChapterId: "s03-ch05",
    reward: { stars: 3, itemId: "rainwater-system", clueTitle: "Rainwater System", clueVi: "Thùng nước mưa + dây nhỏ giọt, kết hợp tưới tay đúng chỗ." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "The single tap cannot water the whole garden well. The group tests a rain barrel, a drip line, watering cans, and moisture tubes.",
        vi: "Một vòi nước không thể tưới tốt cả vườn. Nhóm thử một thùng nước mưa, một dây nhỏ giọt, bình tưới, và các ống đo độ ẩm." },
      { kind: "observation",
        prompt: "A pipe from the glass roof leads into the green barrel. What is the barrel collecting?",
        vi: "Một ống từ mái kính dẫn vào chiếc thùng xanh. Thùng đang hứng gì?",
        options: [
          { label: "Rainwater from the roof", correct: true, feedback: "Đúng! Ống dẫn nước mưa từ mái vào thùng — nguồn nước miễn phí cho vườn." },
          { label: "Tap water from the wall", correct: false, feedback: "Không — ống nối với MÁI, không phải vòi tường. Đó là nước mưa." },
          { label: "Fruit juice", correct: false, feedback: "Chắc chắn không phải nước ép — đó là nước mưa hứng từ mái." },
        ] },
      { kind: "multipleChoice",
        prompt: "The moisture tubes show the far bed is dry and the near bed is wet. What should they do?",
        vi: "Các ống đo cho thấy luống xa bị KHÔ còn luống gần thì ƯỚT. Nhóm nên làm gì?",
        options: ["Give more water to the dry bed and less to the wet one", "Give the same water to every bed", "Stop watering completely"],
        answer: "Give more water to the dry bed and less to the wet one",
        explainVi: "Tưới THEO nhu cầu: chỗ khô cần nhiều nước hơn (more), chỗ ướt cần ít hơn (less)." },
      { kind: "arrangeSentence",
        prompt: "Maple gives the watering steps. Put the words in order:",
        vi: "Maple hướng dẫn các bước tưới. Hãy xếp các từ:",
        solution: ["First", "fill", "the", "barrel", "then", "water", "the", "plants"],
        say: "First fill the barrel, then water the plants.",
        explainVi: "Từ nối trình tự: \"First … then …\" — làm đầy thùng trước, rồi mới tưới cây." },
      { kind: "dialogue", who: "maple", en: "Let's combine them: the rain barrel and drip line for the far beds, so that water reaches them, and watering cans for the rest.",
        vi: "Mình kết hợp nhé: thùng nước mưa và dây nhỏ giọt cho các luống xa, để nước tới được đó, còn bình tưới cho phần còn lại." },
      { kind: "clueReveal", title: "Rainwater System", itemId: "rainwater-system",
        en: "A small rainwater system feeds the far beds through a drip line, while hand watering covers the rest.",
        vi: "Một hệ thu nước mưa nhỏ cấp cho các luống xa qua dây nhỏ giọt, còn phần còn lại thì tưới tay." },
    ],
  },

  /* ---------------- Chapter 5 — A Stormy Test ---------------- */
  // Ảnh: trời bão, mưa; chú KỸ SƯ đẩy QUẠT LỚN (thử gió); cô Rivera xịt VÒI (giả mưa); MÁI CHE VẢI phấp phới lỏng; GIÀN LEO nghiêng;
  // 3 bạn ở bàn quan sát KẾT QUẢ (mô hình + token + ống đo ẩm + bảng ghi); MIỆNG THOÁT NƯỚC trên sàn ướt; lá bay.
  {
    id: "s03-ch05", seasonId: "s03", chapterNumber: 5,
    title: "A Stormy Test", vi: "Bài thử trong bão",
    shortDescription: "Một bài thử gió–mưa có kiểm soát phơi bày giàn leo yếu, mái che lỏng và thoát nước kém. Nhóm gia cố rồi thử lại.",
    estimatedMinutes: 7,
    node: { x: 50, y: 58, key: "stormy-test" },
    sceneImage: C + "chapters/chapter-05-stormy-test.webp",
    nextChapterId: "s03-ch06",
    reward: { stars: 3, itemId: "wind-test-result", clueTitle: "Wind Test Result", clueVi: "Kết quả thử gió–mưa: biết chỗ nào yếu để gia cố trước khi bão thật tới." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Chú kỹ sư", en: "Let's run a safe test before real bad weather: a big fan for wind, and a hose for rain.",
        vi: "Mình chạy một bài thử an toàn trước khi thời tiết xấu thật: một chiếc quạt lớn tạo gió, và một vòi nước giả mưa." },
      { kind: "observation",
        prompt: "During the test, the tall trellis leans over in the wind. What does this show?",
        vi: "Trong lúc thử, chiếc giàn leo cao nghiêng ngả trong gió. Điều này cho thấy gì?",
        options: [
          { label: "The trellis is not anchored well enough", correct: true, feedback: "Đúng! Giàn leo nghiêng nghĩa là chưa được neo chắc — cần gia cố." },
          { label: "The trellis is perfect as it is", correct: false, feedback: "Nếu hoàn hảo thì nó đã đứng vững — việc nó nghiêng cho thấy điểm yếu." },
          { label: "It is a warm, sunny day", correct: false, feedback: "Nhìn lại — trời đang bão và mưa; giàn leo nghiêng vì gió mạnh." },
        ] },
      { kind: "multipleChoice",
        prompt: "The shade fabric is loose. What MIGHT happen in a real storm?",
        vi: "Tấm mái che đang lỏng. Trong một cơn bão thật, điều gì CÓ THỂ xảy ra?",
        options: ["It might blow away or tear", "It might grow bigger", "It will stay perfectly still"],
        answer: "It might blow away or tear",
        explainVi: "\"might\" nêu khả năng: mái che lỏng có thể bị gió thổi bay hoặc rách — nên phải buộc chặt." },
      { kind: "arrangeSentence",
        prompt: "The group reports a drainage problem. Put the words in order:",
        vi: "Nhóm báo cáo vấn đề thoát nước. Hãy xếp các từ:",
        solution: ["If", "it", "rains", "the", "path", "gets", "wet"],
        say: "If it rains, the path gets wet.",
        explainVi: "Câu điều kiện loại 1: \"If it rains, the path gets wet.\" — nêu nhân–quả để sửa lối đi." },
      { kind: "dialogue", who: "maple", en: "Let's fix it: tie down the shade, add anchors to the trellis, clear the drain, and move the wet path. Then we test again.",
        vi: "Mình sửa nhé: buộc chặt mái che, neo thêm cho giàn leo, thông miệng thoát nước, và dời lối đi bị ướt. Rồi thử lại." },
      { kind: "clueReveal", title: "Wind Test Result", itemId: "wind-test-result",
        en: "The test shows exactly which parts are weak. The team strengthens the anchors, shelter, drainage, and paths before the real weather comes.",
        vi: "Bài thử chỉ rõ những chỗ còn yếu. Cả nhóm gia cố neo, mái che, thoát nước và lối đi trước khi thời tiết thật ập tới." },
    ],
  },

  /* ---------------- Chapter 6 — The Garden Opens ---------------- */
  // Ảnh: vườn hoàn thiện lúc hoàng hôn; Maple cầm KHAY MÔ HÌNH thuyết trình; Mai (găng tay) + Kai; cô Rivera + chú kỹ sư;
  // KHÁCH tham quan (có bạn XE LĂN trên LỐI ĐI phẳng; các bạn đọc sách ở GÓC ĐỌC có kệ sách); thùng nước mưa, chậu nhẹ, mái che đã chắc.
  {
    id: "s03-ch06", seasonId: "s03", chapterNumber: 6,
    title: "The Garden Opens", vi: "Khu vườn khánh thành",
    shortDescription: "Chặng cuối: khu vườn hoàn thiện kết hợp mọi tính năng. Maple thuyết trình cách bằng chứng đã thay đổi thiết kế ban đầu.",
    estimatedMinutes: 8,
    node: { x: 83, y: 66, key: "garden-opens" },
    sceneImage: C + "chapters/chapter-06-garden-opens.webp",
    reward: { stars: 3, itemId: "sky-garden-builder-badge", clueTitle: "Sky Garden Builder Badge", clueVi: "Huy hiệu Kiến tạo vườn trời — phần thưởng cho việc thiết kế, thử và chỉnh sửa bằng bằng chứng." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "Opening day! The finished garden has vegetables, pollinator flowers, a reading corner, accessible paths, rainwater collection, lightweight planters, and wind-safe structures. Visitors arrive.",
        vi: "Ngày khánh thành! Khu vườn hoàn thiện có rau, hoa thụ phấn, góc đọc sách, lối đi dễ tiếp cận, thu nước mưa, chậu nhẹ và kết cấu chống gió. Khách bắt đầu tới." },
      { kind: "observation",
        prompt: "A visitor uses a wheelchair on the garden path. Why is the path smooth and wide?",
        vi: "Một vị khách dùng xe lăn trên lối đi trong vườn. Vì sao lối đi lại phẳng và rộng?",
        options: [
          { label: "So everyone can reach the whole garden", correct: true, feedback: "Đúng! Lối phẳng và rộng để MỌI người, kể cả người dùng xe lăn, đều tới được khắp vườn." },
          { label: "Just to look pretty", correct: false, feedback: "Đẹp là phụ — mục đích chính là để ai cũng đi lại được (dễ tiếp cận)." },
          { label: "It happened by accident", correct: false, feedback: "Không phải tình cờ — nhóm cố ý thiết kế lối đi dễ tiếp cận." },
        ] },
      { kind: "multipleChoice",
        prompt: "Maple explains why they changed the stone planters. What is the reason?",
        vi: "Maple giải thích vì sao nhóm đổi chậu đá. Lý do là gì?",
        options: ["They were too heavy for the roof, so they used lighter ones", "They were the wrong colour", "They were too cheap"],
        answer: "They were too heavy for the roof, so they used lighter ones",
        explainVi: "Kể lại có lý do: chậu đá quá nặng cho mái → đổi sang chậu nhẹ (we changed … because …)." },
      { kind: "arrangeSentence",
        prompt: "Maple retells one change to the visitors. Put the words in order:",
        vi: "Maple kể lại một thay đổi cho khách. Hãy xếp các từ:",
        solution: ["We", "changed", "the", "plan", "because", "of", "the", "test"],
        say: "We changed the plan because of the test.",
        explainVi: "Quá khứ đơn + lý do: \"We changed … because of the test.\" — kể lại và giải thích." },
      { kind: "multipleChoice",
        prompt: "Which test changed the design the most?",
        vi: "Bài thử nào thay đổi thiết kế nhiều nhất?",
        options: ["The stormy wind-and-rain test", "A calm, sunny afternoon", "No test at all"],
        answer: "The stormy wind-and-rain test",
        explainVi: "Bài thử gió–mưa mới bộc lộ giàn yếu, mái lỏng, thoát nước kém → thay đổi thiết kế nhiều nhất." },
      { kind: "dialogue", who: "maple", en: "Our recommendation: a garden works best when it serves many needs and is tested before it opens. Thank you, team!",
        vi: "Khuyến nghị của bọn mình: một khu vườn tốt nhất khi phục vụ nhiều nhu cầu và được thử trước khi mở. Cảm ơn cả đội!" },
      { kind: "clueReveal", title: "Sky Garden Builder Badge", itemId: "sky-garden-builder-badge",
        en: "Ms. Rivera gives the team the Sky Garden Builder Badge. The rooftop is now a garden for everyone — proof that testing and teamwork make ideas better. Season complete.",
        vi: "Cô Rivera trao cho cả đội Huy hiệu Kiến tạo vườn trời. Sân thượng giờ là khu vườn cho mọi người — minh chứng rằng thử nghiệm và làm việc nhóm khiến ý tưởng tốt hơn. Hoàn thành mùa." },
    ],
  },
];

export const SEASON_SKY_GARDEN: AdventureSeason = {
  id: "s03",
  title: "The Sky Garden Challenge",
  vi: "Thử thách vườn trên mây",
  subtitle: "Thiết kế, thử nghiệm và chỉnh sửa một khu vườn sân thượng cho cả cộng đồng.",
  mapImage: C + "map/season-03-rooftop-plan.webp",
  chapters: S03_CHAPTERS,
  items: S03_ITEMS,
  itemsTagline: "Thu thập bằng chứng để dựng nên khu vườn sân thượng hoàn chỉnh.",
};

/* ============================================================================
 * SEASON 04 — THE MOUNTAIN WEATHER STATION
 * Điều tra thời tiết cộng đồng: quan sát vi khí hậu → kiểm tra cảm biến →
 * chọn tuyến an toàn → khôi phục trạm → trình bày dự báo dựa trên bằng chứng.
 * ==========================================================================*/
const D = "/assets/images/adventure/season-04-mountain-weather-station/";

const S04_ITEMS: AdventureItem[] = [
  { id: "weather-station-pass", name: "Weather Station Pass", vi: "Thẻ trạm thời tiết", emoji: "🏔️", image: D + "items/weather-station-pass.webp" },
  { id: "microclimate-notebook", name: "Microclimate Notebook", vi: "Sổ vi khí hậu", emoji: "📋", image: D + "items/microclimate-notebook.webp" },
  { id: "sensor-alignment-kit", name: "Sensor Alignment Kit", vi: "Bộ căn chỉnh cảm biến", emoji: "🧭", image: D + "items/sensor-alignment-kit.webp" },
  { id: "safe-route-marker", name: "Safe Route Marker", vi: "Dấu tuyến đường an toàn", emoji: "🛡️", image: D + "items/safe-route-marker.webp" },
  { id: "restored-station-signal", name: "Restored Station Signal", vi: "Tín hiệu trạm đã phục hồi", emoji: "📡", image: D + "items/restored-station-signal.webp" },
  { id: "mountain-forecaster-badge", name: "Mountain Forecaster Badge", vi: "Huy hiệu Dự báo viên Núi", emoji: "🏅", image: D + "items/mountain-forecaster-badge.webp" },
];

const S04_CHAPTERS: AdventureChapter[] = [
  {
    id: "s04-ch01", seasonId: "s04", chapterNumber: 1,
    title: "The Broken Forecast", vi: "Bản dự báo bị gián đoạn",
    shortDescription: "Trạm trên đỉnh núi ngừng gửi dữ liệu, trong khi hai bản dự báo lại trái ngược. Maple phải xác định điều gì đã biết và điều gì vẫn chỉ là phỏng đoán.",
    estimatedMinutes: 6,
    node: { x: 14, y: 73, key: "broken-forecast" },
    sceneImage: D + "chapters/chapter-01-broken-forecast.webp",
    nextChapterId: "s04-ch02",
    reward: { stars: 3, itemId: "weather-station-pass", clueTitle: "Weather Station Pass", clueVi: "Thẻ cho phép nhóm tham gia chuyến khảo sát trạm thời tiết cùng cô Park." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Dr. Lena Park",
        en: "The summit station stopped reporting last night. Tomorrow's science festival needs a forecast, but these two predictions disagree.",
        vi: "Trạm trên đỉnh đã ngừng gửi dữ liệu từ tối qua. Ngày mai có hội khoa học, nhưng hai bản dự báo này lại trái ngược." },
      { kind: "dialogue", who: "maple",
        en: "A silent receiver is evidence that the signal stopped. It does not prove whether tomorrow will be sunny or stormy.",
        vi: "Máy thu im lặng là bằng chứng tín hiệu đã dừng. Nó chưa chứng minh ngày mai sẽ nắng hay có giông." },
      { kind: "observation",
        prompt: "Which detail shows the main problem at the visitor centre?",
        vi: "Chi tiết nào cho thấy vấn đề chính ở trung tâm du khách?",
        options: [
          { label: "The receiver has no active signal", correct: true, feedback: "Đúng! Máy thu không có tín hiệu nên nhóm thiếu dữ liệu mới từ trạm trên đỉnh." },
          { label: "The window is large", correct: false, feedback: "Cửa sổ giúp nhìn thấy ngọn núi, nhưng không phải nguyên nhân khiến dự báo bị gián đoạn." },
          { label: "The weather kit is teal", correct: false, feedback: "Màu của bộ dụng cụ không cung cấp bằng chứng về tín hiệu." },
        ] },
      { kind: "multipleChoice",
        prompt: "One card predicts sun and another predicts a storm. What is the best conclusion now?",
        vi: "Một thẻ dự báo nắng, thẻ kia dự báo giông. Kết luận tốt nhất lúc này là gì?",
        options: ["The forecasts conflict, so the team needs more evidence", "The sunny card must be correct", "A storm has already begun"],
        answer: "The forecasts conflict, so the team needs more evidence",
        explainVi: "Hai dự báo mâu thuẫn không cho phép chọn ngay một bên. Nhóm cần thu thập và kiểm tra thêm bằng chứng." },
      { kind: "arrangeSentence",
        prompt: "Separate evidence from a guess. Put the words in order:",
        vi: "Tách bằng chứng khỏi phỏng đoán. Hãy xếp câu:",
        solution: ["The", "station", "might", "have", "a", "signal", "problem"],
        say: "The station might have a signal problem.",
        explainVi: "\"might\" cho biết đây là giả thuyết hợp lý, chưa phải kết luận chắc chắn." },
      { kind: "clueReveal", title: "Weather Station Pass", itemId: "weather-station-pass",
        en: "Dr. Park approves a supervised field investigation. The pass opens the route to the lower weather trail.",
        vi: "Cô Park phê duyệt chuyến khảo sát có giám sát. Tấm thẻ mở tuyến tới đường mòn thời tiết phía dưới." },
    ],
  },
  {
    id: "s04-ch02", seasonId: "s04", chapterNumber: 2,
    title: "The Trail of Microclimates", vi: "Đường mòn vi khí hậu",
    shortDescription: "Một khoảng nắng, rừng tuyết tùng râm mát và cây cầu nhiều gió cho ba kết quả khác nhau dù nằm rất gần nhau.",
    estimatedMinutes: 7,
    node: { x: 32, y: 58, key: "trail-of-microclimates" },
    sceneImage: D + "chapters/chapter-02-trail-of-microclimates.webp",
    nextChapterId: "s04-ch03",
    reward: { stars: 3, itemId: "microclimate-notebook", clueTitle: "Microclimate Notebook", clueVi: "Sổ ghi kết quả ở khoảng nắng, rừng râm và cầu suối — ba vi khí hậu khác nhau." },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "The team stops at three nearby places: a sunny clearing, a shaded cedar grove, and a creek bridge where ribbons move in the wind.",
        vi: "Nhóm dừng ở ba nơi gần nhau: khoảng đất có nắng, rừng tuyết tùng râm mát và cầu suối nơi dải ruy-băng bay trong gió." },
      { kind: "dialogue", who: "maple",
        en: "One mountain can have several microclimates. We must record the location with every observation.",
        vi: "Một ngọn núi có thể có nhiều vi khí hậu. Mỗi quan sát phải đi kèm vị trí." },
      { kind: "observation",
        prompt: "Which place appears warmest in the scene?",
        vi: "Nơi nào trong tranh có vẻ ấm nhất?",
        options: [
          { label: "The sunny rocky clearing", correct: true, feedback: "Đúng! Cảm biến ở khoảng nắng hiển thị vùng ấm hơn cảm biến trong bóng râm." },
          { label: "The shaded cedar grove", correct: false, feedback: "Rừng tuyết tùng bị che nắng nên mát hơn khoảng đất trống." },
          { label: "The breezy bridge", correct: false, feedback: "Cầu có gió rõ rệt, nhưng bằng chứng nhiệt độ cao nhất nằm ở khoảng nắng." },
        ] },
      { kind: "multipleChoice",
        prompt: "The bridge is windy, but the grove is calm. What does this evidence support?",
        vi: "Cầu nhiều gió nhưng khu rừng lại lặng. Bằng chứng này ủng hộ điều gì?",
        options: ["Conditions can differ between nearby locations", "The whole mountain has exactly the same weather", "The instruments are unnecessary"],
        answer: "Conditions can differ between nearby locations",
        explainVi: "Địa hình, bóng râm và độ thoáng khiến các nơi gần nhau vẫn có điều kiện khác nhau." },
      { kind: "arrangeSentence",
        prompt: "Compare the two locations:",
        vi: "So sánh hai vị trí:",
        solution: ["The", "clearing", "is", "warmer", "than", "the", "grove"],
        say: "The clearing is warmer than the grove.",
        explainVi: "Dùng cấu trúc so sánh hơn: \"warmer than\"." },
      { kind: "multipleChoice",
        prompt: "Which note is the most useful evidence?",
        vi: "Ghi chú nào là bằng chứng hữu ích nhất?",
        options: ["The sunny clearing was warmer than the shaded grove at the same time", "The mountain is nice", "I prefer the bridge"],
        answer: "The sunny clearing was warmer than the shaded grove at the same time",
        explainVi: "Ghi chú này có vị trí, phép so sánh và cùng thời điểm; hai câu còn lại chỉ là ý kiến." },
      { kind: "clueReveal", title: "Microclimate Notebook", itemId: "microclimate-notebook",
        en: "The notebook records heat, shade, wind, and leaf moisture by location. It will help the team judge later sensor readings.",
        vi: "Cuốn sổ ghi nhiệt, bóng râm, gió và độ ẩm lá theo từng vị trí. Nó sẽ giúp nhóm đánh giá các cảm biến phía trên." },
    ],
  },
  {
    id: "s04-ch03", seasonId: "s04", chapterNumber: 3,
    title: "The Sensor Puzzle", vi: "Câu đố cảm biến",
    shortDescription: "Ba cảm biến được đặt sai vị trí có thể tạo ra dữ liệu sai lệch. Nhóm dùng mô hình để thiết kế một phép thử công bằng.",
    estimatedMinutes: 7,
    node: { x: 58, y: 51, key: "sensor-puzzle" },
    sceneImage: D + "chapters/chapter-03-sensor-puzzle.webp",
    nextChapterId: "s04-ch04",
    reward: { stars: 3, itemId: "sensor-alignment-kit", clueTitle: "Sensor Alignment Kit", clueVi: "La bàn, thước thủy và thẻ bố trí giúp thử cảm biến ở vị trí không bị che hoặc làm nóng giả." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Dr. Lena Park",
        en: "A sensor may work perfectly and still give misleading data if its position is poor. We will test models before I move any installed equipment.",
        vi: "Cảm biến có thể hoạt động tốt nhưng vẫn cho dữ liệu sai lệch nếu đặt không đúng chỗ. Ta sẽ thử bằng mô hình trước khi cô di chuyển thiết bị thật." },
      { kind: "observation",
        prompt: "Why might the rain gauge collect too little rain?",
        vi: "Vì sao ống đo mưa có thể hứng được quá ít nước?",
        options: [
          { label: "A tree branch partly shelters it", correct: true, feedback: "Đúng! Cành cây che phía trên có thể chặn một phần nước mưa." },
          { label: "It is transparent", correct: false, feedback: "Ống trong suốt giúp quan sát nước; vấn đề là vật che phía trên." },
          { label: "It is standing upright", correct: false, feedback: "Đặt thẳng là bình thường. Cành cây mới làm phép đo thiếu công bằng." },
        ] },
      { kind: "multipleChoice",
        prompt: "The temperature sensor is beside a sun-warmed rock. What could happen?",
        vi: "Cảm biến nhiệt ở cạnh tảng đá bị nắng làm nóng. Điều gì có thể xảy ra?",
        options: ["It may report a temperature that is too high", "It will measure rainfall", "It will make the wind stop"],
        answer: "It may report a temperature that is too high",
        explainVi: "Nhiệt tỏa từ tảng đá có thể khiến cảm biến ghi cao hơn nhiệt độ không khí thực tế." },
      { kind: "multipleChoice",
        prompt: "Which is the fairest placement test?",
        vi: "Phép thử vị trí nào công bằng nhất?",
        options: ["Compare identical model sensors at the same time in open and blocked spots", "Use different sensors on different days", "Choose the result you like"],
        answer: "Compare identical model sensors at the same time in open and blocked spots",
        explainVi: "Giữ loại cảm biến và thời gian giống nhau giúp vị trí trở thành khác biệt chính cần kiểm tra." },
      { kind: "arrangeSentence",
        prompt: "Explain the wind-vane problem:",
        vi: "Giải thích vấn đề của cánh chỉ gió:",
        solution: ["The", "wind", "vane", "is", "blocked", "by", "the", "shelter"],
        say: "The wind vane is blocked by the shelter.",
        explainVi: "\"is blocked by\" mô tả vật cản làm ảnh hưởng thiết bị." },
      { kind: "dialogue", who: "maple",
        en: "If we move the models into an open, level area, then the readings should be easier to compare.",
        vi: "Nếu chuyển các mô hình ra khu vực bằng phẳng, thoáng, các kết quả sẽ dễ so sánh hơn." },
      { kind: "clueReveal", title: "Sensor Alignment Kit", itemId: "sensor-alignment-kit",
        en: "The team identifies three placement errors and records a fair setup for rain, wind, and temperature sensors.",
        vi: "Nhóm xác định ba lỗi vị trí và ghi lại cách bố trí công bằng cho cảm biến mưa, gió và nhiệt độ." },
    ],
  },
  {
    id: "s04-ch04", seasonId: "s04", chapterNumber: 4,
    title: "The Cloud-Line Decision", vi: "Quyết định dưới tầng mây",
    shortDescription: "Đường sống núi ngắn hơn nhưng gió mạnh và tầm nhìn kém. Nhóm phải cân nhắc thời gian với mức độ an toàn.",
    estimatedMinutes: 7,
    node: { x: 50, y: 27, key: "cloud-line-decision" },
    sceneImage: D + "chapters/chapter-04-cloud-line-decision.webp",
    nextChapterId: "s04-ch05",
    reward: { stars: 3, itemId: "safe-route-marker", clueTitle: "Safe Route Marker", clueVi: "Dấu tuyến rừng được chọn sau khi nhóm so gió, mây, tầm nhìn và thời gian." },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "At the lookout, low cloud hides the exposed ridge. The direct path is shorter, while the forest path is longer and sheltered.",
        vi: "Tại điểm quan sát, mây thấp che khuất sống núi trống trải. Đường thẳng ngắn hơn, còn đường rừng dài hơn nhưng được che chắn." },
      { kind: "observation",
        prompt: "Which two visible clues make the ridge route less suitable?",
        vi: "Hai manh mối nào khiến đường sống núi kém phù hợp?",
        options: [
          { label: "Strong wind and poor visibility", correct: true, feedback: "Đúng! Ống gió bị kéo căng và mây che sống núi." },
          { label: "Warm light and clear trees", correct: false, feedback: "Ánh sáng không loại bỏ bằng chứng gió mạnh và tầm nhìn kém trên sống núi." },
          { label: "A notebook and a pencil", correct: false, feedback: "Đó là dụng cụ ghi chép, không phải điều kiện nguy hiểm của tuyến." },
        ] },
      { kind: "multipleChoice",
        prompt: "The forest route takes longer but remains visible and sheltered. What should the group do?",
        vi: "Đường rừng lâu hơn nhưng vẫn nhìn rõ và được che chắn. Nhóm nên làm gì?",
        options: ["Use the forest route with Dr. Park's approval", "Race along the windy ridge", "Separate and take different routes"],
        answer: "Use the forest route with Dr. Park's approval",
        explainVi: "Tuyến dài hơn là lựa chọn hợp lý khi giảm gió và giữ được tầm nhìn; nhóm cũng phải đi cùng người lớn." },
      { kind: "arrangeSentence",
        prompt: "State the route trade-off:",
        vi: "Nêu sự đánh đổi của tuyến đường:",
        solution: ["Although", "the", "forest", "route", "is", "longer", "it", "is", "safer"],
        say: "Although the forest route is longer, it is safer.",
        explainVi: "\"Although\" nối hai ý tương phản: dài hơn nhưng an toàn hơn." },
      { kind: "multipleChoice",
        prompt: "If the cloud becomes thicker, what should the team do?",
        vi: "Nếu mây dày hơn, nhóm nên làm gì?",
        options: ["Stop at the protected lookout and reassess", "Continue without checking", "Leave Dr. Park behind"],
        answer: "Stop at the protected lookout and reassess",
        explainVi: "Dừng lại và đánh giá lại là phản ứng an toàn khi điều kiện thay đổi." },
      { kind: "dialogue", who: "stranger", name: "Dr. Lena Park",
        en: "Good decision. A longer route is not a failure when the evidence shows it is safer.",
        vi: "Quyết định tốt. Chọn đường dài hơn không phải thất bại khi bằng chứng cho thấy nó an toàn hơn." },
      { kind: "clueReveal", title: "Safe Route Marker", itemId: "safe-route-marker",
        en: "The sheltered forest marker records the team's evidence-based route decision.",
        vi: "Dấu tuyến rừng có che chắn ghi lại quyết định dựa trên bằng chứng của cả nhóm." },
    ],
  },
  {
    id: "s04-ch05", seasonId: "s04", chapterNumber: 5,
    title: "Repair at the Summit", vi: "Khôi phục trạm trên đỉnh",
    shortDescription: "Cô Park sửa kết nối nguồn an toàn, còn Maple và các bạn kiểm tra xem ba loại dữ liệu có trở lại và nhất quán hay không.",
    estimatedMinutes: 8,
    node: { x: 66, y: 10, key: "repair-at-summit" },
    sceneImage: D + "chapters/chapter-05-repair-at-summit.webp",
    nextChapterId: "s04-ch06",
    reward: { stars: 3, itemId: "restored-station-signal", clueTitle: "Restored Station Signal", clueVi: "Máy thu lại nhận đủ tín hiệu mưa, gió và nhiệt độ sau khi sửa và hiệu chuẩn." },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Dr. Lena Park",
        en: "The solar connector is loose. I will repair it. Your job is to compare the indicators before and after the repair.",
        vi: "Đầu nối pin mặt trời bị lỏng. Cô sẽ sửa. Nhiệm vụ của các em là so các chỉ báo trước và sau khi sửa." },
      { kind: "observation",
        prompt: "Who is handling the installed solar connector and tools?",
        vi: "Ai đang xử lý đầu nối pin mặt trời và dụng cụ?",
        options: [
          { label: "Dr. Park, the adult meteorologist", correct: true, feedback: "Đúng! Người lớn có chuyên môn thực hiện việc sửa; nhóm trẻ chỉ quan sát và thử mô hình." },
          { label: "Maple alone", correct: false, feedback: "Maple đang theo dõi tín hiệu, không tự sửa thiết bị nguồn." },
          { label: "A child without supervision", correct: false, feedback: "Không. Cảnh cho thấy cô Park chịu trách nhiệm về thiết bị thật." },
        ] },
      { kind: "multipleChoice",
        prompt: "The receiver turns on after the cable is reconnected. Why is one signal not enough to finish?",
        vi: "Máy thu bật lại sau khi nối cáp. Vì sao một tín hiệu chưa đủ để kết thúc?",
        options: ["The team must check whether rain, wind, and temperature readings all make sense", "The colour is not bright enough", "The station needs a new name"],
        answer: "The team must check whether rain, wind, and temperature readings all make sense",
        explainVi: "Khôi phục nguồn chỉ là bước đầu; nhóm còn phải hiệu chuẩn và đối chiếu nhiều loại dữ liệu." },
      { kind: "arrangeSentence",
        prompt: "Put the testing sequence in order:",
        vi: "Xếp câu mô tả trình tự kiểm tra:",
        solution: ["First", "reconnect", "the", "cable", "then", "compare", "the", "readings"],
        say: "First reconnect the cable, then compare the readings.",
        explainVi: "\"First … then …\" trình bày hai bước theo đúng thứ tự." },
      { kind: "multipleChoice",
        prompt: "The model vane points the same way as the summit windsock. What does this support?",
        vi: "Cánh chỉ gió mô hình chỉ cùng hướng với ống gió trên đỉnh. Điều này ủng hộ kết luận nào?",
        options: ["The wind direction reading is plausible", "The rain gauge is broken", "Tomorrow must be sunny"],
        answer: "The wind direction reading is plausible",
        explainVi: "Hai nguồn độc lập đồng ý về hướng gió, nên kết quả này có vẻ hợp lý; nó không tự dự báo toàn bộ ngày mai." },
      { kind: "dialogue", who: "maple",
        en: "All three indicators are back, and they agree with our field observations. The station is reporting again!",
        vi: "Cả ba chỉ báo đã trở lại và khớp với quan sát thực địa. Trạm đang gửi dữ liệu trở lại!" },
      { kind: "clueReveal", title: "Restored Station Signal", itemId: "restored-station-signal",
        en: "The repaired and calibrated station sends a complete set of weather observations to the visitor centre.",
        vi: "Trạm đã sửa và hiệu chuẩn gửi bộ quan sát thời tiết đầy đủ về trung tâm du khách." },
    ],
  },
  {
    id: "s04-ch06", seasonId: "s04", chapterNumber: 6,
    title: "Forecast Festival", vi: "Ngày hội dự báo thời tiết",
    shortDescription: "Nhóm trở lại ngày hội, ghép toàn bộ bằng chứng và trình bày một bản dự báo có lý do thay vì chỉ đoán biểu tượng thời tiết.",
    estimatedMinutes: 8,
    node: { x: 25, y: 82, key: "forecast-festival" },
    sceneImage: D + "chapters/chapter-06-forecast-festival.webp",
    reward: { stars: 3, itemId: "mountain-forecaster-badge", clueTitle: "Mountain Forecaster Badge", clueVi: "Huy hiệu dành cho nhóm đã quan sát, kiểm tra, lựa chọn an toàn và trình bày dự báo bằng bằng chứng." },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "At the festival, the team displays the notebook, sensor model, safe-route marker, and restored signal beside a pictorial forecast.",
        vi: "Tại ngày hội, nhóm trưng bày cuốn sổ, mô hình cảm biến, dấu tuyến an toàn và tín hiệu đã phục hồi cạnh bản dự báo bằng hình." },
      { kind: "observation",
        prompt: "What sequence appears on the forecast board?",
        vi: "Trình tự nào xuất hiện trên bảng dự báo?",
        options: [
          { label: "Sun, increasing cloud, then rain", correct: true, feedback: "Đúng! Bảng cho thấy buổi đầu quang, mây tăng dần rồi có mưa." },
          { label: "Snow, fire, then a rainbow", correct: false, feedback: "Những biểu tượng đó không có trên bảng." },
          { label: "The same sunny symbol all day", correct: false, feedback: "Bảng thay đổi từ nắng sang mây rồi mưa." },
        ] },
      { kind: "multipleChoice",
        prompt: "Which evidence best explains why the team trusts the restored station?",
        vi: "Bằng chứng nào giải thích tốt nhất vì sao nhóm tin trạm đã phục hồi?",
        options: ["Its rain, wind, and temperature indicators agree with field observations", "The receiver looks new", "The audience likes the colours"],
        answer: "Its rain, wind, and temperature indicators agree with field observations",
        explainVi: "Độ tin cậy đến từ việc nhiều loại chỉ báo khớp với quan sát thực địa, không phải hình thức hay ý kiến khán giả." },
      { kind: "arrangeSentence",
        prompt: "Retell the investigation:",
        vi: "Kể lại cuộc điều tra:",
        solution: ["First", "we", "compared", "microclimates", "then", "we", "tested", "the", "sensors"],
        say: "First we compared microclimates, then we tested the sensors.",
        explainVi: "Dùng quá khứ đơn và từ nối trình tự để tóm tắt hành trình." },
      { kind: "multipleChoice",
        prompt: "Why should visitors still use the sheltered route in worsening cloud?",
        vi: "Vì sao khách vẫn nên dùng tuyến có che chắn khi mây xấu đi?",
        options: ["The earlier route test showed better visibility and less exposure", "It is the shortest route", "The forecast badge demands it"],
        answer: "The earlier route test showed better visibility and less exposure",
        explainVi: "Khuyến nghị an toàn dựa trên bằng chứng ở tầng mây, không dựa vào phần thưởng." },
      { kind: "dialogue", who: "maple",
        en: "Our forecast may change as new data arrives. A good forecaster explains the evidence and updates the plan.",
        vi: "Dự báo có thể thay đổi khi có dữ liệu mới. Dự báo viên tốt phải giải thích bằng chứng và cập nhật kế hoạch." },
      { kind: "clueReveal", title: "Mountain Forecaster Badge", itemId: "mountain-forecaster-badge",
        en: "The team earns the Mountain Forecaster Badge for testing evidence, making a safe decision, and explaining a forecast clearly.",
        vi: "Cả nhóm nhận Huy hiệu Dự báo viên Núi vì đã kiểm tra bằng chứng, đưa ra quyết định an toàn và giải thích dự báo rõ ràng. Hoàn thành mùa." },
    ],
  },
];

export const SEASON_MOUNTAIN_WEATHER: AdventureSeason = {
  id: "s04",
  title: "The Mountain Weather Station",
  vi: "Trạm thời tiết trên núi",
  subtitle: "Theo dấu vi khí hậu, sửa dữ liệu sai lệch và xây dựng một bản dự báo an toàn bằng bằng chứng.",
  mapImage: D + "map/season-04-mountain-map.webp",
  chapters: S04_CHAPTERS,
  items: S04_ITEMS,
  itemsTagline: "Thu thập sáu bằng chứng để khôi phục trạm và hoàn thành bản dự báo trên núi.",
};

/* ============================================================================
 * SEASON 05 — THE STORY ATLAS
 * Đọc hiểu và suy luận qua các thế giới truyện: trình tự → độ tin cậy →
 * điều kiện → lịch trình → kết nối bằng chứng để hoàn thành đoạn kết.
 * ==========================================================================*/
const E = "/assets/images/adventure/season-05-story-atlas/";

const S05_ITEMS: AdventureItem[] = [
  { id: "story-atlas", name: "The Story Atlas", vi: "Cuốn Bản đồ Truyện", emoji: "📖", image: E + "items/story-atlas.webp" },
  { id: "maple-bookmark", name: "Maple Bookmark", vi: "Dấu trang lá phong", emoji: "🍁", image: E + "items/maple-bookmark.webp" },
  { id: "future-timeline-cards", name: "Future Timeline Cards", vi: "Bộ thẻ dòng thời gian", emoji: "🃏", image: E + "items/future-timeline-cards.webp" },
  { id: "forest-evidence-notebook", name: "Forest Evidence Notebook", vi: "Sổ bằng chứng trong rừng", emoji: "📓", image: E + "items/forest-evidence-notebook.webp" },
  { id: "clockwork-key", name: "Clockwork Key", vi: "Chìa khóa bánh răng", emoji: "🗝️", image: E + "items/clockwork-key.webp" },
  { id: "moonlight-train-ticket", name: "Moonlight Train Ticket", vi: "Vé tàu ánh trăng", emoji: "🎫", image: E + "items/moonlight-train-ticket.webp" },
  { id: "story-lantern", name: "Story Lantern", vi: "Đèn lồng câu chuyện", emoji: "🏮", image: E + "items/story-lantern.webp" },
  { id: "blank-page-quill", name: "Blank Page Quill", vi: "Bút lông Trang Trắng", emoji: "🪶", image: E + "items/blank-page-quill.webp" },
  { id: "story-keeper-badge", name: "Story Keeper Badge", vi: "Huy hiệu Người giữ Truyện", emoji: "🏅", image: E + "items/story-keeper-badge.webp" },
];

const S05_CHAPTERS: AdventureChapter[] = [
  {
    id: "s05-ch01", seasonId: "s05", chapterNumber: 1,
    title: "The Library After Dark", vi: "Thư viện sau giờ đóng cửa",
    shortDescription: "Những cuốn sách tự đổi chỗ và một cuốn atlas phát sáng mở ra sáu lối đi. Maple phải tìm dấu hiệu cho biết chuyện gì đang xảy ra.",
    estimatedMinutes: 6,
    node: { x: 50, y: 49, key: "story-atlas-hub" },
    sceneImage: E + "chapters/chapter-01-library-after-dark.webp",
    nextChapterId: "s05-ch02",
    reward: {
      stars: 3, itemId: "story-atlas", extraItemIds: ["maple-bookmark"],
      clueTitle: "The Story Atlas",
      clueVi: "Cuốn atlas và dấu trang lá phong mở lối vào những câu chuyện đang bị xáo trộn.",
    },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "The library should be quiet, but books are floating between the shelves. Golden symbols lead from an open atlas to six dark archways.",
        vi: "Thư viện lẽ ra phải yên tĩnh, nhưng sách đang bay giữa các kệ. Những ký hiệu vàng dẫn từ cuốn atlas đang mở tới sáu vòm cửa tối." },
      { kind: "dialogue", who: "maple",
        en: "The books are not escaping. They are following the wrong paths. I need to discover where each story belongs.",
        vi: "Những cuốn sách không chạy trốn. Chúng đang đi nhầm đường. Mình phải tìm xem mỗi câu chuyện thuộc về đâu." },
      { kind: "observation",
        prompt: "Which object is sending golden trails toward the archways?",
        vi: "Vật nào đang phát ra những vệt sáng vàng hướng tới các vòm cửa?",
        options: [
          { label: "The large open atlas", correct: true, feedback: "Đúng! Các vệt sáng bắt đầu từ cuốn atlas lớn trên bàn." },
          { label: "The ladder by the shelves", correct: false, feedback: "Chiếc thang đứng yên và không phát sáng." },
          { label: "Maple's backpack", correct: false, feedback: "Ba lô của Maple không tạo ra các vệt sáng." },
        ] },
      { kind: "multipleChoice",
        prompt: "The symbols connect the atlas to several archways. What is the best first conclusion?",
        vi: "Các ký hiệu nối cuốn atlas với nhiều vòm cửa. Kết luận đầu tiên hợp lý nhất là gì?",
        options: ["The atlas links several story worlds", "The library is about to close", "The books need a larger shelf"],
        answer: "The atlas links several story worlds",
        explainVi: "Đường sáng nối trực tiếp atlas với các lối đi, vì vậy chúng có khả năng là các thế giới truyện liên kết với nhau." },
      { kind: "arrangeSentence",
        prompt: "Maple describes her plan. Put the words in order:",
        vi: "Maple mô tả kế hoạch. Hãy xếp các từ:",
        solution: ["I", "will", "follow", "the", "golden", "trail", "first"],
        say: "I will follow the golden trail first.",
        explainVi: "Will + động từ nguyên mẫu dùng để nói một quyết định hoặc kế hoạch vừa được đưa ra." },
      { kind: "clueReveal", title: "The Story Atlas", itemId: "story-atlas",
        en: "A maple-leaf bookmark marks the first route. The atlas opens a doorway into a city where time is out of order.",
        vi: "Dấu trang lá phong đánh dấu tuyến đầu tiên. Cuốn atlas mở cửa tới một thành phố nơi thời gian đang bị đảo lộn." },
    ],
  },
  {
    id: "s05-ch02", seasonId: "s05", chapterNumber: 2,
    title: "The City Without Tomorrow", vi: "Thành phố không có ngày mai",
    shortDescription: "Đồng hồ và chỉ dẫn trong thành phố tương lai không khớp nhau. Maple phải sắp xếp các sự kiện theo đúng trình tự.",
    estimatedMinutes: 6,
    node: { x: 23, y: 25, key: "future-city" },
    sceneImage: E + "chapters/chapter-02-city-without-tomorrow.webp",
    nextChapterId: "s05-ch03",
    reward: {
      stars: 3, itemId: "future-timeline-cards",
      clueTitle: "Future Timeline Cards",
      clueVi: "Ba thẻ cho thấy thứ tự hợp lý: đi tàu, tới quảng trường, rồi xem buổi biểu diễn.",
    },
    storySteps: [
      { kind: "dialogue", who: "maple",
        en: "Every clock shows a different time, and the direction signs disagree. The picture cards may show what should happen first.",
        vi: "Mỗi chiếc đồng hồ chỉ một giờ khác nhau và các biển chỉ đường không thống nhất. Những thẻ hình có thể cho biết việc nào xảy ra trước." },
      { kind: "observation",
        prompt: "Which three places appear on the large cards in front of Maple?",
        vi: "Ba địa điểm nào xuất hiện trên các thẻ lớn trước mặt Maple?",
        options: [
          { label: "A train, a fountain, and a concert", correct: true, feedback: "Chính xác! Ba thẻ thể hiện chuyến tàu, quảng trường có đài phun nước và buổi hòa nhạc." },
          { label: "A forest, a castle, and a library", correct: false, feedback: "Những nơi đó nằm ở các thế giới khác, không phải ba thẻ trước mặt Maple." },
          { label: "A boat, a mountain, and a garden", correct: false, feedback: "Hãy nhìn lại ba hình ở mép dưới của tranh." },
        ] },
      { kind: "multipleChoice",
        prompt: "The concert begins after visitors arrive at the fountain plaza. They take the train to reach the plaza. Which order makes sense?",
        vi: "Buổi hòa nhạc bắt đầu sau khi khách tới quảng trường. Họ đi tàu để tới quảng trường. Thứ tự nào hợp lý?",
        options: ["Train → fountain plaza → concert", "Concert → train → fountain plaza", "Fountain plaza → concert → train"],
        answer: "Train → fountain plaza → concert",
        explainVi: "Trước hết họ đi tàu, sau đó tới quảng trường và cuối cùng mới xem buổi biểu diễn." },
      { kind: "arrangeSentence",
        prompt: "Explain the sequence:",
        vi: "Giải thích trình tự:",
        solution: ["After", "the", "train", "arrives", "we", "walk", "to", "the", "plaza"],
        say: "After the train arrives, we walk to the plaza.",
        explainVi: "After giới thiệu sự việc xảy ra trước; mệnh đề còn lại nói việc xảy ra tiếp theo." },
      { kind: "clueReveal", title: "Future Timeline Cards", itemId: "future-timeline-cards",
        en: "When Maple places the cards in order, the city clocks agree again. A forest path appears on the back of the final card.",
        vi: "Khi Maple xếp đúng các thẻ, đồng hồ trong thành phố lại thống nhất. Một con đường rừng hiện ra ở mặt sau thẻ cuối." },
    ],
  },
  {
    id: "s05-ch03", seasonId: "s05", chapterNumber: 3,
    title: "The Forest of Two Stories", vi: "Khu rừng của hai câu chuyện",
    shortDescription: "Hai lối rẽ kể hai phiên bản khác nhau. Maple phải phân biệt điều quan sát được với điều chỉ được suy đoán.",
    estimatedMinutes: 7,
    node: { x: 73, y: 26, key: "two-stories-forest" },
    sceneImage: E + "chapters/chapter-03-forest-of-two-stories.webp",
    nextChapterId: "s05-ch04",
    reward: {
      stars: 3, itemId: "forest-evidence-notebook",
      clueTitle: "Forest Evidence Notebook",
      clueVi: "Cuốn sổ ghi lại bằng chứng thật ở cả hai lối đi và tách chúng khỏi những điều chưa được kiểm chứng.",
    },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "One storyteller says a traveller dropped a lantern. The other says a basket rolled across the path. Both stories sound possible.",
        vi: "Một người kể nói có khách làm rơi đèn. Người kia nói một chiếc giỏ lăn qua đường. Cả hai câu chuyện đều có vẻ có thể xảy ra." },
      { kind: "observation",
        prompt: "What evidence can Maple directly see on the blue path?",
        vi: "Maple có thể trực tiếp nhìn thấy bằng chứng nào trên lối màu xanh?",
        options: [
          { label: "Footprints and a fallen lantern", correct: true, feedback: "Đúng! Đây là hai chi tiết có thể quan sát trực tiếp." },
          { label: "A person running away", correct: false, feedback: "Không có người đang chạy trong tranh." },
          { label: "A train ticket", correct: false, feedback: "Vé tàu không nằm trên lối màu xanh." },
        ] },
      { kind: "multipleChoice",
        prompt: "Why should Maple record the objects and tracks before choosing a story?",
        vi: "Vì sao Maple nên ghi lại đồ vật và dấu vết trước khi chọn câu chuyện?",
        options: ["Visible evidence is more reliable than a guess", "The brighter path is always correct", "A statue cannot tell any story"],
        answer: "Visible evidence is more reliable than a guess",
        explainVi: "Bằng chứng quan sát được giúp đánh giá lời kể; độ sáng hay sở thích không chứng minh điều gì." },
      { kind: "arrangeSentence",
        prompt: "Compare evidence and opinion:",
        vi: "So sánh bằng chứng và ý kiến:",
        solution: ["The", "lantern", "is", "visible", "but", "the", "reason", "is", "uncertain"],
        say: "The lantern is visible, but the reason is uncertain.",
        explainVi: "But nối một điều chắc chắn với một điều tương phản chưa thể khẳng định." },
      { kind: "clueReveal", title: "Forest Evidence Notebook", itemId: "forest-evidence-notebook",
        en: "The notebook separates facts from guesses. A tiny gear mark hidden beneath a leaf points toward the clockwork castle.",
        vi: "Cuốn sổ tách sự thật khỏi phỏng đoán. Một dấu bánh răng nhỏ dưới chiếc lá chỉ đường tới lâu đài đồng hồ." },
    ],
  },
  {
    id: "s05-ch04", seasonId: "s05", chapterNumber: 4,
    title: "The Clockwork Castle", vi: "Lâu đài bánh răng",
    shortDescription: "Một hệ thống bánh răng chỉ hoạt động khi Maple làm đúng điều kiện và chọn cần gạt phù hợp.",
    estimatedMinutes: 7,
    node: { x: 20, y: 70, key: "clockwork-castle" },
    sceneImage: E + "chapters/chapter-04-clockwork-castle.webp",
    nextChapterId: "s05-ch05",
    reward: {
      stars: 3, itemId: "clockwork-key",
      clueTitle: "Clockwork Key",
      clueVi: "Chìa khóa chỉ xoay khi ba bánh răng teal được nối thành một chuỗi hoàn chỉnh.",
    },
    storySteps: [
      { kind: "dialogue", who: "maple",
        en: "The teal gears form one complete chain. The amber gears stop before reaching the final wheel. I should follow the condition, not the brightest colour.",
        vi: "Các bánh răng teal tạo thành một chuỗi hoàn chỉnh. Bánh răng màu hổ phách dừng trước bánh cuối. Mình phải theo điều kiện, không chỉ chọn màu sáng nhất." },
      { kind: "observation",
        prompt: "Which row of gears forms an unbroken chain across the machine?",
        vi: "Hàng bánh răng nào tạo thành chuỗi không bị đứt quãng?",
        options: [
          { label: "The teal row", correct: true, feedback: "Đúng! Ba bánh teal chạm nhau từ đầu tới cuối." },
          { label: "The amber row", correct: false, feedback: "Hàng amber bị ngắt trước khi tới bánh cuối." },
          { label: "Neither row", correct: false, feedback: "Hãy theo dõi các răng bánh đang tiếp xúc ở hàng teal." },
        ] },
      { kind: "multipleChoice",
        prompt: "The instruction means: if all three gears connect, pull the matching lever. What should Maple do?",
        vi: "Hướng dẫn có nghĩa: nếu cả ba bánh răng nối nhau, hãy kéo cần tương ứng. Maple nên làm gì?",
        options: ["Pull the teal lever", "Pull every lever", "Leave the castle"],
        answer: "Pull the teal lever",
        explainVi: "Điều kiện chỉ đúng với chuỗi teal, nên Maple chọn cần gạt teal." },
      { kind: "arrangeSentence",
        prompt: "State the rule:",
        vi: "Nêu quy tắc:",
        solution: ["If", "the", "gears", "connect", "the", "door", "will", "open"],
        say: "If the gears connect, the door will open.",
        explainVi: "Câu điều kiện loại một: If + hiện tại đơn, will + động từ nguyên mẫu." },
      { kind: "clueReveal", title: "Clockwork Key", itemId: "clockwork-key",
        en: "The correct lever releases a clockwork key. Its handle shows a moon above a railway line.",
        vi: "Cần gạt đúng giải phóng chiếc chìa khóa bánh răng. Trên tay cầm có hình mặt trăng phía trên đường ray." },
    ],
  },
  {
    id: "s05-ch05", seasonId: "s05", chapterNumber: 5,
    title: "The Moonlight Express", vi: "Chuyến tàu ánh trăng",
    shortDescription: "Ba cổng ga dẫn tới ba thế giới khác nhau. Maple phải kết hợp vé, bản đồ tuyến và đồng hồ để chọn đúng chuyến.",
    estimatedMinutes: 7,
    node: { x: 79, y: 68, key: "moonlight-express" },
    sceneImage: E + "chapters/chapter-05-moonlight-express.webp",
    nextChapterId: "s05-ch06",
    reward: {
      stars: 3, itemId: "moonlight-train-ticket", extraItemIds: ["story-lantern"],
      clueTitle: "Moonlight Train Ticket",
      clueVi: "Chiếc vé và đèn lồng xác nhận chuyến tàu đi qua các thế giới theo đúng tuyến của atlas.",
    },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "Three arches show three destinations: the future city, the forest, and the clockwork castle. The route board places them in one line.",
        vi: "Ba vòm cửa chỉ ba điểm đến: thành phố tương lai, khu rừng và lâu đài bánh răng. Bảng tuyến đặt chúng trên cùng một đường." },
      { kind: "observation",
        prompt: "Which destination symbol appears above the middle arch?",
        vi: "Biểu tượng điểm đến nào nằm trên vòm cửa ở giữa?",
        options: [
          { label: "A tree for the forest", correct: true, feedback: "Đúng! Cây lớn đánh dấu điểm dừng trong rừng." },
          { label: "A castle with gears", correct: false, feedback: "Lâu đài bánh răng nằm ở vòm bên phải." },
          { label: "A future skyline", correct: false, feedback: "Thành phố tương lai nằm ở vòm bên trái." },
        ] },
      { kind: "multipleChoice",
        prompt: "The route board shows city → forest → castle. Maple has already left the forest and needs the final route clue. Where should she travel next?",
        vi: "Bảng tuyến chỉ thành phố → rừng → lâu đài. Maple đã rời khu rừng và cần manh mối cuối tuyến. Cô bé nên tới đâu?",
        options: ["The clockwork castle stop", "The future city stop", "Back to the forest stop"],
        answer: "The clockwork castle stop",
        explainVi: "Theo thứ tự trên bảng, điểm sau khu rừng là lâu đài bánh răng." },
      { kind: "arrangeSentence",
        prompt: "Ask about the schedule:",
        vi: "Hỏi về lịch tàu:",
        solution: ["When", "does", "the", "next", "train", "leave"],
        say: "When does the next train leave?",
        explainVi: "Dùng When does + chủ ngữ + động từ nguyên mẫu để hỏi thời điểm." },
      { kind: "clueReveal", title: "Moonlight Train Ticket", itemId: "moonlight-train-ticket",
        en: "The conductor's lantern reveals a hidden return mark on the ticket. The express carries Maple back to the library's final chamber.",
        vi: "Ánh đèn của người soát vé làm lộ dấu quay về ẩn trên vé. Chuyến tàu đưa Maple trở lại căn phòng cuối của thư viện." },
    ],
  },
  {
    id: "s05-ch06", seasonId: "s05", chapterNumber: 6,
    title: "The Last Blank Page", vi: "Trang trắng cuối cùng",
    shortDescription: "Maple kết nối bằng chứng từ năm thế giới để tạo một đoạn kết hợp lý và đưa toàn bộ thư viện trở lại đúng trật tự.",
    estimatedMinutes: 8,
    node: { x: 50, y: 82, key: "last-blank-page" },
    sceneImage: E + "chapters/chapter-06-last-blank-page.webp",
    reward: {
      stars: 3, itemId: "blank-page-quill", extraItemIds: ["story-keeper-badge"],
      clueTitle: "Story Keeper Badge",
      clueVi: "Maple hoàn thành atlas bằng cách nối trình tự, bằng chứng, điều kiện và tuyến đường thành một đoạn kết nhất quán.",
    },
    storySteps: [
      { kind: "dialogue", who: "maple",
        en: "A good ending cannot be chosen at random. It must agree with the events, evidence, rules, and route we discovered.",
        vi: "Một đoạn kết hay không thể được chọn ngẫu nhiên. Nó phải phù hợp với sự kiện, bằng chứng, quy tắc và tuyến đường chúng ta đã khám phá." },
      { kind: "observation",
        prompt: "Which four journey clues are connected by golden lines on the final page?",
        vi: "Bốn manh mối hành trình nào được nối bằng đường sáng vàng trên trang cuối?",
        options: [
          { label: "The city, forest, gears, and moonlit train", correct: true, feedback: "Chính xác! Bốn hình ảnh chính của hành trình đang được nối lại." },
          { label: "A harbour, ferry, mountain, and garden", correct: false, feedback: "Đó là bối cảnh của các mùa khác." },
          { label: "Four identical library shelves", correct: false, feedback: "Trang cuối hiển thị nhiều thế giới khác nhau." },
        ] },
      { kind: "multipleChoice",
        prompt: "Which ending best matches all the evidence Maple collected?",
        vi: "Đoạn kết nào phù hợp nhất với toàn bộ bằng chứng Maple đã thu thập?",
        options: [
          "Maple reconnects the routes, and every story returns to its correct place",
          "Maple hides the atlas so no one can finish the stories",
          "The clocks fix everything without using any clues",
        ],
        answer: "Maple reconnects the routes, and every story returns to its correct place",
        explainVi: "Đoạn kết này sử dụng mục tiêu ban đầu và tất cả bằng chứng thu được trong hành trình." },
      { kind: "arrangeSentence",
        prompt: "Complete the final summary:",
        vi: "Hoàn thành câu tóm tắt cuối:",
        solution: ["Because", "Maple", "connected", "the", "clues", "the", "stories", "returned"],
        say: "Because Maple connected the clues, the stories returned.",
        explainVi: "Because nêu nguyên nhân; mệnh đề còn lại cho biết kết quả." },
      { kind: "multipleChoice",
        prompt: "What skill helped Maple most throughout this adventure?",
        vi: "Kỹ năng nào giúp Maple nhiều nhất trong cả chuyến phiêu lưu?",
        options: ["Using evidence to explain a choice", "Choosing the brightest object", "Guessing before looking"],
        answer: "Using evidence to explain a choice",
        explainVi: "Mỗi chapter đều yêu cầu quan sát, kết nối thông tin và giải thích lựa chọn bằng bằng chứng." },
      { kind: "clueReveal", title: "Story Keeper Badge", itemId: "story-keeper-badge",
        en: "The final page glows, and every book returns to its shelf. Maple earns the Story Keeper Badge—and the atlas leaves one new page waiting.",
        vi: "Trang cuối phát sáng và mọi cuốn sách trở về đúng kệ. Maple nhận Huy hiệu Người giữ Truyện—còn cuốn atlas để lại một trang mới đang chờ." },
    ],
  },
];

export const SEASON_STORY_ATLAS: AdventureSeason = {
  id: "s05",
  title: "The Story Atlas",
  vi: "Cuốn Bản đồ Truyện",
  subtitle: "Bước qua sáu thế giới truyện, kiểm tra bằng chứng và nối lại một đoạn kết đã bị thất lạc.",
  mapImage: E + "map/season-05-story-atlas-map.webp",
  chapters: S05_CHAPTERS,
  items: S05_ITEMS,
  itemsTagline: "Thu thập chín vật phẩm để nối lại các tuyến truyện và trở thành Người giữ Truyện.",
};

/* ============================================================================
 * SEASON 06 — THE LANTERN MARKET CHALLENGE
 * Dự án cộng đồng thực tế: đọc kế hoạch → bố trí không gian → an toàn thực phẩm →
 * ngân sách → giao hàng → truyền đạt thông tin trong đêm khai mạc.
 * ==========================================================================*/
const F = "/assets/images/adventure/season-06-lantern-market-challenge/";

const S06_ITEMS: AdventureItem[] = [
  { id: "unfinished-market-plan", name: "Unfinished Market Plan", vi: "Bản kế hoạch chợ", emoji: "🗺️", image: F + "items/unfinished-market-plan.webp" },
  { id: "stall-placement-marker", name: "Stall Placement Marker", vi: "Dấu bố trí gian hàng", emoji: "🏪", image: F + "items/stall-placement-marker.webp" },
  { id: "allergy-safety-card", name: "Allergy Safety Card", vi: "Thẻ an toàn dị ứng", emoji: "🥜", image: F + "items/allergy-safety-card.webp" },
  { id: "budget-wallet", name: "Budget Wallet", vi: "Ví ngân sách", emoji: "👛", image: F + "items/budget-wallet.webp" },
  { id: "delivery-schedule", name: "Delivery Schedule", vi: "Lịch giao hàng", emoji: "📋", image: F + "items/delivery-schedule.webp" },
  { id: "coral-market-lantern", name: "Coral Market Lantern", vi: "Đèn lồng san hô", emoji: "🏮", image: F + "items/coral-market-lantern.webp" },
  { id: "stage-microphone", name: "Stage Microphone", vi: "Micro sân khấu", emoji: "🎙️", image: F + "items/stage-microphone.webp" },
  { id: "market-organizer-pass", name: "Market Organizer Pass", vi: "Thẻ ban tổ chức", emoji: "🎟️", image: F + "items/market-organizer-pass.webp" },
  { id: "lantern-market-planner-badge", name: "Lantern Market Planner Badge", vi: "Huy hiệu Điều phối Chợ Đêm", emoji: "🏅", image: F + "items/lantern-market-planner-badge.webp" },
];

const S06_CHAPTERS: AdventureChapter[] = [
  {
    id: "s06-ch01", seasonId: "s06", chapterNumber: 1,
    title: "The Unfinished Market Plan", vi: "Bản kế hoạch còn dang dở",
    shortDescription: "Chợ đêm sắp mở nhưng bản kế hoạch vẫn còn nhiều ô trống. Maple phải xác định các nhiệm vụ quan trọng trước khi bắt tay vào làm.",
    estimatedMinutes: 6,
    node: { x: 15, y: 76, key: "market-plan" },
    sceneImage: F + "chapters/chapter-01-unfinished-market-plan.webp",
    nextChapterId: "s06-ch02",
    reward: {
      stars: 3, itemId: "unfinished-market-plan", extraItemIds: ["market-organizer-pass"],
      clueTitle: "Unfinished Market Plan",
      clueVi: "Bản kế hoạch cho thấy chợ cần hoàn thành bố trí, an toàn, ngân sách, giao hàng và sân khấu.",
    },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Ms. Rivera",
        en: "The market opens tonight, but three areas on our plan are still empty. We need a clear order of work.",
        vi: "Chợ sẽ mở tối nay nhưng ba khu trên bản kế hoạch vẫn còn trống. Chúng ta cần sắp xếp công việc theo thứ tự rõ ràng." },
      { kind: "dialogue", who: "maple",
        en: "First, I will identify what each picture card represents. Then we can decide which tasks depend on others.",
        vi: "Trước hết, mình sẽ xác định ý nghĩa của từng thẻ hình. Sau đó chúng ta có thể xem nhiệm vụ nào phụ thuộc vào nhiệm vụ khác." },
      { kind: "observation",
        prompt: "Which task cards can Maple see along the front edge of the table?",
        vi: "Maple nhìn thấy những thẻ nhiệm vụ nào ở mép trước của bàn?",
        options: [
          { label: "A stall, safety shields, coins, produce, lanterns, and a stage", correct: true, feedback: "Đúng! Sáu biểu tượng thể hiện các nhóm việc cần hoàn thành." },
          { label: "A train, a castle, and a forest", correct: false, feedback: "Đó là các thế giới của mùa trước, không nằm trên bàn kế hoạch này." },
          { label: "Only food dishes", correct: false, feedback: "Trên bàn còn có nhiều biểu tượng ngoài thực phẩm." },
        ] },
      { kind: "multipleChoice",
        prompt: "Why should the team arrange the stalls before sending deliveries?",
        vi: "Vì sao nhóm nên bố trí gian hàng trước khi giao hàng?",
        options: ["Drivers need to know where each crate belongs", "Lanterns only work before sunset", "The stage must always be built first"],
        answer: "Drivers need to know where each crate belongs",
        explainVi: "Vị trí gian hàng là thông tin đầu vào cho việc phân tuyến và giao đúng thùng hàng." },
      { kind: "arrangeSentence",
        prompt: "Maple states the first step:",
        vi: "Maple nêu bước đầu tiên:",
        solution: ["First", "we", "need", "to", "finish", "the", "market", "plan"],
        say: "First we need to finish the market plan.",
        explainVi: "First giúp người nghe nhận biết bước mở đầu trong một kế hoạch." },
      { kind: "clueReveal", title: "Market Organizer Pass", itemId: "market-organizer-pass",
        en: "Ms. Rivera gives Maple an organizer pass and the unfinished plan. The first empty area leads to the market lanes.",
        vi: "Cô Rivera trao cho Maple thẻ ban tổ chức và bản kế hoạch. Ô trống đầu tiên dẫn tới khu bố trí gian hàng." },
    ],
  },
  {
    id: "s06-ch02", seasonId: "s06", chapterNumber: 2,
    title: "A Place for Every Stall", vi: "Mỗi gian hàng một vị trí",
    shortDescription: "Maple và Kai phải giữ lối đi đủ rộng, tách đồ ăn khỏi khu rác và đặt khu thủ công ở nơi yên tĩnh.",
    estimatedMinutes: 7,
    node: { x: 34, y: 47, key: "stall-layout" },
    sceneImage: F + "chapters/chapter-02-place-for-every-stall.webp",
    nextChapterId: "s06-ch03",
    reward: {
      stars: 3, itemId: "stall-placement-marker",
      clueTitle: "Stall Placement Marker",
      clueVi: "Dấu gian hàng xác nhận một sơ đồ có lối trung tâm rộng và các khu chức năng được tách hợp lý.",
    },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Kai",
        en: "The middle path must stay wide enough for families and wheelchairs. Food preparation also needs distance from the waste bins.",
        vi: "Lối giữa phải đủ rộng cho gia đình và xe lăn. Khu chuẩn bị thức ăn cũng cần cách xa thùng rác." },
      { kind: "observation",
        prompt: "What is Kai using to check the width of the central route?",
        vi: "Kai đang dùng gì để kiểm tra độ rộng của lối trung tâm?",
        options: [
          { label: "A measuring tape", correct: true, feedback: "Chính xác! Kai đang trải thước dây dọc theo bản sơ đồ." },
          { label: "A microphone", correct: false, feedback: "Micro sẽ được dùng ở sân khấu, không dùng để đo lối đi." },
          { label: "A food tray", correct: false, feedback: "Không có khay thức ăn trong cảnh bố trí này." },
        ] },
      { kind: "multipleChoice",
        prompt: "Which location is safest for the produce stalls?",
        vi: "Vị trí nào an toàn nhất cho các gian nông sản?",
        options: ["Along the open side, away from the waste bins", "Directly beside the waste bins", "In the middle of the main walkway"],
        answer: "Along the open side, away from the waste bins",
        explainVi: "Gian thực phẩm cần tránh khu rác và không được chắn tuyến di chuyển chính." },
      { kind: "arrangeSentence",
        prompt: "Give a clear location instruction:",
        vi: "Đưa ra chỉ dẫn vị trí rõ ràng:",
        solution: ["Place", "the", "craft", "stall", "beside", "the", "garden"],
        say: "Place the craft stall beside the garden.",
        explainVi: "Beside có nghĩa là ở ngay bên cạnh một địa điểm." },
      { kind: "multipleChoice",
        prompt: "Why is an open central route better than squeezing in one more stall?",
        vi: "Vì sao giữ lối trung tâm thông thoáng tốt hơn việc nhét thêm một gian hàng?",
        options: ["It improves access and helps people move safely", "It makes every product cheaper", "It changes the weather"],
        answer: "It improves access and helps people move safely",
        explainVi: "Thiết kế tốt ưu tiên khả năng tiếp cận và an toàn, không chỉ số lượng gian hàng." },
      { kind: "clueReveal", title: "Stall Placement Marker", itemId: "stall-placement-marker",
        en: "The final marker completes the layout. The next station must check food information before menus are approved.",
        vi: "Dấu cuối hoàn thiện sơ đồ. Trạm tiếp theo phải kiểm tra thông tin thực phẩm trước khi duyệt thực đơn." },
    ],
  },
  {
    id: "s06-ch03", seasonId: "s06", chapterNumber: 3,
    title: "The Allergy Alert", vi: "Cảnh báo dị ứng",
    shortDescription: "Một khách cần tránh đậu phộng. Maple phải đọc biểu tượng thành phần và chọn món có thông tin phù hợp, thay vì đoán bằng vẻ ngoài.",
    estimatedMinutes: 7,
    node: { x: 58, y: 31, key: "allergy-check" },
    sceneImage: F + "chapters/chapter-03-allergy-alert.webp",
    nextChapterId: "s06-ch04",
    reward: {
      stars: 3, itemId: "allergy-safety-card",
      clueTitle: "Allergy Safety Card",
      clueVi: "Thẻ nhắc người bán kiểm tra thành phần, tránh nhiễm chéo và xác nhận lại khi chưa chắc chắn.",
    },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Mr. Patel",
        en: "This guest must avoid peanuts. We should use the ingredient cards and ask the cook if anything is unclear.",
        vi: "Vị khách này phải tránh đậu phộng. Chúng ta nên dùng thẻ thành phần và hỏi đầu bếp nếu có điều gì chưa rõ." },
      { kind: "observation",
        prompt: "Which dish has a card showing only vegetables?",
        vi: "Món nào có thẻ chỉ hiển thị rau củ?",
        options: [
          { label: "The vegetable noodles in the middle", correct: true, feedback: "Đúng! Thẻ phía trước món giữa có bông cải, ớt và cà rốt." },
          { label: "The peanut-topped dish on the left", correct: false, feedback: "Món bên trái có biểu tượng và phần phủ đậu phộng." },
          { label: "The dairy dessert on the right", correct: false, feedback: "Thẻ món bên phải cho thấy thành phần sữa." },
        ] },
      { kind: "multipleChoice",
        prompt: "What should Maple do if a dish has no complete ingredient card?",
        vi: "Maple nên làm gì nếu một món không có thẻ thành phần đầy đủ?",
        options: ["Ask the cook and do not guess", "Choose it because it looks fresh", "Remove the warning card"],
        answer: "Ask the cook and do not guess",
        explainVi: "Với dị ứng thực phẩm, phải xác minh thông tin thay vì suy đoán từ hình thức món ăn." },
      { kind: "arrangeSentence",
        prompt: "Ask the vendor politely:",
        vi: "Hỏi người bán một cách lịch sự:",
        solution: ["Does", "this", "dish", "contain", "any", "peanuts"],
        say: "Does this dish contain any peanuts?",
        explainVi: "Does + chủ ngữ số ít + động từ nguyên mẫu tạo câu hỏi Yes/No ở hiện tại đơn." },
      { kind: "multipleChoice",
        prompt: "Why are clear ingredient cards useful for everyone?",
        vi: "Vì sao thẻ thành phần rõ ràng hữu ích cho mọi người?",
        options: ["They help visitors make informed and safer choices", "They guarantee every dish tastes the same", "They replace the need to wash hands"],
        answer: "They help visitors make informed and safer choices",
        explainVi: "Thông tin minh bạch giúp khách lựa chọn phù hợp, nhưng không thay thế các quy trình vệ sinh." },
      { kind: "clueReveal", title: "Allergy Safety Card", itemId: "allergy-safety-card",
        en: "The food station adopts Maple's check-first rule. Now the team must buy the remaining supplies without exceeding the budget.",
        vi: "Khu ẩm thực áp dụng quy tắc kiểm tra trước của Maple. Giờ nhóm phải mua vật dụng còn thiếu mà không vượt ngân sách." },
    ],
  },
  {
    id: "s06-ch04", seasonId: "s06", chapterNumber: 4,
    title: "The Budget Puzzle", vi: "Bài toán ngân sách",
    shortDescription: "Ba gói vật dụng có giá và thành phần khác nhau. Maple cần chọn gói đáp ứng đủ yêu cầu mà vẫn còn tiền dự phòng.",
    estimatedMinutes: 7,
    node: { x: 49, y: 62, key: "market-budget" },
    sceneImage: F + "chapters/chapter-04-budget-puzzle.webp",
    nextChapterId: "s06-ch05",
    reward: {
      stars: 3, itemId: "budget-wallet",
      clueTitle: "Budget Wallet",
      clueVi: "Maple chọn gói đầy đủ với giá hợp lý và giữ lại một phần ngân sách cho tình huống bất ngờ.",
    },
    storySteps: [
      { kind: "dialogue", who: "maple",
        en: "We need at least one lantern, one decoration, and two reusable cups. The cheapest option is not useful if something essential is missing.",
        vi: "Chúng ta cần ít nhất một đèn, một món trang trí và hai cốc tái sử dụng. Phương án rẻ nhất không có ích nếu thiếu đồ thiết yếu." },
      { kind: "observation",
        prompt: "Which shelf shows one lantern, one decoration, and several reusable cups together?",
        vi: "Kệ nào có cùng lúc một đèn, một món trang trí và nhiều cốc tái sử dụng?",
        options: [
          { label: "The middle shelf", correct: true, feedback: "Đúng! Kệ giữa có đủ ba loại vật dụng cần thiết." },
          { label: "The bottom shelf", correct: false, feedback: "Kệ dưới không có cốc." },
          { label: "None of the shelves", correct: false, feedback: "Hãy nhìn lại kệ giữa: đèn, hoa trang trí và cốc đều có mặt." },
        ] },
      { kind: "multipleChoice",
        prompt: "The complete middle bundle costs three tokens. Maple has ten. Why is this a responsible choice?",
        vi: "Gói đầy đủ ở giữa giá ba token. Maple có mười. Vì sao đây là lựa chọn có trách nhiệm?",
        options: ["It meets the requirements and leaves a reserve", "It uses every token immediately", "It is the largest bundle"],
        answer: "It meets the requirements and leaves a reserve",
        explainVi: "Ngân sách tốt vừa đáp ứng nhu cầu vừa giữ một phần dự phòng, không mặc định chọn gói lớn nhất." },
      { kind: "arrangeSentence",
        prompt: "Explain the decision:",
        vi: "Giải thích quyết định:",
        solution: ["This", "bundle", "costs", "less", "and", "includes", "everything", "we", "need"],
        say: "This bundle costs less and includes everything we need.",
        explainVi: "And nối hai lý do hỗ trợ cùng một lựa chọn." },
      { kind: "multipleChoice",
        prompt: "What is the purpose of keeping some tokens in reserve?",
        vi: "Mục đích của việc giữ lại một số token dự phòng là gì?",
        options: ["To handle an unexpected need later", "To hide the real budget", "To make the market close earlier"],
        answer: "To handle an unexpected need later",
        explainVi: "Khoản dự phòng giúp kế hoạch thích ứng khi có chi phí hoặc nhu cầu bất ngờ." },
      { kind: "clueReveal", title: "Budget Wallet", itemId: "budget-wallet",
        en: "The supplies are approved and the reserve stays safe. A courier arrives, but the delivery tags have been mixed up.",
        vi: "Vật dụng được duyệt và khoản dự phòng vẫn an toàn. Một người giao hàng tới, nhưng các thẻ giao đã bị xáo trộn." },
    ],
  },
  {
    id: "s06-ch05", seasonId: "s06", chapterNumber: 5,
    title: "The Mixed-Up Delivery", vi: "Chuyến giao hàng bị xáo trộn",
    shortDescription: "Thùng rau, hoa, loa và đèn đang ở sai tuyến. Maple phải ghép biểu tượng thùng hàng với đúng cờ khu vực.",
    estimatedMinutes: 7,
    node: { x: 78, y: 68, key: "delivery-gate" },
    sceneImage: F + "chapters/chapter-05-mixed-up-delivery.webp",
    nextChapterId: "s06-ch06",
    reward: {
      stars: 3, itemId: "delivery-schedule", extraItemIds: ["coral-market-lantern"],
      clueTitle: "Delivery Schedule",
      clueVi: "Lịch giao hàng đã được sắp lại theo biểu tượng khu vực: đèn, âm thanh, hoa và thực phẩm.",
    },
    storySteps: [
      { kind: "dialogue", who: "stranger", name: "Maya",
        en: "Each flag marks a destination. Match the crate symbol to the flag before moving anything through the crowded market.",
        vi: "Mỗi lá cờ đánh dấu một điểm đến. Hãy ghép biểu tượng thùng với cờ trước khi chuyển đồ qua khu chợ đông." },
      { kind: "observation",
        prompt: "Which crate should go to the blue flag with the speaker symbol?",
        vi: "Thùng nào nên được chuyển tới lá cờ xanh có biểu tượng loa?",
        options: [
          { label: "The crate with sound equipment", correct: true, feedback: "Đúng! Biểu tượng loa trên thùng khớp với cờ khu âm thanh." },
          { label: "The flower crate", correct: false, feedback: "Thùng hoa phải đi tới lá cờ xanh lá có chậu hoa." },
          { label: "The vegetable crate", correct: false, feedback: "Rau củ thuộc khu thực phẩm, không phải sân khấu âm thanh." },
        ] },
      { kind: "multipleChoice",
        prompt: "Why should Maple check both the crate symbol and the destination flag?",
        vi: "Vì sao Maple nên kiểm tra cả biểu tượng thùng và cờ điểm đến?",
        options: ["Two matching clues reduce delivery mistakes", "The crates all contain the same thing", "Flags show how heavy a crate is"],
        answer: "Two matching clues reduce delivery mistakes",
        explainVi: "Đối chiếu hai nguồn thông tin giúp phát hiện lỗi trước khi vận chuyển." },
      { kind: "arrangeSentence",
        prompt: "Give the courier an instruction:",
        vi: "Đưa cho người giao hàng một chỉ dẫn:",
        solution: ["Please", "take", "the", "lantern", "crate", "to", "the", "stage"],
        say: "Please take the lantern crate to the stage.",
        explainVi: "Please làm câu mệnh lệnh lịch sự hơn; to chỉ điểm đến." },
      { kind: "multipleChoice",
        prompt: "Which delivery should be handled first if the stage opens soon?",
        vi: "Nếu sân khấu sắp mở, chuyến giao nào nên được xử lý trước?",
        options: ["The sound equipment needed for the programme", "Extra flowers for a finished stall", "Empty crates returning to storage"],
        answer: "The sound equipment needed for the programme",
        explainVi: "Ưu tiên dựa vào thời hạn và mức độ phụ thuộc: chương trình không thể bắt đầu nếu thiếu âm thanh." },
      { kind: "clueReveal", title: "Delivery Schedule", itemId: "delivery-schedule",
        en: "Every crate reaches the correct zone. Maya gives Maple the final coral lantern for the opening ceremony.",
        vi: "Mọi thùng hàng tới đúng khu. Maya trao cho Maple chiếc đèn lồng san hô cuối cùng cho lễ khai mạc." },
    ],
  },
  {
    id: "s06-ch06", seasonId: "s06", chapterNumber: 6,
    title: "Lights On, Market Open!", vi: "Thắp đèn, mở hội!",
    shortDescription: "Maple kiểm tra lần cuối, đưa ra thông báo khai mạc rõ ràng và giải thích cách cả nhóm tạo nên một khu chợ an toàn, thân thiện.",
    estimatedMinutes: 8,
    node: { x: 84, y: 18, key: "market-opening" },
    sceneImage: F + "chapters/chapter-06-lights-on-market-open.webp",
    reward: {
      stars: 3, itemId: "stage-microphone", extraItemIds: ["lantern-market-planner-badge"],
      clueTitle: "Lantern Market Planner Badge",
      clueVi: "Maple nhận huy hiệu vì đã biến một bản kế hoạch dang dở thành khu chợ dễ tiếp cận, an toàn và sẵn sàng đón khách.",
    },
    storySteps: [
      { kind: "dialogue", who: "narrator",
        en: "The lanterns glow above clear paths. Ingredient cards are visible, the deliveries are complete, and families gather near the stage.",
        vi: "Đèn lồng sáng trên những lối đi thông thoáng. Thẻ thành phần đã hiển thị, hàng đã giao đủ và các gia đình tập trung gần sân khấu." },
      { kind: "observation",
        prompt: "Which details show that the market is ready to open?",
        vi: "Những chi tiết nào cho thấy khu chợ đã sẵn sàng mở cửa?",
        options: [
          { label: "Lit lanterns, open stalls, a clear stage, and arriving visitors", correct: true, feedback: "Đúng! Nhiều khu vực cùng cho thấy công việc chuẩn bị đã hoàn tất." },
          { label: "Closed stalls and empty paths", correct: false, feedback: "Các gian hàng đang mở và đã có rất nhiều khách." },
          { label: "Unsorted crates blocking the entrance", correct: false, feedback: "Các thùng đã được chuyển khỏi lối vào." },
        ] },
      { kind: "multipleChoice",
        prompt: "Which opening message is clearest and most useful?",
        vi: "Thông báo khai mạc nào rõ ràng và hữu ích nhất?",
        options: [
          "Welcome! Please keep the central path clear and check food information before ordering.",
          "Everything is somewhere, so have fun.",
          "The market is open, but we cannot answer questions.",
        ],
        answer: "Welcome! Please keep the central path clear and check food information before ordering.",
        explainVi: "Thông báo tốt vừa chào đón vừa cung cấp hai hướng dẫn quan trọng cho khách." },
      { kind: "arrangeSentence",
        prompt: "Maple thanks the team:",
        vi: "Maple cảm ơn cả nhóm:",
        solution: ["We", "solved", "each", "problem", "by", "sharing", "clear", "information"],
        say: "We solved each problem by sharing clear information.",
        explainVi: "By + V-ing mô tả cách một kết quả được đạt tới." },
      { kind: "multipleChoice",
        prompt: "What connected all six market challenges?",
        vi: "Điều gì kết nối cả sáu thử thách ở khu chợ?",
        options: ["Making decisions from clear information and other people's needs", "Always choosing the most expensive option", "Working without a plan"],
        answer: "Making decisions from clear information and other people's needs",
        explainVi: "Mọi quyết định đều dựa trên thông tin, giới hạn thực tế và nhu cầu của cộng đồng." },
      { kind: "dialogue", who: "maple",
        en: "A welcoming place is not made by lanterns alone. It works because people can understand the plan and take part safely.",
        vi: "Một nơi thân thiện không chỉ được tạo nên bởi đèn lồng. Nó hoạt động vì mọi người hiểu kế hoạch và có thể tham gia an toàn." },
      { kind: "clueReveal", title: "Lantern Market Planner Badge", itemId: "lantern-market-planner-badge",
        en: "Ms. Rivera awards Maple the Lantern Market Planner Badge. The market opens, and the last lantern shines above the stage.",
        vi: "Cô Rivera trao cho Maple Huy hiệu Điều phối Chợ Đêm. Khu chợ mở cửa và chiếc đèn cuối cùng tỏa sáng trên sân khấu." },
    ],
  },
];

export const SEASON_LANTERN_MARKET: AdventureSeason = {
  id: "s06",
  title: "The Lantern Market Challenge",
  vi: "Thử thách Chợ Đèn Lồng",
  subtitle: "Lập kế hoạch, xử lý thông tin và cùng cộng đồng đưa một khu chợ đêm Vancouver vào hoạt động.",
  mapImage: F + "map/season-06-lantern-market-map.webp",
  chapters: S06_CHAPTERS,
  items: S06_ITEMS,
  itemsTagline: "Thu thập chín công cụ để hoàn thiện kế hoạch và khai mạc khu chợ đèn lồng.",
};

export const SEASONS: AdventureSeason[] = [
  SEASON_LOST_COMPASS,
  SEASON_SILENT_SIGNAL,
  SEASON_SKY_GARDEN,
  SEASON_MOUNTAIN_WEATHER,
  SEASON_STORY_ATLAS,
  SEASON_LANTERN_MARKET,
];
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
