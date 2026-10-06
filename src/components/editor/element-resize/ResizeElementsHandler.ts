import type {
  ResizeElementsContext,
  ShapeResizingService,
} from '@/types/resize'

export const RESIZE_ELEMENTS = 'archquest.elements.resize'

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
