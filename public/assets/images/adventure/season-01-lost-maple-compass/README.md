# Adventure assets — Season 01: The Lost Maple Compass

This directory is the visual contract for the standalone Adventure module. Adventure must not import Learn lessons or Game question banks. Claude Code owns the React/Next.js implementation; the files here are visual assets and integration rules.

## Directory contract

```text
season-01-lost-maple-compass/
├─ map/
│  └─ season-01-world-map.webp
├─ chapters/
│  ├─ chapter-01-harbour-message.webp
│  ├─ chapter-02-wrong-ferry.webp
│  └─ chapter-03-forest-footprints.webp
├─ characters/
│  ├─ maple-map-idle.webp
│  └─ maple-map-walk.webp
└─ items/
   └─ README.md
```

## Architecture rules

1. Adventure is a standalone product module. Do not derive its chapter progression from Learn units or Game sessions.
2. The world map is only a background. Do not bake chapter numbers, paths, locks, stars, labels, progress, buttons, or Maple into the map image.
3. Render route lines, chapter nodes, lock/completion states, labels, reward indicators, and Maple as React overlays.
4. Chapter scenes contain no written questions or UI. Dialogue, choices, vocabulary, feedback, and scoring must remain HTML so they can be changed, translated, and made accessible.
5. Do not crop the map with `object-fit: cover`; the node coordinates depend on the complete 16:9 artwork. Preserve its aspect ratio. On small screens, scale the whole map or use a controlled horizontal viewport.
6. Store node positions as percentages, not pixels. Initial suggested anchors:

```ts
export const season01Nodes = [
  { chapter: 1, x: 15, y: 70, key: "harbour-message" },
  { chapter: 2, x: 49, y: 79, key: "wrong-ferry" },
  { chapter: 3, x: 27, y: 43, key: "forest-footprints" },
  { chapter: 4, x: 59, y: 58, key: "cabin-clue" },
  { chapter: 5, x: 56, y: 29, key: "museum-mystery" },
  { chapter: 6, x: 71, y: 30, key: "stormy-waterfront" },
  { chapter: 7, x: 84, y: 59, key: "lighthouse-code" },
  { chapter: 8, x: 84, y: 25, key: "hidden-garden" },
] as const;
```

Fine-tune these anchors visually after implementation; keep the data model independent from the image.

## Progression and animation

- Chapter state should support at least: `locked`, `available`, `inProgress`, and `completed`.
- Maple rests on the current available node using `maple-map-idle.webp`.
- After chapter completion: show the earned clue/reward, reveal or animate the route segment, switch to `maple-map-walk.webp`, move Maple to the next node, then unlock it and use a short CSS bounce/glow on `maple-map-idle.webp`.
- Respect `prefers-reduced-motion`: skip travel animation and move Maple immediately.
- Persist progress by stable `seasonId` and `chapterId`, not by array index.
- A chapter should be replayable without granting its one-time progression reward again.

## Visual consistency

- Intended audience: ages 10–12, not preschool. Keep the interface playful and cinematic, but avoid babyish typography, oversized toy buttons, or constant confetti.
- Maple is a girl: pink bow, eyelashes, teal explorer vest, coral shirt, navy shorts, yellow neckerchief, small teal backpack, and visible beaver tail.
- Use the two new transparent Maple assets in this directory for the Adventure map. Older `gen/maple-pose-cheer.webp` and `gen/maple-pose-think.webp` contain background artifacts and are legacy assets; do not use them for new Adventure screens.
- Chapter art is 4:3. Use it as the visual scene; place story UI beside or below it rather than covering important faces and clues.

## Current content coverage

- Chapter 01: The Message at the Harbour
- Chapter 02: The Wrong Ferry
- Chapter 03: Footprints in the Forest
- Chapters 04–08: map locations reserved; scene art and content should be added only when their story design is ready.

## Accessibility and performance

- Provide meaningful scene `alt` text. Decorative map/character layers should use empty alt text.
- Use native buttons for chapter nodes and visible keyboard focus.
- Lazy-load chapter scenes that are not currently open.
- Do not duplicate these images as base64 in source code.
