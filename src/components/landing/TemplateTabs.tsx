import type { KeyboardEvent } from 'react'

import {
  TEMPLATE_PREVIEW_PANEL_ID,
  templateTabId,
} from '@/components/landing/template-tab-ids'
import { cn } from '@/lib/utils'
import type { DiagramTemplate } from '@/templates'

const NEXT_TAB_KEYS = new Set(['ArrowDown', 'ArrowRight'])
const PREVIOUS_TAB_KEYS = new Set(['ArrowUp', 'ArrowLeft'])

function tabStepForKey(key: string) {
  if (NEXT_TAB_KEYS.has(key)) return 1
  if (PREVIOUS_TAB_KEYS.has(key)) return -1
  return 0
}

interface TemplateTabsProps {
  templates: DiagramTemplate[]
  selectedTemplate: DiagramTemplate
  onTemplateSelected: (template: DiagramTemplate) => void
}

export function TemplateTabs({
  templates,
  selectedTemplate,
  onTemplateSelected,
}: Readonly<TemplateTabsProps>) {
  function selectNeighbourTab(event: KeyboardEvent<HTMLButtonElement>) {
    const step = tabStepForKey(event.key)
    if (step === 0) return
    event.preventDefault()
    const selectedIndex = templates.indexOf(selectedTemplate)
    const neighbour =
      templates[(selectedIndex + step + templates.length) % templates.length]
    onTemplateSelected(neighbour)
    document.getElementById(templateTabId(neighbour))?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Modelos de processo"
      aria-orientation="vertical"
      className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
    >
      {templates.map((template) => {
        const isSelected = template === selectedTemplate
        return (
          <button
            key={template.id}
            id={templateTabId(template)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={TEMPLATE_PREVIEW_PANEL_ID}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onTemplateSelected(template)}
            onKeyDown={selectNeighbourTab}
            className={cn(
              'focus-visible:ring-ring/50 w-64 shrink-0 snap-start rounded-lg border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-[3px] lg:w-auto',
              isSelected
                ? 'border-primary bg-accent'
                : 'hover:bg-accent/60 border-transparent',
            )}
          >
            <span
              className={cn(
                'block text-sm font-medium',
                isSelected && 'text-accent-foreground',
              )}
            >
              {template.name}
            </span>
            <span className="text-muted-foreground mt-1 block text-sm leading-snug">
              {template.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
