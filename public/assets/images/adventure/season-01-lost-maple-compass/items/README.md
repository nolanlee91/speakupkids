# Adventure story items

Keep collectible story objects in this directory as individual transparent WebP files.

Planned naming contract:

```text
compass-base.webp
compass-piece-01.webp
compass-piece-02.webp
compass-piece-03.webp
wet-postcard.webp
ferry-ticket.webp
forest-map.webp
```

Rules:

- Items are Adventure inventory/clue assets, not global achievement badges.
- Each file contains one centered object with transparent padding, no text label, no card background, and no UI.
- The compass base and its pieces must be designed as one matched set. Do not fake separate pieces by cropping unrelated artwork.
- Unlock an item through story state. Do not infer it from Learn or Game scores.
- Until a listed file exists, show a neutral locked silhouette or omit the slot; do not reference a missing asset path.

