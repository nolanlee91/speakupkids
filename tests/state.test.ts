// Test migration state + kinh tế Clubhouse — phần dễ làm mất tiến độ/coins của bé.
import { describe, it, expect } from "vitest";
import {
  defaultState, normalizeState, isPremium,
  awardCoinsOnce, awardCashOnce, buyClubhouseItem, claimClubhouseItem, adoptClubhousePet, adjustPetNeeds, renameClubhousePet,
} from "@/lib/state";
import { CLUBHOUSE_SHOP } from "@/lib/clubhouse";

describe("normalizeState / migration", () => {
  it("state rỗng → về mặc định, không nổ", () => {
    const s = normalizeState({});
    expect(s.membership).toBe("free");
    expect(s.learn.currentLesson).toBeTruthy();
    expect(s.clubhouse.coins).toBe(40);
    expect(s.clubhouse.cash).toBe(10);
  });

  it("tài khoản mới và state cũ thiếu ví nhận cùng số dư khởi đầu", () => {
    expect(defaultState().clubhouse.coins).toBe(40);
    expect(defaultState().clubhouse.cash).toBe(10);
    expect(normalizeState({ clubhouse: {} }).clubhouse.coins).toBe(40);
    expect(normalizeState({ clubhouse: {} }).clubhouse.cash).toBe(10);
  });

  it("giữ nguyên số dư hiện tại khi migrate", () => {
    const s = normalizeState({ clubhouse: { coins: 155, cash: 7 } });
    expect(s.clubhouse.coins).toBe(155);
    expect(s.clubhouse.cash).toBe(7);
  });

  it("layout v1 chỉ đưa đồ đang bày về kho, không xóa quyền sở hữu hay tiền", () => {
    const s = normalizeState({ clubhouse: { layoutVersion: 1, coins: 155, purchasedItemIds: ["shop-lamp"], equippedItemIds: ["shop-lamp"], itemRoomIds: { "shop-lamp": "study" }, itemPositions: { "study:shop-lamp": { x: 40, y: 60 } } } });
    expect(s.clubhouse.layoutVersion).toBe(2);
    expect(s.clubhouse.coins).toBe(155);
    expect(s.clubhouse.purchasedItemIds).toEqual(["shop-lamp"]);
    expect(s.clubhouse.equippedItemIds).toEqual([]);
    expect(s.clubhouse.itemRoomIds).toEqual({});
    expect(s.clubhouse.itemSlotIds).toEqual({});
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
  it("Prestige Club nâng trần Shop lên đúng 32 món / 5.185 Coins", () => {
    expect(CLUBHOUSE_SHOP).toHaveLength(32);
    expect(CLUBHOUSE_SHOP.reduce((sum, item) => sum + item.price, 0)).toBe(5185);
    expect(CLUBHOUSE_SHOP.filter((item) => item.collection === "prestige")).toHaveLength(8);
  });

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

  it("claimClubhouseItem không nhận trùng và đưa quà mới vào kho", () => {
    let s = defaultState();
    s = claimClubhouseItem(s, "learn-story-tent", "study");
    expect(s.clubhouse.unlockedItemIds).toContain("learn-story-tent");
    expect(s.clubhouse.claimedMilestones).toBe(1);
    expect(s.clubhouse.purchasedItemIds).toContain("learn-story-tent");
    expect(s.clubhouse.equippedItemIds).not.toContain("learn-story-tent");
    const again = claimClubhouseItem(s, "learn-story-tent", "study");
    expect(again.clubhouse.claimedMilestones).toBe(1);
  });

  it("chỉ nhận nuôi pet sau khi sở hữu Pet Retreat", () => {
    const locked = adoptClubhousePet(defaultState(), "dog");
    expect(locked.clubhouse.pet.kind).toBeNull();
    let ready = { ...defaultState(), clubhouse: { ...defaultState().clubhouse, purchasedItemIds: ["shop-pet-retreat"] } };
    ready = adoptClubhousePet(ready, "cat");
    expect(ready.clubhouse.pet.kind).toBe("cat");
    expect(ready.clubhouse.pet.name).toBe("Misty");
    ready = renameClubhousePet(ready, "  Luna   Moon  ");
    expect(ready.clubhouse.pet.name).toBe("Luna Moon");
    ready = adjustPetNeeds(ready, { hunger: -200, happiness: 20 });
    expect(ready.clubhouse.pet.needs.hunger).toBe(0);
    expect(ready.clubhouse.pet.needs.happiness).toBe(100);
  });
});
