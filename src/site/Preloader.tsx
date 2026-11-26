import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BRAND } from './content'
import { filmUrls } from './preload'
import { markReady, reducedMotion } from './ready'

const counter = (n: number) => String(Math.round(n)).padStart(3, '0')

// the way out: counter to 100, the logo flickers like a tube light, the curtain splits open, then the page is ready
function playExit(el: HTMLElement, count: HTMLElement, shown: { v: number }) {
  if (reducedMotion()) { el.remove(); markReady(); return }
  gsap.timeline({ onComplete: () => { el.remove(); markReady() } })
    .to(shown, { v: 100, duration: 0.4, ease: 'power1.out', onUpdate: () => { count.textContent = counter(shown.v) } })
    .to('.pre__logo', { opacity: 0.2, duration: 0.05 }, '+=0.15')
    .to('.pre__logo', { opacity: 1, duration: 0.05 }, '+=0.08')
    .to('.pre__logo', { opacity: 0.3, duration: 0.05 }, '+=0.05')
    .to('.pre__logo', { opacity: 1, duration: 0.05 }, '+=0.12')
    .to('.pre__meta', { opacity: 0, y: 10, duration: 0.4 }, '+=0.2')
    .to('.pre__half--top', { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '<0.1')
    .to('.pre__half--bot', { yPercent: 100, duration: 1.1, ease: 'power4.inOut' }, '<')
    .to('.pre__logo', { opacity: 0, scale: 1.15, filter: 'blur(8px)', duration: 0.7, ease: 'power2.in' }, '<')
}

// the real progress: each loaded picture moves the counter and the bar toward 99%
function showProgress(shown: { v: number }, target: number, count: HTMLElement, bar: HTMLElement) {
  gsap.to(shown, { v: target, duration: 0.5, ease: 'power1.out', overwrite: true,
    onUpdate: () => { count.textContent = counter(shown.v); bar.style.transform = `scaleX(${shown.v / 100})` } })
}

/*
 * Opening curtain. Every picture of the site is downloaded first (the counter is the real progress),
 * so nothing pops in later. Then the logo flickers like a tube light and the black curtain splits
 * open from the middle to reveal the garage.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current!
    const count = el.querySelector<HTMLElement>('.pre__count')!
    const bar = el.querySelector<HTMLElement>('.pre__bar')!
    const urls = filmUrls(window.matchMedia('(max-aspect-ratio: 1/1)').matches)
    const shown = { v: 0 }
    let loaded = 0, done = false

    const finish = () => {
      if (done) return
      done = true
      playExit(el, count, shown)
    }

    const step = () => {
      loaded++
      showProgress(shown, (loaded / urls.length) * 99, count, bar)
      if (loaded >= urls.length) setTimeout(finish, 450)
    }
    urls.forEach((u) => { const i = new Image(); i.onload = i.onerror = step; i.src = u })
    const safety = setTimeout(finish, 9000) // slow network: never trap the visitor behind the curtain
    return () => clearTimeout(safety)
  }, [])

  return (
    <div className="pre" ref={root} aria-hidden>
      <div className="pre__half pre__half--top" />
      <div className="pre__half pre__half--bot" />
      <p className="pre__logo">{BRAND.logo[0]}<span>{BRAND.logo[1]}</span></p>
      <div className="pre__meta">
        <span className="pre__count">000</span>
        <span className="pre__track"><span className="pre__bar" /></span>
        <span>{BRAND.loading}</span>
      </div>
    </div>
  )
}
