import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { KEY, PAINTS, type Paint } from './content'
import { revealCopy } from './reveal'
import { Lines } from './Split'

// arrow keys move through the paints like any radio group: forward / back, wrapping at the ends
const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

/** Index of the paint an arrow key leads to, or -1 for any other key. */
function stepPaint(current: number, key: string, count: number): number {
  const step = STEP[key]
  return step === undefined ? -1 : (current + step + count) % count
}

/**
 * Choose the colour. The two rear pictures are the same shot in two paints; the Stage wipes the new
 * colour across the car from left to right, like a light passing over it.
 * The swatches are a radio group: only the chosen one is in the Tab order, arrow keys change the paint.
 */
export function PaintSection({ paint, setPaint }: { paint: Paint; setPaint: (p: Paint) => void }) {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => revealCopy(root.current!), root)
    return () => ctx.revert()
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = stepPaint(PAINTS.findIndex((p) => p.id === paint.id), e.key, PAINTS.length)
    if (next < 0) return
    e.preventDefault()
    setPaint(PAINTS[next])
    e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus()
  }

  return (
    <section className="chapter chapter--left paint-sec" id="paint" ref={root} data-scene="paint">
      <div className="chapter__sticky">
        <div className="copy">
          <p className="kicker">{KEY.kicker}</p>
          <h2 className="display"><Lines lines={KEY.title} /></h2>
          <p className="lead">{KEY.text}</p>
          <div className="paints" role="radiogroup" aria-label="Paint" onKeyDown={onKeyDown}>
            {PAINTS.map((p) => (
              <button key={p.id} role="radio" aria-checked={p.id === paint.id} aria-label={p.name}
                tabIndex={p.id === paint.id ? 0 : -1}
                className={`paint${p.id === paint.id ? ' paint--on' : ''}`} style={{ '--c': p.swatch } as React.CSSProperties}
                onClick={() => setPaint(p)} />
            ))}
          </div>
          <p className="paints__name">{paint.name}</p>
        </div>
      </div>
    </section>
  )
}
