import { useEffect, useState } from 'react'
import type { ProjectCase } from '../NicheCases'

type CaseCarouselProps = {
  cases: ProjectCase[]
  activeId: string
  onSelect: (id: string) => void
  onOpenCase: () => void
  onOpenAll: () => void
  intervalMs?: number
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

// Compact single-case stage only — no permanently-visible detail panel.
// "Открыть кейс"/"Все проекты" open CaseDetailOverlay (see NicheCases.tsx).
export default function CaseCarousel({ cases, activeId, onSelect, onOpenCase, onOpenAll, intervalMs = 5000 }: CaseCarouselProps) {
  const [paused, setPaused] = useState(false)
  const activeIndex = Math.max(0, cases.findIndex((c) => c.id === activeId))
  const active = cases[activeIndex] ?? cases[0]
  const cover = active?.screenshots[0]

  useEffect(() => {
    if (paused || prefersReducedMotion() || cases.length <= 1) return
    const timer = window.setInterval(() => {
      const next = cases[(activeIndex + 1) % cases.length]
      onSelect(next.id)
    }, intervalMs)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, paused, cases, intervalMs])

  if (!active) return null

  const goTo = (delta: number) => {
    const next = cases[(activeIndex + delta + cases.length) % cases.length]
    onSelect(next.id)
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="public-v2-case-carousel__stage" aria-roledescription="carousel" aria-label="Кейсы клиентов">
        {cases.length > 1 && (
          <>
            <button type="button" className="public-v2-case-carousel__nav public-v2-case-carousel__nav--prev" onClick={() => goTo(-1)} aria-label="Предыдущий кейс">←</button>
            <button type="button" className="public-v2-case-carousel__nav public-v2-case-carousel__nav--next" onClick={() => goTo(1)} aria-label="Следующий кейс">→</button>
          </>
        )}
        <div className="public-v2-case-carousel__stage-inner">
          <div className="public-v2-case-carousel__image">
            {cover && <img src={cover.src} alt={cover.alt} />}
          </div>
          <div className="public-v2-case-carousel__body">
            <span className="public-v2-case-carousel__counter">
              {String(activeIndex + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
            </span>
            <span className="public-v2-case-carousel__tag">{active.category} · {active.tag}</span>
            <h3>{active.title}</h3>
            <p>{active.shortText}</p>
            <div className="public-v2-case-carousel__actions">
              <button type="button" className="public-v2-button" onClick={onOpenCase}>
                Открыть кейс <span>→</span>
              </button>
              <button type="button" className="public-v2-button public-v2-button--quiet" onClick={onOpenAll}>
                Все проекты
              </button>
            </div>
          </div>
        </div>

        {cases.length > 1 && (
          <div className="public-v2-case-carousel__thumbs">
            {cases.map((c) => (
              <button key={c.id} type="button" aria-current={c.id === activeId} aria-label={c.title} onClick={() => onSelect(c.id)}>
                {c.screenshots[0] && <img src={c.screenshots[0].src} alt="" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
