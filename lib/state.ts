// Trạng thái app + lưu localStorage (port từ app.js). Chỉ chạy phía client.
import type { Lesson } from "./data";
import { lessonById } from "./data";
import type { DifficultyLevel, LearningSectionKey } from "./learn";
import { EMPTY_TOPIC, type GameTopicProgress, type RoundResult } from "./gameplay";
export type { GameTopicProgress, RoundResult };

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

// Tiến trình riêng của khu Trò chơi (tách khỏi Adventure): tiến độ theo từng topic/scene.
export type GamesState = {
  topics: Record<string, GameTopicProgress>; // key vd "picdet:park", "talk:classroom"
};

// Nhiệm vụ hôm nay tách theo module (Learn / Practice / Adventure)
export type DailyTasks = { date: string; learn: boolean; practice: boolean; adventure: boolean };

// Tiến trình khu Phiêu lưu (module kể chuyện riêng, KHÔNG dùng chung câu hỏi/tiến độ với Games/Learn).
// Lưu theo ID ổn định của Season & Chapter (KHÔNG dùng array index).
export type AdventureSeasonProgress = {
  completedChapterIds: string[];
  currentChapterId?: string;     // chương mở gần nhất (để gợi ý "chơi tiếp")
  collectedItemIds: string[];    // vật phẩm câu chuyện đã nhận (một lần)
};
export type AdventureState = {
  seasons: Record<string, AdventureSeasonProgress>; // key = seasonId
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
    games: { topics: {} },
    daily: { date: "", learn: false, practice: false, adventure: false },
    adventure: { seasons: {} },
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
      games: migrateGames(s.games),
      daily: { ...d.daily, ...(s.daily || {}) },
      adventure: migrateAdventure(s.adventure),
    };
  } catch {
    return defaultState();
  }
}

// Chuyển GamesState cũ ({seen,best}) hoặc bản mới ({topics}) về schema topics; không mất dữ liệu.
function migrateGames(g: unknown): GamesState {
  const src = (g || {}) as { topics?: Record<string, Partial<GameTopicProgress>>; seen?: Record<string, string[]>; best?: Record<string, number> };
  const topics: Record<string, GameTopicProgress> = {};
  if (src.topics && typeof src.topics === "object") {
    for (const [k, v] of Object.entries(src.topics)) {
      topics[k] = {
        ...EMPTY_TOPIC, ...(v || {}),
        seen: Array.isArray(v?.seen) ? v!.seen! : [],
        wrong: (v?.wrong as Record<string, number>) || {},
        correct: (v?.correct as Record<string, number>) || {},
        playCount: v?.playCount || 0,
        bestStars: v?.bestStars || 0,
      };
    }
    return { topics };
  }
  // Cũ: { seen: {key:ids}, best: {key:stars} } → gộp thành topics (giữ seen + bestStars).
  const seen = src.seen || {};
  const best = src.best || {};
  for (const k of new Set([...Object.keys(seen), ...Object.keys(best)])) {
    topics[k] = { ...EMPTY_TOPIC, seen: Array.isArray(seen[k]) ? seen[k] : [], bestStars: best[k] || 0 };
  }
  return { topics };
}

// Chuyển AdventureState về schema mới ({seasons}). Bản cũ ({missions}) thuộc chiến dịch
// nội dung khác hẳn (không map được sang Season mới) → khởi tạo rỗng; các phần state khác GIỮ NGUYÊN.
function migrateAdventure(a: unknown): AdventureState {
  const src = (a || {}) as { seasons?: Record<string, Partial<AdventureSeasonProgress>> };
  const seasons: Record<string, AdventureSeasonProgress> = {};
  if (src.seasons && typeof src.seasons === "object") {
    for (const [k, v] of Object.entries(src.seasons)) {
      seasons[k] = {
        completedChapterIds: Array.isArray(v?.completedChapterIds) ? v!.completedChapterIds! : [],
        currentChapterId: v?.currentChapterId,
        collectedItemIds: Array.isArray(v?.collectedItemIds) ? v!.collectedItemIds! : [],
      };
    }
  }
  return { seasons };
}

export function saveState(s: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function todayStr(d = new Date()): string {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

/* ---------- helper thuần (không đổi state) ---------- */
// Tổng sao = sao "legacy" (không phải game) + tổng bestStars của từng topic Game.
// KHÔNG cộng key "g:*" cũ để tránh đếm trùng với games.topics.
export function totalStars(s: AppState): number {
  const legacy = Object.entries(s.progress)
    .filter(([k]) => !k.startsWith("g:"))
    .reduce((a, [, x]) => a + (x.stars || 0), 0);
  return legacy + gameStars(s);
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
/* ---------- Practice/Game: tiến độ riêng theo topic ---------- */
export function topicOf(s: AppState, key: string): GameTopicProgress {
  return s.games.topics[key] || EMPTY_TOPIC;
}
// Tổng sao Game = tổng bestStars của từng topic (không cộng mỗi lượt chơi).
export function gameStars(s: AppState): number {
  return Object.values(s.games.topics).reduce((a, t) => a + (t.bestStars || 0), 0);
}
// Tổng số lượt Game đã hoàn thành (dùng cho huy hiệu "Luyện N lượt").
export function gamePlays(s: AppState): number {
  return Object.values(s.games.topics).reduce((a, t) => a + (t.playCount || 0), 0);
}
export function gamesDone(s: AppState): number {
  return gamePlays(s);
}
export function topicSeenCount(s: AppState, key: string): number {
  return topicOf(s, key).seen.length;
}
// Ghi nhận câu đã trả lời (đúng/sai + seen). KHÔNG tăng playCount. Dùng cả khi thoát giữa chừng.
export function recordGameAnswers(s: AppState, key: string, results: RoundResult[]): AppState {
  if (!results.length) return s;
  const cur = topicOf(s, key);
  const seen = cur.seen.slice();
  const wrong = { ...cur.wrong };
  const correct = { ...cur.correct };
  for (const r of results) {
    if (!seen.includes(r.id)) seen.push(r.id);
    if (r.correct) correct[r.id] = (correct[r.id] || 0) + 1;
    else wrong[r.id] = (wrong[r.id] || 0) + 1;
  }
  return { ...s, games: { topics: { ...s.games.topics, [key]: { ...cur, seen, wrong, correct } } } };
}
// Hoàn thành TRỌN một lượt: +1 playCount, giữ bestStars cao nhất, cập nhật lastPlayedAt, đánh dấu Practice hôm nay.
export function finishGameRound(s: AppState, key: string, stars: number, now: string): AppState {
  let ns = resetDailyIfNeeded(s);
  ns = markDaily(ns, "practice");
  const cur = topicOf(ns, key);
  const next: GameTopicProgress = {
    ...cur,
    playCount: cur.playCount + 1,
    bestStars: Math.max(stars, cur.bestStars),
    lastPlayedAt: now,
  };
  return { ...ns, minutes: ns.minutes + 2, games: { topics: { ...ns.games.topics, [key]: next } } };
}
// Echo (luyện nói tùy chọn): chỉ đánh dấu đã luyện Practice hôm nay, KHÔNG chạm sao/bestStars/playCount.
export function markPracticeDone(s: AppState): AppState {
  return markDaily(resetDailyIfNeeded(s), "practice");
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

/* ---------- Phiêu lưu (module kể chuyện riêng, độc lập Learn/Games) ---------- */
const EMPTY_SEASON: AdventureSeasonProgress = { completedChapterIds: [], collectedItemIds: [] };
export function adventureOf(s: AppState, seasonId: string): AdventureSeasonProgress {
  return s.adventure.seasons[seasonId] || EMPTY_SEASON;
}
export function isChapterCompleted(s: AppState, seasonId: string, chapterId: string): boolean {
  return adventureOf(s, seasonId).completedChapterIds.includes(chapterId);
}
export function hasAdventureItem(s: AppState, seasonId: string, itemId: string): boolean {
  return adventureOf(s, seasonId).collectedItemIds.includes(itemId);
}
// Ghi nhớ chương đang mở (để Today gợi ý "chơi tiếp") — không đổi tiến độ hoàn thành.
export function setCurrentChapter(s: AppState, seasonId: string, chapterId: string): AppState {
  const cur = adventureOf(s, seasonId);
  if (cur.currentChapterId === chapterId) return s;
  return { ...s, adventure: { seasons: { ...s.adventure.seasons, [seasonId]: { ...cur, currentChapterId: chapterId } } } };
}
// Hoàn thành một chương: đánh dấu done, nhận item (một lần), đặt con trỏ sang chương kế,
// đánh dấu nhiệm vụ Phiêu lưu hôm nay + cộng phút/nhiệm vụ ngày CHỈ lần đầu.
// Chơi lại KHÔNG cấp lại item và KHÔNG cộng lại nhiệm vụ ngày. Trả {state, newly, gotItem}.
export function completeChapter(
  s: AppState, seasonId: string, chapterId: string,
  opts?: { itemId?: string; extraItemIds?: string[]; nextChapterId?: string },
): { state: AppState; newly: boolean; gotItem: boolean } {
  const cur = adventureOf(s, seasonId);
  const newly = !cur.completedChapterIds.includes(chapterId);
  const gotItem = !!opts?.itemId && !cur.collectedItemIds.includes(opts.itemId);

  let ns = resetDailyIfNeeded(s);
  ns = markDaily(ns, "adventure");

  const completedChapterIds = newly ? [...cur.completedChapterIds, chapterId] : cur.completedChapterIds;
  // Thu thập vật phẩm chính + phụ (mỗi thứ một lần).
  const wanted = [opts?.itemId, ...(opts?.extraItemIds || [])].filter((x): x is string => !!x);
  const collectedItemIds = cur.collectedItemIds.slice();
  for (const id of wanted) if (!collectedItemIds.includes(id)) collectedItemIds.push(id);
  const next: AdventureSeasonProgress = {
    completedChapterIds,
    collectedItemIds,
    currentChapterId: opts?.nextChapterId || cur.currentChapterId,
  };
  ns = {
    ...ns,
    minutes: ns.minutes + (newly ? 4 : 0),
    dailyDone: ns.dailyDone + (newly ? 1 : 0),
    adventure: { seasons: { ...ns.adventure.seasons, [seasonId]: next } },
  };
  return { state: ns, newly, gotItem };
}
// Tổng số chương đã hoàn thành (mọi mùa) — dùng cho huy hiệu "Nhà phiêu lưu".
export function adventuresDone(s: AppState): number {
  return Object.values(s.adventure.seasons).reduce((a, p) => a + p.completedChapterIds.length, 0);
}
// Reset tiến độ Phiêu lưu (chỉ dùng ở khu debug/development).
// seasonId: chỉ reset một mùa; không truyền → reset toàn bộ.
export function resetAdventure(s: AppState, seasonId?: string): AppState {
  if (!seasonId) return { ...s, adventure: { seasons: {} } };
  const seasons = { ...s.adventure.seasons };
  delete seasons[seasonId];
  return { ...s, adventure: { seasons } };
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
