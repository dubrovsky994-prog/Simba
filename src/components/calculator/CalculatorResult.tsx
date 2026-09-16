import { useRef } from 'react'
import CalculatorResultHero from './CalculatorResultHero'
import CalculatorLossMap from './CalculatorLossMap'
import CalculatorPotentialScale from './CalculatorPotentialScale'
import CalculatorRecommendationsFlow from './CalculatorRecommendationsFlow'
import CalculatorLeadGate from './CalculatorLeadGate'
import { nicheLabel } from '../../lib/calculator/questions'
import type { CalculationInputs, CalculationResult, NicheKey } from '../../lib/calculator/types'

type CalculatorResultProps = {
  niche: NicheKey
  nicheCustomText: string
  inputs: CalculationInputs
  result: CalculationResult
  onRestart: () => void
}

const Divider = () => <div className="mx-auto my-9 h-px w-full max-w-md bg-black/[0.06]" />

export default function CalculatorResult({ niche, nicheCustomText, inputs, result, onRestart }: CalculatorResultProps) {
  const topRef = useRef<HTMLDivElement>(null)
  const displayNiche = niche === 'custom' ? nicheCustomText : nicheLabel(niche)

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={topRef} className="mx-auto max-w-2xl">
      <CalculatorResultHero displayNiche={displayNiche} totalBurden={result.totalBurden} />

      <Divider />
      <CalculatorLossMap result={result} />

      <Divider />
      <CalculatorPotentialScale result={result} />

      <Divider />
      <CalculatorRecommendationsFlow niche={niche} />

      <div className="mt-9">
        <CalculatorLeadGate
          niche={niche}
          nicheCustomText={nicheCustomText}
          inputs={inputs}
          result={result}
          onReturnToResult={scrollToTop}
        />
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onRestart}
          className="text-sm font-medium text-text-muted underline underline-offset-2 hover:text-accent-dark"
        >
          Начать новый расчёт
        </button>
      </div>
    </div>
  )
}
