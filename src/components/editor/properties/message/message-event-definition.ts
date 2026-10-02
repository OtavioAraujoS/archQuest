import { is } from 'bpmn-js/lib/util/ModelUtil'

import { findEventDefinition } from '@/lib/bpmn/find-event-definition'
import type {
  BpmnDefinitions,
  BpmnMessage,
  MessageEventDefinition,
} from '@/types/properties'

export function findMessageEventDefinition(element: unknown) {
  return findEventDefinition<MessageEventDefinition>(
    element,
    'bpmn:MessageEventDefinition',
  )
}

export function listDefinedMessages(definitions: BpmnDefinitions) {
  return (definitions.rootElements ?? []).filter((rootElement) =>
    is(rootElement as never, 'bpmn:Message'),
  ) as BpmnMessage[]
}

export function messageDisplayName(message: BpmnMessage) {
  return message.name?.trim() || message.id
}
