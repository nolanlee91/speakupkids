# Maple Clubhouse 2.5D — MVP asset contract

## Production asset

- `maple-clubhouse-room.webp` — background room, 1440×1080, WebP.
- Runtime item overlays are defined in `lib/clubhouse.ts`.
- The room uses one fixed 4:3 perspective. Do not crop or replace it without
  rechecking every item coordinate on mobile and desktop.

## MVP rules

- One room, six Learn decoration milestones plus eight Adventure season
  souvenirs, all using fixed slots.
- The background contains permanent structural furniture only.
- Unlockable items are separate overlay layers; no drag/drop in MVP.
- Clicking an unlocked item reads its English name.
- Learn milestones unlock a choice of room decoration.
- Practice completion unlocks stickers in My Journal.
- Adventure chapter items remain inside their story; completing a whole season
  unlocks one Clubhouse souvenir.
- Badges are derived from major account milestones.
- Stars and streak are indicators, not collectible inventory.
- A rejected decoration choice returns to the Learn reward pool; it is never
  lost forever.

## Visual direction

- Premium soft 2.5D animated storybook illustration.
- Ages 9–12: intelligent, adventurous, not a dollhouse or preschool room.
- Warm natural wood and cinematic daylight.
- Teal, coral and warm-gold accents.
- Vancouver mountains/city may appear outside, but no embedded text.
- Future raster item layers must match this exact camera perspective and
  lighting. Keep Maple fully animal-like if she is added later.

## Original background prompt

```text
Use case: stylized-concept
Asset type: SpeakUp Kids Maple Clubhouse 2.5D interactive room background,
landscape 4:3

Create a polished empty youth clubhouse interior for learners age 9–12,
designed as the background layer for unlockable decorative items that will be
overlaid later. Show a cozy Canadian rooftop/attic clubhouse in Vancouver with
warm natural wood, a large window showing distant mountains and a soft city
skyline, and subtle autumn maple colours outside. Include permanent structural
furniture only: one simple desk, one low empty display shelf, one wall shelf,
an empty pinboard with no writing, and generous uncluttered floor space.

Premium soft 2.5D animated storybook illustration, rounded but believable
materials, rich environmental detail, warm cinematic daylight, controlled
teal–coral–gold accents, intelligent and adventurous rather than preschool-like.
Use a straight-on wide room view with a stable perspective suitable for
fixed-position HTML overlays.

Background layer only. No children, mascot, animals, loose decorative reward
objects, words, letters, captions, labels, UI, frame or watermark. Avoid
photorealism, anime, flat vector art, glossy plastic toy rendering, toddler
styling, extreme perspective, clutter and dark grading.
```
