// Test máy chấm Writing Coach — rule-based, phải khoan dung đúng chỗ, nghiêm đúng chỗ.
import { describe, it, expect } from "vitest";
import { scoreWriting, WRITE_SETS, type WriteTask } from "@/lib/writing";

const nameTask: WriteTask = WRITE_SETS[0].items[0]; // "My name is ___." — kw: my/name/is, 4–8 từ

describe("scoreWriting", () => {
  it("câu chuẩn → 3 sao, mọi tiêu chí ✓", () => {
    const r = scoreWriting(nameTask, "My name is Mai.");
    expect(r.stars).toBe(3);
    expect(r.checks.every((c) => c.ok)).toBe(true);
    expect(r.missing).toEqual([]);
  });

  it("thiếu viết hoa + thiếu dấu câu → mất sao nhưng vẫn nhận đủ ý", () => {
    const r = scoreWriting(nameTask, "my name is mai");
    expect(r.missing).toEqual([]);
    expect(r.stars).toBe(2); // đủ từ khóa, sai 2/3 mechanics
    expect(r.checks.find((c) => c.label.includes("Viết hoa"))!.ok).toBe(false);
    expect(r.checks.find((c) => c.label.includes("dấu"))!.ok).toBe(false);
  });

  it("lỗi chính tả nhỏ ở từ dài được tha (nane ≈ name)", () => {
    const r = scoreWriting(nameTask, "My nane is Mai.");
    expect(r.missing).toEqual([]);
  });

  it("thiếu từ khóa → liệt kê đúng từ thiếu", () => {
    const r = scoreWriting(nameTask, "Mai is here today.");
    expect(r.missing).toContain("my");
    expect(r.missing).toContain("name");
    expect(r.stars).toBeLessThanOrEqual(1);
  });

  it("sai thứ tự khung câu → trừ tiêu chí thứ tự", () => {
    const r = scoreWriting(nameTask, "Is name my Mai."); // đủ từ nhưng đảo lộn
    expect(r.missing).toEqual([]);
    expect(r.checks.find((c) => c.label.includes("thứ tự"))!.ok).toBe(false);
    expect(r.stars).toBeLessThan(3);
  });

  it("quá dài so với khung → tiêu chí độ dài ✗", () => {
    const r = scoreWriting(nameTask, "My name is Mai and I really love eating a lot of pho every single day.");
    expect(r.checks.find((c) => c.label.includes("Độ dài"))!.ok).toBe(false);
  });

  it("biến thể từ khóa được chấp nhận (favourite = favorite)", () => {
    const subjTask = WRITE_SETS[1].items[1]; // favorite subject
    const r = scoreWriting(subjTask, "My favourite subject is Math.");
    expect(r.missing).toEqual([]);
    expect(r.stars).toBe(3);
  });

  it("bài trống/không liên quan → 0 sao, không nổ", () => {
    const r = scoreWriting(nameTask, "xin chao");
    expect(r.stars).toBe(0);
  });
});

describe("đoạn văn L3 (minSentences)", () => {
  const para = WRITE_SETS.find((s) => s.id === "w-para-me")!.items[0]; // 3 câu: tên/tuổi/sở thích

  it("viết đủ ý nhưng dồn 1 câu → tối đa 2 sao, tiêu chí số câu ✗", () => {
    const r = scoreWriting(para, "My name is Nam and I am eleven years old and I like football.");
    expect(r.missing).toEqual([]);
    expect(r.stars).toBe(2);
    expect(r.checks.find((c) => c.label.includes("đoạn"))!.ok).toBe(false);
  });

  it("đoạn 3 câu chuẩn → 3 sao, đếm đúng số câu", () => {
    const r = scoreWriting(para, "My name is Nam. I am eleven years old. I like playing football.");
    expect(r.stars).toBe(3);
    const sc = r.checks.find((c) => c.label.includes("đoạn"))!;
    expect(sc.ok).toBe(true);
    expect(sc.note).toContain("3 câu");
  });
});

describe("dữ liệu WRITE_SETS", () => {
  it("9 bộ: 6 bộ câu × 48 bài + 3 bộ đoạn văn L3 × 32 bài = 384, id không trùng", () => {
    expect(WRITE_SETS.length).toBe(9);
    const ids = WRITE_SETS.flatMap((s) => s.items.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of WRITE_SETS) {
      const isPara = s.id.startsWith("w-para");
      expect(s.items.length, s.id).toBe(isPara ? 32 : 48);
    }
    expect(ids.length).toBe(384);
  });

  it("3 bộ đoạn văn: mọi bài đều yêu cầu ≥3 câu và thuộc mức hard", () => {
    for (const sid of ["w-para-me", "w-para-world", "w-para-plans"]) {
      const s = WRITE_SETS.find((x) => x.id === sid)!;
      for (const t of s.items) {
        expect(t.minSentences, t.id).toBeGreaterThanOrEqual(3);
        expect(t.difficulty, t.id).toBe("hard");
      }
    }
  });

  it("câu mẫu của MỌI bài phải tự đạt 3 sao (model không được rớt chính máy chấm)", () => {
    for (const s of WRITE_SETS) for (const t of s.items) {
      const r = scoreWriting(t, t.model);
      expect(r.stars, `${t.id}: "${t.model}"`).toBe(3);
    }
  });
});
