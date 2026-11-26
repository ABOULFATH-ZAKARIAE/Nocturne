import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SPECS, SPECS_KICKER } from './content'

/** Three big numbers that count up when they come into view. */
export function Specs() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      root.current!.querySelectorAll<HTMLElement>('.spec__value').forEach((el) => {
        const end = parseFloat(el.dataset.v!), dec = el.dataset.v!.includes('.') ? 1 : 0
        const o = { v: 0 }
        gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => { el.textContent = o.v.toFixed(dec) } })
      })
      gsap.from('.spec', { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="specs" id="specs" ref={root} data-scene="specs">
      <p className="kicker">{SPECS_KICKER}</p>
      <div className="specs__grid">
        {SPECS.map((s) => (
          <div className="spec" key={s.label}>
            <p className="spec__num"><span className="spec__value" data-v={s.value}>{s.value}</span><span className="spec__unit">{s.unit}</span></p>
            <p className="spec__label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
