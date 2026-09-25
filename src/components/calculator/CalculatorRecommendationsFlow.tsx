import { useState } from 'react'
import { RECOMMENDATIONS_BY_NICHE } from '../../lib/calculator/recommendations'
import { recommendationBenefit, recommendationIcon } from '../../lib/calculator/recommendationCopy'
import type { NicheKey } from '../../lib/calculator/types'
import { RECOMMENDATION_EDITORIAL } from './recommendationEditorial'

type CalculatorRecommendationsFlowProps = {
  niche: NicheKey
}

function RecommendationRow({ niche, label }: { niche: NicheKey; label: string }) {
  const Icon = recommendationIcon(label)
  const story = RECOMMENDATION_EDITORIAL[label]
  return (
    <article className="calculator-pain-card">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent-dark">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <span className="calculator-solution-label">{label}</span>
        <h4>{story?.pain ?? label}</h4>
        <p>{story?.help ?? recommendationBenefit(niche, label)}</p>
        {story && <strong className="calculator-pain-outcome">{story.outcome}</strong>}
      </div>
    </article>
  )
}

export default function CalculatorRecommendationsFlow({ niche }: CalculatorRecommendationsFlowProps) {
  const [expanded, setExpanded] = useState(false)
  const items = RECOMMENDATIONS_BY_NICHE[niche]
  const primary = items.slice(0, 3)
  const rest = items.slice(3)

  return (
    <div className="calculator-pain-solutions">
      <h3>Меньше ежедневных «надо». Больше времени на своё дело.</h3>
      <p className="calculator-pain-intro">Вот как можно закрыть знакомые вашей сфере боли. Выберем подходящее вместе — без внедрения всего и сразу.</p>
      <div className="calculator-pain-grid">
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
          {expanded ? 'Свернуть дополнительные идеи' : `Ещё ${rest.length} идеи для вашего бизнеса`}
        </button>
      )}
    </div>
  )
}
