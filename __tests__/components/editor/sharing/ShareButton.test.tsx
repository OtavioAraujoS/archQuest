import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { ShareButton } from '@/components/editor/sharing/ShareButton'
import { db } from '@/lib/db'
import {
  makeAccountDiagram,
  makeGuestDiagram,
} from '../../../lib/diagrams/diagram-fixtures'

describe('ShareButton', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  it('opens the share dialog for an account diagram', async () => {
    await db.diagrams.add(makeAccountDiagram())
    render(<ShareButton diagramId="account-1" />)

    fireEvent.click(await screen.findByRole('button', { name: 'Compartilhar' }))

    expect(
      screen.getByRole('dialog', { name: 'Compartilhar diagrama' }),
    ).toBeInTheDocument()
  })

  it('is hidden for a guest diagram, which is not in the cloud', async () => {
    await db.diagrams.add(makeGuestDiagram())

    const { container } = render(<ShareButton diagramId="guest-1" />)
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)))

    expect(container).toBeEmptyDOMElement()
  })

  it('follows the published state stored in this browser', async () => {
    await db.diagrams.add(makeAccountDiagram())
    render(<ShareButton diagramId="account-1" />)
    fireEvent.click(await screen.findByRole('button', { name: 'Compartilhar' }))

    await act(() =>
      db.diagrams.update('account-1', {
        publicSlug: 'slugPublicoComEntropia01',
      }),
    )

    expect(await screen.findByLabelText('Link público')).toHaveValue(
      `${window.location.origin}/view/slugPublicoComEntropia01`,
    )
  })
})
