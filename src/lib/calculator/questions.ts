import type { NicheKey, NicheOption, NumericQuestionDef } from './types'

export const NICHE_OPTIONS: NicheOption[] = [
  { id: 'beauty', label: 'Красота и здоровье' },
  { id: 'goods', label: 'Продажа товаров' },
  { id: 'food', label: 'Еда и доставка' },
  { id: 'services', label: 'Услуги на заказ' },
  { id: 'construction', label: 'Строительство и ремонт' },
  { id: 'education', label: 'Обучение' },
  { id: 'photo', label: 'Фото, видео и мероприятия' },
]

export const NICHE_CUSTOM_OPTION_ID = 'custom'
export const NICHE_CUSTOM_LABEL = 'Указать свою нишу'
export const NICHE_CUSTOM_INPUT_LABEL = 'Напишите, чем вы занимаетесь'
export const NICHE_CUSTOM_PLACEHOLDER = 'Например: организация праздников'

export const NICHE_QUESTION = {
  title: 'Чем занимается ваш бизнес?',
  hint: 'Это поможет адаптировать расчёт и рекомендации под ваш способ работы.',
}

export function nicheLabel(niche: NicheKey): string {
  return NICHE_OPTIONS.find((o) => o.id === niche)?.label ?? NICHE_CUSTOM_LABEL
}

const CONVERSION_TITLE_BY_NICHE: Record<NicheKey, string> = {
  beauty: 'Сколько клиентов записываются после вашего ответа?',
  goods: 'Сколько клиентов оформляют заказ после вашего ответа?',
  food: 'Сколько клиентов оформляют заказ после вашего ответа?',
  services: 'Сколько обращений превращаются в реальный заказ?',
  construction: 'Сколько обращений превращаются в реальный заказ?',
  photo: 'Сколько обращений превращаются в реальный заказ?',
  education: 'Сколько клиентов покупают после вашего ответа?',
  custom: 'Сколько клиентов покупают после вашего ответа?',
}

const CANCEL_TITLE_BY_NICHE: Record<NicheKey, string> = {
  beauty: 'Как часто клиенты отменяют запись или не приходят?',
  goods: 'Как часто клиент начинает оформлять заказ, но не завершает покупку?',
  food: 'Как часто клиент начинает оформлять заказ, но не завершает покупку?',
  services: 'Как часто согласованный заказ не доходит до оплаты или начала работы?',
  construction: 'Как часто согласованный заказ не доходит до оплаты или начала работы?',
  photo: 'Как часто согласованный заказ не доходит до оплаты или начала работы?',
  education: 'Как часто согласованный заказ не доходит до оплаты или начала работы?',
  custom: 'Как часто согласованный заказ не доходит до оплаты или начала работы?',
}

export function resolveQuestionTitle(title: NumericQuestionDef['title'], niche: NicheKey): string {
  return typeof title === 'string' ? title : title[niche]
}

// step index doubles as the question number shown to the user (1..8) —
// niche is Q1, these numeric questions are Q2..Q8 in array order.
export const NUMERIC_QUESTIONS: NumericQuestionDef[] = [
  {
    id: 'inquiries',
    kind: 'integer',
    title: 'Сколько новых обращений вы получаете за месяц?',
    hint: 'Считайте все звонки, сообщения и заявки. Например: 30 человек написали во ВКонтакте, 10 — в Telegram и ещё 10 позвонили. Итого — 50 обращений.',
    options: [
      { id: 'lt10', label: 'До 10', kind: 'fixed', value: 7 },
      { id: '11-30', label: '11–30', kind: 'fixed', value: 20 },
      { id: '31-70', label: '31–70', kind: 'fixed', value: 50 },
      { id: '71-150', label: '71–150', kind: 'fixed', value: 100 },
      { id: 'gt150', label: 'Более 150', kind: 'input', placeholder: 'Например: 200' },
      { id: 'custom', label: 'Указать своё количество', kind: 'input', placeholder: 'Введите количество' },
    ],
  },
  {
    id: 'avgCheck',
    kind: 'money',
    title: 'Какой у вас средний чек?',
    hint: 'Средняя сумма одной покупки или услуги. Например: три заказа были на 2 000, 3 000 и 4 000 ₽ — средний чек около 3 000 ₽.',
    options: [
      { id: 'lt2000', label: 'До 2 000 ₽', kind: 'fixed', value: 1500 },
      { id: '2000-5000', label: '2 000–5 000 ₽', kind: 'fixed', value: 3500 },
      { id: '5000-15000', label: '5 000–15 000 ₽', kind: 'fixed', value: 10000 },
      { id: '15000-50000', label: '15 000–50 000 ₽', kind: 'fixed', value: 30000 },
      { id: 'gt50000', label: 'Более 50 000 ₽', kind: 'input', placeholder: 'Например: 65 000' },
      { id: 'custom', label: 'Указать свою сумму', kind: 'input', placeholder: 'Введите сумму в ₽' },
    ],
  },
  {
    id: 'missedRate',
    kind: 'percent',
    title: 'Сколько обращений остаётся без ответа или получает ответ слишком поздно?',
    hint: 'Например, клиент написал вечером, ответа не дождался и обратился к конкуренту.',
    options: [
      { id: 'almost-none', label: 'Практически ни одного', kind: 'fixed', value: 2 },
      { id: '1-10', label: 'Примерно 1 из 10', kind: 'fixed', value: 10 },
      { id: '2-10', label: 'Примерно 2 из 10', kind: 'fixed', value: 20 },
      { id: '3-10', label: 'Примерно 3 из 10', kind: 'fixed', value: 30 },
      { id: 'gt3-10', label: 'Больше 3 из 10', kind: 'fixed', value: 40 },
      { id: 'custom', label: 'Указать свой вариант', kind: 'input', placeholder: 'Введите процент, от 0 до 100' },
    ],
  },
  {
    id: 'conversionRate',
    kind: 'percent',
    title: CONVERSION_TITLE_BY_NICHE,
    hint: 'Например, вам написали 10 человек, а заказ оформили четверо — значит, покупают 4 из 10.',
    options: [
      { id: '1-2', label: '1–2 из 10', kind: 'fixed', value: 15 },
      { id: '3-4', label: '3–4 из 10', kind: 'fixed', value: 35 },
      { id: '5-6', label: '5–6 из 10', kind: 'fixed', value: 55 },
      { id: '7-8', label: '7–8 из 10', kind: 'fixed', value: 75 },
      { id: '9-10', label: '9–10 из 10', kind: 'fixed', value: 95 },
      { id: 'custom', label: 'Указать свой вариант', kind: 'input', placeholder: 'Введите процент, от 0 до 100' },
    ],
  },
  {
    id: 'cancelRate',
    kind: 'percent',
    title: CANCEL_TITLE_BY_NICHE,
    hint: 'Например, за месяц было 20 записей, и два человека не пришли — это примерно 1 из 10.',
    options: [
      { id: 'almost-never', label: 'Практически никогда', kind: 'fixed', value: 1 },
      { id: '1-20', label: 'Примерно 1 из 20', kind: 'fixed', value: 5 },
      { id: '1-10', label: 'Примерно 1 из 10', kind: 'fixed', value: 10 },
      { id: '2-10', label: 'Примерно 2 из 10', kind: 'fixed', value: 20 },
      { id: 'gt2-10', label: 'Чаще 2 из 10', kind: 'fixed', value: 30 },
      { id: 'custom', label: 'Указать свой вариант', kind: 'input', placeholder: 'Введите процент, от 0 до 100' },
    ],
  },
  {
    id: 'manualHours',
    kind: 'hours',
    title: 'Сколько времени в неделю вы тратите на ручную работу с клиентами?',
    hint: 'Ответы на одинаковые вопросы, отправка прайса, согласование времени, подтверждение записи, напоминания и заполнение таблиц.',
    options: [
      { id: 'lt2', label: 'До 2 часов', kind: 'fixed', value: 1 },
      { id: '2-5', label: '2–5 часов', kind: 'fixed', value: 3.5 },
      { id: '6-10', label: '6–10 часов', kind: 'fixed', value: 8 },
      { id: '11-20', label: '11–20 часов', kind: 'fixed', value: 15 },
      { id: 'gt20', label: 'Более 20 часов', kind: 'input', placeholder: 'Например: 25' },
      { id: 'custom', label: 'Указать своё количество', kind: 'input', placeholder: 'Введите количество часов' },
    ],
  },
  {
    id: 'hourValue',
    kind: 'money',
    title: 'Сколько примерно стоит час вашего рабочего времени?',
    hint: 'Например, если вы хотите зарабатывать 100 000 ₽ в месяц и работаете 160 часов, стоимость часа — около 625 ₽.',
    options: [
      { id: '300', label: '300 ₽', kind: 'fixed', value: 300 },
      { id: '500', label: '500 ₽', kind: 'fixed', value: 500 },
      { id: '700', label: '700 ₽', kind: 'fixed', value: 700 },
      { id: '1000', label: '1 000 ₽', kind: 'fixed', value: 1000 },
      { id: '1500', label: '1 500 ₽', kind: 'fixed', value: 1500 },
      { id: 'gt2000', label: 'Более 2 000 ₽', kind: 'input', placeholder: 'Например: 2 500' },
      { id: 'custom', label: 'Указать свою сумму', kind: 'input', placeholder: 'Введите сумму в ₽' },
    ],
  },
]

export const TOTAL_STEPS = 1 + NUMERIC_QUESTIONS.length
