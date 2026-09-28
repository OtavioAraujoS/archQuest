import {
  findPool,
  isOfType,
  type DiagramElement,
} from '@/lib/bpmn/diagram-element-ancestry'

export function isExplainableRefusal(
  start: DiagramElement,
  hover: DiagramElement | null | undefined,
): hover is DiagramElement {
  if (!hover || hover === start || !hover.parent || hover.labelTarget) {
    return false
  }
  if (isOfType(hover, 'bpmn:Lane')) return false
  return !(isOfType(hover, 'bpmn:Participant') && findPool(start) === hover)
}
