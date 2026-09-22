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
    </aside>
  )
}
