import type { CommandStackService } from '@/types/diagram-js-services'

import CreateAndAssignMessageHandler, {
  CREATE_AND_ASSIGN_MESSAGE,
} from './message/CreateAndAssignMessageHandler'

function registerPropertyCommands(commandStack: CommandStackService) {
  commandStack.registerHandler(
    CREATE_AND_ASSIGN_MESSAGE,
    CreateAndAssignMessageHandler,
  )
}
registerPropertyCommands.$inject = ['commandStack']

export default {
  __init__: ['propertyCommands'],
  propertyCommands: ['type', registerPropertyCommands],
}
