import { CircleAlert, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface RefusedConnectionNoticeProps {
  message: string | null
  onDismiss: () => void
}

export function RefusedConnectionNotice({
  message,
  onDismiss,
}: Readonly<RefusedConnectionNoticeProps>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute inset-x-4 top-4 z-20 flex justify-center"
    >
      {message && (
        <div className="bg-popover text-popover-foreground pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border p-3 pl-4 shadow-md">
          <CircleAlert
            className="text-destructive mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed">
            <span className="font-medium">Ligação não permitida. </span>
            {message}
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="-my-1 size-7 shrink-0"
            aria-label="Fechar aviso"
            onClick={onDismiss}
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  )
}
