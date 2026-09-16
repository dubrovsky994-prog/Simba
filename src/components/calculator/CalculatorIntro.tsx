import CalculatorAvatar from './CalculatorAvatar'
import { IconArrowRight, IconCheckSmall } from '../icons'

const MARKERS = ['1–2 минуты', 'Без регистрации', 'Результат сразу']

type CalculatorIntroProps = {
  onStart: () => void
}

export default function CalculatorIntro({ onStart }: CalculatorIntroProps) {
  return (
    <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <div
        className="pointer-events-none absolute -left-10 -top-16 hidden h-72 w-72 rounded-full opacity-50 blur-3xl lg:block"
        style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
        <span className="section-eyebrow">Бесплатная диагностика бизнеса</span>
        <h2 className="section-title mt-4">Узнайте, сколько заявок, денег и времени вы можете терять</h2>
        <p className="section-subtitle mx-auto lg:mx-0">
          8 простых вопросов — и вы увидите, где клиенты выпадают из процесса и что можно автоматизировать.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
          {MARKERS.map((marker) => (
            <span
              key={marker}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-dark"
            >
              <IconCheckSmall className="h-3.5 w-3.5" />
              {marker}
            </span>
          ))}
        </div>

        <button type="button" onClick={onStart} className="btn-primary mt-7 inline-flex items-center gap-2">
          Начать расчёт
          <IconArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-xs text-text-muted">Расчёт ориентировочный и основан на указанных вами данных.</p>
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center lg:mx-0 lg:max-w-none">
        <CalculatorAvatar size={380} onStart={onStart} />
        <p className="-mt-3 text-sm font-medium text-accent-dark">Нажмите на льва, чтобы начать</p>
        <a href="/avatar-preview.html" className="mt-3 text-xs font-medium text-accent-dark underline decoration-accent/40 underline-offset-4 hover:text-accent">
          Посмотреть все состояния аватара
        </a>
      </div>
    </div>
  )
}
