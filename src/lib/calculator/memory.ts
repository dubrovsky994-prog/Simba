import { NUMERIC_QUESTIONS, nicheLabel } from './questions'
import { resolveNicheAnswer, resolveNumericAnswer } from './validate'
import { formatMoney, formatNumber } from './format'
import type { CalculatorAnswers, NumericQuestionId } from './types'

export type MemoryItem = { id: 'niche' | NumericQuestionId; label: string; value: string }

const SHORT_LABELS: Record<'niche' | NumericQuestionId, string> = {
  niche: 'Ниша',
  inquiries: 'Заявки',
  avgCheck: 'Средний чек',
  missedRate: 'Без ответа',
  conversionRate: 'Конверсия',
  cancelRate: 'Отмены',
  manualHours: 'Ручная работа',
  hourValue: 'Стоимость часа',
}

function describeValue(id: NumericQuestionId, value: number): string {
  switch (id) {
    case 'inquiries':
      return `≈${formatNumber(value)} / месяц`
    case 'avgCheck':
      return `≈${formatMoney(value)}`
    case 'missedRate':
    case 'conversionRate':
    case 'cancelRate':
      return `≈${formatNumber(value)}%`
    case 'manualHours':
      return `≈${formatNumber(value)} ч / нед`
    case 'hourValue':
      return formatMoney(value)
  }
}

// "Что я уже понял" — SBA's living memory of the diagnostic so far. Reuses
// the same validators as the calculator itself so it never shows a value the
// calculation logic wouldn't accept.
export function buildMemoryItems(answers: CalculatorAnswers, upToStep: number): MemoryItem[] {
  const items: MemoryItem[] = []

  if (upToStep >= 1) {
    const niche = resolveNicheAnswer(answers.niche)
    if (niche.valid) {
      items.push({ id: 'niche', label: SHORT_LABELS.niche, value: niche.niche === 'custom' ? niche.customText : nicheLabel(niche.niche) })
    }
  }

  NUMERIC_QUESTIONS.forEach((question, index) => {
    const step = index + 2
    if (step > upToStep) return
    const resolved = resolveNumericAnswer(question, answers[question.id])
    if (!resolved.valid) return
    items.push({ id: question.id, label: SHORT_LABELS[question.id], value: describeValue(question.id, resolved.value) })
  })

  return items
}
