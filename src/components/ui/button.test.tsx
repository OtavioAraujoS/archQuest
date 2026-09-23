import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('renders children and calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Excluir
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Excluir' })
    expect(button.className).toContain('bg-destructive')
    expect(button.className).toContain('h-10')
  })

  it('renders as the child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/somewhere">Ir</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Ir' })
    expect(link).toHaveAttribute('href', '/somewhere')
    expect(link.className).toContain('inline-flex')
  })

  it('blocks clicks when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Bloqueado
      </Button>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Bloqueado' }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
