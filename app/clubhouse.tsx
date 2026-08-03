"use client";

import { useEffect, useRef, useState } from "react";
import type { AppState } from "@/lib/state";
import { adjustMapleNeeds, buyClubhouseItem, buyClubhouseOutfit, buyMapleSnack, claimClubhouseItem, moveClubhouseItem, placeClubhouseItem, setClubhouseRoom, toggleClubhouseItem, transformClubhouseItem, wearClubhouseOutfit } from "@/lib/state";
import { ALL_CLUBHOUSE_FURNITURE, CLUBHOUSE_SHOP, MAPLE_OUTFITS, SEASON_SOUVENIRS, clubhouseChoices, clubhouseLearnTotal, earnedSeasonSouvenirs, type MapleOutfit, type ShopItem } from "@/lib/clubhouse";
import { STICKERS } from "@/lib/games";
import { BADGES, earnedBadges, keepsakeCount } from "@/lib/rewards";
import { celebrate, playSuccessSound, speak } from "@/lib/fx";
import { StickerArt } from "./reward-art";

type MaplePose = "cheer" | "think" | "sit" | "sleep" | "create" | "play";
type FurnitureInteraction = { pose: MaplePose; lines: string[]; xOffset?: number; yOffset?: number; needs?: Partial<Record<"hunger" | "energy" | "happiness", number>> };

const POSE_IMAGE: Record<MaplePose, string> = {
  cheer: "/assets/images/gen/maple-pose-cheer.webp",
  think: "/assets/images/gen/maple-pose-think.webp",
  sit: "/assets/images/gen/maple-pose-sit.webp",
  sleep: "/assets/images/gen/maple-pose-sleep.webp",
  create: "/assets/images/gen/maple-pose-create.webp",
  play: "/assets/images/gen/maple-pose-play.webp",
};
const POSE_INDEX: Record<MaplePose, number> = { cheer: 0, think: 1, sit: 2, sleep: 3, create: 4, play: 5 };

function MapleArt({ pose, outfit, alt = "" }: { pose: MaplePose; outfit: MapleOutfit; alt?: string }) {
  if (!outfit.sheet) return <img src={POSE_IMAGE[pose]} alt={alt} />;
  const index = POSE_INDEX[pose], col = index % 3, row = Math.floor(index / 3);
  return <span role={alt ? "img" : undefined} aria-label={alt || undefined} className="maple-outfit-sprite" style={{ backgroundImage: `url(${outfit.sheet})`, backgroundPosition: `${col * 50}% ${row * 100}%` }} />;
}

const INTERACTIONS: Record<string, FurnitureInteraction> = {
  "shop-canopy-bed": { pose: "sleep", lines: ["A quick nap will recharge my ideas.", "This bed is seriously cozy."], xOffset: 0, yOffset: 2, needs: { energy: 35, hunger: -3, happiness: 5 } },
  "shop-beanbag": { pose: "sit", lines: ["Perfect reading spot.", "I could sit here all afternoon."], xOffset: 0, yOffset: 2, needs: { energy: 8, hunger: -2, happiness: 4 } },
  "shop-astro-chair": { pose: "sit", lines: ["Captain Maple is ready for launch!", "This chair feels like a spaceship."], xOffset: 0, yOffset: 2, needs: { energy: 8, hunger: -2, happiness: 5 } },
  "shop-cloud-cushion": { pose: "sit", lines: ["It feels like sitting on a cloud.", "Soft, comfy, and totally mine."], xOffset: 0, yOffset: 2, needs: { energy: 8, hunger: -2, happiness: 4 } },
  "shop-music-keyboard": { pose: "play", lines: ["Let’s make a brand-new tune!", "One, two, three — music time!"], xOffset: -2, needs: { energy: -8, hunger: -5, happiness: 14 } },
  "shop-player": { pose: "play", lines: ["This beat makes my tail dance.", "Great choice — turn it up!"], xOffset: 6, needs: { energy: -6, hunger: -4, happiness: 12 } },
  "shop-game-console": { pose: "play", lines: ["Challenge accepted!", "Just one more level."], xOffset: 5, needs: { energy: -8, hunger: -6, happiness: 14 } },
  "shop-gaming-corner": { pose: "play", lines: ["Ready, player Maple!", "Let’s beat our high score."], xOffset: 0, needs: { energy: -8, hunger: -6, happiness: 14 } },
  "shop-art-easel": { pose: "create", lines: ["I’m painting the mountains at sunset.", "Every picture starts with one idea."], xOffset: 4, needs: { energy: -6, hunger: -4, happiness: 12 } },
  "shop-adventure-books": { pose: "create", lines: ["This chapter looks mysterious.", "Stories can take us anywhere."], xOffset: 5 },
  "shop-maple-bookshelf": { pose: "create", lines: ["Which book should I read first?", "I found a new adventure!"], xOffset: 5 },
  "shop-telescope": { pose: "think", lines: ["I can see something near the moon!", "The sky is full of clues."], xOffset: 7 },
  "shop-aurora-projector": { pose: "think", lines: ["The colours look like northern lights.", "What makes an aurora glow?"], xOffset: 6 },
  "shop-map": { pose: "think", lines: ["Where should we explore next?", "I found Vancouver on the map."], xOffset: 7 },
};

const ROOMS = [
  { id: "lounge", name: "Living Room", en: "living room", icon: "⌂", image: "/assets/images/clubhouse/maple-clubhouse-room-v2.webp", maple: { x: 14, y: 91 }, line: "Welcome to our cozy living room! Where should we put the next treasure?" },
  { id: "study", name: "Study Studio", en: "study studio", icon: "✎", image: "/assets/images/clubhouse/maple-house-study.webp", maple: { x: 15, y: 91 }, line: "This is our study. A great idea deserves a great space!" },
  { id: "rooftop", name: "Rooftop Garden", en: "rooftop garden", icon: "✦", image: "/assets/images/clubhouse/maple-house-rooftop.webp", maple: { x: 18, y: 91 }, line: "Look at the view from our rooftop garden!" },
  { id: "loft", name: "Dream Loft", en: "dream loft", icon: "☾", image: "/assets/images/clubhouse/maple-house-dream-loft.webp", maple: { x: 16, y: 91 }, line: "Welcome to the dream loft. Let's make it cozy!" },
  { id: "maker", name: "Maker Den", en: "maker den", icon: "✹", image: "/assets/images/clubhouse/maple-house-maker-den.webp", maple: { x: 17, y: 91 }, line: "This is our maker den. What will we create today?" },
] as const;
const SHEETS = ["/assets/images/clubhouse/clubhouse-shop-sprites.png", "/assets/images/clubhouse/clubhouse-shop-sprites-02.png", "/assets/images/clubhouse/clubhouse-shop-sprites-03.png", "/assets/images/clubhouse/clubhouse-learn-rewards.png"];
const BDG = "/assets/images/badges/";

function ShopArt({ item, className = "" }: { item: ShopItem; className?: string }) {
  const col = item.sprite % 4;
  const row = Math.floor(item.sprite / 4);
  return <span className={`shop-art ${className}`} style={{ backgroundImage: `url(${SHEETS[(item.sheet || 1) - 1]})`, backgroundPosition: `${col * 100 / 3}% ${row * 100}%` }} />;
}

export function Clubhouse({ state, setState, onClose }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onClose: () => void }) {
  const [panel, setPanel] = useState<"none" | "shop" | "wardrobe" | "journal">("none");
  const [editing, setEditing] = useState(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [delivery, setDelivery] = useState<ShopItem | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [maplePos, setMaplePos] = useState({ x: 14, y: 91 });
  const [mapleWalking, setMapleWalking] = useState(false);
  const [shopMessage, setShopMessage] = useState("");
  const [pendingPurchase, setPendingPurchase] = useState<ShopItem | null>(null);
  const [pendingOutfit, setPendingOutfit] = useState<MapleOutfit | null>(null);
  const [maplePose, setMaplePose] = useState<MaplePose>("cheer");
  const [mapleLine, setMapleLine] = useState("Tap a favourite thing and I’ll try it!");
  const [careNotice, setCareNotice] = useState("");
  const [rewardDismissed, setRewardDismissed] = useState(false);
  const roomRef = useRef<HTMLElement>(null);
  const interactionTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const walkTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const interactionCooldown = useRef<Record<string, number>>({});
  const purchased = new Set(state.clubhouse.purchasedItemIds);
  const equipped = new Set(state.clubhouse.equippedItemIds);
  const room = ROOMS.find((r) => r.id === state.clubhouse.activeRoomId) || ROOMS[0];
  const displayed = ALL_CLUBHOUSE_FURNITURE.filter((item) => equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === room.id);
  const souvenirs = earnedSeasonSouvenirs(state);
  const souvenirIds = new Set(souvenirs.map((item) => item.id));
  const gotStickers = new Set(state.stickers || []);
  const badges = earnedBadges(state);
  const selectedItem = displayed.find((item) => item.id === selectedId);
  const activeOutfit = MAPLE_OUTFITS.find((outfit) => outfit.id === state.clubhouse.activeOutfitId) || MAPLE_OUTFITS[0];
  const ownedOutfits = new Set(state.clubhouse.ownedOutfitIds);
  const rewardChoices = rewardDismissed ? [] : clubhouseChoices(state);

  useEffect(() => {
    setMaplePos(room.maple); setMapleWalking(false); setMaplePose("cheer");
    setMapleLine(room.line);
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
  }, [room.id, room.maple, room.line]);

  useEffect(() => () => {
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  useEffect(() => {
    const decay = window.setInterval(() => setState((s) => adjustMapleNeeds(s, { hunger: -1, energy: -1 })), 120000);
    return () => window.clearInterval(decay);
  }, [setState]);

  function moveMaple(x: number, y: number) {
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
    setMaplePose("cheer");
    setMaplePos({ x: Math.max(9, Math.min(91, x)), y: Math.max(62, Math.min(93, y)) });
    setMapleWalking(true);
    walkTimer.current = window.setTimeout(() => setMapleWalking(false), 760);
  }

  function interactWithFurniture(item: ShopItem, pos: { x: number; y: number }) {
    const now = Date.now();
    if ((interactionCooldown.current[item.id] || 0) > now) { showCareNotice("Maple is still enjoying that. Try another item!", 1800); return; }
    interactionCooldown.current[item.id] = now + 8000;
    const action = INTERACTIONS[item.id] || { pose: "cheer" as MaplePose, lines: [`I have an idea for the ${item.en}.`, `The ${item.en} makes this room feel like ours.`], needs: { energy: -2, hunger: -2, happiness: 5 } };
    const line = action.lines[Math.floor(Math.random() * action.lines.length)];
    moveMaple(pos.x + (action.xOffset ?? (pos.x > 55 ? -9 : 9)), Math.max(66, pos.y + (action.yOffset ?? 6)));
    setMapleLine("On my way…");
    interactionTimer.current = window.setTimeout(() => {
      setMapleWalking(false); setMaplePose(action.pose); setMapleLine(line);
      setState((s) => adjustMapleNeeds(s, action.needs || ({ energy: -3, hunger: -2, happiness: 6 })));
      speak(line, state.prefs.accent, .84);
      idleTimer.current = window.setTimeout(() => { setMaplePose("cheer"); setMapleLine("What should I try next?"); }, 8500);
    }, 720);
  }

  function showCareNotice(message: string, duration = 2400) {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    setCareNotice(message);
    noticeTimer.current = window.setTimeout(() => setCareNotice(""), duration);
  }

  function claimLearnReward(item: ShopItem) {
    setState((s) => claimClubhouseItem(s, item.id, room.id));
    setRewardDismissed(true); setDelivery(item); setMaplePose("cheer");
    setMapleLine(`${item.en} is a special reward for learning!`);
    celebrate(state.prefs.motion !== false); playSuccessSound();
  }

  function giveSnack() {
    if (state.clubhouse.needs.hunger >= 100) { showCareNotice("Maple is full and happy!"); return; }
    if (state.clubhouse.coins < 5) { showCareNotice("You need 5 Coins for a snack."); return; }
    setState((s) => buyMapleSnack(s, 5));
    setMaplePose("sit"); setMapleLine("Yum! That hit the spot."); showCareNotice("+25 Hunger · +4 Happiness");
    speak("Yum! That hit the spot.", state.prefs.accent, .84);
  }

  function chooseOutfit(outfit: MapleOutfit) {
    if (ownedOutfits.has(outfit.id)) { setState((s) => wearClubhouseOutfit(s, outfit.id)); setMapleLine(`This ${outfit.en} look feels perfect!`); return; }
    if (state.clubhouse.cash < outfit.price) { showCareNotice(`You need ${outfit.price - state.clubhouse.cash} more Maple Cash.`); return; }
    setPendingOutfit(outfit);
  }

  function confirmOutfit() {
    if (!pendingOutfit) return;
    setState((s) => buyClubhouseOutfit(s, pendingOutfit.id, pendingOutfit.price));
    setMaplePose("cheer"); setMapleLine(`New outfit unlocked: ${pendingOutfit.en}!`);
    celebrate(state.prefs.motion !== false); playSuccessSound(); setPendingOutfit(null);
  }

  function adjustSelected(scaleDelta: number, rotationDelta: number) {
    if (!selectedItem) return;
    const current = state.clubhouse.itemTransforms[`${room.id}:${selectedItem.id}`] || { scale: 1, rotation: 0 };
    setState((s) => transformClubhouseItem(s, selectedItem.id, room.id, current.scale + scaleDelta, current.rotation + rotationDelta));
  }

  function buy(item: ShopItem) {
    if (purchased.has(item.id)) return;
    if (state.clubhouse.coins < item.price) {
      setShopMessage(`You need ${item.price - state.clubhouse.coins} more Coins. Complete Learn, Practice or Adventure activities to earn them!`);
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
    setShopMessage(`${item.en} purchased! It has been placed in the ${room.name}.`);
    setDelivery(item); celebrate(state.prefs.motion !== false); playSuccessSound();
  }

  function point(e: { clientX: number; clientY: number }) {
    const rect = roomRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 };
  }

  return <div className="clubhouse-overlay clubhouse-v2" role="dialog" aria-modal="true" aria-label="Maple Clubhouse">
    <header className="clubhouse-top">
      <button className="bk" onClick={onClose}>← Close</button>
      <div><h2>Maple Clubhouse</h2><p>A home that grows with every learning adventure</p></div>
      <div className="clubhouse-wallet"><span className="clubhouse-coins"><i>◆</i>{state.clubhouse.coins}</span><span className="clubhouse-cash"><i>✦</i>{state.clubhouse.cash}</span></div>
    </header>

    <main className="clubhouse-main">
      <section ref={roomRef} className={`clubhouse-room game-room clubhouse-stage ${editing ? "is-editing" : ""}`} aria-label="Your Maple House room"
        onClick={(e) => { if (editing || panel !== "none" || (e.target as HTMLElement).closest("button,nav")) return; const p = point(e); if (p) moveMaple(p.x, p.y); }}>
        <img className="clubhouse-bg" src={room.image} alt={`Maple's ${room.name} overlooking Vancouver`} />
        <div className="clubhouse-glow" aria-hidden="true" /><div className="clubhouse-edit-grid" aria-hidden="true" />
        <span className="clubhouse-dust dust-one" aria-hidden="true">✦</span><span className="clubhouse-dust dust-two" aria-hidden="true">✦</span>
        <aside className="maple-needs" aria-label="Maple's needs">
          <div className="need-row energy"><span>⚡ Energy</span><b>{Math.round(state.clubhouse.needs.energy)}</b><i><em style={{ width: `${state.clubhouse.needs.energy}%` }} /></i></div>
          <div className="need-row hunger"><span>● Hunger</span><b>{Math.round(state.clubhouse.needs.hunger)}</b><i><em style={{ width: `${state.clubhouse.needs.hunger}%` }} /></i></div>
          <div className="need-row happiness"><span>♥ Happiness</span><b>{Math.round(state.clubhouse.needs.happiness)}</b><i><em style={{ width: `${state.clubhouse.needs.happiness}%` }} /></i></div>
          <button type="button" onClick={giveSnack} disabled={state.clubhouse.needs.hunger >= 100}>Snack <small>◆ 5</small></button>
          {careNotice && <p role="status">{careNotice}</p>}
        </aside>
        <button className={`clubhouse-maple pose-${maplePose} ${mapleWalking ? "walking" : ""}`} style={{ left: `${maplePos.x}%`, top: `${maplePos.y}%` }}
          onClick={(e) => { e.stopPropagation(); speak(editing ? "Drag things anywhere you like!" : mapleLine, state.prefs.accent, .86); }}>
          <MapleArt pose={maplePose} outfit={activeOutfit} alt={`Maple is ${maplePose}`} />
          <span className="maple-speech">{editing ? "Drag things anywhere you like!" : mapleLine}</span>
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
            onClick={(e) => { e.stopPropagation(); if (!editing) interactWithFurniture(item, pos); }} aria-label={`Use ${item.en} — ${item.vi}`}>
            <ShopArt item={item} /><i>{editing ? "Drag to place" : item.en}</i>
          </button>;
        })}
        {!displayed.length && <div className="clubhouse-empty"><b>This room is waiting for your style.</b><span>Complete activities, earn Coins and choose your first item.</span></div>}

        {editing && selectedItem && <div className="item-transform-controls" aria-label={`Adjust ${selectedItem.en}`}>
          <b>{selectedItem.en}</b><button onClick={() => adjustSelected(0, -15)} title="Rotate left">↶</button><button onClick={() => adjustSelected(-.1, 0)} title="Make smaller">−</button><button onClick={() => adjustSelected(.1, 0)} title="Make bigger">＋</button><button onClick={() => adjustSelected(0, 15)} title="Rotate right">↷</button><button className="store-item" onClick={() => { setState((s) => toggleClubhouseItem(s, selectedItem.id)); setSelectedId(null); }}>Store</button>
        </div>}

        <nav className="clubhouse-actions" aria-label="Clubhouse controls">
          <button className={editing ? "on" : ""} onClick={() => { setEditing((v) => !v); setSelectedId(null); setPanel("none"); }}>✦ <span>{editing ? "Done" : "Decorate"}</span></button>
          <button className={panel === "shop" ? "on" : ""} onClick={() => { setPanel(panel === "shop" ? "none" : "shop"); setEditing(false); }}>◆ <span>Shop</span></button>
          <button className={panel === "wardrobe" ? "on" : ""} onClick={() => { setPanel(panel === "wardrobe" ? "none" : "wardrobe"); setEditing(false); }}>♢ <span>Closet</span></button>
          <button className={panel === "journal" ? "on" : ""} onClick={() => { setPanel(panel === "journal" ? "none" : "journal"); setEditing(false); }}>▣ <span>Journey</span></button>
        </nav>
        <nav className="clubhouse-rooms" aria-label="Rooms in Maple House">{ROOMS.map((r) => <button key={r.id} className={r.id === room.id ? "on" : ""} onClick={() => { setState((s) => setClubhouseRoom(s, r.id)); setSelectedId(null); setPanel("none"); setEditing(false); }}><i>{r.icon}</i><span>{r.name}</span><small>{ALL_CLUBHOUSE_FURNITURE.filter((item) => equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === r.id).length}</small></button>)}</nav>
      </section>

      {editing && <section className="clubhouse-inventory"><div><b>Inventory · {room.name}</b><small>Tap to place; select an item in the room to adjust it</small></div>{ALL_CLUBHOUSE_FURNITURE.filter((item) => purchased.has(item.id)).map((item) => { const here = equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === room.id; return <button key={item.id} className={here ? "equipped" : ""} onClick={() => { if (here) setSelectedId(item.id); else setState((s) => placeClubhouseItem(s, item.id, room.id)); }}><ShopArt item={item} /><span className="inventory-status">{here ? "✓" : "+"}</span></button>; })}{!state.clubhouse.purchasedItemIds.length && <p>No furniture yet — open the Shop to choose your first item.</p>}</section>}

      {panel === "shop" && <section className="clubhouse-drawer clubhouse-shop">
        <header><div><span className="rl-kicker">MAPLE MARKET · {CLUBHOUSE_SHOP.length} ITEMS</span><h3>Build your own style</h3><p>Three collections · buy once, keep forever · scroll to explore.</p></div><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        {shopMessage && <div className="shop-message" role="status">◆ {shopMessage}</div>}
        <div className="shop-grid">{CLUBHOUSE_SHOP.map((item) => { const owned = purchased.has(item.id); const canBuy = state.clubhouse.coins >= item.price; return <article key={item.id} role="button" tabIndex={owned ? -1 : 0} aria-disabled={owned} aria-label={`${owned ? "Owned" : "Buy"} ${item.en}, ${item.price} Coins`} className={`${owned ? "owned" : ""} ${!owned && !canBuy ? "needs-coins" : ""}`} onClick={() => buy(item)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buy(item); } }}><span className={`shop-card-badge ${owned ? "is-owned" : ""}`}>{owned ? "OWNED ✓" : <>◆ {item.price}</>}</span><ShopArt item={item} className="large" /><div><small>{item.collection === "cosmic" ? "COSMIC CLUB" : item.collection === "studio" ? "STUDIO CLUB" : "TRAIL CLUB"}</small><h4>{item.en}</h4><p>{item.vi}</p></div><button type="button" disabled={owned} tabIndex={-1} onClick={(e) => { e.stopPropagation(); buy(item); }}>{owned ? "In your inventory" : canBuy ? "Buy item" : `Need ${item.price - state.clubhouse.coins} more Coins`}</button></article>; })}</div>
      </section>}

      {panel === "wardrobe" && <section className="clubhouse-drawer clubhouse-wardrobe">
        <header><div><span className="rl-kicker">MAPLE CLOSET · {MAPLE_OUTFITS.length} LOOKS</span><h3>Choose Maple's look</h3><p>Keep every unlocked outfit and wear it in every pose.</p></div><strong className="cash-balance">✦ {state.clubhouse.cash}</strong><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        <div className="wardrobe-grid">{MAPLE_OUTFITS.map((outfit) => { const owned = ownedOutfits.has(outfit.id), wearing = activeOutfit.id === outfit.id; return <article key={outfit.id} className={`${owned ? "owned" : ""} ${wearing ? "wearing" : ""}`}><span className="wardrobe-preview"><MapleArt pose="cheer" outfit={outfit} alt={outfit.en} /></span><small>{outfit.collection}</small><h4>{outfit.en}</h4><p>{outfit.vi}</p><button type="button" disabled={wearing} onClick={() => chooseOutfit(outfit)}>{wearing ? "WEARING ✓" : owned ? "Wear this look" : `Unlock · ✦ ${outfit.price}`}</button></article>; })}</div>
      </section>}

      {panel === "journal" && <section className="clubhouse-drawer keepsake-journal">
        <header><div><span>▣</span><div><h3>My Journey Book</h3><p>Special keepsakes that Coins cannot buy</p></div></div><strong>{keepsakeCount(state)} keepsakes</strong><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        <div className="journal-group"><div className="jg-head"><b>Practice Stickers</b><em>{gotStickers.size}/{STICKERS.length}</em></div><div className="sticker-slots">{STICKERS.map((sticker) => <div key={sticker.id} className={`slot ${gotStickers.has(sticker.id) ? "filled" : ""}`}><span className="slot-art">{gotStickers.has(sticker.id) ? <StickerArt id={sticker.id} emoji={sticker.emoji} /> : "?"}</span><span className="slot-name">{gotStickers.has(sticker.id) ? sticker.name : "Locked"}</span></div>)}</div></div>
        <div className="journal-group"><div className="jg-head"><b>Achievement Badges</b><em>{badges.length}/{BADGES.length}</em></div><div className="journal-badges">{BADGES.map((badge) => <div key={badge.id} className={badge.has(state) ? "on" : ""}><img src={`${BDG}${badge.img}`} alt="" /><b>{badge.has(state) ? badge.name : "Locked"}</b></div>)}</div></div>
        <div className="journal-group"><div className="jg-head"><b>Adventure Exclusives</b><em>{souvenirs.length}/{SEASON_SOUVENIRS.length}</em></div><div className="journal-souvenirs">{SEASON_SOUVENIRS.map((item) => <button key={item.id} className={souvenirIds.has(item.id) ? "on" : ""} disabled={!souvenirIds.has(item.id)} onClick={() => speak(item.en, state.prefs.accent, .82)}><span>{souvenirIds.has(item.id) ? item.emoji : "?"}</span><b>{souvenirIds.has(item.id) ? item.en : `Season ${Number(item.seasonId.slice(1))}`}</b></button>)}</div></div>
      </section>}
    </main>

    {rewardChoices.length > 0 && !delivery && !pendingPurchase && !pendingOutfit && <div className="purchase-confirm-backdrop learn-reward-backdrop" role="presentation">
      <section className="learn-reward-modal" role="dialog" aria-modal="true" aria-labelledby="learn-reward-title">
        <span className="rl-kicker">LEARNING MILESTONE</span>
        <h3 id="learn-reward-title">Your learning unlocked a house reward!</h3>
        <p><b>{clubhouseLearnTotal(state)} lessons completed.</b> Choose one exclusive keepsake. These cannot be bought with Coins.</p>
        <div className="learn-reward-choices">
          {rewardChoices.map((item) => <button key={item.id} type="button" onClick={() => claimLearnReward(item)}>
            <ShopArt item={item} className="large" />
            <strong>{item.en}</strong><small>{item.vi}</small><span>Choose this reward</span>
          </button>)}
        </div>
        <button type="button" className="learn-reward-later" onClick={() => setRewardDismissed(true)}>Choose later</button>
      </section>
    </div>}

    {pendingPurchase && <div className="purchase-confirm-backdrop" role="presentation" onClick={() => setPendingPurchase(null)}>
      <section className="purchase-confirm" role="alertdialog" aria-modal="true" aria-labelledby="purchase-title" aria-describedby="purchase-copy" onClick={(e) => e.stopPropagation()}>
        <button className="purchase-confirm-close" aria-label="Cancel purchase" onClick={() => setPendingPurchase(null)}>×</button>
        <span className="rl-kicker">CONFIRM PURCHASE</span><ShopArt item={pendingPurchase} className="large" />
        <h3 id="purchase-title">Buy {pendingPurchase.en}?</h3><p id="purchase-copy">{pendingPurchase.vi} · Place it in the <b>{room.name}</b>.</p>
        <div className="purchase-balance"><span>You have <b>◆ {state.clubhouse.coins}</b></span><i>→</i><span>After purchase <b>◆ {state.clubhouse.coins - pendingPurchase.price}</b></span></div>
        <div className="purchase-confirm-actions"><button type="button" onClick={() => setPendingPurchase(null)}>Not now</button><button type="button" className="confirm-buy" autoFocus onClick={confirmPurchase}>Buy · ◆ {pendingPurchase.price}</button></div>
      </section>
    </div>}

    {pendingOutfit && <div className="purchase-confirm-backdrop" role="presentation" onClick={() => setPendingOutfit(null)}><section className="purchase-confirm outfit-confirm" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}><button className="purchase-confirm-close" aria-label="Cancel purchase" onClick={() => setPendingOutfit(null)}>×</button><span className="rl-kicker">UNLOCK OUTFIT</span><span className="outfit-confirm-preview"><MapleArt pose="cheer" outfit={pendingOutfit} alt={pendingOutfit.en} /></span><h3>{pendingOutfit.en}</h3><p>{pendingOutfit.vi} · Wear it in every room and every pose.</p><div className="purchase-balance"><span>You have <b>✦ {state.clubhouse.cash}</b></span><i>→</i><span>After purchase <b>✦ {state.clubhouse.cash - pendingOutfit.price}</b></span></div><div className="purchase-confirm-actions"><button onClick={() => setPendingOutfit(null)}>Not now</button><button className="confirm-buy" autoFocus onClick={confirmOutfit}>Unlock · ✦ {pendingOutfit.price}</button></div></section></div>}

    {delivery && <div className="clubhouse-delivery" role="status"><div className="delivery-rays" /><span className="rl-kicker">NEW ITEM!</span><ShopArt item={delivery} className="large" /><h3>{delivery.en}</h3><p>{delivery.vi} · Added to your room.</p><button className="btn green" onClick={() => { setDelivery(null); setPanel("none"); setEditing(true); }}>Place it now</button></div>}
  </div>;
}
