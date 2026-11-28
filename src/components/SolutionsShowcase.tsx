import { useState } from 'react'

const SOLUTIONS = [
  { id: 'site', label: 'Сайт', title: 'Сайт', text: 'Современный сайт, который приводит клиентов и превращает интерес в понятную заявку.', points: ['Привлекает больше клиентов', 'Интегрирован с CRM и мессенджерами', 'Легко редактировать'], accent: 'cyan' },
  { id: 'crm', label: 'CRM', title: 'CRM', text: 'Единая история клиента, заявок и задач — без таблиц и потерянных диалогов.', points: ['Все обращения в одном месте', 'Понятные статусы и задачи', 'Основа повторных продаж'], accent: 'blue' },
  { id: 'bot', label: 'Бот', title: 'Бот', text: 'Отвечает и ведёт клиента в привычном для него мессенджере.', points: ['На связи 24/7', 'Собирает готовый бриф', 'Передаёт заявку команде'], accent: 'purple' },
  { id: 'ai', label: 'SBA', title: 'SBA', text: 'Smart Business Assistant знает контекст бизнеса и помогает команде действовать быстрее.', points: ['Подсказывает следующий шаг', 'Помнит историю клиента', 'Не теряет детали'], accent: 'violet' },
  { id: 'flow', label: 'Автоматизация', title: 'Автоматизация', text: 'Рутинные действия проходят сами, а у команды остаётся время на продажи.', points: ['Меньше ручных операций', 'Связь сервисов и CRM', 'Прозрачный процесс'], accent: 'mint' },
] as const

export default function SolutionsShowcase() {
  const [activeId, setActiveId] = useState<(typeof SOLUTIONS)[number]['id']>('site')
  const active = SOLUTIONS.find((item) => item.id === activeId) ?? SOLUTIONS[0]
  return <section id="solutions" className="public-v2-solutions"><div className="container-px public-v2-solutions__grid"><div className="public-v2-solutions__intro"><p className="public-v2-kicker">Наши решения</p><h2>Всё для роста<br />вашего бизнеса</h2><p>Единая экосистема решений, которая привлекает клиентов, автоматизирует продажи и освобождает ваше время.</p><span className="public-v2-note">Технологии, которые работают на людей.</span></div><div className="public-v2-solutions__tabs" role="tablist" aria-label="Решения SIMBA">{SOLUTIONS.map((item, index) => <button key={item.id} role="tab" aria-selected={active.id === item.id} onClick={() => setActiveId(item.id)}><i>{['◉','◌','▣','✦','⌘'][index]}</i>{item.label}<b>›</b></button>)}</div><article className={`public-v2-solution-card public-v2-solution-card--${active.accent}`}><div><p className="public-v2-kicker">Цифровая система</p><h3>{active.title}</h3><p>{active.text}</p><ul>{active.points.map((point) => <li key={point}>✓ {point}</li>)}</ul><button type="button" className="public-v2-button public-v2-button--quiet">Подробнее <b>→</b></button></div><div className="public-v2-solution-card__mock" aria-hidden="true"><span>SIMBA / {active.title.toUpperCase()}</span><strong>Красота<br />начинается<br />здесь</strong><i /><b /></div></article></div></section>
}
