import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SaveToFileButton } from '@/components/editor/file-link/SaveToFileButton'

describe('SaveToFileButton', () => {
  it('offers to choose a file when the diagram is not linked yet', () => {
    const onSaveToFile = vi.fn()
    render(
      <SaveToFileButton linkedFileName={null} isSavingToFile={false} onSaveToFile={onSaveToFile} />,
    )

    const button = screen.getByRole('button', { name: 'Salvar no arquivo' })
    fireEvent.click(button)

    expect(onSaveToFile).toHaveBeenCalledOnce()
    expect(button).toHaveAttribute('title', expect.stringContaining('Ctrl+S'))
  })

  it('names the linked file', () => {
    render(
      <SaveToFileButton linkedFileName="Compras.bpmn" isSavingToFile={false} onSaveToFile={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: 'Salvar em Compras.bpmn' })).toHaveAttribute(
      'title',
      'Grava em Compras.bpmn (Ctrl+S)',
    )
  })

  it('is disabled while saving', () => {
    render(
      <SaveToFileButton linkedFileName="Compras.bpmn" isSavingToFile onSaveToFile={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: 'Salvando…' })).toBeDisabled()
  })
})
