import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { ModalDialog } from '@/components/ui/modal-dialog'
import { keepLocalVersion, loadCloudVersion } from '@/lib/sync/resolve-conflict'

interface ConflictDialogProps {
  diagramId: string
  onCloudVersionLoaded: () => void
  onDiagramDeletedInCloud: () => void
}

type ConflictChoice = 'keep-local' | 'load-cloud'

export function ConflictDialog({
  diagramId,
  onCloudVersionLoaded,
  onDiagramDeletedInCloud,
}: Readonly<ConflictDialogProps>) {
  const [pendingChoice, setPendingChoice] = useState<ConflictChoice | null>(
    null,
  )
  const [hasFailed, setHasFailed] = useState(false)

  async function resolveWith(choice: ConflictChoice) {
    setPendingChoice(choice)
    setHasFailed(false)
    try {
      if (choice === 'keep-local') {
        await keepLocalVersion(diagramId)
        return
      }
      const outcome = await loadCloudVersion(diagramId)
      if (outcome === 'deleted-in-cloud') onDiagramDeletedInCloud()
      else onCloudVersionLoaded()
    } catch {
      setHasFailed(true)
      setPendingChoice(null)
    }
  }

  return (
    <ModalDialog
      title="Este diagrama mudou em outro lugar"
      isDismissible={false}
      className="max-w-md"
    >
      <p className="text-muted-foreground mb-5 text-sm">
        Outra aba ou dispositivo salvou uma versão diferente na nuvem enquanto
        você editava. Escolha qual versão continua valendo.
      </p>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => resolveWith('keep-local')}
          disabled={pendingChoice !== null}
        >
          {pendingChoice === 'keep-local' ? 'Mantendo…' : 'Manter a minha'}
        </Button>
        <p className="text-muted-foreground mb-2 text-xs">
          Suas alterações sobrescrevem a versão da nuvem.
        </p>
        <Button
          variant="outline"
          onClick={() => resolveWith('load-cloud')}
          disabled={pendingChoice !== null}
        >
          {pendingChoice === 'load-cloud'
            ? 'Carregando…'
            : 'Carregar a da nuvem'}
        </Button>
        <p className="text-muted-foreground text-xs">
          Descarta as alterações deste navegador e abre a versão salva na nuvem.
        </p>
      </div>
      {hasFailed && (
        <ErrorMessage className="mt-4">
          Não foi possível falar com a nuvem. Confira a conexão e tente de novo.
        </ErrorMessage>
      )}
    </ModalDialog>
  )
}
