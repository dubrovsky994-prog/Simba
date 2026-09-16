import { useEffect, useMemo, useState } from 'react'
import CalculatorIntro from './calculator/CalculatorIntro'
import CalculatorQuestionStage, { type StageOption } from './calculator/CalculatorQuestionStage'
import CalculatorCalculating from './calculator/CalculatorCalculating'
import CalculatorResult from './calculator/CalculatorResult'
import CalculatorAvatar from './calculator/CalculatorAvatar'
import {
  NICHE_CUSTOM_INPUT_LABEL,
  NICHE_CUSTOM_LABEL,
  NICHE_CUSTOM_OPTION_ID,
  NICHE_CUSTOM_PLACEHOLDER,
  NICHE_OPTIONS,
  NICHE_QUESTION,
  NUMERIC_QUESTIONS,
  TOTAL_STEPS,
  resolveQuestionTitle,
} from '../lib/calculator/questions'
import { resolveNicheAnswer, resolveNumericAnswer } from '../lib/calculator/validate'
import { calculateLoss } from '../lib/calculator/calculate'
import { trackCalculatorEvent } from '../lib/calculator/analytics'
import { EMPTY_CALCULATOR_ANSWERS, type CalculatorAnswers, type NicheKey, type NumericQuestionId } from '../lib/calculator/types'

const RESULT_STEP = TOTAL_STEPS + 1
// Mirrors CalculatorCalculating's own caption cadence (3 captions, 360ms each)
// plus a small buffer so the last caption is readable before the swap.
const CALCULATING_MS = 1100

const STAGE_LABELS: Record<number, string> = {
  1: 'О бизнесе',
  2: 'Заявки',
  3: 'Заявки',
  4: 'Потери',
  5: 'Потери',
  6: 'Потери',
  7: 'Время',
  8: 'Время',
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export default function LossCalculator() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CalculatorAnswers>(EMPTY_CALCULATOR_ANSWERS)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    trackCalculatorEvent('calculator_view')
  }, [])

  useEffect(() => {
    if (step < 1 || isCalculating) return
    const frame = window.requestAnimationFrame(() => {
      const heading = document.getElementById('calculator-question')
      heading?.focus({ preventScroll: true })
      document.getElementById('business-audit')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step, isCalculating])

  const nicheResolution = resolveNicheAnswer(answers.niche)
  const currentNiche: NicheKey = nicheResolution.valid ? nicheResolution.niche : 'custom'

  const numericQuestion = step >= 2 && step <= TOTAL_STEPS ? NUMERIC_QUESTIONS[step - 2] : null

  const stepOptions: StageOption[] = useMemo(() => {
    if (step === 1) {
      return [
        ...NICHE_OPTIONS.map((o) => ({ id: o.id, label: o.label, kind: 'fixed' as const })),
        { id: NICHE_CUSTOM_OPTION_ID, label: NICHE_CUSTOM_LABEL, kind: 'input' as const, placeholder: NICHE_CUSTOM_PLACEHOLDER },
      ]
    }
    if (numericQuestion) {
      return numericQuestion.options.map((o) => ({
        id: o.id,
        label: o.label,
        kind: o.kind,
        placeholder: o.kind === 'input' ? o.placeholder : undefined,
      }))
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const currentAnswer = step === 1 ? answers.niche : numericQuestion ? answers[numericQuestion.id] : null
  const selectedOption = stepOptions.find((o) => o.id === currentAnswer?.optionId) ?? null
  const canProceed = Boolean(currentAnswer?.optionId)

  const currentTitle =
    step === 1
      ? NICHE_QUESTION.title
      : numericQuestion
        ? resolveQuestionTitle(numericQuestion.title, currentNiche)
        : ''
  const currentHint = step === 1 ? NICHE_QUESTION.hint : numericQuestion?.hint ?? ''
  const customFieldLabel = step === 1 ? NICHE_CUSTOM_INPUT_LABEL : 'Ваше значение'
  const customFieldInputMode: 'text' | 'decimal' = step === 1 ? 'text' : 'decimal'

  const handleStart = () => {
    trackCalculatorEvent('calculator_start')
    setStep(1)
  }

  const handleSelect = (optionId: string) => {
    setFieldError(null)
    if (step === 1) {
      setAnswers((prev) => ({ ...prev, niche: { optionId, customText: prev.niche.customText } }))
      return
    }
    if (numericQuestion) {
      const id = numericQuestion.id
      setAnswers((prev) => ({ ...prev, [id]: { optionId, customText: prev[id].customText } }))
    }
  }

  const handleCustomTextChange = (text: string) => {
    if (step === 1) {
      setAnswers((prev) => ({ ...prev, niche: { ...prev.niche, customText: text } }))
      return
    }
    if (numericQuestion) {
      const id = numericQuestion.id
      setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], customText: text } }))
    }
  }

  const handleNext = () => {
    if (step === 1) {
      const resolved = resolveNicheAnswer(answers.niche)
      if (!resolved.valid) {
        setFieldError(resolved.error)
        return
      }
      if (answers.niche.optionId === NICHE_CUSTOM_OPTION_ID) trackCalculatorEvent('calculator_custom_answer', { step })
    } else if (numericQuestion) {
      const resolved = resolveNumericAnswer(numericQuestion, answers[numericQuestion.id])
      if (!resolved.valid) {
        setFieldError(resolved.error)
        return
      }
      if (selectedOption?.kind === 'input') trackCalculatorEvent('calculator_custom_answer', { step })
    }

    setFieldError(null)
    trackCalculatorEvent('calculator_step_completed', { step })

    if (step === TOTAL_STEPS) {
      trackCalculatorEvent('calculator_result_view')
      if (prefersReducedMotion()) {
        setStep(RESULT_STEP)
      } else {
        setIsCalculating(true)
        window.setTimeout(() => {
          setIsCalculating(false)
          setStep(RESULT_STEP)
        }, CALCULATING_MS)
      }
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setFieldError(null)
    setStep((s) => Math.max(0, s - 1))
  }

  const handleRestart = () => {
    setAnswers(EMPTY_CALCULATOR_ANSWERS)
    setFieldError(null)
    setIsCalculating(false)
    setStep(0)
  }

  const resolvedResult = useMemo(() => {
    if (step !== RESULT_STEP) return null
    const niche = resolveNicheAnswer(answers.niche)
    if (!niche.valid) return null

    const values: Partial<Record<NumericQuestionId, number>> = {}
    for (const question of NUMERIC_QUESTIONS) {
      const resolved = resolveNumericAnswer(question, answers[question.id])
      if (!resolved.valid) return null
      values[question.id] = resolved.value
    }

    const inputs = {
      inquiries: values.inquiries!,
      avgCheck: values.avgCheck!,
      missedRate: values.missedRate!,
      conversionRate: values.conversionRate!,
      cancelRate: values.cancelRate!,
      manualHours: values.manualHours!,
      hourValue: values.hourValue!,
    }

    return {
      niche: niche.niche,
      nicheCustomText: niche.customText,
      inputs,
      result: calculateLoss(inputs),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  return (
    <section id="business-audit" className="overflow-hidden bg-bg-section py-12 sm:py-16">
      <div className="container-px">
        {step === 0 && <CalculatorIntro onStart={handleStart} />}

        {step > 0 && !isCalculating && (
          <div className="mx-auto mb-3 flex max-w-2xl items-center justify-center gap-2" data-calculator-presence>
            <CalculatorAvatar state={fieldError ? 'error' : step === RESULT_STEP ? 'success' : 'active'} size={84} />
            <p className="text-sm font-medium text-text-muted">
              {fieldError ? 'Проверьте указанное значение' : step === RESULT_STEP ? 'Ваш расчёт готов' : 'Восемь вопросов о вашем бизнесе'}
            </p>
          </div>
        )}

        {step >= 1 && step <= TOTAL_STEPS && !isCalculating && (
          <CalculatorQuestionStage
            step={step}
            total={TOTAL_STEPS}
            stageLabel={STAGE_LABELS[step] ?? ''}
            title={currentTitle}
            hint={currentHint}
            options={stepOptions}
            answer={currentAnswer ?? { optionId: null, customText: '' }}
            selectedOption={selectedOption}
            fieldError={fieldError}
            customFieldLabel={customFieldLabel}
            customFieldInputMode={customFieldInputMode}
            showLiveHint={step >= 5}
            isLastQuestion={step === TOTAL_STEPS}
            canProceed={canProceed}
            onSelect={handleSelect}
            onCustomTextChange={handleCustomTextChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {isCalculating && <CalculatorCalculating />}

        {step === RESULT_STEP && resolvedResult && (
          <CalculatorResult
            niche={resolvedResult.niche}
            nicheCustomText={resolvedResult.nicheCustomText}
            inputs={resolvedResult.inputs}
            result={resolvedResult.result}
            onRestart={handleRestart}
          />
        )}
      </div>
    </section>
  )
}
