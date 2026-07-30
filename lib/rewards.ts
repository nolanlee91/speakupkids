import type { AppState } from "./state";
import { adventuresDone, gamesDone, learnLessonsDone, totalLearned, totalStars } from "./state";
import { earnedSeasonSouvenirs } from "./clubhouse";

export type Badge = {
  id: string;
  img: string;
  name: string;
  description: string;
  has: (state: AppState) => boolean;
};

export const BADGES: Badge[] = [
  { id: "first-lesson", img: "badge-star.webp", name: "Bài đầu tiên", description: "Hoàn thành bài Learn đầu tiên", has: (s) => learnLessonsDone(s) >= 1 },
  { id: "three-day-streak", img: "badge-streak.webp", name: "Ba ngày liên tiếp", description: "Giữ chuỗi học ba ngày", has: (s) => s.streak >= 3 },
  { id: "practice-three", img: "badge-speaking.webp", name: "Người luyện tập", description: "Hoàn thành ba lượt Practice", has: (s) => gamesDone(s) >= 3 },
  { id: "fifteen-sentences", img: "badge-pronunciation.webp", name: "Thuộc 15 câu", description: "Ghi nhớ 15 câu tiếng Anh", has: (s) => totalLearned(s) >= 15 },
  { id: "three-units", img: "badge-listening.webp", name: "Học đều đặn", description: "Hoàn thành ba Unit", has: (s) => learnLessonsDone(s) >= 3 },
  { id: "ten-stars", img: "badge-trophy.webp", name: "Mười ngôi sao", description: "Đạt tổng cộng 10 sao", has: (s) => totalStars(s) >= 10 },
  { id: "first-adventure", img: "badge-explorer.webp", name: "Nhà phiêu lưu", description: "Vượt chapter Adventure đầu tiên", has: (s) => adventuresDone(s) >= 1 },
  { id: "five-stickers", img: "badge-vancouver.webp", name: "Nhà sưu tập", description: "Sưu tầm năm sticker", has: (s) => (s.stickers || []).length >= 5 },
];

export function earnedBadges(state: AppState): Badge[] {
  return BADGES.filter((badge) => badge.has(state));
}

// Keepsake = decoration + season souvenir + sticker + badge.
// Sao và streak là chỉ số, Adventure chapter item là đạo cụ cốt truyện nên không tính.
export function keepsakeCount(state: AppState): number {
  return state.clubhouse.unlockedItemIds.length
    + earnedSeasonSouvenirs(state).length
    + (state.stickers || []).length
    + earnedBadges(state).length;
}
