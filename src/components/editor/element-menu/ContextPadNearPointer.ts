import type Canvas from 'diagram-js/lib/core/Canvas'
import type { Point } from 'diagram-js/lib/util/Types'

import type {
  ContextPadPositioning,
  EventBusService,
  MouseService,
} from '@/types/diagram-js-services'

const CONTEXT_PAD_MARGIN = 8
const CONTEXT_PAD_WIDTH = 80

export default class ContextPadNearPointer {
  static readonly $inject = ['contextPad', 'canvas', 'mouse', 'eventBus']

  constructor(
    contextPad: ContextPadPositioning,
    canvas: Canvas,
    mouse: MouseService,
    eventBus: Pick<EventBusService, 'on'>,
  ) {
    const defaultPosition = contextPad._getPosition.bind(contextPad)
    let clickedSpot: Point | null = null
    eventBus.on('contextPad.close', () => {
      clickedSpot = null
    })

    function readPointerOnDiagram(): Point {
      const container = canvas.getContainer().getBoundingClientRect()
      const viewbox = canvas.viewbox()
      const { clientX, clientY } = mouse.getLastMoveEvent()
      return {
        x: viewbox.x + (clientX - container.left) / viewbox.scale,
        y: viewbox.y + (clientY - container.top) / viewbox.scale,
      }
    }

    contextPad._getPosition = (target) => {
      const position = defaultPosition(target)
      const container = canvas.getContainer().getBoundingClientRect()
      const { left = 0, top = 0 } = position
      const fitsOnScreen =
        left >= 0 &&
        top >= 0 &&
        left + CONTEXT_PAD_WIDTH <= container.width &&
        top <= container.height
      if (fitsOnScreen) return position

      const viewbox = canvas.viewbox()
      const spot = clickedSpot ?? readPointerOnDiagram()
      clickedSpot = spot
      return {
        left: (spot.x - viewbox.x) * viewbox.scale + CONTEXT_PAD_MARGIN,
        top: (spot.y - viewbox.y) * viewbox.scale,
      }
    }
  }
}
