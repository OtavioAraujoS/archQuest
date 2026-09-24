import { Save } from 'lucide-react'

import { Button } from '@/components/ui/button'

const SHORTCUT_HINT = 'Ctrl+S'

function saveButtonLabel(linkedFileName: string | null, isSavingToFile: boolean) {
  if (isSavingToFile) return 'Salvando…'
  return linkedFileName ? `Salvar em ${linkedFileName}` : 'Salvar no arquivo'
}

function saveButtonHint(linkedFileName: string | null) {
  return linkedFileName
    ? `Grava em ${linkedFileName} (${SHORTCUT_HINT})`
    : `Escolhe um arquivo .bpmn no computador e passa a gravar nele (${SHORTCUT_HINT})`
}

interface SaveToFileButtonProps {
  linkedFileName: string | null
  isSavingToFile: boolean
  onSaveToFile: () => void
}

export function SaveToFileButton({
  linkedFileName,
  isSavingToFile,
  onSaveToFile,
}: Readonly<SaveToFileButtonProps>) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onSaveToFile}
      disabled={isSavingToFile}
      title={saveButtonHint(linkedFileName)}
    >
      <Save />
      <span className="max-w-40 truncate">
        {saveButtonLabel(linkedFileName, isSavingToFile)}
      </span>
    </Button>
  )
}
