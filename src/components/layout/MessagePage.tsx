import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface MessagePageProps {
  title: string
  detail: ReactNode
  linkLabel: string
  linkTo: string
  replacesHistoryEntry?: boolean
}

export function MessagePage({
  title,
  detail,
  linkLabel,
  linkTo,
  replacesHistoryEntry = false,
}: Readonly<MessagePageProps>) {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-3 px-6 py-16 text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{detail}</p>
      <Link
        to={linkTo}
        replace={replacesHistoryEntry}
        className="text-sm font-medium underline underline-offset-4"
      >
        {linkLabel}
      </Link>
    </main>
  )
}
