import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export type EditorStatus = 'loading' | 'ready' | 'error'

interface EventBus {
  on(event: string, callback: () => void): void
  off(event: string, callback: () => void): void
}

const REFRESH_EVENTS = ['selection.changed', 'commandStack.changed']
const NO_ELEMENTS: unknown[] = []

export function useSelectedElements(
  modelerRef: RefObject<BpmnModeler | null>,
  status: EditorStatus,
) {
  const [modeler, setModeler] = useState<BpmnModeler | null>(null)
  const [selectedElements, setSelectedElements] = useState<unknown[]>(NO_ELEMENTS)
  const [, setModelRevision] = useState(0)

  useEffect(() => {
    const currentModeler = modelerRef.current
    if (status !== 'ready' || !currentModeler) {
      setModeler(null)
      setSelectedElements(NO_ELEMENTS)
      return
    }
    setModeler(currentModeler)

    const eventBus = currentModeler.get<EventBus>('eventBus')
    const selection = currentModeler.get<{ get(): unknown[] }>('selection')

    function refreshSelectedElements() {
      setSelectedElements([...selection.get()])
      setModelRevision((revision) => revision + 1)
    }

    REFRESH_EVENTS.forEach((event) =>
      eventBus.on(event, refreshSelectedElements),
    )
    refreshSelectedElements()

    return () =>
      REFRESH_EVENTS.forEach((event) =>
        eventBus.off(event, refreshSelectedElements),
      )
  }, [status, modelerRef])

  return { modeler, selectedElements }
}
