import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'

export interface BpmnMessage {
  $type: 'bpmn:Message'
  id: string
  name?: string
}

export interface MessageEventDefinition {
  $type: 'bpmn:MessageEventDefinition'
  messageRef?: BpmnMessage
}

export interface BpmnDefinitions {
  rootElements?: { $type: string }[]
}

export function findMessageEventDefinition(
  element: unknown,
): MessageEventDefinition | undefined {
  const businessObject = getBusinessObject(element as never) as {
    eventDefinitions?: unknown[]
  }
  return businessObject?.eventDefinitions?.find((definition) =>
    is(definition as never, 'bpmn:MessageEventDefinition'),
  ) as MessageEventDefinition | undefined
}

export function listDefinedMessages(definitions: BpmnDefinitions) {
  return (definitions.rootElements ?? []).filter((rootElement) =>
    is(rootElement as never, 'bpmn:Message'),
  ) as BpmnMessage[]
}

export function messageDisplayName(message: BpmnMessage) {
  return message.name?.trim() || message.id
}
