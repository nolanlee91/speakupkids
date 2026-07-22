// Trạng thái app + lưu localStorage (port từ app.js). Chỉ chạy phía client.
import type { Lesson } from "./data";
import { lessonById } from "./data";

export type Prefs = { ipa: boolean; vi: boolean; accent: "US" | "CA"; motion: boolean };
export type Progress = { done: boolean; stars: number; learned: number[] };
export type Membership = "free" | "premium" | "family";

export type AppState = {
  nickname: string;
  avatar: string;
  age: number;
  level: number;
  prefs: Prefs;
  membership: Membership;
  streak: number;
  lastActive: string;
  minutes: number;
  recordings: number;
  lastLesson: string;
  progress: Record<string, Progress>;
  stickers: string[];
  dailyDate: string;
  dailyDone: number;
  splashDate: string;
};

export const KEY = "speakup_state_v1";

export function defaultState(): AppState {
  return {
    nickname: "",
    avatar: "🦊",
    age: 10,
    level: 1,
    prefs: { ipa: true, vi: true, accent: "US", motion: true },
    membership: "free",
    streak: 0,
    lastActive: "",
    minutes: 0,
    recordings: 0,
    lastLesson: "",
    progress: {},
    stickers: [],
    dailyDate: "",
    dailyDone: 0,
    splashDate: "",
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}");
    const d = defaultState();
    return { ...d, ...s, prefs: { ...d.prefs, ...(s.prefs || {}) } };
  } catch {
    return defaultState();
  }
}

export function saveState(s: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function todayStr(d = new Date()): string {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

/* ---------- helper thuần (không đổi state) ---------- */
export function totalStars(s: AppState): number {
  return Object.values(s.progress).reduce((a, x) => a + (x.stars || 0), 0);
}
export function lessonsDone(s: AppState): number {
  return Object.values(s.progress).filter((x) => x.done).length;
}
export function totalLearned(s: AppState): number {
  return Object.values(s.progress).reduce((a, x) => a + (x.learned || []).length, 0);
}
export function isPremium(s: AppState): boolean {
  return s.membership === "premium" || s.membership === "family";
}
export function canOpen(s: AppState, les: Lesson): boolean {
  return les.free || isPremium(s);
}

/* ---------- cập nhật state (trả bản mới) ---------- */
export function touchStreak(s: AppState): AppState {
  const t = todayStr();
  if (s.lastActive === t) return s;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const ystr = todayStr(y);
  return { ...s, streak: s.lastActive === ystr ? s.streak + 1 : 1, lastActive: t };
}
export function resetDailyIfNeeded(s: AppState): AppState {
  const t = todayStr();
  if (s.dailyDate === t) return s;
  return { ...s, dailyDate: t, dailyDone: 0 };
}
export function ensureProg(s: AppState, id: string): AppState {
  if (s.progress[id] && s.progress[id].learned) return s;
  const p = s.progress[id] || { done: false, stars: 0, learned: [] };
  if (!p.learned) p.learned = [];
  return { ...s, progress: { ...s.progress, [id]: p } };
}
// Bộ sưu tập sticker
export function hasSticker(s: AppState, id: string): boolean {
  return (s.stickers || []).includes(id);
}
export function addSticker(s: AppState, id: string): AppState {
  if (!id || hasSticker(s, id)) return s;
  return { ...s, stickers: [...(s.stickers || []), id] };
}
export function gamesDone(s: AppState): number {
  return Object.keys(s.progress).filter((k) => k.startsWith("g:") && s.progress[k].done).length;
}
// Ghi nhận 1 lượt chơi game (lặp lại được): giữ số sao cao nhất; trả {state, newly}
export function recordGame(s: AppState, id: string, stars: number, sticker?: string): { state: AppState; newly: boolean } {
  const key = "g:" + id;
  const cur = s.progress[key];
  const newly = !cur?.done;
  let ns = resetDailyIfNeeded(s);
  ns = {
    ...ns,
    minutes: ns.minutes + (newly ? 2 : 0),
    dailyDone: ns.dailyDone + (newly ? 1 : 0),
    progress: { ...ns.progress, [key]: { done: true, stars: Math.max(stars, cur?.stars || 0), learned: cur?.learned || [] } },
  };
  if (sticker) ns = addSticker(ns, sticker);
  return { state: ns, newly };
}

// cộng sao 1 lần khi hoàn thành; trả {state, newly}
export function awardCompletion(s: AppState, id: string, stars: number): { state: AppState; newly: boolean } {
  const cur = s.progress[id];
  if (cur && cur.done) return { state: s, newly: false };
  const les = lessonById(id);
  let ns = resetDailyIfNeeded(s);
  ns = {
    ...ns,
    minutes: ns.minutes + Math.max(1, Math.round(((les && les.dur) || 60) / 60)),
    dailyDone: ns.dailyDone + 1,
    progress: { ...ns.progress, [id]: { done: true, stars, learned: (cur && cur.learned) || [] } },
  };
  return { state: ns, newly: true };
}
