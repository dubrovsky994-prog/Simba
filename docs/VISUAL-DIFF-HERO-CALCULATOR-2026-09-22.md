# CURRENT → REFERENCE: Hero + Calculator, desktop 1440

## Scope and evidence

Checkout: `C:\Users\Administrator\Simba` only. No deployment or push. The separate Documents checkout was not changed. Existing commits/checkpoints were not rewritten.

The comparison was presented in chat before implementation. Design-critique was used to prioritize geometry/composition over superficial recoloring. Only Hero and Calculator desktop presentation has been changed. No changes to Cases, Solutions, Beauty, Footer, mobile styles, lead API, or calculator state machine.

Reference: user attachment `codex-clipboard-5e2d4b78-ea4b-4a5a-99b4-7c6a2653deb2.png` (962 × 1635). Current: user attachment `codex-clipboard-2e6dd73f-8bb9-4a09-af82-288ec5814d03.png`, supplemented with a live local preview of HEAD `825b116` before edits.

Reference measurements below are image estimates scaled by 1440/962, not original Figma/CSS specifications; allow approximately ±5–10 px. Current measurements came from the live DOM. The in-app browser requested viewport is 1440 × 1000; Windows rounding reports innerWidth 1441 and content width 1425.83 with the scrollbar. This small rendering discrepancy is disclosed rather than treating the screenshot as an exact pixel-difference benchmark.

## Visual diff before implementation

| Area | CURRENT | REFERENCE target at 1440 | Priority / consequence |
|---|---|---|---|
| Hero height | 481 px, after a 59 px header | About 374 px after an approximately 78 px header | Critical: pushes the interactive form below the intended fold |
| Calculator start | y539 | y452 | Critical: same first-screen composition requires moving it up about 87 px |
| Headline | Four lines, tight .82 line-height; cyan phrase wraps | Three lines, cyan phrase unbroken; roughly x117, y173, ending around x670 | Critical: changes both hierarchy and silhouette |
| Hero illustration | Frontal faceted mask in a glass sphere; empty beige polygons | Three-quarter paper lion with realistic face, long mane, mountain collage, cyan eye | Critical: entirely different subject treatment, not fixable through colors alone |
| Hero paper | Repeating high-contrast scallop pattern | Quiet irregular white paper fibers, torn/ink edges | High: current pattern competes with text |
| Annotation type | Purple Georgia italic with cyan dashes | Black handwritten notes with arrows and crowns | High: wrong typographic register and locations |
| Calculator height | Section about 565 px including outer gaps | Main shell about 428 px | Critical: excessive chrome/spacing |
| Calculator columns | One large bordered enclosure; beige inset aside | White navigation + question sheet; separate pale mint aside with approximately 16 px gutter | High: wrong grouping and surface hierarchy |
| Active step | Black circle, timeline rule, no full-row cyan tint | Cyan numbered disc and pale cyan selected row | High: inconsistent visual focus |
| Answer choices | Tall single-column rows inside a second rounded card | Flat two-column outlined choices, left-aligned radio circles | High: excess nesting and low information density |
| Progress / actions | Progress below labels; next action on far right | Compact single progress row; dominant cyan CTA on left | Medium: wrong horizontal rhythm |
| Intro avatar | Baked checkerboard poster covering nearly invisible live renderer | Reference shows a question, not an intro | Keep the functional intro but restore actual renderer visibility |

## Lower sections: recorded, deliberately not implemented

| Section | Observed CURRENT difference | Reference composition |
|---|---|---|
| Value cards | About 151 px high, tiny filled icon chips | About 235 px high, large line icons and handwritten bottoms |
| Solutions | Three columns but flat dark placeholder graphic | Device/screen composition; integrated tabs and detail panel |
| Cases | About 404 px section, thumbnails along the bottom | About 325 px section, vertical thumbnails alongside case detail |
| Beauty | About 371 px, entirely dark widget | About 274 px, light dashboard with a dark left navigation rail |
| Empty lead zone | About 138 px even when conversion component is empty | No empty section |
| Footer | Dark block about 469 px high | Compact light footer about 127 px high |

These are the next review stages, not changes authorized by this pass. No fabricated reference case numbers, clients, or contacts have been copied into the product.

## Implemented presentation changes

- Separate stylesheet loaded after Tailwind so legacy rules/utilities do not silently override the approved desktop geometry. All layout changes are inside `@media (min-width: 1025px)` and target Hero/Calculator only.
- Three-line heading, near-white paper, black Caveat annotations, cyan/purple edge paint, illustrative paper checklist, and a new three-quarter lion/mountain art asset.
- Hero desktop art is static. The same existing scroll handler is used for its click target. The original hero avatar markup remains for the unchanged smaller-screen layout. The live calculator avatar and all of its state transitions remain active.
- Calculator: navigation + question on a white sheet and a separate mint explainer; 428 px base shell; cyan current step, two-column options, compact progress and left-positioned forward action.
- The existing intro poster is hidden on desktop. Its live avatar wrapper is explicitly sized and restored to opacity 1. No avatar renderer assets or runtime files were modified.
- Long questions, custom inputs and error messages expand the shell naturally; no fixed-height clipping. Error-state custom input measured approximately 536 px overall shell height.

## Verification

- Base shell and question 1: approximately x52, y453, width1322, height428 in the actual browser rendering.
- Hero: height394 with unchanged 59 px header, matching the target calculator start instead of changing the header outside scope.
- No horizontal page overflow at the requested desktop viewport.
- Hero click target, calculator start, question selection, empty custom-answer validation, custom numeric input `50`, back navigation preserving `50`, all eight steps and result rendering were exercised in the production preview.
- Test result for those synthetic choices: 1,634 ₽/month; this is a smoke-test output, not a business claim.
- No lead form submitted; no API end-to-end delivery claim.
- `git diff --quiet` confirms unchanged LossCalculator, src/lib/calculator, avatar runtime/components, API and BeautyCoreSection. Visual markup changes in calculator child components contain no handler/state changes.
- `npm run build`: passed. `npm run lint`: passed.

## Remaining review boundaries

Not pixel-identical and not marked architect-approved. The lion is a generated reconstruction of the approved illustration, not its original layered source. The header remains smaller than in the reference because it is outside this pass. The eight real questions, actual hint text, start screen, Back action and avatar presence differ intentionally from the six-step mockup. Existing below-fold section design and mobile remain untouched.

Screenshots: `output/reference-review/after-intro-1440.jpg`, `after-question-1440.jpg`, `custom-error-1440.jpg`, `result-1440.jpg`. Preview: `http://127.0.0.1:4173/` (local production build only).

The browser exports native screenshots as JPEG, 1426 × 990, for this requested 1440 × 1000 viewport. No resizing or screenshot retouching was applied. The optional rectangular export produced a wrongly scaled/padded image and is rejected (`export-clip-rejected.jpg`); use the regular viewport captures above for review. The final browser console check returned no captured warnings/errors.

## Asset provenance

Built-in imagegen was used, not the API/CLI fallback. Final asset: `public/images/public-v2/hero-reference-v1.png`. Generated original retained in the Codex generated-images directory. Local font: `public/fonts/caveat-600.ttf`; its SIL OFL license is included alongside it. Decorative paper noise is a small code-native SVG.

Generation prompt:

> Use case: precise-object-edit. Image 1 is the approved visual reference. Create the image asset for ONLY the top HERO of this website, not a website screenshot. Reproduce the existing hero illustration faithfully: same elegant off-white folded-paper male lion in 3/4 view looking right, cyan eye and slim cyan accents in mane, jagged dark blue alpine mountains and pale peach sunlit clouds behind to the right, black distressed paper edges. Keep the lion's natural realistic facial anatomy and layered large angular paper mane, not a frontal geometric mask. Composition is a very wide 3:1 banner, 1920x640: lightly textured off-white paper on the entire left 44%; lion mane starts around x46%, head centered x65%, muzzle x77%; lion fills full vertical height down to the bottom cut; mountains fill far right, upper edge mountain collage tapering into paper. All typography, logos, navigation, handwritten notes, paper checklist, calculator, panels and every other UI element from the reference MUST BE REMOVED, leaving their areas as continuous paper/mountain art. No text, no UI, no numbers, no border, no frame, no circular bubble, no watermark. This is the illustration behind live HTML, not a flattened UI. Preserve the reference's paper material, composition and colors; subtly irregular very light white paper fibers on blank left half, no repeating pattern. Produce a high detail wide image.

STOP for architect visual review. Do not continue lower sections or mobile without approval.
