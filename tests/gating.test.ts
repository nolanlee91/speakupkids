// Test gating freemium — sai ở đây là lỗi doanh thu (mở nhầm nội dung Pro)
// hoặc lỗi trải nghiệm (khóa nhầm nội dung Free).
import { describe, it, expect } from "vitest";
import { learnLocked, practiceItemLocked, adventureSeasonLocked } from "@/lib/gating";
import { defaultState, type AppState } from "@/lib/state";
import { PUZZLE_SETS, RIDDLE_SETS, LISTEN_SETS } from "@/lib/banks";
import { DETECTIVE_SCENES } from "@/lib/scenes";

const free: AppState = defaultState();
const pro: AppState = { ...defaultState(), membership: "pro" };
const family: AppState = { ...defaultState(), membership: "family" };

describe("learnLocked", () => {
  it("L0 Phonics mở hết cho Free", () => {
    expect(learnLocked(free, "0", 0)).toBe(false);
    expect(learnLocked(free, "0", 9)).toBe(false);
  });
  it("L1/L2: Free mở 3 bài đầu, khóa từ bài 4", () => {
    expect(learnLocked(free, "1", 2)).toBe(false);
    expect(learnLocked(free, "1", 3)).toBe(true);
    expect(learnLocked(free, "2", 3)).toBe(true);
  });
  it("L3: 3 bài đầu mỗi collection", () => {
    expect(learnLocked(free, "3", 2)).toBe(false);
    expect(learnLocked(free, "3", 3)).toBe(true);
  });
  it("Pro và Family mở tất cả", () => {
    expect(learnLocked(pro, "3", 29)).toBe(false);
    expect(learnLocked(family, "1", 29)).toBe(false);
  });
});

describe("practiceItemLocked (gate theo ID, không theo index hiển thị)", () => {
  it("3 bộ đầu mỗi game miễn phí, từ bộ 4 khóa", () => {
    expect(practiceItemLocked(false, "puzzle", PUZZLE_SETS[0].id)).toBe(false);
    expect(practiceItemLocked(false, "puzzle", PUZZLE_SETS[2].id)).toBe(false);
    expect(practiceItemLocked(false, "puzzle", PUZZLE_SETS[3].id)).toBe(true);
    expect(practiceItemLocked(false, "riddle", RIDDLE_SETS[3].id)).toBe(true);
    expect(practiceItemLocked(false, "picdet", DETECTIVE_SCENES[3].id)).toBe(true);
  });
  it("Nghe & chọn chỉ mở 2 bộ đầu", () => {
    expect(practiceItemLocked(false, "listen", LISTEN_SETS[1].id)).toBe(false);
    expect(practiceItemLocked(false, "listen", LISTEN_SETS[2].id)).toBe(true);
  });
  it("premium mở tất cả", () => {
    expect(practiceItemLocked(true, "puzzle", PUZZLE_SETS[PUZZLE_SETS.length - 1].id)).toBe(false);
  });
});

describe("adventureSeasonLocked", () => {
  it("Free: 2 season đầu mở, season 3 khóa", () => {
    expect(adventureSeasonLocked(free, 0)).toBe(false);
    expect(adventureSeasonLocked(free, 1)).toBe(false);
    expect(adventureSeasonLocked(free, 2)).toBe(true);
  });
  it("Pro mở tất cả season", () => {
    expect(adventureSeasonLocked(pro, 7)).toBe(false);
  });
});
