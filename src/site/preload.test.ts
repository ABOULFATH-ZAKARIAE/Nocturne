import { describe, expect, it } from 'vitest'
import { GALLERY, PAINTS, SCENES } from './content'
import { filmUrls } from './preload'

describe('filmUrls', () => {
  it('has no duplicates', () => {
    const urls = filmUrls(false)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('uses the desktop picture of the opening shot on a wide screen', () => {
    const urls = filmUrls(false)
    expect(urls).toContain('/film/hero-d.webp')
    expect(urls).not.toContain('/film/hero-m.webp')
  })

  it('uses hero-m instead of hero-d on a phone', () => {
    const urls = filmUrls(true)
    expect(urls).toContain('/film/hero-m.webp')
    expect(urls).not.toContain('/film/hero-d.webp')
  })

  it('includes the smoke photo, last', () => {
    for (const phone of [true, false]) expect(filmUrls(phone).at(-1)).toBe('/film/smoke.webp')
  })

  it('covers every scene, paint and gallery picture', () => {
    const urls = filmUrls(false)
    for (const image of [...SCENES.map((s) => s.image), ...PAINTS.map((p) => p.image), ...GALLERY.map((g) => g.image)]) {
      expect(urls).toContain(`/film/${image}-d.webp`)
    }
  })

  it('only points into /film as webp', () => {
    for (const u of filmUrls(true)) expect(u).toMatch(/^\/film\/[a-z-]+\.webp$/)
  })
})
