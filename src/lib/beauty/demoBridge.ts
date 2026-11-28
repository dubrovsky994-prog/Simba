export type BeautyDemoMode = 'site' | 'admin' | 'master' | 'client'

export type BeautyDemoEntry = { mode: BeautyDemoMode; section?: string }

export const DEFAULT_BEAUTY_ENTRY: BeautyDemoEntry = { mode: 'site', section: 'home' }
export const BEAUTY_DEMO_URL = (import.meta.env.VITE_BEAUTY_DEMO_URL ?? '').replace(/\/$/, '')
export const BEAUTY_DEMO_EMBED_URL = (import.meta.env.VITE_BEAUTY_DEMO_EMBED_URL ?? '').replace(/\/$/, '')
export const BEAUTY_DEMO_ORIGIN = (() => { try { return new URL(BEAUTY_DEMO_URL).origin } catch { return '' } })()

export function buildBeautyDemoUrl(entry: BeautyDemoEntry = DEFAULT_BEAUTY_ENTRY): string {
  if (!BEAUTY_DEMO_EMBED_URL) return ''
  return `${BEAUTY_DEMO_EMBED_URL}/${entry.mode}${entry.section ? `/${entry.section}` : ''}`
}

export function openBeautyDemo(entry: BeautyDemoEntry = DEFAULT_BEAUTY_ENTRY): BeautyDemoEntry { return entry }

export function beautyDemoMessageType(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  if ('type' in data) return String(data.type)
  if ('kind' in data) return String(data.kind)
  if ('event' in data) return String(data.event)
  return ''
}

export function isBeautyDemoMessage(data: unknown): data is { type?: string; kind?: string; event?: string; mode?: BeautyDemoMode; role?: BeautyDemoMode; section?: string } {
  if (!data || typeof data !== 'object') return false
  const type = beautyDemoMessageType(data)
  return ['BEAUTY_DEMO_READY', 'BEAUTY_DEMO_SECTION_CHANGED', 'BEAUTY_DEMO_MODE_CHANGED', 'BEAUTY_DEMO_ROLE_CHANGED', 'BEAUTY_DEMO_SECTION', 'BEAUTY_DEMO_ROLE'].includes(type)
}
