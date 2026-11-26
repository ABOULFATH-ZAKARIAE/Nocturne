import { afterEach, describe, expect, it, vi } from 'vitest'
import { finePointer, markReady, ready, reducedMotion } from './ready'

const stubMedia = (matching: string[]) => {
  const matchMedia = vi.fn((q: string) => ({ matches: matching.includes(q), media: q }))
  vi.stubGlobal('matchMedia', matchMedia)
  return matchMedia
}

afterEach(() => vi.unstubAllGlobals())

describe('ready', () => {
  it('stays pending until markReady is called, then resolves', async () => {
    let settled = false
    void ready.then(() => { settled = true })
    await Promise.resolve()
    expect(settled).toBe(false)
    markReady()
    await expect(ready).resolves.toBeUndefined()
    expect(settled).toBe(true)
  })

  it('can be marked twice without error', async () => {
    markReady()
    markReady()
    await expect(ready).resolves.toBeUndefined()
  })
})

describe('media helpers', () => {
  it('finePointer reads the hover/fine-pointer query', () => {
    const mm = stubMedia(['(hover: hover) and (pointer: fine)'])
    expect(finePointer()).toBe(true)
    expect(mm).toHaveBeenCalledWith('(hover: hover) and (pointer: fine)')
  })

  it('finePointer is false on touch screens', () => {
    stubMedia([])
    expect(finePointer()).toBe(false)
  })

  it('reducedMotion reads prefers-reduced-motion', () => {
    const mm = stubMedia(['(prefers-reduced-motion: reduce)'])
    expect(reducedMotion()).toBe(true)
    expect(mm).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('reducedMotion is false by default', () => {
    stubMedia([])
    expect(reducedMotion()).toBe(false)
  })
})
