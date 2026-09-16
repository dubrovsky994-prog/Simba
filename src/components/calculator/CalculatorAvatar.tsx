import type { AvatarState } from '../avatar/SimbaAIAvatar'
import PaperMorphAvatar, { type PaperMorphState } from '../avatar/PaperMorphAvatar'

type Props = { state?: AvatarState; size?: number; onStart?: () => void }

/** Keep the diagnostic's real state lifecycle while using the approved paper avatar. */
export default function CalculatorAvatar({ state = 'idle', size = 84, onStart }: Props) {
  const appearance: PaperMorphState = state === 'thinking'
    ? 'thinking'
    : state === 'error'
      ? 'listening'
      : state === 'active' || state === 'success'
        ? 'answering'
        : 'idle'

  return (
    <div className="relative inline-flex" aria-label={`Симба: ${appearance}`}>
      <PaperMorphAvatar state={appearance} size={size} onActivate={onStart} />
      <span className="sr-only">Образ Симбы плавно меняется вместе с состоянием диагностики.</span>
    </div>
  )
}
