import type { PaletteGroup } from '../palette-group'

export const GATEWAY_GROUP: PaletteGroup = {
  id: 'gateways',
  entryKey: 'create.exclusive-gateway',
  paletteGroup: 'gateway',
  className: 'bpmn-icon-gateway-none',
  title: 'Gateways',
  menuTitle: 'Gateways',
  variants: [
    {
      id: 'exclusive',
      label: 'Exclusivo',
      className: 'bpmn-icon-gateway-xor',
      attrs: { type: 'bpmn:ExclusiveGateway' },
    },
    {
      id: 'parallel',
      label: 'Paralelo',
      className: 'bpmn-icon-gateway-parallel',
      attrs: { type: 'bpmn:ParallelGateway' },
    },
    {
      id: 'inclusive',
      label: 'Inclusivo',
      className: 'bpmn-icon-gateway-or',
      attrs: { type: 'bpmn:InclusiveGateway' },
    },
    {
      id: 'event-based',
      label: 'Baseado em eventos',
      className: 'bpmn-icon-gateway-eventbased',
      attrs: { type: 'bpmn:EventBasedGateway' },
    },
    {
      id: 'complex',
      label: 'Complexo',
      className: 'bpmn-icon-gateway-complex',
      attrs: { type: 'bpmn:ComplexGateway' },
    },
  ],
}
