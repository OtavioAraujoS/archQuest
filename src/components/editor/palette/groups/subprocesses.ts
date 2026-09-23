import type { PaletteGroup } from '../palette-group'

export const SUBPROCESS_GROUP: PaletteGroup = {
  id: 'subprocesses',
  entryKey: 'create.subprocess-expanded',
  paletteGroup: 'activity',
  className: 'bpmn-icon-subprocess-expanded',
  title: 'Sub-processos',
  menuTitle: 'Sub-processos',
  variants: [
    {
      id: 'expanded',
      label: 'Sub-processo expandido',
      className: 'bpmn-icon-subprocess-expanded',
      attrs: { type: 'bpmn:SubProcess', isExpanded: true },
      withStartEvent: true,
    },
    {
      id: 'collapsed',
      label: 'Sub-processo colapsado',
      className: 'bpmn-icon-subprocess-collapsed',
      attrs: { type: 'bpmn:SubProcess', isExpanded: false },
    },
    {
      id: 'event',
      label: 'Sub-processo de evento',
      className: 'bpmn-icon-event-subprocess-expanded',
      attrs: { type: 'bpmn:SubProcess', isExpanded: true, triggeredByEvent: true },
    },
    {
      id: 'transaction',
      label: 'Transação',
      className: 'bpmn-icon-transaction',
      attrs: { type: 'bpmn:Transaction', isExpanded: true },
      withStartEvent: true,
    },
    {
      id: 'call-activity',
      label: 'Call activity',
      className: 'bpmn-icon-call-activity',
      attrs: { type: 'bpmn:CallActivity' },
    },
  ],
}
