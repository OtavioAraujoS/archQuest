import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeLibraryDiagram } from '../../components/library/library-diagram-fixture'

const { deleteDiagram } = vi.hoisted(() => ({ deleteDiagram: vi.fn() }))

vi.mock('@/lib/diagrams/delete-diagram', () => ({ deleteDiagram }))

import {
  DELETION_FAILED_MESSAGE,
  useDiagramDeletion,
} from '@/hooks/library/useDiagramDeletion'

describe('useDiagramDeletion', () => {
  beforeEach(() => {
    deleteDiagram.mockReset().mockResolvedValue(undefined)
  })

  it('asks before deleting and deletes once confirmed', async () => {
    const diagram = makeLibraryDiagram()
    const { result } = renderHook(() => useDiagramDeletion())

    act(() => result.current.requestDeletion(diagram))
    expect(result.current.diagramPendingDeletion).toBe(diagram)
    expect(deleteDiagram).not.toHaveBeenCalled()

    await act(() => result.current.confirmDeletion())

    expect(deleteDiagram).toHaveBeenCalledWith(diagram.id)
    expect(result.current.diagramPendingDeletion).toBeNull()
  })

  it('keeps the dialog open with an explanation when deleting fails', async () => {
    deleteDiagram.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useDiagramDeletion())

    act(() => result.current.requestDeletion(makeLibraryDiagram()))
    await act(() => result.current.confirmDeletion())

    expect(result.current.diagramPendingDeletion).not.toBeNull()
    expect(result.current.deletionError).toBe(DELETION_FAILED_MESSAGE)
    expect(result.current.isDeleting).toBe(false)
  })

  it('forgets the pending diagram and error when cancelled', async () => {
    deleteDiagram.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useDiagramDeletion())
    act(() => result.current.requestDeletion(makeLibraryDiagram()))
    await act(() => result.current.confirmDeletion())

    act(() => result.current.cancelDeletion())

    expect(result.current.diagramPendingDeletion).toBeNull()
    expect(result.current.deletionError).toBeNull()
  })
})
