import { TemplateBrowser } from '@/components/templates/TemplateBrowser'
import { ModalDialog } from '@/components/ui/modal-dialog'
import type { DiagramTemplate } from '@/templates'

interface TemplatePickerProps {
  onTemplateChosen: (template: DiagramTemplate) => void
  onClose: () => void
}

export function TemplatePicker({
  onTemplateChosen,
  onClose,
}: Readonly<TemplatePickerProps>) {
  return (
    <ModalDialog
      title="Começar a partir de um modelo"
      onClose={onClose}
      className="max-w-5xl"
    >
      <TemplateBrowser
        onTemplateChosen={onTemplateChosen}
        previewHeightClassName="h-60 sm:h-80"
      />
    </ModalDialog>
  )
}
