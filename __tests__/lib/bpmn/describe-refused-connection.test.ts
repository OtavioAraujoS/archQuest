import { describe, expect, it } from 'vitest'

import {
  describeRefusedConnection,
  REFUSED_CONNECTION_REASONS,
} from '@/lib/bpmn/describe-refused-connection'
import { makeShape, makeTwoPoolDiagram } from './diagram-element-fakes'

describe('describeRefusedConnection', () => {
  it('explains that a gateway cannot reach another pool', () => {
    const { validDataGateway, fillInData } = makeTwoPoolDiagram()

    expect(describeRefusedConnection(validDataGateway, fillInData)).toBe(
      REFUSED_CONNECTION_REASONS.gatewaySendsToOtherPool,
    )
  })

  it('explains that a gateway cannot receive a message', () => {
    const { fillInData, validDataGateway } = makeTwoPoolDiagram()

    expect(describeRefusedConnection(fillInData, validDataGateway)).toBe(
      REFUSED_CONNECTION_REASONS.gatewayReceivesFromOtherPool,
    )
  })

  it('explains that solid arrows stay inside one pool', () => {
    const { customerPool, bankPool } = makeTwoPoolDiagram()
    const startEvent = makeShape('bpmn:StartEvent', customerPool)
    const timerStart = makeShape('bpmn:StartEvent', bankPool)

    expect(describeRefusedConnection(startEvent, timerStart)).toBe(
      REFUSED_CONNECTION_REASONS.acrossPools,
    )
  })

  it('explains that solid arrows do not cross a sub-process border', () => {
    const { bankPool, captureData } = makeTwoPoolDiagram()
    const subProcess = makeShape('bpmn:SubProcess', bankPool)
    const innerTask = makeShape('bpmn:Task', subProcess)

    expect(describeRefusedConnection(captureData, innerTask)).toBe(
      REFUSED_CONNECTION_REASONS.acrossSubProcessBorder,
    )
  })

  it('explains that end events have no outgoing arrows', () => {
    const { bankPool, captureData } = makeTwoPoolDiagram()
    const endEvent = makeShape('bpmn:EndEvent', bankPool)

    expect(describeRefusedConnection(endEvent, captureData)).toBe(
      REFUSED_CONNECTION_REASONS.fromEndEvent,
    )
  })

  it('explains that start events have no incoming arrows', () => {
    const { bankPool, captureData } = makeTwoPoolDiagram()
    const startEvent = makeShape('bpmn:StartEvent', bankPool)

    expect(describeRefusedConnection(captureData, startEvent)).toBe(
      REFUSED_CONNECTION_REASONS.toStartEvent,
    )
  })

  it('falls back to a general explanation', () => {
    const { bankPool, captureData } = makeTwoPoolDiagram()
    const group = makeShape('bpmn:Group', bankPool)

    expect(describeRefusedConnection(captureData, group)).toBe(
      REFUSED_CONNECTION_REASONS.notAllowed,
    )
  })
})
