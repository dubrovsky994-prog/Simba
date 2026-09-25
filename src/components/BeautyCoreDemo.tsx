import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BEAUTY_DEMO_ORIGIN, BEAUTY_DEMO_URL, beautyDemoMessageType, buildBeautyDemoUrl, isBeautyDemoMessage, type BeautyDemoEntry } from '../lib/beauty/demoBridge'
import { trackBeautyEvent } from '../lib/beauty/analytics'

type LoadState = 'loading' | 'ready' | 'error'

export default function BeautyCoreDemo({ onClose, entry = { mode: 'site', section: 'home' } }: { onClose: () => void; entry?: BeautyDemoEntry }) {
  const onCloseRef = useRef(onClose)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<LoadState>('loading')
  const frameUrl = useMemo(() => buildBeautyDemoUrl(entry), [entry])
  onCloseRef.current = onClose

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    trackBeautyEvent('beauty_demo_opened', { mode: entry.mode, section: entry.section ?? '' })
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onCloseRef.current() }
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [entry.mode, entry.section])

  useEffect(() => {
    setState(frameUrl && BEAUTY_DEMO_ORIGIN ? 'loading' : 'error')
    if (!frameUrl || !BEAUTY_DEMO_ORIGIN) return
    const timeout = window.setTimeout(() => setState((current) => current === 'ready' ? current : 'error'), 15000)
    const receive = (event: MessageEvent) => {
      if (event.origin !== BEAUTY_DEMO_ORIGIN || !isBeautyDemoMessage(event.data)) return
      const messageType = beautyDemoMessageType(event.data)
      if (messageType === 'BEAUTY_DEMO_READY') {
        window.clearTimeout(timeout)
        setState('ready')
        trackBeautyEvent('beauty_demo_ready', { mode: entry.mode })
        frameRef.current?.contentWindow?.postMessage({ type: 'BEAUTY_DEMO_SET_MODE', mode: entry.mode }, BEAUTY_DEMO_ORIGIN)
        if (entry.section) frameRef.current?.contentWindow?.postMessage({ type: 'BEAUTY_DEMO_SET_SECTION', section: entry.section }, BEAUTY_DEMO_ORIGIN)
      }
      if (['BEAUTY_DEMO_MODE_CHANGED', 'BEAUTY_DEMO_ROLE_CHANGED', 'BEAUTY_DEMO_ROLE'].includes(messageType)) {
        trackBeautyEvent('beauty_demo_mode_changed', { mode: event.data.mode ?? event.data.role ?? 'unknown' })
      }
    }
    window.addEventListener('message', receive)
    return () => { window.clearTimeout(timeout); window.removeEventListener('message', receive) }
  }, [attempt, entry.mode, entry.section, frameUrl])

  const close = () => { trackBeautyEvent('beauty_demo_closed', { mode: entry.mode }); onClose() }
  const openFull = () => trackBeautyEvent('beauty_demo_full_opened', { mode: entry.mode })

  return createPortal(
    <div className="beauty-live-backdrop" role="dialog" aria-modal="true" aria-label="Демо Beauty Core" onClick={(event) => event.target === event.currentTarget && close()}>
      <section className="beauty-live-window">
        <header className="beauty-live-bar">
          <div><strong>Beauty Core</strong><span>LIVE DEMO</span></div>
          <a className="beauty-full-demo-cta" href={BEAUTY_DEMO_URL || undefined} target="_blank" rel="noopener noreferrer" onClick={openFull}>Открыть полное демо ↗</a>
          <button type="button" onClick={close} aria-label="Закрыть демо">×</button>
        </header>
        <div className="beauty-live-stage">
          {state === 'loading' && <div className="beauty-live-loading" role="status"><span>BEAUTY CORE / LIVE</span><strong>Загружаем Beauty Core...</strong><i /></div>}
          {state === 'error' && <div className="beauty-live-error" role="alert"><span>BEAUTY CORE / CONNECTION</span><strong>Beauty Core сейчас не удалось открыть внутри SIMBA.</strong><p>Главная страница продолжает работать — можно повторить загрузку или открыть проект отдельно.</p><div><button type="button" onClick={() => { setState('loading'); setAttempt((value) => value + 1) }}>Повторить</button><a className="beauty-full-demo-cta" href={BEAUTY_DEMO_URL || undefined} target="_blank" rel="noopener noreferrer" onClick={openFull}>Открыть полное демо ↗</a></div></div>}
          {frameUrl && <iframe ref={frameRef} key={`${frameUrl}-${attempt}`} src={frameUrl} title="Beauty Core — интерактивное демо" loading="lazy" className={state === 'ready' ? 'is-ready' : ''} />}
        </div>
      </section>
    </div>,
    document.body,
  )
}
