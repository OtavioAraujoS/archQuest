import { useLiveQuery } from 'dexie-react-hooks'
import { FilePlus2, LayoutTemplate, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TemplatePicker } from '@/components/library/TemplatePicker'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { createDiagram } from '@/lib/create-diagram'
import { db } from '@/lib/db'
import type { DiagramTemplate } from '@/templates'

async function deleteDiagram(event: React.MouseEvent, id: string) {
  event.stopPropagation()
  if (!confirm('Excluir este diagrama? Essa ação não pode ser desfeita.')) return
  await db.diagrams.delete(id)
}

export function DiagramLibrary() {
  const navigate = useNavigate()
  const diagrams = useLiveQuery(() => db.diagrams.orderBy('updatedAt').reverse().toArray())
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const closeTemplatePicker = useCallback(() => setIsTemplatePickerOpen(false), [])

  async function createBlankDiagram() {
    navigate(`/editor/${await createDiagram()}`)
  }

  async function createDiagramFromTemplate(template: DiagramTemplate) {
    navigate(`/editor/${await createDiagram(template.name, template.xml)}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">archQuest</h1>
          <p className="text-muted-foreground text-sm">
            Seus diagramas de processo de negócio, salvos localmente neste navegador.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={() => setIsTemplatePickerOpen(true)}>
            <LayoutTemplate /> A partir de template
          </Button>
          <Button onClick={createBlankDiagram}>
            <FilePlus2 /> Novo diagrama
          </Button>
        </div>
      </div>

      {isTemplatePickerOpen && (
        <TemplatePicker
          onTemplateChosen={createDiagramFromTemplate}
          onClose={closeTemplatePicker}
        />
      )}

      {diagrams?.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Nenhum diagrama ainda. Crie o primeiro para começar a modelar um processo.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {diagrams?.map((diagram) => (
          <div
            key={diagram.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-ring"
          >
            <button
              type="button"
              onClick={() => navigate(`/editor/${diagram.id}`)}
              aria-label={`Abrir diagrama ${diagram.name}`}
              className="absolute inset-0 z-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div
              className="pointer-events-none flex h-36 items-center justify-center overflow-hidden bg-muted [&_svg]:h-full [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: diagram.thumbnail ?? '' }}
            />
            <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
              <div className="pointer-events-none min-w-0">
                <p className="truncate text-sm font-medium">{diagram.name}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(diagram.updatedAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-10 shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(event) => deleteDiagram(event, diagram.id)}
                aria-label="Excluir diagrama"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
