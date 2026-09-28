import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { ModalDialog } from '@/components/ui/modal-dialog'
import { signOutOfThisDevice } from '@/lib/auth/sign-out-of-this-device'
import { flushPendingUploads } from '@/lib/sync/flush-pending-uploads'

interface SignOutDialogProps {
  ownerId: string
  pendingDiagramCount: number
  onClose: () => void
}

type SignOutStep = 'choosing' | 'syncing' | 'signing-out'

function pendingDiagramsLabel(count: number) {
  return count === 1 ? '1 diagrama' : `${count} diagramas`
}

function notUploadedMessage(count: number) {
  const whatFailed =
    count === 1 ? '1 diagrama não foi' : `${count} diagramas não foram`
  return `${whatFailed} para a nuvem (sem conexão, conflito ou acima de 2 MB). Tente de novo, saia mesmo assim ou cancele para resolver.`
}

export function SignOutDialog({
  ownerId,
  pendingDiagramCount,
  onClose,
}: Readonly<SignOutDialogProps>) {
  const [step, setStep] = useState<SignOutStep>('choosing')
  const [problem, setProblem] = useState<string | null>(null)

  async function signOutNow() {
    setStep('signing-out')
    try {
      await signOutOfThisDevice()
      onClose()
    } catch {
      setProblem('Não foi possível sair. Confira a conexão e tente de novo.')
      setStep('choosing')
    }
  }

  async function syncThenSignOut() {
    setStep('syncing')
    setProblem(null)
    const remainingCount = await flushPendingUploads(ownerId)
    if (remainingCount === 0) return signOutNow()
    setProblem(notUploadedMessage(remainingCount))
    setStep('choosing')
  }

  const isBusy = step !== 'choosing'
  return (
    <ModalDialog
      title="Sair com alterações pendentes?"
      onClose={onClose}
      className="max-w-md"
    >
      <p className="text-muted-foreground mb-4 text-sm">
        Você tem {pendingDiagramsLabel(pendingDiagramCount)} com alterações que
        ainda não foram para a nuvem. Ao sair, os diagramas da conta são
        apagados deste navegador.
      </p>
      {problem && <ErrorMessage className="mb-4">{problem}</ErrorMessage>}
      <div className="flex flex-col gap-2">
        <Button onClick={syncThenSignOut} disabled={isBusy}>
          {step === 'syncing' ? 'Sincronizando…' : 'Sincronizar e sair'}
        </Button>
        <Button variant="outline" onClick={signOutNow} disabled={isBusy}>
          {step === 'signing-out' ? 'Saindo…' : 'Sair mesmo assim'}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={isBusy}>
          Cancelar
        </Button>
      </div>
    </ModalDialog>
  )
}
