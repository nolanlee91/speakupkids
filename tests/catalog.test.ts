// Gác đồng bộ catalog nhẹ (bundle GĐ2): lib/catalog.gen.ts phải khớp nội dung thật.
// ĐỎ ở đây = ai đó (thường là Codex) sửa lib/learn hoặc lib/adventures mà quên chạy:
//   node scripts/gen-catalog.mjs
// ("npm run build" tự chạy nên deploy không bao giờ lệch — test này bắt sớm khi dev.)
import { describe, it, expect } from "vitest";
import { CATALOG } from "@/lib/catalog.gen";
import { SECTIONS, LEVEL1_UNITS, LEVEL2_UNITS, LEVEL3_COLLECTIONS, allLearnLessons } from "@/lib/learn";
import { SEASONS, SEASON_LOST_COMPASS, chapterPlayable } from "@/lib/adventures";
import { resumeChapterLite, lostCompassSeason } from "@/lib/catalog";
import { resumeChapter } from "@/lib/adventures";

describe("catalog.gen đồng bộ với content", () => {
  it("đếm unit khớp", () => {
    expect(CATALOG.unitCounts).toEqual({
      l1: LEVEL1_UNITS.length,
      l2: LEVEL2_UNITS.length,
      l3: LEVEL3_COLLECTIONS.reduce((a, c) => a + c.units.length, 0),
    });
  });

  it("mọi bài học: id + title + sceneImage khớp, không thiếu không thừa", () => {
    const lessons = allLearnLessons();
    expect(Object.keys(CATALOG.lessons).length).toBe(lessons.length);
    for (const l of lessons) {
      expect(CATALOG.lessons[l.id]?.title, l.id).toBe(l.title);
      expect(CATALOG.lessons[l.id]?.sceneImage, l.id).toBe(l.sceneImage ?? null);
    }
  });

  it("sections khớp key/vi", () => {
    expect(CATALOG.sections.map((s) => s.key)).toEqual(SECTIONS.map((s) => s.key));
    expect(CATALOG.sections.map((s) => s.vi)).toEqual(SECTIONS.map((s) => s.vi));
  });

  it("seasons: id, số chương, cờ playable và sceneImage khớp", () => {
    expect(CATALOG.lostCompassId).toBe(SEASON_LOST_COMPASS.id);
    expect(CATALOG.seasons.map((s) => s.id)).toEqual(SEASONS.map((s) => s.id));
    for (let i = 0; i < SEASONS.length; i++) {
      const real = SEASONS[i], lite = CATALOG.seasons[i];
      expect(lite.chapters.map((c) => c.id), real.id).toEqual(real.chapters.map((c) => c.id));
      for (let j = 0; j < real.chapters.length; j++) {
        expect(lite.chapters[j].playable, `${real.id}/${real.chapters[j].id}`).toBe(chapterPlayable(real.chapters[j]));
        expect(lite.chapters[j].vi).toBe(real.chapters[j].vi);
        expect(lite.chapters[j].sceneImage).toBe(real.chapters[j].sceneImage ?? null);
      }
    }
  });

  it("resumeChapterLite cho cùng kết quả với resumeChapter gốc", () => {
    const lite = lostCompassSeason();
    // Thử các trạng thái tiến độ khác nhau: chưa chơi, xong 1 chương, xong 2 chương…
    for (let doneN = 0; doneN <= SEASON_LOST_COMPASS.chapters.length; doneN++) {
      const doneIds = new Set(SEASON_LOST_COMPASS.chapters.slice(0, doneN).map((c) => c.id));
      const isDone = (id: string) => doneIds.has(id);
      expect(resumeChapterLite(lite, isDone)?.id, `xong ${doneN} chương`).toBe(resumeChapter(SEASON_LOST_COMPASS, isDone)?.id);
    }
  });
});
