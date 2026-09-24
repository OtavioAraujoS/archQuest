import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SaveToFileMenuItem } from '@/components/editor/file-link/SaveToFileMenuItem'

describe('SaveToFileMenuItem', () => {
  it('offers to choose a file when the diagram is not linked yet', () => {
    const onSaveToFile = vi.fn()
    render(
      <SaveToFileMenuItem
        linkedFileName={null}
        isSavingToFile={false}
        onSaveToFile={onSaveToFile}
      />,
    )

    const menuItem = screen.getByRole('menuitem', {
      name: /Salvar no arquivo/,
    })
    fireEvent.click(menuItem)

    expect(onSaveToFile).toHaveBeenCalledOnce()
    expect(menuItem).toHaveAttribute('title', expect.stringContaining('Ctrl+S'))
  })

  it('names the linked file', () => {
    render(
      <SaveToFileMenuItem
        linkedFileName="Compras.bpmn"
        isSavingToFile={false}
        onSaveToFile={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('menuitem', { name: /Salvar em Compras\.bpmn/ }),
    ).toHaveAttribute('title', 'Grava em Compras.bpmn (Ctrl+S)')
  })

  it('cannot be chosen while saving', () => {
    const onSaveToFile = vi.fn()
    render(
      <SaveToFileMenuItem
        linkedFileName="Compras.bpmn"
        isSavingToFile
        onSaveToFile={onSaveToFile}
      />,
    )

    const menuItem = screen.getByRole('menuitem', { name: /Salvando…/ })
    fireEvent.click(menuItem)

    expect(menuItem).toHaveAttribute('aria-disabled', 'true')
    expect(onSaveToFile).not.toHaveBeenCalled()
  })
})
