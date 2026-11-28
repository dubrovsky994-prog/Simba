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
    <div className="calc-insight-card mx-auto max-w-2xl rounded-[28px] p-6 text-center sm:p-9">
      <div className="calc-avatar-frame mx-auto">
        <CalculatorAvatar state="active" size={140} />
        <img className="calc-avatar-poster" src="/avatar/paper-morph/origami-lion-paper-v2.webp" alt="" />
      </div>
      <span className="calc-insight-card__kicker mt-3 block text-xs font-bold uppercase tracking-[0.14em]">Первый вывод</span>
      <p className="calc-insight-card__text mx-auto mt-3 max-w-lg text-base leading-relaxed sm:text-lg">
        При текущем количестве обращений даже {formatNumber(missedCount)} потерянных заявок могут стоить бизнесу примерно{' '}
        <strong>{formatMoney(cashLoss)}</strong> потенциальной выручки в месяц.
      </p>
      <p className="calc-insight-card__note mt-3 text-sm">Продолжим — хочу проверить ещё две точки.</p>
      <button type="button" onClick={onContinue} className="btn-primary mt-6 inline-flex items-center gap-2">
        Дальше
        <IconArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
