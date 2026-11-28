import { useEffect, useRef, type ReactNode } from 'react'

export default function PresentationDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  }, [])
  return <dialog className="master-dialog" ref={ref} aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}><div className="master-dialog-content"><button className="master-dialog-close" aria-label="Закрыть окно" onClick={onClose}>×</button>{children}</div></dialog>
}
