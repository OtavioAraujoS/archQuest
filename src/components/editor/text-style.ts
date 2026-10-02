import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'

import type {
  BpmnElementLike,
  ModdleElement,
  TextStyle,
  TextStyleServices,
} from '@/types/editor'

export const DEFAULT_TEXT_STYLE: TextStyle = {
  bold: false,
  italic: false,
  underline: false,
}

function findTextStyleEntry(extensionElements: ModdleElement | undefined) {
  const values = extensionElements?.get('values') as ModdleElement[] | undefined
  return values?.find((value) => is(value, 'archquest:TextStyle'))
}

export function getTextStyle(element: BpmnElementLike): TextStyle {
  const businessObject = getBusinessObject(element as never) as
    ModdleElement | undefined
  const entry = findTextStyleEntry(
    businessObject?.extensionElements as ModdleElement | undefined,
  )

  return {
    bold: Boolean(entry?.bold),
    italic: Boolean(entry?.italic),
    underline: Boolean(entry?.underline),
    color: (entry?.color as string | undefined) || undefined,
  }
}

export function setTextStyle(
  element: BpmnElementLike,
  style: Partial<TextStyle>,
  { modeling, bpmnFactory, eventBus }: TextStyleServices,
) {
  const businessObject = getBusinessObject(element as never) as ModdleElement

  let extensionElements = businessObject.extensionElements as
    ModdleElement | undefined

  if (!extensionElements) {
    extensionElements = bpmnFactory.create<ModdleElement>(
      'bpmn:ExtensionElements',
      { values: [] },
    )
    extensionElements.$parent = businessObject
  }

  let entry = findTextStyleEntry(extensionElements)

  if (!entry) {
    entry = bpmnFactory.create<ModdleElement>('archquest:TextStyle')
    entry.$parent = extensionElements
    ;(extensionElements.get('values') as ModdleElement[]).push(entry)
  }

  Object.assign(entry, style)

  modeling.updateModdleProperties(element, businessObject, {
    extensionElements,
  })

  const target = element as BpmnElementLike & { label?: unknown }
  const elementsToRedraw = [target, target.label].filter(Boolean)
  eventBus.fire('elements.changed', { elements: elementsToRedraw })
}
