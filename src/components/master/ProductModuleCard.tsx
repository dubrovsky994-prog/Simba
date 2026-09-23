import MasterIcon from './MasterIcon'

export default function ProductModuleCard({ kind, onOpen }: { kind: 'calculator' | 'beauty'; onOpen: () => void }) {
  const beauty = kind === 'beauty'
  return <article className={`master-product master-product--${kind}`}>
    <div className="master-product-label"><span><MasterIcon name={beauty ? 'flower' : 'calculator'} /></span>{beauty ? 'BEAUTY CORE' : 'КАЛЬКУЛЯТОР ВОЗМОЖНОСТЕЙ'}</div>
    <h2>{beauty ? <>Готовое решение<br />для бьюти-бизнеса</> : <>Найдите<br />скрытый потенциал</>}</h2>
    <p>{beauty ? <>Онлайн-запись, CRM, напоминания,<br />оплаты и аналитика — в одном решении.</> : <>Покажем, где вы теряете деньги<br />и как можно расти — за 5 минут.</>}</p>
    <button className="master-button" onClick={onOpen}>{beauty ? 'Посмотреть демо' : 'Рассчитать потенциал'}<MasterIcon name="arrow" /></button>
    {beauty ? <div className="master-tags"><span>Салоны</span><span>Косметологи</span><span>Мастера</span><span>Студии</span></div> : <small>Бесплатно · Без регистрации · Персональный результат</small>}
    {!beauty && <div className="master-product-mountain" aria-hidden="true"><span /><MasterIcon name="chart" /></div>}
  </article>
}
