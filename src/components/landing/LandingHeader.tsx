import { Link } from 'react-router-dom'

import { ArchQuestWordmark } from '@/components/brand/ArchQuestWordmark'
import { REPOSITORY_URL } from '@/components/landing/landing-links'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { LIBRARY_PATH } from '@/lib/routes'

export function LandingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link
        to="/"
        aria-label="archQuest, página inicial"
        className="rounded-md"
      >
        <ArchQuestWordmark />
      </Link>
      <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-2">
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            Código no GitHub
          </a>
        </Button>
        <Button asChild variant="ghost">
          <Link to={LIBRARY_PATH}>Meus diagramas</Link>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  )
}
