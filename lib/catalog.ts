// Helpers trên catalog nhẹ (bundle GĐ2) — cho màn Today dùng thay lib/learn +
// lib/adventures (735KB nội dung đầy đủ chỉ tải khi bé vào khu Learn/Adventure).
import { CATALOG, type CatalogSeason, type CatalogChapter } from "./catalog.gen";

export { CATALOG };
export type { CatalogSeason, CatalogChapter };

export type CatalogLesson = { id: string; title: string; sceneImage: string | null };
export const catalogLesson = (id: string): CatalogLesson | undefined =>
  CATALOG.lessons[id] ? { id, ...CATALOG.lessons[id] } : undefined;

export const TOTAL_LEARN_UNITS = CATALOG.unitCounts.l1 + CATALOG.unitCounts.l2 + CATALOG.unitCounts.l3;

export const lostCompassSeason = (): CatalogSeason =>
  CATALOG.seasons.find((s) => s.id === CATALOG.lostCompassId) || CATALOG.seasons[0];

// Bản sao logic resumeChapter của lib/adventures nhưng chạy trên chương lite
// (playable đã tính sẵn lúc gen): chương available/inProgress đầu tiên theo mở khóa tuần tự.
export function resumeChapterLite(
  season: CatalogSeason,
  isCompleted: (chapterId: string) => boolean,
  _currentChapterId?: string,
): CatalogChapter | undefined {
  let prevDone = true; // chương đầu luôn mở
  for (const ch of season.chapters) {
    const done = isCompleted(ch.id);
    const unlocked = prevDone;
    prevDone = done;
    if (done || !unlocked) continue;
    if (!ch.playable) continue;   // coming soon → bỏ qua như bản gốc trả locked
    return ch;
  }
  return undefined;
}
