import { useState } from 'react'
import CalculatorLeadForm from './CalculatorLeadForm'
import { IconArrowRight } from '../icons'
import { CONTACT_TELEGRAM_URL } from '../../legal/content'
import type { CalculationInputs, CalculationResult, NicheKey } from '../../lib/calculator/types'

type CalculatorLeadGateProps = {
  niche: NicheKey
  nicheCustomText: string
  inputs: CalculationInputs
  result: CalculationResult
  onReturnToResult: () => void
}

// Keeps the contact form out of the main result view entirely until the
// visitor asks for it — the result (hero sum, loss map, potential scale,
// recommendations) never has to compete with a form for attention.
export default function CalculatorLeadGate({ niche, nicheCustomText, inputs, result, onReturnToResult }: CalculatorLeadGateProps) {
  const [expanded, setExpanded] = useState(false)

  if (expanded) {
    return (
      <CalculatorLeadForm
        niche={niche}
        nicheCustomText={nicheCustomText}
        inputs={inputs}
        result={result}
        onReturnToResult={onReturnToResult}
      />
    )
  }

  return (
    <div className="rounded-[28px] border border-black/[0.04] bg-white/60 p-6 text-center shadow-[0_20px_50px_rgba(31,37,43,0.06)] sm:p-8">
      <h3 className="text-xl font-bold text-text-main sm:text-2xl">Хотите увидеть, как SBA будет работать именно у вас?</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
        Мы посмотрим ваш сайт или социальную страницу и покажем три конкретных места, где могут теряться клиенты.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          Показать моего SBA
          <IconArrowRight className="h-4 w-4" />
        </button>
        <a href={CONTACT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Обсудить с человеком
        </a>
      </div>
    </div>
  )
}
