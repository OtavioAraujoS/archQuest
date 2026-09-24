import { FilePlus2, LayoutTemplate } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountMenu } from '@/components/auth/AccountMenu'
import { MigrateGuestDiagramsDialog } from '@/components/auth/MigrateGuestDiagramsDialog'
import { DiagramGrid } from '@/components/library/DiagramGrid'
import { SignedInDiagramSections } from '@/components/library/SignedInDiagramSections'
import { TemplatePicker } from '@/components/library/TemplatePicker'
import { useGuestMigrationPrompt } from '@/components/library/useGuestMigrationPrompt'
import { useLibraryDiagrams } from '@/components/library/useLibraryDiagrams'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { createDiagram } from '@/lib/create-diagram'
import { deleteDiagram } from '@/lib/diagrams/delete-diagram'
import type { DiagramTemplate } from '@/templates'

async function confirmAndDeleteDiagram(id: string) {
  if (!confirm('Excluir este diagrama? Essa ação não pode ser desfeita.')) return
  try {
    await deleteDiagram(id)
  } catch {
    alert('Não foi possível excluir o diagrama da nuvem. Confira a conexão e tente de novo.')
  }
}

export function DiagramLibrary() {
  const navigate = useNavigate()
  const { ownerId, accountDiagrams, guestDiagrams, cloudPullStatus } = useLibraryDiagrams()
  const { isGuestMigrationOpen, openGuestMigration, closeGuestMigration } =
    useGuestMigrationPrompt(ownerId, guestDiagrams)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const closeTemplatePicker = useCallback(() => setIsTemplatePickerOpen(false), [])
  const openDiagram = (id: string) => navigate(`/editor/${id}`)

  async function createBlankDiagram() {
    openDiagram(await createDiagram())
  }

  async function createDiagramFromTemplate(template: DiagramTemplate) {
    openDiagram(await createDiagram(template.name, template.xml))
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">archQuest</h1>
          <p className="text-muted-foreground text-sm">
            {ownerId
              ? 'Seus diagramas de processo de negócio, salvos na sua conta.'
              : 'Seus diagramas de processo de negócio, salvos localmente neste navegador.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AccountMenu />
          <ThemeToggle />
          <Button variant="outline" onClick={() => setIsTemplatePickerOpen(true)}>
            <LayoutTemplate /> A partir de template
          </Button>
          <Button onClick={createBlankDiagram}>
            <FilePlus2 /> Novo diagrama
          </Button>
        </div>
      </div>

      {isTemplatePickerOpen && (
        <TemplatePicker
          onTemplateChosen={createDiagramFromTemplate}
          onClose={closeTemplatePicker}
        />
      )}

      {isGuestMigrationOpen && ownerId && guestDiagrams && (
        <MigrateGuestDiagramsDialog
          ownerId={ownerId}
          guestDiagrams={guestDiagrams}
          onClose={closeGuestMigration}
        />
      )}

      {ownerId ? (
        <SignedInDiagramSections
          accountDiagrams={accountDiagrams}
          guestDiagrams={guestDiagrams}
          cloudPullStatus={cloudPullStatus}
          onOpen={openDiagram}
          onDelete={confirmAndDeleteDiagram}
          onMoveGuestDiagrams={openGuestMigration}
        />
      ) : (
        <DiagramGrid
          diagrams={guestDiagrams}
          emptyMessage="Nenhum diagrama ainda. Crie o primeiro para começar a modelar um processo."
          onOpen={openDiagram}
          onDelete={confirmAndDeleteDiagram}
        />
      )}
    </div>
  )
}
