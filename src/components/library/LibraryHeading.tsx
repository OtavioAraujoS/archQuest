import { FilePlus2, FileUp, LayoutTemplate } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DisplayHeading } from '@/components/ui/display-heading'

interface LibraryHeadingProps {
  isSignedIn: boolean
  canOpenFiles: boolean
  onStartBlankDiagram: () => void
  onBrowseTemplates: () => void
  onOpenFile: () => void
}

export function LibraryHeading({
  isSignedIn,
  canOpenFiles,
  onStartBlankDiagram,
  onBrowseTemplates,
  onOpenFile,
}: Readonly<LibraryHeadingProps>) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        <DisplayHeading as="h1">Meus diagramas</DisplayHeading>
        <p className="text-muted-foreground text-sm">
          {isSignedIn
            ? 'Seus diagramas de processo de negócio, salvos na sua conta.'
            : 'Seus diagramas de processo de negócio, salvos localmente neste navegador.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {canOpenFiles && (
          <Button variant="ghost" onClick={onOpenFile}>
            <FileUp /> Abrir arquivo
          </Button>
        )}
        <Button variant="outline" onClick={onBrowseTemplates}>
          <LayoutTemplate /> Usar modelo
        </Button>
        <Button
          onClick={onStartBlankDiagram}
          className="order-first md:order-last"
        >
          <FilePlus2 /> Novo diagrama
        </Button>
      </div>
    </div>
  )
}
