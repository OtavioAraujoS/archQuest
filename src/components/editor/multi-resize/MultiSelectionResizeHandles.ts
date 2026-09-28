import { findResizeTargets } from './find-resize-targets'
import type {
  GroupResizeEventBus,
  ResizeHandlesService,
  RulesService,
  SelectionService,
} from './multi-resize-services'

export const PRIORITY_AFTER_DEFAULT_HANDLES = 500

export default class MultiSelectionResizeHandles {
  static readonly $inject = ['eventBus', 'selection', 'resizeHandles', 'rules']

  constructor(
    eventBus: GroupResizeEventBus,
    selection: SelectionService,
    resizeHandles: ResizeHandlesService,
    rules: RulesService,
  ) {
    function showHandlesOnEveryTarget() {
      const selectedShapes = selection.get()
      if (selectedShapes.length < 2) return
      resizeHandles.removeResizers()
      findResizeTargets(selectedShapes, rules).forEach((shape) =>
        resizeHandles.addResizer(shape),
      )
    }

    eventBus.on(
      'selection.changed',
      PRIORITY_AFTER_DEFAULT_HANDLES,
      showHandlesOnEveryTarget,
    )
    eventBus.on(
      'shape.changed',
      PRIORITY_AFTER_DEFAULT_HANDLES,
      ({ element }: { element: unknown }) => {
        if (selection.isSelected(element)) showHandlesOnEveryTarget()
      },
    )
  }
}
