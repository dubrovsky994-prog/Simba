import { track } from '@vercel/analytics'

// Thin wrapper so a blocked/unavailable analytics script never breaks the
// audit flow itself.
export function trackAuditEvent(name: string, props?: Record<string, string | number | boolean>): void {
  try {
    track(name, props)
  } catch {
    // analytics is best-effort only
  }
}
