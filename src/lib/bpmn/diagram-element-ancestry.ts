import { is } from 'bpmn-js/lib/util/ModelUtil'

export interface DiagramElement {
  businessObject?: unknown
  parent?: DiagramElement
  labelTarget?: DiagramElement
}

export function isOfType(element: DiagramElement, type: string) {
  return is(element as never, type)
}

function findClosestOfType(element: DiagramElement, type: string) {
  let candidate: DiagramElement | undefined = element
  while (candidate && !isOfType(candidate, type)) {
    candidate = candidate.parent
  }
  return candidate
}

export function findPool(element: DiagramElement) {
  return findClosestOfType(element, 'bpmn:Participant')
}

export function findEnclosingSubProcess(element: DiagramElement) {
  return element.parent
    ? findClosestOfType(element.parent, 'bpmn:SubProcess')
    : undefined
}
