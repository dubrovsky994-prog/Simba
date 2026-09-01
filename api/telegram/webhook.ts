// Telegram webhook for the SIMBA bot: greeting, FAQ, pricing, a 4-question
// matching wizard and a "ask a question" relay. Separate from api/lead.ts,
// which keeps handling the site's lead form untouched.
//
// No database, no AI. Wizard answers travel inside callback_data as compact
// letter codes (one per question); free-text steps (question / contact) use
// a small in-memory per-chat map holding only transient flags — never names,
// phones, or message text — best-effort only, like the rate limiter below,
// since serverless instances can cold-start and lose it.

type TelegramUser = { id: number; username?: string; first_name?: string }
type TelegramChat = { id: number; type?: string }
type TelegramMessage = { message_id: number; chat: TelegramChat; text?: string; from?: TelegramUser }
type TelegramCallbackQuery = { id: string; data?: string; message?: TelegramMessage; from?: TelegramUser }
type TelegramUpdate = { update_id?: number; message?: TelegramMessage; callback_query?: TelegramCallbackQuery }

type InlineKeyboardButton = { text: string; callback_data: string }
type InlineKeyboard = { inline_keyboard: InlineKeyboardButton[][] }

// Minimal request/response shape — avoids depending on @vercel/node types,
// matching the pattern already used in api/lead.ts.
type ApiRequest = {
  method?: string
  body?: unknown
  headers?: Record<string, string | string[] | undefined>
}
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: unknown) => void }

type BotEnv = { botToken: string; ownerChatId: string }

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function getHeader(req: ApiRequest, name: string): string | undefined {
  const raw = req.headers?.[name]
  return Array.isArray(raw) ? raw[0] : raw
}

function getSiteOrigin(req: ApiRequest): string {
  const host = getHeader(req, 'x-forwarded-host') ?? getHeader(req, 'host')
  return host ? `https://${host}` : ''
}

function formatMoscowTime(): string {
  return new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
}

// ---- Telegram API -----------------------------------------------------

async function tgCall(token: string, method: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      console.error(`Telegram API ${method} failed, status:`, response.status)
      return false
    }
    return true
  } catch (error) {
    console.error(`Telegram API ${method} error:`, error instanceof Error ? error.message : 'unknown error')
    return false
  }
}

function sendMessage(token: string, chatId: number | string, text: string, keyboard?: InlineKeyboard): Promise<boolean> {
  return tgCall(token, 'sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: keyboard } : {}),
  })
}

function answerCallbackQuery(token: string, callbackQueryId: string): Promise<boolean> {
  return tgCall(token, 'answerCallbackQuery', { callback_query_id: callbackQueryId })
}

// ---- Best-effort in-memory state (no personal data, no DB) ------------

type ChatState = {
  awaiting?: 'question' | 'contact'
  consented?: boolean
  leadContext?: string
  updatedAt: number
}

const CHAT_STATE_TTL_MS = 30 * 60_000
const CHAT_STATE_PRUNE_THRESHOLD = 1000
const chatStateByChat = new Map<number, ChatState>()

function pruneChatState(): void {
  if (chatStateByChat.size < CHAT_STATE_PRUNE_THRESHOLD) return
  const cutoff = Date.now() - CHAT_STATE_TTL_MS
  for (const [chatId, state] of chatStateByChat) {
    if (state.updatedAt < cutoff) chatStateByChat.delete(chatId)
  }
}

function getChatState(chatId: number): ChatState {
  const existing = chatStateByChat.get(chatId)
  if (existing && Date.now() - existing.updatedAt < CHAT_STATE_TTL_MS) return existing
  return { updatedAt: Date.now() }
}

function setChatState(chatId: number, patch: Partial<ChatState>): void {
  pruneChatState()
  chatStateByChat.set(chatId, { ...getChatState(chatId), ...patch, updatedAt: Date.now() })
}

function clearChatState(chatId: number): void {
  chatStateByChat.delete(chatId)
}

// Best-effort per-chat throttles (in-memory, reset on cold start — same
// deliberate trade-off as the rate limiter in api/lead.ts).
const GENERAL_THROTTLE_MS = 600
const OWNER_FORWARD_THROTTLE_MS = 15_000
const THROTTLE_MAP_PRUNE_THRESHOLD = 1000

const lastActionByChat = new Map<number, number>()
const lastOwnerForwardByChat = new Map<number, number>()

function isThrottled(map: Map<number, number>, chatId: number, windowMs: number): boolean {
  const now = Date.now()
  if (map.size >= THROTTLE_MAP_PRUNE_THRESHOLD) {
    const cutoff = now - windowMs
    for (const [key, timestamp] of map) {
      if (timestamp < cutoff) map.delete(key)
    }
  }
  const last = map.get(chatId)
  if (last && now - last < windowMs) return true
  map.set(chatId, now)
  return false
}

// ---- Static content -----------------------------------------------------

const WELCOME_TEXT = 'Привет! Я бот SIMBA. Помогу за минуту понять, какая цифровая система подойдёт вашему бизнесу.'

function mainMenuKeyboard(): InlineKeyboard {
  return {
    inline_keyboard: [
      [{ text: 'Подобрать систему', callback_data: 'wiz' }],
      [{ text: 'Что умеет SIMBA', callback_data: 'about' }],
      [{ text: 'Тарифы', callback_data: 'pricing' }],
      [{ text: 'Задать вопрос', callback_data: 'ask' }],
    ],
  }
}

const ABOUT_TEXT = [
  '<b>Что умеет SIMBA</b>',
  '',
  'Собираем digital-систему из четырёх частей — можно взять всё сразу или начать с одной:',
  '',
  '— <b>Сайт или мини-магазин</b> — точка входа и заявки.',
  '— <b>Telegram-бот</b> — ответы, квалификация и заявки 24/7.',
  '— <b>Клиентская база</b> — порядок в обращениях и повторные продажи.',
  '— <b>Автоматизация</b> — меньше ручной работы и потерянных обращений.',
].join('\n')

function aboutKeyboard(): InlineKeyboard {
  return {
    inline_keyboard: [
      [{ text: 'Подобрать систему', callback_data: 'wiz' }],
      [{ text: 'Оставить заявку', callback_data: 'lead:-' }],
      [{ text: 'Главное меню', callback_data: 'start' }],
    ],
  }
}

const PRICING_TEXT = [
  '<b>Тарифы SIMBA</b>',
  '',
  '— <b>Старт</b> — 29 900 ₽',
  '— <b>Продажи</b> — 49 900 ₽',
  '— <b>Система</b> — от 79 900 ₽',
  '',
  'Точный состав, интеграции, сроки и стоимость фиксируются индивидуальным договором и ТЗ. Мы не обещаем конкретные продажи или прибыль — это зависит от вашего бизнеса и рынка.',
].join('\n')

function pricingKeyboard(): InlineKeyboard {
  return {
    inline_keyboard: [
      [{ text: 'Подобрать систему', callback_data: 'wiz' }],
      [{ text: 'Главное меню', callback_data: 'start' }],
    ],
  }
}

function cancelKeyboard(): InlineKeyboard {
  return { inline_keyboard: [[{ text: 'Главное меню', callback_data: 'start' }]] }
}

// ---- Wizard ---------------------------------------------------------------

const WIZARD_QUESTIONS = [
  {
    text: 'Вопрос 1 из 4. Что сейчас важнее?',
    options: [
      ['A', 'Больше заявок'],
      ['B', 'Принимать заказы'],
      ['C', 'Вернуть клиентов'],
      ['D', 'Убрать ручную работу'],
    ],
  },
  {
    text: 'Вопрос 2 из 4. Что уже есть?',
    options: [
      ['A', 'Только соцсети'],
      ['B', 'Есть сайт'],
      ['C', 'Сайт и мессенджеры'],
      ['D', 'Всё разрозненно'],
    ],
  },
  {
    text: 'Вопрос 3 из 4. Какой у вас бизнес?',
    options: [
      ['A', 'Услуги'],
      ['B', 'Товары'],
      ['C', 'Доставка / общепит'],
      ['D', 'Производство'],
      ['E', 'Другое'],
    ],
  },
  {
    text: 'Вопрос 4 из 4. Как хотите начать?',
    options: [
      ['A', 'С минимального шага'],
      ['B', 'Сразу собрать систему'],
      ['C', 'Не знаю, подскажите'],
    ],
  },
] as const

function isValidOptionCode(step: number, code: string): boolean {
  const question = WIZARD_QUESTIONS[step]
  if (!question) return false
  return question.options.some(([optionCode]) => optionCode === code)
}

function validateAccumulated(code: string): boolean {
  if (code.length < 1 || code.length > WIZARD_QUESTIONS.length) return false
  for (let i = 0; i < code.length; i++) {
    if (!isValidOptionCode(i, code[i])) return false
  }
  return true
}

function optionLabel(step: number, code: string): string {
  const question = WIZARD_QUESTIONS[step]
  const match = question?.options.find(([optionCode]) => optionCode === code)
  return match ? match[1] : ''
}

function wizardKeyboard(step: number, prefix: string): InlineKeyboard {
  const question = WIZARD_QUESTIONS[step]
  const nextStep = step + 1
  return {
    inline_keyboard: question.options.map(([code, label]) => [
      { text: label, callback_data: `wq${nextStep}:${prefix}${code}` },
    ]),
  }
}

// ---- Recommendation --------------------------------------------------------

type ProfileKey = 'start' | 'sales' | 'system'

const PROFILES: Record<ProfileKey, { title: string; price: string; pitch: string; reasons: string[]; firstStep: string }> = {
  start: {
    title: 'Старт',
    price: '29 900 ₽',
    pitch:
      'сначала соберём простую точку входа для заявок, а дальше будем дополнять по необходимости. Точный состав определим после короткого разбора.',
    reasons: [
      'Быстрый и недорогой способ получить понятную точку входа для заявок.',
      'Хорошо подходит, если сейчас есть только соцсети или почти ничего, кроме них.',
      'Дальше можно постепенно добавить бота, базу и автоматизацию без переделки с нуля.',
    ],
    firstStep: 'Лендинг или мини-магазин с формой заявки + базовая настройка приёма обращений.',
  },
  sales: {
    title: 'Продажи',
    price: '49 900 ₽',
    pitch:
      'сначала соберём понятную точку заявки, затем добавим приём заказов и связку с Telegram. Точный состав определим после короткого разбора.',
    reasons: [
      'Учитывает не только заявки, но и приём заказов.',
      'Подходит бизнесу с доставкой, товарами и высокой скоростью ответа клиенту.',
      'Добавляет связку сайта или мини-магазина с Telegram-ботом.',
    ],
    firstStep: 'Точка приёма заявок/заказов (сайт или мини-магазин) + Telegram-бот с квалификацией клиентов.',
  },
  system: {
    title: 'Система',
    price: 'от 79 900 ₽',
    pitch:
      'объединим ваши каналы в одну систему: точка входа, клиентская база и автоматизация рутинных задач. Точный состав определим после короткого разбора.',
    reasons: [
      'Объединяет разрозненные каналы (сайт, соцсети, мессенджеры) в одном месте.',
      'Добавляет клиентскую базу и автоматизацию повторных продаж.',
      'Снижает ручную работу и число потерянных обращений.',
    ],
    firstStep: 'Аудит текущих каналов, точка входа (сайт/бот) и план подключения базы и автоматизации.',
  },
}

function recommend(code: string): ProfileKey {
  const q1 = code[0]
  const q2 = code[1]
  const q3 = code[2]
  const q4 = code[3]

  if (q4 === 'C') return 'start' // «не знаю» — безопасная точка диагностики
  if (q2 === 'D' && (q1 === 'D' || q1 === 'C')) return 'system' // разрозненные каналы + автоматизация/повторные продажи
  if (q1 === 'B' || q3 === 'B' || q3 === 'C') return 'sales' // заказы, доставка, товары
  if (q2 === 'A' && q1 === 'A') return 'start' // только соцсети + больше заявок
  return 'start'
}

function buildResultText(profileKey: ProfileKey): string {
  const profile = PROFILES[profileKey]
  const lines = [
    `Вам, скорее всего, подойдёт «${profile.title}»: ${profile.pitch}`,
    '',
    'Почему:',
    ...profile.reasons.map((reason) => `— ${reason}`),
    '',
    `Что входит первым шагом: ${profile.firstStep}`,
    '',
    `Ориентир по стоимости: ${profile.price} (точный состав, интеграции и сроки — по договору и ТЗ после разбора).`,
  ]
  return lines.join('\n')
}

function resultKeyboard(code: string): InlineKeyboard {
  return {
    inline_keyboard: [
      [{ text: 'Получить бесплатный разбор', callback_data: `lead:${code}` }],
      [{ text: 'Начать заново', callback_data: 'wiz' }],
      [{ text: 'Главное меню', callback_data: 'start' }],
    ],
  }
}

// ---- Consent + contact / question relay -----------------------------------

function consentText(origin: string): string {
  const link = origin ? `${origin}/privacy` : '/privacy'
  return [
    'Чтобы передать заявку владельцу, нужно ваше согласие на обработку персональных данных.',
    '',
    `Политика обработки персональных данных: ${link}`,
    '',
    'Дальше мы попросим только контакт для связи — без лишних данных.',
  ].join('\n')
}

function consentKeyboard(code: string): InlineKeyboard {
  return {
    inline_keyboard: [
      [{ text: 'Согласен на обработку данных', callback_data: `consent:${code}` }],
      [{ text: 'Главное меню', callback_data: 'start' }],
    ],
  }
}

function buildLeadOwnerText(code: string, contact: string): string {
  const lines = ['<b>Заявка из Telegram-бота SIMBA</b>', '']

  if (code !== '-' && validateAccumulated(code) && code.length === WIZARD_QUESTIONS.length) {
    const profileKey = recommend(code)
    lines.push(`<b>Рекомендованный формат:</b> ${PROFILES[profileKey].title}`)
    lines.push(`<b>Что важнее:</b> ${optionLabel(0, code[0])}`)
    lines.push(`<b>Что уже есть:</b> ${optionLabel(1, code[1])}`)
    lines.push(`<b>Бизнес:</b> ${optionLabel(2, code[2])}`)
    lines.push(`<b>Как хотят начать:</b> ${optionLabel(3, code[3])}`)
    lines.push('')
  }

  lines.push(`<b>Контакт:</b> ${escapeHtml(contact)}`)
  lines.push('')
  lines.push(`<b>Дата и время:</b> ${formatMoscowTime()} (МСК)`)
  return lines.join('\n')
}

// ---- Update handlers --------------------------------------------------

async function handleMessage(message: TelegramMessage, env: BotEnv): Promise<void> {
  const chatId = message.chat?.id
  if (typeof chatId !== 'number') return
  if (isThrottled(lastActionByChat, chatId, GENERAL_THROTTLE_MS)) return

  const text = typeof message.text === 'string' ? message.text.trim() : ''
  if (!text) return // ignore non-text messages (photos, stickers, etc.)

  if (/^\/start(\s|@|$)/.test(text)) {
    clearChatState(chatId)
    await sendMessage(env.botToken, chatId, WELCOME_TEXT, mainMenuKeyboard())
    return
  }

  const state = getChatState(chatId)

  if (state.awaiting === 'question') {
    const question = sanitize(text, 1500)
    if (!question) return

    if (isThrottled(lastOwnerForwardByChat, chatId, OWNER_FORWARD_THROTTLE_MS)) {
      await sendMessage(env.botToken, chatId, 'Пожалуйста, подождите немного перед следующим сообщением.')
      return
    }

    clearChatState(chatId)
    const ownerText = ['<b>Вопрос из бота</b>', '', escapeHtml(question), '', `<b>Дата и время:</b> ${formatMoscowTime()} (МСК)`].join('\n')
    const delivered = await sendMessage(env.botToken, env.ownerChatId, ownerText)

    await sendMessage(
      env.botToken,
      chatId,
      delivered
        ? 'Спасибо, вопрос передан владельцу. Он свяжется с вами лично.'
        : 'Не получилось передать вопрос. Пожалуйста, попробуйте ещё раз чуть позже.',
      mainMenuKeyboard(),
    )
    return
  }

  if (state.awaiting === 'contact' && state.consented) {
    const contact = sanitize(text, 200)
    if (!contact) return

    if (isThrottled(lastOwnerForwardByChat, chatId, OWNER_FORWARD_THROTTLE_MS)) {
      await sendMessage(env.botToken, chatId, 'Пожалуйста, подождите немного перед следующим сообщением.')
      return
    }

    const code = state.leadContext ?? '-'
    clearChatState(chatId)
    const delivered = await sendMessage(env.botToken, env.ownerChatId, buildLeadOwnerText(code, contact))

    await sendMessage(
      env.botToken,
      chatId,
      delivered
        ? 'Спасибо! Ваша заявка передана владельцу. Он свяжется с вами в ближайшее время.'
        : 'Не получилось передать заявку. Пожалуйста, попробуйте ещё раз чуть позже.',
      mainMenuKeyboard(),
    )
    return
  }

  await sendMessage(env.botToken, chatId, 'Не совсем поняла ваше сообщение. Выберите действие из меню:', mainMenuKeyboard())
}

async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery, env: BotEnv, req: ApiRequest): Promise<void> {
  const chatId = callbackQuery.message?.chat?.id
  const data = typeof callbackQuery.data === 'string' ? callbackQuery.data : ''

  // Always clear the button's loading spinner, even if we bail out below.
  await answerCallbackQuery(env.botToken, callbackQuery.id)

  if (typeof chatId !== 'number') return
  if (isThrottled(lastActionByChat, chatId, GENERAL_THROTTLE_MS)) return

  if (data === 'start') {
    clearChatState(chatId)
    await sendMessage(env.botToken, chatId, WELCOME_TEXT, mainMenuKeyboard())
    return
  }

  if (data === 'about') {
    await sendMessage(env.botToken, chatId, ABOUT_TEXT, aboutKeyboard())
    return
  }

  if (data === 'pricing') {
    await sendMessage(env.botToken, chatId, PRICING_TEXT, pricingKeyboard())
    return
  }

  if (data === 'ask') {
    setChatState(chatId, { awaiting: 'question', consented: false, leadContext: undefined })
    await sendMessage(env.botToken, chatId, 'Напишите ваш вопрос одним сообщением — я передам его владельцу SIMBA.', cancelKeyboard())
    return
  }

  if (data === 'wiz') {
    clearChatState(chatId)
    await sendMessage(env.botToken, chatId, WIZARD_QUESTIONS[0].text, wizardKeyboard(0, ''))
    return
  }

  const wizardMatch = data.match(/^wq([1-4]):([A-E]{1,4})$/)
  if (wizardMatch) {
    const step = Number(wizardMatch[1])
    const accumulated = wizardMatch[2]

    if (accumulated.length !== step || !validateAccumulated(accumulated)) {
      await sendMessage(env.botToken, chatId, 'Не удалось распознать ответ. Начнём заново:', mainMenuKeyboard())
      return
    }

    if (step < WIZARD_QUESTIONS.length) {
      await sendMessage(env.botToken, chatId, WIZARD_QUESTIONS[step].text, wizardKeyboard(step, accumulated))
    } else {
      const profileKey = recommend(accumulated)
      await sendMessage(env.botToken, chatId, buildResultText(profileKey), resultKeyboard(accumulated))
    }
    return
  }

  if (data.startsWith('lead:')) {
    const code = data.slice('lead:'.length)
    if (code !== '-' && (!validateAccumulated(code) || code.length !== WIZARD_QUESTIONS.length)) {
      await sendMessage(env.botToken, chatId, 'Не удалось распознать действие. Вот главное меню:', mainMenuKeyboard())
      return
    }
    await sendMessage(env.botToken, chatId, consentText(getSiteOrigin(req)), consentKeyboard(code))
    return
  }

  if (data.startsWith('consent:')) {
    const code = data.slice('consent:'.length)
    if (code !== '-' && (!validateAccumulated(code) || code.length !== WIZARD_QUESTIONS.length)) {
      await sendMessage(env.botToken, chatId, 'Не удалось распознать действие. Вот главное меню:', mainMenuKeyboard())
      return
    }
    setChatState(chatId, { awaiting: 'contact', consented: true, leadContext: code })
    await sendMessage(
      env.botToken,
      chatId,
      'Спасибо! Напишите, пожалуйста, телефон или username Telegram одним сообщением — и мы свяжемся с вами.',
      cancelKeyboard(),
    )
    return
  }

  // Unknown callback code — never let it crash the webhook.
  await sendMessage(env.botToken, chatId, 'Не удалось распознать действие. Вот главное меню:', mainMenuKeyboard())
}

// ---- Entry point --------------------------------------------------------

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const ownerChatId = process.env.TELEGRAM_CHAT_ID
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET

  if (!botToken || !ownerChatId || !webhookSecret) {
    console.error('Telegram webhook failed: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID or TELEGRAM_WEBHOOK_SECRET is not configured')
    res.status(500).json({ ok: false, error: 'Telegram bot is not configured' })
    return
  }

  const providedSecret = getHeader(req, 'x-telegram-bot-api-secret-token')
  if (providedSecret !== webhookSecret) {
    res.status(401).json({ ok: false, error: 'Invalid webhook secret' })
    return
  }

  let update: TelegramUpdate
  try {
    update = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as TelegramUpdate
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' })
    return
  }

  if (!update || typeof update !== 'object') {
    res.status(400).json({ ok: false, error: 'Invalid update' })
    return
  }

  const env: BotEnv = { botToken, ownerChatId }

  // Telegram expects a fast 2xx ack; internal errors are logged (without
  // sensitive data) and never surfaced back to Telegram or the chat user
  // as if the action had succeeded.
  try {
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query, env, req)
    } else if (update.message) {
      await handleMessage(update.message, env)
    }
  } catch (error) {
    console.error('Telegram webhook processing error:', error instanceof Error ? error.message : 'unknown error')
  }

  res.status(200).json({ ok: true })
}
