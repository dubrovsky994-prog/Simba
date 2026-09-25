import { formatMoney, formatNumber } from '../../lib/calculator/format'
import { monthlyManualHours } from '../../lib/calculator/calculate'
import type { CalculationInputs, CalculationResult } from '../../lib/calculator/types'

type CalculatorFinalInsightsProps = {
  inputs: CalculationInputs
  result: CalculationResult
}

// SBA's own three-line reveal (spec item 12) — a short personal read of the
// business, shown above the fuller breakdown that already exists below it.
export default function CalculatorFinalInsights({ inputs, result }: CalculatorFinalInsightsProps) {
  const missedCount = inputs.inquiries * (inputs.missedRate / 100)
  const monthlyHours = monthlyManualHours(inputs.manualHours)

  const rows = [
    { label: 'Заявки', text: `Потенциально теряется ${formatNumber(missedCount)} обращений.` },
    { label: 'Деньги', text: `Потенциальная недополученная выручка ≈ ${formatMoney(result.cashLoss)}.` },
    { label: 'Время', text: `На повторяющиеся действия уходит ≈ ${formatNumber(monthlyHours)} часов.` },
  ]

  return (
    <div className="calc-final-insights">
      <span className="public-v2-kicker">SBA</span>
      <h3>Готово. Вот что я вижу в вашем бизнесе.</h3>
      <ul>
        {rows.map((row) => (
          <li key={row.label}>
            <strong>{row.label}</strong>
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
