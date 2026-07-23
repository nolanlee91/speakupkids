// Nội dung game & bản đồ phiêu lưu cho SpeakUp Kids.
// Ảnh minh hoạ thật sẽ thay các "scene emoji" sau — mỗi scene có assetNote ghi rõ tỷ lệ/kích thước.

/* ---------- STICKER (bộ sưu tập) ---------- */
export type Sticker = { id: string; emoji: string; name: string };
export const STICKERS: Sticker[] = [
  { id: "st-detective", emoji: "🔎", name: "Thám tử nhí" },
  { id: "st-owl", emoji: "🦉", name: "Cú thông thái" },
  { id: "st-puzzle", emoji: "🧩", name: "Bậc thầy xếp câu" },
  { id: "st-star", emoji: "🌟", name: "Ngôi sao biết nói" },
  { id: "st-mic", emoji: "🎤", name: "Giọng ca nhí" },
  { id: "st-map", emoji: "🗺️", name: "Nhà thám hiểm" },
  { id: "st-maple", emoji: "🍁", name: "Bạn của Maple" },
  { id: "st-crown", emoji: "👑", name: "Vua từ vựng" },
];
export const stickerById = (id: string) => STICKERS.find((s) => s.id === id);

/* ---------- GAME: danh mục khu Trò chơi ---------- */
export type GameKind = "picdet" | "puzzle" | "riddle" | "talk";
export type GameInfo = {
  id: GameKind; name: string; vi: string; emoji: string; image?: string; tint: string; blurb: string; assetNote: string;
};
export const GAMES: GameInfo[] = [
  { id: "picdet", name: "Picture Detective", vi: "Thám tử hình ảnh", emoji: "🔎", image: "/assets/images/gen/game-picdet.webp", tint: "#e9f6ff",
    blurb: "Quan sát tranh, đọc hiểu và suy luận để tìm đáp án.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "talk", name: "Describe the Picture", vi: "Xây câu từ hình ảnh", emoji: "💬", image: "/assets/images/gen/game-talk.webp", tint: "#ffece3",
    blurb: "Chọn từ, điền từ và xếp câu để mô tả bức tranh.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "puzzle", name: "Sentence Puzzle", vi: "Xếp câu", emoji: "🧩", image: "/assets/images/gen/game-puzzle.webp", tint: "#f1e9ff",
    blurb: "Xếp các từ thành câu đúng ngữ pháp.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "riddle", name: "English Riddles", vi: "Đố vui tiếng Anh", emoji: "🦉", image: "/assets/images/gen/game-riddle.webp", tint: "#e5f9ee",
    blurb: "Giải câu đố từ manh mối, luyện đọc hiểu.", assetNote: "Thumbnail 4:3 · 800×600" },
];
export const gameInfo = (id: GameKind) => GAMES.find((g) => g.id === id)!;

/* ---------- Picture Detective ---------- */
export type PicQ = { q: string; vi: string; options: string[]; answer: string };
export type PicScene = { id: string; title: string; vi: string; image?: string; emojis: string[]; assetNote: string; questions: PicQ[] };
export const PICDET: PicScene[] = [
  {
    id: "pd-park", title: "At the Park", vi: "Ở công viên", image: "/assets/images/gen/scene-park.webp",
    emojis: ["🌳", "☀️", "🐕", "🐦", "⚽", "🧒", "👧", "🌷", "🪑", "🦋"],
    assetNote: "Ảnh cảnh công viên 4:3 · 1600×1200 — thay cho ô emoji này",
    questions: [
      { q: "What is the weather like?", vi: "Thời tiết thế nào?", options: ["It is sunny.", "It is rainy.", "It is snowy."], answer: "It is sunny." },
      { q: "How many dogs can you see?", vi: "Bạn thấy mấy chú chó?", options: ["One", "Two", "Three"], answer: "One" },
      { q: "What are the children playing with?", vi: "Các bạn nhỏ chơi gì?", options: ["A ball", "A kite", "A book"], answer: "A ball" },
      { q: "Which animals can you see?", vi: "Bạn thấy con vật nào?", options: ["A dog and a bird", "A cat and a fish", "A lion and a bear"], answer: "A dog and a bird" },
    ],
  },
  {
    id: "pd-kitchen", title: "In the Kitchen", vi: "Trong bếp", image: "/assets/images/gen/scene-kitchen.webp",
    emojis: ["🍎", "🍌", "🥕", "🥛", "🍞", "🧀", "🍳", "👩‍🍳", "🍽️", "🫖"],
    assetNote: "Ảnh cảnh nhà bếp 4:3 · 1600×1200",
    questions: [
      { q: "How many fruits can you see?", vi: "Có mấy loại trái cây?", options: ["Two", "Four", "Five"], answer: "Two" },
      { q: "What is red?", vi: "Vật nào màu đỏ?", options: ["The apple", "The milk", "The bread"], answer: "The apple" },
      { q: "Who is cooking?", vi: "Ai đang nấu ăn?", options: ["The cook", "The dog", "The baby"], answer: "The cook" },
    ],
  },
];
export const picSceneById = (id: string) => PICDET.find((s) => s.id === id);

/* ---------- Sentence Puzzle ---------- */
export type Puzzle = { id: string; solution: string[]; vi: string };
export type PuzzleSet = { id: string; title: string; items: Puzzle[] };
export const PUZZLES: PuzzleSet[] = [
  {
    id: "puzzle-everyday", title: "Everyday Sentences",
    items: [
      { id: "p1", solution: ["The", "cat", "is", "sleeping"], vi: "Con mèo đang ngủ." },
      { id: "p2", solution: ["I", "like", "red", "apples"], vi: "Mình thích táo đỏ." },
      { id: "p3", solution: ["They", "are", "playing", "soccer"], vi: "Các bạn đang chơi bóng đá." },
      { id: "p4", solution: ["She", "is", "reading", "a", "book"], vi: "Bạn ấy đang đọc sách." },
    ],
  },
];
export const puzzleSetById = (id: string) => PUZZLES.find((s) => s.id === id);

/* ---------- English Riddles ---------- */
export type Riddle = { id: string; text: string; hint: string; options: string[]; answer: string; vi: string };
export type RiddleSet = { id: string; title: string; items: Riddle[] };
export const RIDDLES: RiddleSet[] = [
  {
    id: "riddle-animals", title: "Animal & Food Riddles",
    items: [
      { id: "r1", text: "I am yellow. Monkeys like me. I am a fruit. What am I?", hint: "🍌", options: ["Banana", "Apple", "Carrot"], answer: "Banana", vi: "Mình màu vàng, khỉ thích ăn mình, mình là trái cây." },
      { id: "r2", text: "I say 'moo'. I give milk. What am I?", hint: "🐄", options: ["Cow", "Cat", "Duck"], answer: "Cow", vi: "Mình kêu 'ụm bò', mình cho sữa." },
      { id: "r3", text: "I am small. I can fly. I make honey. What am I?", hint: "🐝", options: ["Bee", "Bird", "Fly"], answer: "Bee", vi: "Mình nhỏ, biết bay, làm ra mật ong." },
      { id: "r4", text: "I live in the sea. I have big claws. I am red. What am I?", hint: "🦀", options: ["Crab", "Fish", "Frog"], answer: "Crab", vi: "Mình sống ở biển, có càng to, màu đỏ." },
    ],
  },
];
export const riddleSetById = (id: string) => RIDDLES.find((s) => s.id === id);

/* ---------- Echo Challenge (Shadowing rút gọn, không ghi âm) ---------- */
export type EchoPhrase = { en: string; vi: string };
export const ECHO: EchoPhrase[] = [
  { en: "Good morning!", vi: "Chào buổi sáng!" },
  { en: "How are you today?", vi: "Hôm nay bạn khoẻ không?" },
  { en: "My name is Maple.", vi: "Mình tên là Maple." },
  { en: "I like ice cream.", vi: "Mình thích kem." },
  { en: "Let's play together!", vi: "Cùng chơi nào!" },
  { en: "See you tomorrow!", vi: "Hẹn gặp lại ngày mai!" },
];

/* ---------- Bản đồ Phiêu lưu ---------- */
export type StopKind = "picdet" | "puzzle" | "riddle" | "talk" | "echo" | "shadow";
export type Stop = { id: string; kind: StopKind; ref?: string; label: string; vi: string; sticker: string };
export type World = {
  id: string; name: string; vi: string; emoji: string; tint: string; ready: boolean; sub: string; stops: Stop[];
};
export const WORLDS: World[] = [
  {
    id: "everyday-town", name: "Everyday Town", vi: "Phố Ngày Thường", emoji: "🏙️", tint: "#fff6df",
    ready: true, sub: "Từ vựng & câu nói mỗi ngày",
    stops: [
      { id: "et1", kind: "picdet", ref: "park", label: "Park Detective", vi: "Thám tử công viên", sticker: "st-detective" },
      { id: "et2", kind: "riddle", ref: "animals", label: "Animal Riddles", vi: "Đố vui con vật", sticker: "st-owl" },
      { id: "et3", kind: "puzzle", ref: "daily", label: "Sentence Puzzle", vi: "Xếp câu", sticker: "st-puzzle" },
      { id: "et4", kind: "talk", ref: "park", label: "Picture Talk", vi: "Mô tả công viên", sticker: "st-star" },
      { id: "et5", kind: "echo", label: "Echo with Maple", vi: "Nói theo Maple", sticker: "st-mic" },
    ],
  },
  {
    id: "school", name: "School Adventure", vi: "Cuộc phiêu lưu ở trường", emoji: "🏫", tint: "#e9f6ff",
    ready: false, sub: "Bạn bè, lớp học, đồ dùng", stops: [],
  },
  {
    id: "forest", name: "Mystery Forest", vi: "Khu rừng bí ẩn", emoji: "🌲", tint: "#e5f9ee",
    ready: false, sub: "Con vật & thiên nhiên", stops: [],
  },
  {
    id: "vancouver", name: "Vancouver Journey", vi: "Hành trình Vancouver", emoji: "🍁", tint: "#ffece3",
    ready: false, sub: "Cuộc sống ở Canada", stops: [],
  },
  {
    id: "story", name: "Story Kingdom", vi: "Vương quốc truyện", emoji: "📖", tint: "#f1e9ff",
    ready: false, sub: "Kể chuyện & phiêu lưu", stops: [],
  },
  {
    id: "space", name: "Space Mission", vi: "Nhiệm vụ vũ trụ", emoji: "🚀", tint: "#eae7ff",
    ready: false, sub: "Thử thách nói tự tin", stops: [],
  },
];
export const worldById = (id: string) => WORLDS.find((w) => w.id === id);

// Bài shadowing gắn với thế giới (dùng cho stop kind "shadow" nếu cần) — hiện Echo thay thế.
export const SHADOW_LESSON: Record<string, string> = { "everyday-town": "like" };
