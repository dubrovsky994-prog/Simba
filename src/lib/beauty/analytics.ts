import { track } from '@vercel/analytics'

export function trackBeautyEvent(name: 'beauty_demo_opened' | 'beauty_demo_ready' | 'beauty_demo_mode_changed' | 'beauty_demo_full_opened' | 'beauty_demo_closed', props?: Record<string, string | number | boolean>): void {
  try { track(name, props) } catch { /* best-effort; never includes iframe records or personal data */ }
}
