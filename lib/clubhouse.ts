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

export type ShopItem = {
  id: string; en: string; vi: string; price: number; sprite: number;
  x: number; y: number; scale: number; z: number; slot: "wall" | "desk" | "floor";
  sheet?: 1 | 2;
  collection?: "trail" | "cosmic";
};

export const CLUBHOUSE_SHOP: ShopItem[] = [
  { id: "shop-lamp", en: "Explorer Lamp", vi: "Đèn thám hiểm", price: 35, sprite: 0, x: 76, y: 58, scale: .75, z: 5, slot: "desk" },
  { id: "shop-map", en: "Vancouver Map", vi: "Bản đồ Vancouver", price: 55, sprite: 1, x: 18, y: 39, scale: 1.05, z: 3, slot: "wall" },
  { id: "shop-rug", en: "Trail Rug", vi: "Thảm đường mòn", price: 45, sprite: 2, x: 51, y: 82, scale: 1.35, z: 2, slot: "floor" },
  { id: "shop-telescope", en: "Night Telescope", vi: "Kính thiên văn", price: 80, sprite: 3, x: 67, y: 61, scale: .9, z: 5, slot: "floor" },
  { id: "shop-player", en: "Record Player", vi: "Máy nghe nhạc", price: 65, sprite: 4, x: 29, y: 67, scale: .82, z: 5, slot: "desk" },
  { id: "shop-bonsai", en: "Maple Bonsai", vi: "Cây phong bonsai", price: 70, sprite: 5, x: 28, y: 54, scale: .78, z: 5, slot: "desk" },
  { id: "shop-neon", en: "Maple Neon", vi: "Đèn neon lá phong", price: 95, sprite: 6, x: 83, y: 36, scale: .82, z: 4, slot: "wall" },
  { id: "shop-beanbag", en: "Game Beanbag", vi: "Ghế lười", price: 60, sprite: 7, x: 79, y: 75, scale: 1.0, z: 5, slot: "floor" },
  { id: "shop-moon-clock", en: "Moon Clock", vi: "Đồng hồ tuần trăng", price: 75, sprite: 0, sheet: 2, collection: "cosmic", x: 23, y: 30, scale: .72, z: 4, slot: "wall" },
  { id: "shop-planet-lamp", en: "Planet Lamp", vi: "Đèn hành tinh", price: 85, sprite: 1, sheet: 2, collection: "cosmic", x: 73, y: 51, scale: .68, z: 5, slot: "desk" },
  { id: "shop-astro-chair", en: "Astro Chair", vi: "Ghế phi hành gia", price: 110, sprite: 2, sheet: 2, collection: "cosmic", x: 73, y: 73, scale: .92, z: 5, slot: "floor" },
  { id: "shop-lunar-rover", en: "Lunar Rover", vi: "Xe thám hiểm Mặt Trăng", price: 125, sprite: 3, sheet: 2, collection: "cosmic", x: 38, y: 74, scale: .72, z: 6, slot: "floor" },
  { id: "shop-game-console", en: "Game Console", vi: "Máy chơi game", price: 90, sprite: 4, sheet: 2, collection: "cosmic", x: 82, y: 55, scale: .67, z: 6, slot: "desk" },
  { id: "shop-hanging-plant", en: "Hanging Plant", vi: "Chậu cây treo", price: 65, sprite: 5, sheet: 2, collection: "cosmic", x: 13, y: 35, scale: .72, z: 5, slot: "wall" },
  { id: "shop-adventure-books", en: "Adventure Books", vi: "Sách phiêu lưu", price: 55, sprite: 6, sheet: 2, collection: "cosmic", x: 31, y: 55, scale: .66, z: 5, slot: "desk" },
  { id: "shop-lava-lamp", en: "Lava Lamp", vi: "Đèn dung nham", price: 70, sprite: 7, sheet: 2, collection: "cosmic", x: 85, y: 48, scale: .63, z: 6, slot: "desk" },
];

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
