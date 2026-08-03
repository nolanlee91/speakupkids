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

describe("dữ liệu WRITE_SETS", () => {
  it("6 bộ × 5 bài, id không trùng", () => {
    expect(WRITE_SETS.length).toBe(6);
    const ids = WRITE_SETS.flatMap((s) => s.items.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of WRITE_SETS) expect(s.items.length).toBe(5);
  });

  it("câu mẫu của MỌI bài phải tự đạt 3 sao (model không được rớt chính máy chấm)", () => {
    for (const s of WRITE_SETS) for (const t of s.items) {
      const r = scoreWriting(t, t.model);
      expect(r.stars, `${t.id}: "${t.model}"`).toBe(3);
    }
  });
});
