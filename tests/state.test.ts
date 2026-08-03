// Test migration state + kinh tế Clubhouse — phần dễ làm mất tiến độ/coins của bé.
import { describe, it, expect } from "vitest";
import {
  defaultState, normalizeState, isPremium,
  awardCoinsOnce, awardCashOnce, buyClubhouseItem, claimClubhouseItem,
} from "@/lib/state";

describe("normalizeState / migration", () => {
  it("state rỗng → về mặc định, không nổ", () => {
    const s = normalizeState({});
    expect(s.membership).toBe("free");
    expect(s.learn.currentLesson).toBeTruthy();
    expect(s.clubhouse.coins).toBeGreaterThanOrEqual(0);
  });

  it('membership cũ "premium" migrate thành "pro"', () => {
    const s = normalizeState({ membership: "premium" });
    expect(s.membership).toBe("pro");
    expect(isPremium(s)).toBe(true);
  });

  it("membership rác → free", () => {
    const s = normalizeState({ membership: "hacked-tier" });
    expect(s.membership).toBe("free");
    expect(isPremium(s)).toBe(false);
  });

  it("family giữ nguyên và là premium", () => {
    const s = normalizeState({ membership: "family" });
    expect(s.membership).toBe("family");
    expect(isPremium(s)).toBe(true);
  });
});

describe("kinh tế Clubhouse — chống farm/âm tiền", () => {
  it("awardCoinsOnce chỉ cộng một lần cho mỗi key", () => {
    let s = defaultState();
    const first = awardCoinsOnce(s, "learn:park", 20);
    expect(first.awarded).toBe(20);
    s = first.state;
    const again = awardCoinsOnce(s, "learn:park", 20);
    expect(again.awarded).toBe(0);
    expect(again.state.clubhouse.coins).toBe(s.clubhouse.coins);
  });

  it("awardCashOnce dùng danh sách key riêng, không đụng coins", () => {
    let s = defaultState();
    s = awardCoinsOnce(s, "k1", 10).state;
    const cash = awardCashOnce(s, "k1", 2); // cùng key nhưng ví khác → vẫn được cộng
    expect(cash.awarded).toBe(2);
    expect(cash.state.clubhouse.cash).toBe(s.clubhouse.cash + 2);
  });

  it("không đủ coins thì không mua được, không âm tiền", () => {
    const s = { ...defaultState() };
    s.clubhouse = { ...s.clubhouse, coins: 10 };
    const after = buyClubhouseItem(s, "shop-lamp", 35);
    expect(after).toBe(s); // state không đổi
  });

  it("không mua trùng một món", () => {
    let s = { ...defaultState() };
    s.clubhouse = { ...s.clubhouse, coins: 100 };
    s = buyClubhouseItem(s, "shop-lamp", 35);
    expect(s.clubhouse.coins).toBe(65);
    const again = buyClubhouseItem(s, "shop-lamp", 35);
    expect(again.clubhouse.coins).toBe(65);
  });

  it("claimClubhouseItem không nhận trùng, có đặt vào phòng", () => {
    let s = defaultState();
    s = claimClubhouseItem(s, "learn-story-tent", "study");
    expect(s.clubhouse.unlockedItemIds).toContain("learn-story-tent");
    expect(s.clubhouse.claimedMilestones).toBe(1);
    expect(s.clubhouse.itemRoomIds["learn-story-tent"]).toBe("study");
    const again = claimClubhouseItem(s, "learn-story-tent", "study");
    expect(again.clubhouse.claimedMilestones).toBe(1);
  });
});
