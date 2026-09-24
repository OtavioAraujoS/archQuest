import { useState } from 'react'

import { PublishedLinkField } from '@/components/editor/sharing/PublishedLinkField'
import { Button } from '@/components/ui/button'
import { ModalDialog } from '@/components/ui/modal-dialog'
import type { DiagramRecord } from '@/lib/db'
import { publicDiagramUrl } from '@/lib/sharing/public-link'
import { publishDiagram, unpublishDiagram } from '@/lib/sharing/publish-diagram'

interface ShareDialogProps {
  diagram: DiagramRecord
  onClose: () => void
}

type SharingChange = 'publishing' | 'unpublishing'

export function ShareDialog({ diagram, onClose }: Readonly<ShareDialogProps>) {
  const [changeInProgress, setChangeInProgress] =
    useState<SharingChange | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const isInCloud = diagram.version > 0

  async function changeSharing(change: SharingChange) {
    setChangeInProgress(change)
    setHasFailed(false)
    try {
      if (change === 'publishing') await publishDiagram(diagram.id)
      else await unpublishDiagram(diagram.id)
    } catch {
      setHasFailed(true)
    } finally {
      setChangeInProgress(null)
    }
  }

  return (
    <ModalDialog
      title="Compartilhar diagrama"
      onClose={onClose}
      className="max-w-lg"
    >
      <p className="text-muted-foreground mb-4 text-sm">
        Quem tiver o link vê a versão atual do diagrama, só para leitura e sem
        precisar de conta. Seu nome e seu e-mail não aparecem.
      </p>

      {!isInCloud && (
        <p className="text-sm">
          Este diagrama ainda está indo para a nuvem. Quando aparecer "Salvo na
          nuvem", você poderá publicá-lo.
        </p>
      )}

      {isInCloud && !diagram.publicSlug && (
        <Button
          onClick={() => changeSharing('publishing')}
          disabled={changeInProgress !== null}
        >
          {changeInProgress === 'publishing' ? 'Publicando…' : 'Publicar link'}
        </Button>
      )}

      {isInCloud && diagram.publicSlug && (
        <div className="flex flex-col gap-4">
          <PublishedLinkField
            publicUrl={publicDiagramUrl(diagram.publicSlug)}
          />
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs">
              Despublicar desativa este link. Publicar de novo gera um link
              diferente.
            </p>
            <Button
              variant="outline"
              onClick={() => changeSharing('unpublishing')}
              disabled={changeInProgress !== null}
            >
              {changeInProgress === 'unpublishing'
                ? 'Despublicando…'
                : 'Despublicar'}
            </Button>
          </div>
        </div>
      )}

      {hasFailed && (
        <p role="alert" className="text-destructive mt-4 text-sm">
          Não foi possível falar com a nuvem. Confira a conexão e tente de novo.
        </p>
      )}
    </ModalDialog>
  )
}
