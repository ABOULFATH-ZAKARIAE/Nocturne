/*
 * "The page is ready" signal. The preloader calls markReady() when every picture has loaded and its
 * exit animation has finished; intro animations and smooth scrolling wait for `ready` before starting.
 */
let resolve!: () => void
export const ready = new Promise<void>((r) => { resolve = r })
export const markReady = () => resolve()

/** true on a real mouse/trackpad (not a phone), and when the visitor has not asked for less motion */
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
