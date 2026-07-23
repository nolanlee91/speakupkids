// Trạng thái app + lưu localStorage (port từ app.js). Chỉ chạy phía client.
import type { Lesson } from "./data";
import { lessonById } from "./data";
import type { DifficultyLevel, LearningSectionKey } from "./learn";

export type Prefs = { ipa: boolean; vi: boolean; accent: "US" | "CA"; motion: boolean };
export type Progress = { done: boolean; stars: number; learned: number[] };
export type Membership = "free" | "premium" | "family";

// Tiến độ học của MỘT bài trong khu Learn
export type LearnLessonState = { sections: LearningSectionKey[]; done: boolean; check?: { score: number; total: number } };
export type LearnState = {
  currentLesson: string;
  difficulty: DifficultyLevel;
  lessons: Record<string, LearnLessonState>;
};

// Tiến trình riêng của khu Trò chơi (tách khỏi Adventure)
export type GamesState = {
  seen: Record<string, string[]>; // key vd "picdet:classroom" -> id câu đã gặp (chống lặp)
  best: Record<string, number>;   // key vd "picdet:park" -> sao tốt nhất theo scene/topic
};

// Nhiệm vụ hôm nay tách theo module (Learn / Practice / Adventure)
export type DailyTasks = { date: string; learn: boolean; practice: boolean; adventure: boolean };

// Tiến trình khu Phiêu lưu (module nhiệm vụ riêng, KHÔNG dùng chung câu hỏi với Games)
export type AdventureMissionState = { step: number; done: boolean; stars: number };
export type AdventureState = {
  currentMission?: string;
  missions: Record<string, AdventureMissionState>;
};

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
  learn: LearnState;
  games: GamesState;
  daily: DailyTasks;
  adventure: AdventureState;
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
    learn: { currentLesson: "park", difficulty: "detective", lessons: {} },
    games: { seen: {}, best: {} },
    daily: { date: "", learn: false, practice: false, adventure: false },
    adventure: { missions: {} },
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}");
    const d = defaultState();
    // Gộp an toàn: dữ liệu cũ không có `learn`/`prefs` sẽ nhận mặc định
    return {
      ...d, ...s,
      prefs: { ...d.prefs, ...(s.prefs || {}) },
      learn: { ...d.learn, ...(s.learn || {}), lessons: { ...(s.learn?.lessons || {}) } },
      games: { ...d.games, ...(s.games || {}), seen: { ...(s.games?.seen || {}) }, best: { ...(s.games?.best || {}) } },
      daily: { ...d.daily, ...(s.daily || {}) },
      adventure: { ...d.adventure, ...(s.adventure || {}), missions: { ...(s.adventure?.missions || {}) } },
    };
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
// Lưu các câu đã gặp (chống lặp giữa các lượt chơi cùng một cảnh)
export function markGameSeen(s: AppState, key: string, ids: string[]): AppState {
  return { ...s, games: { ...s.games, seen: { ...s.games.seen, [key]: ids } } };
}
// Ghi điểm cao nhất theo game (vd "picdet")
export function recordBest(s: AppState, gameId: string, score: number): AppState {
  if (score <= (s.games.best[gameId] || 0)) return s;
  return { ...s, games: { ...s.games, best: { ...s.games.best, [gameId]: score } } };
}
export function gameBest(s: AppState, gameId: string): number {
  return s.games.best[gameId] || 0;
}

// Ghi nhận 1 lượt chơi game (lặp lại được): giữ số sao cao nhất; trả {state, newly}
export function recordGame(s: AppState, id: string, stars: number, sticker?: string): { state: AppState; newly: boolean } {
  const key = "g:" + id;
  const cur = s.progress[key];
  const newly = !cur?.done;
  let ns = resetDailyIfNeeded(s);
  ns = markDaily(ns, "practice");
  ns = {
    ...ns,
    minutes: ns.minutes + (newly ? 2 : 0),
    dailyDone: ns.dailyDone + (newly ? 1 : 0),
    progress: { ...ns.progress, [key]: { done: true, stars: Math.max(stars, cur?.stars || 0), learned: cur?.learned || [] } },
  };
  if (sticker) ns = addSticker(ns, sticker);
  return { state: ns, newly };
}

/* ---------- Learn (khu học tập) ---------- */
const EMPTY_LEARN: LearnLessonState = { sections: [], done: false };
export function learnOf(s: AppState, lessonId: string): LearnLessonState {
  return s.learn.lessons[lessonId] || EMPTY_LEARN;
}
export function sectionDone(s: AppState, lessonId: string, key: LearningSectionKey): boolean {
  return learnOf(s, lessonId).sections.includes(key);
}
export function learnLessonDone(s: AppState, lessonId: string): boolean {
  return learnOf(s, lessonId).done;
}
// % hoàn thành 1 bài = số section xong / tổng section (mini-check tính riêng)
export function lessonPct(s: AppState, lessonId: string, totalSections: number): number {
  const done = learnOf(s, lessonId).sections.length;
  return totalSections ? Math.round((done / totalSections) * 100) : 0;
}
export function markSection(s: AppState, lessonId: string, key: LearningSectionKey): AppState {
  const cur = learnOf(s, lessonId);
  if (cur.sections.includes(key)) return s;
  const next: LearnLessonState = { ...cur, sections: [...cur.sections, key] };
  const ns = markDaily(s, "learn");
  return { ...ns, learn: { ...ns.learn, currentLesson: lessonId, lessons: { ...ns.learn.lessons, [lessonId]: next } } };
}
export function setDifficulty(s: AppState, difficulty: DifficultyLevel): AppState {
  return { ...s, learn: { ...s.learn, difficulty } };
}
export function setCurrentLesson(s: AppState, lessonId: string): AppState {
  return { ...s, learn: { ...s.learn, currentLesson: lessonId } };
}
// Hoàn thành bài học (sau mini-check): lưu điểm, đánh dấu done, cộng phút/nhiệm vụ 1 lần
export function completeLearnLesson(s: AppState, lessonId: string, score: number, total: number): { state: AppState; newly: boolean } {
  const cur = learnOf(s, lessonId);
  const newly = !cur.done;
  let ns = resetDailyIfNeeded(s);
  ns = markDaily(ns, "learn");
  const next: LearnLessonState = { ...cur, done: true, check: { score, total } };
  ns = {
    ...ns,
    minutes: ns.minutes + (newly ? 5 : 0),
    dailyDone: ns.dailyDone + (newly ? 1 : 0),
    learn: { ...ns.learn, currentLesson: lessonId, lessons: { ...ns.learn.lessons, [lessonId]: next } },
  };
  return { state: ns, newly };
}
export function learnLessonsDone(s: AppState): number {
  return Object.values(s.learn.lessons).filter((l) => l.done).length;
}

/* ---------- Nhiệm vụ hôm nay (Learn / Practice / Adventure) ---------- */
export function resetDailyTasks(s: AppState): AppState {
  const t = todayStr();
  if (s.daily.date === t) return s;
  return { ...s, daily: { date: t, learn: false, practice: false, adventure: false } };
}
export function markDaily(s: AppState, key: "learn" | "practice" | "adventure"): AppState {
  const ns = resetDailyTasks(s);
  if (ns.daily[key]) return ns;
  return { ...ns, daily: { ...ns.daily, [key]: true } };
}
export function dailyCount(s: AppState): number {
  return [s.daily.learn, s.daily.practice, s.daily.adventure].filter(Boolean).length;
}

/* ---------- Phiêu lưu (module nhiệm vụ riêng) ---------- */
const EMPTY_MISSION: AdventureMissionState = { step: 0, done: false, stars: 0 };
export function missionOf(s: AppState, id: string): AdventureMissionState {
  return s.adventure.missions[id] || EMPTY_MISSION;
}
export function setMissionStep(s: AppState, id: string, step: number): AppState {
  const cur = missionOf(s, id);
  const next: AdventureMissionState = { ...cur, step: Math.max(cur.step, step) };
  return { ...s, adventure: { ...s.adventure, currentMission: id, missions: { ...s.adventure.missions, [id]: next } } };
}
// Hoàn thành 1 mission: giữ sao cao nhất, đánh dấu done, cộng nhiệm vụ ngày 1 lần, mở sticker
export function completeMission(s: AppState, id: string, stars: number, sticker?: string): { state: AppState; newly: boolean } {
  const cur = missionOf(s, id);
  const newly = !cur.done;
  let ns = resetDailyIfNeeded(s);
  ns = markDaily(ns, "adventure");
  const next: AdventureMissionState = { step: cur.step, done: true, stars: Math.max(stars, cur.stars) };
  ns = {
    ...ns,
    minutes: ns.minutes + (newly ? 4 : 0),
    dailyDone: ns.dailyDone + (newly ? 1 : 0),
    adventure: { ...ns.adventure, currentMission: id, missions: { ...ns.adventure.missions, [id]: next } },
  };
  if (sticker) ns = addSticker(ns, sticker);
  return { state: ns, newly };
}
export function adventuresDone(s: AppState): number {
  return Object.values(s.adventure.missions).filter((m) => m.done).length;
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
