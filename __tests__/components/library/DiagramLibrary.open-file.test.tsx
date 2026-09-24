import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate, isFileSystemAccessSupported, openDiagramFromFile } =
  vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    isFileSystemAccessSupported: vi.fn(),
    openDiagramFromFile: vi.fn(),
  }))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => mockNavigate,
}))
vi.mock('@/lib/file-system/file-system-support', () => ({
  isFileSystemAccessSupported,
}))
vi.mock('@/lib/file-system/open-diagram-from-file', () => ({
  openDiagramFromFile,
}))

import { renderDiagramLibrary } from './render-diagram-library'

describe('DiagramLibrary open file', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isFileSystemAccessSupported.mockReturnValue(true)
    openDiagramFromFile.mockResolvedValue('opened-diagram')
  })

  it('opens a .bpmn file as a new diagram and goes to its editor', async () => {
    renderDiagramLibrary()

    fireEvent.click(screen.getByRole('button', { name: 'Abrir arquivo' }))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/editor/opened-diagram'),
    )
  })

  it('stays in the library when the picker is cancelled', async () => {
    openDiagramFromFile.mockResolvedValue(null)
    renderDiagramLibrary()

    fireEvent.click(screen.getByRole('button', { name: 'Abrir arquivo' }))

    await waitFor(() => expect(openDiagramFromFile).toHaveBeenCalledOnce())
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('explains in the page when the file is not a valid diagram', async () => {
    openDiagramFromFile.mockRejectedValue(new Error('invalid bpmn'))
    renderDiagramLibrary()

    fireEvent.click(screen.getByRole('button', { name: 'Abrir arquivo' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível abrir o arquivo',
    )
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('hides the button where the browser cannot open files directly', () => {
    isFileSystemAccessSupported.mockReturnValue(false)

    renderDiagramLibrary()

    expect(
      screen.queryByRole('button', { name: 'Abrir arquivo' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Novo diagrama' }),
    ).toBeInTheDocument()
  })
})
