import { useNavigate, useParams } from 'react-router-dom'

import { ConflictDialog } from '@/components/editor/ConflictDialog'
import { EditorCanvasStatus } from '@/components/editor/EditorCanvasStatus'
import { EditorHeader } from '@/components/editor/EditorHeader'
import { ElementInspector } from '@/components/editor/ElementInspector'
import { PaletteHint } from '@/components/editor/palette/PaletteHint'
import { useFileLink } from '@/hooks/editor/file-link/useFileLink'
import { useBpmnEditor } from '@/hooks/editor/useBpmnEditor'
import { useCanvasResizeSync } from '@/hooks/editor/useCanvasResizeSync'
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
    autosaveState,
    persistName,
    reloadDiagram,
    handleExportBpmn,
    handleExportSvg,
    handleExportPng,
    handleImport,
  } = useBpmnEditor(id)
  const fileLink = useFileLink({
    diagramId: id,
    diagramName: name,
    modelerRef,
    downloadBpmnInstead: handleExportBpmn,
  })
  const isConflicted = useSyncStore(
    (state) => id !== undefined && state.conflictedDiagramIds.includes(id),
  )
  useCanvasResizeSync(containerRef, modelerRef)
  const backToLibrary = () => navigate(LIBRARY_PATH)

  return (
    <div className="flex h-svh flex-col">
      <EditorHeader
        diagramId={id}
        diagramName={name}
        autosaveState={autosaveState}
        fileLink={{ ...fileLink, saveToFile: () => void fileLink.saveToFile() }}
        onBack={backToLibrary}
        onRename={(nextName) => void persistName(nextName)}
        onImportFile={(event) => void handleImport(event)}
        onExportBpmn={() => void handleExportBpmn()}
        onExportSvg={() => void handleExportSvg()}
        onExportPng={() => void handleExportPng()}
      />
      {isConflicted && id && (
        <ConflictDialog
          diagramId={id}
          onCloudVersionLoaded={reloadDiagram}
          onDiagramDeletedInCloud={() =>
            navigate(LIBRARY_PATH, { replace: true })
          }
        />
      )}
      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="relative min-w-0 flex-1">
          <div ref={containerRef} className="archquest-bpmn size-full" />
          <EditorCanvasStatus status={status} onBackToLibrary={backToLibrary} />
          {status === 'ready' && <PaletteHint />}
        </div>
        <ElementInspector modelerRef={modelerRef} status={status} />
      </div>
    </div>
  )
}
