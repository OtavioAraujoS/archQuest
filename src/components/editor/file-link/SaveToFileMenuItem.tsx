import { Save } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu-item'

const SHORTCUT_HINT = 'Ctrl+S'

function saveMenuItemLabel(
  linkedFileName: string | null,
  isSavingToFile: boolean,
) {
  if (isSavingToFile) return 'Salvando…'
  return linkedFileName ? `Salvar em ${linkedFileName}` : 'Salvar no arquivo'
}

function saveMenuItemHint(linkedFileName: string | null) {
  return linkedFileName
    ? `Grava em ${linkedFileName} (${SHORTCUT_HINT})`
    : `Escolhe um arquivo .bpmn no computador e passa a gravar nele (${SHORTCUT_HINT})`
}

interface SaveToFileMenuItemProps {
  linkedFileName: string | null
  isSavingToFile: boolean
  onSaveToFile: () => void
}

export function SaveToFileMenuItem({
  linkedFileName,
  isSavingToFile,
  onSaveToFile,
}: Readonly<SaveToFileMenuItemProps>) {
  return (
    <DropdownMenuItem
      onSelect={onSaveToFile}
      disabled={isSavingToFile}
      hint={saveMenuItemHint(linkedFileName)}
    >
      <Save />
      <span className="min-w-0 flex-1 truncate">
        {saveMenuItemLabel(linkedFileName, isSavingToFile)}
      </span>
      <kbd className="text-muted-foreground font-sans text-xs">
        {SHORTCUT_HINT}
      </kbd>
    </DropdownMenuItem>
  )
}
