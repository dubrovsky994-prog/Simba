import CalculatorAvatar from './CalculatorAvatar'
import { formatMoney, formatNumber } from '../../lib/calculator/format'
import { IconArrowRight } from '../icons'

type CalculatorInsightProps = {
  missedCount: number
  cashLoss: number
  onContinue: () => void
}

// The single mid-flow stop the spec allows (item 11) — shown once, right
// after enough answers exist to compute a first real number, then never again.
export default function CalculatorInsight({ missedCount, cashLoss, onContinue }: CalculatorInsightProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.04] bg-white/60 p-6 text-center shadow-[0_20px_50px_rgba(31,37,43,0.06)] backdrop-blur-sm sm:p-9">
      <div className="mx-auto flex max-w-md justify-center">
        <CalculatorAvatar state="active" size={140} />
      </div>
      <span className="mt-3 block text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">Первый вывод</span>
      <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-text-main sm:text-lg">
        При текущем количестве обращений даже {formatNumber(missedCount)} потерянных заявок могут стоить бизнесу примерно{' '}
        <strong>{formatMoney(cashLoss)}</strong> потенциальной выручки в месяц.
      </p>
      <p className="mt-3 text-sm text-text-muted">Продолжим — хочу проверить ещё две точки.</p>
      <button type="button" onClick={onContinue} className="btn-primary mt-6 inline-flex items-center gap-2">
        Дальше
        <IconArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
