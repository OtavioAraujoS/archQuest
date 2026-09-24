import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PublicViewer } from '@/components/viewer/PublicViewer'
import type { PublicDiagram } from '@/lib/supabase/database-types'

const { fetchPublicDiagram } = vi.hoisted(() => ({ fetchPublicDiagram: vi.fn() }))

vi.mock('@/lib/sharing/fetch-public-diagram', () => ({ fetchPublicDiagram }))
vi.mock('@/components/viewer/PublicDiagramView', () => ({
  PublicDiagramView: ({ diagram }: { diagram: PublicDiagram }) => (
    <p>Visualizando {diagram.name}</p>
  ),
}))

const PUBLISHED_SLUG = 'slugPublicoComEntropia01'

function renderPublicViewerAt(slug: string) {
  render(
    <MemoryRouter initialEntries={[`/view/${slug}`]}>
      <Routes>
        <Route path="/view/:slug" element={<PublicViewer />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PublicViewer', () => {
  beforeEach(() => {
    fetchPublicDiagram.mockReset()
  })

  it('shows the published diagram for its slug', async () => {
    fetchPublicDiagram.mockResolvedValue({
      name: 'Reembolso',
      bpmn_xml: '<bpmn:definitions />',
      updated_at: '2026-09-24T10:00:00.000Z',
    })

    renderPublicViewerAt(PUBLISHED_SLUG)

    expect(screen.getByText('Carregando diagrama…')).toBeInTheDocument()
    expect(await screen.findByText('Visualizando Reembolso')).toBeInTheDocument()
    expect(fetchPublicDiagram).toHaveBeenCalledWith(PUBLISHED_SLUG)
  })

  it('says the diagram was not found for an unknown or unpublished slug', async () => {
    fetchPublicDiagram.mockResolvedValue(null)

    renderPublicViewerAt('slugQueNaoExisteNoBanco01')

    expect(
      await screen.findByRole('heading', { name: 'Diagrama não encontrado' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para o archQuest' })).toHaveAttribute('href', '/')
  })

  it('tells a failed load apart from a missing diagram', async () => {
    fetchPublicDiagram.mockRejectedValue(new Error('Failed to fetch'))

    renderPublicViewerAt(PUBLISHED_SLUG)

    expect(
      await screen.findByRole('heading', { name: 'Não foi possível carregar o diagrama' }),
    ).toBeInTheDocument()
  })
})
