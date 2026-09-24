import { useLiveQuery } from 'dexie-react-hooks'
import { Check, LoaderCircle, TriangleAlert } from 'lucide-react'

import { CloudSyncIndicator } from '@/components/editor/CloudSyncIndicator'
import type { AutosaveState } from '@/lib/diagrams/diagram-autosave'
import { getCachedDiagram } from '@/lib/diagrams/diagram-lists'
import { cn } from '@/lib/utils'

const LOCAL_SAVE_DESCRIPTIONS: Record<
  Exclude<AutosaveState, 'idle'>,
  { label: string; icon: typeof Check; className: string }
> = {
  saving: {
    label: 'Salvando…',
    icon: LoaderCircle,
    className: 'text-muted-foreground [&_svg]:animate-spin',
  },
  saved: {
    label: 'Salvo neste navegador',
    icon: Check,
    className: 'text-muted-foreground',
  },
  failed: {
    label: 'Não foi possível salvar',
    icon: TriangleAlert,
    className: 'text-destructive',
  },
}

interface DiagramSaveStatusProps {
  diagramId: string | undefined
  autosaveState: AutosaveState
}

export function DiagramSaveStatus({
  diagramId,
  autosaveState,
}: Readonly<DiagramSaveStatusProps>) {
  const diagram = useLiveQuery(
    () =>
      diagramId ? getCachedDiagram(diagramId) : Promise.resolve(undefined),
    [diagramId],
  )

  if (diagram?.ownerId) return <CloudSyncIndicator diagramId={diagramId} />
  if (autosaveState === 'idle') return null

  const description = LOCAL_SAVE_DESCRIPTIONS[autosaveState]
  const StatusIcon = description.icon
  return (
    <output
      className={cn(
        'flex shrink-0 items-center gap-1.5 text-xs whitespace-nowrap',
        description.className,
      )}
    >
      <StatusIcon className="size-4" aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">{description.label}</span>
    </output>
  )
}
