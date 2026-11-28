const CHECKLIST = [
  'Сколько заявок вы теряете',
  'Какую выручку недополучаете',
  'Где главные узкие места',
  'Что можно улучшить уже сейчас',
]

// Static content only — matches what CalculatorResult actually computes,
// no numbers invented here.
export default function CalculatorExplainerCard() {
  return (
    <aside className="public-v2-calc-shell__explainer" aria-label="Что покажет расчёт">
      <svg className="reference-explainer-icon" viewBox="0 0 56 64" fill="none" aria-hidden="true"><path d="M19 45C19 35 11 35 11 24a17 17 0 0 1 34 0c0 11-8 11-8 21Z" fill="#ffea91" /><path d="M22 47c0-13-9-12-9-23a15 15 0 0 1 30 0c0 11-9 10-9 23M22 48h12m-11 6h10m-8 5h6M28 46V28m-6-6 6 6 6-6M28 1V5M5 8l4 4M47 12l4-4M2 26h5m42 0h5M6 44l4-4m36 0 4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="public-v2-kicker">3 минуты до важных инсайтов</span>
      <h4>Уже на основе ваших ответов мы посчитаем:</h4>
      <ul>
        {CHECKLIST.map((item) => (
          <li key={item}>
            <i>✓</i>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <span className="reference-explainer-note reference-hand" aria-hidden="true">Маленькие ответы —<br />большие возможности!</span>
    </aside>
  )
}
