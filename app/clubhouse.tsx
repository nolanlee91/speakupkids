"use client";

import { useEffect, useRef, useState } from "react";
import type { AppState } from "@/lib/state";
import { adjustMapleNeeds, adjustPetNeeds, adoptClubhousePet, buyClubhouseItem, buyClubhouseOutfit, buyMapleSnack, claimClubhouseItem, placeClubhouseItem, renameClubhousePet, setClubhouseRoom, toggleClubhouseItem, wearClubhouseOutfit, type ClubhousePetKind } from "@/lib/state";
import { ALL_CLUBHOUSE_FURNITURE, CLUBHOUSE_SHOP, MAPLE_OUTFITS, SEASON_SOUVENIRS, clubhouseChoices, clubhouseLearnTotal, earnedSeasonSouvenirs, type MapleOutfit, type ShopItem } from "@/lib/clubhouse";
import { STICKERS } from "@/lib/games";
import { BADGES, earnedBadges, keepsakeCount } from "@/lib/rewards";
import { celebrate, playSuccessSound, speak, stopSpeaking } from "@/lib/fx";
import { StickerArt } from "./reward-art";

type MaplePose = "cheer" | "think" | "sit" | "sleep" | "create" | "play";
type PetPose = "idle" | "walk" | "sit" | "sleep" | "eat" | "play";
type FurnitureInteraction = {
  pose: MaplePose; lines: string[]; xOffset?: number; yOffset?: number;
  // anchor: điểm ĐẶT CHÂN Maple, tính lệch từ TÂM món đồ (đơn vị % sân khấu).
  // Có anchor thì Maple đứng/ngồi đúng chỗ của món đó thay vì lệch chung chung.
  anchor?: { x: number; y: number };
  // sitIn: món đồ được vẽ ĐÈ lên Maple khi cô dùng nó → trông như ngồi lọt vào ghế,
  // chui vào giường, thay vì dán đè lên trên (đây là lý do trước đây "ngồi trên không khí").
  sitIn?: boolean;
  needs?: Partial<Record<"hunger" | "energy" | "happiness", number>>;
};

/* ── Hệ toạ độ sàn (2.5D) ────────────────────────────────────────────────
   y = ĐIỂM CHÂN chạm sàn, tính theo % chiều cao sân khấu (CSS đã neo Maple và
   pet bằng translate(-50%,-100%) nên toạ độ y chính là chân).
   FLOOR = vùng sàn đi lại được; ra ngoài vùng này là leo lên tường. */
const FLOOR = { top: 63, bottom: 97, left: 7, right: 93 };
const clampFloor = (x: number, y: number) => ({
  x: Math.min(FLOOR.right, Math.max(FLOOR.left, x)),
  y: Math.min(FLOOR.bottom, Math.max(FLOOR.top, y)),
});
// Xa nhỏ – gần to: chân càng thấp (y càng lớn) thì càng gần camera.
// Giữ biên độ vừa phải (0,86–1,10) để là gợi ý phối cảnh, không làm đồ vật méo cỡ.
function depthScale(y: number): number {
  const t = (y - FLOOR.top) / (FLOOR.bottom - FLOOR.top);
  return +(0.86 + Math.min(1, Math.max(0, t)) * 0.24).toFixed(3);
}

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

const PET_POSE_INDEX: Record<PetPose, number> = { idle: 0, walk: 1, sit: 2, sleep: 3, eat: 4, play: 5 };
function PetArt({ kind, pose, alt = "" }: { kind: ClubhousePetKind; pose: PetPose; alt?: string }) {
  const index = PET_POSE_INDEX[pose], col = index % 3, row = Math.floor(index / 3);
  return <span role={alt ? "img" : undefined} aria-label={alt || undefined} className="clubhouse-pet-sprite" style={{ backgroundImage: `url(/assets/images/clubhouse/clubhouse-pet-${kind}.webp)`, backgroundPosition: `${col * 50}% ${row * 100}%` }} />;
}

const INTERACTIONS: Record<string, FurnitureInteraction> = {
  "shop-canopy-bed": { pose: "sleep", lines: ["A quick nap will recharge my ideas.", "This bed is seriously cozy."], anchor: { x: -1, y: 5 }, sitIn: true, needs: { energy: 35, hunger: -3, happiness: 5 } },
  "shop-beanbag": { pose: "sit", lines: ["Perfect reading spot.", "I could sit here all afternoon."], anchor: { x: 0, y: 4 }, sitIn: true, needs: { energy: 8, hunger: -2, happiness: 4 } },
  "shop-astro-chair": { pose: "sit", lines: ["Captain Maple is ready for launch!", "This chair feels like a spaceship."], anchor: { x: 0, y: 4 }, sitIn: true, needs: { energy: 8, hunger: -2, happiness: 5 } },
  "shop-cloud-cushion": { pose: "sit", lines: ["It feels like sitting on a cloud.", "Soft, comfy, and totally mine."], anchor: { x: 0, y: 4 }, sitIn: true, needs: { energy: 8, hunger: -2, happiness: 4 } },
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
  "shop-grand-aquarium": { pose: "think", lines: ["I spotted the orange fish!", "An aquarium is a tiny underwater world."], xOffset: 7, needs: { energy: 3, hunger: -2, happiness: 10 } },
  "shop-reading-pod": { pose: "sit", lines: ["This pod is perfect for a long story.", "Quiet, cozy, and full of ideas."], anchor: { x: 0, y: 5 }, sitIn: true, needs: { energy: 8, hunger: -2, happiness: 8 } },
  // Rạp phim: bé NGỒI TRƯỚC màn hình (không chui vào) → có anchor nhưng không sitIn.
  "shop-mini-cinema": { pose: "sit", lines: ["The next scene is my favourite!", "Let’s watch it in English."], anchor: { x: 2, y: 9 }, needs: { energy: 5, hunger: -4, happiness: 12 } },
  "shop-treehouse-loft": { pose: "create", lines: ["This is the best lookout in the house!", "Every treehouse needs a secret plan."], xOffset: 3, needs: { energy: -5, hunger: -4, happiness: 14 } },
  "shop-aurora-window": { pose: "think", lines: ["The aurora is dancing across the sky.", "I can see green, blue, and violet light."], xOffset: 7, needs: { energy: 4, hunger: -2, happiness: 12 } },
  "shop-command-station": { pose: "play", lines: ["Command station online!", "Let’s solve this mission together."], xOffset: 3, needs: { energy: -8, hunger: -5, happiness: 14 } },
  "shop-pet-retreat": { pose: "cheer", lines: ["A cozy home for a future pet.", "The food bowl goes right here."], xOffset: 5, needs: { energy: -2, hunger: -2, happiness: 10 } },
  "shop-adventure-gallery": { pose: "think", lines: ["Every treasure has a story.", "Look how far we have travelled!"], xOffset: 6, needs: { energy: 2, hunger: -2, happiness: 12 } },
};

const ROOMS = [
  { id: "lounge", name: "Living Room", en: "living room", icon: "⌂", image: "/assets/images/clubhouse/maple-clubhouse-room-v2.webp", maple: { x: 14, y: 91 }, line: "Welcome to our cozy living room! Where should we put the next treasure?" },
  { id: "study", name: "Study Studio", en: "study studio", icon: "✎", image: "/assets/images/clubhouse/maple-house-study.webp", maple: { x: 15, y: 91 }, line: "This is our study. A great idea deserves a great space!" },
  { id: "rooftop", name: "Rooftop Garden", en: "rooftop garden", icon: "✦", image: "/assets/images/clubhouse/maple-house-rooftop.webp", maple: { x: 18, y: 91 }, line: "Look at the view from our rooftop garden!" },
  { id: "loft", name: "Dream Loft", en: "dream loft", icon: "☾", image: "/assets/images/clubhouse/maple-house-dream-loft.webp", maple: { x: 16, y: 91 }, line: "Welcome to the dream loft. Let's make it cozy!" },
  { id: "maker", name: "Maker Den", en: "maker den", icon: "✹", image: "/assets/images/clubhouse/maple-house-maker-den.webp", maple: { x: 17, y: 91 }, line: "This is our maker den. What will we create today?" },
] as const;
// WebP nén từ PNG gốc (7,3MB → 1,04MB, −86%) — nhẹ tải + nhẹ decode khi cuộn shop.
const SHEETS = ["/assets/images/clubhouse/clubhouse-shop-sprites.webp", "/assets/images/clubhouse/clubhouse-shop-sprites-02.webp", "/assets/images/clubhouse/clubhouse-shop-sprites-03.webp", "/assets/images/clubhouse/clubhouse-learn-rewards.webp", "/assets/images/clubhouse/clubhouse-shop-sprites-04.webp"];
const BDG = "/assets/images/badges/";

function ShopArt({ item, className = "" }: { item: ShopItem; className?: string }) {
  const col = item.sprite % 4;
  const row = Math.floor(item.sprite / 4);
  return <span className={`shop-art ${className}`} style={{ backgroundImage: `url(${SHEETS[(item.sheet || 1) - 1]})`, backgroundPosition: `${col * 100 / 3}% ${row * 100}%` }} />;
}

const DREAM_LOFT_CANOPY = {
  x: 33.3,
  y: 52.2,
  back: "/assets/images/clubhouse/shop-canopy-bed-back.webp",
  maple: "/assets/images/clubhouse/maple-pose-sleep-in-bed.webp",
  front: "/assets/images/clubhouse/shop-canopy-bed-front.webp",
} as const;

const OCCUPIED_FURNITURE_ART: Record<string, string> = {
  "shop-beanbag": "/assets/images/clubhouse/shop-beanbag-occupied.webp",
  "shop-astro-chair": "/assets/images/clubhouse/shop-astro-chair-occupied.webp",
  "shop-cloud-cushion": "/assets/images/clubhouse/shop-cloud-cushion-occupied.webp",
  "shop-reading-pod": "/assets/images/clubhouse/shop-reading-pod-occupied.webp",
};

function DreamLoftCanopy({ occupied }: { occupied: boolean }) {
  return <span className="dream-loft-canopy-art" aria-hidden="true">
    <img className="canopy-layer canopy-back" src={DREAM_LOFT_CANOPY.back} alt="" />
    {occupied && <img className="canopy-layer canopy-sleeping-maple" src={DREAM_LOFT_CANOPY.maple} alt="" />}
    <img className="canopy-layer canopy-front" src={DREAM_LOFT_CANOPY.front} alt="" />
  </span>;
}

type FurnitureZone = "wall" | "surface" | "rug" | "large" | "seat" | "floor";
type RoomSlot = { x: number; y: number; scale?: number; z?: number };

const LARGE_FURNITURE = new Set(["shop-canopy-bed", "shop-maple-bookshelf", "shop-gaming-corner", "shop-grand-aquarium", "shop-reading-pod", "shop-mini-cinema", "shop-treehouse-loft", "shop-command-station", "shop-pet-retreat", "shop-adventure-gallery", "shop-music-keyboard"]);
const SEAT_FURNITURE = new Set(["shop-beanbag", "shop-astro-chair", "shop-cloud-cushion", "learn-story-tent", "learn-book-chair"]);

function furnitureZone(item: ShopItem): FurnitureZone {
  if (item.flat) return "rug";
  if (item.slot === "wall") return "wall";
  if (item.slot === "desk") return "surface";
  if (LARGE_FURNITURE.has(item.id)) return "large";
  if (SEAT_FURNITURE.has(item.id)) return "seat";
  return "floor";
}

const ROOM_SLOTS: Record<string, Record<FurnitureZone, RoomSlot[]>> = {
  lounge: {
    wall: [{ x: 18, y: 35 }, { x: 83, y: 34 }, { x: 50, y: 27 }],
    surface: [{ x: 18, y: 58, scale: .78 }, { x: 80, y: 56, scale: .78 }, { x: 32, y: 56, scale: .72 }],
    rug: [{ x: 50, y: 82, scale: 1.25 }, { x: 72, y: 84, scale: .9 }],
    large: [{ x: 72, y: 66, scale: 1.02 }, { x: 28, y: 67, scale: .96 }, { x: 51, y: 70, scale: .94 }],
    seat: [{ x: 73, y: 78 }, { x: 30, y: 79 }, { x: 52, y: 82, scale: .92 }],
    floor: [{ x: 62, y: 72, scale: .85 }, { x: 39, y: 73, scale: .84 }, { x: 84, y: 72, scale: .78 }, { x: 18, y: 74, scale: .78 }],
  },
  study: {
    wall: [{ x: 51, y: 31, scale: 1.05 }, { x: 81, y: 34, scale: .72 }, { x: 25, y: 33, scale: .72 }],
    surface: [{ x: 83, y: 57, scale: .75 }, { x: 25, y: 57, scale: .72 }, { x: 69, y: 56, scale: .68 }],
    rug: [{ x: 50, y: 82, scale: 1.2 }, { x: 72, y: 84, scale: .86 }],
    large: [{ x: 74, y: 68 }, { x: 30, y: 69, scale: .96 }, { x: 52, y: 70, scale: .92 }],
    seat: [{ x: 72, y: 79 }, { x: 31, y: 80 }, { x: 51, y: 82, scale: .9 }],
    floor: [{ x: 62, y: 72, scale: .84 }, { x: 40, y: 73, scale: .84 }, { x: 84, y: 73, scale: .76 }, { x: 18, y: 74, scale: .76 }],
  },
  rooftop: {
    wall: [{ x: 18, y: 36, scale: .78 }, { x: 83, y: 37, scale: .72 }, { x: 50, y: 28, scale: .7 }],
    surface: [{ x: 20, y: 58, scale: .74 }, { x: 82, y: 58, scale: .74 }, { x: 50, y: 60, scale: .7 }],
    rug: [{ x: 50, y: 82, scale: 1.18 }, { x: 73, y: 84, scale: .84 }],
    large: [{ x: 72, y: 67, scale: .96 }, { x: 28, y: 68, scale: .94 }, { x: 51, y: 71, scale: .9 }],
    seat: [{ x: 72, y: 79 }, { x: 29, y: 80 }, { x: 51, y: 83, scale: .9 }],
    floor: [{ x: 62, y: 72, scale: .82 }, { x: 40, y: 73, scale: .82 }, { x: 84, y: 73, scale: .74 }, { x: 17, y: 74, scale: .74 }],
  },
  loft: {
    wall: [{ x: 52, y: 29, scale: .78 }, { x: 83, y: 37, scale: .7 }, { x: 18, y: 38, scale: .68 }],
    surface: [{ x: 82, y: 57, scale: .72 }, { x: 18, y: 57, scale: .7 }, { x: 55, y: 58, scale: .68 }],
    rug: [{ x: 59, y: 83, scale: 1.12 }, { x: 80, y: 85, scale: .82 }],
    large: [{ x: 33.3, y: 52.2 }, { x: 76, y: 66, scale: .94 }, { x: 55, y: 70, scale: .88 }],
    seat: [{ x: 75, y: 79 }, { x: 54, y: 81, scale: .92 }, { x: 87, y: 81, scale: .82 }],
    floor: [{ x: 63, y: 72, scale: .8 }, { x: 84, y: 71, scale: .75 }, { x: 50, y: 75, scale: .78 }],
  },
  maker: {
    wall: [{ x: 20, y: 35, scale: .8 }, { x: 81, y: 35, scale: .8 }, { x: 50, y: 29, scale: .72 }],
    surface: [{ x: 20, y: 58, scale: .76 }, { x: 81, y: 58, scale: .76 }, { x: 50, y: 59, scale: .7 }],
    rug: [{ x: 50, y: 83, scale: 1.18 }, { x: 73, y: 85, scale: .86 }],
    large: [{ x: 74, y: 68 }, { x: 28, y: 68, scale: .98 }, { x: 51, y: 71, scale: .92 }],
    seat: [{ x: 73, y: 80 }, { x: 29, y: 80 }, { x: 51, y: 83, scale: .9 }],
    floor: [{ x: 62, y: 72, scale: .84 }, { x: 40, y: 73, scale: .84 }, { x: 84, y: 73, scale: .76 }, { x: 17, y: 74, scale: .76 }],
  },
};

function arrangeFurniture(items: ShopItem[], roomId: string): Map<string, RoomSlot & { zone: FurnitureZone }> {
  const result = new Map<string, RoomSlot & { zone: FurnitureZone }>();
  const counts: Record<FurnitureZone, number> = { wall: 0, surface: 0, rug: 0, large: 0, seat: 0, floor: 0 };
  for (const item of items) {
    const zone = furnitureZone(item);
    if (roomId === "loft" && item.id === "shop-canopy-bed") {
      result.set(item.id, { ...DREAM_LOFT_CANOPY, scale: 1, zone: "large" });
      continue;
    }
    const roomChoices = ROOM_SLOTS[roomId]?.[zone] || ROOM_SLOTS.lounge[zone];
    const choices = roomId === "loft" && zone === "large" ? roomChoices.slice(1) : roomChoices;
    const index = counts[zone]++;
    const base = choices[index % choices.length];
    const cycle = Math.floor(index / choices.length);
    result.set(item.id, { ...base, x: base.x + cycle * 2, y: base.y + cycle * 2, scale: (base.scale ?? 1) * Math.max(.72, 1 - cycle * .1), zone });
  }
  return result;
}

export function Clubhouse({ state, setState, onClose }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onClose: () => void }) {
  const [panel, setPanel] = useState<"none" | "shop" | "wardrobe" | "pet" | "journal">("none");
  const [editing, setEditing] = useState(false);
  const [delivery, setDelivery] = useState<ShopItem | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [maplePos, setMaplePos] = useState({ x: 14, y: 91 });
  const [mapleWalking, setMapleWalking] = useState(false);
  const [shopMessage, setShopMessage] = useState("");
  const [pendingPurchase, setPendingPurchase] = useState<ShopItem | null>(null);
  const [pendingOutfit, setPendingOutfit] = useState<MapleOutfit | null>(null);
  const [maplePose, setMaplePose] = useState<MaplePose>("cheer");
  const [mapleLine, setMapleLine] = useState("Tap a favourite thing and I’ll try it!");
  const [petPose, setPetPose] = useState<PetPose>("idle");
  const [careNotice, setCareNotice] = useState("");
  const [rewardDismissed, setRewardDismissed] = useState(false);
  const [sittingOn, setSittingOn] = useState<string | null>(null);   // món Maple đang ngồi/nằm lọt vào
  useEffect(() => stopSpeaking, []);   // đóng Clubhouse → ngắt lời đang đọc tên đồ vật
  const roomRef = useRef<HTMLElement>(null);
  const interactionTimer = useRef<number | null>(null);
  // Maple và thú cưng có nhịp "trở về tư thế đứng yên" RIÊNG — dùng chung một ref thì
  // vuốt pet sẽ huỷ luôn hẹn giờ của Maple, để Maple kẹt pose + câu thoại cũ vĩnh viễn.
  const mapleIdleTimer = useRef<number | null>(null);
  const petIdleTimer = useRef<number | null>(null);
  const walkTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const interactionCooldown = useRef<Record<string, number>>({});
  const purchased = new Set(state.clubhouse.purchasedItemIds);
  const equipped = new Set(state.clubhouse.equippedItemIds);
  const room = ROOMS.find((r) => r.id === state.clubhouse.activeRoomId) || ROOMS[0];
  const displayed = ALL_CLUBHOUSE_FURNITURE.filter((item) => equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === room.id);
  const furnitureLayout = arrangeFurniture(displayed, room.id);
  const souvenirs = earnedSeasonSouvenirs(state);
  const souvenirIds = new Set(souvenirs.map((item) => item.id));
  const gotStickers = new Set(state.stickers || []);
  const badges = earnedBadges(state);
  const selectedItem = displayed.find((item) => item.id === selectedId);
  const activeOutfit = MAPLE_OUTFITS.find((outfit) => outfit.id === state.clubhouse.activeOutfitId) || MAPLE_OUTFITS[0];
  const ownedOutfits = new Set(state.clubhouse.ownedOutfitIds);
  const rewardChoices = rewardDismissed ? [] : clubhouseChoices(state);
  const pet = state.clubhouse.pet;
  const hasPetRetreat = purchased.has("shop-pet-retreat");
  const mapleInsideComposite = Boolean(sittingOn && (OCCUPIED_FURNITURE_ART[sittingOn] || (room.id === "loft" && sittingOn === "shop-canopy-bed")));

  useEffect(() => {
    setMaplePos(room.maple); setMapleWalking(false); setMaplePose("cheer"); setPetPose("walk");
    setMapleLine(room.line);
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    if (mapleIdleTimer.current) window.clearTimeout(mapleIdleTimer.current);
    if (petIdleTimer.current) window.clearTimeout(petIdleTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
    walkTimer.current = window.setTimeout(() => { setMapleWalking(false); setPetPose("idle"); }, 760);
  }, [room.id, room.maple, room.line]);

  useEffect(() => () => {
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    if (mapleIdleTimer.current) window.clearTimeout(mapleIdleTimer.current);
    if (petIdleTimer.current) window.clearTimeout(petIdleTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  useEffect(() => {
    const decay = window.setInterval(() => setState((s) => adjustPetNeeds(adjustMapleNeeds(s, { hunger: -1, energy: -1 }), { hunger: -1 })), 120000);
    return () => window.clearInterval(decay);
  }, [setState]);

  function moveMaple(x: number, y: number) {
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    if (mapleIdleTimer.current) window.clearTimeout(mapleIdleTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
    setMaplePose("cheer");
    setSittingOn(null);                       // rời khỏi ghế/giường đang ngồi
    setMaplePos(clampFloor(x, y));            // giữ trong vùng sàn, không leo lên tường
    setMapleWalking(true);
    walkTimer.current = window.setTimeout(() => setMapleWalking(false), 760);
  }

  function interactWithFurniture(item: ShopItem, pos: { x: number; y: number }) {
    const now = Date.now();
    if ((interactionCooldown.current[item.id] || 0) > now) { showCareNotice("Maple is still enjoying that. Try another item!", 1800); return; }
    interactionCooldown.current[item.id] = now + 8000;
    const action = INTERACTIONS[item.id] || { pose: "cheer" as MaplePose, lines: [`I have an idea for the ${item.en}.`, `The ${item.en} makes this room feel like ours.`], needs: { energy: -2, hunger: -2, happiness: 5 } };
    const line = action.lines[Math.floor(Math.random() * action.lines.length)];
    // Món có anchor → đi đúng điểm ngồi/nằm của món đó. Món chưa khai báo anchor thì
    // vẫn dùng lối cũ (đứng lệch sang bên) để không món nào bị hỏng.
    const target = action.anchor
      ? { x: pos.x + action.anchor.x, y: pos.y + action.anchor.y }
      : { x: pos.x + (action.xOffset ?? (pos.x > 55 ? -9 : 9)), y: pos.y + (action.yOffset ?? 6) };
    moveMaple(target.x, target.y);
    setMapleLine("On my way…");
    interactionTimer.current = window.setTimeout(() => {
      setMapleWalking(false); setMaplePose(action.pose); setMapleLine(line);
      // Ngồi HẲN vào món đồ: món sẽ được vẽ đè lên Maple ở dưới (xem zIndex khi render).
      if (action.sitIn) setSittingOn(item.id);
      setState((s) => adjustMapleNeeds(s, action.needs || ({ energy: -3, hunger: -2, happiness: 6 })));
      speak(line, state.prefs.accent, .84);
      // Hết lượt: đứng dậy BƯỚC RA khỏi món đồ rồi mới bỏ lớp che — nếu chỉ đổi tư thế
      // mà vẫn để món vẽ đè thì Maple đứng bị chôn sau giường/ghế.
      mapleIdleTimer.current = window.setTimeout(() => {
        setMaplePose("cheer"); setMapleLine("What should I try next?");
        setSittingOn(null);
        setMaplePos((p) => clampFloor(p.x, p.y + 7));
      }, 8500);
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

  function adoptPet(kind: ClubhousePetKind) {
    setState((s) => adoptClubhousePet(s, kind));
    setPetPose("sit"); celebrate(state.prefs.motion !== false); playSuccessSound();
    const line = kind === "dog" ? "Welcome home, Scout!" : "Welcome home, Misty!";
    setMapleLine(line); speak(line, state.prefs.accent, .84);
  }

  function careForPet(action: "feed" | "play") {
    if (!pet.kind) return;
    if (action === "feed") {
      if (pet.needs.hunger >= 100) { showCareNotice(`${pet.name} is already full!`); return; }
      setState((s) => adjustPetNeeds(s, { hunger: 25, happiness: 3 })); setPetPose("eat");
      showCareNotice(`${pet.name}: +25 Hunger`);
    } else {
      if (pet.needs.happiness >= 100) { showCareNotice(`${pet.name} is already super happy!`); return; }
      setState((s) => adjustPetNeeds(s, { happiness: 20, hunger: -3 })); setPetPose("play");
      showCareNotice(`${pet.name}: +20 Happiness`);
    }
    if (petIdleTimer.current) window.clearTimeout(petIdleTimer.current);
    petIdleTimer.current = window.setTimeout(() => setPetPose("idle"), 4500);
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
        <button className={`clubhouse-maple pose-${maplePose} ${mapleWalking ? "walking" : ""} ${mapleInsideComposite ? "inside-layered-furniture" : ""}`}
          style={{ left: `${maplePos.x}%`, top: `${maplePos.y}%`, ["--depth" as string]: depthScale(maplePos.y) }}
          onClick={(e) => { e.stopPropagation(); speak(editing ? "Choose an item and I will find its best spot!" : mapleLine, state.prefs.accent, .86); }}>
          <MapleArt pose={maplePose} outfit={activeOutfit} alt={`Maple is ${maplePose}`} />
          <span className="maple-speech">{editing ? "Choose an item and I’ll find its best spot!" : mapleLine}</span>
        </button>
        {pet.kind && <button className={`clubhouse-pet pet-${petPose}`} style={{ left: "43%", top: "91%" }} aria-label={`${pet.name}, your ${pet.kind}`}
          onClick={(e) => { e.stopPropagation(); setPetPose("play"); setState((s) => adjustPetNeeds(s, { happiness: 5, hunger: -1 })); showCareNotice(`${pet.name} loves the attention!`); if (petIdleTimer.current) window.clearTimeout(petIdleTimer.current); petIdleTimer.current = window.setTimeout(() => setPetPose("idle"), 3500); }}>
          <PetArt kind={pet.kind} pose={petPose} alt={`${pet.name} is ${petPose}`} /><span>{pet.name}</span>
        </button>}
        {displayed.map((item, index) => {
          const isDreamLoftCanopy = room.id === "loft" && item.id === "shop-canopy-bed";
          const placement = furnitureLayout.get(item.id) || { x: item.x, y: item.y, scale: 1, zone: furnitureZone(item) };
          const pos = isDreamLoftCanopy ? DREAM_LOFT_CANOPY : placement;
          // Đồ đứng trên sàn theo phối cảnh phòng: món ở xa (y nhỏ) nhỏ lại, món gần to ra.
          // Đồ treo tường không áp vì nó không nằm trên mặt sàn.
          const depth = item.slot === "wall" ? 1 : depthScale(pos.y + 6);
          // Maple đang ngồi/nằm lọt vào món này → vẽ món ĐÈ lên cô (z cao hơn z của Maple là 12).
          const sittingHere = sittingOn === item.id;
          const occupiedArt = OCCUPIED_FURNITURE_ART[item.id];
          return <button key={item.id} className={`room-shop-item slot-${item.slot} zone-${placement.zone} item-${item.id} fixed-room-slot ${isDreamLoftCanopy ? "dream-loft-canopy" : ""} ${selectedId === item.id ? "selected" : ""} ${item.flat ? "is-flat" : ""}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: isDreamLoftCanopy ? "translate(-50%,-50%)" : `translate(-50%,-50%) scale(${item.scale * (placement.scale ?? 1) * depth})`, zIndex: selectedId === item.id ? 30 : sittingHere ? 26 : placement.z ?? item.z, animationDelay: `${index * 80}ms` }}
            onPointerDown={() => { if (editing) setSelectedId(item.id); }}
            onClick={(e) => { e.stopPropagation(); if (!editing) interactWithFurniture(item, pos); }} aria-label={`Use ${item.en} — ${item.vi}`}>
            {isDreamLoftCanopy ? <DreamLoftCanopy occupied={sittingHere} /> : sittingHere && occupiedArt ? <img className="occupied-furniture-art" src={occupiedArt} alt="" aria-hidden="true" /> : <ShopArt item={item} />}<i>{editing ? "Auto-arranged" : item.en}</i>
          </button>;
        })}
        {!displayed.length && <div className="clubhouse-empty"><b>This room is waiting for your style.</b><span>Complete activities, earn Coins and choose your first item.</span></div>}

        {editing && selectedItem && <div className="item-transform-controls fixed-slot-controls" aria-label={`Adjust ${selectedItem.en}`}>
          <b>{selectedItem.en}</b><span>Placed in the best spot</span><button className="store-item" onClick={() => { setState((s) => toggleClubhouseItem(s, selectedItem.id)); setSelectedId(null); }}>Store</button>
        </div>}

        <nav className="clubhouse-actions" aria-label="Clubhouse controls">
          <button className={editing ? "on" : ""} onClick={() => { setEditing((v) => !v); setSelectedId(null); setPanel("none"); }}>✦ <span>{editing ? "Done" : "Decorate"}</span></button>
          <button className={panel === "shop" ? "on" : ""} onClick={() => { setPanel(panel === "shop" ? "none" : "shop"); setEditing(false); }}>◆ <span>Shop</span></button>
          <button className={panel === "wardrobe" ? "on" : ""} onClick={() => { setPanel(panel === "wardrobe" ? "none" : "wardrobe"); setEditing(false); }}>♢ <span>Closet</span></button>
          <button className={panel === "pet" ? "on" : ""} onClick={() => { setPanel(panel === "pet" ? "none" : "pet"); setEditing(false); }}>● <span>Pet</span></button>
          <button className={panel === "journal" ? "on" : ""} onClick={() => { setPanel(panel === "journal" ? "none" : "journal"); setEditing(false); }}>▣ <span>Journey</span></button>
        </nav>
        <nav className="clubhouse-rooms" aria-label="Rooms in Maple House">{ROOMS.map((r) => <button key={r.id} className={r.id === room.id ? "on" : ""} onClick={() => { setState((s) => setClubhouseRoom(s, r.id)); setSelectedId(null); setPanel("none"); setEditing(false); }}><i>{r.icon}</i><span>{r.name}</span><small>{ALL_CLUBHOUSE_FURNITURE.filter((item) => equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === r.id).length}</small></button>)}</nav>
      </section>

      {editing && <section className="clubhouse-inventory"><div><b>Inventory · {room.name}</b><small>Tap an item and Maple House will find its best spot</small></div>{ALL_CLUBHOUSE_FURNITURE.filter((item) => purchased.has(item.id)).map((item) => { const here = equipped.has(item.id) && (state.clubhouse.itemRoomIds[item.id] || "lounge") === room.id; return <button key={item.id} className={here ? "equipped" : ""} onClick={() => { if (here) setSelectedId(item.id); else setState((s) => placeClubhouseItem(s, item.id, room.id)); }}><ShopArt item={item} /><span className="inventory-status">{here ? "✓" : "+"}</span></button>; })}{!state.clubhouse.purchasedItemIds.length && <p>No furniture yet — open the Shop to choose your first item.</p>}</section>}

      {panel === "shop" && <section className="clubhouse-drawer clubhouse-shop">
        <header><div><span className="rl-kicker">MAPLE MARKET · {CLUBHOUSE_SHOP.length} ITEMS</span><h3>Build your own style</h3><p>Four collections · buy once, keep forever · scroll to explore.</p></div><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        {shopMessage && <div className="shop-message" role="status">◆ {shopMessage}</div>}
        <div className="shop-grid">{CLUBHOUSE_SHOP.map((item) => { const owned = purchased.has(item.id); const canBuy = state.clubhouse.coins >= item.price; return <article key={item.id} role="button" tabIndex={owned ? -1 : 0} aria-disabled={owned} aria-label={`${owned ? "Owned" : "Buy"} ${item.en}, ${item.price} Coins`} className={`${owned ? "owned" : ""} ${!owned && !canBuy ? "needs-coins" : ""}`} onClick={() => buy(item)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buy(item); } }}><span className={`shop-card-badge ${owned ? "is-owned" : ""}`}>{owned ? "OWNED ✓" : <>◆ {item.price}</>}</span><ShopArt item={item} className="large" /><div><small>{item.collection === "prestige" ? "PRESTIGE CLUB" : item.collection === "cosmic" ? "COSMIC CLUB" : item.collection === "studio" ? "STUDIO CLUB" : "TRAIL CLUB"}</small><h4>{item.en}</h4><p>{item.vi}</p></div><button type="button" disabled={owned} tabIndex={-1} onClick={(e) => { e.stopPropagation(); buy(item); }}>{owned ? "In your inventory" : canBuy ? "Buy item" : `Need ${item.price - state.clubhouse.coins} more Coins`}</button></article>; })}</div>
      </section>}

      {panel === "wardrobe" && <section className="clubhouse-drawer clubhouse-wardrobe">
        <header><div><span className="rl-kicker">MAPLE CLOSET · {MAPLE_OUTFITS.length} LOOKS</span><h3>Choose Maple's look</h3><p>Keep every unlocked outfit and wear it in every pose.</p></div><strong className="cash-balance">✦ {state.clubhouse.cash}</strong><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        <div className="wardrobe-grid">{MAPLE_OUTFITS.map((outfit) => { const owned = ownedOutfits.has(outfit.id), wearing = activeOutfit.id === outfit.id; return <article key={outfit.id} className={`${owned ? "owned" : ""} ${wearing ? "wearing" : ""}`}><span className="wardrobe-preview"><MapleArt pose="cheer" outfit={outfit} alt={outfit.en} /></span><small>{outfit.collection}</small><h4>{outfit.en}</h4><p>{outfit.vi}</p><button type="button" disabled={wearing} onClick={() => chooseOutfit(outfit)}>{wearing ? "WEARING ✓" : owned ? "Wear this look" : `Unlock · ✦ ${outfit.price}`}</button></article>; })}</div>
      </section>}

      {panel === "pet" && <section className="clubhouse-drawer clubhouse-pets">
        <header><div><span className="rl-kicker">MAPLE PETS</span><h3>{pet.kind ? `${pet.name}'s corner` : "Meet your new companion"}</h3><p>Pets follow Maple from room to room. Care is gentle and never decreases while you are away.</p></div><button className="drawer-close" onClick={() => setPanel("none")}>×</button></header>
        {!hasPetRetreat ? <div className="pet-locked"><ShopArt item={CLUBHOUSE_SHOP.find((item) => item.id === "shop-pet-retreat")!} className="large" /><h4>Build a Pet Retreat first</h4><p>Find the Pet Retreat in Prestige Club. Once it is yours, you can adopt one companion for free.</p><button onClick={() => setPanel("shop")}>Open Maple Market</button></div>
          : !pet.kind ? <div className="pet-adoption"><button onClick={() => adoptPet("dog")}><PetArt kind="dog" pose="sit" alt="Golden retriever" /><b>Scout</b><span>Playful golden retriever</span><em>Adopt for free</em></button><button onClick={() => adoptPet("cat")}><PetArt kind="cat" pose="sit" alt="Silver tabby cat" /><b>Misty</b><span>Curious silver tabby</span><em>Adopt for free</em></button></div>
          : <div className="pet-profile"><div className="pet-profile-art"><PetArt kind={pet.kind} pose="sit" alt={pet.name} /></div><div className="pet-profile-info"><label>Pet name<input defaultValue={pet.name} maxLength={16} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} onBlur={(e) => setState((s) => renameClubhousePet(s, e.currentTarget.value))} /></label><div className="pet-need"><span>● Hunger</span><i><em style={{ width: `${pet.needs.hunger}%` }} /></i><b>{Math.round(pet.needs.hunger)}</b></div><div className="pet-need happy"><span>♥ Happiness</span><i><em style={{ width: `${pet.needs.happiness}%` }} /></i><b>{Math.round(pet.needs.happiness)}</b></div><div className="pet-care-actions"><button disabled={pet.needs.hunger >= 100} onClick={() => careForPet("feed")}>Feed</button><button disabled={pet.needs.happiness >= 100} onClick={() => careForPet("play")}>Play</button></div><p>Food and toy choices will arrive in the next pet update. Care is free in this MVP.</p></div></div>}
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
