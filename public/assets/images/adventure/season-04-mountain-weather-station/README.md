# Adventure assets — Season 04: The Mountain Weather Station

This directory is the narrative, visual, and integration contract for an
independent six-chapter Adventure season. Claude Code owns implementation.

## Season identity

- `seasonId`: `season-04-mountain-weather-station`
- Display title: `The Mountain Weather Station`
- Audience: ages 10–12
- Language target: A2+ to light B1
- Chapter count: 6
- Setting: a visitor centre, forest trail, cloud-line lookout, and summit
  weather station in the mountains near Vancouver
- Core goal: investigate unreliable weather data, choose a safe route, restore
  the station with an adult meteorologist, and present an evidence-based forecast
- Main learning modes: comparing observations, interpreting pictorial data,
  cause and effect, conditionals, safety decisions, sequencing, and retelling

Season 04 is independent. Do not require progress or story knowledge from
Seasons 01–03. Adventure must not import Learn lessons or Practice questions.

## Directory contract

```text
season-04-mountain-weather-station/
├── README.md
├── map/
│   └── season-04-mountain-map.webp
├── chapters/
│   ├── chapter-01-broken-forecast.webp
│   ├── chapter-02-trail-of-microclimates.webp
│   ├── chapter-03-sensor-puzzle.webp
│   ├── chapter-04-cloud-line-decision.webp
│   ├── chapter-05-repair-at-summit.webp
│   └── chapter-06-forecast-festival.webp
├── characters/
│   ├── maple-map-idle.webp
│   └── maple-map-walk.webp
└── items/
    ├── weather-station-pass.webp
    ├── microclimate-notebook.webp
    ├── sensor-alignment-kit.webp
    ├── safe-route-marker.webp
    ├── restored-station-signal.webp
    └── mountain-forecaster-badge.webp
```

The two Maple map poses are intentionally reused from Season 03. They are
transparent UI overlays, not season-specific story clues.

## Narrative principles

1. This is a weather investigation and community-science story, not a treasure
   hunt and not a supernatural weather story.
2. The mountain can have several microclimates at the same time. A reading from
   one location does not automatically describe the whole mountain.
3. Children observe, compare, model, communicate, and perform low-risk tests.
   Dr. Lena Park approves routes and handles installed equipment and repairs.
4. Choosing a longer route, waiting, or turning back is a successful safety
   decision when supported by evidence.
5. Every conclusion must be supported by visible scene details or information
   supplied in the chapter.
6. Essential information must not rely on colour alone; pair colours with
   weather, route, or instrument pictograms.
7. Each chapter ends with one evidence reward that remains useful in the final
   forecast.

## Recurring cast and visual continuity

- Maple is the lead investigator: a young girl beaver with brown fur, visible
  beaver muzzle and ears, large flat tail, coral maple-leaf bow, teal explorer
  jacket, navy skirt/shorts, teal backpack, and eyelashes.
- Friend A: an East Asian girl aged about 11 with long dark hair and a purple
  hiking jacket; careful observer and wind/visibility tester.
- Friend B: a boy aged about 11 with medium-brown skin, curly dark hair, and a
  navy hoodie; map reader and model builder.
- Dr. Lena Park: adult park meteorologist responsible for field safety and
  equipment repair.

Maple must remain recognisably a beaver and must never become human-shaped.
Chapter artwork is 4:3. It contains no readable text, question UI, chapter
numbers, logos, or watermarks.

## Chapter briefs

### Chapter 01 — The Broken Forecast

At the visitor centre, the summit receiver is silent while two forecast cards
give conflicting sunny and stormy predictions. Dr. Park explains that the
station stopped reporting before tomorrow's community science festival. The
group inspects the receiver, mountain map, portable kit, and last available
weather symbols, then plans a supervised investigation.

- Language focus: observation versus prediction, `might / cannot`, identifying
  conflicting information, and explaining the investigation goal
- Reward: `Weather Station Pass`
- Next: `season-04-chapter-02`

### Chapter 02 — The Trail of Microclimates

Along the lower trail, the team compares a sunny clearing, shaded cedar grove,
and breezy creek bridge. Temperature zones, wind ribbons, and leaf moisture
show that nearby locations can have different conditions. Learners decide
which observations belong in the field record.

- Language focus: comparatives, location phrases, `whereas`, recording evidence,
  and separating a local observation from a mountain-wide conclusion
- Reward: `Microclimate Notebook`
- Next: `season-04-chapter-03`

### Chapter 03 — The Sensor Puzzle

At the mid-mountain site, several instruments are positioned badly: the rain
gauge is partly sheltered by a branch, the wind vane is blocked by a structure,
and a temperature sensor is too close to a sun-warmed rock. The children test
placements with models while Dr. Park handles installed equipment.

- Language focus: purpose, passive cause (`is blocked by`), fair comparisons,
  `if … then …`, and explaining why a reading may be unreliable
- Reward: `Sensor Alignment Kit`
- Next: `season-04-chapter-04`

### Chapter 04 — The Cloud-Line Decision

Low cloud and stronger wind reach the exposed ridge. The direct route is
shorter but has poor visibility; a forest route is longer but sheltered. The
group compares wind, visibility, time, and route evidence. Dr. Park approves
the sheltered path.

- Language focus: route trade-offs, safety advice, first conditional,
  `although`, and justifying a decision from several constraints
- Reward: `Safe Route Marker`
- Next: `season-04-chapter-05`

### Chapter 05 — Repair at the Summit

In calm conditions at the fenced summit station, Dr. Park reconnects a loose
low-voltage solar lead and inspects the instruments. Maple and the children
compare before-and-after signals, align a removable model vane, and check
whether temperature, rain, and wind indicators agree. Calibration is a test,
not a magical instant repair.

- Language focus: instructions and sequence, before/after comparison,
  `so that`, reporting test results, and revising a hypothesis
- Reward: `Restored Station Signal`
- Next: `season-04-chapter-06`

### Chapter 06 — The Forecast Festival

At sunset, the team returns to the visitor-centre festival. They use the
microclimate notes, sensor-placement evidence, safe-route decision, and restored
signal to explain a forecast: calm morning, increasing cloud, and later rain.
They retell how each chapter changed their conclusion and receive the season
badge.

- Language focus: past-tense retelling, evidence-linked conclusions, forecast
  language, summarising cause and effect, and presenting a recommendation
- Reward: `Mountain Forecaster Badge`
- Next: none

## Progression model

Use stable IDs:

```ts
export const season04ChapterIds = [
  "season-04-chapter-01",
  "season-04-chapter-02",
  "season-04-chapter-03",
  "season-04-chapter-04",
  "season-04-chapter-05",
  "season-04-chapter-06",
] as const;
```

Each chapter supports `locked`, `available`, `inProgress`, and `completed`.
Replaying a completed chapter must not grant its one-time reward again.

## Map rules and suggested anchors

`season-04-mountain-map.webp` is a background only. Do not bake chapter nodes,
labels, route progress, locks, stars, badges, or Maple into it. Render them as
React overlays and preserve the complete 16:9 image without `object-fit: cover`.

Suggested percentage anchors:

```ts
export const season04Nodes = [
  { chapter: 1, x: 14, y: 73, key: "broken-forecast" },
  { chapter: 2, x: 32, y: 58, key: "trail-of-microclimates" },
  { chapter: 3, x: 58, y: 51, key: "sensor-puzzle" },
  { chapter: 4, x: 50, y: 27, key: "cloud-line-decision" },
  { chapter: 5, x: 66, y: 10, key: "repair-at-summit" },
  { chapter: 6, x: 25, y: 82, key: "forecast-festival" },
] as const;
```

Fine-tune anchors visually, store them as percentages, and keep them independent
from image pixels. After completion, animate Maple between nodes; Chapter 06
returns to the festival lawn rather than continuing upward.

## Content implementation rules

- Each chapter contains 5–7 meaningful story steps.
- Mix short dialogue, observation, one reading/data task, inference, one concise
  language task, and an evidence reveal.
- Do not copy Learn or Practice questions.
- Do not invent readable labels absent from the artwork.
- Wrong answers should receive an evidence-based hint.
- Difficulty should target ages 10–12, approximately A2+ to light B1.
- Provide meaningful `alt` text for chapter scenes.
- Decorative map, Maple poses, and reward images use empty alt text when their
  meaning is already supplied in adjacent HTML.
- Lazy-load inactive scenes; do not store images as base64.
- Respect `prefers-reduced-motion` for Maple travel and node animations.

