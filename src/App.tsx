import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'
import SimbaAppShell from './components/master/SimbaAppShell'
import CookieBanner from './components/CookieBanner'
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

// One responsive shell keeps in-progress answers mounted across resize.
function HomePage() {
  return <SimbaAppShell />
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
