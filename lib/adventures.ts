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
  itemId?: string;        // vật phẩm câu chuyện nhận được (một lần)
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

// Vật phẩm câu chuyện (compass + các mảnh + manh mối dọc đường). Chưa có ảnh → emoji.
const S01_ITEMS: AdventureItem[] = [
  { id: "compass-base", name: "Maple's Compass", vi: "La bàn của Maple", emoji: "🧭", planned: true },
  { id: "compass-piece-01", name: "Compass Piece 1", vi: "Mảnh la bàn 1", emoji: "🧩", planned: true },
  { id: "compass-piece-02", name: "Compass Piece 2", vi: "Mảnh la bàn 2", emoji: "🧩", planned: true },
  { id: "compass-piece-03", name: "Compass Piece 3", vi: "Mảnh la bàn 3", emoji: "🧩", planned: true },
  { id: "wet-postcard", name: "Wet Postcard", vi: "Tấm bưu thiếp ướt", emoji: "✉️" },
  { id: "ferry-ticket", name: "Ferry Ticket", vi: "Vé phà", emoji: "🎫" },
  { id: "forest-map", name: "Forest Map", vi: "Bản đồ khu rừng", emoji: "🗺️" },
];

const S01_CHAPTERS: AdventureChapter[] = [
  /* ---------------- Chapter 1 — The Message at the Harbour ---------------- */
  {
    id: "s01-ch01", seasonId: "s01", chapterNumber: 1,
    title: "The Message at the Harbour", vi: "Lời nhắn ở bến cảng",
    shortDescription: "Maple đến bến cảng tìm la bàn của ông và bắt gặp một lời nhắn lạ.",
    estimatedMinutes: 5,
    node: { x: 15, y: 70, key: "harbour-message" },
    sceneImage: A + "chapters/chapter-01-harbour-message.webp",
    nextChapterId: "s01-ch02",
    reward: { stars: 3, itemId: "wet-postcard", clueTitle: "Wet Postcard", clueVi: "Một tấm bưu thiếp ướt chỉ về phía những chuyến phà." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "It is a bright morning at the harbour. Boats rock gently on the water.",
        vi: "Một buổi sáng nắng đẹp ở bến cảng. Những con thuyền dập dềnh trên mặt nước." },
      { kind: "dialogue", who: "maple", en: "Grandpa's compass is missing. His last letter said to start here, at the harbour.",
        vi: "La bàn của ông bị mất. Lá thư cuối của ông dặn hãy bắt đầu từ đây, ở bến cảng." },
      { kind: "observation",
        prompt: "Look at the harbour. Where might someone leave a message for Maple?",
        vi: "Nhìn bến cảng. Người ta có thể để lại lời nhắn cho Maple ở đâu?",
        options: [
          { label: "On the old notice board by the docks", correct: true, feedback: "Đúng rồi! Bảng tin (notice board) là nơi mọi người dán thông báo và lời nhắn." },
          { label: "Under the deep water", correct: false, feedback: "Dưới nước sâu thì không ai đọc được lời nhắn đâu." },
          { label: "High up in the clouds", correct: false, feedback: "Trên mây thì Maple không với tới được." },
        ] },
      { kind: "multipleChoice",
        prompt: "The note on the board says: \"Follow the water to the island. Take the boat that leaves at nine.\" What should Maple do next?",
        vi: "Lời nhắn viết: \"Đi theo dòng nước ra đảo. Bắt chuyến thuyền khởi hành lúc chín giờ.\" Maple nên làm gì tiếp theo?",
        options: ["Take a boat to the island", "Go back home and sleep", "Stay at the harbour all day"],
        answer: "Take a boat to the island",
        explainVi: "\"Follow the water to the island\" nghĩa là đi thuyền ra đảo — nên Maple cần bắt thuyền." },
      { kind: "arrangeSentence",
        prompt: "Maple wants to ask the sailor for help. Put the words in order:",
        vi: "Maple muốn nhờ người thuỷ thủ giúp. Hãy xếp các từ thành câu:",
        solution: ["Which", "boat", "goes", "to", "the", "island"],
        say: "Which boat goes to the island?",
        explainVi: "Câu hỏi bắt đầu bằng \"Which\" để hỏi chọn cái nào trong nhiều lựa chọn." },
      { kind: "clueReveal", title: "Wet Postcard", itemId: "wet-postcard",
        en: "Tucked behind the note is a wet postcard with a picture of a ferry. The next stop is the ferry dock!",
        vi: "Nấp sau lời nhắn là một tấm bưu thiếp ướt in hình chiếc phà. Điểm đến tiếp theo là bến phà!" },
    ],
  },

  /* ---------------- Chapter 2 — The Wrong Ferry ---------------- */
  {
    id: "s01-ch02", seasonId: "s01", chapterNumber: 2,
    title: "The Wrong Ferry", vi: "Nhầm chuyến phà",
    shortDescription: "Có hai chuyến phà cùng rời bến. Maple phải chọn đúng chuyến kẻo lạc đường.",
    estimatedMinutes: 6,
    node: { x: 49, y: 79, key: "wrong-ferry" },
    sceneImage: A + "chapters/chapter-02-wrong-ferry.webp",
    nextChapterId: "s01-ch03",
    reward: { stars: 3, itemId: "ferry-ticket", clueTitle: "Ferry Ticket", clueVi: "Tấm vé phà đúng chuyến, đưa Maple tới bìa rừng." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "At the ferry dock, two ferries are almost ready to leave. Their engines are humming.",
        vi: "Ở bến phà, hai chuyến phà gần như sẵn sàng rời bến. Động cơ đang kêu ù ù." },
      { kind: "dialogue", who: "stranger", name: "Ferry worker", en: "Hurry! One ferry goes to Pine Island. The other goes the wrong way, back to the city.",
        vi: "Nhanh lên! Một phà đi đảo Pine, phà kia đi ngược về thành phố đó." },
      { kind: "multipleChoice",
        prompt: "The sign reads: \"Ferry A — Pine Island, 9:00. Ferry B — City Centre, 9:05.\" Which ferry should Maple take?",
        vi: "Biển ghi: \"Phà A — Đảo Pine, 9:00. Phà B — Trung tâm thành phố, 9:05.\" Maple nên đi phà nào?",
        options: ["Ferry A to Pine Island", "Ferry B to City Centre", "Neither ferry"],
        answer: "Ferry A to Pine Island",
        explainVi: "Lời nhắn ở chương trước bảo ra đảo, nên Maple chọn Phà A đi Pine Island." },
      { kind: "observation",
        prompt: "Look at the picture. How can Maple be sure she is at Ferry A?",
        vi: "Nhìn tranh. Làm sao Maple chắc chắn mình đang ở Phà A?",
        options: [
          { label: "Read the letter 'A' and 'Pine Island' on the boat", correct: true, feedback: "Chính xác! Đọc chữ trên phà là cách chắc chắn nhất." },
          { label: "Guess and jump on the closest one", correct: false, feedback: "Đoán bừa dễ khiến Maple lên nhầm phà." },
          { label: "Ask nobody and hope for the best", correct: false, feedback: "Không kiểm tra thì rất dễ đi sai đường." },
        ] },
      { kind: "arrangeSentence",
        prompt: "Maple double-checks with the worker. Put the words in order:",
        vi: "Maple hỏi lại người nhân viên cho chắc. Hãy xếp các từ:",
        solution: ["Does", "this", "ferry", "go", "to", "Pine", "Island"],
        say: "Does this ferry go to Pine Island?",
        explainVi: "Câu hỏi Yes/No với động từ thường dùng \"Does\" đứng đầu." },
      { kind: "clueReveal", title: "Ferry Ticket", itemId: "ferry-ticket",
        en: "The worker stamps Maple's ticket for Pine Island. On the island, a forest trail begins.",
        vi: "Nhân viên đóng dấu vé đi đảo Pine cho Maple. Trên đảo, một con đường rừng bắt đầu." },
    ],
  },

  /* ---------------- Chapter 3 — Footprints in the Forest ---------------- */
  {
    id: "s01-ch03", seasonId: "s01", chapterNumber: 3,
    title: "Footprints in the Forest", vi: "Dấu chân trong rừng",
    shortDescription: "Trên đảo Pine, Maple lần theo những dấu chân lạ dẫn sâu vào rừng.",
    estimatedMinutes: 6,
    node: { x: 27, y: 43, key: "forest-footprints" },
    sceneImage: A + "chapters/chapter-03-forest-footprints.webp",
    nextChapterId: "s01-ch04",
    reward: { stars: 3, itemId: "forest-map", clueTitle: "Forest Map", clueVi: "Một tấm bản đồ rừng vẽ tay, đánh dấu một căn nhà gỗ nhỏ." },
    storySteps: [
      { kind: "dialogue", who: "narrator", en: "The forest is cool and quiet. Sunlight falls between the tall pine trees.",
        vi: "Khu rừng mát mẻ và yên tĩnh. Ánh nắng lọt qua những cây thông cao." },
      { kind: "observation",
        prompt: "Maple sees marks on the ground. What are they?",
        vi: "Maple thấy những vết trên mặt đất. Đó là gì?",
        options: [
          { label: "Footprints leading deeper into the forest", correct: true, feedback: "Đúng! Footprints (dấu chân) cho biết có ai đó đã đi qua đây." },
          { label: "Colourful flowers in a straight line", correct: false, feedback: "Hoa thì không tạo thành một lối đi có hướng như vậy." },
          { label: "Falling snow", correct: false, feedback: "Trời đang nắng, không có tuyết trong tranh." },
        ] },
      { kind: "multipleChoice",
        prompt: "The footprints are small and fresh, and they point away from the beach. What can Maple guess?",
        vi: "Những dấu chân nhỏ và còn mới, hướng ra xa bãi biển. Maple có thể suy ra điều gì?",
        options: ["Someone walked into the forest a short time ago", "The footprints are a hundred years old", "A big truck drove past"],
        answer: "Someone walked into the forest a short time ago",
        explainVi: "\"Fresh\" (còn mới) và \"small\" (nhỏ) cho thấy một người vừa đi bộ vào rừng gần đây." },
      { kind: "arrangeSentence",
        prompt: "Maple calls out to whoever is ahead. Put the words in order:",
        vi: "Maple gọi với theo người phía trước. Hãy xếp các từ:",
        solution: ["Is", "anyone", "in", "the", "forest"],
        say: "Is anyone in the forest?",
        explainVi: "Câu hỏi bắt đầu bằng \"Is\" khi hỏi về \"anyone\" (có ai không)." },
      { kind: "dialogue", who: "maple", en: "The footprints lead to a small wooden cabin. I should look there next.",
        vi: "Những dấu chân dẫn tới một căn nhà gỗ nhỏ. Mình nên tìm ở đó tiếp theo." },
      { kind: "clueReveal", title: "Forest Map", itemId: "forest-map",
        en: "Under a rock, Maple finds a hand-drawn forest map. A little cabin is circled in red.",
        vi: "Dưới một tảng đá, Maple tìm thấy tấm bản đồ rừng vẽ tay. Một căn nhà gỗ nhỏ được khoanh đỏ." },
    ],
  },

  /* ---------------- Chapters 4–8 — đã đặt chỗ trên bản đồ, chưa mở nội dung ---------------- */
  { id: "s01-ch04", seasonId: "s01", chapterNumber: 4, title: "The Cabin Clue", vi: "Manh mối trong căn nhà gỗ",
    shortDescription: "Điều gì đang chờ trong căn nhà gỗ giữa rừng?", estimatedMinutes: 6,
    node: { x: 59, y: 58, key: "cabin-clue" } },
  { id: "s01-ch05", seasonId: "s01", chapterNumber: 5, title: "The Museum Mystery", vi: "Bí ẩn bảo tàng",
    shortDescription: "Một hiện vật trong bảo tàng nắm giữ mảnh ghép tiếp theo.", estimatedMinutes: 7,
    node: { x: 56, y: 29, key: "museum-mystery" } },
  { id: "s01-ch06", seasonId: "s01", chapterNumber: 6, title: "The Stormy Waterfront", vi: "Bến nước trong bão",
    shortDescription: "Cơn bão kéo đến khi Maple tới gần bờ nước.", estimatedMinutes: 7,
    node: { x: 71, y: 30, key: "stormy-waterfront" } },
  { id: "s01-ch07", seasonId: "s01", chapterNumber: 7, title: "The Lighthouse Code", vi: "Mật mã ngọn hải đăng",
    shortDescription: "Ánh đèn hải đăng nhấp nháy như đang gửi một thông điệp.", estimatedMinutes: 7,
    node: { x: 84, y: 59, key: "lighthouse-code" } },
  { id: "s01-ch08", seasonId: "s01", chapterNumber: 8, title: "The Hidden Garden", vi: "Khu vườn bí mật",
    shortDescription: "Chặng cuối: khu vườn giấu kín nơi la bàn được ghép lại.", estimatedMinutes: 8,
    node: { x: 84, y: 25, key: "hidden-garden" } },
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
