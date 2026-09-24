import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { DIAGRAM_TEMPLATES } from '@/templates'
import { makeLibraryDiagram } from './library-diagram-fixture'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => mockNavigate,
}))
vi.mock('@/components/templates/TemplatePreviewCanvas', () => ({
  default: () => <div data-testid="template-preview" />,
}))

import { renderDiagramLibrary } from './render-diagram-library'

describe('DiagramLibrary', () => {
  beforeEach(async () => {
    mockNavigate.mockClear()
    await db.diagrams.clear()
  })

  it('renders existing diagrams from the database', async () => {
    await db.diagrams.add(makeLibraryDiagram())

    renderDiagramLibrary()

    expect(await screen.findByText('Processo de vendas')).toBeInTheDocument()
  })

  it('invites to start the first diagram when the library is empty', async () => {
    renderDiagramLibrary()

    expect(
      await screen.findByRole('heading', {
        name: 'Seu primeiro processo começa aqui',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('searchbox', { name: 'Buscar diagramas' }),
    ).not.toBeInTheDocument()
  })

  it('creates a new diagram and navigates to its editor', async () => {
    renderDiagramLibrary()

    fireEvent.click(screen.getByRole('button', { name: 'Novo diagrama' }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1))
    expect(mockNavigate.mock.calls[0][0]).toMatch(/^\/editor\/[\w-]+$/)
    await expect(db.diagrams.toArray()).resolves.toHaveLength(1)
  })

  it('creates a diagram from a template and navigates to its editor', async () => {
    const [, onboarding] = DIAGRAM_TEMPLATES
    renderDiagramLibrary()

    fireEvent.click(screen.getByRole('button', { name: 'Usar modelo' }))
    const picker = screen.getByRole('dialog')
    fireEvent.click(
      within(picker).getByRole('tab', { name: new RegExp(onboarding.name) }),
    )
    fireEvent.click(
      within(picker).getByRole('button', { name: 'Usar este modelo' }),
    )

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1))
    const [createdDiagram] = await db.diagrams.toArray()
    expect(createdDiagram).toMatchObject({
      name: onboarding.name,
      bpmnXml: onboarding.xml,
    })
    expect(mockNavigate).toHaveBeenCalledWith(`/editor/${createdDiagram.id}`)
  })

  it('closes the template picker without creating anything', () => {
    renderDiagramLibrary()

    fireEvent.click(screen.getByRole('button', { name: 'Usar modelo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('deletes a diagram after confirming in the dialog', async () => {
    await db.diagrams.add(makeLibraryDiagram())
    renderDiagramLibrary()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir diagrama Processo de vendas',
      }),
    )
    const dialog = screen.getByRole('dialog', {
      name: 'Excluir “Processo de vendas”?',
    })
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Excluir diagrama' }),
    )

    await waitFor(async () => {
      await expect(db.diagrams.toArray()).resolves.toHaveLength(0)
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the diagram when the deletion is cancelled', async () => {
    await db.diagrams.add(makeLibraryDiagram())
    renderDiagramLibrary()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir diagrama Processo de vendas',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(db.diagrams.toArray()).resolves.toHaveLength(1)
  })
})
