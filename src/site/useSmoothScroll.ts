import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ready } from './ready'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth, weighted scrolling (Lenis), wired into GSAP so every scroll animation
 * (ScrollTrigger) reads the smoothed position. One clock drives both: GSAP's ticker.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.1, wheelMultiplier: 1.08, touchMultiplier: 1.2 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ;(window as unknown as { lenis?: Lenis }).lenis = lenis
    // the page stays still behind the preloader, then scrolling unlocks
    window.scrollTo(0, 0); lenis.stop()
    ready.then(() => { lenis.start(); ScrollTrigger.refresh() })
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
}
