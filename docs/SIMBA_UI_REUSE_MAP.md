# SIMBA UI Reuse Map — Task 01B

## Scope

This map records the source-of-truth decision before the first Personal Space delivery. Public landing redesign is intentionally out of scope for this phase. No existing lead, consent, analytics, delivery, or payment implementation is rewired here.

| Component / feature | Existing path | Status | Decision | Dependencies | Notes |
| --- | --- | --- | --- | --- | --- |
| PaperMorph AI avatar | `src/components/avatar/PaperMorphAvatar.tsx` | approved local artifact | **REUSE** | `/avatar/paper-morph/index.html` | Used unchanged in Personal Space. Its rendering and motion are protected. |
| Owner MVP concepts | `src/owner/model.ts`, `src/owner/modules.ts` | local MVP | **REUSE** | local owner model | Reuse the product vocabulary only: pulse, decisions, projects, AI state. The `/space` presentation uses a separate typed demo source and does not write localStorage. |
| Owner local app | `src/owner/OwnerApp.tsx` | local development route | **CONNECT** | development-only `/owner` | Kept intact. `/space` is a focused visual/product shell, not a replacement for the owner CRUD MVP. |
| Public calculator | `src/components/Calculator.tsx` | existing public feature | **CONNECT** | existing calculator logic | Preserve logic. A future public redesign may adapt its visual shell after visual review. Not rendered in `/space`. |
| Idea lead magnet | `src/components/IdeaLeadMagnet.tsx` | existing public feature | **CONNECT** | current lead UX | Preserve current behaviour and lead path. |
| Beauty public mock | `src/components/BeautyPublicMock.tsx` | existing public feature | **CONNECT** | current public mock | Candidate for later public page composition only; not duplicated. |
| Hero and headline | `src/components/Hero.tsx` | legacy public composition | **REWORK** | public visual review | Future public phase only; no changes in this delivery. |
| Header and navigation | `src/components/Header.tsx` | legacy public composition | **REWORK** | public information architecture decision | No authenticated navigation is introduced now. |
| Case gallery and niche content | `src/components/CaseGallery.tsx`, `src/components/Niches.tsx` | existing public content | **REUSE** | approved content | Keep source content; later composition must not invent cases or metrics. |
| Lead form and lead API | `src/components/LeadForm.tsx`, `api/lead.ts` | existing funnel | **REUSE** | legal and delivery validation | Intentionally untouched. No new lead infrastructure in Task 01B. |
| Cookie banner and analytics | `src/components/CookieBanner.tsx`, `src/analytics.ts` | existing integration | **REUSE** | legal approval, production verification | Intentionally untouched. |
| Buttons, fields, badges, cards | scattered public component styles | mixed legacy styles | **REWORK** | scoped Personal Space tokens | New semantic, scoped foundation is created for `/space`; it does not globally restyle public pages. |
| Footer, contacts, FAQ, CTA | `src/components/Footer.tsx`, `src/components/FAQ.tsx`, `src/components/CTA.tsx` | public content | **REWORK** | future public visual review | No content, promises, contacts, or legal text changes now. |

## Anti-duplication rule

The Personal Space reuses the avatar implementation and product concepts, but does not copy calculator, lead, analytics, or public-page logic. New interface data lives in `src/features/personal-space/demo-data.ts` and is explicitly marked as demo data until an approved data contract exists.
