# SIMBA Public Website V2 — Reuse Map (Task 02, Phase A–C)

| Block / capability | Current source | Decision | Phase A–C treatment |
| --- | --- | --- | --- |
| Public header | `src/components/Header.tsx` | REWORK | Same anchors and mobile menu; visual language and labels migrate to V2. |
| Hero + public AI entry | `src/components/Hero.tsx` | REWORK + REUSE | Existing assistant toggle, Beauty dialog trigger and approved avatar are preserved inside a new commercial composition. |
| PaperMorph avatar | `src/components/avatar/PaperMorphAvatar.tsx` | REUSE | Rendered unchanged; only its public container changes. |
| Calculator | `src/components/LossCalculator.tsx`, `src/components/calculator/*` | CONNECT | Existing `#business-audit` anchor remains the primary CTA target. No second calculator. |
| Idea lead magnet | `src/components/IdeaLeadMagnet.tsx`, `src/components/idea/*` | CONNECT | Existing `#idea` path remains; untouched in this stop point. |
| Beauty public demo | `src/components/BeautyCoreDemo.tsx` | CONNECT | Existing modal opener remains in Hero. No LAILA/Beauty backend is moved. |
| Product family | none | BUILD_NEW | Presentation-only family strip for Systems, Beauty, AI and Partner; no new product logic. |
| Problem → result transition | none | BUILD_NEW | Static commercial transition section; no data/API dependencies. |
| Cases + case modal | `src/components/NicheCases.tsx`, `src/components/CaseGallery.tsx`, `src/components/ImageModal.tsx` | REUSE | Untouched; later phase can rework presentation with approved case data only. |
| Lead modal / form | `src/components/LeadForm.tsx`, `api/lead.ts` | REUSE | Untouched; no new lead form or backend. |
| FAQ / contacts / footer / legal | `src/components/Footer.tsx`, `src/legal/*` | REUSE | Untouched in this stop point. |
| Cookie banner / UTM / analytics | `src/components/CookieBanner.tsx`, `src/lib/audit/*`, `@vercel/analytics/react` | REUSE | Untouched. |

## Guardrail

Phase A–C changes public presentation only. The existing calculator, lead paths,
Beauty demo, avatar renderer, cases, legal documents, CookieBanner, UTM capture
and analytics hooks remain the single implementations.
