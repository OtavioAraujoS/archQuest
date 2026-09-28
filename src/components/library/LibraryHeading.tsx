import { FilePlus2, FileUp, FolderPlus, LayoutTemplate } from 'lucide-react'

import { FolderBreadcrumb } from '@/components/library/folders/FolderBreadcrumb'
import { Button } from '@/components/ui/button'
import { DisplayHeading } from '@/components/ui/display-heading'
import type { FolderRecord } from '@/lib/db'

interface LibraryHeadingProps {
  isSignedIn: boolean
  canOpenFiles: boolean
  currentFolder: FolderRecord | null
  onStartBlankDiagram: () => void
  onBrowseTemplates: () => void
  onOpenFile: () => void
  onCreateFolder: () => void
}

function describeLibrary(isSignedIn: boolean, isInsideFolder: boolean) {
  if (isInsideFolder) return 'Os diagramas guardados nesta pasta.'
  return isSignedIn
    ? 'Seus diagramas de processo de negócio, salvos na sua conta.'
    : 'Seus diagramas de processo de negócio, salvos localmente neste navegador.'
}

export function LibraryHeading({
  isSignedIn,
  canOpenFiles,
  currentFolder,
  onStartBlankDiagram,
  onBrowseTemplates,
  onOpenFile,
  onCreateFolder,
}: Readonly<LibraryHeadingProps>) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        {currentFolder && <FolderBreadcrumb folderName={currentFolder.name} />}
        <DisplayHeading as="h1" className="truncate">
          {currentFolder?.name ?? 'Meus diagramas'}
        </DisplayHeading>
        <p className="text-muted-foreground text-sm">
          {describeLibrary(isSignedIn, currentFolder !== null)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {canOpenFiles && (
          <Button variant="ghost" onClick={onOpenFile}>
            <FileUp /> Abrir arquivo
          </Button>
        )}
        {!currentFolder && (
          <Button variant="outline" onClick={onCreateFolder}>
            <FolderPlus /> Nova pasta
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
