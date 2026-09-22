import CalculatorProgress from './CalculatorProgress'
import CalculatorOptionCard from './CalculatorOptionCard'
import CalculatorNumberField from './CalculatorNumberField'
import { IconArrowRight } from '../icons'
import type { StepAnswer } from '../../lib/calculator/types'

export type StageOption = { id: string; label: string; kind: 'fixed' | 'input'; placeholder?: string }

type CalculatorQuestionStageProps = {
  step: number
  total: number
  stageLabel: string
  title: string
  hint: string
  options: StageOption[]
  answer: StepAnswer
  selectedOption: StageOption | null
  fieldError: string | null
  customFieldLabel: string
  customFieldInputMode: 'text' | 'decimal'
  showLiveHint: boolean
  isLastQuestion: boolean
  canProceed: boolean
  onSelect: (optionId: string) => void
  onCustomTextChange: (text: string) => void
  onBack: () => void
  onNext: () => void
}

export default function CalculatorQuestionStage({
  step,
  total,
  stageLabel,
  title,
  hint,
  options,
  answer,
  selectedOption,
  fieldError,
  customFieldLabel,
  customFieldInputMode,
  showLiveHint,
  isLastQuestion,
  canProceed,
  onSelect,
  onCustomTextChange,
  onBack,
  onNext,
}: CalculatorQuestionStageProps) {
  return (
    <div className="public-v2-calc-question mx-auto max-w-2xl rounded-[28px] border border-black/[0.04] bg-white/60 p-5 shadow-[0_20px_50px_rgba(31,37,43,0.06)] backdrop-blur-sm sm:p-8">
      <CalculatorProgress step={step} total={total} stageLabel={stageLabel} />

      <div key={step} className="mt-6 animate-calc-step" role="radiogroup" aria-labelledby="calculator-question">
        <div className="flex items-start justify-between gap-3">
          <h3 id="calculator-question" tabIndex={-1} className="text-xl font-bold leading-snug text-text-main sm:text-2xl">
            {title}
          </h3>
          {showLiveHint && (
            <span className="mt-1 hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-accent-dark sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
              Расчёт обновляется
            </span>
          )}
        </div>
        {hint && <p className="mt-2 text-sm leading-relaxed text-text-muted">({hint})</p>}

        <div className="mt-5 flex flex-col gap-2.5">
          {options.map((option) => (
            <CalculatorOptionCard
              key={option.id}
              label={option.label}
              selected={answer.optionId === option.id}
              onToggle={() => onSelect(option.id)}
            />
          ))}
        </div>

        {selectedOption?.kind === 'input' && (
          <CalculatorNumberField
            id="calculator-custom-input"
            label={customFieldLabel}
            placeholder={selectedOption.placeholder ?? ''}
            value={answer.customText}
            onChange={onCustomTextChange}
            error={fieldError ?? undefined}
            inputMode={customFieldInputMode}
          />
        )}
        {fieldError && selectedOption?.kind !== 'input' && <p className="mt-3 text-[13px] text-red-500">{fieldError}</p>}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="btn-secondary">
          Назад
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastQuestion ? 'Показать результат' : 'Продолжить'}
          <IconArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
