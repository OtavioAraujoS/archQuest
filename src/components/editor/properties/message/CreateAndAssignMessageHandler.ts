import type { ModelingService } from '@/types/diagram-js-services'

import type {
  BpmnDefinitions,
  BpmnMessage,
  MessageEventDefinition,
} from './message-event-definition'

export const CREATE_AND_ASSIGN_MESSAGE = 'archquest.message.createAndAssign'

export interface CreateAndAssignMessageContext {
  element: unknown
  definitions: BpmnDefinitions
  eventDefinition: MessageEventDefinition
  message: BpmnMessage
}

export default class CreateAndAssignMessageHandler {
  static readonly $inject = ['modeling']

  private readonly modeling: ModelingService

  constructor(modeling: ModelingService) {
    this.modeling = modeling
  }

  preExecute(context: CreateAndAssignMessageContext) {
    const { element, definitions, eventDefinition, message } = context
    this.modeling.updateModdleProperties(element, definitions, {
      rootElements: [...(definitions.rootElements ?? []), message],
    })
    this.modeling.updateModdleProperties(element, eventDefinition, {
      messageRef: message,
    })
  }
}
