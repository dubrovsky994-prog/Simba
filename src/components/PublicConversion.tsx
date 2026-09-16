import { useEffect, useState } from 'react'
import LossCalculator from './LossCalculator'
import IdeaLeadMagnet from './IdeaLeadMagnet'

const fromHash = () => window.location.hash === '#idea' ? 'idea' : 'calculator'

export default function PublicConversion() {
  const [active, setActive] = useState(fromHash)
  useEffect(() => { const sync = () => setActive(fromHash()); window.addEventListener('hashchange', sync); return () => window.removeEventListener('hashchange', sync) }, [])
  useEffect(() => { const target = active === 'idea' ? 'idea' : 'business-audit'; requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }, [active])
  return <section className="public-v2-conversion" aria-label="Выбор следующего шага"><div className="container-px public-v2-conversion__switch"><button type="button" aria-pressed={active === 'calculator'} onClick={() => { window.location.hash = 'business-audit'; setActive('calculator') }}>Действующий бизнес</button><button type="button" aria-pressed={active === 'idea'} onClick={() => { window.location.hash = 'idea'; setActive('idea') }}>Есть идея?</button></div>{active === 'calculator' ? <LossCalculator /> : <IdeaLeadMagnet />}</section>
}
