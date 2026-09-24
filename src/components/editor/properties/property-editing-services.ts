import type BpmnModeler from 'bpmn-js/lib/Modeler'

import type {
  BpmnFactoryService,
  CommandStackService,
  ModelingService,
} from '@/types/diagram-js-services'

import type { MessageCommandServices } from './message/message-commands'
import type { BpmnDefinitions } from './message/message-event-definition'
import type { TimerCommandServices } from './timer/timer-commands'

export type PropertyEditingServices = MessageCommandServices &
  TimerCommandServices

export function propertyEditingServices(
  modeler: BpmnModeler,
): PropertyEditingServices {
  return {
    modeling: modeler.get<ModelingService>('modeling'),
    commandStack: modeler.get<CommandStackService>('commandStack'),
    bpmnFactory: modeler.get<BpmnFactoryService>('bpmnFactory'),
    definitions: modeler.getDefinitions() as BpmnDefinitions,
  }
}
