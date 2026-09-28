import type { CommandStackService } from '@/types/diagram-js-services'

import {
  ActivityResizeBehavior,
  ActivityResizeRules,
} from './activity-minimum-size'
import ResizeElementsHandler, { RESIZE_ELEMENTS } from './ResizeElementsHandler'

function registerResizeElementsCommand(commandStack: CommandStackService) {
  commandStack.registerHandler(RESIZE_ELEMENTS, ResizeElementsHandler)
}
registerResizeElementsCommand.$inject = ['commandStack']

export default {
  __init__: [
    'activityResizeRules',
    'activityResizeBehavior',
    'resizeElementsCommand',
  ],
  activityResizeRules: ['type', ActivityResizeRules],
  activityResizeBehavior: ['type', ActivityResizeBehavior],
  resizeElementsCommand: ['type', registerResizeElementsCommand],
}
