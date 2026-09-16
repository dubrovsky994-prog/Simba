# SIMBA public release readiness

| Feature | Status | Evidence / missing gate |
| --- | --- | --- |
| Existing public landing / basic form | CURRENT_PRODUCTION | Served by current Vercel bundle; exact deployed commit still manual confirmation. |
| Current local landing/cases refresh | READY_FOR_REVIEW | Local build passes; visual/content/production deploy not verified. |
| Lead API foundation | READY_FOR_REVIEW | Server consent/honeypot/validation/kinds exist locally; no authorized E2E Telegram or production verification. |
| Loss Calculator | READY_FOR_REVIEW | Source and build exist; API/analytics integration present; no production/mobile visual/E2E delivery evidence. |
| IdeaLeadMagnet | READY_FOR_REVIEW | Four-step, consent, API/analytics and success/error source exist; no production/mobile/E2E evidence. |
| PaperMorph public avatar | PROTOTYPE_ONLY | Local public integration/preview source exists; approved artifact must not be modified; not deployed. |
| Beauty public presentation | PROTOTYPE_ONLY | Local `BeautyCoreDemo` is a public mock, not LAILA/Beauty Core. |
| SIMBA AI public block | READY_FOR_REVIEW | Avatar/hero entry source exists; scope/content/visual acceptance pending. |
| Legal pages | READY_FOR_REVIEW | Routes/source exist; owner/legal approval and analytics-consent behavior unresolved. |
| Analytics | READY_FOR_REVIEW | Vercel wrapper/event calls exist; event audit and consent policy unresolved. |
| Owner MVP | EXTERNAL | DEV-only localStorage tool; no production auth/server. |
| Agent Bridge / internal AI | EXTERNAL | Separate nested project; excluded from public release. |

## Lead foundation precheck

| Link | Local state |
| --- | --- |
| CTA → form | Present in public components; contracts need caller audit. |
| Client validation / consent | Present in plain, calculator and idea forms. |
| `/api/lead` | Present locally; kinds plain, `calculator`, `idea_review`. |
| Honeypot / rate limit | Present; rate limiting is per-process memory only. |
| Telegram | Environment-backed delivery code present; credentials/delivery not verified. |
| Analytics | Vercel wrapper events present; must remain PII-free. |
| Success/error | Present locally in lead, calculator and idea paths. |

