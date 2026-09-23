import { ArrowLeft, Download, FileUp, Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useBpmnEditor } from '@/components/editor/useBpmnEditor'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import '@/components/editor/bpmn-theme.css'

export function BpmnEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    containerRef,
    name,
    status,
    persistName,
    handleExportBpmn,
    handleExportSvg,
    handleExportPng,
    handleImport,
  } = useBpmnEditor(id)

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
        <ThemeToggle />
      </header>
      {status === 'error' && (
        <p className="p-4 text-sm text-destructive">
          Não foi possível carregar este diagrama. Ele pode ter sido removido.
        </p>
      )}
      <div ref={containerRef} className="archquest-bpmn min-h-0 flex-1" />
    </div>
  )
}
