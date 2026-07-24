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
│  ├─ chapter-03-forest-footprints.webp
│  ├─ chapter-04-cabin-clue.webp
│  ├─ chapter-05-museum-mystery.webp
│  ├─ chapter-06-stormy-waterfront.webp
│  ├─ chapter-07-lighthouse-code.webp
│  └─ chapter-08-hidden-garden.webp
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

## Season 01 story briefs

These briefs are the narrative and visual source of truth for chapter content. Questions should refer only to details that are clearly visible in the matching scene or explicitly established by an earlier chapter.

### Chapter 01 — The Message at the Harbour

Maple starts at the harbour after her grandfather’s compass disappears. A wet postcard points toward the ferry terminal.

### Chapter 02 — The Wrong Ferry

Two ferries leave at similar times. Maple must read the destination clues, choose the ferry to Pine Island, and keep the correct ticket.

### Chapter 03 — Footprints in the Forest

Fresh tracks, a blue ribbon, and a hand-drawn map lead Maple and her friends away from the beach toward a wooden cabin.

### Chapter 04 — The Cabin Clue

Inside the cabin, the friends compare several clues: muddy tracks enter but do not leave, a clock has stopped, a drawer is open, and red maple leaves form a trail. Behind a crooked photograph they discover a brass key and a museum tag. The key leads to the museum.

Recommended language focus: describing evidence, `must / might / cannot`, sequencing observations, and explaining why one clue matters.

### Chapter 05 — The Museum Mystery

The brass key opens an antique maritime case. Maple finds the first triangular piece of the broken compass. A coastal painting and a group of lighthouse models reveal that one lighthouse points in a different direction. This sends the group back toward the waterfront.

Recommended language focus: comparing objects, relative position, identifying differences, and drawing a conclusion from two clues.

### Chapter 06 — The Stormy Waterfront

A storm reaches the waterfront. Maple protects the compass piece, one friend checks the harbour map under a damaged umbrella, and the other secures a red rowboat. Waves, seabirds flying inland, a floating maple-marked crate, a covered route, and a distant lighthouse help the group decide how to move safely.

Recommended language focus: weather, giving safety advice with `should / shouldn’t`, cause and effect, and choosing the safest route.

### Chapter 07 — The Lighthouse Code

Inside the lighthouse, three coloured shutters and a repeated short-short-long beam form a sequence. The friends align the lighthouse mechanism, open a hidden compartment, and find another compass piece plus a pressed maple leaf. The beam reveals the hidden garden on a nearby island.

Recommended language focus: patterns and sequences, instructions, conditionals with `if`, and explaining a multi-step solution.

### Chapter 08 — The Hidden Garden

At sunrise, the friends enter a vine-covered secret garden. Three triangular pieces fit the compass base on a stone table. The pressed leaf matches the stone carving, and the completed Maple Compass points home. Grandpa’s explorer hat and sealed letter confirm that the trail was designed as a final challenge for Maple.

Recommended language focus: retelling the journey, past tense, evidence-based inference, expressing achievement, and summarising a story.

## Content implementation rules for Chapters 04–08

- Add `sceneImage`, `storySteps`, `reward`, and `nextChapterId` to `lib/adventures.ts`; Chapter 08 has no next chapter.
- Each chapter should contain 5–7 steps mixing dialogue, observation, reading/inference, one short language task, and a clue reveal.
- Do not copy Practice questions. Adventure steps must advance this story.
- Observation answers must be supported by visible scene details.
- Do not invent readable signs or labels that are not present in the artwork.
- Difficulty should target ages 10–12, approximately A2–B1, not single-word preschool recognition.
- Keep the compass-piece continuity consistent: the final scene shows three matching triangular pieces completing one circular compass.

## Accessibility and performance

- Provide meaningful scene `alt` text. Decorative map/character layers should use empty alt text.
- Use native buttons for chapter nodes and visible keyboard focus.
- Lazy-load chapter scenes that are not currently open.
- Do not duplicate these images as base64 in source code.
