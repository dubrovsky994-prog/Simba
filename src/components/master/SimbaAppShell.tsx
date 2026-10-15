import { useCallback, useEffect, useRef, useState } from 'react'
import SimbaSidebar from './SimbaSidebar'
import { type WorkspaceState } from './navigation'
import HeroEditorialScene from './HeroEditorialScene'
import ProductModuleCard from './ProductModuleCard'
import GrowthPath from './GrowthPath'
import SimbaWorkspace from './SimbaWorkspace'
import MasterIcon from './MasterIcon'
import PresentationDialog from './PresentationDialog'
import BeautyCoreDemo from '../BeautyCoreDemo'
import LeadForm from '../LeadForm'
import IdeaLeadMagnet from '../IdeaLeadMagnet'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '../../legal/content'
import lionMark from '../../assets/simba/brand/simba-mark-original.png'
import { openBeautyDemo, type BeautyDemoEntry } from '../../lib/beauty/demoBridge'

const HASH_STATES: Record<string, WorkspaceState> = { '#top': 'home', '#home': 'home', '#solutions': 'solutions', '#for-whom': 'cases', '#cases': 'cases', '#beauty-core-title': 'beauty', '#beauty': 'beauty', '#ai': 'ai', '#business-audit': 'diagnostics', '#diagnostics': 'diagnostics', '#contacts': 'contacts', '#library': 'library', '#pricing': 'pricing', '#about': 'about', '#how-we-help': 'home' }
const initialState = () => HASH_STATES[window.location.hash] ?? 'home'
type DialogState = 'lead' | 'idea' | null

export default function SimbaAppShell() {
  const [active, setActive] = useState<WorkspaceState>(initialState)
  const [visited, setVisited] = useState<WorkspaceState[]>(() => [initialState()])
  const [dialog, setDialog] = useState<DialogState>(() => window.location.hash === '#idea' ? 'idea' : null)
  const [beautyEntry, setBeautyEntry] = useState<BeautyDemoEntry | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [menuOpen])
  const select = useCallback((state: WorkspaceState) => {
    setActive(state)
    setVisited(items => items.includes(state) ? items : [...items, state])
    setMenuOpen(false)
  }, [])
  const navigate = (state: WorkspaceState) => {
    select(state)
    window.history.replaceState(null, '', `#${state === 'diagnostics' ? 'business-audit' : state}`)
  }
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#idea') setDialog('idea')
      else if (HASH_STATES[window.location.hash]) { setDialog(null); select(HASH_STATES[window.location.hash]) }
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [select])
  const closeDialog = () => {
    setDialog(null)
    if (window.location.hash === '#idea') window.history.replaceState(null, '', `#${active}`)
  }
  return <div className={`simba-master master-state--${active}${menuOpen ? ' master-menu-open' : ''}`}>
    <button ref={menuToggleRef} className="master-menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="master-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}<span>SIMBA</span></button>
    {menuOpen && <button className="master-menu-backdrop" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
    <SimbaSidebar active={active} onSelect={navigate} />
    <main className="master-canvas" id="top">
      <div className="master-canvas-art" aria-hidden="true" />
      {active !== 'home' && <header className="master-function-masthead"><button onClick={() => navigate('home')} className="master-function-brand" aria-label="SIMBA — вернуться на главную"><img src={lionMark} alt="" /><span><strong>SIMBA</strong><small>СИСТЕМЫ<br />РОСТА БИЗНЕСА</small></span></button><p>БОЛЬШЕ ВОЗМОЖНОСТЕЙ.<br />БОЛЬШЕ ЖИЗНИ.</p><button className="master-function-close" aria-label="Вернуться на главную" onClick={() => navigate('home')}>×</button></header>}
      <header className="master-topbar"><p>СИСТЕМЫ РОСТА<br />БИЗНЕСА</p><a className="master-space-entry" href="https://app.simbasystems.ru/login">В моё пространство<MasterIcon name="arrow" /></a><button className="master-button" onClick={() => setDialog('lead')}>Оставить заявку<MasterIcon name="arrow" /></button></header>
      <section className="master-home" hidden={active !== 'home'} aria-label="Главная SIMBA">
        <HeroEditorialScene />
        <span className="master-scene-note master-scene-note--system">Системный<br />бизнес сегодня.<br />Больше жизни<br />завтра.</span><span className="master-scene-note master-scene-note--horizons">Новые<br />горизонты<br />вашего бизнеса</span><span className="master-scene-index">ИДЕИ<br />ЛЮДИ<br />ТЕХНОЛОГИИ<br />РЕЗУЛЬТАТЫ</span>
        <div className="master-products"><ProductModuleCard kind="calculator" onOpen={() => navigate('diagnostics')} /><ProductModuleCard kind="beauty" onOpen={() => setBeautyEntry(openBeautyDemo())} /></div>
      </section>
      <SimbaWorkspace active={active} visited={visited} onSelect={navigate} onBeauty={(entry) => setBeautyEntry(openBeautyDemo(entry))} onLead={() => setDialog('lead')} onIdea={() => setDialog('idea')} />
      <GrowthPath onExplore={() => navigate('solutions')} />
      <footer className="master-footer"><span>© {new Date().getFullYear()} SIMBA</span><a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><div><a href="/privacy">Конфиденциальность</a><a href="/consent">Согласие</a><a href="/terms">Условия</a><a href="/cookies">Cookies</a></div><small>Информация не является публичной офертой.</small></footer>
    </main>
    {beautyEntry && <BeautyCoreDemo entry={beautyEntry} onClose={() => setBeautyEntry(null)} />}
    {dialog && <PresentationDialog title={dialog === 'lead' ? 'Оставить заявку' : 'Разобрать идею'} onClose={closeDialog}>{dialog === 'lead' ? <LeadForm /> : <IdeaLeadMagnet />}</PresentationDialog>}
  </div>
}
