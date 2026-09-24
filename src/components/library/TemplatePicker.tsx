import { LayoutTemplate } from 'lucide-react'

import { ModalDialog } from '@/components/ui/modal-dialog'
import { DIAGRAM_TEMPLATES, type DiagramTemplate } from '@/templates'

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
      title="Começar a partir de um template"
      onClose={onClose}
      className="max-w-2xl"
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DIAGRAM_TEMPLATES.map((template) => (
          <li key={template.id}>
            <button
              type="button"
              onClick={() => onTemplateChosen(template)}
              className="hover:border-ring focus-visible:ring-ring flex h-full w-full gap-3 rounded-lg border p-4 text-left transition-colors outline-none focus-visible:ring-2"
            >
              <LayoutTemplate className="text-muted-foreground mt-0.5 size-5 shrink-0" />
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium">{template.name}</span>
                <span className="text-muted-foreground text-xs">
                  {template.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </ModalDialog>
  )
}
