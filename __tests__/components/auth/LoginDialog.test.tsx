import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginDialog } from '@/components/auth/LoginDialog'

const { signInWithGitHub, sendMagicLink } = vi.hoisted(() => ({
  signInWithGitHub: vi.fn(),
  sendMagicLink: vi.fn(),
}))

vi.mock('@/lib/auth/auth-actions', () => ({ signInWithGitHub, sendMagicLink }))

function requestMagicLinkFor(email: string) {
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: email } })
  fireEvent.click(screen.getByRole('button', { name: 'Receber link por e-mail' }))
}

describe('LoginDialog', () => {
  beforeEach(() => {
    signInWithGitHub.mockReset().mockResolvedValue(undefined)
    sendMagicLink.mockReset().mockResolvedValue(undefined)
  })

  it('starts the GitHub sign in', async () => {
    render(<LoginDialog onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Entrar com GitHub' }))

    expect(signInWithGitHub).toHaveBeenCalledOnce()
    expect(await screen.findByRole('button', { name: 'Abrindo o GitHub…' })).toBeDisabled()
  })

  it('reports when the GitHub sign in cannot start', async () => {
    signInWithGitHub.mockRejectedValue(new Error('network'))
    render(<LoginDialog onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Entrar com GitHub' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('login do GitHub')
    expect(screen.getByRole('button', { name: 'Entrar com GitHub' })).toBeEnabled()
  })

  it('sends a magic link to the trimmed e-mail and confirms it', async () => {
    render(<LoginDialog onClose={vi.fn()} />)

    requestMagicLinkFor('  dev@example.com ')

    expect(sendMagicLink).toHaveBeenCalledWith('dev@example.com')
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Enviamos um link de acesso para dev@example.com',
    )
  })

  it('lets the user retry when the magic link fails', async () => {
    sendMagicLink.mockRejectedValue(new Error('email rate limit exceeded'))
    render(<LoginDialog onClose={vi.fn()} />)

    requestMagicLinkFor('dev@example.com')

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível enviar')
    expect(screen.getByRole('button', { name: 'Receber link por e-mail' })).toBeEnabled()
  })
})
