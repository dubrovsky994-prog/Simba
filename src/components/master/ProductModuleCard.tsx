import MasterIcon from './MasterIcon'
import { BEAUTY_DEMO_URL } from '../../lib/beauty/demoBridge'
import { trackBeautyEvent } from '../../lib/beauty/analytics'

export default function ProductModuleCard({ kind, onOpen }: { kind: 'calculator' | 'beauty'; onOpen: () => void }) {
  const beauty = kind === 'beauty'
  return <article className={`master-product master-product--${kind}`}>
    <div className="master-product-label"><span><MasterIcon name={beauty ? 'flower' : 'calculator'} /></span>{beauty ? 'BEAUTY CORE · ЖИВОЕ ОТРАСЛЕВОЕ ЯДРО' : 'КАЛЬКУЛЯТОР ВОЗМОЖНОСТЕЙ'}</div>
    <h2>{beauty ? <>LUMI Beauty Studio</> : <>Найдите<br />скрытый потенциал</>}</h2>
    <p>{beauty ? <>Записи сегодня · ближайший визит · клиенты<br /><b>LIVE</b> · настоящий продукт внутри SIMBA.</> : <>Покажем, где вы теряете деньги<br />и как можно расти — за 5 минут.</>}</p>
    <button className="master-button" onClick={onOpen}>{beauty ? 'Попробовать Beauty Core' : 'Рассчитать потенциал'}<MasterIcon name="arrow" /></button>
    {beauty ? <><div className="master-tags"><span>Сайт</span><span>Администратор</span><span>Мастер</span><span>Клиент</span></div><a className="master-beauty-full-link" href={BEAUTY_DEMO_URL || undefined} target="_blank" rel="noopener noreferrer" onClick={() => trackBeautyEvent('beauty_demo_full_opened', { source: 'home_card' })}>Открыть полный проект ↗</a></> : <small>Бесплатно · Без регистрации · Персональный результат</small>}
    {!beauty && <div className="master-product-mountain" aria-hidden="true"><span /><MasterIcon name="chart" /></div>}
  </article>
}
