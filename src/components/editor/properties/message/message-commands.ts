import type {
  BpmnMessage,
  MessageCommandServices,
  MessageEventDefinition,
} from '@/types/properties'

import { CREATE_AND_ASSIGN_MESSAGE } from './CreateAndAssignMessageHandler'

export function assignMessageToEvent(
  services: MessageCommandServices,
  element: unknown,
  eventDefinition: MessageEventDefinition,
  message: BpmnMessage | undefined,
) {
  services.modeling.updateModdleProperties(element, eventDefinition, {
    messageRef: message,
  })
}

export function createMessageForEvent(
  services: MessageCommandServices,
  element: unknown,
  eventDefinition: MessageEventDefinition,
  messageName: string,
) {
  const message = services.bpmnFactory.create<BpmnMessage>('bpmn:Message', {
    name: messageName.trim(),
  })
  services.commandStack.execute(CREATE_AND_ASSIGN_MESSAGE, {
    element,
    definitions: services.definitions,
    eventDefinition,
    message,
  })
  return message
}
