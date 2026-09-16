# SIMBA pre-snapshot state

Captured: 2026-09-16 (Europe/Moscow), immediately before creation of the local safety branch.

| Field | Value |
| --- | --- |
| Repository | `C:\Users\Administrator\Simba` |
| Initial branch | `main` |
| Snapshot branch | `audit/safe-snapshot-2026-09` (local only) |
| Initial HEAD | `07cc5d24070896b458e35558a81be3291f08f1a8` |
| Upstream | `origin/main` |
| Remote | `https://github.com/dubrovsky994-prog/Simba.git` |
| Staged files before snapshot | 0 |
| Dirty tracked files | 17 |
| Untracked non-ignored files | 148 |
| Ignored files | 15,146 (mainly `node_modules`, `dist`, Agent Bridge dependencies) |
| Production branch / deployed commit | MANUAL CONFIRMATION REQUIRED |

## Baseline

- `npm.cmd run build`: passed (TypeScript + Vite; 103 modules).
- `node --test tests/owner.test.mjs`: passed 8/8; DEV-only owner MVP coverage.
- `npm.cmd run lint`: KNOWN_PREEXISTING_FAILURE — two errors under excluded `simba-agent-bridge` (`prefer-const` and unused `_next`).
- No staged changes existed before the snapshot branch.

## Protected areas

- `simba-agent-bridge/`: separate nested Node project, not public landing; secret-risk patterns are present by design in provider/auth source and `.env.example`. Do not stage it here.
- `src/owner/`: DEV-only localStorage owner MVP, no public production route.
- `public/avatar/` and `src/components/avatar/`: public-avatar source/assets; approved artifact provenance must be preserved and no visual rewrite belongs in this task.
- `public/api/lead.php` and `.htaccess`: hosting-specific REG.RU proxy draft; source may be preserved separately but is not approved production routing.
- `.claude/launch.json`: local launcher entries contain absolute paths to LAILA and FRAME58 workspaces; keep it local and unstaged.
- All ignored `.env*`, `.vercel`, `node_modules`, `dist` and caches remain unmodified and unstaged.

## Production gate

The live domain is known to be served by B's Vercel project, but local Vercel metadata does not reveal the production branch, deployment commit or automatic deploy rule. No push is authorized or performed.
