import { Analytics } from '@vercel/analytics/react'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import NicheCases from './components/NicheCases'
import LeadForm from './components/LeadForm'
import CookieBanner from './components/CookieBanner'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import StatusBar from './components/StatusBar'
import WhatWeCreate from './components/WhatWeCreate'
import WhyProfitable from './components/WhyProfitable'
import Consent from './legal/Consent'
import Cookies from './legal/Cookies'
import Privacy from './legal/Privacy'
import Terms from './legal/Terms'

const LEGAL_PAGES: Record<string, () => JSX.Element> = {
  '/privacy': Privacy,
  '/consent': Consent,
  '/terms': Terms,
  '/cookies': Cookies,
}

function HomePage() {
  return (
    <div className="min-h-screen bg-bg-main text-text-main">
      <Header />
      <main>
        <Hero />
        <StatusBar />
        <WhatWeCreate />
        <NicheCases />
        <WhyProfitable />
        <HowItWorks />
        <Pricing />
        <LeadForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const LegalPage = LEGAL_PAGES[path]

  return (
    <>
      {LegalPage ? <LegalPage /> : <HomePage />}
      <CookieBanner />
      <Analytics />
    </>
  )
}

export default App
