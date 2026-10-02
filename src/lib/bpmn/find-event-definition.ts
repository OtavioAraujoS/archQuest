import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'

export function findEventDefinition<Definition>(
  element: unknown,
  type: string,
): Definition | undefined {
  const businessObject = getBusinessObject(element as never) as {
    eventDefinitions?: unknown[]
  }
  return businessObject?.eventDefinitions?.find((definition) =>
    is(definition as never, type),
  ) as Definition | undefined
}
