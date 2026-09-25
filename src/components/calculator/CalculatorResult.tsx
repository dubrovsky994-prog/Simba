import { useRef, useState } from 'react'
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

export default function CalculatorResult({ niche, nicheCustomText, inputs, result, onRestart }: CalculatorResultProps) {
  const topRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'summary' | 'solutions' | 'plan'>('summary')
  const displayNiche = niche === 'custom' ? nicheCustomText : nicheLabel(niche)

  const scrollToTop = () => {
    setView('summary')
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={topRef} className="calculator-editorial-result">
      <div className="calculator-result-tabs" role="tablist" aria-label="Ваш результат">{([
        ['summary', 'Ваш расчёт'], ['solutions', 'Как закрыть потери'], ['plan', 'План действий'],
      ] as const).map(([id, label]) => <button key={id} type="button" role="tab" id={`result-tab-${id}`} aria-controls={`result-panel-${id}`} aria-selected={view === id} onClick={() => setView(id)}>{label}</button>)}</div>
      <div id="result-panel-summary" role="tabpanel" aria-labelledby="result-tab-summary" hidden={view !== 'summary'}>
        <div className="calculator-result-overview"><CalculatorResultHero displayNiche={displayNiche} totalBurden={result.totalBurden} /><CalculatorLossMap result={result} /></div>
        <details className="calculator-result-scenarios"><summary>Что потенциально можно вернуть бизнесу?</summary><CalculatorPotentialScale result={result} /></details>
        <button className="btn-primary calculator-result-next" onClick={() => setView('solutions')}>Посмотреть, как закрыть эти потери →</button>
      </div>
      <div id="result-panel-solutions" role="tabpanel" aria-labelledby="result-tab-solutions" hidden={view !== 'solutions'}><CalculatorRecommendationsFlow niche={niche} /><button className="btn-primary calculator-result-next" onClick={() => setView('plan')}>Обсудить решение для моего бизнеса →</button></div>
      <div id="result-panel-plan" role="tabpanel" aria-labelledby="result-tab-plan" hidden={view !== 'plan'}>
        <CalculatorLeadGate
          niche={niche}
          nicheCustomText={nicheCustomText}
          inputs={inputs}
          result={result}
          onReturnToResult={scrollToTop}
        />
      </div>

      <div className="calculator-result-restart">
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
