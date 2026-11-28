import { useEffect, useState } from 'react'
import ImageModal from './ImageModal'

export type CaseScreenshot = {
  src: string
  alt: string
  format?: 'portrait' | 'landscape'
}

type CaseGalleryProps = {
  screenshots: CaseScreenshot[]
  resetKey: string
}

const PHONE_ASPECT = 'aspect-[9/19]'
const LANDSCAPE_ASPECT = 'aspect-[2/1]'

function PlaceholderIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 16.5L9 12.5L12.2 15L16 11L19.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function PlaceholderTile({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-deep)] text-text-muted">
      <PlaceholderIcon className={compact ? 'h-4 w-4 opacity-45' : 'h-7 w-7 opacity-45'} />
      {!compact && <span className="text-xs font-medium">{label}</span>}
    </div>
  )
}

export default function CaseGallery({ screenshots, resetKey }: CaseGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(new Set())
  // Large case photos can take a moment on a real mobile connection — track
  // load completion so the dark phone frame shows a loading hint instead of
  // sitting empty until the image paints in.
  const [loadedSrcs, setLoadedSrcs] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setActiveIndex(0)
    setModalOpen(false)
    setBrokenSrcs(new Set())
  }, [resetKey])

  const slots: CaseScreenshot[] =
    screenshots.length > 0
      ? screenshots
      : [{ src: '', alt: 'Материалы проекта готовятся' }]

  const isBroken = (src: string) => src === '' || brokenSrcs.has(src)
  const isLoaded = (src: string) => loadedSrcs.has(src)

  const handleError = (src: string) => {
    setBrokenSrcs((prev) => {
      const next = new Set(prev)
      next.add(src)
      return next
    })
  }

  const handleLoad = (src: string) => {
    setLoadedSrcs((prev) => {
      const next = new Set(prev)
      next.add(src)
      return next
    })
  }

  const active = slots[activeIndex] ?? slots[0]
  const activeIsImage = !isBroken(active.src)
  const activeIsLandscape = active.format === 'landscape'
  const hasLandscapeScreens = slots.some((shot) => shot.format === 'landscape')

  return (
    <div>
      <button
        type="button"
        onClick={() => activeIsImage && setModalOpen(true)}
        className={`relative mx-auto block overflow-hidden border border-white/15 bg-white/10 p-1.5 shadow-[0_18px_40px_rgba(20,24,28,0.28)] backdrop-blur-xl ${
          activeIsLandscape
            ? `w-full max-w-[560px] ${LANDSCAPE_ASPECT} rounded-[1rem]`
            : `h-[360px] ${PHONE_ASPECT} rounded-[1.75rem] sm:h-[420px]`
        } ${
          activeIsImage ? 'group cursor-zoom-in' : 'cursor-default'
        }`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.3rem] bg-[#1f252b]">
          {activeIsImage ? (
            <>
              {!isLoaded(active.src) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlaceholderIcon className="h-7 w-7 animate-pulse text-white/40" />
                </div>
              )}
              <img
                src={active.src}
                alt={active.alt}
                onError={() => handleError(active.src)}
                onLoad={() => handleLoad(active.src)}
                className={`h-full w-full object-cover transition-opacity duration-300 group-hover:scale-[1.02] ${
                  isLoaded(active.src) ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <PlaceholderTile label={active.alt} />
          )}
        </div>
      </button>

      {slots.length > 1 && (
        <div className={`mt-3 flex justify-center ${hasLandscapeScreens ? 'flex-wrap gap-2' : 'gap-3'}`}>
          {slots.map((shot, index) => {
            const broken = isBroken(shot.src)
            return (
              <button
                key={shot.src || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={shot.alt}
                className={`relative shrink-0 overflow-hidden rounded-xl border bg-white/10 p-1 backdrop-blur-md transition-all duration-200 ${
                  shot.format === 'landscape' ? `h-12 w-20 ${LANDSCAPE_ASPECT} sm:h-20 sm:w-40` : `h-24 ${PHONE_ASPECT} sm:h-28`
                } ${
                  index === activeIndex
                    ? 'border-accent shadow-neu-sm'
                    : 'border-white/15 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="h-full w-full overflow-hidden rounded-lg bg-[#1f252b]">
                  {!broken ? (
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      onError={() => handleError(shot.src)}
                      onLoad={() => handleLoad(shot.src)}
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        isLoaded(shot.src) ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ) : (
                    <PlaceholderTile label={`${index + 1}`} compact />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {modalOpen && activeIsImage && (
        <ImageModal src={active.src} alt={active.alt} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
