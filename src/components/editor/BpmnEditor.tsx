import { ArrowLeft, Download, FileUp, Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { CloudSyncIndicator } from '@/components/editor/CloudSyncIndicator'
import { ConflictDialog } from '@/components/editor/ConflictDialog'
import { ElementStylePanel } from '@/components/editor/ElementStylePanel'
import { SaveToFileButton } from '@/components/editor/file-link/SaveToFileButton'
import { useFileLink } from '@/hooks/editor/file-link/useFileLink'
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel'
import { ShareButton } from '@/components/editor/sharing/ShareButton'
import { useBpmnEditor } from '@/hooks/editor/useBpmnEditor'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { LIBRARY_PATH } from '@/lib/routes'
import { useSyncStore } from '@/lib/sync/sync-store'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import '@/components/editor/bpmn-theme.css'

export function BpmnEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    containerRef,
    modelerRef,
    name,
    status,
    persistName,
    reloadDiagram,
    handleExportBpmn,
    handleExportSvg,
    handleExportPng,
    handleImport,
  } = useBpmnEditor(id)
  const { isFileSystemSupported, linkedFileName, isSavingToFile, saveToFile } = useFileLink({
    diagramId: id,
    diagramName: name,
    modelerRef,
    downloadBpmnInstead: handleExportBpmn,
  })
  const isConflicted = useSyncStore(
    (state) => id !== undefined && state.conflictedDiagramIds.includes(id),
  )

  return (
    <div className="flex h-svh flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(LIBRARY_PATH)} aria-label="Voltar">
          <ArrowLeft />
        </Button>
        <input
          value={name}
          onChange={(event) => persistName(event.target.value)}
          className="min-w-0 flex-1 rounded-md border-none bg-transparent px-2 py-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Nome do diagrama"
        />
        <CloudSyncIndicator diagramId={id} />
        <ShareButton diagramId={id} />
        <label>
          <Button variant="outline" size="sm" asChild>
            <span>
              <FileUp /> Importar .bpmn
            </span>
          </Button>
          <input type="file" accept=".bpmn,.xml" className="hidden" onChange={handleImport} />
        </label>
        {isFileSystemSupported && (
          <SaveToFileButton
            linkedFileName={linkedFileName}
            isSavingToFile={isSavingToFile}
            onSaveToFile={() => void saveToFile()}
          />
        )}
        <Button variant="outline" size="sm" onClick={handleExportBpmn}>
          <Download /> .bpmn
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportSvg}>
          <ImageIcon /> SVG
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPng}>
          <ImageIcon /> PNG
        </Button>
        <ThemeToggle />
      </header>
      {isConflicted && id && (
        <ConflictDialog
          diagramId={id}
          onCloudVersionLoaded={reloadDiagram}
          onDiagramDeletedInCloud={() => navigate(LIBRARY_PATH, { replace: true })}
        />
      )}
      {status === 'error' && (
        <p className="p-4 text-sm text-destructive">
          Não foi possível carregar este diagrama. Ele pode ter sido removido.
        </p>
      )}
      <div className="relative min-h-0 flex-1">
        <div ref={containerRef} className="archquest-bpmn size-full" />
        <ElementStylePanel modelerRef={modelerRef} status={status} />
        <PropertiesPanel modelerRef={modelerRef} status={status} />
      </div>
    </div>
  )
}
