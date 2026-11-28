import { useEffect, useState } from 'react'
import { IconClose, IconMenu } from './icons'
import simbaMark from '../assets/simba/brand/simba-mark-original.png'

const NAV_LINKS = [
  { label: 'Решения', href: '#solutions' }, { label: 'Кейсы', href: '#for-whom' },
  { label: 'Тарифы', href: '#solutions' }, { label: 'О компании', href: '#beauty-core-title' },
  { label: 'Блог', href: '#for-whom' }, { label: 'Контакты', href: '#contacts' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => { const update = () => setIsScrolled(window.scrollY > 8); update(); window.addEventListener('scroll', update); return () => window.removeEventListener('scroll', update) }, [])
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [isOpen])
  const close = () => setIsOpen(false)
  return <><header className={`public-v2-header ${isScrolled ? 'is-scrolled' : ''}`}><div className="container-px public-v2-header__inner"><a href="#top" className="public-v2-header__brand" aria-label="SIMBA — цифровая система продаж"><img src={simbaMark} alt="" /><span>Симба<small>цифровые системы продаж</small></span></a><nav className="public-v2-header__nav" aria-label="Основная навигация">{NAV_LINKS.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</nav><div className="public-v2-header__actions"><button type="button" className="public-v2-header__search" aria-label="Поиск">⌕</button><a href="#business-audit" className="public-v2-header__cta">Посчитать потери <b>→</b></a></div><button type="button" aria-label="Открыть меню" onClick={() => setIsOpen(true)} className="public-v2-header__menu"><IconMenu className="h-5 w-5" /></button></div></header>
    {isOpen && <div className="public-v2-mobile-menu"><button type="button" aria-label="Закрыть меню" onClick={close}><IconClose className="h-5 w-5" /></button><a href="#top" onClick={close} className="public-v2-header__brand"><img src={simbaMark} alt="" /><span>SIMBA</span></a><nav>{NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={close}>{link.label}</a>)}</nav><a href="#business-audit" onClick={close} className="public-v2-button">Посчитать потери</a></div>}
  </>
}
