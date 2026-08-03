// Freemium gating: quy định nội dung nào MIỄN PHÍ, còn lại cần Pro.
// Free-tier: L0 mở hết · L1/L2 3 bài đầu · L3 3 bài đầu mỗi collection ·
//            Practice: mỗi game 3 card đầu (Nghe & chọn: 2) · Adventure: 2 Season đầu.
// Quyền Pro/Family: nguồn chuẩn là bảng entitlements phía server (xem lib/cloud.ts).
import { isPremium, type AppState } from "./state";
import { DETECTIVE_SCENES } from "./scenes";
import { PUZZLE_SETS, RIDDLE_SETS, LISTEN_SETS } from "./banks";

const FREE_N = 3;
const firstIds = (arr: { id: string }[], n: number) => new Set(arr.slice(0, n).map((x) => x.id));
// Gate theo ID (gallery bị trộn thứ tự nên không dùng index hiển thị được).
const PICDET_FREE = firstIds(DETECTIVE_SCENES, FREE_N);
const PUZZLE_FREE = firstIds(PUZZLE_SETS, FREE_N);
const RIDDLE_FREE = firstIds(RIDDLE_SETS, FREE_N);
const LISTEN_FREE = firstIds(LISTEN_SETS, 2);   // Nghe & chọn chỉ có 4 bộ → mở 2

// Learn: khóa theo cấp + vị trí bài trong cấp (L3 tính theo từng collection).
export function learnLocked(state: AppState, levelId: string, indexInGroup: number): boolean {
  if (isPremium(state)) return false;
  if (levelId === "0") return false;                       // Phonics mở hết
  if (levelId === "1" || levelId === "2") return indexInGroup >= 3;
  if (levelId === "3") return indexInGroup >= 3;           // 3 bài đầu mỗi collection
  return true;
}

// Practice: mỗi game mở 3 card đầu.
export function practiceItemLocked(premium: boolean, kind: string, id: string): boolean {
  if (premium) return false;
  if (kind === "picdet") return !PICDET_FREE.has(id);
  if (kind === "puzzle") return !PUZZLE_FREE.has(id);
  if (kind === "riddle") return !RIDDLE_FREE.has(id);
  if (kind === "listen") return !LISTEN_FREE.has(id);
  return false;
}

// Adventure: 2 Season đầu (index 0, 1) miễn phí.
export function adventureSeasonLocked(state: AppState, index: number): boolean {
  if (isPremium(state)) return false;
  return index >= 2;
}
