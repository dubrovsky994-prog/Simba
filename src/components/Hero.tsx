import PaperMorphAvatar from './avatar/PaperMorphAvatar'

const CHIPS = ['8 вопросов', '1–2 минуты', 'без сложных терминов']

function scrollToCalculator() {
  document.getElementById('business-audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Hero() {
  return <section className="public-v2-hero">
    <div className="public-v2-hero__paper" aria-hidden="true" /><div className="public-v2-hero__paper public-v2-hero__paper--back" aria-hidden="true" /><div className="public-v2-hero__mountain" aria-hidden="true" /><div className="public-v2-hero__marker" aria-hidden="true" />
    <div className="container-px public-v2-hero__grid">
      <div className="public-v2-hero__copy">
        <p className="public-v2-kicker">Калькулятор потерь</p>
        <h1>Посчитайте, сколько заявок<br /><span>и денег вы теряете</span></h1>
        <p className="public-v2-hero__lead">Ответьте на несколько вопросов о заявках, заказах и клиентах — и получите разбор, где именно бизнес теряет деньги.</p>
        <div className="public-v2-hero__chips" role="list" aria-label="Как устроен расчёт">
          {CHIPS.map((chip) => <span key={chip} role="listitem">{chip}</span>)}
        </div>
        <span className="public-v2-note public-v2-note--rotate-left">Цифры не врут — они показывают, где растёт ваш бизнес.</span>
      </div>
      <div className="public-v2-hero__visual">
        <span className="public-v2-note public-v2-note--rotate-right public-v2-hero__visual-note">Больше заявок. Больше свободы.</span>
        <span className="public-v2-hero__route" aria-hidden="true"><i /><b /></span>
        <div className="public-v2-hero__fragment public-v2-hero__fragment--1" aria-hidden="true" />
        <div className="public-v2-hero__fragment public-v2-hero__fragment--2" aria-hidden="true" />
        <div className="public-v2-hero__fragment public-v2-hero__fragment--3" aria-hidden="true" />
        <PaperMorphAvatar state="idle" size={512} onActivate={scrollToCalculator} className="cursor-pointer" />
      </div>
    </div>
  </section>
}
