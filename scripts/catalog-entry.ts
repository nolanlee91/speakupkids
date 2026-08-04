// Entry cho gen-catalog.mjs: import content ĐẦY ĐỦ rồi rút ra phần metadata nhẹ
// mà màn Today (app/page.tsx) cần — chạy lúc build, KHÔNG bao giờ vào bundle client.
import { SECTIONS, LEVEL1_UNITS, LEVEL2_UNITS, LEVEL3_COLLECTIONS, allLearnLessons } from "../lib/learn";
import { SEASONS, SEASON_LOST_COMPASS, chapterPlayable } from "../lib/adventures";

export const catalog = {
  sections: SECTIONS.map((s) => ({ key: s.key, name: s.name, vi: s.vi, icon: s.icon, desc: s.desc })),
  unitCounts: {
    l1: LEVEL1_UNITS.length,
    l2: LEVEL2_UNITS.length,
    l3: LEVEL3_COLLECTIONS.reduce((a, c) => a + c.units.length, 0),
  },
  lessons: Object.fromEntries(
    allLearnLessons().map((l) => [l.id, { title: l.title, sceneImage: l.sceneImage ?? null }]),
  ) as Record<string, { title: string; sceneImage: string | null }>,
  lostCompassId: SEASON_LOST_COMPASS.id,
  seasons: SEASONS.map((se) => ({
    id: se.id,
    chapters: se.chapters.map((ch) => ({
      id: ch.id, vi: ch.vi, sceneImage: ch.sceneImage ?? null, playable: chapterPlayable(ch),
    })),
  })),
};
