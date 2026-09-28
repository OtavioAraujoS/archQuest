import {
  drawCompanionFrames,
  removeCompanionFrames,
} from './companion-resize-preview'
import { findResizeTargets } from './find-resize-targets'
import type {
  Bounds,
  GroupResizeEventBus,
  PreviewSupportService,
  ResizableShape,
  ResizeCanvasService,
  ResizeEvent,
  ResizeService,
  RulesService,
  SelectionService,
  ShapeResizingService,
} from './multi-resize-services'
import { planGroupResize } from './plan-group-resize'

const PRIORITY_AFTER_DEFAULT_RESIZE = 500
const PRIORITY_BEFORE_DEFAULT_RESIZE = 1500

interface PendingGroupResize {
  primaryShape: ResizableShape
  companionBounds: Map<ResizableShape, Bounds>
}

export default class GroupResizeBehavior {
  static readonly $inject = [
    'eventBus',
    'selection',
    'rules',
    'resize',
    'modeling',
    'previewSupport',
    'canvas',
  ]

  private pendingGroupResize: PendingGroupResize | null = null

  constructor(
    eventBus: GroupResizeEventBus,
    selection: SelectionService,
    rules: RulesService,
    resize: ResizeService,
    modeling: ShapeResizingService,
    previewSupport: PreviewSupportService,
    canvas: ResizeCanvasService,
  ) {
    eventBus.on(
      'resize.start',
      PRIORITY_AFTER_DEFAULT_RESIZE,
      ({ context }: ResizeEvent) => {
        const targets = findResizeTargets(selection.get(), rules)
        context.companionShapes = targets.includes(context.shape)
          ? targets.filter((shape) => shape !== context.shape)
          : []
      },
    )

    eventBus.on(
      'resize.move',
      PRIORITY_AFTER_DEFAULT_RESIZE,
      ({ context }: ResizeEvent) => {
        if (!context.companionShapes?.length) return
        context.companionBounds = planGroupResize(context, rules, resize)
        drawCompanionFrames(context, previewSupport, canvas)
      },
    )

    eventBus.on(
      'resize.end',
      PRIORITY_BEFORE_DEFAULT_RESIZE,
      ({ context }: ResizeEvent) => {
        if (!context.canExecute || !context.companionBounds?.size) return
        this.pendingGroupResize = {
          primaryShape: context.shape,
          companionBounds: context.companionBounds,
        }
      },
    )

    eventBus.on(
      'commandStack.shape.resize.postExecuted',
      PRIORITY_AFTER_DEFAULT_RESIZE,
      ({ context }: { context: { shape: ResizableShape } }) => {
        const pending = this.pendingGroupResize
        if (!pending || context.shape !== pending.primaryShape) return
        this.pendingGroupResize = null
        pending.companionBounds.forEach((bounds, shape) =>
          modeling.resizeShape(shape, bounds),
        )
      },
    )

    eventBus.on(
      'resize.cleanup',
      PRIORITY_AFTER_DEFAULT_RESIZE,
      ({ context }: ResizeEvent) => {
        this.pendingGroupResize = null
        removeCompanionFrames(context, canvas)
      },
    )
  }
}
