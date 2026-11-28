import { useEffect, useMemo, useRef, useState } from 'react'
import PaperMorphAvatar from '../avatar/PaperMorphAvatar'
import MasterIcon from './MasterIcon'
import { sbaAccent, sbaToPaperMorph, type SbaState } from '../../lib/sba/state'
import { buildSimulationFrames, frameDuration } from '../../lib/sba/simulation'
import type { WorkspaceState } from './navigation'

const CAPABILITIES = ['Принимает и фиксирует заявки', 'Замечает потери', 'Напоминает клиентам', 'Предлагает следующий шаг']
const MAX_HISTORY = 3
// Shown under the result only on a true "nothing to do" beat (event
// explicitly cleared) — a restrained sign SBA is still present, not a fake
// activity counter. See spec: idle should feel present, not dead.
const IDLE_NOTE = 'Продолжаю следить за изменениями.'

// A single continuous, auto-advancing simulation is the primary SBA demo now
// (spec: the visitor shouldn't have to operate SBA to understand it). The
// four internal states (listening/thinking/insight/action/humanRequired/done)
// still exist — buildSimulationFrames() just drives them autonomously instead
// of a visitor clicking tabs.
export default function SbaPreview({ onSelect }: { onSelect: (state: WorkspaceState) => void }) {
  const frames = useMemo(() => buildSimulationFrames(), [])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [event, setEvent] = useState<string | null>(frames[0].event)
  const [history, setHistory] = useState<{ time: string; text: string }[]>([])
  const appliedIndexRef = useRef(-1)

  const frame = frames[index]

  // Side effects (carrying the event forward, appending to history) run
  // exactly once per frame — not once per render.
  useEffect(() => {
    if (appliedIndexRef.current === index) return
    appliedIndexRef.current = index
    if (frame.event !== null) setEvent(frame.event)
    if (frame.history?.length) {
      setHistory((prev) => [...prev, ...frame.history!].slice(-MAX_HISTORY))
    }
  }, [index, frame])

  // Text/status advance on their own clock — the shared avatar's ~8.8s morph
  // never gates the interface (spec item 6).
  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % frames.length), frameDuration(frame))
    return () => window.clearTimeout(timer)
  }, [index, paused, frame, frames.length])

  const handleNextExample = () => {
    const next = frames.findIndex((candidate, i) => i > index && candidate.scenarioStart)
    setIndex(next !== -1 ? next : 0)
  }

  const avatarState: SbaState = overlayOpen ? 'greeting' : frame.sbaState
  const accent = sbaAccent(avatarState)

  return (
    <div className="sba-preview">
      <div className="master-ai-preview">
        <div className="sba-avatar-wrap master-ai-orbit" data-sba-accent={accent ?? undefined}>
          <PaperMorphAvatar size={300} state={sbaToPaperMorph(avatarState)} onActivate={() => setOverlayOpen((v) => !v)} />
          <span>SBA · powered by SIMBA AI</span>
          {overlayOpen && (
            <div className="sba-overlay" role="dialog" aria-label="SBA">
              <p>Я SBA.<br />Хотите показать мне свой бизнес?</p>
              <button type="button" className="master-button" onClick={() => onSelect('diagnostics')}>
                Начать диагностику<MasterIcon name="arrow" />
              </button>
            </div>
          )}
        </div>
        <div>
          <span className="master-eyebrow">SBA · SMART BUSINESS ASSISTANT</span>
          <p className="sba-lead">SBA наблюдает за процессами и подключает человека только там, где он действительно нужен.</p>
          <span className="sba-capabilities-kicker">ВОЗМОЖНОСТИ ПРИ ВНЕДРЕНИИ</span>
          <ul>
            {CAPABILITIES.map((text) => (
              <li key={text}><MasterIcon name="ai" />{text}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sba-demo" aria-live="polite">
        <div className="sba-sim-flow">
        <p className="sba-sim-event">
          Событие
          {event && <span key={event} className="case-fade-in">{event}</span>}
        </p>
        <div key={`status-${frame.id}`} className="sba-sim-status case-fade-in">
          <i>{frame.status}</i>
        </div>
        <p key={`result-${frame.id}`} className="sba-sim-result case-fade-in">{frame.result ?? ' '}</p>
        {frame.sbaState === 'idle' && frame.event === '' && (
          <p key={`note-${frame.id}`} className="sba-sim-idle-note case-fade-in">{IDLE_NOTE}</p>
        )}
        </div>
        {frame.badge && (
          <div className="sba-sim-badge">
            <span>{frame.badge.label}</span>
            <span>{frame.badge.text}</span>
          </div>
        )}
        <div className="sba-sim-controls">
          <button type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            {paused ? 'Продолжить' : 'Пауза'}
          </button>
          <button type="button" onClick={handleNextExample}>Следующий пример</button>
        </div>
        {history.length > 0 && (
          <ul className="sba-sim-history">
            {history.map((item, i) => (
              <li key={`${item.time}-${i}`}><time>{item.time}</time>{item.text}</li>
            ))}
          </ul>
        )}
        <p className="sba-demo-note">Демонстрация принципа работы SBA. При внедрении события поступают из реальных систем бизнеса.</p>
      </div>
    </div>
  )
}
