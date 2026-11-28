export type StepNavItem = { step: number; label: string }

type CalculatorStepNavProps = {
  steps: StepNavItem[]
  currentStep: number
}

// Visual-only: shows done/current/upcoming state per step. No click handling —
// jumping between steps is not part of this redesign's scope.
export default function CalculatorStepNav({ steps, currentStep }: CalculatorStepNavProps) {
  return (
    <ol className="public-v2-step-nav" aria-label="Шаги расчёта">
      {steps.map(({ step, label }) => {
        const state = step < currentStep ? 'is-done' : step === currentStep ? 'is-current' : ''
        return (
          <li key={step} className={`public-v2-step-nav__item ${state}`} aria-current={step === currentStep ? 'step' : undefined}>
            <span className="public-v2-step-nav__num">{step}</span>
            <span>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
