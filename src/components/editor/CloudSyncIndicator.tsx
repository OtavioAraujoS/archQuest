import { useLiveQuery } from 'dexie-react-hooks'
import { CloudCheck, CloudOff, CloudUpload, TriangleAlert } from 'lucide-react'

import { getCachedDiagram } from '@/lib/diagrams/diagram-lists'
import {
  describeCloudSyncStatus,
  type CloudSyncTone,
} from '@/lib/sync/cloud-sync-status'
import { useSyncStore } from '@/lib/sync/sync-store'
import { cn } from '@/lib/utils'

const TONE_ICONS: Record<CloudSyncTone, typeof CloudCheck> = {
  saved: CloudCheck,
  saving: CloudUpload,
  warning: CloudOff,
  error: TriangleAlert,
}

const TONE_COLORS: Record<CloudSyncTone, string> = {
  saved: 'text-muted-foreground',
  saving: 'text-muted-foreground',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-destructive',
}

interface CloudSyncIndicatorProps {
  diagramId: string | undefined
}

export function CloudSyncIndicator({
  diagramId,
}: Readonly<CloudSyncIndicatorProps>) {
  const diagram = useLiveQuery(
    () =>
      diagramId ? getCachedDiagram(diagramId) : Promise.resolve(undefined),
    [diagramId],
  )
  const syncState = useSyncStore()
  const cloudSyncStatus = describeCloudSyncStatus(diagram, syncState)
  if (!cloudSyncStatus) return null

  const ToneIcon = TONE_ICONS[cloudSyncStatus.tone]
  return (
    <output
      title={cloudSyncStatus.detail}
      className={cn(
        'flex shrink-0 items-center gap-1.5 text-xs whitespace-nowrap',
        TONE_COLORS[cloudSyncStatus.tone],
      )}
    >
      <ToneIcon className="size-4" aria-hidden="true" />
      {cloudSyncStatus.label}
    </output>
  )
}
