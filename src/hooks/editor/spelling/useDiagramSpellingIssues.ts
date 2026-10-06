import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { type RefObject, useCallback, useEffect, useState } from 'react'

import type LabelSpellingMarkers from '@/components/editor/spelling/LabelSpellingMarkers'
import { SPELLING_ISSUES_CHANGED_EVENT } from '@/components/editor/spelling/spelling-events'
import type { EventBusService } from '@/types/diagram-js-services'
import type { EditorStatus } from '@/types/editor'
import type {
  DiagramSpellingIssue,
  DirectEditingService,
  LabeledElement,
  LabeledElementRegistry,
} from '@/types/spelling'

interface ScrollingCanvas {
  scrollToElement(element: LabeledElement): void
}

const NO_ISSUES: DiagramSpellingIssue[] = []

export function useDiagramSpellingIssues(
  modelerRef: RefObject<BpmnModeler | null>,
  status: EditorStatus,
) {
  const [issues, setIssues] = useState(NO_ISSUES)

  useEffect(() => {
    const modeler = modelerRef.current
    if (status !== 'ready' || !modeler) return
    const eventBus = modeler.get<EventBusService>('eventBus')
    const markers = modeler.get<LabelSpellingMarkers>('labelSpellingMarkers')

    function readIssues() {
      setIssues(
        [...markers.checkedLabels].flatMap(([elementId, { text, words }]) =>
          words ? [{ elementId, text, words }] : [],
        ),
      )
    }

    readIssues()
    eventBus.on(SPELLING_ISSUES_CHANGED_EVENT, readIssues)
    return () => {
      eventBus.off(SPELLING_ISSUES_CHANGED_EVENT, readIssues)
      setIssues(NO_ISSUES)
    }
  }, [modelerRef, status])

  const goToIssue = useCallback(
    (elementId: string) => {
      const modeler = modelerRef.current
      const element = modeler
        ?.get<LabeledElementRegistry>('elementRegistry')
        .get(elementId)
      if (!modeler || !element) return
      modeler.get<ScrollingCanvas>('canvas').scrollToElement(element)
      modeler.get<DirectEditingService>('directEditing').activate(element)
    },
    [modelerRef],
  )

  return { issues, goToIssue }
}
