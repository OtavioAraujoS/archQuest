import { Link } from 'react-router-dom'

import { AccountMenu } from '@/components/auth/AccountMenu'
import { ArchQuestWordmark } from '@/components/brand/ArchQuestWordmark'
import { ThemeToggle } from '@/components/theme-toggle'
import { LANDING_PATH } from '@/lib/routes'

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to={LANDING_PATH}
          aria-label="archQuest, página inicial"
          className="focus-visible:ring-ring/50 rounded-md outline-none focus-visible:ring-[3px]"
        >
          <ArchQuestWordmark />
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <AccountMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
