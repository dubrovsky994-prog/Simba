type LeadPayload = {
  name?: string
  contact?: string
  businessType?: string
  link?: string
  message?: string
  company?: string // honeypot — must stay empty; a filled value flags an automated submission
  page?: string
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

// Minimal request/response shape — avoids depending on @vercel/node types.
// Vercel's Node runtime augments the response object with .status()/.json() at runtime regardless.
type ApiRequest = {
  method?: string
  body?: unknown
  headers?: Record<string, string | string[] | undefined>
}
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: unknown) => void }

function getClientIp(req: ApiRequest): string {
  const forwarded = req.headers?.['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return (raw ?? 'unknown').split(',')[0].trim()
}

// Best-effort, in-memory rate limit. Vercel functions can run on multiple
// warm instances and reset on cold start, so this is a basic deterrent
// against rapid-fire spam from a single instance, not a hard guarantee —
// it does not require or justify adding an external store/dependency.
const RATE_LIMIT_WINDOW_MS = 15_000
const RATE_LIMIT_MAP_PRUNE_THRESHOLD = 500
const lastSubmissionByIp = new Map<string, number>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()

  if (lastSubmissionByIp.size >= RATE_LIMIT_MAP_PRUNE_THRESHOLD) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS
    for (const [key, timestamp] of lastSubmissionByIp) {
      if (timestamp < cutoff) lastSubmissionByIp.delete(key)
    }
  }

  const last = lastSubmissionByIp.get(ip)
  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return true
  }
  lastSubmissionByIp.set(ip, now)
  return false
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!botToken || !chatId) {
    console.error('Lead submission failed: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured')
    res.status(500).json({ ok: false, error: 'Telegram is not configured' })
    return
  }

  if (isRateLimited(getClientIp(req))) {
    res.status(429).json({ ok: false, error: 'Too many requests' })
    return
  }

  let body: LeadPayload
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as LeadPayload
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' })
    return
  }

  // Honeypot tripped: pretend success so the bot doesn't adapt, but drop the
  // submission silently — nothing is sent to Telegram, nothing is logged.
  if (sanitize(body?.company, 200)) {
    res.status(200).json({ ok: true })
    return
  }

  const name = sanitize(body?.name, 200)
  const contact = sanitize(body?.contact, 200)
  const businessType = sanitize(body?.businessType, 200)
  const link = sanitize(body?.link, 500)
  const message = sanitize(body?.message, 2000)
  const page = sanitize(body?.page, 200)

  if (!name || !contact || !businessType) {
    res.status(400).json({ ok: false, error: 'Missing required fields' })
    return
  }

  const submittedAt = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  const lines = [
    '<b>Новая заявка с сайта SIMBA</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон/Telegram:</b> ${escapeHtml(contact)}`,
    `<b>Сфера/вид бизнеса:</b> ${escapeHtml(businessType)}`,
  ]
  if (link) lines.push(`<b>Ссылка:</b> ${escapeHtml(link)}`)
  if (message) lines.push(`<b>Что нужно улучшить:</b> ${escapeHtml(message)}`)
  lines.push('', `<b>Дата и время:</b> ${submittedAt} (МСК)`)
  if (page) lines.push(`<b>Страница:</b> ${escapeHtml(page)}`)

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!telegramResponse.ok) {
      // Log only Telegram's short API description. It contains no submitted lead fields.
      let description = 'unknown'
      try {
        const errorBody = (await telegramResponse.json()) as { description?: unknown }
        if (typeof errorBody.description === 'string') description = errorBody.description.slice(0, 180)
      } catch {
        // Keep the generic description if Telegram returned a non-JSON body.
      }
      console.error('Telegram API error, status:', telegramResponse.status, 'description:', description)
      res.status(502).json({ ok: false, error: 'Telegram delivery failed' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Failed to send lead to Telegram:', error instanceof Error ? error.message : 'unknown error')
    res.status(500).json({ ok: false, error: 'Internal error' })
  }
}
