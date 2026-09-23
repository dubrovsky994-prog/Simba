import MasterIcon from './MasterIcon'

export default function HeroEditorialScene() {
  return <div className="master-hero-copy">
    <h1>Ваш рост<br />начинается<br />здесь<span>.</span></h1>
    <p>SIMBA помогает бизнесу любого масштаба превращать хаос в систему — с помощью проверенных решений, команды экспертов и умных цифровых инструментов.</p>
    <ul className="master-hero-benefits"><li><MasterIcon name="people" />Больше<br />клиентов</li><li><MasterIcon name="chart" />Больше<br />прибыли</li><li><MasterIcon name="leaf" />Больше<br />свободы</li></ul>
  </div>
}
