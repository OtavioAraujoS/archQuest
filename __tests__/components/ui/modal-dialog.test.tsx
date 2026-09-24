import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ModalDialog } from '@/components/ui/modal-dialog'

function renderModalDialog(isDismissible?: boolean) {
  const onClose = vi.fn()
  render(
    <ModalDialog title="Título do diálogo" onClose={onClose} isDismissible={isDismissible}>
      <p>Conteúdo</p>
    </ModalDialog>,
  )
  const dialog = screen.getByRole('dialog', { name: 'Título do diálogo' }) as HTMLDialogElement
  return { dialog, onClose }
}

describe('ModalDialog', () => {
  it('opens as a modal named by its title, closable by Esc, outside click or button', () => {
    const { dialog, onClose } = renderModalDialog()

    expect(dialog.open).toBe(true)
    expect(dialog).toHaveAttribute('closedby', 'any')

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('can require an explicit choice, without any way to dismiss it', () => {
    const { dialog } = renderModalDialog(false)

    expect(dialog).toHaveAttribute('closedby', 'none')
    expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument()
  })

  it('ignores Esc when it cannot be dismissed', () => {
    const { dialog } = renderModalDialog(false)
    const escapeCancel = new Event('cancel', { cancelable: true })

    fireEvent(dialog, escapeCancel)

    expect(escapeCancel.defaultPrevented).toBe(true)
    expect(dialog.open).toBe(true)
  })
})
