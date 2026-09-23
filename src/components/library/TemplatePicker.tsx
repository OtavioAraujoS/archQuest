import { LayoutTemplate, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { DIAGRAM_TEMPLATES, type DiagramTemplate } from '@/templates'

interface TemplatePickerProps {
  onTemplateChosen: (template: DiagramTemplate) => void
  onClose: () => void
}

const DIALOG_TITLE_ID = 'template-picker-title'
const CLOSE_ON_ESC_OR_OUTSIDE_CLICK = 'any'

export function TemplatePicker({
  onTemplateChosen,
  onClose,
}: Readonly<TemplatePickerProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.setAttribute('closedby', CLOSE_ON_ESC_OR_OUTSIDE_CLICK)
    dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={DIALOG_TITLE_ID}
      onClose={onClose}
      className="bg-popover text-popover-foreground m-auto w-full max-w-2xl rounded-lg border p-6 shadow-lg backdrop:bg-black/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 id={DIALOG_TITLE_ID} className="text-lg font-semibold">
          Começar a partir de um template
        </h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Fechar"
          onClick={() => dialogRef.current?.close()}
        >
          <X />
        </Button>
      </div>
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
    </dialog>
  )
}
