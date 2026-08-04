import type { AppState } from "./state";
import { isChapterCompleted, learnLessonsDone } from "./state";
// Dùng CATALOG (metadata nhẹ, cờ playable sinh sẵn) thay vì lib/adventures: file này được
// app/page.tsx import ngay màn đầu (CLUBHOUSE_SHOP), kéo theo adventures là +187KB JS
// vào lần tải đầu. tests/catalog.test.ts gác cho CATALOG luôn khớp SEASONS.
import { CATALOG } from "./catalog.gen";

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
  sheet?: 1 | 2 | 3 | 4 | 5;
  collection?: "trail" | "cosmic" | "studio" | "learn" | "prestige";
};

export type MapleOutfit = { id: string; en: string; vi: string; price: number; sheet?: string; collection: string };

export const MAPLE_OUTFITS: MapleOutfit[] = [
  { id: "default", en: "Maple Original", vi: "Bộ đồ quen thuộc", price: 0, collection: "ORIGINAL" },
  { id: "explorer", en: "Trail Explorer", vi: "Nhà thám hiểm", price: 10, sheet: "/assets/images/clubhouse/maple-outfit-explorer.webp", collection: "TRAIL" },
  { id: "creative", en: "Creative Studio", vi: "Nghệ sĩ sáng tạo", price: 16, sheet: "/assets/images/clubhouse/maple-outfit-creative.webp", collection: "STUDIO" },
  { id: "cosmic", en: "Cosmic Dreamer", vi: "Giấc mơ vũ trụ", price: 24, sheet: "/assets/images/clubhouse/maple-outfit-cosmic.webp", collection: "COSMIC" },
];

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
  { id: "shop-canopy-bed", en: "Dream Canopy", vi: "Giường màn ước mơ", price: 150, sprite: 0, sheet: 3, collection: "studio", x: 70, y: 70, scale: 1.05, z: 5, slot: "floor" },
  { id: "shop-aurora-projector", en: "Aurora Projector", vi: "Máy chiếu cực quang", price: 105, sprite: 1, sheet: 3, collection: "studio", x: 25, y: 58, scale: .72, z: 6, slot: "desk" },
  { id: "shop-maple-bookshelf", en: "Maple Bookshelf", vi: "Kệ sách lá phong", price: 135, sprite: 2, sheet: 3, collection: "studio", x: 72, y: 55, scale: .92, z: 5, slot: "floor" },
  { id: "shop-music-keyboard", en: "Music Keyboard", vi: "Đàn keyboard", price: 145, sprite: 3, sheet: 3, collection: "studio", x: 66, y: 70, scale: 1, z: 6, slot: "floor" },
  { id: "shop-gaming-corner", en: "Gaming Corner", vi: "Góc chơi game", price: 175, sprite: 4, sheet: 3, collection: "studio", x: 35, y: 72, scale: 1.08, z: 6, slot: "floor" },
  { id: "shop-art-easel", en: "Mountain Easel", vi: "Giá vẽ núi", price: 95, sprite: 5, sheet: 3, collection: "studio", x: 35, y: 68, scale: .86, z: 6, slot: "floor" },
  { id: "shop-skate-rack", en: "Skate Rack", vi: "Giá ván skateboard", price: 115, sprite: 6, sheet: 3, collection: "studio", x: 78, y: 61, scale: .9, z: 5, slot: "floor" },
  { id: "shop-cloud-cushion", en: "Cloud Cushion", vi: "Ghế mây êm", price: 85, sprite: 7, sheet: 3, collection: "studio", x: 55, y: 79, scale: 1, z: 5, slot: "floor" },
  { id: "shop-grand-aquarium", en: "Grand Aquarium", vi: "Bể cá đại dương", price: 250, sprite: 0, sheet: 5, collection: "prestige", x: 29, y: 60, scale: 1.02, z: 5, slot: "floor" },
  { id: "shop-reading-pod", en: "Reading Pod", vi: "Góc đọc sách con nhộng", price: 250, sprite: 1, sheet: 5, collection: "prestige", x: 73, y: 72, scale: .95, z: 6, slot: "floor" },
  { id: "shop-mini-cinema", en: "Mini Cinema", vi: "Rạp phim thu nhỏ", price: 300, sprite: 2, sheet: 5, collection: "prestige", x: 53, y: 62, scale: 1.08, z: 5, slot: "floor" },
  { id: "shop-treehouse-loft", en: "Treehouse Loft", vi: "Gác cây trong nhà", price: 300, sprite: 3, sheet: 5, collection: "prestige", x: 69, y: 58, scale: 1.08, z: 6, slot: "floor" },
  { id: "shop-aurora-window", en: "Aurora Window", vi: "Cửa sổ cực quang", price: 400, sprite: 4, sheet: 5, collection: "prestige", x: 24, y: 39, scale: .92, z: 4, slot: "wall" },
  { id: "shop-command-station", en: "Command Station", vi: "Trạm điều khiển game", price: 400, sprite: 5, sheet: 5, collection: "prestige", x: 56, y: 68, scale: 1.08, z: 6, slot: "floor" },
  { id: "shop-pet-retreat", en: "Pet Retreat", vi: "Ngôi nhà thú cưng", price: 500, sprite: 6, sheet: 5, collection: "prestige", x: 72, y: 73, scale: 1.02, z: 6, slot: "floor" },
  { id: "shop-adventure-gallery", en: "Adventure Gallery", vi: "Tủ hành trình danh giá", price: 600, sprite: 7, sheet: 5, collection: "prestige", x: 77, y: 57, scale: 1.02, z: 5, slot: "floor" },
];

// Phần thưởng độc quyền từ Learn, có sprite thật và không bán trong Shop.
// Thứ tự là reward pool; món chưa chọn tiếp tục xuất hiện ở mốc kế tiếp.
export const CLUBHOUSE_ITEMS: ShopItem[] = [
  { id: "learn-word-orbit", en: "Word Orbit", vi: "Quỹ đạo từ vựng", price: 0, sprite: 0, sheet: 4, collection: "learn", x: 72, y: 56, scale: .78, z: 6, slot: "desk" },
  { id: "learn-story-tent", en: "Story Tent", vi: "Lều đọc truyện", price: 0, sprite: 1, sheet: 4, collection: "learn", x: 72, y: 72, scale: 1.05, z: 5, slot: "floor" },
  { id: "learn-world-globe", en: "Explorer Globe", vi: "Quả địa cầu khám phá", price: 0, sprite: 2, sheet: 4, collection: "learn", x: 30, y: 58, scale: .8, z: 6, slot: "desk" },
  { id: "learn-terrarium", en: "Science Terrarium", vi: "Hệ sinh thái thu nhỏ", price: 0, sprite: 3, sheet: 4, collection: "learn", x: 75, y: 58, scale: .78, z: 6, slot: "desk" },
  { id: "learn-grammar-gears", en: "Grammar Gears", vi: "Bánh răng ngữ pháp", price: 0, sprite: 4, sheet: 4, collection: "learn", x: 24, y: 37, scale: .82, z: 4, slot: "wall" },
  { id: "learn-book-chair", en: "Book Chair", vi: "Ghế sách", price: 0, sprite: 5, sheet: 4, collection: "learn", x: 72, y: 74, scale: .92, z: 5, slot: "floor" },
  { id: "learn-star-shelf", en: "Achievement Shelf", vi: "Kệ thành tích", price: 0, sprite: 6, sheet: 4, collection: "learn", x: 78, y: 38, scale: .8, z: 4, slot: "wall" },
  { id: "learn-culture-case", en: "Culture Case", vi: "Va-li văn hóa", price: 0, sprite: 7, sheet: 4, collection: "learn", x: 28, y: 72, scale: .88, z: 5, slot: "floor" },
];

export const ALL_CLUBHOUSE_FURNITURE: ShopItem[] = [...CLUBHOUSE_SHOP, ...CLUBHOUSE_ITEMS];

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

export function clubhouseChoices(state: AppState): ShopItem[] {
  if (!clubhouseRewardReady(state)) return [];
  const got = new Set(state.clubhouse.unlockedItemIds);
  return CLUBHOUSE_ITEMS.filter((item) => !got.has(item.id)).slice(0, 2);
}

export function nextClubhouseMilestone(state: AppState): number | null {
  const learned = clubhouseLearnTotal(state);
  return CLUBHOUSE_MILESTONES.find((n) => n > learned) ?? null;
}

export function seasonComplete(state: AppState, seasonId: string): boolean {
  const season = CATALOG.seasons.find((s) => s.id === seasonId);
  if (!season) return false;
  const playable = season.chapters.filter((ch) => ch.playable);
  return playable.length > 0 && playable.every((ch) => isChapterCompleted(state, season.id, ch.id));
}

export function earnedSeasonSouvenirs(state: AppState): SeasonSouvenir[] {
  return SEASON_SOUVENIRS.filter((item) => seasonComplete(state, item.seasonId));
}

export function seasonSouvenirBySeason(seasonId: string): SeasonSouvenir | undefined {
  return SEASON_SOUVENIRS.find((item) => item.seasonId === seasonId);
}
