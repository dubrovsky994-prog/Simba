# SIMBA Public Website V2 Foundation — Task 02, Phase A–C

## Scope

This is the first public migration stop point: Header, Hero, the commercial
problem-to-result transition, and Product Architecture. It reuses the visual
DNA of `/space` while remaining 80% commercial clarity and 20% editorial
character.

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
| Transition | problem → what SIMBA does → result, without technology-first copy |
| Product family | editorial strip rather than four equal dashboard cards |

## Responsive and motion

Desktop Header and two-column Hero remain through 1024px. At 900px and below,
navigation becomes a menu, Hero becomes one column, and the product family
becomes a structured two-column strip. Marker/AI pulse motion respects
`prefers-reduced-motion`.

## Preserved boundaries

No calculator, IdeaLeadMagnet, Beauty backend, lead flow, case system, legal
content, analytics hook, cookie flow, or PaperMorph artwork was replaced or
duplicated. The next public phase requires a new visual review.
