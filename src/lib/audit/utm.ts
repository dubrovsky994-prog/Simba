export type UtmParams = Partial<
  Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term', string>
>

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const STORAGE_KEY = 'simba_utm'

// Called once on app load. If the current URL carries UTM params, they're
// captured into sessionStorage so they survive navigating from a campaign
// link into /audit and, later, into a submitted lead — even though the
// params themselves aren't present on every page the visitor moves through.
export function captureUtmFromUrl(): void {
  try {
    const params = new URLSearchParams(window.location.search)
    const found: UtmParams = {}
    let hasAny = false
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) {
        found[key] = value.slice(0, 200)
        hasAny = true
      }
    }
    if (hasAny) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
  } catch {
    // sessionStorage unavailable (private mode, blocked storage) — UTM just won't be attached
  }
}

export function getStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}
