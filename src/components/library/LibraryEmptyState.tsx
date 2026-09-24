import { FilePlus2, LayoutTemplate } from 'lucide-react'

import { ArchQuestMark } from '@/components/brand/ArchQuestMark'
import { Button } from '@/components/ui/button'

interface LibraryEmptyStateProps {
  message: string
  onStartBlankDiagram: () => void
  onBrowseTemplates: () => void
}

export function LibraryEmptyState({
  message,
  onStartBlankDiagram,
  onBrowseTemplates,
}: Readonly<LibraryEmptyStateProps>) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border px-6 py-14 text-center">
      <ArchQuestMark className="size-12" />
      <div className="flex max-w-md flex-col gap-1">
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
          Seu primeiro processo começa aqui
        </h2>
        <p className="text-muted-foreground text-sm text-pretty">{message}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={onStartBlankDiagram}>
          <FilePlus2 /> Diagrama em branco
        </Button>
        <Button variant="outline" onClick={onBrowseTemplates}>
          <LayoutTemplate /> Começar por um modelo
        </Button>
      </div>
    </div>
  )
}
