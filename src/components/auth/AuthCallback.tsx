import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { MessagePage } from '@/components/layout/MessagePage'
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
    return (
      <p className="text-muted-foreground p-10 text-center text-sm">
        Entrando…
      </p>
    )
  }

  if (!providerError && status !== 'signed-out') return null

  return (
    <MessagePage
      title="Não foi possível entrar"
      detail={
        providerError ??
        'O link de acesso expirou ou foi aberto em outro navegador. Peça um novo link.'
      }
      linkLabel="Voltar para os diagramas"
      linkTo={LIBRARY_PATH}
      replacesHistoryEntry
    />
  )
}
