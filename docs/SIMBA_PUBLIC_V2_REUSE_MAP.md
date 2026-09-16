# SIMBA Public Website V2 — Reuse Map (Task 02.1)

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
| Cases + case modal | `src/components/NicheCases.tsx`, `src/components/CaseGallery.tsx`, `src/components/ImageModal.tsx` | REWORK + REUSE | The existing picker, gallery and case data remain one implementation; its content hierarchy is now Context → What changed → What we did. |
| Lead modal / form | `src/components/LeadForm.tsx`, `api/lead.ts` | REUSE | Untouched; no new lead form or backend. |
| FAQ | none | BUILD_NEW | Static native disclosure list only; no API, lead capture or invented commercial results. |
| Contacts / footer / legal | `src/components/Footer.tsx`, `src/legal/*` | REWORK + REUSE | Visual shell aligns with V2; contact and legal source content remains unchanged. |
| Cookie banner / UTM / analytics | `src/components/CookieBanner.tsx`, `src/lib/audit/*`, `@vercel/analytics/react` | REUSE | Untouched. |

## Guardrail

Task 02.1 changes public presentation only. The existing calculator, Idea flow,
Beauty demo, avatar renderer, case gallery, lead path, legal documents,
CookieBanner, UTM capture and analytics hooks remain the single implementations.
