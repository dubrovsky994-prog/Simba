import { track } from '@vercel/analytics'

// Thin wrapper so a blocked/unavailable analytics script never breaks the
// idea-lead flow itself. Never pass personal data (name, phone, Telegram) here.
export function trackIdeaEvent(name: string, props?: Record<string, string | number | boolean>): void {
  try {
    track(name, props)
  } catch {
    // analytics is best-effort only
  }
}
