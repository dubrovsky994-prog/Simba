# SIMBA safe snapshot plan

## Local branch

`audit/safe-snapshot-2026-09` was created locally from `07cc5d2` with the dirty tree intact. No remote operation, push, deploy, reset, clean or stash was performed.

## Logical preservation commits

1. `docs: record pre-snapshot inventory and gates` — audit context only.
2. `feat: preserve public landing and case refresh draft` — tracked public composition/styles/deletions, public landing additions and case assets.
3. `feat: preserve unified lead and loss calculator draft` — lead API/form plus calculator, audit helpers and calculator assets/dependencies.
4. `feat: preserve idea lead magnet draft` — complete four-step flow and its analytics/types.
5. `feat: preserve public avatar and Beauty presentation drafts` — public avatar component/assets and Beauty demo; not a release approval.
6. `feat: preserve local owner MVP` — DEV-only owner source/tests, explicitly excluded from public release.
7. `chore: preserve REG.RU lead proxy draft` — only if its review remains clear; it is hosting-specific and never automatically deployed.

Every source commit must be followed by `npm.cmd run build`, relevant tests where available, and `git status`. A commit is a local preservation record, not approval for deployment.

## Intentionally excluded

- `simba-agent-bridge/**` — separate internal AI project and secret-risk surface.
- `.claude/launch.json` — machine-specific absolute workspace paths.
- Ignored dependency/build/cache/environment files.
- No Vercel configuration, production settings, external LAILA code, internal SIMBA AI runtime or SIMBA Core changes.

## Commit stop conditions

Stop before staging a group if a new secret-risk path appears, build fails, a file has unclear ownership, or an untracked nested project would be included. Leave unknown files untracked; `UNKNOWN > DELETE`.

## Snapshot outcome

The classified public source groups were preserved as eight local commits. The branch is intentionally ahead of `origin/main` and remains unpushed until Vercel deployment behavior is manually confirmed.
