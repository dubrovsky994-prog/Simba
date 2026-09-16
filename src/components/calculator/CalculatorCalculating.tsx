import { useEffect, useState } from 'react'
import CalculatorAvatar from './CalculatorAvatar'

const CAPTIONS = ['Анализируем обращения', 'Учитываем незавершённые заказы', 'Рассчитываем стоимость ручной работы']
const STEP_MS = 360

// Transient state between the last question and the result — purely
// decorative pacing so the result feels computed, not just swapped in.
// Parent skips rendering this entirely under prefers-reduced-motion.
export default function CalculatorCalculating() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= CAPTIONS.length - 1) return
    const timer = window.setTimeout(() => setIndex((i) => i + 1), STEP_MS)
    return () => window.clearTimeout(timer)
  }, [index])

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.04] bg-white/60 p-8 text-center shadow-[0_20px_50px_rgba(31,37,43,0.06)] backdrop-blur-sm sm:p-10">
      <div className="mx-auto flex max-w-md justify-center">
        <CalculatorAvatar state="thinking" size={200} />
      </div>
      <p key={index} className="mt-4 animate-calc-expand text-sm font-semibold text-accent-dark">
        {CAPTIONS[index]}…
      </p>
    </div>
  )
}
