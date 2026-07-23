// Logic Practice/Game tách khỏi React để dễ test & dùng chung cho cả bốn game.
// Không phụ thuộc React, không phụ thuộc dữ liệu game cụ thể.
import { shuffle } from "./fx";

export type Difficulty = "easy" | "medium" | "hard";

// Tiến độ RIÊNG của một topic/scene trong Practice (vd "picdet:park").
export type GameTopicProgress = {
  seen: string[];                    // id câu/task đã từng gặp
  wrong: Record<string, number>;     // số lần trả lời sai theo id
  correct: Record<string, number>;   // số lần trả lời đúng theo id
  playCount: number;                 // số lượt đã hoàn thành trọn vẹn
  bestStars: number;                 // sao cao nhất đạt được ở topic này
  lastPlayedAt?: string;             // ngày chơi gần nhất (todayStr)
};
export const EMPTY_TOPIC: GameTopicProgress = { seen: [], wrong: {}, correct: {}, playCount: 0, bestStars: 0 };

export type RoundResult = { id: string; correct: boolean };

// Sao theo tỉ lệ đúng của một lượt.
export function starsFor(score: number, total: number): number {
  const pct = total ? score / total : 1;
  return pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
}

/* ---------- Suy ra độ khó khi item chưa gắn tag (dùng chung, tránh phải tag tay hàng trăm câu) ---------- */
export function picdetDifficulty(kind: string, explicit?: Difficulty): Difficulty {
  if (explicit) return explicit;
  if (kind === "infer" || kind === "sequence") return "hard";
  if (kind === "compare") return "medium";
  return "easy"; // observe, locate
}
export function talkDifficulty(kind: string, explicit?: Difficulty): Difficulty {
  if (explicit) return explicit;
  if (kind === "arrange") return "hard";
  if (kind === "spot" || kind === "position") return "medium";
  return "easy"; // choose, fill
}
export function puzzleDifficulty(len: number, explicit?: Difficulty): Difficulty {
  if (explicit) return explicit;
  if (len <= 4) return "easy";
  if (len === 5) return "medium";
  return "hard";
}

// Phân bổ độ khó cho một lượt n câu: ~20% easy, ~40% hard, còn lại medium.
export function distFor(n: number): Record<Difficulty, number> {
  const easy = Math.max(1, Math.round(n * 0.2));
  const hard = Math.max(1, Math.round(n * 0.4));
  const medium = Math.max(0, n - easy - hard);
  return { easy, medium, hard };
}

// Xếp hạng ưu tiên: chưa gặp > sai nhiều hơn đúng > lâu chưa gặp > còn lại.
function rankByPriority<T extends { id: string }>(items: T[], prog: GameTopicProgress): T[] {
  const seenSet = new Set(prog.seen);
  const seenIdx = new Map(prog.seen.map((id, i) => [id, i]));
  const unseen = items.filter((i) => !seenSet.has(i.id));
  const seenItems = items.filter((i) => seenSet.has(i.id));
  const struggled = seenItems
    .filter((i) => (prog.wrong[i.id] || 0) > (prog.correct[i.id] || 0))
    .sort((a, b) => ((prog.wrong[b.id] || 0) - (prog.correct[b.id] || 0)) - ((prog.wrong[a.id] || 0) - (prog.correct[a.id] || 0)));
  const rest = seenItems
    .filter((i) => !((prog.wrong[i.id] || 0) > (prog.correct[i.id] || 0)))
    .sort((a, b) => (seenIdx.get(a.id) ?? 0) - (seenIdx.get(b.id) ?? 0)); // cũ nhất (index nhỏ) trước
  return [...shuffle(unseen), ...struggled, ...rest];
}

// Chọn n câu cho một lượt: ưu tiên (unseen → sai nhiều → cũ) + phối độ khó + tránh lặp bộ của lượt trước.
export function selectRound<T extends { id: string }>(
  items: T[],
  prog: GameTopicProgress,
  n: number,
  difficultyOf: (item: T) => Difficulty,
  lastIds: string[] = [],
): T[] {
  n = Math.min(n, items.length);
  if (n <= 0) return [];
  const ranked = rankByPriority(items, prog);
  const dist = distFor(n);
  const buckets: Record<Difficulty, T[]> = { easy: [], medium: [], hard: [] };
  for (const it of ranked) buckets[difficultyOf(it)].push(it); // giữ thứ tự ưu tiên trong từng độ khó
  const picked: T[] = [];
  const chosen = new Set<string>();
  const take = (d: Difficulty, count: number) => {
    while (count-- > 0 && buckets[d].length) { const it = buckets[d].shift()!; picked.push(it); chosen.add(it.id); }
  };
  take("hard", dist.hard); take("medium", dist.medium); take("easy", dist.easy);
  // Bù cho đủ n nếu bank lệch độ khó — vẫn theo thứ tự ưu tiên, không làm crash.
  if (picked.length < n) for (const it of ranked) { if (picked.length >= n) break; if (!chosen.has(it.id)) { picked.push(it); chosen.add(it.id); } }
  const round = picked.slice(0, n);
  // Tránh tái tạo y hệt bộ của lượt gần nhất nếu còn lựa chọn khác.
  if (lastIds.length === round.length && round.length > 0 && items.length > n) {
    const same = round.every((r) => lastIds.includes(r.id));
    if (same) { const alt = ranked.find((it) => !chosen.has(it.id)); if (alt) round[round.length - 1] = alt; }
  }
  return shuffle(round);
}

// Số câu MỚI (chưa từng gặp) trong một lượt, so với seen trước lượt.
export function countNewly(prevSeen: string[], results: RoundResult[]): number {
  const seen = new Set(prevSeen);
  return results.filter((r) => !seen.has(r.id)).length;
}
