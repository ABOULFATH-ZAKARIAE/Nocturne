import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { finePointer, reducedMotion } from './ready'

/*
 * Mouse only (phones keep their normal touch behaviour). The cursor is a camera focus reticle:
 * four corner brackets around a small dot. Over anything clickable the brackets slide out and lock
 * onto it (like a camera finding focus) and turn red; move away and they snap back to the pointer.
 */
const SIZE = 26

export function Cursor() {
  const box = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return
    document.documentElement.classList.add('has-cursor')
    const ease = { duration: 0.35, ease: 'power3' }
    const bx = gsap.quickTo(box.current, 'x', ease), by = gsap.quickTo(box.current, 'y', ease)
    const bw = gsap.quickTo(box.current, 'width', ease), bh = gsap.quickTo(box.current, 'height', ease)
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.06 }), dy = gsap.quickTo(dot.current, 'y', { duration: 0.06 })
    let px = -100, py = -100

    const update = () => {
      dx(px); dy(py)
      const hot = document.elementFromPoint(px, py)?.closest<HTMLElement>('a, button')
      box.current!.classList.toggle('is-locked', !!hot)
      dot.current!.classList.toggle('is-hidden', !!hot)
      if (hot) {
        const r = hot.getBoundingClientRect(), pad = 7
        bx(r.left - pad); by(r.top - pad); bw(r.width + pad * 2); bh(r.height + pad * 2)
      } else {
        bx(px - SIZE / 2); by(py - SIZE / 2); bw(SIZE); bh(SIZE)
      }
    }
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; update() }
    const down = () => box.current!.classList.add('is-down')
    const up = () => box.current!.classList.remove('is-down')
    const leave = () => gsap.to([box.current, dot.current], { opacity: 0, duration: 0.3 })
    const enter = () => gsap.to([box.current, dot.current], { opacity: 1, duration: 0.3 })
    window.addEventListener('pointermove', move)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('pointerdown', down); window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave); document.addEventListener('pointerenter', enter)
    return () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('scroll', update)
      window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave); document.removeEventListener('pointerenter', enter)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="reticle" ref={box} aria-hidden><i /><i /><i /><i /></div>
      <div className="reticle-dot" ref={dot} aria-hidden />
    </>
  )
}
