// Test Grammar Path — dữ liệu phải sạch (đáp án nằm trong options, id không trùng)
// và máy chấm fill phải nghiêm về dạng từ nhưng khoan dung về hoa/thường/dấu cuối.
import { describe, it, expect } from "vitest";
import { GRAMMAR_TRACKS, GRAMMAR_UNITS, checkFill, grammarUnitById } from "@/lib/grammar";

describe("dữ liệu GRAMMAR", () => {
  it("4 trục: Thì (4) · Câu hỏi (2) · So sánh (2) · Nền tảng (4), mỗi unit ≥12 câu", () => {
    expect(GRAMMAR_TRACKS.map((t) => t.units.length)).toEqual([4, 2, 2, 4]);
    for (const u of GRAMMAR_UNITS) expect(u.drills.length, u.id).toBeGreaterThanOrEqual(12);
  });

  it("id unit + id drill không trùng nhau", () => {
    const uids = GRAMMAR_UNITS.map((u) => u.id);
    expect(new Set(uids).size).toBe(uids.length);
    const dids = GRAMMAR_UNITS.flatMap((u) => u.drills.map((d) => d.id));
    expect(new Set(dids).size).toBe(dids.length);
  });

  it("mọi câu MCQ: đáp án phải nằm trong options, options không trùng", () => {
    for (const u of GRAMMAR_UNITS) for (const d of u.drills) {
      if (d.type !== "mcq") continue;
      expect(d.options, d.id).toBeDefined();
      expect(d.options, d.id).toContain(d.answer);
      expect(new Set(d.options).size, d.id).toBe(d.options!.length);
    }
    // câu fill phải có giải thích + đáp án không rỗng
    for (const u of GRAMMAR_UNITS) for (const d of u.drills) {
      expect(d.answer.trim(), d.id).not.toBe("");
      expect(d.explainVi.trim(), d.id).not.toBe("");
    }
  });

  it("mỗi unit đều có quy tắc, khuôn dạng và ví dụ", () => {
    for (const u of GRAMMAR_UNITS) {
      expect(u.rule.length, u.id).toBeGreaterThan(10);
      expect(u.forms.length, u.id).toBeGreaterThanOrEqual(3);
      expect(u.examples.length, u.id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("checkFill", () => {
  const rises = grammarUnitById("g-present")!.drills.find((d) => d.id === "gp6")!; // answer: rises
  const dontWatch = grammarUnitById("g-present")!.drills.find((d) => d.id === "gp8")!; // don't watch + accept

  it("đúng dạng → đúng, bất kể hoa/thường và dấu chấm cuối", () => {
    expect(checkFill(rises, "rises")).toBe(true);
    expect(checkFill(rises, "Rises")).toBe(true);
    expect(checkFill(rises, "rises.")).toBe(true);
  });

  it("sai dạng từ → sai (ngữ pháp không fuzzy)", () => {
    expect(checkFill(rises, "rise")).toBe(false);
    expect(checkFill(rises, "rised")).toBe(false);
  });

  it("chấp nhận biến thể trong accept (do not watch = don't watch)", () => {
    expect(checkFill(dontWatch, "don't watch")).toBe(true);
    expect(checkFill(dontWatch, "do not watch")).toBe(true);
    expect(checkFill(dontWatch, "  DO NOT   WATCH ")).toBe(true);
    expect(checkFill(dontWatch, "not watch")).toBe(false);
  });

  it("chuỗi rỗng → sai, không nổ", () => {
    expect(checkFill(rises, "   ")).toBe(false);
  });
});
