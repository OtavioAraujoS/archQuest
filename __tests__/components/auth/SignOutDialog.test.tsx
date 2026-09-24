import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SignOutDialog } from '@/components/auth/SignOutDialog'
import { OWNER_ID } from '../../lib/diagrams/diagram-fixtures'

const { signOutOfThisDevice, flushPendingUploads } = vi.hoisted(() => ({
  signOutOfThisDevice: vi.fn(),
  flushPendingUploads: vi.fn(),
}))

vi.mock('@/lib/auth/sign-out-of-this-device', () => ({ signOutOfThisDevice }))
vi.mock('@/lib/sync/flush-pending-uploads', () => ({ flushPendingUploads }))

function renderSignOutDialog(pendingDiagramCount = 2) {
  const onClose = vi.fn()
  render(
    <SignOutDialog ownerId={OWNER_ID} pendingDiagramCount={pendingDiagramCount} onClose={onClose} />,
  )
  return { onClose }
}

describe('SignOutDialog', () => {
  beforeEach(() => {
    signOutOfThisDevice.mockReset().mockResolvedValue(undefined)
    flushPendingUploads.mockReset().mockResolvedValue(0)
  })

  it('warns how many diagrams have changes not in the cloud yet', () => {
    renderSignOutDialog(2)

    expect(screen.getByRole('dialog', { name: 'Sair com alterações pendentes?' })).toHaveTextContent(
      'Você tem 2 diagramas com alterações que ainda não foram para a nuvem',
    )
  })

  it('syncs the pending diagrams and then signs out', async () => {
    const { onClose } = renderSignOutDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Sincronizar e sair' }))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(flushPendingUploads).toHaveBeenCalledWith(OWNER_ID)
    expect(signOutOfThisDevice).toHaveBeenCalledOnce()
  })

  it('stays signed in and explains when some diagrams could not be synced', async () => {
    flushPendingUploads.mockResolvedValue(1)
    const { onClose } = renderSignOutDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Sincronizar e sair' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('1 diagrama não foi para a nuvem')
    expect(signOutOfThisDevice).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Sair mesmo assim' })).toBeEnabled()
  })

  it('uses the plural when several diagrams could not be synced', async () => {
    flushPendingUploads.mockResolvedValue(3)
    renderSignOutDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Sincronizar e sair' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('3 diagramas não foram para a nuvem')
  })

  it('signs out without syncing on "Sair mesmo assim"', async () => {
    const { onClose } = renderSignOutDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Sair mesmo assim' }))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(flushPendingUploads).not.toHaveBeenCalled()
  })

  it('reports a failed sign out and lets the user try again', async () => {
    signOutOfThisDevice.mockRejectedValue(new Error('Failed to fetch'))
    const { onClose } = renderSignOutDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Sair mesmo assim' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível sair')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('cancels without signing out', () => {
    const { onClose } = renderSignOutDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(signOutOfThisDevice).not.toHaveBeenCalled()
  })
})
