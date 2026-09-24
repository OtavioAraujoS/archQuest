import { ArrowRight } from 'lucide-react'
import { Suspense, lazy, useState } from 'react'

import { TEMPLATE_SHOWCASE_ID } from '@/components/landing/landing-links'
import {
  TEMPLATE_PREVIEW_PANEL_ID,
  templateTabId,
} from '@/components/landing/template-tab-ids'
import { TemplateTabs } from '@/components/landing/TemplateTabs'
import { Button } from '@/components/ui/button'
import { DIAGRAM_TEMPLATES, type DiagramTemplate } from '@/templates'

const TemplatePreviewCanvas = lazy(
  () => import('@/components/landing/TemplatePreviewCanvas'),
)

interface TemplateShowcaseProps {
  onTemplateChosen: (template: DiagramTemplate) => void
}

export function TemplateShowcase({
  onTemplateChosen,
}: Readonly<TemplateShowcaseProps>) {
  const [selectedTemplate, setSelectedTemplate] = useState(DIAGRAM_TEMPLATES[0])

  return (
    <section
      id={TEMPLATE_SHOWCASE_ID}
      aria-labelledby="template-showcase-title"
      className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mb-8 flex max-w-2xl flex-col gap-3">
        <h2
          id="template-showcase-title"
          className="font-display text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl"
        >
          Comece por um processo que já funciona
        </h2>
        <p className="text-muted-foreground text-pretty">
          Cinco modelos em português, desenhados em BPMN 2.0 válido. Escolha um,
          veja o fluxo completo e abra no editor para adaptar à sua realidade.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <TemplateTabs
          templates={DIAGRAM_TEMPLATES}
          selectedTemplate={selectedTemplate}
          onTemplateSelected={setSelectedTemplate}
        />
        <div
          id={TEMPLATE_PREVIEW_PANEL_ID}
          role="tabpanel"
          aria-labelledby={templateTabId(selectedTemplate)}
          className="bg-card flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="h-72 sm:h-96 lg:h-104">
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
    </section>
  )
}
