import { resolveNicheAnswer, resolveNumericAnswer } from './validate'
import { NUMERIC_QUESTIONS } from './questions'
import type { CalculatorAnswers } from './types'

const missedRateQuestion = NUMERIC_QUESTIONS.find((q) => q.id === 'missedRate')!
const cancelRateQuestion = NUMERIC_QUESTIONS.find((q) => q.id === 'cancelRate')!

// A restrained set of SBA acknowledgements shown above the *next* question —
// never a comment after every click. Spec caps this at ~3-4 across the whole
// flow, so only the moments that carry a real signal get one.
export function getStageReaction(step: number, answers: CalculatorAnswers): string | null {
  if (step === 1) {
    return 'Хорошо. Начнём с простого.'
  }

  if (step === 2) {
    return resolveNicheAnswer(answers.niche).valid ? 'Понял. Буду учитывать специфику этой ниши.' : null
  }

  if (step === 5) {
    const missed = resolveNumericAnswer(missedRateQuestion, answers.missedRate)
    if (!missed.valid) return null
    if (missed.value <= 2) return 'Здесь всё выглядит хорошо. Идём дальше.'
    if (missed.value >= 20) return 'Нашёл первый сигнал. Часть рекламного бюджета может теряться ещё до разговора с клиентом.'
    return null
  }

  if (step === 7) {
    const cancel = resolveNumericAnswer(cancelRateQuestion, answers.cancelRate)
    return cancel.valid && cancel.value >= 20 ? 'Здесь есть потенциал для напоминаний и сопровождения.' : null
  }

  if (step === 8) {
    return 'Понял. Теперь у меня достаточно данных для первого разбора.'
  }

  return null
}
