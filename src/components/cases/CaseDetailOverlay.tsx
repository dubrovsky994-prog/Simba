import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IconCheckSmall, IconClose } from '../icons'
import CaseGallery from '../CaseGallery'
import type { ProjectCase } from '../NicheCases'

type CaseDetailOverlayProps = {
  cases: ProjectCase[]
  activeId: string
  onSelect: (id: string) => void
  onClose: () => void
}

// Reuses the existing case-detail content (previously always inline under the
// tab grid) — just relocated into an on-demand overlay so the page itself
// stays compact. Opened either pre-selected to one featured case ("Открыть
// кейс") or in browse-all mode across every real case ("Все проекты").
export default function CaseDetailOverlay({ cases, activeId, onSelect, onClose }: CaseDetailOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const active = cases.find((c) => c.id === activeId) ?? cases[0]
  if (!active) return null

  return createPortal(
    <div
      className="public-v2-case-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="public-v2-case-detail-overlay__panel">
        <button type="button" onClick={onClose} aria-label="Закрыть" className="public-v2-case-detail-overlay__close">
          <IconClose className="h-4 w-4" />
        </button>

        {cases.length > 1 && (
          <div className="public-v2-case-detail-overlay__switcher" role="tablist" aria-label="Все проекты">
            {cases.map((c) => (
              <button key={c.id} type="button" role="tab" aria-pressed={c.id === active.id} aria-selected={c.id === active.id} onClick={() => onSelect(c.id)}>
                {c.title}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {active.category} · {active.tag}
            </span>

            <h3 className="mt-5 text-2xl font-bold leading-tight text-text-main sm:text-3xl">{active.title}</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Контекст</h4>
                <p className="mt-2 text-base font-medium text-accent-dark">{active.shortText}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Что изменилось</h4>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{active.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Что сделали</h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {active.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-main">
                    <IconCheckSmall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CaseGallery screenshots={active.screenshots} resetKey={active.id} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
