# SIMBA production recovery 03

Дата проверки: 2026-11-28

## Текущий кандидат

- Recovery source: `recovery/simba-production-20261128` at `fe1fc03`
- Merge candidate: `recovery/merge-to-main-20261128` at `9f0e800`
- Common ancestor with `main`: `07cc5d2`
- Preserved old production source: `backup/pre-recovery-main-3112f44`
- Preserved current site source: `backup/pre-recovery-integration-9e0117f`
- Preview: `https://simba-landing-ezdzmccpb-dubrovsky994-4032s-projects.vercel.app`
- Preview deployment: `dpl_i7V7mz26XpVcHwdsmeyD4oKzXK9k`
- Stable marker: `recovery-2026-11-28`

`main` and the production alias were not changed during this recovery stage.

## Root cause

The 26 November Vercel production deployment was built from `main` at `3112f44`. The current public site was on `integration/sba-into-v2` at `9e0117f`, with 43 site commits absent from `main`. The deployment was successful from Vercel's perspective, so the failure was branch/source selection rather than a failed build or DNS failure.

## Verification evidence

- `npm run build`: passed.
- `npm run lint`: passed.
- `node --test tests/owner.test.mjs`: 8/8 passed.
- GitHub Actions Production gate: passed for the recovery branch.
- Preview Vercel build: READY.
- Headless Chrome desktop capture: 1440x1000, new hero, calculator, Beauty Core, growth path, navigation and footer rendered.
- Headless Chrome mobile capture: 390x844, responsive menu, hero, calculator and consent banner rendered.
- Rendered DOM contains calculator CTA, case navigation, Beauty Core entry, legal routes, UTM-capable application shell and the `recovery-2026-11-28` marker.
- `simbasystems.ru` HTTPS certificate: Let's Encrypt wildcard, valid until 2027-01-31.
- `app.simbasystems.ru`: separate Vercel `simba-ai` project, HTTPS and login redirect available.

A real lead or Telegram delivery was not submitted because it would create an external customer-facing record. The controlled test is defined below.

## Production gate

`.github/workflows/production-gate.yml` runs on pull requests and protected production/recovery branches:

1. `npm ci`
2. `npm run build`
3. `npm run lint`
4. `node --test tests/owner.test.mjs`

GitHub `main` protection is enabled with one approving review, the `Production gate` required check, strict status checks, administrator enforcement, and force-push/deletion disabled.

## Pre-promotion blockers

The Vercel Production environment currently contains the existing Telegram variables and Beauty demo variables. The following billing connector variables are absent:

- `BILLING_TELEGRAM_CONNECT_URL`
- `BILLING_TELEGRAM_SECRET`

Their values must be supplied by the owner and added server-side before enabling billing reminder delivery. No secret value is stored in this repository or printed by the audit.

The `.online` domain is attached to the Vercel project but its DNS still uses `ns1.hosting.reg.ru` and `ns2.hosting.reg.ru`. Vercel reports the domain as improperly configured. Direct requests reach REG.RU nginx: apex HTTP/HTTPS returns `403` with an untrusted self-signed certificate, while `www.simbasystems.online` currently resolves to the Vercel production bundle. DNS and REG.RU services were not changed.

## Controlled integration test

Run only after the owner supplies the missing billing connector configuration and approves test data:

1. Use a dedicated test Telegram chat and a single short-lived billing code.
2. POST a synthetic lead to `/api/lead` with explicit consent, a test contact, and `utm_source=recovery-test`; confirm the expected Telegram message and response body without exposing the bot token.
3. Send `/start bill_<test-code>` from the dedicated private test chat; confirm the connector receives code, chat ID and username, then confirm the bot response.
4. Revoke the test code and verify a second use returns the expired-link response.
5. Remove or invalidate all test data and record message IDs only, never secrets or personal content.

## Promotion and rollback runbook

Promotion requires explicit owner confirmation after the preview and ENV blockers are cleared. Use the reviewed merge candidate or its resulting protected-`main` SHA only:

```bash
vercel deploy --prod
```

Immediately verify:

```bash
curl -fsSL https://simbasystems.ru/ | grep 'simba-site-version'
curl -fsSL -o /dev/null -w '%{http_code}\n' https://simbasystems.ru/api/lead
```

The expected site marker is `recovery-2026-11-28`; `/api/lead` should reject GET with `405`, proving the route is present without creating a lead.

For rollback, promote the last verified Vercel deployment from the dashboard/CLI without rewriting Git history. The pre-incident deployment is `dpl_GjyFZ21EKM34xAjpodFxxRPQELC6` at `3112f44` and is retained only as an audit/rollback reference. A rollback must be followed by a new incident record and a gate review.

## Domain inventory

| Host | Role | Current service | Result |
| --- | --- | --- | --- |
| `simbasystems.ru` | Public primary site | Vercel `simba-landing` | HTTPS 200; currently old production bundle until promotion |
| `simbasystems.online` | Alternate public alias | Vercel alias plus REG.RU DNS | Apex reaches REG.RU 403/untrusted TLS; `www` reaches Vercel; DNS change requires owner decision |
| `app.simbasystems.ru` | SIMBA AI application | Separate Vercel `simba-ai` project | HTTPS available; redirects unauthenticated users to `/login` |

Registration expiry dates for third-party domains are not exposed by the available Vercel metadata. Registrar changes, DNS changes, renewal and paid actions are outside this recovery stage.
