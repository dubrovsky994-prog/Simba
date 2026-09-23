import { useState } from 'react'
import SolutionsShowcase from '../SolutionsShowcase'
import NicheCases from '../NicheCases'
import LossCalculator from '../LossCalculator'
import BeautyWidgetPreview from '../beauty/BeautyWidgetPreview'
import PaperMorphAvatar, { type PaperMorphState } from '../avatar/PaperMorphAvatar'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, CONTACT_TELEGRAM, CONTACT_TELEGRAM_URL } from '../../legal/content'
import MasterIcon from './MasterIcon'
import type { WorkspaceState } from './navigation'

const TABS: { id: WorkspaceState; label: string }[] = [
  { id: 'solutions', label: 'Решения' }, { id: 'cases', label: 'Кейсы' }, { id: 'beauty', label: 'Beauty Core' }, { id: 'ai', label: 'SIMBA AI' }, { id: 'diagnostics', label: 'Диагностика' },
]
const WORKSPACE_TITLES: Record<WorkspaceState, [string, string]> = {
  home: ['Ваш рост начинается здесь.', ''],
  solutions: ['Инструменты вашего роста.', 'От первого обращения — до системы, которая помогает продавать.'],
  cases: ['Реальные проекты. Живые истории.', 'Посмотрите, как разные бизнесы выстраивают свою цифровую систему.'],
  beauty: ['Красивый бизнес начинается с порядка.', 'Beauty Core · онлайн-запись, клиентская база и расписание в одном месте.'],
  ai: ['Меньше рутины. Больше жизни.', 'SIMBA AI · визуальная концепция помощника для вашего бизнеса.'],
  diagnostics: ['Найдите скрытый потенциал.', 'Восемь вопросов о вашем бизнесе. Реальный расчёт на основе ваших ответов.'],
  library: ['Идеи, которые становятся системой.', 'Навигатор по возможностям SIMBA. Библиотека материалов готовится.'],
  pricing: ['Сначала задача. Затем решение.', 'Состав и стоимость системы определяются после знакомства с вашим бизнесом.'],
  about: ['Технологии, которые работают на людей.', 'SIMBA — цифровые системы продаж для малого и среднего бизнеса.'],
  contacts: ['Давайте создадим что-то большее.', 'Расскажите о задаче — найдём точку, с которой стоит начать.'],
}

function AiPreview() {
  const [appearance, setAppearance] = useState<PaperMorphState>('idle')
  return <div className="master-ai-preview"><div className="master-ai-orbit"><PaperMorphAvatar size={300} state={appearance} /><span>SIMBA AI / DEMO</span></div><div><span className="master-eyebrow">ПРЕЗЕНТАЦИЯ ВОЗМОЖНОСТЕЙ</span><h2>SIMBA следит за рутиной.<br />Вы подключаетесь только там,<br />где нужен человек.</h2><ul>{['Собирает заявки', 'Напоминает клиентам', 'Показывает потери', 'Предлагает следующий шаг'].map(text => <li key={text}><MasterIcon name="ai" />{text}</li>)}</ul><div className="master-ai-states" aria-label="Состояния аватара">{(['idle', 'listening', 'thinking', 'answering'] as const).map((state, i) => <button key={state} aria-pressed={appearance === state} onClick={() => setAppearance(state)}>{['Рядом', 'Слушает', 'Думает', 'Отвечает'][i]}</button>)}</div><small>Демонстрация интерфейса. Подключение к данным и автоматические действия здесь не реализованы.</small></div></div>
}

function BeautyPreview({ onOpen }: { onOpen: () => void }) {
  return <div className="master-beauty-preview"><div className="master-beauty-intro"><span className="master-beauty-label"><MasterIcon name="flower" /> BEAUTY CORE</span><h2>Всё важное.<br />В одном месте.</h2><p>Записи, услуги и клиенты — в понятном рабочем пространстве.</p><span className="master-demo-label">Демонстрационные данные</span><button className="master-button" onClick={onOpen}>Открыть демо<MasterIcon name="arrow" /></button></div><div className="master-beauty-product"><div className="master-beauty-rail"><strong>Beauty Core</strong><span>Записи</span><span>Клиенты</span><span>Услуги</span><span>Аналитика</span></div><BeautyWidgetPreview /></div></div>
}

export default function SimbaWorkspace({ active, visited, onSelect, onBeauty, onLead, onIdea }: { active: WorkspaceState; visited: WorkspaceState[]; onSelect: (state: WorkspaceState) => void; onBeauty: () => void; onLead: () => void; onIdea: () => void }) {
  return <section className="master-workspace" hidden={active === 'home'} aria-label="Рабочее пространство SIMBA">
    <header className="master-workspace-heading"><span className="master-eyebrow">SIMBA / ВАШЕ ПРОСТРАНСТВО РОСТА</span><h1>{WORKSPACE_TITLES[active][0]}</h1><p>{WORKSPACE_TITLES[active][1]}</p></header>
    <div className="master-workspace-tabs" role="tablist" aria-label="Разделы рабочего пространства">{TABS.map(tab => <button key={tab.id} id={`master-tab-${tab.id}`} role="tab" aria-selected={active === tab.id} aria-controls={`master-panel-${tab.id}`} onClick={() => onSelect(tab.id)}>{tab.label}</button>)}<span>ОДНО ПРОСТРАНСТВО. БОЛЬШЕ ВОЗМОЖНОСТЕЙ.</span></div>
    <div className="master-workspace-panels">
      {TABS.filter(tab => visited.includes(tab.id)).map(tab => <div key={tab.id} id={`master-panel-${tab.id}`} className={`master-workspace-panel master-panel--${tab.id}`} role="tabpanel" aria-labelledby={`master-tab-${tab.id}`} hidden={active !== tab.id} tabIndex={0}>
        {tab.id === 'solutions' && <SolutionsShowcase />}
        {tab.id === 'cases' && <NicheCases />}
        {tab.id === 'beauty' && <BeautyPreview onOpen={onBeauty} />}
        {tab.id === 'ai' && <AiPreview />}
        {tab.id === 'diagnostics' && <LossCalculator />}
      </div>)}
      {['library', 'pricing', 'about', 'contacts'].includes(active) && <div className="master-info-panel">
        {active === 'library' && <><MasterIcon name="book" /><h2>С чего начинается ваша идея?</h2><p>Выберите задачу: найти подходящее решение, изучить реальный кейс или собрать структуру будущего продукта.</p><div className="master-info-actions"><button onClick={() => onSelect('solutions')}>Подобрать решение →</button><button onClick={() => onSelect('cases')}>Посмотреть проекты →</button><button onClick={onIdea}>Разобрать идею →</button></div><small>Раздел статей пока не опубликован. Здесь доступны существующие инструменты и проекты.</small></>}
        {active === 'pricing' && <><MasterIcon name="chart" /><h2>Не пакет ради пакета.<br />Система под вашу задачу.</h2><p>Объём работ, интеграции и этапы запуска обсуждаются индивидуально. Фиксированные тарифы пока не опубликованы.</p><button className="master-button" onClick={onLead}>Обсудить задачу<MasterIcon name="arrow" /></button></>}
        {active === 'about' && <><MasterIcon name="leaf" /><h2>Больше клиентов.<br />Больше свободы. Больше жизни.</h2><p>Сайты, боты, CRM и автоматизация связываются в понятный процесс — от первого обращения до повторной продажи.</p><button className="master-button" onClick={() => onSelect('cases')}>Наши проекты<MasterIcon name="arrow" /></button></>}
        {active === 'contacts' && <><MasterIcon name="mail" /><h2>На связи с вашим бизнесом.</h2><div className="master-contact-links"><a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><a href={CONTACT_TELEGRAM_URL}>{CONTACT_TELEGRAM}</a></div><button className="master-button" onClick={onLead}>Оставить заявку<MasterIcon name="arrow" /></button></>}
      </div>}
    </div>
  </section>
}
