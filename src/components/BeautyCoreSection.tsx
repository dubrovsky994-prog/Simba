import { useState } from 'react'
import BeautyCoreDemo from './BeautyCoreDemo'
import BeautyWidgetPreview from './beauty/BeautyWidgetPreview'

// Standalone section — Beauty Core is no longer tucked inside a tab of the
// (now unmounted) PublicAiSection scene. Same existing demo trigger/modal,
// just reached from its own compact block instead of a tab pane.
export default function BeautyCoreSection() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  return (
    <section className="public-v2-beauty-core" aria-labelledby="beauty-core-title">
      <div className="container-px public-v2-beauty-core__grid">
        <div>
          <p className="public-v2-kicker">SIMBA Beauty</p>
          <h2 id="beauty-core-title">Beauty Core для индустрии красоты</h2>
          <p className="public-v2-beauty-core__copy">
            Готовое решение для салонов, студий и мастеров. Онлайн-запись, CRM, напоминания и аналитика — всё в
            одном месте.
          </p>
          <span className="public-v2-note public-v2-note--rotate-right">Красота тоже любит порядок.</span>
          <div style={{ marginTop: 18 }}>
            <button type="button" className="public-v2-button" onClick={() => setIsDemoOpen(true)}>
              Открыть демо <span>↗</span>
            </button>
          </div>
        </div>

        <BeautyWidgetPreview />
      </div>

      {isDemoOpen && <BeautyCoreDemo onClose={() => setIsDemoOpen(false)} />}
    </section>
  )
}
