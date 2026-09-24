import { Lightbulb } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { usePaletteHintDismissal } from '@/hooks/editor/usePaletteHintDismissal'

export function PaletteHint() {
  const { isHintDismissed, dismissHint } = usePaletteHintDismissal()
  if (isHintDismissed) return null

  return (
    <aside
      aria-label="Dica da paleta"
      className="bg-popover text-popover-foreground absolute bottom-4 left-4 z-10 flex max-w-xs flex-col gap-3 rounded-xl border p-4 shadow-md"
    >
      <p className="flex gap-2 text-sm leading-relaxed">
        <Lightbulb
          className="text-primary mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <span>
          Os ícones da paleta com um triângulo no canto agrupam variações:
          clique para escolher o tipo ou arraste para criar o mais comum.
        </span>
      </p>
      <Button
        size="sm"
        variant="secondary"
        className="self-end"
        onClick={dismissHint}
      >
        Entendi
      </Button>
    </aside>
  )
}
