"use client";

import { useState } from "react";
import type { AppState } from "@/lib/state";
import { buyClubhouseItem, toggleClubhouseItem } from "@/lib/state";
import { CLUBHOUSE_SHOP, SEASON_SOUVENIRS, earnedSeasonSouvenirs, type ShopItem } from "@/lib/clubhouse";
import { STICKERS } from "@/lib/games";
import { BADGES, earnedBadges, keepsakeCount } from "@/lib/rewards";
import { celebrate, playSuccessSound, speak } from "@/lib/fx";
import { StickerArt } from "./reward-art";

const ROOM = "/assets/images/clubhouse/maple-clubhouse-room-v2.webp";
const SPRITES = "/assets/images/clubhouse/clubhouse-shop-sprites.png";
const BDG = "/assets/images/badges/";

function ShopArt({ item, className = "" }: { item: ShopItem; className?: string }) {
  const col = item.sprite % 4;
  const row = Math.floor(item.sprite / 4);
  return <span className={`shop-art ${className}`} style={{ backgroundImage: `url(${SPRITES})`, backgroundPosition: `${col * 100 / 3}% ${row * 100}%` }} />;
}

export function Clubhouse({ state, setState, onClose }: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"room" | "shop" | "journal">("room");
  const purchased = new Set(state.clubhouse.purchasedItemIds);
  const equipped = new Set(state.clubhouse.equippedItemIds);
  const displayed = CLUBHOUSE_SHOP.filter((item) => equipped.has(item.id));
  const gotStickers = new Set(state.stickers || []);
  const souvenirs = earnedSeasonSouvenirs(state);
  const souvenirIds = new Set(souvenirs.map((item) => item.id));
  const badges = earnedBadges(state);

  function buy(item: ShopItem) {
    if (purchased.has(item.id) || state.clubhouse.coins < item.price) return;
    setState((s) => buyClubhouseItem(s, item.id, item.price));
    celebrate(state.prefs.motion !== false);
    playSuccessSound();
  }

  function toggle(item: ShopItem) {
    setState((s) => toggleClubhouseItem(s, item.id));
  }

  return (
    <div className="clubhouse-overlay" role="dialog" aria-modal="true" aria-label="Maple Clubhouse">
      <header className="clubhouse-top">
        <button className="bk" onClick={onClose}>← Đóng</button>
        <div><h2>Maple Clubhouse</h2><p>Học, kiếm Coins và xây căn phòng của riêng con</p></div>
        <span className="clubhouse-coins"><i>◆</i>{state.clubhouse.coins}</span>
      </header>

      <main className="clubhouse-main">
        <nav className="clubhouse-tabs" aria-label="Khu Clubhouse">
          <button className={tab === "room" ? "on" : ""} onClick={() => setTab("room")}>My Room</button>
          <button className={tab === "shop" ? "on" : ""} onClick={() => setTab("shop")}>Shop</button>
          <button className={tab === "journal" ? "on" : ""} onClick={() => setTab("journal")}>Journey Book</button>
        </nav>

        {tab === "room" && <>
          <section className="clubhouse-room game-room" aria-label="Căn phòng của con">
            <img className="clubhouse-bg" src={ROOM} alt="Clubhouse 2.5D nhìn ra Vancouver" />
            <div className="clubhouse-glow" aria-hidden="true" />
            <span className="clubhouse-dust dust-one" aria-hidden="true">✦</span>
            <span className="clubhouse-dust dust-two" aria-hidden="true">✦</span>
            <button className="clubhouse-maple" onClick={() => speak("Welcome to our clubhouse!", state.prefs.accent, .86)}>
              <img src="/assets/images/gen/maple-pose-cheer.webp" alt="Maple trong Clubhouse" />
              <span>{displayed.length ? "This place looks amazing!" : "Let’s build something awesome."}</span>
            </button>
            {displayed.map((item, index) => <button key={item.id} className={`room-shop-item slot-${item.slot}`}
              style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(-50%,-50%) scale(${item.scale})`, zIndex: item.z, animationDelay: `${index * 80}ms` }}
              onClick={() => speak(item.en, state.prefs.accent, .82)} aria-label={`${item.en} — ${item.vi}`}>
              <ShopArt item={item} /><i>{item.en}</i>
            </button>)}
            {!displayed.length && <div className="clubhouse-empty"><b>Phòng đang chờ dấu ấn của con.</b><span>Dùng Maple Coins trong Shop để chọn món đầu tiên.</span></div>}
          </section>
          <section className="room-loadout">
            <div><span className="rl-kicker">MY LOADOUT</span><h3>Đồ đang sở hữu</h3><p>Chạm để trưng bày hoặc cất món đồ. Coins không bị trừ lại.</p></div>
            <button className="btn green" onClick={() => setTab("shop")}>Mở Shop</button>
            <div className="loadout-grid">
              {CLUBHOUSE_SHOP.filter((item) => purchased.has(item.id)).map((item) => <button key={item.id} className={equipped.has(item.id) ? "equipped" : ""} onClick={() => toggle(item)}>
                <ShopArt item={item} /><b>{item.en}</b><small>{equipped.has(item.id) ? "Đang trưng bày" : "Đã cất"}</small>
              </button>)}
              {!state.clubhouse.purchasedItemIds.length && <p className="loadout-empty">Chưa có nội thất. Hoàn thành một Unit để nhận 20 Coins.</p>}
            </div>
          </section>
        </>}

        {tab === "shop" && <section className="clubhouse-shop">
          <header><div><span className="rl-kicker">MAPLE MARKET</span><h3>Nâng cấp căn phòng</h3><p>Giá cố định, không loot box. Mỗi món mua một lần và sở hữu mãi.</p></div><strong><i>◆</i>{state.clubhouse.coins}</strong></header>
          <div className="shop-grid">{CLUBHOUSE_SHOP.map((item) => {
            const owned = purchased.has(item.id); const canBuy = state.clubhouse.coins >= item.price;
            return <article key={item.id} className={owned ? "owned" : ""}>
              <ShopArt item={item} className="large" />
              <div><h4>{item.en}</h4><p>{item.vi}</p></div>
              <button disabled={owned || !canBuy} onClick={() => buy(item)}>{owned ? "Đã sở hữu" : <><span>◆</span>{item.price}</>}</button>
            </article>;
          })}</div>
          <aside className="coin-rules"><b>Kiếm Maple Coins</b><span>Unit Learn đầu tiên: +20</span><span>Topic Practice đầu tiên: +10</span><span>Xong Học + Luyện trong ngày: +15</span><span>Chapter mới: +20</span></aside>
        </section>}

        {tab === "journal" && <section className="keepsake-journal">
          <header><div><span>▣</span><div><h3>My Journey Book</h3><p>Những kỷ vật không thể mua bằng Coins</p></div></div><strong>{keepsakeCount(state)} kỷ vật</strong></header>
          <div className="journal-group"><div className="jg-head"><b>Practice Stickers</b><span>Khám phá và luyện tập</span><em>{gotStickers.size}/{STICKERS.length}</em></div>
            <div className="sticker-slots">{STICKERS.map((sticker) => <div key={sticker.id} className={`slot ${gotStickers.has(sticker.id) ? "filled" : ""}`}><span className="slot-art">{gotStickers.has(sticker.id) ? <StickerArt id={sticker.id} emoji={sticker.emoji} /> : "?"}</span><span className="slot-name">{gotStickers.has(sticker.id) ? sticker.name : "Chưa mở"}</span></div>)}</div>
          </div>
          <div className="journal-group"><div className="jg-head"><b>Achievement Badges</b><span>Những thành tích lớn</span><em>{badges.length}/{BADGES.length}</em></div>
            <div className="journal-badges">{BADGES.map((badge) => <div key={badge.id} className={badge.has(state) ? "on" : ""}><img src={`${BDG}${badge.img}`} alt="" /><b>{badge.has(state) ? badge.name : "Chưa mở"}</b><small>{badge.description}</small></div>)}</div>
          </div>
          <div className="journal-group"><div className="jg-head"><b>Adventure Exclusives</b><span>Chỉ nhận khi hoàn thành cả Season</span><em>{souvenirs.length}/{SEASON_SOUVENIRS.length}</em></div>
            <div className="journal-souvenirs">{SEASON_SOUVENIRS.map((item) => <button key={item.id} className={souvenirIds.has(item.id) ? "on" : ""} disabled={!souvenirIds.has(item.id)} onClick={() => speak(item.en, state.prefs.accent, .82)}><span>{souvenirIds.has(item.id) ? item.emoji : "?"}</span><b>{souvenirIds.has(item.id) ? item.en : `Season ${Number(item.seasonId.slice(1))}`}</b><small>{souvenirIds.has(item.id) ? item.vi : "Chưa hoàn thành"}</small></button>)}</div>
          </div>
        </section>}
      </main>
    </div>
  );
}
