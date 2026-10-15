import MasterIcon from './MasterIcon'

export default function HeroEditorialScene() {
  return <div className="master-hero-copy">
    <h1>Ваш рост<br />начинается<br />здесь<span>.</span></h1>
    <p>SIMBA создаёт стратегические бизнес-решения: превращаем процессы, данные и технологии в понятную систему роста.</p>
    <ul className="master-hero-benefits"><li><MasterIcon name="people" />Больше<br />клиентов</li><li><MasterIcon name="chart" />Больше<br />прибыли</li><li><MasterIcon name="leaf" />Больше<br />свободы</li></ul>
  </div>
}
