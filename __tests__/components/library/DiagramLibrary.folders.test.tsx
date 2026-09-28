import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { libraryFolderPath } from '@/lib/routes'
import { makeGuestFolder } from '../../lib/folders/folder-fixtures'
import { makeLibraryDiagram } from './library-diagram-fixture'
import {
  chooseDiagramAction,
  renderDiagramLibrary,
} from './render-diagram-library'

vi.mock('@/lib/folders/cloud-folders', () => ({ deleteCloudFolder: vi.fn() }))

const FOLDER = makeGuestFolder({ id: 'folder-1', name: 'Financeiro' })

function typeFolderName(name: string) {
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Nome da pasta'), {
    target: { value: name },
  })
  fireEvent.submit(within(dialog).getByLabelText('Nome da pasta'))
}

describe('DiagramLibrary folders', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.folders.clear()
  })

  it('creates a folder from the library heading', async () => {
    renderDiagramLibrary()

    fireEvent.click(await screen.findByRole('button', { name: 'Nova pasta' }))
    typeFolderName('  Contas  a pagar ')

    const folders = await screen.findByRole('region', { name: 'Pastas' })
    expect(within(folders).getByText('Contas a pagar')).toBeInTheDocument()
  })

  it('refuses a blank folder name', async () => {
    renderDiagramLibrary()

    fireEvent.click(await screen.findByRole('button', { name: 'Nova pasta' }))
    typeFolderName('   ')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O nome da pasta precisa ter entre 1 e 80 caracteres.',
    )
  })

  it('moves a diagram into a folder from its card menu', async () => {
    await db.folders.add(FOLDER)
    await db.diagrams.add(makeLibraryDiagram())
    renderDiagramLibrary()

    await chooseDiagramAction('Processo de vendas', 'Financeiro')

    await waitFor(async () =>
      expect((await db.diagrams.toArray())[0]?.folderId).toBe('folder-1'),
    )
    expect(await screen.findByText('1 diagrama')).toBeInTheDocument()
  })

  it('shows only the diagrams of an open folder, under its path', async () => {
    await db.folders.add(FOLDER)
    await db.diagrams.bulkAdd([
      makeLibraryDiagram({
        id: 'filed',
        name: 'Na pasta',
        folderId: 'folder-1',
      }),
      makeLibraryDiagram({ id: 'loose', name: 'Solto' }),
    ])

    renderDiagramLibrary(libraryFolderPath('folder-1'))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Financeiro' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Meus diagramas' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Na pasta')).toBeInTheDocument()
    expect(screen.queryByText('Solto')).not.toBeInTheDocument()
  })

  it('returns the diagrams to the library when their folder is deleted', async () => {
    await db.folders.add(FOLDER)
    await db.diagrams.add(makeLibraryDiagram({ folderId: 'folder-1' }))
    renderDiagramLibrary()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Ações da pasta Financeiro' }),
    )
    fireEvent.click(screen.getByRole('menuitem', { name: 'Excluir pasta' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('O diagrama desta pasta volta')
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Excluir pasta' }),
    )

    expect(await screen.findByText('Processo de vendas')).toBeInTheDocument()
    await expect(db.folders.count()).resolves.toBe(0)
  })
})
