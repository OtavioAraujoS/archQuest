import { isOfType } from '@/lib/bpmn/diagram-element-ancestry'

import type { ResizableShape, RulesService } from './multi-resize-services'

function hasSelectedAncestor(
  shape: ResizableShape,
  selectedShapes: Set<unknown>,
) {
  let ancestor = shape.parent
  while (ancestor) {
    if (selectedShapes.has(ancestor)) return true
    ancestor = ancestor.parent
  }
  return false
}

function canResizeInGroup(shape: ResizableShape, rules: RulesService) {
  return (
    !shape.waypoints &&
    !shape.labelTarget &&
    !isOfType(shape, 'bpmn:Lane') &&
    Boolean(rules.allowed('shape.resize', { shape }))
  )
}

export function findResizeTargets(
  selectedShapes: ResizableShape[],
  rules: RulesService,
) {
  const selection = new Set<unknown>(selectedShapes)
  return selectedShapes.filter(
    (shape) =>
      canResizeInGroup(shape, rules) && !hasSelectedAncestor(shape, selection),
  )
}
