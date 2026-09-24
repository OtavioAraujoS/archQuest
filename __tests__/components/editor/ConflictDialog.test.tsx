import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ConflictDialog } from '@/components/editor/ConflictDialog'

const { keepLocalVersion, loadCloudVersion } = vi.hoisted(() => ({
  keepLocalVersion: vi.fn(),
  loadCloudVersion: vi.fn(),
}))

vi.mock('@/lib/sync/resolve-conflict', () => ({ keepLocalVersion, loadCloudVersion }))

function renderConflictDialog() {
  const onCloudVersionLoaded = vi.fn()
  const onDiagramDeletedInCloud = vi.fn()
  render(
    <ConflictDialog
      diagramId="account-1"
      onCloudVersionLoaded={onCloudVersionLoaded}
      onDiagramDeletedInCloud={onDiagramDeletedInCloud}
    />,
  )
  return { onCloudVersionLoaded, onDiagramDeletedInCloud }
}

describe('ConflictDialog', () => {
  beforeEach(() => {
    keepLocalVersion.mockReset().mockResolvedValue(undefined)
    loadCloudVersion.mockReset().mockResolvedValue('loaded')
  })

  it('asks for a choice and cannot be dismissed', () => {
    renderConflictDialog()

    const dialog = screen.getByRole('dialog', { name: 'Este diagrama mudou em outro lugar' })
    expect(dialog).toHaveAttribute('closedby', 'none')
    expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument()
  })

  it('keeps the local version', async () => {
    renderConflictDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Manter a minha' }))

    expect(keepLocalVersion).toHaveBeenCalledWith('account-1')
    expect(await screen.findByRole('button', { name: 'Mantendo…' })).toBeDisabled()
  })

  it('loads the cloud version and asks the editor to reload', async () => {
    const { onCloudVersionLoaded } = renderConflictDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Carregar a da nuvem' }))

    await waitFor(() => expect(onCloudVersionLoaded).toHaveBeenCalledOnce())
    expect(loadCloudVersion).toHaveBeenCalledWith('account-1')
  })

  it('leaves the editor when the diagram no longer exists in the cloud', async () => {
    loadCloudVersion.mockResolvedValue('deleted-in-cloud')
    const { onCloudVersionLoaded, onDiagramDeletedInCloud } = renderConflictDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Carregar a da nuvem' }))

    await waitFor(() => expect(onDiagramDeletedInCloud).toHaveBeenCalledOnce())
    expect(onCloudVersionLoaded).not.toHaveBeenCalled()
  })

  it('lets the user try again when the cloud cannot be reached', async () => {
    keepLocalVersion.mockRejectedValue(new Error('offline'))
    renderConflictDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Manter a minha' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível falar com a nuvem')
    expect(screen.getByRole('button', { name: 'Manter a minha' })).toBeEnabled()
  })
})
