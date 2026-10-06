import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type { RefObject } from 'react'

import { useSelectedElements } from '@/hooks/editor/useSelectedElements'
import type { EditorStatus } from '@/types/editor'

export function useSelectedElement(
  modelerRef: RefObject<BpmnModeler | null>,
  status: EditorStatus,
) {
  const { modeler, selectedElements } = useSelectedElements(modelerRef, status)
  const selectedElement =
    selectedElements.length === 1 ? selectedElements[0] : null
  return { modeler, selectedElement }
}
