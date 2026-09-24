import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate, isFileSystemAccessSupported, openDiagramFromFile } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  isFileSystemAccessSupported: vi.fn(),
  openDiagramFromFile: vi.fn(),
}))

vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }))
vi.mock('@/lib/file-system/file-system-support', () => ({ isFileSystemAccessSupported }))
vi.mock('@/lib/file-system/open-diagram-from-file', () => ({ openDiagramFromFile }))

import { DiagramLibrary } from '@/components/library/DiagramLibrary'

describe('DiagramLibrary open file', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isFileSystemAccessSupported.mockReturnValue(true)
    openDiagramFromFile.mockResolvedValue('opened-diagram')
  })

  it('opens a .bpmn file as a new diagram and goes to its editor', async () => {
    render(<DiagramLibrary />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir arquivo' }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/editor/opened-diagram'))
  })

  it('stays in the library when the picker is cancelled', async () => {
    openDiagramFromFile.mockResolvedValue(null)
    render(<DiagramLibrary />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir arquivo' }))

    await waitFor(() => expect(openDiagramFromFile).toHaveBeenCalledOnce())
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('hides the button where the browser cannot open files directly', () => {
    isFileSystemAccessSupported.mockReturnValue(false)

    render(<DiagramLibrary />)

    expect(screen.queryByRole('button', { name: 'Abrir arquivo' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novo diagrama' })).toBeInTheDocument()
  })
})
