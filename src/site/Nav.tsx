import { useEffect, useState } from 'react'

import { BRAND } from './content'

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: string, o?: object) => void } }).lenis
  if (lenis) lenis.scrollTo(id, { duration: 1.6 })
  else document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

/** Thin top bar. Slides away while you scroll down, comes back when you scroll up. */
export function Nav() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const on = () => { const y = window.scrollY; setHidden(y > last && y > 120); last = y }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      {/* first focusable element on the page: lets keyboard users jump past the nav */}
      <a href="#main" className="skip">Skip to content</a>
      {/* a link that receives keyboard focus brings the bar back, so focus is never on something invisible */}
      <header className={`nav${hidden ? ' nav--hidden' : ''}`} onFocus={() => setHidden(false)}>
        <a href="#top" className="nav__logo" onClick={go('#top')}>{BRAND.logo[0]}<span>{BRAND.logo[1]}</span></a>
        <nav className="nav__links" aria-label="Sections">
          {BRAND.nav.map(([href, label]) => <a key={href} href={href} onClick={go(href)}>{label}</a>)}
        </nav>
        <a href="#book" className="btn btn--small" onClick={go('#book')}>{BRAND.navCta}</a>
      </header>
    </>
  )
}
