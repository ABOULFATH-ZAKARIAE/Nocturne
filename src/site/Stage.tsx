import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { PAINTS, SCENES, type Paint } from './content'
import { Film } from './Film'
import { finePointer, ready, reducedMotion } from './ready'

type LayerOf = (id: string) => HTMLElement

// camera drift while a section is on screen
function driftCamera(sec: HTMLElement, cur: HTMLElement) {
  gsap.fromTo(cur.querySelectorAll('.film'), { scale: 1.04, yPercent: 0 }, {
    scale: 1.12, yPercent: -2, ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
  })
}

// the dissolve: old picture blurs and sinks into the dark, smoke sweeps through, new one focuses
function dissolve(sec: HTMLElement, cur: HTMLElement, prev: HTMLElement) {
  gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 30%', scrub: 0.8 } })
    .fromTo(cur, { autoAlpha: 0, scale: 1.14, filter: 'blur(18px) brightness(0.35)' },
      { autoAlpha: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 1, ease: 'power1.inOut' }, 0)
    .to(prev, { scale: 1.1, filter: 'blur(16px) brightness(0.25)', duration: 1, ease: 'power1.in' }, 0)
    .fromTo('.veil--a', { opacity: 0, xPercent: -18, yPercent: 12, rotate: -4 }, { opacity: 0.5, xPercent: 0, yPercent: 0, rotate: 0, duration: 0.5, ease: 'sine.out' }, 0)
    .to('.veil--a', { opacity: 0, xPercent: 18, yPercent: -12, rotate: 4, duration: 0.5, ease: 'sine.in' }, 0.5)
    .fromTo('.veil--b', { opacity: 0, xPercent: 20, yPercent: 18, scale: 1.3 }, { opacity: 0.35, xPercent: 0, yPercent: 0, scale: 1.1, duration: 0.55, ease: 'sine.out' }, 0.1)
    .to('.veil--b', { opacity: 0, xPercent: -20, yPercent: -18, scale: 1, duration: 0.45, ease: 'sine.in' }, 0.65)
    .set(prev, { autoAlpha: 0 }, 1) // hidden once covered, so the browser only paints what you see
}

// for every section: camera drift, and the dissolve from the previous section's picture
function addSceneTransitions(sections: HTMLElement[], layer: LayerOf) {
  sections.forEach((sec, i) => {
    const cur = layer(sec.dataset.scene!)
    driftCamera(sec, cur)
    if (i === 0) return
    const prev = layer(sections[i - 1].dataset.scene!)
    if (prev === cur) return // same picture continues (e.g. the marquee over the night drive)
    dissolve(sec, cur, prev)
  })
}

// a strip of light running along the body as you scroll past the profile
function addSweep(sections: HTMLElement[]) {
  const sweepSec = sections.find((s) => s.dataset.scene === 'profile')
  if (sweepSec) gsap.fromTo('.fx-sweep', { xPercent: -120 }, { xPercent: 120, ease: 'none', scrollTrigger: { trigger: sweepSec, start: 'top 40%', end: 'bottom 40%', scrub: true } })
}

// night drive: the picture slides sideways faster than the page
function addDriveSlide(sections: HTMLElement[], layer: LayerOf) {
  const driveSecs = sections.filter((s) => s.dataset.scene === 'drive')
  if (driveSecs.length) gsap.fromTo(layer('drive').querySelector('.film'), { xPercent: 5 }, { xPercent: -6, ease: 'none',
    scrollTrigger: { trigger: driveSecs[0], endTrigger: driveSecs[driveSecs.length - 1], start: 'top bottom', end: 'bottom top', scrub: true } })
}

// lights flicker on when their scene arrives (fluorescent tubes / headlights warming up)
function addLightFlickers(sections: HTMLElement[], layer: LayerOf) {
  sections.forEach((sec) => {
    const sc = SCENES.find((s) => s.id === sec.dataset.scene)
    if (sc?.fx !== 'lights' || sec.dataset.scene === 'hero') return
    const img = layer(sc.id).querySelector('.film')
    gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 30%', toggleActions: 'play none none reset' } })
      .fromTo(img, { filter: 'brightness(0.35)' }, { filter: 'brightness(1.25)', duration: 0.06 })
      .to(img, { filter: 'brightness(0.45)', duration: 0.08 })
      .to(img, { filter: 'brightness(1.15)', duration: 0.05 }, '+=0.12')
      .to(img, { filter: 'brightness(1)', duration: 0.6, ease: 'power2.out' })
  })
}

// opening (after the preloader): the garage lights stutter on, then the camera settles
function addIntro() {
  const hero = '[data-layer="hero"] .film'
  gsap.set(hero, { filter: 'brightness(0)' })
  gsap.set('.torch', { opacity: 0 })
  const intro = gsap.timeline({ paused: true })
    .to(hero, { filter: 'brightness(0.9)', duration: 0.07 })
    .to(hero, { filter: 'brightness(0.1)', duration: 0.1 })
    .to(hero, { filter: 'brightness(1.1)', duration: 0.06 }, '+=0.18')
    .to(hero, { filter: 'brightness(0.3)', duration: 0.08 })
    .to(hero, { filter: 'brightness(1)', duration: 1.2, ease: 'power2.out' }, '+=0.1')
    .from('[data-layer="hero"]', { scale: 1.12, duration: 2.6, ease: 'power3.out' }, 0)
    .to('.torch', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 1)
  ready.then(() => intro.play())
}

// every scroll-driven animation of the stage, in the order they were always created
function buildScrollScenes(stage: HTMLElement) {
  const layer: LayerOf = (id) => stage.querySelector<HTMLElement>(`[data-layer="${id}"]`)!
  const sections = gsap.utils.toArray<HTMLElement>(document.querySelectorAll('[data-scene]'))
  gsap.set('.stage__layer', { autoAlpha: 0, scale: 1, filter: 'blur(0px) brightness(1)' })
  gsap.set(layer(sections[0].dataset.scene!), { autoAlpha: 1 })

  addSceneTransitions(sections, layer)
  addSweep(sections)
  addDriveSlide(sections, layer)
  addLightFlickers(sections, layer)

  // torch: fades away as you leave the opening scene
  gsap.to('.torch', { opacity: 0, ease: 'none', scrollTrigger: { trigger: sections[0], start: 'top top', end: '60% top', scrub: true } })

  addIntro()
}

// mouse: the torch follows the pointer and the camera leans toward it. Returns the cleanup.
function followPointer(pos: { x: number; y: number }, cam: HTMLElement, paintTorch: () => void): () => void {
  const tx = gsap.quickTo(pos, 'x', { duration: 0.6, ease: 'power3', onUpdate: paintTorch })
  const ty = gsap.quickTo(pos, 'y', { duration: 0.6, ease: 'power3', onUpdate: paintTorch })
  const cx = gsap.quickTo(cam, 'xPercent', { duration: 1.2, ease: 'power3' })
  const cy = gsap.quickTo(cam, 'yPercent', { duration: 1.2, ease: 'power3' })
  const move = (e: PointerEvent) => {
    tx(e.clientX); ty(e.clientY)
    cx((e.clientX / window.innerWidth - 0.5) * -1.6); cy((e.clientY / window.innerHeight - 0.5) * -1.6)
  }
  window.addEventListener('pointermove', move)
  return () => window.removeEventListener('pointermove', move)
}

// phones: a slow automatic sweep of the torch instead of a pointer. Returns the cleanup.
function sweepTorch(pos: { x: number; y: number }, paintTorch: () => void): () => void {
  const sweep = gsap.to(pos, { x: window.innerWidth * 0.3, y: window.innerHeight * 0.62, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, onUpdate: paintTorch })
  return () => { sweep.kill() }
}

// pointer: camera lean + torch position. Phones get a slow automatic sweep of the torch instead.
function moveTorch(stage: HTMLElement): () => void {
  const torch = stage.querySelector<HTMLElement>('.torch')!
  const cam = stage.querySelector<HTMLElement>('.stage__cam')!
  const pos = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.5 }
  const paintTorch = () => { torch.style.setProperty('--x', `${pos.x}px`); torch.style.setProperty('--y', `${pos.y}px`) }
  paintTorch()
  if (finePointer() && !reducedMotion()) return followPointer(pos, cam, paintTorch)
  if (!reducedMotion()) return sweepTorch(pos, paintTorch)
  return () => {}
}

/*
 * The film behind the page: every picture sits in one fixed, full-screen stage. Each section of the
 * page carries data-scene="<id>"; when the next section scrolls in, the stage dissolves to its
 * picture through moving smoke (blur + dim out, blur + brighten in), so there are no hard cuts.
 *
 * Extra layers, back to front:
 *  - camera: the whole stage leans slightly toward the mouse (depth, like a handheld camera);
 *  - floor smoke: a thin band of real smoke always drifting low across every scene;
 *  - torch: on the opening scene the room is dark except around your pointer ("lit only for you");
 *  - veil: two sheets of smoke that sweep through the frame only during a dissolve.
 */
export function Stage({ paint }: { paint: Paint }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => buildScrollScenes(root.current!), root)
    const stopTorch = moveTorch(root.current!)
    return () => { stopTorch(); ctx.revert() }
  }, [])

  return (
    <div className="stage" ref={root} aria-hidden>
      <div className="stage__cam">
        {SCENES.map((s) => (
          <div className={`stage__layer${s.fx === 'dim' ? ' stage__layer--dim' : ''}`} data-layer={s.id} key={s.id}>
            {s.fx === 'paint'
              ? PAINTS.map((p) => (
                  <Film key={p.id} name={p.image} alt="" focus={s.focus} eager
                    className={`film film--paint${p.id === paint.id ? ' is-on' : ''}`} />
                ))
              : <Film name={s.image} alt="" focus={s.focus} phone={s.phone} eager priority={s.id === 'hero'} />}
            {s.fx === 'sweep' && <div className="fx-sweep" />}
            {s.fx === 'drive' && <div className="fx-streaks" />}
          </div>
        ))}
      </div>
      <div className="smoke-floor" />
      <div className="torch" />
      <div className="veil veil--a"><span /></div>
      <div className="veil veil--b"><span /></div>
      <div className="stage__shade" />
    </div>
  )
}
