export type NicheKey =
  | 'beauty'
  | 'goods'
  | 'food'
  | 'services'
  | 'construction'
  | 'education'
  | 'photo'
  | 'custom'

export type NumericQuestionId =
  | 'inquiries'
  | 'avgCheck'
  | 'missedRate'
  | 'conversionRate'
  | 'cancelRate'
  | 'manualHours'
  | 'hourValue'

export type QuestionId = 'niche' | NumericQuestionId

export type NumericKind = 'integer' | 'money' | 'hours' | 'percent'

export type FixedOption = { id: string; label: string; kind: 'fixed'; value: number }
export type InputOption = { id: string; label: string; kind: 'input'; placeholder: string }
export type QuestionOption = FixedOption | InputOption

export type NumericQuestionDef = {
  id: NumericQuestionId
  kind: NumericKind
  // Some questions (conversion/cancellation) are worded differently depending
  // on the chosen niche — a plain string is used everywhere else.
  title: string | Record<NicheKey, string>
  hint: string
  options: QuestionOption[]
}

export type NicheOption = { id: NicheKey; label: string }

export type StepAnswer = { optionId: string | null; customText: string }

export type CalculatorAnswers = {
  niche: StepAnswer
  inquiries: StepAnswer
  avgCheck: StepAnswer
  missedRate: StepAnswer
  conversionRate: StepAnswer
  cancelRate: StepAnswer
  manualHours: StepAnswer
  hourValue: StepAnswer
}

export const EMPTY_CALCULATOR_ANSWERS: CalculatorAnswers = {
  niche: { optionId: null, customText: '' },
  inquiries: { optionId: null, customText: '' },
  avgCheck: { optionId: null, customText: '' },
  missedRate: { optionId: null, customText: '' },
  conversionRate: { optionId: null, customText: '' },
  cancelRate: { optionId: null, customText: '' },
  manualHours: { optionId: null, customText: '' },
  hourValue: { optionId: null, customText: '' },
}

export type CalculationInputs = {
  inquiries: number
  avgCheck: number
  missedRate: number // percent, 0-100
  conversionRate: number // percent, 0-100
  cancelRate: number // percent, 0-100
  manualHours: number
  hourValue: number
}

export type CalculationResult = {
  lostLeads: number
  bookings: number
  cancellationLoss: number
  manualCost: number
  cashLoss: number
  totalBurden: number
  conservative: number
  realistic: number
  potential: number
}

export type ResolvedAnswers = {
  niche: NicheKey
  nicheCustomText: string
  inputs: CalculationInputs
}
