import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModalDialogProps {
  title: string
  onClose?: () => void
  isDismissible?: boolean
  className?: string
  children: ReactNode
}

const CLOSE_ON_ESC_OR_OUTSIDE_CLICK = 'any'
const CLOSE_ONLY_FROM_CODE = 'none'

export function ModalDialog({
  title,
  onClose,
  isDismissible = true,
  className,
  children,
}: Readonly<ModalDialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.setAttribute(
      'closedby',
      isDismissible ? CLOSE_ON_ESC_OR_OUTSIDE_CLICK : CLOSE_ONLY_FROM_CODE,
    )
    dialog.showModal()
  }, [isDismissible])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        if (!isDismissible) event.preventDefault()
      }}
      className={cn(
        'bg-popover text-popover-foreground m-auto w-full rounded-lg border p-6 shadow-lg backdrop:bg-black/50',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        {isDismissible && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Fechar"
            onClick={() => dialogRef.current?.close()}
          >
            <X />
          </Button>
        )}
      </div>
      {children}
    </dialog>
  )
}
