# SIMBA dirty-tree inventory

Classification captured before snapshot commits. `PRODUCTION_RELEVANT` means source/material can participate in the public site after review; it does not mean released. No secret values are recorded.

## Tracked modifications

| Path | Category | Purpose / dependencies | Safe to commit | Safe for production | Review |
| --- | --- | --- | --- | --- | --- |
| `.claude/launch.json` | I_PROTOTYPE | Local Claude launch configuration | Yes, separately | No | Yes |
| `api/lead.ts` | B_LEAD_INFRA | Plain/calculator/idea kinds; consent, honeypot, Telegram | Yes | No | Security/E2E |
| `src/App.tsx` | A_PUBLIC_LANDING | Public composition, routes, UTM and DEV owner gate | Yes | No | Yes |
| `src/components/CaseGallery.tsx` | A_PUBLIC_LANDING | Case gallery/modal | Yes | No | Visual/mobile |
| `src/components/FAQ.tsx` (deleted) | A_PUBLIC_LANDING | Legacy section removal | Yes with landing group | No | Owner/copy |
| `src/components/Footer.tsx` | A_PUBLIC_LANDING | Public navigation/contacts/legal links | Yes | No | Copy/legal |
| `src/components/Header.tsx` | A_PUBLIC_LANDING | Hash navigation/CTA | Yes | No | CTA contract |
| `src/components/Hero.tsx` | A_PUBLIC_LANDING + E_AVATAR + F_BEAUTY_PUBLIC | Hero, public avatar and Beauty demo entry | Yes with explicit group | No | Product/visual |
| `src/components/HowItWorks.tsx` (deleted) | A_PUBLIC_LANDING | Replaced legacy section | Yes with landing group | No | Owner/copy |
| `src/components/LeadForm.tsx` | B_LEAD_INFRA | Plain lead UI and `/api/lead` caller | Yes | No | E2E/legal |
| `src/components/NicheCases.tsx` | A_PUBLIC_LANDING | Case data, CTA and gallery use | Yes | No | Copy/assets |
| `src/components/Pricing.tsx` | A_PUBLIC_LANDING | Pricing presentation | Yes | No | Commercial |
| `src/components/StatusBar.tsx` (deleted) | A_PUBLIC_LANDING | Legacy removal | Yes with landing group | No | Owner/copy |
| `src/components/WhatWeCreate.tsx` (deleted) | A_PUBLIC_LANDING | Legacy removal | Yes with landing group | No | Owner/copy |
| `src/components/WhyProfitable.tsx` (deleted) | A_PUBLIC_LANDING | Legacy removal | Yes with landing group | No | Owner/copy |
| `src/index.css` | A_PUBLIC_LANDING | Tailwind/CSS tokens and public styles | Yes | No | Visual |
| `src/main.tsx` | A_PUBLIC_LANDING + H_DEV_OWNER | Public entry; DEV-only `/owner` lazy load | Yes | No | Security boundary |

## Untracked paths — complete classification by path family

| Paths | Count | Classification | Group / action |
| --- | ---: | --- | --- |
| `public/.htaccess`, `public/api/lead.php` | 2 | PRODUCTION_RELEVANT | Hosting proxy draft; preserve in a separate review commit, never deploy by assumption. |
| `public/avatar-preview.html`, `public/avatar/lion-core.png`, `public/avatar/paper-morph/*` | 11 | ASSET | Avatar preview/source assets; preserve with avatar group; APPROVED_ARTIFACT_DO_NOT_EDIT. |
| `public/cases/frame58/screen-1.jpg`, `public/cases/laila-maalul/screen-{1,2}.jpg` | 3 | ASSET | Public case assets; preserve with landing/cases group; claims/rights require review. |
| `src/components/BeautyCoreDemo.tsx` | 1 | PRODUCTION_RELEVANT | F_BEAUTY_PUBLIC; promotional mock only, not Beauty Core. |
| `src/components/HowWeHelp.tsx`, `ProcessComparison.tsx`, `SimbaMockupPanel.tsx`, `StepChain.tsx` | 4 | PRODUCTION_RELEVANT | A_PUBLIC_LANDING; preserve with landing group. |
| `src/components/IdeaLeadMagnet.tsx`, `src/components/idea/{IdeaOptionCard,IdeaProgress}.tsx`, `src/lib/idea/{analytics,questions,types}.ts` | 6 | PRODUCTION_RELEVANT | D_IDEA_LEAD; preserve together. |
| `src/components/LossCalculator.tsx`, `src/components/calculator/*`, `src/lib/calculator/*`, `src/lib/audit/{analytics,utm}.ts` | 26 | PRODUCTION_RELEVANT | C_CALCULATOR + B_LEAD_INFRA; preserve in calculator commit. |
| `src/components/avatar/{DigitalLionField,PaperMorphAvatar,SimbaAIAvatar,avatar-motion,lion-smoke}.ts*`, `paper-morph-avatar.css`, `simba-ai-avatar.css` | 7 | PRODUCTION_RELEVANT | E_AVATAR; preserve separately; no visual edits. |
| `src/owner/*`, `tests/owner.test.mjs` | 9 | LOCAL_ONLY | H_DEV_OWNER; preserve in a separate dev-only commit; excluded from public release. |
| `simba-agent-bridge/**` including `.env.example`, package files, source and tests | 79 | NESTED_PROJECT + SECRET_RISK | G_INTERNAL_AI; KEEP_EXTERNAL, do not stage/commit in public repository. |

No non-ignored untracked files were classified as GENERATED or TEMP. Generated/local material is already ignored (`node_modules`, `dist`, `.vercel`, `.env*`). `coverage` and `.vite` are not ignored but currently do not exist; no `.gitignore` change is necessary for this snapshot.

## Nested-project protection

| Directory | Evidence | Decision |
| --- | --- | --- |
| `simba-agent-bridge/` | Separate `package.json`, lockfile, Dockerfile, TypeScript/Vitest config; 74 untracked files | KEEP_EXTERNAL; no public staging. |
| `src/owner/` | Source module only, imported only when `import.meta.env.DEV && /owner` | Commit as DEV-only source, do not expose/deploy. |

## Secret scan result

No secret-risk patterns were found in the staged candidate groups (public landing, lead, calculator, idea, avatar, Beauty, owner, assets, proxy). `SECRET_RISK` candidates occur only under excluded Agent Bridge paths. `.env.example` files contain placeholders; ignored real `.env*` values were not opened or reported.
