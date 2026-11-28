import { CALCULATOR_STORAGE_KEY } from '../../components/LossCalculator'
import { NUMERIC_QUESTIONS } from './questions'
import { resolveNicheAnswer, resolveNumericAnswer } from './validate'
import type { CalculatorAnswers } from './types'

export type CalculatorSessionSummary = {
  missedCount: number
}

const inquiriesQuestion = NUMERIC_QUESTIONS.find((q) => q.id === 'inquiries')!
const missedRateQuestion = NUMERIC_QUESTIONS.find((q) => q.id === 'missedRate')!

// Read-only: reuses the same sessionStorage entry LossCalculator already
// writes. No new backend, no data the visitor didn't already provide.
export function readCalculatorSessionSummary(): CalculatorSessionSummary | null {
  try {
    const raw = sessionStorage.getItem(CALCULATOR_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { answers?: CalculatorAnswers }
    const answers = parsed.answers
    if (!answers) return null

    if (!resolveNicheAnswer(answers.niche).valid) return null
    const inquiries = resolveNumericAnswer(inquiriesQuestion, answers.inquiries)
    const missedRate = resolveNumericAnswer(missedRateQuestion, answers.missedRate)
    if (!inquiries.valid || !missedRate.valid) return null

    const missedCount = Math.round(inquiries.value * (missedRate.value / 100))
    if (missedCount <= 0) return null

    return { missedCount }
  } catch {
    return null
  }
}
