import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { MessagePage } from '@/components/layout/MessagePage'

describe('MessagePage', () => {
  it('shows a title, an explanation and the way out', () => {
    render(
      <MemoryRouter>
        <MessagePage
          title="Diagrama não encontrado"
          detail="O link pode ter sido desativado."
          linkLabel="Ir para o archQuest"
          linkTo="/"
        />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Diagrama não encontrado',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('O link pode ter sido desativado.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ir para o archQuest' }),
    ).toHaveAttribute('href', '/')
  })
})
