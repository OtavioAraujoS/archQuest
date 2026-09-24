import { ArchQuestMark } from '@/components/brand/ArchQuestMark'
import {
  ARCHITECTURE_DECISIONS_URL,
  BPMN_IO_URL,
  REPOSITORY_URL,
} from '@/components/landing/landing-links'

const FOOTER_LINK_CLASS = 'hover:text-foreground underline-offset-4 hover:underline'

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <ArchQuestMark className="size-5" />
          archQuest · código aberto sob licença MIT
        </p>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-5 gap-y-2">
          <a className={FOOTER_LINK_CLASS} href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            className={FOOTER_LINK_CLASS}
            href={ARCHITECTURE_DECISIONS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Decisões de arquitetura
          </a>
          <a className={FOOTER_LINK_CLASS} href={BPMN_IO_URL} target="_blank" rel="noreferrer">
            Diagramas desenhados com bpmn.io
          </a>
        </nav>
      </div>
    </footer>
  )
}
