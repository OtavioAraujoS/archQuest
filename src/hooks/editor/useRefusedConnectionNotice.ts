import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

import { describeRefusedConnection } from '@/lib/bpmn/describe-refused-connection'
import { isExplainableRefusal } from '@/lib/bpmn/is-explainable-refusal'
import type { EventBusService } from '@/types/diagram-js-services'
import type {
  EditorStatus,
  RefusedConnectEvent,
  RefusedConnectionNotice,
} from '@/types/editor'

export const REFUSED_CONNECTION_NOTICE_DURATION_MS = 8000

export function useRefusedConnectionNotice(
  modelerRef: RefObject<BpmnModeler | null>,
  status: EditorStatus,
) {
  const [notice, setNotice] = useState<RefusedConnectionNotice | null>(null)

  useEffect(() => {
    const modeler = modelerRef.current
    if (status !== 'ready' || !modeler) return

    const eventBus = modeler.get<EventBusService>('eventBus')

    function explainRefusedConnection({ context }: RefusedConnectEvent) {
      const { start, hover, canExecute } = context
      if (canExecute !== false || !isExplainableRefusal(start, hover)) return
      setNotice({
        message: describeRefusedConnection(start, hover),
        shownAt: Date.now(),
      })
    }

    eventBus.on('connect.rejected', explainRefusedConnection)
    return () => eventBus.off('connect.rejected', explainRefusedConnection)
  }, [modelerRef, status])

  useEffect(() => {
    if (!notice) return
    const timeout = setTimeout(
      () => setNotice(null),
      REFUSED_CONNECTION_NOTICE_DURATION_MS,
    )
    return () => clearTimeout(timeout)
  }, [notice])

  return {
    refusedConnectionMessage: notice?.message ?? null,
    dismissRefusedConnectionMessage: () => setNotice(null),
  }
}
