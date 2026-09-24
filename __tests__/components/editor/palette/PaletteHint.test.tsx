import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { PaletteHint } from '@/components/editor/palette/PaletteHint'
import { PALETTE_HINT_STORAGE_KEY } from '@/hooks/editor/usePaletteHintDismissal'

describe('PaletteHint', () => {
  beforeEach(() => localStorage.clear())

  it('explains the grouped palette until dismissed', () => {
    render(<PaletteHint />)

    expect(
      screen.getByRole('complementary', { name: 'Dica da paleta' }),
    ).toHaveTextContent('agrupam variações')

    fireEvent.click(screen.getByRole('button', { name: 'Entendi' }))

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(localStorage.getItem(PALETTE_HINT_STORAGE_KEY)).toBe('true')
  })

  it('stays hidden once the user has dismissed it before', () => {
    localStorage.setItem(PALETTE_HINT_STORAGE_KEY, 'true')

    render(<PaletteHint />)

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
