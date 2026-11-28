import { NICHE_CUSTOM_OPTION_ID, NICHE_OPTIONS } from './questions'
import type { NicheKey, NumericKind, NumericQuestionDef, StepAnswer } from './types'

export type FieldValidation = { valid: true; value: number } | { valid: false; error: string }

const INTEGER_MAX = 1_000_000
const MONEY_MAX = 100_000_000
const HOURS_PER_WEEK_MAX = 168

// Accepts a raw user-typed string (comma decimal separator and stray spaces
// are common when Russian users type numbers) and validates it against the
// numeric kind's business rules. Never mutates or discards the raw text —
// callers keep it in state so a failed validation doesn't clear the field.
export function validateNumericInput(raw: string, kind: NumericKind): FieldValidation {
  const trimmed = raw.trim()
  if (!trimmed) return { valid: false, error: 'Введите значение' }

  const normalized = trimmed.replace(/\s+/g, '').replace(',', '.')
  const value = Number(normalized)

  if (!Number.isFinite(value)) return { valid: false, error: 'Введите корректное число' }
  if (value < 0) return { valid: false, error: 'Значение не может быть отрицательным' }

  switch (kind) {
    case 'integer':
      if (!Number.isInteger(value) || value <= 0) return { valid: false, error: 'Введите целое число больше нуля' }
      if (value > INTEGER_MAX) return { valid: false, error: 'Слишком большое число' }
      return { valid: true, value }
    case 'money':
      if (value <= 0) return { valid: false, error: 'Введите сумму больше нуля' }
      if (value > MONEY_MAX) return { valid: false, error: 'Слишком большая сумма' }
      return { valid: true, value }
    case 'hours':
      if (value <= 0) return { valid: false, error: 'Введите число больше нуля' }
      if (value > HOURS_PER_WEEK_MAX) return { valid: false, error: 'В неделе не может быть больше 168 часов' }
      return { valid: true, value }
    case 'percent':
      if (value > 100) return { valid: false, error: 'Введите число от 0 до 100' }
      return { valid: true, value }
  }
}

export function resolveNumericAnswer(question: NumericQuestionDef, answer: StepAnswer): FieldValidation {
  if (!answer.optionId) return { valid: false, error: 'Выберите вариант ответа' }
  const option = question.options.find((o) => o.id === answer.optionId)
  if (!option) return { valid: false, error: 'Выберите вариант ответа' }
  if (option.kind === 'fixed') return { valid: true, value: option.value }
  return validateNumericInput(answer.customText, question.kind)
}

export type NicheValidation =
  | { valid: true; niche: NicheKey; customText: string }
  | { valid: false; error: string }

export function resolveNicheAnswer(answer: StepAnswer): NicheValidation {
  if (!answer.optionId) return { valid: false, error: 'Выберите вариант ответа' }
  if (answer.optionId === NICHE_CUSTOM_OPTION_ID) {
    const text = answer.customText.trim()
    if (!text) return { valid: false, error: 'Напишите, чем вы занимаетесь' }
    return { valid: true, niche: 'custom', customText: text }
  }
  const known = NICHE_OPTIONS.some((o) => o.id === answer.optionId)
  if (!known) return { valid: false, error: 'Выберите вариант ответа' }
  return { valid: true, niche: answer.optionId as NicheKey, customText: '' }
}

export function isNumericQuestionAnswerValid(question: NumericQuestionDef, answer: StepAnswer): boolean {
  return resolveNumericAnswer(question, answer).valid
}
