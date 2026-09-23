import BpmnModeler from 'bpmn-js/lib/Modeler'
import { ArrowLeft, Download, FileUp, Image as ImageIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { downloadBlob, exportPng, exportSvg } from '@/lib/export'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'

const AUTOSAVE_DEBOUNCE_MS = 800

export function BpmnEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<BpmnModeler | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!id || !containerRef.current) return

    const modeler = new BpmnModeler({ container: containerRef.current })
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

  return (
    <div className="flex h-svh flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Voltar">
          <ArrowLeft />
        </Button>
        <input
          value={name}
          onChange={(event) => persistName(event.target.value)}
          className="min-w-0 flex-1 rounded-md border-none bg-transparent px-2 py-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Nome do diagrama"
        />
        <label>
          <Button variant="outline" size="sm" asChild>
            <span>
              <FileUp /> Importar .bpmn
            </span>
          </Button>
          <input type="file" accept=".bpmn,.xml" className="hidden" onChange={handleImport} />
        </label>
        <Button variant="outline" size="sm" onClick={handleExportBpmn}>
          <Download /> .bpmn
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportSvg}>
          <ImageIcon /> SVG
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPng}>
          <ImageIcon /> PNG
        </Button>
      </header>
      {status === 'error' && (
        <p className="p-4 text-sm text-destructive">
          Não foi possível carregar este diagrama. Ele pode ter sido removido.
        </p>
      )}
      <div ref={containerRef} className="min-h-0 flex-1" />
    </div>
  )
}
