import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { LIBRARY_FOLDER_PATH, libraryFolderPath } from '@/lib/routes'
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

function renderUseFolder(path = '/') {
  const inRouter = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={children} />
        <Route path={LIBRARY_FOLDER_PATH} element={children} />
      </Routes>
    </MemoryRouter>
  )
  return renderHook(() => useFolder(), { wrapper: inRouter })
}

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

  it('creates a folder from the dialog and closes it', async () => {
    const { result } = renderUseFolder()

    act(() => result.current.requestNewFolder())
    await act(() => result.current.submitFolderName('  Financeiro '))

    expect(result.current.folderDialog).toBeNull()
    await waitFor(() =>
      expect(result.current.folders?.map((folder) => folder.name)).toEqual([
        'Financeiro',
      ]),
    )
  })

  it('keeps the dialog open when the name is invalid', async () => {
    const { result } = renderUseFolder()

    act(() => result.current.requestNewFolder())
    await act(() => result.current.submitFolderName('   '))

    expect(result.current.folderDialog).toEqual({ kind: 'create' })
    expect(result.current.folderError).toBe(INVALID_FOLDER_NAME_MESSAGE)
    await expect(db.folders.count()).resolves.toBe(0)
  })

  it('renames the folder chosen in the dialog', async () => {
    await db.folders.add(makeGuestFolder())
    const { result } = renderUseFolder()

    act(() => result.current.requestFolderRename(makeGuestFolder()))
    await act(() => result.current.submitFolderName('Ideias'))

    await expect(db.folders.get('guest-folder')).resolves.toMatchObject({
      name: 'Ideias',
    })
  })

  it('keeps the deletion dialog open when the cloud fails', async () => {
    const accountFolder = makeGuestFolder({ ownerId: 'owner-1' })
    await db.folders.add(accountFolder)
    deleteCloudFolder.mockRejectedValue(new Error('offline'))
    const { result } = renderUseFolder()

    act(() => result.current.requestFolderDeletion(accountFolder))
    await act(() => result.current.confirmFolderDeletion())

    expect(result.current.folderError).toBe(FOLDER_CHANGE_FAILED_MESSAGE)
    expect(result.current.folderDialog?.kind).toBe('delete')
    act(() => result.current.closeFolderDialog())
    expect(result.current.folderError).toBeNull()
  })

  it('moves a diagram into a folder', async () => {
    await db.diagrams.add(makeGuestDiagram())
    const { result } = renderUseFolder()

    await act(() => result.current.moveDiagramToFolder('guest-1', 'pasta'))

    await expect(db.diagrams.get('guest-1')).resolves.toMatchObject({
      folderId: 'pasta',
    })
  })

  it('opens the folder named in the route', async () => {
    await db.folders.add(makeGuestFolder())

    const { result } = renderUseFolder(libraryFolderPath('guest-folder'))

    await waitFor(() =>
      expect(result.current.currentFolderId).toBe('guest-folder'),
    )
  })
})
