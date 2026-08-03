# Maple Clubhouse Economy — asset contract

## Production assets

- `maple-clubhouse-room-v2.webp` — active premium 2.5D game-room background.
- `maple-clubhouse-room.webp` — legacy room kept for rollback.
- `clubhouse-shop-sprites.png` — transparent 4×2 sprite sheet for eight Shop items.
- Runtime item definitions, prices and fixed coordinates live in `lib/clubhouse.ts`.

The room uses one fixed 4:3 perspective. Recheck every coordinate on mobile and desktop before changing its crop.

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
