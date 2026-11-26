import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { KEY, PAINTS, type Paint } from './content'
import { revealCopy } from './reveal'
import { Lines } from './Split'

/**
 * Choose the colour. The two rear pictures are the same shot in two paints; the Stage wipes the new
 * colour across the car from left to right, like a light passing over it.
 */
export function PaintSection({ paint, setPaint }: { paint: Paint; setPaint: (p: Paint) => void }) {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => revealCopy(root.current!), root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="chapter chapter--left paint-sec" id="paint" ref={root} data-scene="paint">
      <div className="chapter__sticky">
        <div className="copy">
          <p className="kicker">{KEY.kicker}</p>
          <h2 className="display"><Lines lines={KEY.title} /></h2>
          <p className="lead">{KEY.text}</p>
          <div className="paints" role="radiogroup" aria-label="Paint">
            {PAINTS.map((p) => (
              <button key={p.id} role="radio" aria-checked={p.id === paint.id} aria-label={p.name}
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
