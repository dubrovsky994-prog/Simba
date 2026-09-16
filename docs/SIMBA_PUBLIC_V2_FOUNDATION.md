# SIMBA Public Website V2 Foundation — Task 02.1

## Scope

The landing now extends the approved Header/Hero/transition/Product Architecture
foundation through the existing sales flows, cases, AI/Beauty/Partner
presentation, FAQ, final CTA and footer. It reuses the visual DNA of `/space`
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
| Transition | problem → what SIMBA does → result, without technology-first copy |
| Product family | editorial strip rather than four equal dashboard cards |
| Lead zone | editorial entry frame around the existing calculator and Idea flow |
| Case story | dark case field; existing data in Context → What changed → What we did order |
| AI / Beauty / Partner | presentation sections point to existing public actions; no backend is implied |
| FAQ | native disclosure rows with no data dependency |

## Responsive and motion

Desktop Header and two-column Hero remain through 1024px. At 900px and below,
navigation becomes a menu and major paired blocks stack. The finished page was
checked at 1440, 1366, 1280, 1024, 768, 430, 390 and 375px without horizontal
overflow. Marker/AI pulse motion respects `prefers-reduced-motion`.

## Preserved boundaries

No calculator, IdeaLeadMagnet, Beauty backend, lead flow, case gallery/legal
content, analytics hook, cookie flow, or PaperMorph artwork was replaced or
duplicated.
