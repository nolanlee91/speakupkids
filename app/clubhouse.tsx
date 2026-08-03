"use client";

import { useRef, useState } from "react";
import type { AppState } from "@/lib/state";
import { buyClubhouseItem, moveClubhouseItem, placeClubhouseItem, setClubhouseRoom, toggleClubhouseItem, transformClubhouseItem } from "@/lib/state";
import { CLUBHOUSE_SHOP, SEASON_SOUVENIRS, earnedSeasonSouvenirs, type ShopItem } from "@/lib/clubhouse";
import { STICKERS } from "@/lib/games";
import { BADGES, earnedBadges, keepsakeCount } from "@/lib/rewards";
import { celebrate, playSuccessSound, speak } from "@/lib/fx";
import { StickerArt } from "./reward-art";

const ROOMS = [
  { id: "lounge", name: "Phòng sinh hoạt", icon: "⌂", image: "/assets/images/clubhouse/maple-clubhouse-room-v2.webp" },
  { id: "study", name: "Góc học tập", icon: "✎", image: "/assets/images/clubhouse/maple-house-study.webp" },
  { id: "rooftop", name: "Sân thượng", icon: "✦", image: "/assets/images/clubhouse/maple-house-rooftop.webp" },
] as const;
const SHEETS = ["/assets/images/clubhouse/clubhouse-shop-sprites.png", "/assets/images/clubhouse/clubhouse-shop-sprites-02.png"];
const BDG = "/assets/images/badges/";

function ShopArt({ item, className = "" }: { item: ShopItem; className?: string }) {
  const col = item.sprite % 4;
  const row = Math.floor(item.sprite / 4);
  return <span className={`shop-art ${className}`} style={{ backgroundImage: `url(${SHEETS[(item.sheet || 1) - 1]})`, backgroundPosition: `${col * 100 / 3}% ${row * 100}%` }} />;
}

export function Clubhouse({ state, setState, onClose }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onClose: () => void }) {
  const [panel, setPanel] = useState<"none" | "shop" | "journal">("none");
  const [editing, setEditing] = useState(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [delivery, setDelivery] = useState<ShopItem | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const roomRef = useRef<HTMLElement>(null);
  const purchased = new Set(state.clubhouse.purchasedItemIds);
  const equipped = new Set(state.clubhouse.equippedItemIds);
  const room = ROOMS.find((r) => r.id === state.clubhouse.activeRoomId) || ROOMS[0];
  const displayed = CLUBHOUSE_SHOP.filter((item) => equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === room.id);
  const souvenirs = earnedSeasonSouvenirs(state);
  const souvenirIds = new Set(souvenirs.map((item) => item.id));
  const gotStickers = new Set(state.stickers || []);
  const badges = earnedBadges(state);
  const selectedItem = displayed.find((item) => item.id === selectedId);

  function adjustSelected(scaleDelta: number, rotationDelta: number) {
    if (!selectedItem) return;
    const current = state.clubhouse.itemTransforms[`${room.id}:${selectedItem.id}`] || { scale: 1, rotation: 0 };
    setState((s) => transformClubhouseItem(s, selectedItem.id, room.id, current.scale + scaleDelta, current.rotation + rotationDelta));
  }

  function buy(item: ShopItem) {
    if (purchased.has(item.id) || state.clubhouse.coins < item.price) return;
    setState((s) => buyClubhouseItem(s, item.id, item.price, room.id));
    setDelivery(item); celebrate(state.prefs.motion !== false); playSuccessSound();
  }

  function point(e: React.PointerEvent) {
    const rect = roomRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 };
  }

  return <div className="clubhouse-overlay clubhouse-v2" role="dialog" aria-modal="true" aria-label="Maple Clubhouse">
    <header className="clubhouse-top">
      <button className="bk" onClick={onClose}>← Đóng</button>
      <div><h2>Maple Clubhouse</h2><p>Căn phòng lớn lên cùng hành trình của con</p></div>
      <span className="clubhouse-coins"><i>◆</i>{state.clubhouse.coins}</span>
    </header>

    <main className="clubhouse-main">
      <section ref={roomRef} className={`clubhouse-room game-room clubhouse-stage ${editing ? "is-editing" : ""}`} aria-label="Căn phòng của con">
        <img className="clubhouse-bg" src={room.image} alt={`${room.name} của Maple nhìn ra Vancouver`} />
        <div className="clubhouse-glow" aria-hidden="true" /><div className="clubhouse-edit-grid" aria-hidden="true" />
        <span className="clubhouse-dust dust-one" aria-hidden="true">✦</span><span className="clubhouse-dust dust-two" aria-hidden="true">✦</span>
        <button className="clubhouse-maple" onClick={() => speak("Welcome to our clubhouse!", state.prefs.accent, .86)}>
          <img src="/assets/images/gen/maple-pose-cheer.webp" alt="Maple trong Clubhouse" />
          <span>{editing ? "Drag things anywhere you like!" : displayed.length ? "This place looks amazing!" : "Let’s build something awesome."}</span>
        </button>
        {displayed.map((item, index) => {
          const saved = state.clubhouse.itemPositions[`${room.id}:${item.id}`] || (room.id === "lounge" ? state.clubhouse.itemPositions[item.id] : undefined);
          const pos = drag?.id === item.id ? drag : saved || item;
          const itemTransform = state.clubhouse.itemTransforms[`${room.id}:${item.id}`] || { scale: 1, rotation: 0 };
          return <button key={item.id} className={`room-shop-item slot-${item.slot} item-${item.id} ${selectedId === item.id ? "selected" : ""} ${drag?.id === item.id ? "dragging" : ""}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%,-50%) rotate(${itemTransform.rotation}deg) scale(${item.scale * itemTransform.scale})`, zIndex: drag?.id === item.id || selectedId === item.id ? 30 : item.z, animationDelay: `${index * 80}ms` }}
            onPointerDown={(e) => { if (!editing) return; setSelectedId(item.id); e.currentTarget.setPointerCapture(e.pointerId); const p = point(e); if (p) setDrag({ id: item.id, ...p }); }}
            onPointerMove={(e) => { if (!editing || drag?.id !== item.id) return; const p = point(e); if (p) setDrag({ id: item.id, ...p }); }}
            onPointerUp={() => { if (drag?.id === item.id) setState((s) => moveClubhouseItem(s, item.id, room.id, drag.x, drag.y)); setDrag(null); }}
            onClick={() => { if (!editing) speak(item.en, state.prefs.accent, .82); }} aria-label={`${item.en} — ${item.vi}`}>
            <ShopArt item={item} /><i>{editing ? "Kéo để đặt" : item.en}</i>
          </button>;
        })}
        {!displayed.length && <div className="clubhouse-empty"><b>Phòng đang chờ dấu ấn của con.</b><span>Hoàn thành hoạt động, kiếm Coins rồi chọn món đầu tiên.</span></div>}

        {editing && selectedItem && <div className="item-transform-controls" aria-label={`Chỉnh ${selectedItem.en}`}>
          <b>{selectedItem.en}</b><button onClick={() => adjustSelected(0, -15)} title="Xoay trái">↶</button><button onClick={() => adjustSelected(-.1, 0)} title="Thu nhỏ">−</button><button onClick={() => adjustSelected(.1, 0)} title="Phóng to">＋</button><button onClick={() => adjustSelected(0, 15)} title="Xoay phải">↷</button><button className="store-item" onClick={() => { setState((s) => toggleClubhouseItem(s, selectedItem.id)); setSelectedId(null); }}>Cất</button>
        </div>}

        <nav className="clubhouse-actions" aria-label="Điều khiển Clubhouse">
          <button className={editing ? "on" : ""} onClick={() => { setEditing((v) => !v); setSelectedId(null); setPanel("none"); }}>✦ <span>{editing ? "Xong" : "Sắp xếp"}</span></button>
          <button className={panel === "shop" ? "on" : ""} onClick={() => { setPanel(panel === "shop" ? "none" : "shop"); setEditing(false); }}>◆ <span>Shop</span></button>
          <button className={panel === "journal" ? "on" : ""} onClick={() => { setPanel(panel === "journal" ? "none" : "journal"); setEditing(false); }}>▣ <span>Hành trình</span></button>
        </nav>
        <nav className="clubhouse-rooms" aria-label="Các phòng trong Maple House">{ROOMS.map((r) => <button key={r.id} className={r.id === room.id ? "on" : ""} onClick={() => { setState((s) => setClubhouseRoom(s, r.id)); setSelectedId(null); setPanel("none"); setEditing(false); }}><i>{r.icon}</i><span>{r.name}</span><small>{CLUBHOUSE_SHOP.filter((item) => equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === r.id).length}</small></button>)}</nav>
      </section>

      {editing && <section className="clubhouse-inventory"><div><b>Kho đồ · {room.name}</b><small>Chạm để đặt vào phòng; chọn món trong phòng để chỉnh</small></div>{CLUBHOUSE_SHOP.filter((item) => purchased.has(item.id)).map((item) => { const here = equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === room.id; return <button key={item.id} className={here ? "equipped" : ""} onClick={() => { if (here) setSelectedId(item.id); else setState((s) => placeClubhouseItem(s, item.id, room.id)); }}><ShopArt item={item} /><span className="inventory-status">{here ? "✓" : "+"}</span></button>; })}{!state.clubhouse.purchasedItemIds.length && <p>Chưa có nội thất — mở Shop để chọn món đầu tiên.</p>}</section>}

      {panel === "shop" && <section className="clubhouse-drawer clubhouse-shop">
        <header><div><span className="rl-kicker">MAPLE MARKET</span><h3>Chọn phong cách của con</h3><p>Hai bộ sưu tập · mua một lần, sở hữu mãi.</p></div><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        <div className="shop-grid">{CLUBHOUSE_SHOP.map((item) => { const owned = purchased.has(item.id); const canBuy = state.clubhouse.coins >= item.price; return <article key={item.id} className={owned ? "owned" : ""}><ShopArt item={item} className="large" /><div><small>{item.collection === "cosmic" ? "COSMIC CLUB" : "TRAIL CLUB"}</small><h4>{item.en}</h4><p>{item.vi}</p></div><button disabled={owned || !canBuy} onClick={() => buy(item)}>{owned ? "Đã sở hữu" : <><span>◆</span>{item.price}</>}</button></article>; })}</div>
      </section>}

      {panel === "journal" && <section className="clubhouse-drawer keepsake-journal">
        <header><div><span>▣</span><div><h3>My Journey Book</h3><p>Những kỷ vật không thể mua bằng Coins</p></div></div><strong>{keepsakeCount(state)} kỷ vật</strong><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        <div className="journal-group"><div className="jg-head"><b>Practice Stickers</b><em>{gotStickers.size}/{STICKERS.length}</em></div><div className="sticker-slots">{STICKERS.map((sticker) => <div key={sticker.id} className={`slot ${gotStickers.has(sticker.id) ? "filled" : ""}`}><span className="slot-art">{gotStickers.has(sticker.id) ? <StickerArt id={sticker.id} emoji={sticker.emoji} /> : "?"}</span><span className="slot-name">{gotStickers.has(sticker.id) ? sticker.name : "Chưa mở"}</span></div>)}</div></div>
        <div className="journal-group"><div className="jg-head"><b>Achievement Badges</b><em>{badges.length}/{BADGES.length}</em></div><div className="journal-badges">{BADGES.map((badge) => <div key={badge.id} className={badge.has(state) ? "on" : ""}><img src={`${BDG}${badge.img}`} alt="" /><b>{badge.has(state) ? badge.name : "Chưa mở"}</b></div>)}</div></div>
        <div className="journal-group"><div className="jg-head"><b>Adventure Exclusives</b><em>{souvenirs.length}/{SEASON_SOUVENIRS.length}</em></div><div className="journal-souvenirs">{SEASON_SOUVENIRS.map((item) => <button key={item.id} className={souvenirIds.has(item.id) ? "on" : ""} disabled={!souvenirIds.has(item.id)} onClick={() => speak(item.en, state.prefs.accent, .82)}><span>{souvenirIds.has(item.id) ? item.emoji : "?"}</span><b>{souvenirIds.has(item.id) ? item.en : `Season ${Number(item.seasonId.slice(1))}`}</b></button>)}</div></div>
      </section>}
    </main>

    {delivery && <div className="clubhouse-delivery" role="status"><div className="delivery-rays" /><span className="rl-kicker">NEW ITEM!</span><ShopArt item={delivery} className="large" /><h3>{delivery.en}</h3><p>{delivery.vi} đã được đặt vào phòng.</p><button className="btn green" onClick={() => { setDelivery(null); setPanel("none"); setEditing(true); }}>Đặt vào phòng</button></div>}
  </div>;
}
