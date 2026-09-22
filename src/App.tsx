import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'
import Footer from './components/Footer'
import NicheCases from './components/NicheCases'
import CookieBanner from './components/CookieBanner'
import Header from './components/Header'
import Hero from './components/Hero'
import LossCalculator from './components/LossCalculator'
import PublicValueCards from './components/PublicValueCards'
import BeautyCoreSection from './components/BeautyCoreSection'
import PublicFinalCta from './components/PublicFinalCta'
import PublicConversion from './components/PublicConversion'
import Consent from './legal/Consent'
import Cookies from './legal/Cookies'
import Privacy from './legal/Privacy'
import Terms from './legal/Terms'
import { captureUtmFromUrl } from './lib/audit/utm'
import './public-v2.css'

const LEGAL_PAGES: Record<string, () => JSX.Element> = {
  '/privacy': Privacy,
  '/consent': Consent,
  '/terms': Terms,
  '/cookies': Cookies,
}

function HomePage() {
  // Links from the legal pages (and any full page load) arrive as /#section —
  // the browser can't scroll to a fragment that doesn't exist in the DOM yet,
  // since React renders it only after this component mounts.
  useEffect(() => {
    if (!window.location.hash) return
    const id = window.location.hash.slice(1)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="public-v2 min-h-screen bg-bg-main text-text-main">
      <Header />
      <main id="top">
        <Hero />
        <LossCalculator />
        <PublicValueCards />
        <div className="public-v2-cases"><NicheCases /></div>
        <BeautyCoreSection />
        <PublicFinalCta />
        <section className="public-v2-lead-zone"><PublicConversion /></section>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const LegalPage = LEGAL_PAGES[path]

  // Captured once per load so a campaign link's UTM params survive into the
  // calculator section and, later, into a submitted lead — even on pages that
  // don't carry the query string themselves.
  useEffect(() => {
    captureUtmFromUrl()
  }, [])

  // The old audit used to live on its own /audit page; that section is now
  // the loss calculator, still inline on the homepage — so old links redirect
  // straight to it instead of 404ing.
  useEffect(() => {
    if (path === '/audit') {
      window.location.replace('/#business-audit')
    }
  }, [path])

  if (path === '/audit') return null

  return (
    <>
      {LegalPage ? <LegalPage /> : <HomePage />}
      <CookieBanner />
      <Analytics />
    </>
  )
}

export default App
