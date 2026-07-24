# Adventure assets — Season 03: The Sky Garden Challenge

This directory is the narrative, visual, and integration contract for an
independent six-chapter Adventure season. Claude Code owns implementation.

## Season identity

- `seasonId`: `season-03-sky-garden-challenge`
- Display title: `The Sky Garden Challenge`
- Audience: ages 10–12
- Language target: A2+ to light B1
- Chapter count: 6
- Primary setting: a community-centre rooftop in Vancouver
- Core goal: design, test, revise, and open a rooftop garden that serves
  several community needs
- Main learning modes: comparing proposals, explaining constraints, giving
  suggestions, predicting results, conditionals, cause and effect, and
  presenting a final recommendation

Season 03 is independent. Do not require Season 01 or Season 02 progress,
characters, clues, items, or story knowledge.

## Directory contract

```text
season-03-sky-garden-challenge/
├── README.md
├── map/
│   └── season-03-rooftop-plan.webp
├── chapters/
│   ├── chapter-01-empty-rooftop.webp
│   ├── chapter-02-three-garden-plans.webp
│   ├── chapter-03-weight-problem.webp
│   ├── chapter-04-saving-every-drop.webp
│   ├── chapter-05-stormy-test.webp
│   └── chapter-06-garden-opens.webp
├── characters/
│   ├── maple-map-idle.webp
│   └── maple-map-walk.webp
└── items/
    ├── rooftop-survey.webp
    ├── combined-garden-plan.webp
    ├── lightweight-planter.webp
    ├── rainwater-system.webp
    ├── wind-test-result.webp
    └── sky-garden-builder-badge.webp
```

Files listed above are the naming contract. Do not reference a path before its
asset exists.

## Narrative principles

1. This is a design challenge, not a mystery, treasure hunt, or villain story.
2. Every proposal must have a reasonable benefit and a real drawback.
3. The group succeeds by testing and combining ideas, not by discovering one
   obviously correct answer.
4. Adults approve structural and safety decisions. Children observe, measure,
   model, discuss, and test safe prototypes.
5. The rooftop must visibly transform across the six chapter scenes while
   retaining recognizable fixed landmarks.
6. Questions must be supported by visible details or supplied story text.
7. Difficulty should feel appropriate for ages 10–12, not preschool.

## Visual continuity

Use one consistent rooftop:

- Vancouver skyline and distant mountains;
- glass stairwell entrance near the back-left;
- brick utility wall near the back-right;
- metal safety railing around the roof;
- one existing maple tree in a large fixed planter;
- a sheltered community room visible below or beside the roof;
- teal, coral, golden yellow, garden green, warm wood, and Vancouver grey-blue.

Maple remains a girl beaver with her established bow, eyelashes, explorer
outfit, backpack, and visible beaver tail. She must remain recognizably a
beaver, not become human-shaped. Supporting children are aged 10–12.

Chapter artwork is 4:3 landscape with no questions, answer buttons, title,
chapter number, logo, watermark, or readable text inside the image.

## Chapter briefs

### Chapter 01 — The Empty Rooftop

Maple and her two friends meet community coordinator Ms. Rivera on an almost
empty rooftop. They inspect sunlight, shade, wind, access, water distance, and
the needs of future users. The fixed maple tree and skyline establish the
location.

Suggested steps:

1. Identify the shared goal.
2. Observe sunny, shady, windy, and sheltered areas.
3. Match community users with needs.
4. Separate observations from early suggestions.
5. Select the most important constraints to investigate.

Language focus: `There is / are`, location phrases, `needs`, observation versus
opinion, and `because`.

Reward: `Rooftop Survey`

### Chapter 02 — Three Garden Plans

The group compares three scale models: a food-growing garden, a pollinator
habitat, and a quiet reading garden. Each plan has strengths and limitations.
Students begin a combined proposal rather than selecting a single winner.

Suggested steps:

1. Understand the purpose of each plan.
2. Match reasons with proposals.
3. Compare space, sunlight, maintenance, and users.
4. Identify compatible features.
5. Produce a first combined layout.

Language focus: comparatives, preferences, `could`, `however`, partial
agreement, and compromise.

Reward: `Combined Garden Plan`

### Chapter 03 — The Weight Problem

An adult engineer reviews the model. Wet soil, large stone planters, and a
water tank would exceed safe limits in one roof zone. The children compare
materials and revise the layout using lightweight planters and redistributed
loads.

Suggested steps:

1. Read a simple visual load model.
2. Compare heavy and light materials.
3. Reject unsafe placement options.
4. Predict how wet soil changes weight.
5. Revise the plan under adult guidance.

Language focus: `too heavy`, `lighter than`, `must / must not`, quantities,
cause and effect, and explaining a revision.

Reward: `Lightweight Planter`

### Chapter 04 — Saving Every Drop

The nearest tap cannot efficiently serve the whole garden. The group tests a
rain barrel, drip line, watering cans, and moisture indicators. They combine a
small rainwater system with targeted hand watering.

Suggested steps:

1. Trace where water currently travels.
2. Compare water-use methods.
3. Follow a short testing sequence.
4. Interpret moisture results.
5. Choose a combined watering plan.

Language focus: instructions, sequence connectors, `more / less`, `if`, and
purpose with `so that`.

Reward: `Rainwater System`

### Chapter 05 — A Stormy Test

A controlled wind-and-rain test exposes weak trellises, loose shade fabric,
poor drainage, and one inaccessible wet route. The team improves anchors,
drainage, shelter, and path placement before real bad weather arrives.

Suggested steps:

1. Predict vulnerable features.
2. Observe test results.
3. Connect each failure to a cause.
4. Compare repair proposals.
5. Retest the revised system.

Language focus: prediction, `might`, first conditional, cause and effect,
giving safety advice, and reporting test results.

Reward: `Wind Test Result`

### Chapter 06 — The Garden Opens

The finished garden combines vegetables, pollinator plants, a reading corner,
accessible paths, rainwater collection, lightweight planters, and wind-safe
structures. Maple and the students guide visitors and explain how evidence
changed their original ideas.

Suggested steps:

1. Compare the finished garden with the first plan.
2. Match features with community needs.
3. Order the main revisions.
4. Explain which test changed the design most.
5. Present the final recommendation.
6. Reflect on teamwork and compromise.

Language focus: past-tense retelling, `we changed... because...`, summarising,
evaluating trade-offs, and presenting a recommendation.

Reward: `Sky Garden Builder Badge`

## Progression

Use stable IDs:

```ts
export const season03ChapterIds = [
  "season-03-chapter-01",
  "season-03-chapter-02",
  "season-03-chapter-03",
  "season-03-chapter-04",
  "season-03-chapter-05",
  "season-03-chapter-06",
] as const;
```

Each chapter supports `locked`, `available`, `inProgress`, and `completed`.
Replaying a chapter must not grant its one-time reward again.

## Map and transition rules

This season does not use a geographic world map. Use one illustrated rooftop
plan as a progress board. Render six chapter nodes, route/progress, locks,
labels, and Maple as React overlays. Do not bake them into the map artwork.

Each completed chapter should visually unlock the next design stage. The map
may gain lightweight CSS overlays such as planted zones, water routes, and a
completion glow, but the source image stays a background.

## Content and accessibility rules

- Each chapter should contain 5–7 meaningful steps.
- Store all dialogue, prompts, feedback, and answers in structured data.
- Do not copy Learn or Practice questions.
- Provide meaningful alt text for chapter scenes.
- Use native buttons for nodes and visible keyboard focus.
- Do not rely on colour alone for choices or progress.
- Respect `prefers-reduced-motion`.
- Lazy-load inactive chapter scenes.
- Do not store images as base64.
