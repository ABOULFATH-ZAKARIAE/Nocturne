import { GALLERY, PAINTS, SCENES } from './content'

/**
 * Every picture the preloader downloads before the curtain opens: one per scene (the phone
 * crop of the opening shot on portrait screens), both paints, the gallery, and the smoke photo.
 * Names are de-duplicated so a picture used twice is only fetched once.
 */
export function filmUrls(isPhone: boolean): string[] {
  const names = new Set<string>([
    ...SCENES.map((s) => (s.phone && isPhone ? `${s.image}-m` : `${s.image}-d`)),
    ...PAINTS.map((p) => `${p.image}-d`),
    ...GALLERY.map((g) => `${g.image}-d`),
  ])
  return [...names].map((n) => `/film/${n}.webp`).concat('/film/smoke.webp')
}
