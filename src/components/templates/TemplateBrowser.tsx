import { ArrowRight } from 'lucide-react'
import { Suspense, lazy, useState } from 'react'

import {
  TEMPLATE_PREVIEW_PANEL_ID,
  templateTabId,
} from '@/components/templates/template-tab-ids'
import { TemplateTabs } from '@/components/templates/TemplateTabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DIAGRAM_TEMPLATES, type DiagramTemplate } from '@/templates'

const TemplatePreviewCanvas = lazy(
  () => import('@/components/templates/TemplatePreviewCanvas'),
)

interface TemplateBrowserProps {
  onTemplateChosen: (template: DiagramTemplate) => void
  previewHeightClassName?: string
}

export function TemplateBrowser({
  onTemplateChosen,
  previewHeightClassName = 'h-72 sm:h-96 lg:h-104',
}: Readonly<TemplateBrowserProps>) {
  const [selectedTemplate, setSelectedTemplate] = useState(DIAGRAM_TEMPLATES[0])

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <TemplateTabs
        templates={DIAGRAM_TEMPLATES}
        selectedTemplate={selectedTemplate}
        onTemplateSelected={setSelectedTemplate}
      />
      <div
        id={TEMPLATE_PREVIEW_PANEL_ID}
        role="tabpanel"
        aria-labelledby={templateTabId(selectedTemplate)}
        className="bg-card flex min-w-0 flex-col overflow-hidden rounded-xl border"
      >
        <div className={cn(previewHeightClassName)}>
          <Suspense
            fallback={<div className="bg-muted/40 h-full animate-pulse" />}
          >
            <TemplatePreviewCanvas bpmnXml={selectedTemplate.xml} />
          </Suspense>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
          <p className="text-sm font-medium">{selectedTemplate.name}</p>
          <Button onClick={() => onTemplateChosen(selectedTemplate)}>
            Usar este modelo <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
