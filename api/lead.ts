type LeadPayload = {
  name?: string
  contact?: string
  businessType?: string
  link?: string
  message?: string
  company?: string // honeypot — must stay empty; a filled value flags an automated submission
  page?: string
  consent?: unknown
  // Loss-calculator lead fields — all optional so the plain contact form
  // above stays untouched. `kind === 'calculator'` is what marks a
  // submission as coming from the calculator rather than the plain form.
  kind?: string
  preferredContact?: string
  niche?: string
  nicheCustom?: string
  businessLink?: string
  pageUrl?: string
  answers?: {
    inquiries?: unknown
    avgCheck?: unknown
    missedRate?: unknown
    conversionRate?: unknown
    cancelRate?: unknown
    manualHours?: unknown
    hourValue?: unknown
  }
  results?: {
    lostLeads?: unknown
    cancellationLoss?: unknown
    manualCost?: unknown
    totalBurden?: unknown
    conservative?: unknown
    realistic?: unknown
    potential?: unknown
  }
  utm?: unknown
  // "Есть идея?" lead fields — all optional so the other lead kinds stay
  // untouched. `kind === 'idea_review'` marks a submission as coming from
  // this flow rather than the audit/calculator or the plain contact form.
  email?: string
  projectType?: string
  targetAudience?: string
  ideaDescription?: string
  projectStage?: string
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function sanitizeUtm(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') return {}
  const allowedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const result: Record<string, string> = {}
  for (const key of allowedKeys) {
    const raw = (value as Record<string, unknown>)[key]
    if (typeof raw === 'string' && raw.trim()) result[key] = sanitize(raw, 200)
  }
  return result
}

function sanitizeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

const moneyFormatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

function formatMoney(value: number): string {
  return moneyFormatter.format(Math.round(value))
}

const PREFERRED_CONTACT_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  phone: 'Телефон',
  other: 'Другой способ',
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

  // Consent is mandatory for both the plain contact form and the calculator —
  // reject anything that isn't an explicit, current `true` rather than
  // trusting the client to have gated the request already.
  if (body?.consent !== true) {
    res.status(400).json({ ok: false, error: 'Consent required' })
    return
  }

  const name = sanitize(body?.name, 200)
  const contact = sanitize(body?.contact, 200)
  const leadKind = sanitize(body?.kind, 20)
  const isCalculatorLead = leadKind === 'calculator'
  const isIdeaReviewLead = leadKind === 'idea_review'

  const submittedAt = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  let lines: string[]

  if (isCalculatorLead) {
    const niche = sanitize(body?.niche, 200)
    if (!name || !contact || !niche) {
      res.status(400).json({ ok: false, error: 'Missing required fields' })
      return
    }

    const nicheCustom = sanitize(body?.nicheCustom, 200)
    const businessLink = sanitize(body?.businessLink, 500)
    const pageUrl = sanitize(body?.pageUrl, 500)
    const preferredContactLabel = PREFERRED_CONTACT_LABELS[sanitize(body?.preferredContact, 20)] ?? 'Не указан'

    const inquiries = sanitizeNumber(body?.answers?.inquiries)
    const avgCheck = sanitizeNumber(body?.answers?.avgCheck)
    const missedRate = sanitizeNumber(body?.answers?.missedRate)
    const conversionRate = sanitizeNumber(body?.answers?.conversionRate)
    const cancelRate = sanitizeNumber(body?.answers?.cancelRate)
    const manualHours = sanitizeNumber(body?.answers?.manualHours)
    const hourValue = sanitizeNumber(body?.answers?.hourValue)

    const lostLeads = sanitizeNumber(body?.results?.lostLeads)
    const cancellationLoss = sanitizeNumber(body?.results?.cancellationLoss)
    const manualCost = sanitizeNumber(body?.results?.manualCost)
    const totalBurden = sanitizeNumber(body?.results?.totalBurden)
    const realistic = sanitizeNumber(body?.results?.realistic)

    const utm = sanitizeUtm(body?.utm)
    const utmSource = utm.utm_source ? `${utm.utm_source}${utm.utm_medium ? ` / ${utm.utm_medium}` : ''}` : 'direct'

    lines = [
      '🔥 <b>Новая заявка из калькулятора SIMBA</b>',
      '',
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)} (${escapeHtml(preferredContactLabel)})`,
      `<b>Ниша:</b> ${escapeHtml(niche)}${nicheCustom ? ` (${escapeHtml(nicheCustom)})` : ''}`,
      '',
      `<b>Обращения в месяц:</b> ${escapeHtml(String(inquiries))}`,
      `<b>Средний чек:</b> ${formatMoney(avgCheck)}`,
      `<b>Пропущенные обращения:</b> ${escapeHtml(String(missedRate))}%`,
      `<b>Конверсия в продажу:</b> ${escapeHtml(String(conversionRate))}%`,
      `<b>Отмены / незавершённые заказы:</b> ${escapeHtml(String(cancelRate))}%`,
      `<b>Часы ручной работы в неделю:</b> ${escapeHtml(String(manualHours))}`,
      `<b>Стоимость часа:</b> ${formatMoney(hourValue)}`,
      '',
      `<b>Потери на обращениях:</b> ${formatMoney(lostLeads)}`,
      `<b>Потери на отменах:</b> ${formatMoney(cancellationLoss)}`,
      `<b>Стоимость ручной работы:</b> ${formatMoney(manualCost)}`,
      `<b>Общая нагрузка в месяц:</b> ${formatMoney(totalBurden)}`,
      `<b>Реалистичный эффект автоматизации:</b> ${formatMoney(realistic)}`,
    ]
    if (businessLink) lines.push('', `<b>Ссылка на бизнес:</b> ${escapeHtml(businessLink)}`)
    lines.push('', `<b>Источник:</b> ${escapeHtml(utmSource)}`, `<b>Дата и время:</b> ${submittedAt} (МСК)`)
    if (pageUrl) lines.push(`<b>Страница:</b> ${escapeHtml(pageUrl)}`)
  } else if (isIdeaReviewLead) {
    const ideaDescription = sanitize(body?.ideaDescription, 2000)
    const projectStage = sanitize(body?.projectStage, 200)
    if (!name || !contact || !ideaDescription || !projectStage) {
      res.status(400).json({ ok: false, error: 'Missing required fields' })
      return
    }

    const email = sanitize(body?.email, 200)
    const projectType = sanitize(body?.projectType, 200)
    const targetAudience = sanitize(body?.targetAudience, 200)
    const pageUrl = sanitize(body?.pageUrl, 500)

    const utm = sanitizeUtm(body?.utm)
    const utmSource = utm.utm_source ? `${utm.utm_source}${utm.utm_medium ? ` / ${utm.utm_medium}` : ''}` : 'direct'

    lines = [
      '💡 <b>Новая заявка «Есть идея?» с сайта SIMBA</b>',
      '',
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)}`,
    ]
    if (email) lines.push(`<b>Email:</b> ${escapeHtml(email)}`)
    lines.push('')
    if (projectType) lines.push(`<b>Что хотят создать:</b> ${escapeHtml(projectType)}`)
    if (targetAudience) lines.push(`<b>Для кого:</b> ${escapeHtml(targetAudience)}`)
    lines.push(`<b>Что должен делать продукт:</b> ${escapeHtml(ideaDescription)}`, `<b>Этап проекта:</b> ${escapeHtml(projectStage)}`)
    lines.push('', `<b>Источник:</b> ${escapeHtml(utmSource)}`, `<b>Дата и время:</b> ${submittedAt} (МСК)`)
    if (pageUrl) lines.push(`<b>Страница:</b> ${escapeHtml(pageUrl)}`)
  } else {
    const businessType = sanitize(body?.businessType, 200)
    const link = sanitize(body?.link, 500)
    const message = sanitize(body?.message, 2000)
    const page = sanitize(body?.page, 200)

    if (!name || !contact || !businessType) {
      res.status(400).json({ ok: false, error: 'Missing required fields' })
      return
    }

    lines = [
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
  }

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
