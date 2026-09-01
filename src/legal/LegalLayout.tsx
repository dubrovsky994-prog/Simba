import { ReactNode, useEffect } from 'react'
import Footer from '../components/Footer'
import simbaMark from '../assets/simba/brand/simba-mark-original.png'

type LegalLayoutProps = {
  title: string
  publishDate: string
  version: string
  children: ReactNode
}

export default function LegalLayout({ title, publishDate, version, children }: LegalLayoutProps) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} — Симба`
    window.scrollTo(0, 0)
    return () => {
      document.title = prevTitle
    }
  }, [title])

  return (
    <div className="min-h-screen bg-bg-main text-text-main">
      <header className="sticky top-0 z-50 border-b border-border bg-[rgba(var(--page-bg-rgb),0.92)] backdrop-blur-lg">
        <div className="container-px flex h-16 items-center justify-between lg:h-[72px]">
          <a href="/" className="flex items-center gap-2" aria-label="Симба — цифровая система продаж">
            <img src={simbaMark} alt="" className="h-10 w-auto object-contain lg:h-11" />
            <span className="text-xl font-bold text-text-main lg:text-2xl">Симба</span>
          </a>
          <a
            href="/"
            className="text-sm font-medium text-text-muted transition-colors duration-200 hover:text-accent-dark"
          >
            На главную
          </a>
        </div>
      </header>

      <main className="py-12 sm:py-16">
        <div className="container-px">
          <article className="mx-auto max-w-3xl">
            <span className="section-eyebrow">Документы SIMBA</span>
            <h1 className="section-title mt-4">{title}</h1>
            <p className="mt-3 text-sm text-text-muted">
              Дата публикации: {publishDate} · Версия: {version}
            </p>

            <div className="legal-prose mt-10">{children}</div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
