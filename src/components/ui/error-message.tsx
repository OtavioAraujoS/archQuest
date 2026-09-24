import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  className?: string
  children: ReactNode
}

export function ErrorMessage({
  className,
  children,
}: Readonly<ErrorMessageProps>) {
  return (
    <p role="alert" className={cn('text-destructive text-sm', className)}>
      {children}
    </p>
  )
}
