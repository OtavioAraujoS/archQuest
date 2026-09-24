import { ChevronDown, FileUp } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'

import { SaveToFileMenuItem } from '@/components/editor/file-link/SaveToFileMenuItem'
import { ExportMenuItems } from '@/components/export/ExportMenuItems'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu-item'

interface DiagramFileMenuProps {
  canSaveToFile: boolean
  linkedFileName: string | null
  isSavingToFile: boolean
  onSaveToFile: () => void
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void
  onExportBpmn: () => void
  onExportSvg: () => void
  onExportPng: () => void
}

export function DiagramFileMenu({
  canSaveToFile,
  linkedFileName,
  isSavingToFile,
  onSaveToFile,
  onImportFile,
  onExportBpmn,
  onExportSvg,
  onExportPng,
}: Readonly<DiagramFileMenuProps>) {
  const importInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <DropdownMenu
        menuLabel="Arquivo"
        trigger={
          <>
            Arquivo <ChevronDown />
          </>
        }
      >
        <DropdownMenuItem onSelect={() => importInputRef.current?.click()}>
          <FileUp /> Importar .bpmn…
        </DropdownMenuItem>
        {canSaveToFile && (
          <SaveToFileMenuItem
            linkedFileName={linkedFileName}
            isSavingToFile={isSavingToFile}
            onSaveToFile={onSaveToFile}
          />
        )}
        <DropdownMenuSeparator />
        <ExportMenuItems
          onExportBpmn={onExportBpmn}
          onExportSvg={onExportSvg}
          onExportPng={onExportPng}
        />
      </DropdownMenu>
      <input
        ref={importInputRef}
        type="file"
        accept=".bpmn,.xml"
        aria-label="Arquivo .bpmn para importar"
        className="hidden"
        onChange={onImportFile}
      />
    </>
  )
}
