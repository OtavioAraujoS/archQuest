import { Download, Image as ImageIcon } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { usePublicViewer } from '@/components/viewer/usePublicViewer'
import type { PublicDiagram } from '@/lib/supabase/database-types'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import '@/components/editor/bpmn-theme.css'

interface PublicDiagramViewProps {
  diagram: PublicDiagram
}

export function PublicDiagramView({ diagram }: Readonly<PublicDiagramViewProps>) {
  const { containerRef, hasRenderFailed, downloadBpmn, downloadSvg, downloadPng } =
    usePublicViewer(diagram)

  return (
    <div className="flex h-svh flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-2">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">{diagram.name}</h1>
          <p className="text-muted-foreground text-xs">
            Atualizado em {new Date(diagram.updated_at).toLocaleString()} · somente leitura
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadBpmn}>
          <Download /> .bpmn
        </Button>
        <Button variant="outline" size="sm" onClick={() => void downloadSvg()}>
          <ImageIcon /> SVG
        </Button>
        <Button variant="outline" size="sm" onClick={() => void downloadPng()}>
          <ImageIcon /> PNG
        </Button>
        <ThemeToggle />
      </header>
      {hasRenderFailed && (
        <p role="alert" className="text-destructive p-4 text-sm">
          Não foi possível desenhar este diagrama. Ainda dá para baixar o arquivo .bpmn.
        </p>
      )}
      <div ref={containerRef} className="archquest-bpmn min-h-0 flex-1" />
    </div>
  )
}
