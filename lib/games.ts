// Metadata & type dùng chung cho khu Practice (bốn game) + sticker + Echo.
// Dữ liệu câu hỏi thực nằm ở lib/scenes.ts (Picture Detective, Build the Description)
// và lib/banks.ts (Sentence Puzzle, English Riddles). Adventure là module riêng (lib/adventures.ts).
import type { Difficulty } from "./gameplay";

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
  { id: "st-pencil", emoji: "✍️", name: "Cây bút nhí" },
  { id: "st-grammar", emoji: "🧭", name: "Nhà ngữ pháp" },
];
export const stickerById = (id: string) => STICKERS.find((s) => s.id === id);

/* ---------- GAME: danh mục khu Practice ---------- */
export type GameKind = "picdet" | "puzzle" | "riddle" | "listen" | "write" | "grammar";
// Loại phiên chơi do GamePlay điều phối: các game chính + Echo (luyện nói tùy chọn).
export type StopKind = GameKind | "echo";

export type GameInfo = {
  id: GameKind; name: string; vi: string; emoji: string; image?: string; tint: string; blurb: string; assetNote: string;
};
export const GAMES: GameInfo[] = [
  { id: "picdet", name: "Picture Detective", vi: "Thám tử hình ảnh", emoji: "🔎", image: "/assets/images/gen/game-picdet.webp", tint: "#e9f6ff",
    blurb: "Quan sát, suy luận, mô tả rồi nói theo Maple — tất cả trên một bức tranh.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "puzzle", name: "Sentence Puzzle", vi: "Xếp câu", emoji: "🧩", image: "/assets/images/gen/game-puzzle.webp", tint: "#f1e9ff",
    blurb: "Xếp các từ thành câu đúng ngữ pháp theo chủ đề.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "riddle", name: "English Riddles", vi: "Đố vui tiếng Anh", emoji: "🦉", image: "/assets/images/gen/game-riddle.webp", tint: "#e5f9ee",
    blurb: "Đọc/nghe manh mối rồi chọn đáp án, luyện đọc hiểu.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "listen", name: "Listen & Choose", vi: "Nghe & chọn", emoji: "🎧", image: "/assets/images/gen/game-listen.webp", tint: "#eaf3ff",
    blurb: "Nghe Maple đọc câu rồi chọn nghĩa đúng — luyện tai nghe.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "write", name: "Writing Coach", vi: "Luyện viết câu", emoji: "✍️", image: "/assets/images/gen/game-writing.webp", tint: "#fff1e2",
    blurb: "Viết câu tiếng Anh theo khung gợi ý — Maple chấm từng tiêu chí.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "grammar", name: "Grammar Path", vi: "Trục ngữ pháp", emoji: "🧭", tint: "#eef0ff",
    blurb: "Học quy tắc rồi luyện theo trục: các thì → câu hỏi → so sánh. Ôn thi cấp 2.", assetNote: "Thumbnail 4:3 · 800×600 (chưa có, dùng emoji)" },
];
export const gameInfo = (id: GameKind) => GAMES.find((g) => g.id === id)!;

// Sticker theo game-type (MVP): tặng MỘT LẦN khi khám phá hết câu/task của một topic bất kỳ thuộc game đó.
export const STICKER_FOR_GAME: Record<GameKind, string> = {
  picdet: "st-detective", puzzle: "st-puzzle", riddle: "st-owl", listen: "st-star", write: "st-pencil", grammar: "st-grammar",
};

// Bốn sticker còn lại cũng thuộc Practice, mở theo tổng số lượt chơi.
// Nếu một lượt đồng thời hoàn tất topic, sticker theo game được ưu tiên; sticker mốc chờ lượt sau.
export const PRACTICE_MILESTONE_STICKERS = [
  { plays: 5, id: "st-mic" },
  { plays: 10, id: "st-map" },
  { plays: 20, id: "st-maple" },
  { plays: 30, id: "st-crown" },
];
// Số câu/task mỗi lượt theo game. picdet gộp 2 hoạt động nên lấy 6 câu/lượt.
// Viết tốn sức hơn trắc nghiệm nên mỗi lượt chỉ 4 bài.
export const ROUND_SIZE: Record<GameKind, number> = { picdet: 6, puzzle: 6, riddle: 5, listen: 5, write: 4, grammar: 6 };

/* ---------- Kiểu dữ liệu ngân hàng chữ (dùng bởi lib/banks.ts) ---------- */
export type Puzzle = { id: string; solution: string[]; vi: string; difficulty?: Difficulty; grammarFocus?: string };
export type PuzzleSet = { id: string; title: string; items: Puzzle[] };
export type Riddle = { id: string; text: string; hint: string; options: string[]; answer: string; vi: string; difficulty?: Difficulty };
export type RiddleSet = { id: string; title: string; items: Riddle[] };
// Listen & Choose: nghe `say` (câu tiếng Anh) → chọn nghĩa đúng trong `options` (tiếng Việt).
export type ListenItem = { id: string; say: string; options: string[]; answer: string; difficulty?: Difficulty };
export type ListenSet = { id: string; title: string; items: ListenItem[] };

/* ---------- Echo Challenge (luyện nói tùy chọn, KHÔNG chấm điểm) ---------- */
export type EchoPhrase = { en: string; vi: string };
export const ECHO: EchoPhrase[] = [
  { en: "Good morning!", vi: "Chào buổi sáng!" },
  { en: "How are you today?", vi: "Hôm nay bạn khoẻ không?" },
  { en: "My name is Maple.", vi: "Mình tên là Maple." },
  { en: "I like ice cream.", vi: "Mình thích kem." },
  { en: "Let's play together!", vi: "Cùng chơi nào!" },
  { en: "See you tomorrow!", vi: "Hẹn gặp lại ngày mai!" },
];
