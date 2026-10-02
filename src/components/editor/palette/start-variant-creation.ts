import type { PaletteVariant, VariantCreationServices } from '@/types/palette'

const SUBPROCESS_START_EVENT_POSITION = { x: 40, y: 82 }

export function startVariantCreation(
  services: VariantCreationServices,
  event: Event,
  variant: PaletteVariant,
) {
  const { create, elementFactory, popupMenu } = services
  const shape = elementFactory.createShape({ ...variant.attrs })
  popupMenu.close()

  if (!variant.withStartEvent) {
    create.start(event, shape)
    return
  }

  const innerStartEvent = elementFactory.createShape({
    type: 'bpmn:StartEvent',
    ...SUBPROCESS_START_EVENT_POSITION,
    parent: shape,
  })
  create.start(event, [shape, innerStartEvent], {
    hints: { autoSelect: [shape] },
  })
}
