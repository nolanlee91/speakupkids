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
// Chưa có file ảnh → dùng emoji/silhouette trung tính; KHÔNG tham chiếu asset chưa tồn tại.
export type AdventureItem = { id: string; name: string; vi: string; emoji: string; planned?: boolean };

export type AdventureSeason = {
  id: string;
  title: string;          // tên tiếng Anh của mùa
  vi: string;             // tên tiếng Việt
  subtitle: string;       // câu giới thiệu ngắn
  mapImage: string;       // ảnh bản đồ (chỉ nền)
  chapters: AdventureChapter[];
  items: AdventureItem[];  // bộ vật phẩm câu chuyện dự kiến của mùa
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
};

export const SEASONS: AdventureSeason[] = [SEASON_LOST_COMPASS];
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
