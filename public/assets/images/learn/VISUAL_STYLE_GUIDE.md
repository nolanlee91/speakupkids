# SpeakUp Kids — Learn Visual Style Guide

Status: canonical visual contract for future Learn artwork  
Last updated: 2026-07-25

This file exists so new Learn images remain consistent across long Codex/Claude
threads, context compaction, different image-generation sessions, and future
contributors.

## 1. Canonical reference images

The early Learn artwork is the preferred visual direction. Always attach at
least one reference from the correct Level when generating a new image.

### Global anchor

- `level-1/level-1-unit-01-at-the-park.webp`

This image establishes the overall finish: polished 2.5D storybook animation,
warm natural light, expressive but believable children, rich Canadian scenery,
clear foreground action, and a teal–coral–gold accent palette.

### Level 1 anchors

- `level-1/level-1-unit-01-at-the-park.webp`
- `level-1/level-1-unit-02-in-the-kitchen.webp`
- `level-1/level-1-unit-03-in-the-classroom.webp`

### Level 2 anchors

- `level-2/level-2-unit-01-missing-backpack.webp`
- `level-2/level-2-unit-02-stormy-camping-trip.webp`
- `level-2/level-2-unit-03-school-talent-show.webp`

### Level 3 anchors

- `level-3/collection-01-making-choices/level-3-c01-unit-01-planning-class-trip.webp`
- `level-3/collection-01-making-choices/level-3-c01-unit-02-screen-or-outdoor-time.webp`
- `level-3/collection-01-making-choices/level-3-c01-unit-03-choosing-team-project.webp`

Do not use a later image as the only style reference when it visibly departs
from these anchors.

## 2. Core look

- Premium 2.5D animated storybook illustration.
- Softly rounded forms with believable materials and environmental detail.
- Cinematic composition, but friendly and readable on a small mobile screen.
- Warm daylight or motivated practical lighting; soft shadows, never flat
  clip-art lighting.
- Rich but controlled colour: teal, coral, warm gold, leafy green, navy and
  natural wood tones.
- Gentle depth of field only when it does not blur learning clues.
- Polished family-animation finish without copying a named studio or artist.
- Appealing to ages 9–12: adventurous and intelligent, not preschool-like.

## 3. Children and people

- Children should read as approximately 9–12 years old.
- Use a diverse, inclusive group across the catalogue.
- Keep anatomy stylised but believable: slightly enlarged expressive eyes,
  natural hands, normal limb length, no oversized toddler heads.
- Expressions should communicate the learning situation clearly: curiosity,
  surprise, concentration, disagreement, relief or collaboration.
- Clothing is contemporary, practical and age-appropriate.
- Avoid fashion-editorial posing; characters should be doing something.
- Adults may appear when the real situation requires supervision, safety or
  collaboration. They should not solve the task for the children.

## 4. Maple rule

Learn scenes normally focus on children and real-life situations. Maple does
not need to appear in every Learn image.

When Maple is explicitly required:

- Maple is a young female Canadian beaver mascot.
- Match the canonical `gen/mascot-wave.webp` identity: short cream muzzle, two small front teeth, paws, broad crosshatched beaver tail and compact balanced body.
- She may use a small accessory, but must not have a human torso, human hands,
  human legs, large belly or hoodie-shaped human silhouette.
- Match the established mascot reference assets instead of inventing a new
  character design.

Never turn a human child into Maple or use a human girl with fox ears as Maple.

## 5. Composition shared by all Levels

- Canvas: landscape 4:3.
- Production target: 1448×1086 or an equivalent 4:3 resolution.
- Keep the main action readable in the centre 70% of the frame.
- Protect faces and the main clue from UI cropping near the top and bottom.
- Use foreground, middle ground and background to create depth.
- Include several useful objects, but give the scene one unmistakable focal
  action.
- No decorative frame, card border, collage panels or text overlay.
- Never place questions, answers, labels or vocabulary inside the artwork.
- Any signs, maps or screens should use simple shapes or non-essential marks;
  generated text must not carry a correct answer.

## 6. Level-specific visual language

### Level 1 — Everyday English

Goal: immediately understandable everyday place and action.

- Usually 2–4 children or one child with a relevant adult.
- Familiar locations: park, shop, classroom, transport, clinic or community
  space.
- Objects should support vocabulary and basic sentence patterns.
- Clear visible actions such as carrying, choosing, asking, waiting or helping.
- Brightest and most welcoming of the three Levels.
- Avoid hidden mysteries or overly complex decision diagrams.

### Level 2 — Stories & Situations

Goal: show a story problem with observable clues.

- Usually 3–5 children collaborating.
- One clear problem plus two or more visible clues or consequences.
- Expressions and pointing/gaze should guide the learner through the evidence.
- More cinematic tension than Level 1, while remaining safe and optimistic.
- The image may suggest sequence, cause and effect, or competing explanations.
- Do not reveal the final answer visually.

### Level 3 — Opinions & Conversations

Goal: support comparison, reasoning and group discussion.

- Usually 4–6 learners; an adult may facilitate.
- Show at least two reasonable options, plans or prototypes together.
- Characters should be discussing, testing, comparing or revising ideas.
- Visual evidence should support more than one defensible viewpoint.
- Slightly more mature settings and denser information than Levels 1–2.
- Never make one option visually perfect and the other obviously foolish.

## 7. Avoid list

Avoid:

- photorealistic people;
- flat vector clip art;
- glossy plastic toy rendering;
- preschool proportions or babyish expressions;
- anime styling;
- extreme fisheye perspective;
- sterile white backgrounds;
- muddy grey colour grading;
- over-dark cinematic scenes;
- characters staring at the camera without purpose;
- extra fingers, malformed hands or duplicated people;
- humanised Maple;
- embedded words, captions, UI, speech bubbles or answer text;
- random maple leaves added to every interior scene;
- a different illustration style for each Unit.

## 8. Base prompt for future Learn images

Use this prompt as a starting point and replace the bracketed scene fields.
Attach one canonical image from the same Level as the visual reference.

```text
Use case: scientific-educational
Asset type: SpeakUp Kids Learn lesson artwork, Level [1/2/3]

Create a landscape 4:3 educational story scene for learners age 9–12.
Scene: [place, time and situation].
Characters: [number, age range, diverse appearance and visible actions].
Learning focus: [vocabulary / story clues / options and trade-offs].
Required visual evidence: [objects, actions, clues or alternatives].

Match the attached SpeakUp Kids reference: premium soft 2.5D animated
storybook illustration, rounded but believable anatomy, expressive faces,
warm natural cinematic lighting, rich environmental detail, and a controlled
teal–coral–gold palette. Keep the scene intelligent and adventurous rather
than preschool-like. Use one clear focal action with readable foreground,
middle ground and background.

Keep all important faces and learning clues inside the central safe area.
No text, captions, labels, speech bubbles, watermark, UI, collage panels or
decorative frame. Do not reveal the correct answer. No photorealism, anime,
flat vector art, toddler proportions, malformed hands or humanised animals.
```

## 9. Level prompt additions

Append only the relevant block.

### Level 1 addition

```text
Make the everyday location immediately recognisable. Show clear visible
actions and useful objects for beginner vocabulary and essential sentence
patterns. Keep the mood bright, welcoming and easy to read.
```

### Level 2 addition

```text
Stage one clear story problem with at least two visible clues or consequences.
Use expression, gaze and gesture to guide attention, but do not show the final
solution. The scene should invite sequencing and inference.
```

### Level 3 addition

```text
Show at least two reasonable options, plans or prototypes in the same scene.
The group is actively comparing, discussing or testing them. Give each option
credible visual support; do not make one answer obviously correct.
```

## 10. Generation and review workflow

1. Choose the Level and lesson objective before writing the visual prompt.
2. Attach one canonical reference from that Level. Use two only when the new
   composition genuinely needs both.
3. Generate without text in the image.
4. Review at full size and as a small mobile thumbnail.
5. Reject or regenerate if:
   - the style becomes photorealistic or flat;
   - children look younger than the target audience;
   - hands, faces or key evidence are malformed;
   - Maple is humanised;
   - the correct answer is visually given away;
   - important content will be covered by UI.
6. Save as WebP at 4:3 with a descriptive canonical filename.
7. Add the file to the relevant Level README and structured lesson data.

## 11. Naming

```text
level-1-unit-NN-topic-name.webp
level-2-unit-NN-story-name.webp
level-3-cCC-unit-NN-topic-name.webp
```

Do not overwrite an existing production image during experimentation. Save a
candidate with `-v2` or `-updated`, verify it in the app, then deliberately
update the lesson data.
