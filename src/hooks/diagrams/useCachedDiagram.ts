import { useLiveQuery } from 'dexie-react-hooks'

import { getCachedDiagram } from '@/lib/diagrams/diagram-lists'

export function useCachedDiagram(diagramId: string | undefined) {
  return useLiveQuery(
    () =>
      diagramId ? getCachedDiagram(diagramId) : Promise.resolve(undefined),
    [diagramId],
  )
}
