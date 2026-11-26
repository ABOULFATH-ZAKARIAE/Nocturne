import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { GALLERY, GALLERY_HEAD } from './content'
import { Film } from './Film'
import { Lines } from './Split'
import { letters } from './reveal'

/*
 * Gallery strip. The section pins while you keep scrolling down, and the strip of pictures slides
 * sideways instead (vertical scroll -> horizontal motion). Each picture also drifts inside its frame
 * (parallax) and comes into full colour as it reaches the middle of the screen.
 */
export function Gallery() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = root.current!.querySelector<HTMLElement>('.gallery__track')!
      const distance = () => track.scrollWidth - window.innerWidth
      // the section is as tall as the strip is wide, so scrolling down "pays" for the sideways move
      root.current!.style.height = `calc(100svh + ${distance() * 0.75}px)`
      const slide = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      gsap.utils.toArray<HTMLElement>('.gcard').forEach((card) => {
        const st = { trigger: card, containerAnimation: slide, scrub: true }
        gsap.fromTo(card.querySelector('.film'), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left' } })
        gsap.fromTo(card, { filter: 'grayscale(1) brightness(.5)', scale: 0.92 }, { filter: 'grayscale(0) brightness(1)', scale: 1, ease: 'power1.out', scrollTrigger: { ...st, start: 'left 90%', end: 'center 55%' } })
      })
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%', toggleActions: 'play none none reverse' } }).add(letters(root.current!.querySelector('.gallery__head')!))
      const onResize = () => { root.current!.style.height = `calc(100svh + ${distance() * 0.75}px)` }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="gallery" id="gallery" ref={root} data-scene="gallery">
      <div className="gallery__sticky">
        <div className="gallery__track">
          <div className="gallery__head">
            <p className="kicker">{GALLERY_HEAD.kicker}</p>
            <h2 className="display display--sm"><Lines lines={GALLERY_HEAD.title} /></h2>
            <p className="lead">{GALLERY_HEAD.text}</p>
          </div>
          {GALLERY.map((g, i) => (
            <figure className="gcard" key={g.image + i}>
              <div className="gcard__frame"><Film name={g.image} alt={g.title} /></div>
              <figcaption><span className="gcard__n">{String(i + 1).padStart(2, '0')}</span><strong>{g.title}</strong><span>{g.note}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
