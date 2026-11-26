import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { BRAND, FINALE } from './content'
import { Lines } from './Split'
import { letters } from './reveal'

/** Last scene: the car head-on, headlights flickering on, and the one thing to do next. */
export function Finale() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      // plays as soon as the last scene arrives, and stays: the closing words never disappear again
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%', once: true } })
        .add(letters(root.current!), 0)
        .fromTo(q('.lead, .btn'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out' }, 0.4)
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="finale" id="book" ref={root} data-scene="finale">
      <div className="finale__sticky">
        <div className="copy copy--center">
          <h2 className="display"><Lines lines={FINALE.title} /></h2>
          <p className="lead">{FINALE.text}</p>
          <a className="btn" href={`mailto:${BRAND.email}?subject=${encodeURIComponent('Private listening — Nocturne Op. 1')}`}>{FINALE.cta}</a>
        </div>
      </div>
      <footer className="foot">
        <span>© {new Date().getFullYear()} {BRAND.footer[0]}</span>
        <span>{BRAND.footer[1]}</span>
      </footer>
    </section>
  )
}
