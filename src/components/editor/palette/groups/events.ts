import type { PaletteGroup } from '../palette-group'

const MESSAGE = 'bpmn:MessageEventDefinition'
const TIMER = 'bpmn:TimerEventDefinition'

export const EVENT_GROUP: PaletteGroup = {
  id: 'events',
  entryKey: 'archquest.events',
  paletteGroup: 'event',
  className: 'bpmn-icon-start-event-timer',
  title: 'Eventos de mensagem e timer',
  menuTitle: 'Eventos',
  variants: [
    {
      id: 'start-message',
      label: 'Início de mensagem',
      className: 'bpmn-icon-start-event-message',
      attrs: { type: 'bpmn:StartEvent', eventDefinitionType: MESSAGE },
    },
    {
      id: 'start-timer',
      label: 'Início de timer',
      className: 'bpmn-icon-start-event-timer',
      attrs: { type: 'bpmn:StartEvent', eventDefinitionType: TIMER },
    },
    {
      id: 'intermediate-message-catch',
      label: 'Intermediário de mensagem (captura)',
      className: 'bpmn-icon-intermediate-event-catch-message',
      attrs: { type: 'bpmn:IntermediateCatchEvent', eventDefinitionType: MESSAGE },
    },
    {
      id: 'intermediate-message-throw',
      label: 'Intermediário de mensagem (envio)',
      className: 'bpmn-icon-intermediate-event-throw-message',
      attrs: { type: 'bpmn:IntermediateThrowEvent', eventDefinitionType: MESSAGE },
    },
    {
      id: 'intermediate-timer',
      label: 'Intermediário de timer',
      className: 'bpmn-icon-intermediate-event-catch-timer',
      attrs: { type: 'bpmn:IntermediateCatchEvent', eventDefinitionType: TIMER },
    },
    {
      id: 'end-message',
      label: 'Fim de mensagem',
      className: 'bpmn-icon-end-event-message',
      attrs: { type: 'bpmn:EndEvent', eventDefinitionType: MESSAGE },
    },
  ],
}
