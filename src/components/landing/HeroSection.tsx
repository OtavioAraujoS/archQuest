import { FilePlus2 } from 'lucide-react'

import { ArchColonnade } from '@/components/landing/ArchColonnade'
import { TEMPLATE_SHOWCASE_ID } from '@/components/landing/landing-links'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onStartBlankDiagram: () => void
}

export function HeroSection({
  onStartBlankDiagram,
}: Readonly<HeroSectionProps>) {
  return (
    <section aria-labelledby="hero-title" className="border-b">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="flex flex-col gap-6 pb-12 sm:pb-20">
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-balance font-stretch-112%"
          >
            Processos de negócio em BPMN 2.0, com a leveza de um quadro branco.
          </h1>
          <p className="text-muted-foreground max-w-[56ch] text-lg leading-relaxed text-pretty">
            Notação correta, paleta enxuta e modelos prontos em português.
            Comece agora, sem criar conta: seus diagramas ficam salvos neste
            navegador.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={onStartBlankDiagram}>
              <FilePlus2 /> Novo diagrama
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`#${TEMPLATE_SHOWCASE_ID}`}>Explorar modelos</a>
            </Button>
          </div>
        </div>
        <div className="hidden h-72 self-end lg:block">
          <ArchColonnade />
        </div>
      </div>
    </section>
  )
}
