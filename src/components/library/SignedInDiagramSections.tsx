import { UploadCloud } from 'lucide-react'
import type { ReactNode } from 'react'

import { DiagramGrid } from '@/components/library/DiagramGrid'
import type { CloudPullStatus } from '@/hooks/library/useLibraryDiagrams'
import { Button } from '@/components/ui/button'
import type { DiagramRecord } from '@/lib/db'

interface SignedInDiagramSectionsProps {
  accountDiagrams: DiagramRecord[] | undefined
  guestDiagrams: DiagramRecord[] | undefined
  hasGuestDiagrams: boolean
  cloudPullStatus: CloudPullStatus
  accountEmptyState: ReactNode
  onOpen: (id: string) => void
  onDelete: (diagram: DiagramRecord) => void
  onMoveGuestDiagrams: () => void
}

export function SignedInDiagramSections({
  accountDiagrams,
  guestDiagrams,
  hasGuestDiagrams,
  cloudPullStatus,
  accountEmptyState,
  onOpen,
  onDelete,
  onMoveGuestDiagrams,
}: Readonly<SignedInDiagramSectionsProps>) {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3" aria-label="Diagramas da conta">
        {cloudPullStatus === 'pulling' && (
          <output className="text-muted-foreground block text-sm">
            Buscando seus diagramas na nuvem…
          </output>
        )}
        {cloudPullStatus === 'failed' && (
          <p role="alert" className="text-destructive text-sm">
            Não foi possível buscar seus diagramas na nuvem. Mostrando a cópia
            salva neste navegador.
          </p>
        )}
        <DiagramGrid
          diagrams={accountDiagrams}
          emptyState={accountEmptyState}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      </section>

      {hasGuestDiagrams && (
        <section className="flex flex-col gap-4 border-t pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
                Só neste navegador
              </h2>
              <p className="text-muted-foreground text-sm">
                Estes diagramas foram criados sem login e não estão na sua
                conta.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onMoveGuestDiagrams}>
              <UploadCloud /> Enviar para a conta
            </Button>
          </div>
          <DiagramGrid
            diagrams={guestDiagrams}
            emptyState={null}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        </section>
      )}
    </div>
  )
}
