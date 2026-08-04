// Trạng thái app + lưu localStorage (port từ app.js). Chỉ chạy phía client.
import type { Lesson } from "./data";
import { lessonById } from "./data";
import type { DifficultyLevel, LearningSectionKey } from "./learn";
import { EMPTY_TOPIC, type GameTopicProgress, type RoundResult } from "./gameplay";
export type { GameTopicProgress, RoundResult };

export type Prefs = { ipa: boolean; vi: boolean; accent: "US" | "CA"; motion: boolean };
export type Progress = { done: boolean; stars: number; learned: number[] };
// Gói lifetime: free · pro (1 bé) · family (tối đa 4 bé). Nguồn chuẩn là bảng
// entitlements phía server (client chỉ đọc rồi ghi vào đây làm cache hiển thị).
export type Membership = "free" | "pro" | "family";

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
export type ClubhousePetKind = "dog" | "cat";
export type ClubhousePetState = {
  kind: ClubhousePetKind | null;
  name: string;
  needs: { hunger: number; happiness: number; lastCareDay: string };
};

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

// Maple Clubhouse: phần thưởng meta-game dùng chung cho Learn / Practice / Adventure.
// `claimedMilestones` là số mốc đã nhận quà; item không chọn vẫn ở lại pool cho mốc sau.
export type ClubhouseState = {
  unlockedItemIds: string[];
  claimedMilestones: number;
  coins: number;
  cash: number;
  purchasedItemIds: string[];
  equippedItemIds: string[];
  rewardedKeys: string[];
  cashRewardedKeys: string[];
  ownedOutfitIds: string[];
  activeOutfitId: string;
  itemPositions: Record<string, { x: number; y: number }>;
  itemRoomIds: Record<string, string>;
  activeRoomId: string;
  itemTransforms: Record<string, { scale: number; rotation: number }>;
  needs: { hunger: number; energy: number; happiness: number; lastCareDay: string };
  pet: ClubhousePetState;
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
  clubhouse: ClubhouseState;
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
    clubhouse: { unlockedItemIds: [], claimedMilestones: 0, coins: 40, cash: 10, purchasedItemIds: [], equippedItemIds: [], rewardedKeys: [], cashRewardedKeys: [], ownedOutfitIds: ["default"], activeOutfitId: "default", itemPositions: {}, itemRoomIds: {}, activeRoomId: "lounge", itemTransforms: {}, needs: { hunger: 85, energy: 90, happiness: 90, lastCareDay: "" }, pet: { kind: null, name: "", needs: { hunger: 85, happiness: 90, lastCareDay: "" } } },
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    return normalizeState(JSON.parse(localStorage.getItem(KEY) || "{}"));
  } catch {
    return defaultState();
  }
}

// Chuẩn hóa cả localStorage lẫn state cũ kéo từ cloud về schema hiện tại.
// Mỗi module mới phải đi qua đây để tài khoản đã tồn tại không bị lỗi trắng.
export function normalizeState(input: unknown): AppState {
  const s = (input || {}) as Partial<AppState>;
  const d = defaultState();
  return {
    ...d, ...s,
    membership: migrateMembership(s.membership),
    prefs: { ...d.prefs, ...(s.prefs || {}) },
    learn: { ...d.learn, ...(s.learn || {}), lessons: { ...(s.learn?.lessons || {}) } },
    games: migrateGames(s.games),
    daily: { ...d.daily, ...(s.daily || {}) },
    adventure: migrateAdventure(s.adventure),
    clubhouse: migrateClubhouse(s.clubhouse),
  };
}

// State cũ lưu "premium" (tên nội bộ trước đây của gói Pro) → quy về "pro".
function migrateMembership(m: unknown): Membership {
  if (m === "premium" || m === "pro") return "pro";
  if (m === "family") return "family";
  return "free";
}

function migrateClubhouse(c: unknown): ClubhouseState {
  const src = (c || {}) as Partial<ClubhouseState>;
  const ownedOutfitIds = Array.isArray(src.ownedOutfitIds) && src.ownedOutfitIds.length ? [...new Set(["default", ...src.ownedOutfitIds])] : ["default"];
  const oldNeeds = src.needs || { hunger: 85, energy: 90, happiness: 90, lastCareDay: "" };
  const oldPet = src.pet || { kind: null, name: "", needs: { hunger: 85, happiness: 90, lastCareDay: "" } };
  const oldPetNeeds = oldPet.needs || { hunger: 85, happiness: 90, lastCareDay: "" };
  const isNewDay = oldNeeds.lastCareDay !== todayStr();
  const careValue = (value: unknown, fallback: number, dailyFloor: number) => {
    const safe = Number.isFinite(value) ? Number(value) : fallback;
    return Math.max(0, Math.min(100, isNewDay ? Math.max(safe, dailyFloor) : safe));
  };
  const petIsNewDay = oldPetNeeds.lastCareDay !== todayStr();
  const petCareValue = (value: unknown, fallback: number, dailyFloor: number) => {
    const safe = Number.isFinite(value) ? Number(value) : fallback;
    return Math.max(0, Math.min(100, petIsNewDay ? Math.max(safe, dailyFloor) : safe));
  };
  const legacy = Array.isArray(src.unlockedItemIds)
    ? [...new Set(src.unlockedItemIds.filter((id): id is string => typeof id === "string"))]
    : [];
  return {
    unlockedItemIds: legacy,
    claimedMilestones: Number.isFinite(src.claimedMilestones)
      ? Math.max(0, Math.floor(src.claimedMilestones || 0))
      : 0,
    // Tài khoản cũ và người mới nhận một khoản khởi đầu để Shop có giá trị ngay lần đầu mở.
    coins: Number.isFinite(src.coins) ? Math.max(0, Math.floor(src.coins || 0)) : 40,
    cash: Number.isFinite(src.cash) ? Math.max(0, Math.floor(src.cash || 0)) : 10,
    purchasedItemIds: Array.isArray(src.purchasedItemIds) ? [...new Set(src.purchasedItemIds)] : [],
    equippedItemIds: Array.isArray(src.equippedItemIds) ? [...new Set(src.equippedItemIds)] : [],
    rewardedKeys: Array.isArray(src.rewardedKeys) ? [...new Set(src.rewardedKeys)] : [],
    cashRewardedKeys: Array.isArray(src.cashRewardedKeys) ? [...new Set(src.cashRewardedKeys)] : [],
    ownedOutfitIds,
    activeOutfitId: typeof src.activeOutfitId === "string" && ownedOutfitIds.includes(src.activeOutfitId) ? src.activeOutfitId : "default",
    itemPositions: src.itemPositions && typeof src.itemPositions === "object" ? src.itemPositions : {},
    itemRoomIds: src.itemRoomIds && typeof src.itemRoomIds === "object" ? src.itemRoomIds : {},
    activeRoomId: typeof src.activeRoomId === "string" ? src.activeRoomId : "lounge",
    itemTransforms: src.itemTransforms && typeof src.itemTransforms === "object" ? src.itemTransforms : {},
    needs: {
      hunger: careValue(oldNeeds.hunger, 85, 75),
      energy: careValue(oldNeeds.energy, 90, 85),
      happiness: careValue(oldNeeds.happiness, 90, 75),
      lastCareDay: todayStr(),
    },
    pet: {
      kind: oldPet.kind === "dog" || oldPet.kind === "cat" ? oldPet.kind : null,
      name: typeof oldPet.name === "string" ? oldPet.name.slice(0, 16) : "",
      needs: {
        hunger: petCareValue(oldPetNeeds.hunger, 85, 75),
        happiness: petCareValue(oldPetNeeds.happiness, 90, 75),
        lastCareDay: todayStr(),
      },
    },
  };
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
  return s.membership === "pro" || s.membership === "family";
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
// Sticker Practice — hiển thị cùng các kỷ vật khác trong Clubhouse Journal
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

/* ---------- Maple Clubhouse (meta-game phần thưởng) ---------- */
export function claimClubhouseItem(s: AppState, itemId: string, roomId = "lounge"): AppState {
  if (!itemId || s.clubhouse.unlockedItemIds.includes(itemId)) return s;
  const purchasedItemIds = s.clubhouse.purchasedItemIds.includes(itemId) ? s.clubhouse.purchasedItemIds : [...s.clubhouse.purchasedItemIds, itemId];
  const equippedItemIds = s.clubhouse.equippedItemIds.includes(itemId) ? s.clubhouse.equippedItemIds : [...s.clubhouse.equippedItemIds, itemId];
  return {
    ...s,
    clubhouse: {
      ...s.clubhouse,
      unlockedItemIds: [...s.clubhouse.unlockedItemIds, itemId],
      claimedMilestones: s.clubhouse.claimedMilestones + 1,
      purchasedItemIds,
      equippedItemIds,
      itemRoomIds: { ...s.clubhouse.itemRoomIds, [itemId]: roomId },
    },
  };
}

export function awardCoinsOnce(s: AppState, key: string, amount: number): { state: AppState; awarded: number } {
  if (!key || amount <= 0 || s.clubhouse.rewardedKeys.includes(key)) return { state: s, awarded: 0 };
  return {
    awarded: amount,
    state: {
      ...s,
      clubhouse: {
        ...s.clubhouse,
        coins: s.clubhouse.coins + amount,
        rewardedKeys: [...s.clubhouse.rewardedKeys, key],
      },
    },
  };
}

export function awardCashOnce(s: AppState, key: string, amount: number): { state: AppState; awarded: number } {
  if (!key || amount <= 0 || s.clubhouse.cashRewardedKeys.includes(key)) return { state: s, awarded: 0 };
  return { awarded: amount, state: { ...s, clubhouse: {
    ...s.clubhouse, cash: s.clubhouse.cash + amount, cashRewardedKeys: [...s.clubhouse.cashRewardedKeys, key],
  } } };
}

export function buyClubhouseOutfit(s: AppState, outfitId: string, price: number): AppState {
  if (!outfitId || price < 0 || s.clubhouse.ownedOutfitIds.includes(outfitId) || s.clubhouse.cash < price) return s;
  return { ...s, clubhouse: { ...s.clubhouse,
    cash: s.clubhouse.cash - price,
    ownedOutfitIds: [...s.clubhouse.ownedOutfitIds, outfitId],
    activeOutfitId: outfitId,
  } };
}

export function wearClubhouseOutfit(s: AppState, outfitId: string): AppState {
  if (!s.clubhouse.ownedOutfitIds.includes(outfitId)) return s;
  return { ...s, clubhouse: { ...s.clubhouse, activeOutfitId: outfitId } };
}

export function buyClubhouseItem(s: AppState, itemId: string, price: number, roomId = "lounge"): AppState {
  if (!itemId || price < 0 || s.clubhouse.purchasedItemIds.includes(itemId) || s.clubhouse.coins < price) return s;
  return {
    ...s,
    clubhouse: {
      ...s.clubhouse,
      coins: s.clubhouse.coins - price,
      purchasedItemIds: [...s.clubhouse.purchasedItemIds, itemId],
      equippedItemIds: [...s.clubhouse.equippedItemIds, itemId],
      itemRoomIds: { ...s.clubhouse.itemRoomIds, [itemId]: roomId },
    },
  };
}

export function toggleClubhouseItem(s: AppState, itemId: string): AppState {
  if (!s.clubhouse.purchasedItemIds.includes(itemId)) return s;
  const on = s.clubhouse.equippedItemIds.includes(itemId);
  return {
    ...s,
    clubhouse: {
      ...s.clubhouse,
      equippedItemIds: on
        ? s.clubhouse.equippedItemIds.filter((id) => id !== itemId)
        : [...s.clubhouse.equippedItemIds, itemId],
    },
  };
}

export function moveClubhouseItem(s: AppState, itemId: string, roomId: string, x: number, y: number): AppState {
  if (!s.clubhouse.purchasedItemIds.includes(itemId)) return s;
  const position = { x: Math.max(4, Math.min(96, x)), y: Math.max(12, Math.min(90, y)) };
  return {
    ...s,
    clubhouse: {
      ...s.clubhouse,
      itemPositions: { ...s.clubhouse.itemPositions, [`${roomId}:${itemId}`]: position },
      itemRoomIds: { ...s.clubhouse.itemRoomIds, [itemId]: roomId },
    },
  };
}

export function setClubhouseRoom(s: AppState, roomId: string): AppState {
  return { ...s, clubhouse: { ...s.clubhouse, activeRoomId: roomId } };
}

export function placeClubhouseItem(s: AppState, itemId: string, roomId: string): AppState {
  if (!s.clubhouse.purchasedItemIds.includes(itemId)) return s;
  const equippedItemIds = s.clubhouse.equippedItemIds.includes(itemId)
    ? s.clubhouse.equippedItemIds : [...s.clubhouse.equippedItemIds, itemId];
  return { ...s, clubhouse: { ...s.clubhouse, equippedItemIds, itemRoomIds: { ...s.clubhouse.itemRoomIds, [itemId]: roomId } } };
}

export function transformClubhouseItem(s: AppState, itemId: string, roomId: string, scale: number, rotation: number): AppState {
  if (!s.clubhouse.purchasedItemIds.includes(itemId)) return s;
  const key = `${roomId}:${itemId}`;
  return { ...s, clubhouse: { ...s.clubhouse, itemTransforms: {
    ...s.clubhouse.itemTransforms,
    [key]: { scale: Math.max(.55, Math.min(1.65, scale)), rotation: Math.max(-180, Math.min(180, rotation)) },
  } } };
}

export function adjustMapleNeeds(s: AppState, change: Partial<Record<"hunger" | "energy" | "happiness", number>>): AppState {
  const current = s.clubhouse.needs;
  const apply = (key: "hunger" | "energy" | "happiness") => Math.max(0, Math.min(100, current[key] + (change[key] || 0)));
  return { ...s, clubhouse: { ...s.clubhouse, needs: {
    hunger: apply("hunger"), energy: apply("energy"), happiness: apply("happiness"), lastCareDay: todayStr(),
  } } };
}

export function buyMapleSnack(s: AppState, price = 5): AppState {
  if (s.clubhouse.coins < price || s.clubhouse.needs.hunger >= 100) return s;
  const fed = adjustMapleNeeds(s, { hunger: 25, happiness: 4 });
  return { ...fed, clubhouse: { ...fed.clubhouse, coins: fed.clubhouse.coins - price } };
}

export function adoptClubhousePet(s: AppState, kind: ClubhousePetKind): AppState {
  if (s.clubhouse.pet.kind || !s.clubhouse.purchasedItemIds.includes("shop-pet-retreat")) return s;
  const name = kind === "dog" ? "Scout" : "Misty";
  return { ...s, clubhouse: { ...s.clubhouse, pet: {
    kind, name, needs: { hunger: 90, happiness: 90, lastCareDay: todayStr() },
  } } };
}

export function renameClubhousePet(s: AppState, name: string): AppState {
  if (!s.clubhouse.pet.kind) return s;
  const safeName = name.trim().replace(/\s+/g, " ").slice(0, 16);
  if (!safeName || safeName === s.clubhouse.pet.name) return s;
  return { ...s, clubhouse: { ...s.clubhouse, pet: { ...s.clubhouse.pet, name: safeName } } };
}

export function adjustPetNeeds(s: AppState, change: Partial<Record<"hunger" | "happiness", number>>): AppState {
  if (!s.clubhouse.pet.kind) return s;
  const current = s.clubhouse.pet.needs;
  const apply = (key: "hunger" | "happiness") => Math.max(0, Math.min(100, current[key] + (change[key] || 0)));
  return { ...s, clubhouse: { ...s.clubhouse, pet: { ...s.clubhouse.pet, needs: {
    hunger: apply("hunger"), happiness: apply("happiness"), lastCareDay: todayStr(),
  } } } };
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
