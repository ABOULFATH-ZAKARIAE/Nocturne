import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { INDEX as ITEMS } from './content'

/*
 * Right-edge index of the film (desktop): one tick per section, the current one lit and labelled,
 * plus a thin line that fills as you go down the page. Clicking a tick glides to that section.
 */

export function ChapterIndex() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sts = ITEMS.map(([id], i) => ScrollTrigger.create({
      trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => { if (self.isActive) setActive(i) },
    }))
    const all = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => setProgress(s.progress) })
    return () => { sts.forEach((s) => s.kill()); all.kill() }
  }, [])

  const go = (id: string) => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: string, o?: object) => void } }).lenis
    lenis?.scrollTo(`#${id}`, { duration: 1.8 })
  }

  return (
    <nav className="index" aria-label="Sections">
      <span className="index__fill" style={{ transform: `scaleY(${progress})` }} aria-hidden />
      {ITEMS.map(([id, label], i) => (
        <button key={id} className={`index__item${i === active ? ' is-on' : ''}`} onClick={() => go(id)} aria-label={label}>
          <span className="index__label">{String(i + 1).padStart(2, '0')} {label}</span>
          <span className="index__tick" />
        </button>
      ))}
    </nav>
  )
}
