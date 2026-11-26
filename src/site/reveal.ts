import gsap from 'gsap'

/*
 * How the words arrive and leave in every section (one place, so the whole page moves the same way):
 * - in: letters flip up out of each line's mask one after another, the kicker's red rule draws,
 *   then the paragraph and buttons fade up;
 * - out: before the next scene starts dissolving, the words drift up, blur and fade (tied to scroll),
 *   so two headlines are never on screen together.
 */
export function letters(scope: Element | Document) {
  return gsap.timeline()
    .fromTo(scope.querySelectorAll('.ch'), { yPercent: 120, rotateX: -90, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: { each: 0.018, from: 'start' } })
}

export function revealCopy(section: HTMLElement, start = 'top 35%') {
  const el = section.querySelector('.copy')!
  const q = gsap.utils.selector(el)
  gsap.timeline({ scrollTrigger: { trigger: section, start, toggleActions: 'play none none reverse' } })
    .add(letters(el), 0)
    .fromTo(q('.kicker'), { opacity: 0, x: -12, '--rule': 0 }, { opacity: 1, x: 0, '--rule': 1, duration: 1, ease: 'power3.inOut' }, 0)
    .fromTo(q('.lead, .actions, .paints, .paints__name'), { y: 18, opacity: 0, filter: 'blur(6px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', stagger: 0.08 }, 0.4)

  gsap.fromTo(el, { y: 0, opacity: 1, filter: 'blur(0px)' }, {
    y: -70, opacity: 0, filter: 'blur(10px)', ease: 'power1.in', immediateRender: false,
    scrollTrigger: { trigger: section, start: 'bottom 90%', end: 'bottom 55%', scrub: true },
  })
}
