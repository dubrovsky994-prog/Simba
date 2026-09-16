import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './paper-morph-avatar.css'

export type PaperMorphState = 'idle' | 'listening' | 'thinking' | 'answering'

const LABELS: Record<PaperMorphState, string> = {
  idle: 'Рядом, лев',
  listening: 'Внимательно слушаю, снежный барс',
  thinking: 'Думаю, сова',
  answering: 'Отвечаю, лиса',
}

type Props = {
  state?: PaperMorphState
  size?: number
  onActivate?: () => void
  className?: string
}

/** The approved avatar renderer stays self-contained in a same-origin frame. */
export default function PaperMorphAvatar({ state = 'idle', size = 380, onActivate, className = '' }: Props) {
  const frame = useRef<HTMLIFrameElement>(null)
  const activateRef = useRef(onActivate)
  const [ready, setReady] = useState(false)
  activateRef.current = onActivate

  useEffect(() => {
    if (!ready) return
    frame.current?.contentWindow?.postMessage({ kind: 'simba-avatar-state', state }, window.location.origin)
  }, [ready, state])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      if (event.data?.kind === 'simba-avatar-ready') setReady(true)
      if (event.data?.kind === 'simba-avatar-activate') activateRef.current?.()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!ready) return
    const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
    let pending = 0
    let position = { x: 0, y: 0 }
    const sendPointer = () => {
      pending = 0
      frame.current?.contentWindow?.postMessage({ kind: 'simba-avatar-pointer', ...position }, window.location.origin)
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches) return
      const bounds = frame.current?.getBoundingClientRect()
      if (!bounds || bounds.bottom < 0 || bounds.top > window.innerHeight || !bounds.width) return
      position = {
        x: Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width * .7))),
        y: Math.max(-1, Math.min(1, -(event.clientY - bounds.top - bounds.height / 2) / (bounds.height * .7))),
      }
      if (!pending) pending = requestAnimationFrame(sendPointer)
    }
    const onLeave = () => {
      cancelAnimationFrame(pending)
      pending = 0
      frame.current?.contentWindow?.postMessage({ kind: 'simba-avatar-pointer-leave' }, window.location.origin)
    }
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('blur', onLeave)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(pending)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('blur', onLeave)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [ready])

  return (
    <div
      className={`simba-paper-avatar ${className}`}
      data-ready={ready}
      data-state={state}
      role="img"
      aria-label={`SIMBA AI: ${LABELS[state]}`}
      style={{ '--paper-avatar-size': `${size}px` } as CSSProperties}
    >
      <iframe
        ref={frame}
        src="/avatar/paper-morph/index.html?embed"
        title={`Анимированный аватар SIMBA AI — ${LABELS[state]}`}
        loading="lazy"
        tabIndex={onActivate ? 0 : -1}
      />
      {!ready && <span className="simba-paper-avatar-loading" aria-hidden="true" />}
      <span className="sr-only" aria-live="polite">{LABELS[state]}</span>
    </div>
  )
}
