import BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, useRef, useState } from 'react'

import { db } from '@/lib/db'
import { downloadBlob, exportPng, exportSvg } from '@/lib/export'

import eventPaletteModule from './palette'
import TextStyleRenderer from './TextStyleRenderer'
import textStyleModdle from './text-style-moddle.json'

const AUTOSAVE_DEBOUNCE_MS = 800

export function useBpmnEditor(id: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<BpmnModeler | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!id || !containerRef.current) return

    const modeler = new BpmnModeler({
      container: containerRef.current,
      moddleExtensions: { archquest: textStyleModdle },
      additionalModules: [
        eventPaletteModule,
        {
          __init__: ['textStyleRenderer'],
          textStyleRenderer: ['type', TextStyleRenderer],
        },
      ],
    })
    modelerRef.current = modeler

    let cancelled = false

    async function load() {
      const record = await db.diagrams.get(id!)
      if (!record || cancelled) return
      setName(record.name)
      await modeler.importXML(record.bpmnXml)
      if (cancelled) return
      modeler.get<{ zoom: (level: string) => void }>('canvas').zoom('fit-viewport')
      setStatus('ready')
    }

    load().catch((error) => {
      console.error('Failed to load diagram', error)
      if (!cancelled) setStatus('error')
    })

    const eventBus = modeler.get<{
      on: (event: string, cb: () => void) => void
    }>('eventBus')
    eventBus.on('commandStack.changed', scheduleAutosave)

    function scheduleAutosave() {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(persist, AUTOSAVE_DEBOUNCE_MS)
    }

    async function persist() {
      if (!id) return
      try {
        const { xml } = await modeler.saveXML({ format: true })
        const { svg } = await modeler.saveSVG()
        if (!xml) return
        await db.diagrams.update(id, {
          bpmnXml: xml,
          thumbnail: svg,
          updatedAt: Date.now(),
        })
      } catch (error) {
        console.error('Autosave failed', error)
      }
    }

    return () => {
      cancelled = true
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      modeler.destroy()
      modelerRef.current = null
    }
  }, [id])

  async function persistName(nextName: string) {
    setName(nextName)
    if (!id) return
    await db.diagrams.update(id, { name: nextName, updatedAt: Date.now() })
  }

  async function handleExportBpmn() {
    const modeler = modelerRef.current
    if (!modeler) return
    const { xml } = await modeler.saveXML({ format: true })
    if (!xml) return
    downloadBlob(new Blob([xml], { type: 'application/xml' }), `${name || 'diagram'}.bpmn`)
  }

  async function handleExportSvg() {
    const modeler = modelerRef.current
    if (!modeler) return
    await exportSvg(modeler, name || 'diagram')
  }

  async function handleExportPng() {
    const modeler = modelerRef.current
    if (!modeler) return
    await exportPng(modeler, name || 'diagram')
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    const modeler = modelerRef.current
    if (!file || !modeler) return
    const xml = await file.text()
    await modeler.importXML(xml)
    modeler.get<{ zoom: (level: string) => void }>('canvas').zoom('fit-viewport')
  }

  return {
    containerRef,
    modelerRef,
    name,
    status,
    persistName,
    handleExportBpmn,
    handleExportSvg,
    handleExportPng,
    handleImport,
  }
}
