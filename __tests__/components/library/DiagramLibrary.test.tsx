import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db, GUEST_SYNC_FIELDS, type DiagramRecord } from '@/lib/db'
import { DIAGRAM_TEMPLATES } from '@/templates'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

import { DiagramLibrary } from '@/components/library/DiagramLibrary'

function makeRecord(overrides: Partial<DiagramRecord> = {}): DiagramRecord {
  return {
    id: 'diagram-1',
    name: 'Processo de vendas',
    bpmnXml: '<xml />',
    createdAt: 1,
    updatedAt: 1,
    ...GUEST_SYNC_FIELDS,
    ...overrides,
  }
}

describe('DiagramLibrary', () => {
  beforeEach(async () => {
    mockNavigate.mockClear()
    await db.diagrams.clear()
  })

  it('renders existing diagrams from the database', async () => {
    await db.diagrams.add(makeRecord())

    render(<DiagramLibrary />)

    expect(await screen.findByText('Processo de vendas')).toBeInTheDocument()
  })

  it('creates a new diagram and navigates to its editor', async () => {
    render(<DiagramLibrary />)

    fireEvent.click(screen.getByRole('button', { name: 'Novo diagrama' }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1))
    expect(mockNavigate.mock.calls[0][0]).toMatch(/^\/editor\/[\w-]+$/)
    await expect(db.diagrams.toArray()).resolves.toHaveLength(1)
  })

  it('creates a diagram from a template and navigates to its editor', async () => {
    const [purchaseApproval] = DIAGRAM_TEMPLATES
    render(<DiagramLibrary />)

    fireEvent.click(screen.getByRole('button', { name: 'A partir de template' }))
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(purchaseApproval.name) }),
    )

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1))
    const [createdDiagram] = await db.diagrams.toArray()
    expect(createdDiagram).toMatchObject({
      name: purchaseApproval.name,
      bpmnXml: purchaseApproval.xml,
    })
    expect(mockNavigate).toHaveBeenCalledWith(`/editor/${createdDiagram.id}`)
  })

  it('closes the template picker without creating anything', () => {
    render(<DiagramLibrary />)

    fireEvent.click(screen.getByRole('button', { name: 'A partir de template' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('deletes a diagram after confirmation', async () => {
    await db.diagrams.add(makeRecord())
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<DiagramLibrary />)
    await screen.findByText('Processo de vendas')

    fireEvent.click(screen.getByRole('button', { name: 'Excluir diagrama' }))

    await waitFor(async () => {
      await expect(db.diagrams.toArray()).resolves.toHaveLength(0)
    })
    expect(screen.queryByText('Processo de vendas')).not.toBeInTheDocument()

    confirmSpy.mockRestore()
  })
})
