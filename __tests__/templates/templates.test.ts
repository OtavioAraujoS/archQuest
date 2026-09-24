import { BpmnModdle } from 'bpmn-moddle'
import { describe, expect, it } from 'vitest'

import { DIAGRAM_TEMPLATES } from '@/templates'

interface ModdleElement {
  $type: string
  $instanceOf(type: string): boolean
  id: string
  [property: string]: unknown
}

const DIAGRAM_ELEMENT_TYPES = [
  'bpmn:FlowNode',
  'bpmn:SequenceFlow',
  'bpmn:Participant',
  'bpmn:Lane',
]

async function parseTemplate(xml: string) {
  const { rootElement, warnings, elementsById } = await new BpmnModdle().fromXML(xml)
  return {
    rootElement,
    warnings,
    elementsById: elementsById as Record<string, ModdleElement>,
  }
}

function collectDrawableElementIds(elementsById: Record<string, ModdleElement>) {
  return Object.values(elementsById)
    .filter((element) =>
      DIAGRAM_ELEMENT_TYPES.some((type) => element.$instanceOf(type)),
    )
    .map((element) => element.id)
}

function collectDiagramReferences(elementsById: Record<string, ModdleElement>) {
  return Object.values(elementsById)
    .filter(({ $type }) => $type === 'bpmndi:BPMNShape' || $type === 'bpmndi:BPMNEdge')
    .map((diagramElement) => (diagramElement.bpmnElement as ModdleElement).id)
}

describe('diagram templates', () => {
  it('offers the five templates with unique ids and a name and description', () => {
    expect(DIAGRAM_TEMPLATES).toHaveLength(5)
    expect(new Set(DIAGRAM_TEMPLATES.map(({ id }) => id)).size).toBe(5)
    for (const template of DIAGRAM_TEMPLATES) {
      expect(template.name.trim()).not.toBe('')
      expect(template.description.trim()).not.toBe('')
    }
  })

  it.each(DIAGRAM_TEMPLATES)('$name is valid BPMN 2.0 without warnings', async ({ xml }) => {
    const { rootElement, warnings } = await parseTemplate(xml)

    expect(warnings).toEqual([])
    expect(rootElement.$type).toBe('bpmn:Definitions')
  })

  it.each(DIAGRAM_TEMPLATES)('$name has layout for every drawable element', async ({ xml }) => {
    const { elementsById } = await parseTemplate(xml)

    const drawableIds = collectDrawableElementIds(elementsById)
    const drawnIds = collectDiagramReferences(elementsById)

    expect(drawableIds.length).toBeGreaterThan(0)
    expect(drawnIds.sort()).toEqual(drawableIds.sort())
  })
})
