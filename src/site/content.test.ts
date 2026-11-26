import { describe, expect, it } from 'vitest'
import * as content from './content'
import { CHAPTERS, GALLERY, INDEX, PAINTS, SCENES } from './content'

// Only the file NAMES are read (the loaders are never called), so no Node types are needed.
const files = new Set(Object.keys(import.meta.glob('/public/film/*.webp')).map((p) => p.split('/').pop()))
const hasFile = (file: string) => files.has(file)
const sources = import.meta.glob('./*.tsx', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

// every section id that really exists in the page markup (id="...") plus the chapter ids
const sectionIds = (): Set<string> => {
  const ids = new Set<string>(CHAPTERS.map((c) => c.id))
  for (const src of Object.values(sources)) {
    for (const m of src.matchAll(/\bid="([a-z-]+)"/g)) ids.add(m[1])
  }
  return ids
}

// every string reachable in the exports (arrays, objects, tuples)
const strings = (v: unknown): string[] => {
  if (typeof v === 'string') return [v]
  if (Array.isArray(v)) return v.flatMap(strings)
  if (v && typeof v === 'object') return Object.values(v).flatMap(strings)
  return []
}

describe('content integrity', () => {
  it('has a picture file for every scene, paint and gallery item', () => {
    const names = [...SCENES.map((s) => s.image), ...PAINTS.map((p) => p.image), ...GALLERY.map((g) => g.image)]
    const missing = names.filter((n) => !hasFile(`${n}-d.webp`))
    expect(missing).toEqual([])
  })

  it('has the phone picture for scenes marked phone', () => {
    for (const s of SCENES.filter((x) => x.phone)) {
      expect(hasFile(`${s.image}-m.webp`)).toBe(true)
    }
  })

  it('has the smoke photo', () => {
    expect(hasFile('smoke.webp')).toBe(true)
  })

  it('uses unique scene ids', () => {
    const ids = SCENES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('points every chapter at an existing scene', () => {
    const ids = new Set(SCENES.map((s) => s.id))
    for (const c of CHAPTERS) expect(ids.has(c.scene), `${c.id} -> ${c.scene}`).toBe(true)
  })

  it('uses unique chapter ids', () => {
    const ids = CHAPTERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('points every index entry at a real section id', () => {
    const ids = sectionIds()
    for (const [id] of INDEX) expect(ids.has(id), `index id ${id}`).toBe(true)
  })

  it('gives every index entry a label and lists each id once', () => {
    expect(new Set(INDEX.map(([id]) => id)).size).toBe(INDEX.length)
    for (const [, label] of INDEX) expect(label.trim()).not.toBe('')
  })

  it('has unique paint ids', () => {
    const ids = PAINTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no empty strings anywhere in the content', () => {
    const all = Object.values(content).flatMap(strings)
    expect(all.length).toBeGreaterThan(50)
    expect(all.filter((s) => s.trim() === '')).toEqual([])
  })
})
