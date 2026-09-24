import { BpmnModdle } from 'bpmn-moddle'
import { describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_TEXT_STYLE,
  getTextStyle,
  setTextStyle,
} from '@/components/editor/text-style'
import textStyleModdle from '@/components/editor/text-style-moddle.json'

function createModdle() {
  return new BpmnModdle({ archquest: textStyleModdle })
}

function createServices(moddle: BpmnModdle) {
  return {
    modeling: { updateModdleProperties: vi.fn() },
    bpmnFactory: {
      create: (type: string, attrs?: Record<string, unknown>) =>
        moddle.create(type, attrs),
    },
    eventBus: { fire: vi.fn() },
  }
}

describe('getTextStyle', () => {
  it('returns the default style when there are no extensions', () => {
    const moddle = createModdle()
    const startEvent = moddle.create('bpmn:StartEvent', { id: 'Start_1' })

    expect(getTextStyle({ businessObject: startEvent })).toEqual({
      ...DEFAULT_TEXT_STYLE,
      color: undefined,
    })
  })

  it('reads bold/italic/underline/color from the archquest:TextStyle extension', () => {
    const moddle = createModdle()
    const startEvent = moddle.create('bpmn:StartEvent', { id: 'Start_1' })
    const textStyle = moddle.create('archquest:TextStyle', {
      bold: true,
      italic: true,
      underline: false,
      color: '#ff0000',
    })
    startEvent.extensionElements = moddle.create('bpmn:ExtensionElements', {
      values: [textStyle],
    })

    expect(getTextStyle({ businessObject: startEvent })).toEqual({
      bold: true,
      italic: true,
      underline: false,
      color: '#ff0000',
    })
  })
})

describe('setTextStyle', () => {
  it('creates extensionElements and a TextStyle entry on first use', () => {
    const moddle = createModdle()
    const startEvent = moddle.create('bpmn:StartEvent', { id: 'Start_1' })
    const element = { businessObject: startEvent }
    const services = createServices(moddle)

    setTextStyle(element, { bold: true, color: '#00ff00' }, services)

    expect(services.modeling.updateModdleProperties).toHaveBeenCalledTimes(1)
    const properties = services.modeling.updateModdleProperties.mock
      .calls[0][2] as {
      extensionElements: { get: (name: string) => unknown[] }
    }
    const values = properties.extensionElements.get('values')
    expect(values).toHaveLength(1)
    expect(values[0]).toMatchObject({ bold: true, color: '#00ff00' })
  })

  it('reuses an existing TextStyle entry instead of creating a duplicate', () => {
    const moddle = createModdle()
    const startEvent = moddle.create('bpmn:StartEvent', { id: 'Start_1' })
    const textStyle = moddle.create('archquest:TextStyle', { bold: false })
    const extensionElements = moddle.create('bpmn:ExtensionElements', {
      values: [textStyle],
    })
    startEvent.extensionElements = extensionElements
    const services = createServices(moddle)

    setTextStyle({ businessObject: startEvent }, { bold: true }, services)

    const values = extensionElements.get('values') as { bold: boolean }[]
    expect(values).toHaveLength(1)
    expect(values[0].bold).toBe(true)
  })

  it('fires elements.changed for the element and its label, to trigger a redraw', () => {
    const moddle = createModdle()
    const startEvent = moddle.create('bpmn:StartEvent', { id: 'Start_1' })
    const label = { type: 'label' }
    const element = { businessObject: startEvent, label }
    const services = createServices(moddle)

    setTextStyle(element, { bold: true }, services)

    expect(services.eventBus.fire).toHaveBeenCalledWith('elements.changed', {
      elements: [element, label],
    })
  })

  it('omits the label from the redraw list when the element has none', () => {
    const moddle = createModdle()
    const startEvent = moddle.create('bpmn:StartEvent', { id: 'Start_1' })
    const element = { businessObject: startEvent }
    const services = createServices(moddle)

    setTextStyle(element, { bold: true }, services)

    expect(services.eventBus.fire).toHaveBeenCalledWith('elements.changed', {
      elements: [element],
    })
  })
})
