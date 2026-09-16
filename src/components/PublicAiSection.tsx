import { useState } from 'react'
import PaperMorphAvatar from './avatar/PaperMorphAvatar'
import BeautyCoreDemo from './BeautyCoreDemo'

const STATES = [
  { id: 'ai', label: 'AI-администратор', kicker: 'SIMBA AI', title: <>Не чат.<br /><span>AI-администратор</span><br />бизнеса.</>, copy: 'Видит важные сигналы, показывает где теряются возможности, предлагает следующий шаг и помогает контролировать выполнение.', flow: ['Сигнал', 'Анализ', 'Рекомендация', 'Действие', 'Контроль'] },
  { id: 'systems', label: 'Systems', kicker: 'SIMBA Systems', title: <>Заявка становится<br /><span>понятным</span><br />маршрутом.</>, copy: 'Собирает путь клиента от первого обращения до повторной продажи без лишних переключений между сервисами.', flow: ['Заявка', 'Клиент', 'Продажа', 'Повторное обращение'] },
  { id: 'beauty', label: 'Beauty', kicker: 'SIMBA Beauty', title: <>Вертикальный контур<br /><span>для</span><br />Beauty.</>, copy: 'Запись, карточка клиента, напоминание и возврат остаются в одном понятном публичном сценарии.', flow: ['Запись', 'Клиент', 'Напоминание', 'Возврат', 'Аналитика'] },
  { id: 'partner', label: 'Partner', kicker: 'SIMBA Partner', title: <>Начать с малого.<br /><span>Проверить.</span><br />Расширять.</>, copy: 'Сначала выбираем небольшой работающий шаг, затем проверяем его эффект и только потом добавляем систему.', flow: ['Начать', 'Проверить результат', 'Расширять'] },
]

export default function PublicAiSection() {
  const [activeId, setActiveId] = useState('ai')
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const active = STATES.find((state) => state.id === activeId) ?? STATES[0]
  return <section id="public-simba-ai" className="public-v2-ai-section" aria-labelledby="public-ai-title"><div className="container-px"><div className="public-v2-ecosystem__head"><p className="public-v2-kicker">SIMBA ecosystem</p><h2 id="public-ai-title">Один SIMBA.<br /><span>Разные роли.</span></h2></div><div className="public-v2-ecosystem__tabs" role="tablist" aria-label="Роли SIMBA">{STATES.map((state) => <button key={state.id} type="button" role="tab" aria-selected={active.id === state.id} onClick={() => setActiveId(state.id)}>{state.label}</button>)}</div><div key={active.id} className="public-v2-ai-section__grid case-fade-in"><div><p className="public-v2-kicker">{active.kicker}</p><h3>{active.title}</h3><p className="public-v2-ai-section__copy">{active.copy}</p><div className="public-v2-ai-section__flow" aria-label={`Сценарий ${active.label}`}>{active.flow.map((item, index) => <span key={item}>{item}{index < active.flow.length - 1 && <i aria-hidden="true">→</i>}</span>)}</div>{active.id === 'beauty' && <button type="button" onClick={() => setIsDemoOpen(true)} className="public-v2-button mt-6">Открыть Beauty demo <span>↗</span></button>}</div><div className={`public-v2-ai-section__avatar is-${active.id}`}><span>{active.kicker} <i /> в контуре</span>{active.id === 'ai' ? <PaperMorphAvatar state="idle" size={420} /> : <strong>{active.flow.map((item, index) => <b key={item}>{item}{index < active.flow.length - 1 && <i>→</i>}</b>)}</strong>}</div></div></div>{isDemoOpen && <BeautyCoreDemo onClose={() => setIsDemoOpen(false)} />}</section>
}
