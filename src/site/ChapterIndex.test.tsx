import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { INDEX } from './content'

type Config = { trigger?: string; onToggle?: (s: { isActive: boolean }) => void; onUpdate?: (s: { progress: number }) => void }

// gsap's ScrollTrigger needs a real layout engine; here we only record what the component asks for
const created: { config: Config; kill: ReturnType<typeof vi.fn> }[] = []
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: (config: Config) => {
      const kill = vi.fn()
      created.push({ config, kill })
      return { kill }
    },
  },
}))

import { ChapterIndex } from './ChapterIndex'

beforeEach(() => { created.length = 0 })
afterEach(() => { delete (window as unknown as { lenis?: unknown }).lenis })

describe('ChapterIndex', () => {
  it('renders one labelled button per index item', () => {
    render(<ChapterIndex />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(INDEX.length)
    INDEX.forEach(([, label], i) => {
      expect(buttons[i]).toHaveAccessibleName(label)
      expect(buttons[i]).toHaveTextContent(`${String(i + 1).padStart(2, '0')} ${label}`)
    })
  })

  it('creates one trigger per section plus one for the whole page', () => {
    render(<ChapterIndex />)
    expect(created).toHaveLength(INDEX.length + 1)
    expect(created[0].config.trigger).toBe(`#${INDEX[0][0]}`)
  })

  it('lights the first item at the start', () => {
    render(<ChapterIndex />)
    expect(screen.getAllByRole('button')[0]).toHaveClass('is-on')
  })

  it('lights the section that becomes active', () => {
    render(<ChapterIndex />)
    act(() => created[3].config.onToggle!({ isActive: true }))
    const buttons = screen.getAllByRole('button')
    expect(buttons[3]).toHaveClass('is-on')
    expect(buttons[0]).not.toHaveClass('is-on')
  })

  it('ignores a section that becomes inactive', () => {
    render(<ChapterIndex />)
    act(() => created[3].config.onToggle!({ isActive: false }))
    expect(screen.getAllByRole('button')[0]).toHaveClass('is-on')
  })

  it('fills the line with the page progress', () => {
    const { container } = render(<ChapterIndex />)
    act(() => created[INDEX.length].config.onUpdate!({ progress: 0.5 }))
    expect(container.querySelector('.index__fill')).toHaveStyle({ transform: 'scaleY(0.5)' })
  })

  it('glides to the section with lenis when a button is clicked', () => {
    const lenis = { scrollTo: vi.fn() }
    ;(window as unknown as { lenis: typeof lenis }).lenis = lenis
    render(<ChapterIndex />)
    fireEvent.click(screen.getByRole('button', { name: INDEX[2][1] }))
    expect(lenis.scrollTo).toHaveBeenCalledWith(`#${INDEX[2][0]}`, { duration: 1.8 })
  })

  it('does nothing when lenis is not there yet', () => {
    render(<ChapterIndex />)
    expect(() => fireEvent.click(screen.getAllByRole('button')[0])).not.toThrow()
  })

  it('kills every trigger on unmount', () => {
    render(<ChapterIndex />).unmount()
    for (const t of created) expect(t.kill).toHaveBeenCalledTimes(1)
  })
})
