import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface DialogActionsProps {
  className?: string
  children: ReactNode
}

export function DialogActions({
  className,
  children,
}: Readonly<DialogActionsProps>) {
  return (
    <div className={cn('mt-6 flex justify-end gap-2', className)}>
      {children}
    </div>
  )
}
