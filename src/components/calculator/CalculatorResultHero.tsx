import { useEffect, useRef, useState } from 'react'
import { formatMoney } from '../../lib/calculator/format'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    let frame: number
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (targetRef.current - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs])

  return value
}

type CalculatorResultHeroProps = {
  displayNiche: string
  totalBurden: number
}

export default function CalculatorResultHero({ displayNiche, totalBurden }: CalculatorResultHeroProps) {
  const animatedValue = useCountUp(totalBurden)

  return (
    <div className="animate-calc-result text-center">
      <span className="section-eyebrow">Предварительный результат</span>
      <p className="mt-2 text-sm font-medium text-text-muted">{displayNiche}</p>
      <h2 className="mt-3 text-xl font-semibold text-text-main sm:text-2xl">Ваш бизнес может терять</h2>
      <p className="mt-2 text-[2.75rem] font-extrabold leading-none tracking-tight text-accent-dark sm:text-[3.75rem]">
        {formatMoney(animatedValue)}
      </p>
      <span className="mt-1 block text-sm font-medium text-text-muted">в месяц</span>
      <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-text-muted">
        Это ориентировочная оценка на основании ваших ответов. Ниже покажем, из чего она складывается.
      </p>
    </div>
  )
}
