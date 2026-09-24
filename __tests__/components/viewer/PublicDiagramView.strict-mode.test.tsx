import { act, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { PublicDiagramView } from '@/components/viewer/PublicDiagramView'

vi.mock('bpmn-js/lib/NavigatedViewer', () => ({
  default: vi.fn().mockImplementation(function ViewerThatFailsOnceDestroyed() {
    let isDestroyed = false
    return {
      importXML: async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        if (isDestroyed) throw new Error('viewer destroyed during import')
      },
      destroy: () => {
        isDestroyed = true
      },
      get: () => ({ zoom: vi.fn() }),
    }
  }),
}))

const PUBLIC_DIAGRAM = {
  name: 'Reembolso de despesas',
  bpmn_xml: '<bpmn:definitions />',
  updated_at: '2026-09-24T10:00:00.000Z',
}

describe('PublicDiagramView under React StrictMode', () => {
  it('ignores the failure of the viewer discarded by the double mount', async () => {
    render(
      <StrictMode>
        <PublicDiagramView diagram={PUBLIC_DIAGRAM} />
      </StrictMode>,
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 50)))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
