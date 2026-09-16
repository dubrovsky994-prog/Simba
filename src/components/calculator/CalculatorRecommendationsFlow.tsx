import { useState } from 'react'
import { RECOMMENDATIONS_BY_NICHE } from '../../lib/calculator/recommendations'
import { recommendationBenefit, recommendationIcon } from '../../lib/calculator/recommendationCopy'
import type { NicheKey } from '../../lib/calculator/types'

type CalculatorRecommendationsFlowProps = {
  niche: NicheKey
}

function RecommendationRow({ niche, label }: { niche: NicheKey; label: string }) {
  const Icon = recommendationIcon(label)
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent-dark">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <span className="text-sm font-semibold text-text-main">{label}</span>
        <p className="mt-0.5 text-[13px] leading-relaxed text-text-muted">{recommendationBenefit(niche, label)}</p>
      </div>
    </div>
  )
}

export default function CalculatorRecommendationsFlow({ niche }: CalculatorRecommendationsFlowProps) {
  const [expanded, setExpanded] = useState(false)
  const items = RECOMMENDATIONS_BY_NICHE[niche]
  const primary = items.slice(0, 3)
  const rest = items.slice(3)

  return (
    <div>
      <h3 className="text-center text-lg font-bold text-text-main sm:text-left">Что стоит автоматизировать в первую очередь</h3>
      <div className="mt-5 flex flex-col gap-4">
        {primary.map((label) => (
          <RecommendationRow key={label} niche={niche} label={label} />
        ))}
        {expanded && rest.map((label) => <RecommendationRow key={label} niche={niche} label={label} />)}
      </div>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-sm font-semibold text-accent-dark underline underline-offset-2 hover:text-accent"
        >
          {expanded ? 'Показать меньше' : `Показать ещё ${rest.length}`}
        </button>
      )}
    </div>
  )
}
