# SIMBA Public Website V2 — Reuse Map (Tasks 02.1–02.2)

| Block / capability | Current source | Decision | Phase A–C treatment |
| --- | --- | --- | --- |
| Public header | `src/components/Header.tsx` | REWORK | Same anchors and mobile menu; visual language and labels migrate to V2. |
| Hero + public AI entry | `src/components/Hero.tsx` | REWORK + REUSE | Existing assistant toggle, Beauty dialog trigger and approved avatar are preserved inside a new commercial composition. |
| PaperMorph avatar | `src/components/avatar/PaperMorphAvatar.tsx` | REUSE | Rendered unchanged; only its public container changes. |
| Calculator | `src/components/LossCalculator.tsx`, `src/components/calculator/*` | CONNECT | `PublicConversion` conditionally renders the sole `#business-audit` calculator instance. |
| Idea lead magnet | `src/components/IdeaLeadMagnet.tsx`, `src/components/idea/*` | CONNECT | `PublicConversion` conditionally renders the sole `#idea` instance; the existing flow is unchanged. |
| Beauty public demo | `src/components/BeautyCoreDemo.tsx` | CONNECT | Existing modal opener remains in Hero. No LAILA/Beauty backend is moved. |
| Ecosystem scene | `src/components/PublicAiSection.tsx`, `PaperMorphAvatar.tsx`, `BeautyCoreDemo.tsx` | REWORK + REUSE | One four-state scene (AI, Systems, Beauty, Partner); AI retains PaperMorph and Beauty opens its existing demo. |
| Problem → solution | `src/components/HowWeHelp.tsx` | REWORK | Four selectable business states each expose problem, SIMBA action, result and the appropriate existing CTA. |
| Cases + case modal | `src/components/NicheCases.tsx`, `src/components/CaseGallery.tsx`, `src/components/ImageModal.tsx` | REWORK + REUSE | One selector stage uses only Sweet Mommy, Shashlyk Jan, KirMebel and Aura; gallery, modal and source data stay single implementations. |
| Legacy lead form / API | `src/components/LeadForm.tsx`, `api/lead.ts` | LEGACY / NOT PRIMARY | Retained in source for other scenarios, but not rendered by the Public V2 landing. |
| FAQ | none | BUILD_NEW | Static native disclosure list only; no API, lead capture or invented commercial results. |
| Contacts / footer / legal | `src/components/Footer.tsx`, `src/legal/*` | REWORK + REUSE | Visual shell aligns with V2; contact and legal source content remains unchanged. |
| Cookie banner / UTM / analytics | `src/components/CookieBanner.tsx`, `src/lib/audit/*`, `@vercel/analytics/react` | REUSE | Untouched. |

## Guardrail

Public V2 uses the existing calculator for an operating business and the
existing Idea flow for a new idea. `PublicConversion` switches between them,
so they are never duplicated in the DOM. The legacy Simba review is not
deleted, but is not a primary CTA or landing section. The existing calculator,
Idea flow, Beauty demo, avatar renderer, case gallery, lead path, legal
documents, CookieBanner, UTM capture and analytics hooks remain the single
implementations.
