import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ShareDialog } from '@/components/editor/sharing/ShareDialog'
import type { DiagramRecord } from '@/lib/db'
import { makeAccountDiagram } from '../../../lib/diagrams/diagram-fixtures'

const { publishDiagram, unpublishDiagram } = vi.hoisted(() => ({
  publishDiagram: vi.fn(),
  unpublishDiagram: vi.fn(),
}))

vi.mock('@/lib/sharing/publish-diagram', () => ({ publishDiagram, unpublishDiagram }))

const PUBLISHED_SLUG = 'slugPublicoComEntropia01'

function renderShareDialog(diagram: DiagramRecord) {
  render(<ShareDialog diagram={diagram} onClose={vi.fn()} />)
}

describe('ShareDialog', () => {
  beforeEach(() => {
    publishDiagram.mockReset().mockResolvedValue(PUBLISHED_SLUG)
    unpublishDiagram.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('publishes a diagram already in the cloud', async () => {
    renderShareDialog(makeAccountDiagram())

    fireEvent.click(screen.getByRole('button', { name: 'Publicar link' }))

    await waitFor(() => expect(publishDiagram).toHaveBeenCalledWith('account-1'))
  })

  it('asks to wait while the diagram has never reached the cloud', () => {
    renderShareDialog(makeAccountDiagram({ version: 0, dirty: true }))

    expect(screen.getByText(/ainda está indo para a nuvem/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publicar link' })).not.toBeInTheDocument()
  })

  it('shows the /view link of a published diagram', () => {
    renderShareDialog(makeAccountDiagram({ publicSlug: PUBLISHED_SLUG }))

    expect(screen.getByLabelText('Link público')).toHaveValue(
      `${window.location.origin}/view/${PUBLISHED_SLUG}`,
    )
  })

  it('copies the link', async () => {
    const writeText = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    renderShareDialog(makeAccountDiagram({ publicSlug: PUBLISHED_SLUG }))

    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }))

    expect(await screen.findByRole('button', { name: 'Copiado' })).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/view/${PUBLISHED_SLUG}`)
  })

  it('unpublishes the diagram', async () => {
    renderShareDialog(makeAccountDiagram({ publicSlug: PUBLISHED_SLUG }))

    fireEvent.click(screen.getByRole('button', { name: 'Despublicar' }))

    await waitFor(() => expect(unpublishDiagram).toHaveBeenCalledWith('account-1'))
  })

  it('reports when the cloud cannot be reached', async () => {
    publishDiagram.mockRejectedValue(new Error('Failed to fetch'))
    renderShareDialog(makeAccountDiagram())

    fireEvent.click(screen.getByRole('button', { name: 'Publicar link' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível falar com a nuvem')
    expect(screen.getByRole('button', { name: 'Publicar link' })).toBeEnabled()
  })
})
