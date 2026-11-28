import type { PaperMorphState } from '../../components/avatar/PaperMorphAvatar'

// SBA's own state model (product concept — greeting/insight/action/humanRequired/done).
export type SbaState = 'idle' | 'greeting' | 'listening' | 'thinking' | 'insight' | 'action' | 'humanRequired' | 'done'

// Product decision after visual QA: the shared avatar's ~8.8s morph is much
// longer than a simulation beat (2-3.6s), so the fox/owl/leopard swap never
// reliably completes in step with the current event — SBA's visible identity
// is locked to the lion. Internal states still exist and still drive the
// surrounding presentation (accent ring/pulse, status/result copy); they just
// no longer pick a different animal. The shared avatar implementation itself
// is untouched — this only changes what SbaPreview asks it to show.
export function sbaToPaperMorph(state: SbaState): PaperMorphState {
  void state
  return 'idle'
}

export type SbaAccent = 'signal' | 'insight' | 'human' | 'idle' | null

// One-shot cues for most states, plus a continuous-but-very-subtle breathing
// ring for true idle (spec: idle should feel present, not dead, without
// inventing fake activity). Never a loop for the others. See .sba-avatar-wrap
// in simba-refinements.css.
export function sbaAccent(state: SbaState): SbaAccent {
  if (state === 'listening') return 'signal'
  if (state === 'insight' || state === 'action') return 'insight'
  if (state === 'humanRequired') return 'human'
  if (state === 'idle') return 'idle'
  return null
}
