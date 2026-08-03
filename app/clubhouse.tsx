"use client";

import { useEffect, useRef, useState } from "react";
import type { AppState } from "@/lib/state";
import { buyClubhouseItem, moveClubhouseItem, placeClubhouseItem, setClubhouseRoom, toggleClubhouseItem, transformClubhouseItem } from "@/lib/state";
import { CLUBHOUSE_SHOP, SEASON_SOUVENIRS, earnedSeasonSouvenirs, type ShopItem } from "@/lib/clubhouse";
import { STICKERS } from "@/lib/games";
import { BADGES, earnedBadges, keepsakeCount } from "@/lib/rewards";
import { celebrate, playSuccessSound, speak } from "@/lib/fx";
import { StickerArt } from "./reward-art";

const ROOMS = [
  { id: "lounge", name: "Phòng sinh hoạt", en: "lounge", icon: "⌂", image: "/assets/images/clubhouse/maple-clubhouse-room-v2.webp", maple: { x: 14, y: 91 }, line: "Welcome to our cozy lounge! Where should we put the next treasure?" },
  { id: "study", name: "Góc học tập", en: "study", icon: "✎", image: "/assets/images/clubhouse/maple-house-study.webp", maple: { x: 15, y: 91 }, line: "This is our study. A great idea deserves a great space!" },
  { id: "rooftop", name: "Sân thượng", en: "rooftop garden", icon: "✦", image: "/assets/images/clubhouse/maple-house-rooftop.webp", maple: { x: 18, y: 91 }, line: "Look at the view from our rooftop garden!" },
  { id: "loft", name: "Phòng ước mơ", en: "dream loft", icon: "☾", image: "/assets/images/clubhouse/maple-house-dream-loft.webp", maple: { x: 16, y: 91 }, line: "Welcome to the dream loft. Let's make it cozy!" },
  { id: "maker", name: "Phòng sáng tạo", en: "maker den", icon: "✹", image: "/assets/images/clubhouse/maple-house-maker-den.webp", maple: { x: 17, y: 91 }, line: "This is our maker den. What will we create today?" },
] as const;
const SHEETS = ["/assets/images/clubhouse/clubhouse-shop-sprites.png", "/assets/images/clubhouse/clubhouse-shop-sprites-02.png", "/assets/images/clubhouse/clubhouse-shop-sprites-03.png"];
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
  const [maplePos, setMaplePos] = useState({ x: 14, y: 91 });
  const [mapleWalking, setMapleWalking] = useState(false);
  const [shopMessage, setShopMessage] = useState("");
  const [pendingPurchase, setPendingPurchase] = useState<ShopItem | null>(null);
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

  useEffect(() => { setMaplePos(room.maple); setMapleWalking(false); }, [room.id, room.maple]);

  function moveMaple(x: number, y: number) {
    setMaplePos({ x: Math.max(9, Math.min(91, x)), y: Math.max(62, Math.min(93, y)) });
    setMapleWalking(true);
    window.setTimeout(() => setMapleWalking(false), 760);
  }

  function adjustSelected(scaleDelta: number, rotationDelta: number) {
    if (!selectedItem) return;
    const current = state.clubhouse.itemTransforms[`${room.id}:${selectedItem.id}`] || { scale: 1, rotation: 0 };
    setState((s) => transformClubhouseItem(s, selectedItem.id, room.id, current.scale + scaleDelta, current.rotation + rotationDelta));
  }

  function buy(item: ShopItem) {
    if (purchased.has(item.id)) return;
    if (state.clubhouse.coins < item.price) {
      setShopMessage(`Cần thêm ${item.price - state.clubhouse.coins} Coins. Hoàn thành Learn, Practice hoặc Adventure để nhận Coins nhé!`);
      return;
    }
    setPendingPurchase(item);
  }

  function confirmPurchase() {
    const item = pendingPurchase;
    if (!item || purchased.has(item.id) || state.clubhouse.coins < item.price) { setPendingPurchase(null); return; }
    setPendingPurchase(null);
    setShopMessage("");
    setState((s) => buyClubhouseItem(s, item.id, item.price, room.id));
    setShopMessage(`Đã mua ${item.en}! Món đồ đã được đặt vào ${room.name}.`);
    setDelivery(item); celebrate(state.prefs.motion !== false); playSuccessSound();
  }

  function point(e: { clientX: number; clientY: number }) {
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
      <section ref={roomRef} className={`clubhouse-room game-room clubhouse-stage ${editing ? "is-editing" : ""}`} aria-label="Căn phòng của con"
        onClick={(e) => { if (editing || panel !== "none" || (e.target as HTMLElement).closest("button,nav")) return; const p = point(e); if (p) moveMaple(p.x, p.y); }}>
        <img className="clubhouse-bg" src={room.image} alt={`${room.name} của Maple nhìn ra Vancouver`} />
        <div className="clubhouse-glow" aria-hidden="true" /><div className="clubhouse-edit-grid" aria-hidden="true" />
        <span className="clubhouse-dust dust-one" aria-hidden="true">✦</span><span className="clubhouse-dust dust-two" aria-hidden="true">✦</span>
        <button className={`clubhouse-maple ${mapleWalking ? "walking" : ""}`} style={{ left: `${maplePos.x}%`, top: `${maplePos.y}%` }}
          onClick={(e) => { e.stopPropagation(); speak(room.line, state.prefs.accent, .86); }}>
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
            onClick={(e) => { e.stopPropagation(); if (!editing) { moveMaple(pos.x > 55 ? pos.x - 10 : pos.x + 10, Math.max(68, pos.y + 7)); speak(`The ${item.en} looks great in our ${room.en}!`, state.prefs.accent, .84); } }} aria-label={`${item.en} — ${item.vi}`}>
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
        <header><div><span className="rl-kicker">MAPLE MARKET · {CLUBHOUSE_SHOP.length} ITEMS</span><h3>Chọn phong cách của con</h3><p>Ba bộ sưu tập · mua một lần, sở hữu mãi · cuộn để xem tất cả.</p></div><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        {shopMessage && <div className="shop-message" role="status">◆ {shopMessage}</div>}
        <div className="shop-grid">{CLUBHOUSE_SHOP.map((item) => { const owned = purchased.has(item.id); const canBuy = state.clubhouse.coins >= item.price; return <article key={item.id} role="button" tabIndex={owned ? -1 : 0} aria-disabled={owned} aria-label={`${owned ? "Đã sở hữu" : "Mua"} ${item.en}, ${item.price} Coins`} className={`${owned ? "owned" : ""} ${!owned && !canBuy ? "needs-coins" : ""}`} onClick={() => buy(item)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buy(item); } }}><span className={`shop-card-badge ${owned ? "is-owned" : ""}`}>{owned ? "OWNED ✓" : <>◆ {item.price}</>}</span><ShopArt item={item} className="large" /><div><small>{item.collection === "cosmic" ? "COSMIC CLUB" : item.collection === "studio" ? "STUDIO CLUB" : "TRAIL CLUB"}</small><h4>{item.en}</h4><p>{item.vi}</p></div><button type="button" disabled={owned} tabIndex={-1} onClick={(e) => { e.stopPropagation(); buy(item); }}>{owned ? "Đã có trong kho" : canBuy ? "Mua vật phẩm" : `Thiếu ${item.price - state.clubhouse.coins} Coins`}</button></article>; })}</div>
      </section>}

      {panel === "journal" && <section className="clubhouse-drawer keepsake-journal">
        <header><div><span>▣</span><div><h3>My Journey Book</h3><p>Những kỷ vật không thể mua bằng Coins</p></div></div><strong>{keepsakeCount(state)} kỷ vật</strong><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        <div className="journal-group"><div className="jg-head"><b>Practice Stickers</b><em>{gotStickers.size}/{STICKERS.length}</em></div><div className="sticker-slots">{STICKERS.map((sticker) => <div key={sticker.id} className={`slot ${gotStickers.has(sticker.id) ? "filled" : ""}`}><span className="slot-art">{gotStickers.has(sticker.id) ? <StickerArt id={sticker.id} emoji={sticker.emoji} /> : "?"}</span><span className="slot-name">{gotStickers.has(sticker.id) ? sticker.name : "Chưa mở"}</span></div>)}</div></div>
        <div className="journal-group"><div className="jg-head"><b>Achievement Badges</b><em>{badges.length}/{BADGES.length}</em></div><div className="journal-badges">{BADGES.map((badge) => <div key={badge.id} className={badge.has(state) ? "on" : ""}><img src={`${BDG}${badge.img}`} alt="" /><b>{badge.has(state) ? badge.name : "Chưa mở"}</b></div>)}</div></div>
        <div className="journal-group"><div className="jg-head"><b>Adventure Exclusives</b><em>{souvenirs.length}/{SEASON_SOUVENIRS.length}</em></div><div className="journal-souvenirs">{SEASON_SOUVENIRS.map((item) => <button key={item.id} className={souvenirIds.has(item.id) ? "on" : ""} disabled={!souvenirIds.has(item.id)} onClick={() => speak(item.en, state.prefs.accent, .82)}><span>{souvenirIds.has(item.id) ? item.emoji : "?"}</span><b>{souvenirIds.has(item.id) ? item.en : `Season ${Number(item.seasonId.slice(1))}`}</b></button>)}</div></div>
      </section>}
    </main>

    {pendingPurchase && <div className="purchase-confirm-backdrop" role="presentation" onClick={() => setPendingPurchase(null)}>
      <section className="purchase-confirm" role="alertdialog" aria-modal="true" aria-labelledby="purchase-title" aria-describedby="purchase-copy" onClick={(e) => e.stopPropagation()}>
        <button className="purchase-confirm-close" aria-label="Hủy mua" onClick={() => setPendingPurchase(null)}>×</button>
        <span className="rl-kicker">XÁC NHẬN MUA</span><ShopArt item={pendingPurchase} className="large" />
        <h3 id="purchase-title">Mua {pendingPurchase.en}?</h3><p id="purchase-copy">{pendingPurchase.vi} sẽ được đặt vào <b>{room.name}</b>.</p>
        <div className="purchase-balance"><span>Hiện có <b>◆ {state.clubhouse.coins}</b></span><i>→</i><span>Còn lại <b>◆ {state.clubhouse.coins - pendingPurchase.price}</b></span></div>
        <div className="purchase-confirm-actions"><button type="button" onClick={() => setPendingPurchase(null)}>Để sau</button><button type="button" className="confirm-buy" autoFocus onClick={confirmPurchase}>Mua · ◆ {pendingPurchase.price}</button></div>
      </section>
    </div>}

    {delivery && <div className="clubhouse-delivery" role="status"><div className="delivery-rays" /><span className="rl-kicker">NEW ITEM!</span><ShopArt item={delivery} className="large" /><h3>{delivery.en}</h3><p>{delivery.vi} đã được đặt vào phòng.</p><button className="btn green" onClick={() => { setDelivery(null); setPanel("none"); setEditing(true); }}>Đặt vào phòng</button></div>}
  </div>;
}
