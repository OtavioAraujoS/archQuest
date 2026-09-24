import BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, useRef, useState } from 'react'

import groupedPaletteModule from '@/components/editor/palette'
import propertyCommandsModule from '@/components/editor/properties'
import portugueseTranslationModule from '@/components/editor/translations'
import { useDiagramExports } from '@/hooks/editor/useDiagramExports'
import {
  ARCHQUEST_RENDERING_OPTIONS,
  textStyleRendererModule,
} from '@/lib/bpmn/archquest-rendering-options'
import { fitDiagramToViewport } from '@/lib/bpmn/fit-diagram-to-viewport'
import { resolveThemedColorsForExport } from '@/lib/diagram-colors'
import {
  createDiagramAutosave,
  type AutosaveState,
} from '@/lib/diagrams/diagram-autosave'
import { findDiagram } from '@/lib/diagrams/find-diagram'
import {
  renameDiagram,
  saveDiagramThumbnail,
} from '@/lib/diagrams/local-diagram-changes'

export function useBpmnEditor(id: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<BpmnModeler | null>(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle')
  const [loadRevision, setLoadRevision] = useState(0)
  const diagramExports = useDiagramExports(modelerRef, name)

  useEffect(() => {
    if (!id || !containerRef.current) return

    const modeler = new BpmnModeler({
      container: containerRef.current,
      ...ARCHQUEST_RENDERING_OPTIONS,
      additionalModules: [
        groupedPaletteModule,
        propertyCommandsModule,
        portugueseTranslationModule,
        textStyleRendererModule,
      ],
    })
    modelerRef.current = modeler

    let cancelled = false
    const autosave = createDiagramAutosave(modeler, id, (state) => {
      if (!cancelled) setAutosaveState(state)
    })

    async function load() {
      const record = await findDiagram(id!)
      if (!record || cancelled) return
      setName(record.name)
      await modeler.importXML(record.bpmnXml)
      if (cancelled) return
      fitDiagramToViewport(modeler)
      setStatus('ready')
      if (!record.thumbnail) await saveMissingThumbnail()
    }

    async function saveMissingThumbnail() {
      const { svg } = await modeler.saveSVG()
      if (!cancelled) {
        await saveDiagramThumbnail(id!, resolveThemedColorsForExport(svg))
      }
    }

    load().catch((error) => {
      console.error('Failed to load diagram', error)
      if (!cancelled) setStatus('error')
    })

    modeler
      .get<{ on: (event: string, callback: () => void) => void }>('eventBus')
      .on('commandStack.changed', autosave.scheduleSave)

    return () => {
      cancelled = true
      autosave.cancelPendingSave()
      modeler.destroy()
      modelerRef.current = null
    }
  }, [id, loadRevision])

  function reloadDiagram() {
    setStatus('loading')
    setLoadRevision((revision) => revision + 1)
  }

  async function persistName(nextName: string) {
    setName(nextName)
    if (!id) return
    await renameDiagram(id, nextName)
  }

  return {
    containerRef,
    modelerRef,
    name,
    status,
    autosaveState,
    persistName,
    reloadDiagram,
    ...diagramExports,
  }
}
