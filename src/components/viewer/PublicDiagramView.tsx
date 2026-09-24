import { ChevronDown, Download } from 'lucide-react'

import { ExportMenuItems } from '@/components/export/ExportMenuItems'
import { ThemeToggle } from '@/components/theme-toggle'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { ErrorMessage } from '@/components/ui/error-message'
import { usePublicViewer } from '@/hooks/viewer/usePublicViewer'
import { formatFullDateTime } from '@/lib/dates/format-edited-at'
import type { PublicDiagram } from '@/lib/supabase/database-types'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import '@/components/editor/bpmn-theme.css'

interface PublicDiagramViewProps {
  diagram: PublicDiagram
}

export function PublicDiagramView({
  diagram,
}: Readonly<PublicDiagramViewProps>) {
  const {
    containerRef,
    hasRenderFailed,
    downloadBpmn,
    downloadSvg,
    downloadPng,
  } = usePublicViewer(diagram)

  return (
    <div className="flex h-svh flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-2">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">{diagram.name}</h1>
          <p className="text-muted-foreground text-xs">
            Atualizado em {formatFullDateTime(Date.parse(diagram.updated_at))} ·
            somente leitura
          </p>
        </div>
        <DropdownMenu
          menuLabel="Baixar"
          trigger={
            <>
              <Download /> Baixar <ChevronDown />
            </>
          }
        >
          <ExportMenuItems
            onExportBpmn={downloadBpmn}
            onExportSvg={() => void downloadSvg()}
            onExportPng={() => void downloadPng()}
          />
        </DropdownMenu>
        <ThemeToggle />
      </header>
      {hasRenderFailed && (
        <ErrorMessage className="p-4">
          Não foi possível desenhar este diagrama. Ainda dá para baixar o
          arquivo .bpmn.
        </ErrorMessage>
      )}
      <div ref={containerRef} className="archquest-bpmn min-h-0 flex-1" />
    </div>
  )
}
