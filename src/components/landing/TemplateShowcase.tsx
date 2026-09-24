import { TEMPLATE_SHOWCASE_ID } from '@/components/landing/landing-links'
import { TemplateBrowser } from '@/components/templates/TemplateBrowser'
import type { DiagramTemplate } from '@/templates'

interface TemplateShowcaseProps {
  onTemplateChosen: (template: DiagramTemplate) => void
}

export function TemplateShowcase({
  onTemplateChosen,
}: Readonly<TemplateShowcaseProps>) {
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
      <TemplateBrowser onTemplateChosen={onTemplateChosen} />
    </section>
  )
}
