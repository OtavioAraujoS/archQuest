import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LabelSpellingPopover } from '@/components/editor/spelling/LabelSpellingPopover'

vi.mock('@/lib/spelling/spelling-client', () => ({
  suggestCorrections: () => Promise.resolve(['processo', 'procedo']),
}))

function renderOpenPopover() {
  const replaceWith = vi.fn()
  const onClose = vi.fn()
  render(
    <LabelSpellingPopover
      openSuggestions={{
        word: 'proceso',
        anchor: { left: 40, top: 60, width: 50, height: 14 },
        replaceWith,
      }}
      onClose={onClose}
    />,
  )
  return { replaceWith, onClose }
}

describe('LabelSpellingPopover', () => {
  it('renders nothing while no suggestions were requested', () => {
    render(<LabelSpellingPopover openSuggestions={null} onClose={vi.fn()} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('lists the suggestions for the misspelled word', async () => {
    renderOpenPopover()

    expect(
      screen.getByRole('dialog', { name: 'Ortografia de proceso' }),
    ).toBeVisible()
    expect(await screen.findByRole('button', { name: 'processo' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'procedo' })).toBeVisible()
  })

  it('replaces the word with the clicked suggestion', async () => {
    const { replaceWith } = renderOpenPopover()

    fireEvent.click(await screen.findByRole('button', { name: 'processo' }))

    expect(replaceWith).toHaveBeenCalledWith('processo')
  })

  it('never takes the focus away from the label being edited', async () => {
    renderOpenPopover()

    const suggestion = await screen.findByRole('button', { name: 'processo' })

    expect(fireEvent.mouseDown(suggestion)).toBe(false)
  })

  it('closes when the user presses outside of it', () => {
    const { onClose } = renderOpenPopover()

    fireEvent.pointerDown(document.body)

    expect(onClose).toHaveBeenCalled()
  })
})
