type CalculatorProgressProps = {
  step: number
  total: number
  stageLabel: string
}

export default function CalculatorProgress({ step, total, stageLabel }: CalculatorProgressProps) {
  const percent = Math.round((step / total) * 100)

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-accent-dark">{stageLabel}</span>
        <span className="text-xs font-medium text-text-muted">
          Шаг {step} из {total} · {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Шаг ${step} из ${total}`}
        className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-black/[0.06]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-dark transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
