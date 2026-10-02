import type BpmnModeler from 'bpmn-js/lib/Modeler'

import type {
  BpmnFactoryService,
  CommandStackService,
  ModelingService,
} from '@/types/diagram-js-services'
import type {
  BpmnDefinitions,
  PropertyEditingServices,
} from '@/types/properties'

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
