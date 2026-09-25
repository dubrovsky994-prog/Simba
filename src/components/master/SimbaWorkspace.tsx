import SolutionsShowcase from '../SolutionsShowcase'
import NicheCases from '../NicheCases'
import LossCalculator from '../LossCalculator'
import SbaPreview from './SbaPreview'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, CONTACT_TELEGRAM, CONTACT_TELEGRAM_URL } from '../../legal/content'
import MasterIcon from './MasterIcon'
import type { WorkspaceState } from './navigation'
import type { BeautyDemoEntry } from '../../lib/beauty/demoBridge'

const TABS: { id: WorkspaceState; label: string }[] = [
  { id: 'solutions', label: 'Решения' }, { id: 'cases', label: 'Кейсы' }, { id: 'beauty', label: 'Beauty Core' }, { id: 'ai', label: 'SBA' }, { id: 'diagnostics', label: 'Диагностика' },
]
const WORKSPACE_TITLES: Record<WorkspaceState, [string, string]> = {
  home: ['Ваш рост начинается здесь.', ''],
  solutions: ['Инструменты вашего роста.', 'От первого обращения — до системы, которая помогает продавать.'],
  cases: ['Реальные проекты. Живые истории.', 'Посмотрите, как разные бизнесы выстраивают свою цифровую систему.'],
  beauty: ['Красивый бизнес начинается с порядка.', 'Beauty Core · онлайн-запись, клиентская база и расписание в одном месте.'],
  ai: ['Меньше рутины. Больше жизни.', 'SBA — Smart Business Assistant · powered by SIMBA AI'],
  diagnostics: ['Калькулятор возможностей', 'Найдите скрытый потенциал вашего бизнеса за несколько минут.'],
  library: ['Идеи, которые становятся системой.', 'Навигатор по возможностям SIMBA. Библиотека материалов готовится.'],
  pricing: ['Сначала задача. Затем решение.', 'Состав и стоимость системы определяются после знакомства с вашим бизнесом.'],
  about: ['Технологии, которые работают на людей.', 'SIMBA — цифровые системы продаж для малого и среднего бизнеса.'],
  contacts: ['Давайте создадим что-то большее.', 'Расскажите о задаче — найдём точку, с которой стоит начать.'],
}

function BeautyPreview({ onOpen }: { onOpen: (entry: BeautyDemoEntry) => void }) {
  return <div className="master-beauty-preview"><div className="master-beauty-intro"><span className="master-beauty-label"><MasterIcon name="flower" /> BEAUTY CORE</span><h2>Красивый бизнес начинается с порядка.</h2><p>Запись, клиенты, расписание и рост — в одном спокойном рабочем пространстве.</p><span className="master-demo-label">SIMBA Beauty · LIVE DEMO</span><button className="master-button" onClick={() => onOpen({ mode: 'site', section: 'home' })}>Попробовать Beauty Core<MasterIcon name="arrow" /></button><div className="master-beauty-entrypoints"><button onClick={() => onOpen({ mode: 'site', section: 'booking' })}>Как происходит запись?</button><button onClick={() => onOpen({ mode: 'admin', section: 'analytics' })}>Как управляет владелец?</button><button onClick={() => onOpen({ mode: 'master', section: 'calendar' })}>Рабочий день мастера</button><button onClick={() => onOpen({ mode: 'client' })}>Что видит клиент?</button></div></div><div className="master-beauty-product master-beauty-reference"><img src="/images/master/simba-beauty-reference-v1.png" alt="Интерфейс SIMBA Beauty: онлайн-запись, календарь, клиенты и аналитика" /><div className="master-beauty-reference__caption"><strong>SIMBA Beauty</strong><span>Онлайн-запись · календарь · клиенты · аналитика</span></div></div></div>
}

export default function SimbaWorkspace({ active, visited, onSelect, onBeauty, onLead, onIdea }: { active: WorkspaceState; visited: WorkspaceState[]; onSelect: (state: WorkspaceState) => void; onBeauty: (entry: BeautyDemoEntry) => void; onLead: () => void; onIdea: () => void }) {
  return <section className="master-workspace" hidden={active === 'home'} aria-label="Рабочее пространство SIMBA">
    <header className="master-workspace-heading"><span className="master-eyebrow">SIMBA / ВАШЕ ПРОСТРАНСТВО РОСТА</span><h1>{WORKSPACE_TITLES[active][0]}</h1><p>{WORKSPACE_TITLES[active][1]}</p></header>
    <div className="master-workspace-tabs" role="tablist" aria-label="Разделы рабочего пространства">{TABS.map(tab => <button key={tab.id} id={`master-tab-${tab.id}`} role="tab" aria-selected={active === tab.id} aria-controls={`master-panel-${tab.id}`} onClick={() => onSelect(tab.id)}>{tab.label}</button>)}<span>ОДНО ПРОСТРАНСТВО. БОЛЬШЕ ВОЗМОЖНОСТЕЙ.</span></div>
    <div className="master-workspace-panels">
      {TABS.filter(tab => visited.includes(tab.id)).map(tab => <div key={tab.id} id={`master-panel-${tab.id}`} className={`master-workspace-panel master-panel--${tab.id}`} role="tabpanel" aria-labelledby={`master-tab-${tab.id}`} hidden={active !== tab.id} tabIndex={0}>
        {tab.id === 'solutions' && <SolutionsShowcase />}
        {tab.id === 'cases' && <NicheCases />}
        {tab.id === 'beauty' && <BeautyPreview onOpen={onBeauty} />}
        {tab.id === 'ai' && <SbaPreview onSelect={onSelect} />}
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
