# Maple Clubhouse Economy — asset contract

## Production assets

- `maple-clubhouse-room-v2.webp` — active premium 2.5D game-room background.
- `maple-house-study.webp` — Study Studio room background.
- `maple-house-rooftop.webp` — Rooftop Conservatory room background.
- `maple-house-dream-loft.webp` — Dream Loft bedroom background.
- `maple-house-maker-den.webp` — Maker Den creative-room background.
- `maple-clubhouse-room.webp` — legacy room kept for rollback.
- `clubhouse-shop-sprites.png` — transparent 4×2 sprite sheet for eight Shop items.
- `clubhouse-shop-sprites-02.png` — transparent 4×2 Cosmic Club collection (eight more items).
- `clubhouse-shop-sprites-03.png` — transparent 4×2 Studio Club collection (eight more items).
- `clubhouse-shop-sprites-04.png` — transparent 4×2 Prestige Club collection (eight long-term Coin sinks, 250–600 Coins).
- `maple-outfit-explorer.webp`, `maple-outfit-creative.webp`, `maple-outfit-cosmic.webp` — transparent 3×2 pose sheets used by Maple Closet.
- `clubhouse-pet-dog.webp`, `clubhouse-pet-cat.webp` — transparent 3×2 pet sheets: idle, walk, sit, sleep, eat and play.
- Runtime item definitions, prices and default coordinates live in `lib/clubhouse.ts`.
- The house has `lounge`, `study`, `rooftop`, `loft`, and `maker` rooms. `clubhouse.itemRoomIds` assigns each item to one room.
- Player placement is stored per room as percentage coordinates in `clubhouse.itemPositions`; dragging only writes on pointer release.

The room uses one fixed perspective with a responsive crop. New items need safe default coordinates, but players can reposition owned items in Edit mode.

## Economy rules

- Maple Coins are virtual soft currency with no cash value.
- Learn Unit first completion: 20 Coins.
- First completion of each Practice topic: 10 Coins.
- Completing Learn + Practice in one day: 15 Coins.
- First completion of an Adventure chapter: 20 Coins.
- Every award uses a stable reward key. Replays cannot farm the same reward.
- Shop prices are fixed. No loot boxes, random rolls or paid coin packs in MVP.
- Purchased furniture is owned permanently and can be equipped/stored without paying again.
- Legacy/new local accounts receive a small starter balance so the Shop is understandable immediately.
- Cash is earned from the daily Learn + Practice combo, not from finite lesson/topic/chapter completions.
- Prestige Club adds 3,000 Coins of permanent furniture goals; the full Shop costs 5,185 Coins.
- Buying Pet Retreat unlocks one free permanent adoption (dog or cat). Pet care is free in the MVP; no offline decay or neglect penalty.

## Reward roles

- Maple Coins buy room furniture.
- Practice can also unlock stickers in Journey Book.
- Badges represent major achievements.
- Adventure chapter props stay inside their story.
- Completing a whole Adventure Season unlocks one exclusive souvenir that Coins cannot buy.
- Stars and streak are progress indicators, not inventory.

## Visual direction

- Polished stylized 3D/2.5D indie-game environment for ages 9–12.
- Deep teal, navy, maple orange, warm amber and tactile walnut materials.
- Cinematic depth, lighting and motion; avoid preschool pastels, emoji furniture and dollhouse styling.
- Maple remains fully animal-like.
- New raster overlays must match the room camera and golden-right-side lighting.

## Generation notes

The v2 room was generated as a non-destructive sibling using the legacy room as a composition reference. The Shop sprite sheet was generated on a flat magenta chroma background, then converted locally to alpha. Source generation outputs remain outside the repository.
