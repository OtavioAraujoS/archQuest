import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MigrateGuestDiagramsDialog } from '@/components/auth/MigrateGuestDiagramsDialog'
import { makeGuestDiagram, OWNER_ID } from '../../lib/diagrams/diagram-fixtures'

const { moveGuestDiagramsToAccount } = vi.hoisted(() => ({
  moveGuestDiagramsToAccount: vi.fn(),
}))

vi.mock('@/lib/diagrams/move-guest-diagrams-to-account', () => ({ moveGuestDiagramsToAccount }))

const GUEST_DIAGRAMS = [
  makeGuestDiagram({ id: 'guest-1', name: 'Compras' }),
  makeGuestDiagram({ id: 'guest-2', name: 'Férias' }),
]

function renderMigrationDialog() {
  const onClose = vi.fn()
  render(
    <MigrateGuestDiagramsDialog
      ownerId={OWNER_ID}
      guestDiagrams={GUEST_DIAGRAMS}
      onClose={onClose}
    />,
  )
  return { onClose }
}

describe('MigrateGuestDiagramsDialog', () => {
  beforeEach(() => {
    moveGuestDiagramsToAccount.mockReset().mockResolvedValue(undefined)
  })

  it('lists every guest diagram, all chosen by default', () => {
    renderMigrationDialog()

    expect(screen.getByRole('checkbox', { name: /Compras/ })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Férias/ })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Enviar 2 diagramas para a conta' })).toBeEnabled()
  })

  it('moves only the chosen diagrams and closes', async () => {
    const { onClose } = renderMigrationDialog()

    fireEvent.click(screen.getByRole('checkbox', { name: /Férias/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar 1 diagrama para a conta' }))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(moveGuestDiagramsToAccount).toHaveBeenCalledWith(['guest-1'], OWNER_ID)
  })

  it('cannot send when nothing is chosen', () => {
    renderMigrationDialog()

    fireEvent.click(screen.getByRole('checkbox', { name: /Compras/ }))
    fireEvent.click(screen.getByRole('checkbox', { name: /Férias/ }))

    expect(screen.getByRole('button', { name: /Enviar 0 diagramas/ })).toBeDisabled()
  })

  it('closes without moving anything on "Agora não"', () => {
    const { onClose } = renderMigrationDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Agora não' }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(moveGuestDiagramsToAccount).not.toHaveBeenCalled()
  })

  it('stays open and lets the user retry when moving fails', async () => {
    moveGuestDiagramsToAccount.mockRejectedValue(new Error('QuotaExceededError'))
    const { onClose } = renderMigrationDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Enviar 2 diagramas para a conta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível mover')
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Enviar 2 diagramas para a conta' })).toBeEnabled()
  })
})
