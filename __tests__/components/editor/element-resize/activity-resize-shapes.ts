import { BpmnModdle } from 'bpmn-moddle'

const moddle = new BpmnModdle()

export function makeActivityShape(
  type: string,
  attributes: Record<string, unknown> = {},
) {
  const businessObject = moddle.create(type)
  const di = moddle.create('bpmndi:BPMNShape', attributes)
  return { businessObject, di, x: 0, y: 0, width: 100, height: 80 }
}
