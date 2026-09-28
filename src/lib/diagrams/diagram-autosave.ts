import { resolveThemedColorsForExport } from '@/lib/diagram-colors'
import { saveDiagramContent } from '@/lib/diagrams/local-diagram-changes'

export type AutosaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'failed'

export const AUTOSAVE_DEBOUNCE_MS = 2 * 60 * 1000

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

  async function persist() {
    onAutosaveStateChange('saving')
    try {
      const { xml } = await modeler.saveXML({ format: true })
      const { svg } = await modeler.saveSVG()
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

  function cancelPendingSave() {
    if (pendingSaveTimeout) clearTimeout(pendingSaveTimeout)
    pendingSaveTimeout = null
  }

  function scheduleSave() {
    cancelPendingSave()
    onAutosaveStateChange('pending')
    pendingSaveTimeout = setTimeout(() => {
      pendingSaveTimeout = null
      void persist()
    }, AUTOSAVE_DEBOUNCE_MS)
  }

  function hasPendingSave() {
    return pendingSaveTimeout !== null
  }

  async function flushPendingSave() {
    if (!hasPendingSave()) return
    cancelPendingSave()
    await persist()
  }

  return { scheduleSave, cancelPendingSave, hasPendingSave, flushPendingSave }
}
