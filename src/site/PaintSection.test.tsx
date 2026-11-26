import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PAINTS } from './content'

// the scroll reveal needs a real layout engine; this test is only about keyboard behaviour
vi.mock('./reveal', () => ({ revealCopy: vi.fn(), letters: vi.fn() }))

import { PaintSection } from './PaintSection'

function Harness() {
  const [paint, setPaint] = useState(PAINTS[0])
  return <PaintSection paint={paint} setPaint={setPaint} />
}

const radios = () => screen.getAllByRole('radio')

describe('PaintSection swatches', () => {
  it('is a radiogroup with one radio per paint', () => {
    render(<Harness />)
    expect(screen.getByRole('radiogroup', { name: 'Paint' })).toBeInTheDocument()
    expect(radios()).toHaveLength(PAINTS.length)
    PAINTS.forEach((p, i) => expect(radios()[i]).toHaveAccessibleName(p.name))
  })

  it('puts only the checked swatch in the Tab order', () => {
    render(<Harness />)
    expect(radios()[0]).toHaveAttribute('aria-checked', 'true')
    expect(radios()[0]).toHaveAttribute('tabindex', '0')
    expect(radios()[1]).toHaveAttribute('aria-checked', 'false')
    expect(radios()[1]).toHaveAttribute('tabindex', '-1')
  })

  it.each(['ArrowRight', 'ArrowDown'])('%s picks the next paint and moves focus to it', (key) => {
    render(<Harness />)
    radios()[0].focus()
    fireEvent.keyDown(radios()[0], { key })
    expect(radios()[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios()[1]).toHaveAttribute('tabindex', '0')
    expect(radios()[0]).toHaveAttribute('tabindex', '-1')
    expect(radios()[1]).toHaveFocus()
    expect(screen.getByText(PAINTS[1].name, { selector: '.paints__name' })).toBeInTheDocument()
  })

  it.each(['ArrowLeft', 'ArrowUp'])('%s wraps from the first paint to the last', (key) => {
    render(<Harness />)
    fireEvent.keyDown(radios()[0], { key })
    expect(radios()[PAINTS.length - 1]).toHaveAttribute('aria-checked', 'true')
  })

  it('wraps from the last paint to the first', () => {
    render(<Harness />)
    fireEvent.keyDown(radios()[0], { key: 'ArrowRight' })
    fireEvent.keyDown(radios()[1], { key: 'ArrowRight' })
    expect(radios()[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('ignores other keys', () => {
    render(<Harness />)
    fireEvent.keyDown(radios()[0], { key: 'a' })
    expect(radios()[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('still changes paint on click', () => {
    render(<Harness />)
    fireEvent.click(radios()[1])
    expect(radios()[1]).toHaveAttribute('aria-checked', 'true')
  })
})
