import { useEffect, useState } from 'react'

const STORAGE_KEY = 'simba_cookie_consent'

function hasStoredConsent(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'accepted'
  } catch {
    return false
  }
}

function storeConsent() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
  } catch {
    // localStorage unavailable (private mode, blocked storage) — banner will just show again next visit
  }
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!hasStoredConsent()) {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  const handleAccept = () => {
    storeConsent()
    setIsVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-[rgba(var(--page-bg-rgb),0.97)] backdrop-blur-lg">
      <div className="container-px flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
        <p className="text-sm leading-relaxed text-text-muted">
          Мы используем Vercel Analytics, чтобы анализировать посещаемость сайта и улучшать его работу.
          Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookies и похожих технологий.
          Подробнее — в{' '}
          <a href="/cookies" className="text-accent-dark underline underline-offset-2 hover:text-accent">
            Политике cookies
          </a>
          .
        </p>
        <button type="button" onClick={handleAccept} className="btn-primary shrink-0 sm:px-8">
          Понятно
        </button>
      </div>
    </div>
  )
}
