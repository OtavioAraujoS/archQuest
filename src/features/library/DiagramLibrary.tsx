import { useLiveQuery } from 'dexie-react-hooks'
import { FilePlus2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { BLANK_DIAGRAM_XML } from '@/lib/blank-diagram'
import { db, type DiagramRecord } from '@/lib/db'

export function DiagramLibrary() {
  const navigate = useNavigate()
  const diagrams = useLiveQuery(() => db.diagrams.orderBy('updatedAt').reverse().toArray())

  async function createDiagram() {
    const id = crypto.randomUUID()
    const now = Date.now()
    const record: DiagramRecord = {
      id,
      name: 'Novo diagrama',
      bpmnXml: BLANK_DIAGRAM_XML,
      createdAt: now,
      updatedAt: now,
    }
    await db.diagrams.add(record)
    navigate(`/editor/${id}`)
  }

  async function deleteDiagram(event: React.MouseEvent, id: string) {
    event.stopPropagation()
    if (!confirm('Excluir este diagrama? Essa ação não pode ser desfeita.')) return
    await db.diagrams.delete(id)
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
        <Button onClick={createDiagram}>
          <FilePlus2 /> Novo diagrama
        </Button>
      </div>

      {diagrams?.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Nenhum diagrama ainda. Crie o primeiro para começar a modelar um processo.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {diagrams?.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => navigate(`/editor/${diagram.id}`)}
            className="group relative flex flex-col overflow-hidden rounded-lg border text-left transition-colors hover:border-ring"
          >
            <div
              className="flex h-36 items-center justify-center overflow-hidden bg-muted [&_svg]:h-full [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: diagram.thumbnail ?? '' }}
            />
            <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{diagram.name}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(diagram.updatedAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(event) => deleteDiagram(event, diagram.id)}
                aria-label="Excluir diagrama"
              >
                <Trash2 />
              </Button>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
