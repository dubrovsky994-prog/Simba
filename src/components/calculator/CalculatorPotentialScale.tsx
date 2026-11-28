import { formatMoney } from '../../lib/calculator/format'
import type { CalculationResult } from '../../lib/calculator/types'

type CalculatorPotentialScaleProps = {
  result: CalculationResult
}

export default function CalculatorPotentialScale({ result }: CalculatorPotentialScaleProps) {
  const scaleMax = result.potential > 0 ? result.potential : 1
  const conservativePct = Math.min(100, (result.conservative / scaleMax) * 100)
  const realisticPct = Math.min(100, (result.realistic / scaleMax) * 100)

  return (
    <div>
      <h3 className="text-center text-lg font-bold text-text-main sm:text-left">
        Какую часть нагрузки потенциально можно сократить
      </h3>

      <div className="relative mt-8 h-2 w-full rounded-full bg-black/[0.06]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent/50 to-accent-dark"
          style={{ width: `${realisticPct}%` }}
        />
        <div
          className="absolute inset-y-0 rounded-full border border-dashed border-accent/40"
          style={{ left: `${realisticPct}%`, right: 0 }}
        />
        <span
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-text-muted shadow-sm"
          style={{ left: `${conservativePct}%` }}
          title="Осторожный сценарий"
        />
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent-dark shadow"
          style={{ left: `${realisticPct}%` }}
          title="Реалистичный сценарий"
        />
        <span
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent/60 shadow-sm"
          style={{ left: '100%' }}
          title="Потенциальный сценарий"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-2 text-center">
        <div className="flex-1">
          <span className="block text-[11px] font-medium text-text-muted">Осторожный</span>
          <span className="block text-sm font-semibold text-text-main">{formatMoney(result.conservative)}</span>
        </div>
        <div className="flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-accent-dark">Реалистичный</span>
          <span className="block text-lg font-extrabold text-accent-dark">{formatMoney(result.realistic)}</span>
        </div>
        <div className="flex-1">
          <span className="block text-[11px] font-medium text-text-muted">Потенциальный</span>
          <span className="block text-sm font-semibold text-text-main">{formatMoney(result.potential)}</span>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed text-text-muted sm:mx-0 sm:text-left">
        Это не обещание выручки, а ориентировочная часть потерь и ручной работы, которую можно попытаться сократить.
      </p>

      <p className="mx-auto mt-4 max-w-lg text-center text-[11px] leading-relaxed text-text-muted/70 sm:mx-0 sm:text-left">
        Расчёт является ориентировочным и не гарантирует увеличение выручки. Фактический результат зависит от спроса,
        качества услуг, рекламы и работы с клиентами.
      </p>
    </div>
  )
}
