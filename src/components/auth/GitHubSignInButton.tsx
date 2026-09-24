import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { signInWithGitHub } from '@/lib/auth/auth-actions'

export function GitHubSignInButton() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function startGitHubSignIn() {
    setIsRedirecting(true)
    setErrorMessage(null)
    try {
      await signInWithGitHub()
    } catch {
      setIsRedirecting(false)
      setErrorMessage('Não foi possível abrir o login do GitHub. Tente de novo.')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button className="w-full" onClick={startGitHubSignIn} disabled={isRedirecting}>
        {isRedirecting ? 'Abrindo o GitHub…' : 'Entrar com GitHub'}
      </Button>
      {errorMessage && (
        <p role="alert" className="text-destructive text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
