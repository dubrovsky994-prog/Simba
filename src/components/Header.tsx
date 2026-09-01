import { useEffect, useState } from 'react'
import { IconClose, IconMenu } from './icons'
import simbaMark from '../assets/simba/brand/simba-mark-original.png'

const NAV_LINKS = [
  { label: 'Возможности', href: '#features' },
  { label: 'Для кого', href: '#for-whom' },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'Как работает', href: '#how-it-works' },
  { label: 'Контакты', href: '#contacts' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLinkClick = () => setIsOpen(false)

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${
          isScrolled ? 'bg-[rgba(var(--page-bg-rgb),0.92)] backdrop-blur-lg' : 'bg-[rgba(var(--page-bg-rgb),0.75)] backdrop-blur-md'
        }`}
      >
      <div className="container-px grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-[72px]">
        <a href="#top" className="flex items-center gap-2 justify-self-start" aria-label="Симба — цифровая система продаж">
          <img
            src={simbaMark}
            alt=""
            className="h-10 w-auto object-contain lg:h-11"
          />
          <span className="text-xl font-bold text-text-main lg:text-2xl">Симба</span>
        </a>

        <nav className="hidden items-center gap-8 justify-self-center lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted transition-colors duration-200 hover:text-accent-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-self-end">
          <a href="#audit" className="hidden btn-primary lg:inline-flex lg:whitespace-nowrap lg:px-4 xl:px-6">
            Получить бесплатный разбор
          </a>

          <button
            type="button"
            aria-label="Открыть меню"
            onClick={() => setIsOpen(true)}
            className="neu-chip flex h-11 w-11 items-center justify-center text-text-main lg:hidden"
          >
            <IconMenu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-bg-section p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <a href="#top" onClick={handleLinkClick} className="flex items-center gap-2" aria-label="Симба">
                <img src={simbaMark} alt="" className="h-10 w-auto object-contain" />
                <span className="text-xl font-bold text-text-main">Симба</span>
              </a>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setIsOpen(false)}
                className="neu-chip flex h-10 w-10 items-center justify-center text-text-main"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="rounded-lg px-3 py-3.5 text-base font-medium text-text-main transition-colors duration-200 hover:bg-bg-card-soft hover:text-accent-dark"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a href="#audit" onClick={handleLinkClick} className="btn-primary mt-8 w-full">
              Получить бесплатный разбор
            </a>
          </div>
        </div>
      )}
    </>
  )
}
