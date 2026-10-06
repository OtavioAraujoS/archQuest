import { isExpanded } from 'bpmn-js/lib/util/DiUtil'
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

import {
  type DiagramElement,
  isOfType,
} from '@/lib/bpmn/diagram-element-ancestry'
import type { PrioritizedEventBusService } from '@/types/diagram-js-services'
import type { Size } from '@/types/geometry'
import type { ResizeRuleContext, ResizeStartEvent } from '@/types/resize'

export const ACTIVITY_MIN_DIMENSIONS: Size = { width: 50, height: 40 }

const PRIORITY_BEFORE_BPMN_DEFAULTS = 1500

export function isResizableActivity(element: DiagramElement) {
  if (isOfType(element, 'bpmn:Task')) return true
  if (isOfType(element, 'bpmn:CallActivity')) return true
  return isOfType(element, 'bpmn:SubProcess') && !isExpanded(element as never)
}

export function fitsActivityMinimum(bounds: Size) {
  return (
    bounds.width >= ACTIVITY_MIN_DIMENSIONS.width &&
    bounds.height >= ACTIVITY_MIN_DIMENSIONS.height
  )
}

export class ActivityResizeRules extends RuleProvider {
  static readonly $inject = ['eventBus']

  init() {
    this.addRule(
      'shape.resize',
      PRIORITY_BEFORE_BPMN_DEFAULTS,
      ({ shape, newBounds }: ResizeRuleContext) => {
        if (!isResizableActivity(shape)) return undefined
        return !newBounds || fitsActivityMinimum(newBounds)
      },
    )
  }
}

export class ActivityResizeBehavior {
  static readonly $inject = ['eventBus']

  constructor(eventBus: PrioritizedEventBusService) {
    eventBus.on(
      'resize.start',
      PRIORITY_BEFORE_BPMN_DEFAULTS,
      ({ context }: ResizeStartEvent) => {
        if (isResizableActivity(context.shape)) {
          context.minDimensions = ACTIVITY_MIN_DIMENSIONS
        }
      },
    )
  }
}
