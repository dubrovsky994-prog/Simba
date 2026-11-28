# SIMBA Public Website V2 Foundation — Tasks 02.1–02.2

## Scope

The landing now uses a compact sequence: Hero, interactive problem → solution,
four-case selector, one SIMBA ecosystem scene, final CTA, one calculator-or-idea
conversion area, compact FAQ and footer. Product Architecture, Pricing,
ProcessComparison and the
legacy lead form remain available in source but do not render in Public V2. It reuses the visual DNA of `/space`
while remaining 80% commercial clarity and 20% editorial character.

## Public tokens

`src/public-v2.css` scopes the public foundation under `.public-v2`:

- warm paper: `--v2-paper`, `--v2-paper-deep`
- hierarchy: `--v2-ink`, `--v2-muted`, `--v2-line`
- action and signal: `--v2-aqua`, `--v2-aqua-deep`
- AI state: `--v2-purple`

## Patterns

| Pattern | Rule |
| --- | --- |
| Header | light navigation, five semantic anchors, one primary CTA |
| Hero | one clear claim, existing public actions, approved avatar as visual anchor |
| Problem → solution | four selectable states: problem → SIMBA does → result → correct existing CTA |
| Ecosystem scene | four role selectors share one visual scene; it is not a product-card strip |
| Lead zone | one segmented entry frame conditionally mounts calculator or Idea flow, never both |
| Case story | dark case field; existing data in Context → What changed → What we did order |
| AI / Systems / Beauty / Partner | presentation selectors point to existing public actions; no backend is implied |
| FAQ | native disclosure rows with no data dependency |

## Responsive and motion

Desktop Header and two-column Hero remain through 1024px. At 900px and below,
navigation becomes a menu, ecosystem and problem panels stack, and selectors
remain tappable. Marker/AI pulse motion respects `prefers-reduced-motion`.

## Preserved boundaries

No calculator, IdeaLeadMagnet, Beauty backend, lead flow, case gallery/legal
content, analytics hook, cookie flow, or PaperMorph artwork was replaced or
duplicated.
