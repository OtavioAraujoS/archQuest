import BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import elementMenuModule from '@/components/editor/element-menu'
import activityResizeModule from '@/components/editor/element-resize'
import multiResizeModule from '@/components/editor/multi-resize'
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
import { savePendingChangesWhenPageHides } from '@/lib/diagrams/save-pending-changes-when-page-hides'
import { needsNewThumbnail } from '@/lib/diagrams/thumbnail-health'

type DiagramAutosave = ReturnType<typeof createDiagramAutosave>

export function useBpmnEditor(id: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<BpmnModeler | null>(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle')
  const [loadRevision, setLoadRevision] = useState(0)
  const discardPendingSaveRef = useRef(false)
  const autosaveRef = useRef<DiagramAutosave | null>(null)
  const diagramExports = useDiagramExports(modelerRef, name)

  useLayoutEffect(
    () => () => {
      if (!discardPendingSaveRef.current) {
        void autosaveRef.current?.flushPendingSave()
      }
    },
    [id, loadRevision],
  )

  useEffect(() => {
    if (!id || !containerRef.current) return
    discardPendingSaveRef.current = false

    const modeler = new BpmnModeler({
      container: containerRef.current,
      ...ARCHQUEST_RENDERING_OPTIONS,
      additionalModules: [
        groupedPaletteModule,
        multiResizeModule,
        activityResizeModule,
        elementMenuModule,
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
    autosaveRef.current = autosave

    async function load() {
      const record = await findDiagram(id!)
      if (!record || cancelled) return
      setName(record.name)
      await modeler.importXML(record.bpmnXml)
      if (cancelled) return
      fitDiagramToViewport(modeler)
      setStatus('ready')
      if (needsNewThumbnail(record.thumbnail)) await refreshThumbnail()
    }

    async function refreshThumbnail() {
      const thumbnail = resolveThemedColorsForExport(
        (await modeler.saveSVG()).svg,
      )
      if (!cancelled && !needsNewThumbnail(thumbnail)) {
        await saveDiagramThumbnail(id!, thumbnail)
      }
    }

    load().catch((error) => {
      console.error('Failed to load diagram', error)
      if (!cancelled) setStatus('error')
    })

    modeler
      .get<{ on: (event: string, callback: () => void) => void }>('eventBus')
      .on('commandStack.changed', autosave.scheduleSave)
    const stopSavingOnPageHide = savePendingChangesWhenPageHides(autosave)

    return () => {
      cancelled = true
      stopSavingOnPageHide()
      modelerRef.current = null
      autosaveRef.current = null
      if (discardPendingSaveRef.current) autosave.cancelPendingSave()
      if (!autosave.hasPendingSave() && !autosave.isSaving()) {
        return modeler.destroy()
      }
      void autosave.flushPendingSave().finally(() => modeler.destroy())
    }
  }, [id, loadRevision])

  function reloadDiagram() {
    discardPendingSaveRef.current = true
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
