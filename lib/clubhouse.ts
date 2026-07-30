import type { AppState } from "./state";
import { isChapterCompleted, learnLessonsDone } from "./state";
import { SEASONS, chapterPlayable } from "./adventures";

export type ClubhouseItem = {
  id: string;
  en: string;
  vi: string;
  emoji: string;
  source: string;
  x: number;
  y: number;
  scale?: number;
  z?: number;
};

export type SeasonSouvenir = ClubhouseItem & { seasonId: string };

// Đồ trang trí nhận từ Learn. Thứ tự cũng là reward pool:
// món không chọn vẫn đứng đầu pool ở mốc kế tiếp.
export const CLUBHOUSE_ITEMS: ClubhouseItem[] = [
  { id: "reading-lamp", en: "Reading lamp", vi: "Đèn đọc sách", emoji: "💡", source: "Learn · Everyday English", x: 74, y: 53, scale: .9 },
  { id: "book-stack", en: "Book stack", vi: "Chồng sách", emoji: "📚", source: "Learn · Stories", x: 68, y: 57, scale: .92 },
  { id: "indoor-plant", en: "Indoor plant", vi: "Cây trong nhà", emoji: "🪴", source: "Learn · Nature", x: 12, y: 66, scale: 1.08 },
  { id: "world-globe", en: "World globe", vi: "Quả địa cầu", emoji: "🌍", source: "Learn · Places", x: 85, y: 53, scale: .9 },
  { id: "map-poster", en: "World map", vi: "Bản đồ thế giới", emoji: "🗺️", source: "Learn · Travel", x: 21, y: 38, scale: 1.12 },
  { id: "soft-cushion", en: "Soft cushion", vi: "Gối tựa mềm", emoji: "🛋️", source: "Learn · Home", x: 27, y: 72, scale: 1.05 },
  { id: "mini-telescope", en: "Telescope", vi: "Kính thiên văn", emoji: "🔭", source: "Learn · Science", x: 57, y: 59, scale: 1.12, z: 2 },
  { id: "gold-trophy", en: "Gold trophy", vi: "Cúp vàng", emoji: "🏆", source: "Learn milestone", x: 14, y: 52, scale: .84 },
  { id: "camp-lantern", en: "Camp lantern", vi: "Đèn cắm trại", emoji: "🏮", source: "Learn · Camping", x: 41, y: 58, scale: .9 },
  { id: "art-kit", en: "Art kit", vi: "Bộ mỹ thuật", emoji: "🎨", source: "Learn · Creativity", x: 79, y: 67, scale: .9 },
  { id: "maple-compass", en: "Compass", vi: "La bàn", emoji: "🧭", source: "Learn · Directions", x: 21, y: 53, scale: .82 },
  { id: "moon-model", en: "Moon model", vi: "Mô hình Mặt Trăng", emoji: "🌙", source: "Learn · Space", x: 42, y: 30, scale: .9 },
];

// Một souvenir toàn app cho mỗi Season hoàn thành.
// Item/manh mối từng chapter vẫn chỉ nằm trong Adventure.
export const SEASON_SOUVENIRS: SeasonSouvenir[] = [
  { id: "souvenir-s01", seasonId: "s01", en: "Maple Compass", vi: "La bàn Maple", emoji: "🧭", source: "Adventure · Season 1", x: 17, y: 52, scale: .82 },
  { id: "souvenir-s02", seasonId: "s02", en: "Harbour Radio", vi: "Máy vô tuyến bến cảng", emoji: "📻", source: "Adventure · Season 2", x: 31, y: 52, scale: .82 },
  { id: "souvenir-s03", seasonId: "s03", en: "Sky Garden", vi: "Vườn trời", emoji: "🌿", source: "Adventure · Season 3", x: 13, y: 65, scale: .9 },
  { id: "souvenir-s04", seasonId: "s04", en: "Weather Station", vi: "Trạm thời tiết", emoji: "🌦️", source: "Adventure · Season 4", x: 43, y: 52, scale: .8 },
  { id: "souvenir-s05", seasonId: "s05", en: "Story Atlas", vi: "Tập bản đồ truyện", emoji: "📖", source: "Adventure · Season 5", x: 56, y: 56, scale: .82 },
  { id: "souvenir-s06", seasonId: "s06", en: "Market Lantern", vi: "Đèn lồng khu chợ", emoji: "🏮", source: "Adventure · Season 6", x: 69, y: 56, scale: .82 },
  { id: "souvenir-s07", seasonId: "s07", en: "Junior Newspaper", vi: "Tờ báo nhí", emoji: "📰", source: "Adventure · Season 7", x: 80, y: 66, scale: .78 },
  { id: "souvenir-s08", seasonId: "s08", en: "Moonbase Model", vi: "Mô hình căn cứ Mặt Trăng", emoji: "🌙", source: "Adventure · Season 8", x: 42, y: 30, scale: .9 },
];

// Sáu mốc Learn, mỗi mốc chọn một trong hai món. Practice và Adventure có
// reward riêng nên không cộng vào nhịp quà phòng.
export const CLUBHOUSE_MILESTONES = [1, 3, 5, 10, 20, 30];

export function clubhouseLearnTotal(state: AppState): number {
  return learnLessonsDone(state);
}

export function earnedClubhouseRewards(state: AppState): number {
  const learned = clubhouseLearnTotal(state);
  return CLUBHOUSE_MILESTONES.filter((n) => learned >= n).length;
}

export function clubhouseRewardReady(state: AppState): boolean {
  return earnedClubhouseRewards(state) > state.clubhouse.claimedMilestones
    && state.clubhouse.unlockedItemIds.length < CLUBHOUSE_ITEMS.length;
}

export function clubhouseChoices(state: AppState): ClubhouseItem[] {
  if (!clubhouseRewardReady(state)) return [];
  const got = new Set(state.clubhouse.unlockedItemIds);
  return CLUBHOUSE_ITEMS.filter((item) => !got.has(item.id)).slice(0, 2);
}

export function nextClubhouseMilestone(state: AppState): number | null {
  const learned = clubhouseLearnTotal(state);
  return CLUBHOUSE_MILESTONES.find((n) => n > learned) ?? null;
}

export function seasonComplete(state: AppState, seasonId: string): boolean {
  const season = SEASONS.find((s) => s.id === seasonId);
  if (!season) return false;
  const playable = season.chapters.filter(chapterPlayable);
  return playable.length > 0 && playable.every((ch) => isChapterCompleted(state, season.id, ch.id));
}

export function earnedSeasonSouvenirs(state: AppState): SeasonSouvenir[] {
  return SEASON_SOUVENIRS.filter((item) => seasonComplete(state, item.seasonId));
}

export function seasonSouvenirBySeason(seasonId: string): SeasonSouvenir | undefined {
  return SEASON_SOUVENIRS.find((item) => item.seasonId === seasonId);
}
