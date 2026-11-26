import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BRAND } from './content'

/*
 * Two rows of giant words racing across the night-drive scene in opposite directions. They always
 * drift; scrolling makes them rush (their speed follows how fast you scroll) and lean into the motion.
 */
const [ROW_A, ROW_B] = BRAND.marquee

export function Marquee() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const rows = gsap.utils.toArray<HTMLElement>('.marquee__row', root.current)
    const pos = [0, 0]
    let skew = 0
    const tick = (_t: number, dt: number) => {
      const lenis = (window as unknown as { lenis?: { velocity: number } }).lenis
      const v = lenis?.velocity ?? 0
      const speed = 0.04 + Math.min(Math.abs(v), 60) * 0.02
      skew += (gsap.utils.clamp(-12, 12, v * 0.4) - skew) * 0.1
      rows.forEach((row, i) => {
        const half = row.scrollWidth / 2
        pos[i] = (pos[i] - speed * dt * (i ? -1 : 1)) % half
        const x = i ? pos[i] - half : pos[i]
        row.style.transform = `translate3d(${(x % half)}px,0,0) skewX(${-skew}deg)`
      })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <section className="marquee" ref={root} data-scene="drive" aria-hidden>
      <div className="marquee__sticky">
        <div className="marquee__row">{ROW_A.repeat(2)}{ROW_A.repeat(2)}</div>
        <div className="marquee__row marquee__row--outline">{ROW_B.repeat(3)}{ROW_B.repeat(3)}</div>
      </div>
    </section>
  )
}
