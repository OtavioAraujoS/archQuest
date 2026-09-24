import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { CloudSyncIndicator } from '@/components/editor/CloudSyncIndicator'
import { db } from '@/lib/db'
import { INITIAL_SYNC_STATE, useSyncStore } from '@/lib/sync/sync-store'
import {
  makeAccountDiagram,
  makeGuestDiagram,
} from '../../lib/diagrams/diagram-fixtures'

describe('CloudSyncIndicator', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  afterEach(() => {
    act(() => useSyncStore.setState(INITIAL_SYNC_STATE))
  })

  it('shows that an account diagram is saved in the cloud', async () => {
    await db.diagrams.add(makeAccountDiagram())

    render(<CloudSyncIndicator diagramId="account-1" />)

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Salvo na nuvem',
    )
  })

  it('follows the pending flag stored in the browser', async () => {
    await db.diagrams.add(makeAccountDiagram())
    render(<CloudSyncIndicator diagramId="account-1" />)
    await screen.findByText('Salvo na nuvem')

    await act(() => db.diagrams.update('account-1', { dirty: true }))

    expect(await screen.findByText('Salvando…')).toBeInTheDocument()
  })

  it('shows pending changes while offline', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: true }))
    act(() => useSyncStore.setState({ isOnline: false }))

    render(<CloudSyncIndicator diagramId="account-1" />)

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Offline — alterações pendentes',
    )
  })

  it('explains the 2 MB limit on hover', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: true }))
    act(() => useSyncStore.setState({ tooLargeDiagramIds: ['account-1'] }))

    render(<CloudSyncIndicator diagramId="account-1" />)

    const indicator = await screen.findByRole('status')
    expect(indicator).toHaveTextContent('Grande demais para a nuvem')
    expect(indicator.getAttribute('title')).toContain('2 MB')
  })

  it('renders nothing for a guest diagram', async () => {
    await db.diagrams.add(makeGuestDiagram())

    const { container } = render(<CloudSyncIndicator diagramId="guest-1" />)
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)))

    expect(container).toBeEmptyDOMElement()
  })
})
