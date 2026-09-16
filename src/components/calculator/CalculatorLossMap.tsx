import { formatMoney } from '../../lib/calculator/format'
import type { CalculationResult } from '../../lib/calculator/types'

type Row = { key: string; label: string; explain: string; amount: number; color: string }

function buildRows(result: CalculationResult): Row[] {
  return [
    {
      key: 'lostLeads',
      label: 'Не успели ответить',
      explain: 'Потенциальные клиенты, которые могли уйти к конкурентам',
      amount: result.lostLeads,
      color: 'var(--accent)',
    },
    {
      key: 'cancellationLoss',
      label: 'Не завершили заказ',
      explain: 'Клиенты, которые начали оформление, но не дошли до покупки',
      amount: result.cancellationLoss,
      color: '#6D6FA0',
    },
    {
      key: 'manualCost',
      label: 'Ручная работа',
      explain: 'Ориентировочная стоимость времени на ответы, согласования и напоминания',
      amount: result.manualCost,
      color: '#3F4A56',
    },
  ]
}

type CalculatorLossMapProps = {
  result: CalculationResult
}

export default function CalculatorLossMap({ result }: CalculatorLossMapProps) {
  const rows = buildRows(result)
  const maxAmount = Math.max(...rows.map((r) => r.amount), 1)

  return (
    <div>
      <h3 className="text-center text-lg font-bold text-text-main sm:text-left">Где именно теряются деньги и время</h3>
      <div className="mt-5 flex flex-col gap-5">
        {rows.map((row) => {
          const widthPercent = row.amount > 0 ? Math.max(4, Math.round((row.amount / maxAmount) * 100)) : 0
          const sharePercent = result.totalBurden > 0 ? Math.round((row.amount / result.totalBurden) * 100) : 0
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-text-main">{row.label}</span>
                <span className="shrink-0 text-base font-bold text-text-main">{formatMoney(row.amount)}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{row.explain}</p>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${widthPercent}%`, backgroundColor: row.color }}
                />
              </div>
              {result.totalBurden > 0 && (
                <span className="mt-1 block text-[11px] font-medium text-text-muted">{sharePercent}% от общей нагрузки</span>
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-[12px] leading-relaxed text-text-muted">
        Стоимость ручной работы — это не прямой денежный убыток, а ориентировочная ценность времени, которое можно
        освободить.
      </p>
    </div>
  )
}
