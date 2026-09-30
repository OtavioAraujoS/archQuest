import { ArrowLeft } from 'lucide-react'
import type { ChangeEvent } from 'react'

import { ArchQuestMark } from '@/components/brand/ArchQuestMark'
import { DiagramFileMenu } from '@/components/editor/DiagramFileMenu'
import { DiagramSaveStatus } from '@/components/editor/DiagramSaveStatus'
import { ShareButton } from '@/components/editor/sharing/ShareButton'
import { SpellingHint } from '@/components/spelling/SpellingHint'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import type { AutosaveState } from '@/lib/diagrams/diagram-autosave'

interface EditorHeaderProps {
  diagramId: string | undefined
  diagramName: string
  autosaveState: AutosaveState
  fileLink: {
    isFileSystemSupported: boolean
    linkedFileName: string | null
    isSavingToFile: boolean
    saveToFile: () => void
  }
  onBack: () => void
  onRename: (name: string) => void
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void
  onExportBpmn: () => void
  onExportSvg: () => void
  onExportPng: () => void
}

export function EditorHeader({
  diagramId,
  diagramName,
  autosaveState,
  fileLink,
  onBack,
  onRename,
  onImportFile,
  onExportBpmn,
  onExportSvg,
  onExportPng,
}: Readonly<EditorHeaderProps>) {
  return (
    <header className="bg-background flex items-center gap-2 border-b px-2 py-2 sm:px-4">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar">
        <ArrowLeft />
      </Button>
      <ArchQuestMark className="hidden size-6 sm:block" />
      <div className="group relative min-w-0 flex-1 sm:max-w-sm">
        <input
          value={diagramName}
          onChange={(event) => onRename(event.target.value)}
          aria-label="Nome do diagrama"
          placeholder="Nome do diagrama"
          className="hover:bg-accent/60 focus-visible:ring-ring/50 w-full truncate rounded-md bg-transparent px-2 py-1 text-sm font-medium outline-none focus-visible:ring-[3px]"
        />
        <SpellingHint
          text={diagramName}
          onReplaceText={onRename}
          className="bg-popover text-popover-foreground absolute top-full left-0 z-20 mt-1 hidden w-max max-w-xs rounded-xl border p-2 shadow-lg group-focus-within:block"
        />
      </div>
      <DiagramSaveStatus diagramId={diagramId} autosaveState={autosaveState} />
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <ShareButton diagramId={diagramId} />
        <DiagramFileMenu
          canSaveToFile={fileLink.isFileSystemSupported}
          linkedFileName={fileLink.linkedFileName}
          isSavingToFile={fileLink.isSavingToFile}
          onSaveToFile={fileLink.saveToFile}
          onImportFile={onImportFile}
          onExportBpmn={onExportBpmn}
          onExportSvg={onExportSvg}
          onExportPng={onExportPng}
        />
        <ThemeToggle />
      </div>
    </header>
  )
}
