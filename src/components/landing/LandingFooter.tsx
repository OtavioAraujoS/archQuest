import { ArchQuestMark } from '@/components/brand/ArchQuestMark'
import {
  ARCHITECTURE_DECISIONS_URL,
  BPMN_IO_URL,
  REPOSITORY_URL,
} from '@/components/landing/landing-links'
import { ExternalLink } from '@/components/ui/external-link'

const FOOTER_LINK_CLASS =
  'hover:text-foreground underline-offset-4 hover:underline'

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <ArchQuestMark className="size-5" />
          archQuest · código aberto sob licença MIT
        </p>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-5 gap-y-2">
          <ExternalLink className={FOOTER_LINK_CLASS} href={REPOSITORY_URL}>
            GitHub
          </ExternalLink>
          <ExternalLink
            className={FOOTER_LINK_CLASS}
            href={ARCHITECTURE_DECISIONS_URL}
          >
            Decisões de arquitetura
          </ExternalLink>
          <ExternalLink className={FOOTER_LINK_CLASS} href={BPMN_IO_URL}>
            Diagramas desenhados com bpmn.io
          </ExternalLink>
        </nav>
      </div>
    </footer>
  )
}
