import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { revealCopy } from './reveal'
import type { Chapter } from './content'
import { Lines } from './Split'

/**
 * One detail of the car. The picture is in the Stage; this section only carries the words, pinned
 * in place (CSS sticky) while its picture plays behind them.
 */
export function ChapterSection({ c }: { c: Chapter }) {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => revealCopy(root.current!), root)
    return () => ctx.revert()
  }, [])

  return (
    <section className={`chapter chapter--${c.align}`} id={c.id} ref={root} data-scene={c.scene}>
      <div className="chapter__sticky">
        <div className="copy">
          <p className="kicker">{c.kicker}</p>
          <h2 className="display"><Lines lines={c.title} /></h2>
          <p className="lead">{c.text}</p>
        </div>
      </div>
    </section>
  )
}
