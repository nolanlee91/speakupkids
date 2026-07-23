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
];
export const stickerById = (id: string) => STICKERS.find((s) => s.id === id);

/* ---------- GAME: danh mục khu Practice ---------- */
export type GameKind = "picdet" | "puzzle" | "riddle" | "talk";
// Loại phiên chơi do GamePlay điều phối: bốn game chính + Echo (luyện nói tùy chọn).
export type StopKind = GameKind | "echo";

export type GameInfo = {
  id: GameKind; name: string; vi: string; emoji: string; image?: string; tint: string; blurb: string; assetNote: string;
};
export const GAMES: GameInfo[] = [
  { id: "picdet", name: "Picture Detective", vi: "Thám tử hình ảnh", emoji: "🔎", image: "/assets/images/gen/game-picdet.webp", tint: "#e9f6ff",
    blurb: "Quan sát, tìm vị trí, so sánh và suy luận từ bức tranh.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "talk", name: "Build the Description", vi: "Xây câu từ hình ảnh", emoji: "💬", image: "/assets/images/gen/game-talk.webp", tint: "#ffece3",
    blurb: "Chọn từ, điền từ, dùng giới từ và xếp câu mô tả tranh.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "puzzle", name: "Sentence Puzzle", vi: "Xếp câu", emoji: "🧩", image: "/assets/images/gen/game-puzzle.webp", tint: "#f1e9ff",
    blurb: "Xếp các từ thành câu đúng ngữ pháp theo chủ đề.", assetNote: "Thumbnail 4:3 · 800×600" },
  { id: "riddle", name: "English Riddles", vi: "Đố vui tiếng Anh", emoji: "🦉", image: "/assets/images/gen/game-riddle.webp", tint: "#e5f9ee",
    blurb: "Đọc/nghe manh mối rồi chọn đáp án, luyện đọc hiểu.", assetNote: "Thumbnail 4:3 · 800×600" },
];
export const gameInfo = (id: GameKind) => GAMES.find((g) => g.id === id)!;

// Sticker theo game-type (MVP): tặng MỘT LẦN khi khám phá hết câu/task của một topic bất kỳ thuộc game đó.
export const STICKER_FOR_GAME: Record<GameKind, string> = {
  picdet: "st-detective", talk: "st-star", puzzle: "st-puzzle", riddle: "st-owl",
};
// Số câu/task mỗi lượt theo game.
export const ROUND_SIZE: Record<GameKind, number> = { picdet: 5, talk: 5, puzzle: 6, riddle: 5 };

/* ---------- Kiểu dữ liệu ngân hàng chữ (dùng bởi lib/banks.ts) ---------- */
export type Puzzle = { id: string; solution: string[]; vi: string; difficulty?: Difficulty; grammarFocus?: string };
export type PuzzleSet = { id: string; title: string; items: Puzzle[] };
export type Riddle = { id: string; text: string; hint: string; options: string[]; answer: string; vi: string; difficulty?: Difficulty };
export type RiddleSet = { id: string; title: string; items: Riddle[] };

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
