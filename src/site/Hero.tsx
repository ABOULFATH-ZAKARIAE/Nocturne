import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { BRAND, HERO } from './content'
import { Lines } from './Split'
import { letters } from './reveal'
import { ready } from './ready'

/**
 * Opening words. The picture itself lives in the Stage (behind the page). On load the headline rises
 * line by line once the garage lights have flickered on; on scroll the words drift up and fade.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.ch', { yPercent: 120, opacity: 0 })
      gsap.set('.kicker, .lead, .actions > *, .scrollcue, .hero__hint', { opacity: 0 })
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' }, delay: 0.7 })
        .add(letters(root.current!), 0)
        .fromTo('.kicker', { '--rule': 0, opacity: 0 }, { '--rule': 1, opacity: 1, duration: 1, ease: 'power3.inOut' }, 0.1)
        .fromTo('.lead, .actions > *', { y: 18, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power2.out' }, 0.5)
        .to('.scrollcue, .hero__hint', { opacity: 1, duration: 1 }, 1.2)
      ready.then(() => intro.play())
      gsap.to('.copy', { yPercent: -25, opacity: 0, filter: 'blur(10px)', ease: 'power1.in',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '55% top', scrub: true } })
      gsap.to('.scrollcue, .hero__hint', { autoAlpha: 0, scrollTrigger: { trigger: root.current, start: 'top top', end: '15% top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root} data-scene="hero">
      <div className="copy">
        <p className="kicker">{HERO.kicker}</p>
        <h1 className="display">
          <Lines lines={HERO.title} />
        </h1>
        <p className="lead">{HERO.text}</p>
        <div className="actions">
          <a className="btn" href="#book">{HERO.cta}</a>
          <a className="btn btn--ghost" href="#paint">{HERO.cta2}</a>
        </div>
      </div>
      <p className="hero__hint" aria-hidden>{BRAND.hint}</p>
      <div className="scrollcue" aria-hidden><span /></div>
    </section>
  )
}
