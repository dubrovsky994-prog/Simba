import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from './icons'

type ImageModalProps = {
  src: string
  alt: string
  onClose: () => void
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  // Rendered into document.body via a portal so the overlay's `fixed`
  // positioning is always relative to the viewport — a transformed/animated
  // ancestor (e.g. the case panel's entrance animation) would otherwise
  // become its containing block and break full-screen centering.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14181c]/85 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:right-6 sm:top-6"
      >
        <IconClose className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
      />
    </div>,
    document.body,
  )
}
