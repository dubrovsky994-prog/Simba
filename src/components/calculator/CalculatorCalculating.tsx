import { useEffect, useState } from 'react'
import CalculatorAvatar from './CalculatorAvatar'

const CAPTIONS = ['Собираю картину', 'Сопоставляю ваши ответы', 'Учитываю ручную работу']
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
    <div className="calc-insight-card mx-auto max-w-2xl rounded-[28px] p-8 text-center sm:p-10">
      <div className="calc-avatar-frame mx-auto">
        <CalculatorAvatar state="thinking" size={200} />
        <img className="calc-avatar-poster" src="/avatar/paper-morph/origami-lion-paper-v2.webp" alt="" />
      </div>
      <p key={index} className="mt-4 animate-calc-expand text-sm font-semibold text-accent-dark">
        {CAPTIONS[index]}…
      </p>
    </div>
  )
}
