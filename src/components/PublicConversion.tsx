import { useEffect, useState } from 'react'
import IdeaLeadMagnet from './IdeaLeadMagnet'

const isIdeaHash = () => window.location.hash === '#idea'

// Idea flow is on-demand only — it must not become a permanently-expanded
// section (that would silently lengthen the page). Mounted only once the
// hash actually points at #idea, whether from a direct deep link or any of
// the existing "Есть идея?" links elsewhere on the page.
export default function PublicConversion() {
  const [ideaOpen, setIdeaOpen] = useState(isIdeaHash)
  useEffect(() => {
    const sync = () => setIdeaOpen(isIdeaHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => {
    if (!ideaOpen) return
    requestAnimationFrame(() => document.getElementById('idea')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [ideaOpen])

  if (!ideaOpen) return null
  return <IdeaLeadMagnet />
}
