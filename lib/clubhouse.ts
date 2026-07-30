import type { AppState } from "./state";
import { adventuresDone, gamesDone, learnLessonsDone } from "./state";

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

// Thứ tự này cũng là reward pool: món không chọn vẫn đứng đầu pool ở mốc kế tiếp.
export const CLUBHOUSE_ITEMS: ClubhouseItem[] = [
  { id: "reading-lamp", en: "Reading lamp", vi: "Đèn đọc sách", emoji: "💡", source: "Learn · Everyday English", x: 74, y: 53, scale: .9 },
  { id: "book-stack", en: "Book stack", vi: "Chồng sách", emoji: "📚", source: "Learn · Stories", x: 68, y: 57, scale: .92 },
  { id: "indoor-plant", en: "Indoor plant", vi: "Cây trong nhà", emoji: "🪴", source: "Learn · Nature", x: 12, y: 66, scale: 1.08 },
  { id: "world-globe", en: "World globe", vi: "Quả địa cầu", emoji: "🌍", source: "Practice · Riddles", x: 85, y: 53, scale: .9 },
  { id: "map-poster", en: "Adventure map", vi: "Bản đồ phiêu lưu", emoji: "🗺️", source: "Adventure", x: 21, y: 38, scale: 1.12 },
  { id: "soft-cushion", en: "Soft cushion", vi: "Gối tựa mềm", emoji: "🛋️", source: "Learn · Home", x: 27, y: 72, scale: 1.05 },
  { id: "mini-telescope", en: "Telescope", vi: "Kính thiên văn", emoji: "🔭", source: "Adventure · Sky", x: 57, y: 59, scale: 1.12, z: 2 },
  { id: "gold-trophy", en: "Gold trophy", vi: "Cúp vàng", emoji: "🏆", source: "Practice milestone", x: 14, y: 52, scale: .84 },
  { id: "camp-lantern", en: "Camp lantern", vi: "Đèn cắm trại", emoji: "🏮", source: "Adventure · Camp", x: 41, y: 58, scale: .9 },
  { id: "art-kit", en: "Art kit", vi: "Bộ mỹ thuật", emoji: "🎨", source: "Learn · Creativity", x: 79, y: 67, scale: .9 },
  { id: "maple-compass", en: "Maple compass", vi: "La bàn Maple", emoji: "🧭", source: "Adventure · Season 1", x: 21, y: 53, scale: .82 },
  { id: "moon-model", en: "Moon model", vi: "Mô hình Mặt Trăng", emoji: "🌙", source: "Adventure · Moonbase", x: 42, y: 30, scale: .9 },
];

// Nhịp quà: nhanh ở đầu để bé hiểu cơ chế, giãn dần khi đã có thói quen.
export const CLUBHOUSE_MILESTONES = [1, 3, 5, 7, 9, 12, 15, 18, 22, 26, 31, 36];

export function clubhouseActivityTotal(state: AppState): number {
  return learnLessonsDone(state) + gamesDone(state) + adventuresDone(state);
}

export function earnedClubhouseRewards(state: AppState): number {
  const activity = clubhouseActivityTotal(state);
  return CLUBHOUSE_MILESTONES.filter((n) => activity >= n).length;
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
  const activity = clubhouseActivityTotal(state);
  return CLUBHOUSE_MILESTONES.find((n) => n > activity) ?? null;
}
