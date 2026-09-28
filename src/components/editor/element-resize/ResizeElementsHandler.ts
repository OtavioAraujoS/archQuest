import type {
  Bounds,
  ResizableShape,
  ShapeResizingService,
} from '@/components/editor/multi-resize/multi-resize-services'

export const RESIZE_ELEMENTS = 'archquest.elements.resize'

export interface PlannedResize {
  shape: ResizableShape
  bounds: Bounds
}

export interface ResizeElementsContext {
  resizes: PlannedResize[]
}

export default class ResizeElementsHandler {
  static readonly $inject = ['modeling']

  private readonly modeling: ShapeResizingService

  constructor(modeling: ShapeResizingService) {
    this.modeling = modeling
  }

  preExecute({ resizes }: ResizeElementsContext) {
    resizes.forEach(({ shape, bounds }) =>
      this.modeling.resizeShape(shape, bounds),
    )
  }
}
