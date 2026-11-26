import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BRAND } from './content'
import { Nav } from './Nav'

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  act(() => { window.dispatchEvent(new Event('scroll')) })
}

beforeEach(() => Object.defineProperty(window, 'scrollY', { value: 0, configurable: true }))
afterEach(() => {
  delete (window as unknown as { lenis?: unknown }).lenis
  vi.restoreAllMocks()
})

describe('Nav', () => {
  it('renders the logo, every section link and the call to action', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /NOCTURNE/ })).toHaveAttribute('href', '#top')
    for (const [href, label] of BRAND.nav) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
    }
    expect(screen.getByRole('link', { name: BRAND.navCta })).toHaveAttribute('href', '#book')
  })

  it('has "Skip to content" as the first link, pointing at #main', () => {
    render(<Nav />)
    const first = screen.getAllByRole('link')[0]
    expect(first).toHaveTextContent('Skip to content')
    expect(first).toHaveAttribute('href', '#main')
  })

  it('hides when scrolling down past the top, and returns when scrolling up', () => {
    const { container } = render(<Nav />)
    const header = container.querySelector('header')!
    expect(header).not.toHaveClass('nav--hidden')
    scrollTo(300)
    expect(header).toHaveClass('nav--hidden')
    scrollTo(200)
    expect(header).not.toHaveClass('nav--hidden')
  })

  it('stays visible near the top even when scrolling down', () => {
    const { container } = render(<Nav />)
    scrollTo(100)
    expect(container.querySelector('header')).not.toHaveClass('nav--hidden')
  })

  it('shows itself again when a link inside receives keyboard focus', () => {
    const { container } = render(<Nav />)
    scrollTo(500)
    const header = container.querySelector('header')!
    expect(header).toHaveClass('nav--hidden')
    fireEvent.focus(screen.getByRole('link', { name: BRAND.navCta }))
    expect(header).not.toHaveClass('nav--hidden')
  })

  it('glides with lenis when it exists', () => {
    const lenis = { scrollTo: vi.fn() }
    ;(window as unknown as { lenis: typeof lenis }).lenis = lenis
    render(<Nav />)
    fireEvent.click(screen.getByRole('link', { name: BRAND.navCta }))
    expect(lenis.scrollTo).toHaveBeenCalledWith('#book', { duration: 1.6 })
  })

  it('falls back to scrollIntoView without lenis', () => {
    const target = document.createElement('div')
    target.id = 'book'
    target.scrollIntoView = vi.fn()
    document.body.append(target)
    render(<Nav />)
    fireEvent.click(screen.getByRole('link', { name: BRAND.navCta }))
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    target.remove()
  })

  it('removes its scroll listener on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    render(<Nav />).unmount()
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
