import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_TEXT_STYLE } from '@/components/editor/text-style'
import { TextFormatButtons } from '@/components/editor/style/TextFormatButtons'

describe('TextFormatButtons', () => {
  it('marks the formats already applied to the text as pressed', () => {
    render(
      <TextFormatButtons
        textStyle={{ ...DEFAULT_TEXT_STYLE, bold: true }}
        onTextStyleChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Negrito' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Itálico' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('toggles only the clicked format', () => {
    const onTextStyleChange = vi.fn()
    render(
      <TextFormatButtons
        textStyle={{ ...DEFAULT_TEXT_STYLE, underline: true }}
        onTextStyleChange={onTextStyleChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sublinhado' }))
    fireEvent.click(screen.getByRole('button', { name: 'Itálico' }))

    expect(onTextStyleChange).toHaveBeenNthCalledWith(1, { underline: false })
    expect(onTextStyleChange).toHaveBeenNthCalledWith(2, { italic: true })
  })
})
