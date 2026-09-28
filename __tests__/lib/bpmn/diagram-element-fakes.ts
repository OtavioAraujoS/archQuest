import { BpmnModdle } from 'bpmn-moddle'

import type { DiagramElement } from '@/lib/bpmn/diagram-element-ancestry'

const moddle = new BpmnModdle()

export function makeShape(
  type: string,
  parent?: DiagramElement,
): DiagramElement {
  return { businessObject: moddle.create(type), parent }
}

export function makeTwoPoolDiagram() {
  const root = makeShape('bpmn:Collaboration')
  const customerPool = makeShape('bpmn:Participant', root)
  const bankPool = makeShape('bpmn:Participant', root)
  return {
    root,
    customerPool,
    bankPool,
    fillInData: makeShape('bpmn:Task', customerPool),
    validDataGateway: makeShape('bpmn:ExclusiveGateway', bankPool),
    captureData: makeShape('bpmn:Task', bankPool),
  }
}
