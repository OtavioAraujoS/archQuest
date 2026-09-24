import { cn } from '@/lib/utils'

interface ArchQuestMarkProps {
  className?: string
}

export function ArchQuestMark({ className }: Readonly<ArchQuestMarkProps>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn('size-8 shrink-0', className)}>
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <path
        d="M16 41V32a16 16 0 0 1 32 0v9"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-primary-foreground"
      />
      <path
        d="M32 8l8 8-8 8-8-8z"
        strokeWidth="3"
        strokeLinejoin="round"
        className="fill-primary-foreground stroke-primary"
      />
      <circle
        cx="16"
        cy="46"
        r="5"
        strokeWidth="3"
        className="fill-primary stroke-primary-foreground"
      />
      <circle
        cx="48"
        cy="46"
        r="4.5"
        strokeWidth="5"
        className="fill-primary stroke-primary-foreground"
      />
    </svg>
  )
}
