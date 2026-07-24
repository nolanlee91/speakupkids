# Level 0 phonics assets

## Keyword illustrations

`keywords/` contains one 384×384 WebP card for every keyword used by
`PHONICS_UNITS`. File names are derived from `sound.keyword` with
`phonicsKeywordImage()` in `lib/phonics.ts`.

The React UI keeps the existing emoji only as an error fallback. New phonics
keywords should receive a matching WebP before release.

## Phoneme audio

Recorded phoneme clips belong in:

`public/assets/audio/phonics/us/`

Required production rules:

- one clean native-speaker voice across the full set;
- General American pronunciation to match the current default accent;
- 44.1 kHz mono WAV master, exported to compact MP3 or M4A for the app;
- 350–900 ms per isolated sound;
- no music, effects, room echo, letter names, or example words;
- avoid adding a trailing schwa to continuant sounds;
- plosives may use the shortest natural release possible;
- normalize loudness consistently across the set;
- verify every clip with a qualified English teacher before enabling it.

Do not synthesize isolated graphemes with the browser TTS. It may pronounce a
letter name rather than the target phoneme. Until verified recordings exist,
the app intentionally continues to speak the keyword as a safe fallback.
