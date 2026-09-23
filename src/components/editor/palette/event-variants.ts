export interface EventVariant {
  id: string
  label: string
  type: string
  eventDefinitionType: string
  className: string
}

const MESSAGE = 'bpmn:MessageEventDefinition'
const TIMER = 'bpmn:TimerEventDefinition'

export const EVENT_VARIANTS: EventVariant[] = [
  {
    id: 'start-message',
    label: 'Início de mensagem',
    type: 'bpmn:StartEvent',
    eventDefinitionType: MESSAGE,
    className: 'bpmn-icon-start-event-message',
  },
  {
    id: 'start-timer',
    label: 'Início de timer',
    type: 'bpmn:StartEvent',
    eventDefinitionType: TIMER,
    className: 'bpmn-icon-start-event-timer',
  },
  {
    id: 'intermediate-message-catch',
    label: 'Intermediário de mensagem (captura)',
    type: 'bpmn:IntermediateCatchEvent',
    eventDefinitionType: MESSAGE,
    className: 'bpmn-icon-intermediate-event-catch-message',
  },
  {
    id: 'intermediate-message-throw',
    label: 'Intermediário de mensagem (envio)',
    type: 'bpmn:IntermediateThrowEvent',
    eventDefinitionType: MESSAGE,
    className: 'bpmn-icon-intermediate-event-throw-message',
  },
  {
    id: 'intermediate-timer',
    label: 'Intermediário de timer',
    type: 'bpmn:IntermediateCatchEvent',
    eventDefinitionType: TIMER,
    className: 'bpmn-icon-intermediate-event-catch-timer',
  },
  {
    id: 'end-message',
    label: 'Fim de mensagem',
    type: 'bpmn:EndEvent',
    eventDefinitionType: MESSAGE,
    className: 'bpmn-icon-end-event-message',
  },
]
