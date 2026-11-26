import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Lines } from './Split'

describe('Lines', () => {
  it('gives each line its plain sentence as aria-label', () => {
    const { container } = render(<Lines lines={['Composed', 'for the night.']} />)
    const lines = [...container.querySelectorAll('.line')]
    expect(lines.map((l) => l.getAttribute('aria-label'))).toEqual(['Composed', 'for the night.'])
  })

  it('hides the letter spans from screen readers', () => {
    const { container } = render(<Lines lines={['Hi']} />)
    expect(container.querySelector('.line > span')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders one .ch per non-space letter', () => {
    const line = 'for the night.'
    const { container } = render(<Lines lines={[line]} />)
    expect(container.querySelectorAll('.ch')).toHaveLength(line.replaceAll(' ', '').length)
  })

  it('keeps words together in .w spans, in order', () => {
    const { container } = render(<Lines lines={['for the night.']} />)
    const words = [...container.querySelectorAll('.w')].map((w) => w.textContent?.trim())
    expect(words).toEqual(['for', 'the', 'night.'])
  })

  it('joins words with a non-breaking space and adds none after the last word', () => {
    const { container } = render(<Lines lines={['a b']} />)
    expect(container.querySelector('.line')?.textContent).toBe('a\u00a0b')
  })

  it('renders nothing for no lines', () => {
    const { container } = render(<Lines lines={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
