import { fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

// gsap is only needed for motion; the keyboard class logic is what is tested here
vi.mock('gsap', () => ({ default: { quickTo: () => vi.fn(), to: vi.fn() } }))

import { Cursor } from './Cursor'

const root = document.documentElement

const stubMedia = (fine: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('pointer: fine') ? fine : false }))

afterEach(() => {
  vi.unstubAllGlobals()
  root.classList.remove('has-cursor', 'kbd')
})

describe('Cursor keyboard mode', () => {
  it('adds `kbd` on Tab and removes it when the mouse moves', () => {
    stubMedia(true)
    document.elementFromPoint = vi.fn(() => null)
    render(<Cursor />)
    expect(root).toHaveClass('has-cursor')
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(root).toHaveClass('kbd')
    fireEvent(window, new MouseEvent('pointermove', { clientX: 10, clientY: 10 }))
    expect(root).not.toHaveClass('kbd')
  })

  it('ignores other keys', () => {
    stubMedia(true)
    render(<Cursor />)
    fireEvent.keyDown(window, { key: 'a' })
    expect(root).not.toHaveClass('kbd')
  })

  it('cleans both classes on unmount', () => {
    stubMedia(true)
    render(<Cursor />).unmount()
    expect(root).not.toHaveClass('has-cursor')
    expect(root).not.toHaveClass('kbd')
  })

  it('does nothing on touch screens', () => {
    stubMedia(false)
    render(<Cursor />)
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(root).not.toHaveClass('has-cursor')
    expect(root).not.toHaveClass('kbd')
  })
})
