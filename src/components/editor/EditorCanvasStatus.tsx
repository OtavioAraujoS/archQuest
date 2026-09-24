import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { EditorStatus } from '@/hooks/editor/useSelectedElements'

interface EditorCanvasStatusProps {
  status: EditorStatus
  onBackToLibrary: () => void
}

export function EditorCanvasStatus({
  status,
  onBackToLibrary,
}: Readonly<EditorCanvasStatusProps>) {
  if (status === 'loading') {
    return (
      <output className="bg-background/80 text-muted-foreground absolute inset-0 z-10 flex items-center justify-center text-sm">
        <span className="animate-pulse">Carregando diagrama…</span>
      </output>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-background absolute inset-0 z-10 flex items-center justify-center p-6">
        <div
          role="alert"
          className="flex max-w-sm flex-col items-center gap-4 text-center"
        >
          <p className="text-sm">
            Não foi possível carregar este diagrama. Ele pode ter sido removido.
          </p>
          <Button variant="outline" onClick={onBackToLibrary}>
            <ArrowLeft /> Voltar para os diagramas
          </Button>
        </div>
      </div>
    )
  }

  return null
}
