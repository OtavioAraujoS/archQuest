import { HeroSection } from '@/components/landing/HeroSection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { PrinciplesSection } from '@/components/landing/PrinciplesSection'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'
import { useStartDiagram } from '@/hooks/useStartDiagram'

export function LandingPage() {
  const { startBlankDiagram, startDiagramFromTemplate } = useStartDiagram()

  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection onStartBlankDiagram={() => void startBlankDiagram()} />
        <TemplateShowcase
          onTemplateChosen={(template) => void startDiagramFromTemplate(template)}
        />
        <PrinciplesSection />
      </main>
      <LandingFooter />
    </div>
  )
}
