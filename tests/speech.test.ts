// Test chấm nói (so khớp từ + fuzzy) — logic thuần, chạy được trong Node.
import { describe, it, expect } from "vitest";
import { scoreSpeech } from "@/lib/speech";

describe("scoreSpeech", () => {
  it("đọc đúng nguyên câu → 100% · 3 sao", () => {
    const r = scoreSpeech("I like cats.", ["i like cats"]);
    expect(r.pct).toBe(100);
    expect(r.stars).toBe(3);
    expect(r.words.every((w) => w.hit)).toBe(true);
  });

  it("fuzzy tha lỗi nhỏ (cat/cats)", () => {
    const r = scoreSpeech("I like cats.", ["i like cat"]);
    expect(r.pct).toBe(100);
  });

  it("recognizer trả số → quy về chữ (7 = seven)", () => {
    const r = scoreSpeech("I am seven years old.", ["i am 7 years old"]);
    expect(r.pct).toBe(100);
  });

  it("đọc được một nửa → 2 sao, tô đúng từ thiếu", () => {
    const r = scoreSpeech("Good morning", ["good"]);
    expect(r.pct).toBe(50);
    expect(r.stars).toBe(2);
    expect(r.words[0].hit).toBe(true);
    expect(r.words[1].hit).toBe(false);
  });

  it("không trúng từ nào → 0 sao (không âm, không nổ)", () => {
    const r = scoreSpeech("Hello there", ["xyz abc"]);
    expect(r.pct).toBe(0);
    expect(r.stars).toBe(0);
  });

  it("nhiều phương án transcript → lấy phương án điểm cao nhất", () => {
    const r = scoreSpeech("I like apples", ["banana zebra", "i like apples"]);
    expect(r.pct).toBe(100);
    expect(r.heard).toBe("i like apples");
  });

  it("điểm bằng nhau → giữ phương án đầu (độ tự tin recognizer cao nhất)", () => {
    const r = scoreSpeech("I like apples", ["i bike apples", "i like apples"]);
    expect(r.pct).toBe(100); // "bike"≈"like" qua fuzzy nên cả hai đạt 100
    expect(r.heard).toBe("i bike apples");
  });

  it("từ ngắn (≤3 ký tự) phải khớp tuyệt đối, không fuzzy", () => {
    const r = scoreSpeech("a cat", ["o cat"]);
    expect(r.words[0].hit).toBe(false); // "a" ≠ "o"
    expect(r.words[1].hit).toBe(true);
  });
});
