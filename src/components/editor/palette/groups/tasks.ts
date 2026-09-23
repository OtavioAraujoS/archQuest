import type { PaletteGroup } from '../palette-group'

export const TASK_GROUP: PaletteGroup = {
  id: 'tasks',
  entryKey: 'create.task',
  paletteGroup: 'activity',
  className: 'bpmn-icon-task',
  title: 'Tarefas',
  menuTitle: 'Tarefas',
  variants: [
    {
      id: 'task',
      label: 'Tarefa',
      className: 'bpmn-icon-task',
      attrs: { type: 'bpmn:Task' },
    },
    {
      id: 'user',
      label: 'Tarefa de usuário',
      className: 'bpmn-icon-user-task',
      attrs: { type: 'bpmn:UserTask' },
    },
    {
      id: 'service',
      label: 'Tarefa de serviço',
      className: 'bpmn-icon-service-task',
      attrs: { type: 'bpmn:ServiceTask' },
    },
    {
      id: 'manual',
      label: 'Tarefa manual',
      className: 'bpmn-icon-manual-task',
      attrs: { type: 'bpmn:ManualTask' },
    },
    {
      id: 'script',
      label: 'Tarefa de script',
      className: 'bpmn-icon-script-task',
      attrs: { type: 'bpmn:ScriptTask' },
    },
    {
      id: 'send',
      label: 'Tarefa de envio',
      className: 'bpmn-icon-send-task',
      attrs: { type: 'bpmn:SendTask' },
    },
    {
      id: 'receive',
      label: 'Tarefa de recebimento',
      className: 'bpmn-icon-receive-task',
      attrs: { type: 'bpmn:ReceiveTask' },
    },
    {
      id: 'business-rule',
      label: 'Tarefa de regra de negócio',
      className: 'bpmn-icon-business-rule-task',
      attrs: { type: 'bpmn:BusinessRuleTask' },
    },
  ],
}
