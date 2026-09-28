import { useState, type SubmitEvent } from 'react'

import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { Input } from '@/components/ui/input'
import { sendMagicLink } from '@/lib/auth/auth-actions'

type MagicLinkStatus = 'idle' | 'sending' | 'sent' | 'failed'

export function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<MagicLinkStatus>('idle')

  async function submitMagicLinkRequest(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    try {
      await sendMagicLink(email.trim())
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <output className="block text-sm">
        Enviamos um link de acesso para <strong>{email.trim()}</strong>. Abra-o
        neste mesmo navegador para entrar.
      </output>
    )
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={submitMagicLinkRequest}>
      <label htmlFor="magic-link-email" className="text-sm font-medium">
        E-mail
      </label>
      <Input
        id="magic-link-email"
        type="email"
        required
        autoComplete="email"
        placeholder="voce@exemplo.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" variant="outline" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Receber link por e-mail'}
      </Button>
      {status === 'failed' && (
        <ErrorMessage>
          Não foi possível enviar o link. Confira o e-mail e tente de novo em
          alguns minutos.
        </ErrorMessage>
      )}
    </form>
  )
}
