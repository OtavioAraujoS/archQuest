import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/lib/auth/auth-store'
import { LIBRARY_PATH } from '@/lib/routes'

function readProviderErrorFromUrl() {
  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.slice(1))
  return (
    searchParams.get('error_description') ??
    hashParams.get('error_description') ??
    searchParams.get('error') ??
    hashParams.get('error')
  )
}

export function AuthCallback() {
  const navigate = useNavigate()
  const status = useAuthStore((state) => state.status)
  const providerError = readProviderErrorFromUrl()
  const shouldReturnToLibrary =
    !providerError && (status === 'signed-in' || status === 'cloud-disabled')

  useEffect(() => {
    if (shouldReturnToLibrary) navigate(LIBRARY_PATH, { replace: true })
  }, [shouldReturnToLibrary, navigate])

  if (!providerError && status === 'loading') {
    return <p className="text-muted-foreground p-10 text-center text-sm">Entrando…</p>
  }

  if (!providerError && status !== 'signed-out') return null

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 px-6 py-16 text-center">
      <h1 className="text-lg font-semibold">Não foi possível entrar</h1>
      <p className="text-muted-foreground text-sm">
        {providerError ??
          'O link de acesso expirou ou foi aberto em outro navegador. Peça um novo link.'}
      </p>
      <Link to={LIBRARY_PATH} replace className="text-sm font-medium underline underline-offset-4">
        Voltar para os diagramas
      </Link>
    </div>
  )
}
