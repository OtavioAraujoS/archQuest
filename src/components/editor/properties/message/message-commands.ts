import type {
  BpmnFactoryService,
  CommandStackService,
  ModelingService,
} from '@/types/diagram-js-services'

import { CREATE_AND_ASSIGN_MESSAGE } from './CreateAndAssignMessageHandler'
import type {
  BpmnDefinitions,
  BpmnMessage,
  MessageEventDefinition,
} from './message-event-definition'

export interface MessageCommandServices {
  modeling: ModelingService
  commandStack: CommandStackService
  bpmnFactory: BpmnFactoryService
  definitions: BpmnDefinitions
}

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
