import { useEffect, useState } from 'react'
import BeautyCoreDemo from './BeautyCoreDemo'
import PaperMorphAvatar from './avatar/PaperMorphAvatar'

export default function Hero() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [beautyDemoOpen, setBeautyDemoOpen] = useState(false)
  useEffect(() => {
    if (!assistantOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setAssistantOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [assistantOpen])

  return <section id="top" className="public-v2-hero">
    <div className="public-v2-hero__paper" aria-hidden="true" /><div className="public-v2-hero__mountain" aria-hidden="true" /><div className="public-v2-hero__marker" aria-hidden="true" />
    <div className="container-px public-v2-hero__grid">
      <div className="public-v2-hero__copy"><p className="public-v2-kicker">SIMBA / ЦИФРОВОЙ КОНТУР РОСТА</p><h1>Клиенты не теряются.<br /><span>Бизнес растёт.</span></h1><p className="public-v2-hero__lead">Проверьте, где бизнес теряет клиентов, время и деньги.</p><div className="public-v2-hero__actions"><a href="#business-audit" className="public-v2-button">Посчитать потери</a><a href="#idea" className="public-v2-button public-v2-button--quiet">Есть идея?</a></div><p className="public-v2-hero__note">не больше инструментов — больше ясности</p>
      </div>
      <aside id="simba-ai" className="public-v2-hero__ai"><div className="public-v2-hero__ai-paper" aria-hidden="true" /><div className="public-v2-hero__avatar"><span>SIMBA AI <i /> рядом</span><PaperMorphAvatar state={assistantOpen ? 'listening' : 'idle'} size={392} onActivate={() => setAssistantOpen((value) => !value)} className="cursor-pointer" /></div><p>AI-администратор для бизнеса.<br />Не чат. Следующий шаг.</p><button type="button" onClick={() => setAssistantOpen((value) => !value)} aria-expanded={assistantOpen} aria-controls="simba-assistant-panel" className="public-v2-hero__ai-button">{assistantOpen ? 'Свернуть SIMBA AI' : 'Спросить SIMBA AI'} <span>{assistantOpen ? '−' : '↗'}</span></button>
        {assistantOpen && <div id="simba-assistant-panel" role="region" aria-label="Быстрые действия SIMBA AI" className="public-v2-ai-panel"><p>Посмотрите, как отдельный вертикальный сценарий SIMBA выглядит для Beauty.</p><button type="button" onClick={() => { setAssistantOpen(false); setBeautyDemoOpen(true) }}>Открыть Beauty Core <span>→</span></button></div>}
      </aside>
    </div>
    {beautyDemoOpen && <BeautyCoreDemo onClose={() => setBeautyDemoOpen(false)} />}
  </section>
}
