import type { PaperMorphState } from '../../components/avatar/PaperMorphAvatar'

// SBA's own state model (product concept — greeting/insight/action/humanRequired/done).
// The approved avatar visual only understands 4 states, so this maps the richer
// model onto it plus a restrained, one-shot CSS accent — never a new animation loop.
export type SbaState = 'idle' | 'greeting' | 'listening' | 'thinking' | 'insight' | 'action' | 'humanRequired' | 'done'

export function sbaToPaperMorph(state: SbaState): PaperMorphState {
  switch (state) {
    case 'listening':
      return 'listening'
    case 'thinking':
      return 'thinking'
    case 'insight':
    case 'action':
      return 'answering'
    case 'humanRequired':
      return 'listening'
    default:
      return 'idle'
  }
}

export type SbaAccent = 'insight' | 'human' | null

// A one-shot pulse on insight, a calm ring when a human is needed — nothing
// that loops forever. See .sba-avatar-wrap in simba-refinements.css.
export function sbaAccent(state: SbaState): SbaAccent {
  if (state === 'insight') return 'insight'
  if (state === 'humanRequired') return 'human'
  return null
}
