import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RefusedConnectionNotice } from '@/components/editor/RefusedConnectionNotice'

describe('RefusedConnectionNotice', () => {
  it('announces why the connection was refused', () => {
    render(
      <RefusedConnectionNotice
        message="Setas sólidas não ligam pools diferentes."
        onDismiss={vi.fn()}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Ligação não permitida. Setas sólidas não ligam pools diferentes.',
    )
  })

  it('closes when the person dismisses it', () => {
    const onDismiss = vi.fn()
    render(<RefusedConnectionNotice message="Motivo" onDismiss={onDismiss} />)

    fireEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }))

    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('keeps an empty live region while there is nothing to say', () => {
    render(<RefusedConnectionNotice message={null} onDismiss={vi.fn()} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
