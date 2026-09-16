# SIMBA Design System Foundation — Task 01B

## Intent

The first application surface uses **70% clean digital product / 30% SIMBA Steal Journal editorial**. It is a scoped foundation for `/space`, not a global restyle of the public site.

## Tokens

Tokens are scoped under `.simba-space` in `src/features/personal-space/personal-space.css`.

| Group | Tokens | Use |
| --- | --- | --- |
| Paper | `--simba-paper`, `--simba-paper-deep`, `--simba-ink`, `--simba-muted` | warm ivory surface and editorial hierarchy |
| Actions | `--simba-turquoise`, `--simba-turquoise-deep`, `--simba-purple` | primary action, signal, AI state |
| Layout | `--simba-space-*`, `--simba-radius-*`, `--simba-line` | 4–32px rhythm, restrained geometry and borders |
| Elevation | `--simba-shadow-*` | soft paper/card elevation; no glass effect |
| Type | `--simba-display`, `--simba-body` | condensed editorial display and readable system body |

## Components and states

| Pattern | Included states |
| --- | --- |
| Button | default, hover, keyboard focus, disabled |
| Card / panel | paper, ink, purple AI, attention / decision |
| Status chip | steady, focus, decision, demo data |
| Progress | semantic rank progress with text alternative |
| AI administrator | current state, recommendation, action and decision needed |

All interactive controls retain visible `:focus-visible` styling. Motion is limited to a soft signal pulse and respects `prefers-reduced-motion`.

## Responsive rules

The space is designed mobile-first. Its content grid collapses at 1024px and 720px; the compact utility row and project/result grids adapt to single-column reading on narrow screens. No horizontal scrolling is used for application content.

## 01B.1 visual refinement

- Desktop uses a compact, UI-only navigation rail; it is hidden from 768px down.
- The hero is one composition: copy, approved avatar, paper/mountain fragments,
  a turquoise marker and a restrained handwritten note.
- Business Pulse uses compact demo business indicators; Growth makes remaining
  maturity criteria visible rather than presenting a game mechanic.
- Today distinguishes one primary focus, while the purple AI block uses four
  operational states: doing, found, recommends, decision required.
- The journey becomes a route metaphor, and Code of Lion is a persistent
  principle with secondary quotes in a native disclosure.

## Data boundary

`src/features/personal-space/demo-data.ts` is the only data source for the screen. Client-result values are visibly labeled **DEMO DATA** and do not claim production reporting. A backend, authentication, and data connection require a separate approved contract.
