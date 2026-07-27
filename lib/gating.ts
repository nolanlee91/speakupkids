// Freemium gating: quy định nội dung nào MIỄN PHÍ, còn lại cần Premium.
// Free-tier: L0 mở hết · L1/L2 3 bài đầu · L3 1 bài đầu mỗi collection ·
//            Đố vui + Thám tử: 4 bộ/cảnh đầu · Xếp câu + Nghe & chọn: chỉ Premium ·
//            Adventure: chỉ Season 1.
import { isPremium, type AppState } from "./state";
import { DETECTIVE_SCENES } from "./scenes";
import { RIDDLE_SETS } from "./banks";

const firstIds = (arr: { id: string }[], n: number) => new Set(arr.slice(0, n).map((x) => x.id));
// Gate theo ID (gallery bị trộn thứ tự nên không dùng index hiển thị được).
const PICDET_FREE = firstIds(DETECTIVE_SCENES, 4);
const RIDDLE_FREE = firstIds(RIDDLE_SETS, 4);

// Learn: khóa theo cấp + vị trí bài trong cấp (L3 tính theo từng collection).
export function learnLocked(state: AppState, levelId: string, indexInGroup: number): boolean {
  if (isPremium(state)) return false;
  if (levelId === "0") return false;                       // Phonics mở hết
  if (levelId === "1" || levelId === "2") return indexInGroup >= 3;
  if (levelId === "3") return indexInGroup >= 1;           // 1 bài đầu mỗi collection
  return true;
}

// Practice: picdet/riddle 4 bộ đầu; puzzle/listen chỉ Premium.
export function practiceItemLocked(premium: boolean, kind: string, id: string): boolean {
  if (premium) return false;
  if (kind === "picdet") return !PICDET_FREE.has(id);
  if (kind === "riddle") return !RIDDLE_FREE.has(id);
  if (kind === "puzzle" || kind === "listen") return true;
  return false;
}

// Adventure: chỉ Season đầu tiên (index 0) miễn phí.
export function adventureSeasonLocked(state: AppState, index: number): boolean {
  if (isPremium(state)) return false;
  return index > 0;
}
