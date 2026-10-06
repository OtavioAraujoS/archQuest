import { useNavigate, useParams } from 'react-router-dom'

import { ConflictDialog } from '@/components/editor/ConflictDialog'
import { EditorCanvasStatus } from '@/components/editor/EditorCanvasStatus'
import { EditorHeader } from '@/components/editor/EditorHeader'
import { ElementContextMenu } from '@/components/editor/element-menu/ElementContextMenu'
import { PaletteHint } from '@/components/editor/palette/PaletteHint'
import { RefusedConnectionNotice } from '@/components/editor/RefusedConnectionNotice'
import { LabelSpellingPopover } from '@/components/editor/spelling/LabelSpellingPopover'
import { useElementContextMenu } from '@/hooks/editor/element-menu/useElementContextMenu'
import { useFileLink } from '@/hooks/editor/file-link/useFileLink'
import { useDiagramSpellingIssues } from '@/hooks/editor/spelling/useDiagramSpellingIssues'
import { useLabelSpellingSuggestions } from '@/hooks/editor/spelling/useLabelSpellingSuggestions'
import { useBpmnEditor } from '@/hooks/editor/useBpmnEditor'
import { useCanvasResizeSync } from '@/hooks/editor/useCanvasResizeSync'
import { useRefusedConnectionNotice } from '@/hooks/editor/useRefusedConnectionNotice'
import { useCachedDiagram } from '@/hooks/diagrams/useCachedDiagram'
import { LIBRARY_PATH, libraryPathFor } from '@/lib/routes'
import { useSyncStore } from '@/lib/sync/sync-store'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import '@/components/editor/bpmn-theme.css'
import '@/components/editor/spelling/spelling.css'

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
  const { refusedConnectionMessage, dismissRefusedConnectionMessage } =
    useRefusedConnectionNotice(modelerRef, status)
  const { menuAnchor, closeMenu } = useElementContextMenu(
    modelerRef,
    containerRef,
    status,
  )
  const { openSuggestions, closeSuggestions, acceptWord } =
    useLabelSpellingSuggestions(modelerRef, containerRef, status)
  const spellingIssues = useDiagramSpellingIssues(modelerRef, status)
  const folderId = useCachedDiagram(id)?.folderId
  const backToLibrary = () => navigate(libraryPathFor(folderId))

  return (
    <div className="flex h-svh flex-col">
      <EditorHeader
        diagramId={id}
        diagramName={name}
        autosaveState={autosaveState}
        spellingIssues={spellingIssues}
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
      <div className="relative min-h-0 flex-1">
        <div ref={containerRef} className="archquest-bpmn size-full" />
        <EditorCanvasStatus status={status} onBackToLibrary={backToLibrary} />
        {status === 'ready' && <PaletteHint />}
        <RefusedConnectionNotice
          message={refusedConnectionMessage}
          onDismiss={dismissRefusedConnectionMessage}
        />
        <ElementContextMenu
          modelerRef={modelerRef}
          status={status}
          anchor={menuAnchor}
          onClose={closeMenu}
        />
        <LabelSpellingPopover
          openSuggestions={openSuggestions}
          onClose={closeSuggestions}
          onAccept={acceptWord}
        />
      </div>
    </div>
  )
}
