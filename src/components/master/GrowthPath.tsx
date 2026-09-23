import { useState } from 'react'
import MasterIcon from './MasterIcon'

const STEPS = [
  { title: 'Текущая ситуация', lines: ['Хаос и рутина', 'Потеря заявок', 'Нет системы'], detail: 'Начинаем с диагностики: где теряются заявки, деньги и время.' },
  { title: 'Делаем структуру', lines: ['Автоматизация', 'CRM и воронка', 'Контроль процессов'], detail: 'Связываем обращения, задачи и клиентскую базу в понятный процесс.' },
  { title: 'Растут продажи', lines: ['Больше клиентов', 'Выше средний чек', 'Стабильная загрузка'], detail: 'Настраиваем повторные обращения и проверяем результат на данных бизнеса.' },
  { title: 'Масштаб', lines: ['Сеть или новые услуги', 'Уверенность в процессах', 'Свободное время'], detail: 'Расширяем работающую систему по мере готовности вашего бизнеса.' },
]

export default function GrowthPath({ onExplore }: { onExplore: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  return <section className="master-growth" aria-labelledby="master-growth-title">
    <div className="master-growth-heading"><div><h2 id="master-growth-title">Путь к росту</h2><p>От текущей ситуации — к системному бизнесу. Мы рядом на каждом этапе.</p></div><button onClick={onExplore}>Смотреть все этапы <MasterIcon name="arrow" /></button></div>
    <div className="master-growth-route"><svg className="master-route-line" viewBox="0 0 1100 150" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120C140 180 190 80 265 102S370 154 470 106 560 80 633 96 708 130 802 91 941 59 1100 20" /><path d="M0 126C140 186 190 86 265 108S370 160 470 112 560 86 633 102 708 136 802 97 941 65 1100 26" /></svg>
      {STEPS.map((step, index) => <button className="master-growth-step" key={step.title} aria-pressed={selected === index} onClick={() => setSelected(selected === index ? null : index)}><b>0{index + 1}</b><span><strong>{step.title}</strong>{selected === index ? <em>{step.detail}</em> : step.lines.map(line => <small key={line}>{line}</small>)}</span></button>)}
      <button className="master-growth-finish" onClick={onExplore}><MasterIcon name="flag" /><span>Ваш<br />новый уровень</span></button>
    </div>
    <div className="master-outcomes" aria-label="Что даёт системный подход"><div><MasterIcon name="clock" /><span><strong>Меньше рутины</strong><small>Автоматизация<br />повторяющихся задач</small></span></div><div><MasterIcon name="people" /><span><strong>Ближе к клиенту</strong><small>История обращений<br />в одной системе</small></span></div><div><MasterIcon name="chart" /><span><strong>Понятнее рост</strong><small>Заявки и продажи<br />под вашим контролем</small></span></div><div><MasterIcon name="diamond" /><span><strong>Больше свободы</strong><small>Время на развитие,<br />а не на рутину</small></span></div></div>
    <span className="master-finish-note">Больше,<br />чем просто сайт.<br />Это система.</span>
  </section>
}
