import { resolveThemedColorsForExport } from '@/lib/diagram-colors'
import { saveDiagramContent } from '@/lib/diagrams/local-diagram-changes'

export type AutosaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'failed'

export const AUTOSAVE_DEBOUNCE_MS = 30 * 1000

interface AutosavableModeler {
  saveXML(options: { format: boolean }): Promise<{ xml?: string }>
  saveSVG(): Promise<{ svg: string }>
}

export function createDiagramAutosave(
  modeler: AutosavableModeler,
  diagramId: string,
  onAutosaveStateChange: (state: AutosaveState) => void,
) {
  let pendingSaveTimeout: ReturnType<typeof setTimeout> | null = null
  let saveInProgress: Promise<void> | null = null

  async function persist() {
    onAutosaveStateChange('saving')
    try {
      const thumbnailSnapshot = modeler.saveSVG()
      const { xml } = await modeler.saveXML({ format: true })
      const { svg } = await thumbnailSnapshot
      if (!xml) return onAutosaveStateChange('idle')
      await saveDiagramContent(diagramId, {
        bpmnXml: xml,
        thumbnail: resolveThemedColorsForExport(svg),
      })
      onAutosaveStateChange('saved')
    } catch (error) {
      console.error('Autosave failed', error)
      onAutosaveStateChange('failed')
    }
  }

  function startSaving() {
    saveInProgress = persist().finally(() => {
      saveInProgress = null
    })
    return saveInProgress
  }

  function cancelPendingSave() {
    if (pendingSaveTimeout) clearTimeout(pendingSaveTimeout)
    pendingSaveTimeout = null
  }

  function scheduleSave() {
    cancelPendingSave()
    onAutosaveStateChange('pending')
    pendingSaveTimeout = setTimeout(() => {
      pendingSaveTimeout = null
      void startSaving()
    }, AUTOSAVE_DEBOUNCE_MS)
  }

  function hasPendingSave() {
    return pendingSaveTimeout !== null
  }

  function isSaving() {
    return saveInProgress !== null
  }

  async function flushPendingSave() {
    if (!hasPendingSave()) return saveInProgress ?? undefined
    cancelPendingSave()
    await startSaving()
  }

  return {
    scheduleSave,
    cancelPendingSave,
    hasPendingSave,
    isSaving,
    flushPendingSave,
  }
}
