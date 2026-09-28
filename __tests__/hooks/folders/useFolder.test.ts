import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { makeGuestDiagram } from '../../lib/diagrams/diagram-fixtures'
import { makeGuestFolder } from '../../lib/folders/folder-fixtures'

const { deleteCloudFolder } = vi.hoisted(() => ({
  deleteCloudFolder: vi.fn(),
}))

vi.mock('@/lib/folders/cloud-folders', () => ({ deleteCloudFolder }))

import {
  FOLDER_CHANGE_FAILED_MESSAGE,
  INVALID_FOLDER_NAME_MESSAGE,
  normalizeFolderName,
  useFolder,
} from '@/hooks/folders/useFolder'

describe('useFolder', () => {
  beforeEach(async () => {
    await db.folders.clear()
    await db.diagrams.clear()
    deleteCloudFolder.mockReset().mockResolvedValue(undefined)
  })

  it('normalizes typed folder names', () => {
    expect(normalizeFolderName('  Contas   a  pagar ')).toBe('Contas a pagar')
    expect(normalizeFolderName('   ')).toBeNull()
    expect(normalizeFolderName('x'.repeat(81))).toBeNull()
  })

  it('creates a folder and lists it live', async () => {
    const { result } = renderHook(() => useFolder())

    await act(() => result.current.createFolder('  Financeiro '))

    await waitFor(() =>
      expect(result.current.folders?.map((folder) => folder.name)).toEqual([
        'Financeiro',
      ]),
    )
  })

  it('refuses an empty name without saving', async () => {
    const { result } = renderHook(() => useFolder())

    await act(() => result.current.createFolder('   '))

    expect(result.current.folderError).toBe(INVALID_FOLDER_NAME_MESSAGE)
    await expect(db.folders.count()).resolves.toBe(0)
  })

  it('renames a folder', async () => {
    await db.folders.add(makeGuestFolder())
    const { result } = renderHook(() => useFolder())

    await act(() => result.current.renameFolder('guest-folder', 'Ideias'))

    await expect(db.folders.get('guest-folder')).resolves.toMatchObject({
      name: 'Ideias',
    })
  })

  it('moves a diagram into a folder', async () => {
    await db.diagrams.add(makeGuestDiagram())
    const { result } = renderHook(() => useFolder())

    await act(() => result.current.moveDiagramToFolder('guest-1', 'pasta'))

    await expect(db.diagrams.get('guest-1')).resolves.toMatchObject({
      folderId: 'pasta',
    })
  })

  it('explains when a change could not be saved', async () => {
    await db.folders.add(makeGuestFolder({ ownerId: 'owner-1' }))
    deleteCloudFolder.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useFolder())

    await act(() => result.current.deleteFolder('guest-folder'))

    expect(result.current.folderError).toBe(FOLDER_CHANGE_FAILED_MESSAGE)
    expect(result.current.isSavingFolder).toBe(false)
    act(() => result.current.dismissFolderError())
    expect(result.current.folderError).toBeNull()
  })
})
