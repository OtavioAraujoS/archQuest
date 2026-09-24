import { UploadCloud } from 'lucide-react'

import { DiagramGrid } from '@/components/library/DiagramGrid'
import type { CloudPullStatus } from '@/components/library/useLibraryDiagrams'
import { Button } from '@/components/ui/button'
import type { DiagramRecord } from '@/lib/db'

interface SignedInDiagramSectionsProps {
  accountDiagrams: DiagramRecord[] | undefined
  guestDiagrams: DiagramRecord[] | undefined
  cloudPullStatus: CloudPullStatus
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onMoveGuestDiagrams: () => void
}

export function SignedInDiagramSections({
  accountDiagrams,
  guestDiagrams,
  cloudPullStatus,
  onOpen,
  onDelete,
  onMoveGuestDiagrams,
}: Readonly<SignedInDiagramSectionsProps>) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        {cloudPullStatus === 'pulling' && (
          <output className="text-muted-foreground block text-sm">
            Buscando seus diagramas na nuvem…
          </output>
        )}
        {cloudPullStatus === 'failed' && (
          <p role="alert" className="text-destructive text-sm">
            Não foi possível buscar seus diagramas na nuvem. Mostrando a cópia salva neste
            navegador.
          </p>
        )}
        <DiagramGrid
          diagrams={accountDiagrams}
          emptyMessage="Nenhum diagrama na sua conta ainda. Crie o primeiro para começar."
          onOpen={onOpen}
          onDelete={onDelete}
        />
      </section>

      {guestDiagrams && guestDiagrams.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Só neste navegador</h2>
              <p className="text-muted-foreground text-sm">
                Estes diagramas foram criados sem login e não estão na sua conta.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onMoveGuestDiagrams}>
              <UploadCloud /> Enviar para a conta
            </Button>
          </div>
          <DiagramGrid
            diagrams={guestDiagrams}
            emptyMessage=""
            onOpen={onOpen}
            onDelete={onDelete}
          />
        </section>
      )}
    </div>
  )
}
