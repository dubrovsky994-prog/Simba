type StepChainProps = {
  steps: string[]
  tone?: 'neutral' | 'accent'
}

// Compact vertical chain of steps with a dashed connector — reused by the
// "now vs with Simba" comparison and by the audit's recommended architecture,
// so both read as the same visual language instead of two one-off layouts.
export default function StepChain({ steps, tone = 'neutral' }: StepChainProps) {
  const chipTextClass = tone === 'accent' ? 'text-accent' : 'text-accent-dark'
  const lineClass = tone === 'accent' ? 'border-[var(--line-brand)]' : 'border-[var(--line-neutral)]'

  return (
    <div className="relative">
      <div className={`absolute bottom-5 left-5 top-5 border-l-2 border-dashed ${lineClass}`} />
      <ol className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <li key={`${step}-${index}`} className="relative flex items-center gap-3">
            <span
              className={`neu-chip relative z-10 flex h-10 w-10 shrink-0 items-center justify-center text-xs font-bold ${chipTextClass}`}
            >
              {index + 1}
            </span>
            <span className="text-sm font-medium text-text-main sm:text-base">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
