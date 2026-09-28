import { describe, expect, it } from 'vitest'

import { isExplainableRefusal } from '@/lib/bpmn/is-explainable-refusal'
import { makeShape, makeTwoPoolDiagram } from './diagram-element-fakes'

describe('isExplainableRefusal', () => {
  it('explains a refusal over another element', () => {
    const { validDataGateway, fillInData, customerPool } = makeTwoPoolDiagram()

    expect(isExplainableRefusal(validDataGateway, fillInData)).toBe(true)
    expect(isExplainableRefusal(validDataGateway, customerPool)).toBe(true)
  })

  it('stays quiet when the arrow is dropped on empty space', () => {
    const { validDataGateway, root } = makeTwoPoolDiagram()

    expect(isExplainableRefusal(validDataGateway, null)).toBe(false)
    expect(isExplainableRefusal(validDataGateway, root)).toBe(false)
    expect(isExplainableRefusal(validDataGateway, validDataGateway)).toBe(false)
  })

  it('stays quiet over the background of the same pool or its lanes', () => {
    const { validDataGateway, bankPool } = makeTwoPoolDiagram()
    const lane = makeShape('bpmn:Lane', bankPool)

    expect(isExplainableRefusal(validDataGateway, bankPool)).toBe(false)
    expect(isExplainableRefusal(validDataGateway, lane)).toBe(false)
  })

  it('stays quiet over labels', () => {
    const { validDataGateway, fillInData, customerPool } = makeTwoPoolDiagram()
    const label = { parent: customerPool, labelTarget: fillInData }

    expect(isExplainableRefusal(validDataGateway, label)).toBe(false)
  })
})
