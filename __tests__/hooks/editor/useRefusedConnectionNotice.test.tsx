import { act, renderHook } from '@testing-library/react'
import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  REFUSED_CONNECTION_NOTICE_DURATION_MS,
  useRefusedConnectionNotice,
} from '@/hooks/editor/useRefusedConnectionNotice'
import { REFUSED_CONNECTION_REASONS } from '@/lib/bpmn/describe-refused-connection'
import { makeTwoPoolDiagram } from '../../lib/bpmn/diagram-element-fakes'

type ConnectListener = (event: { context: Record<string, unknown> }) => void

const listeners = new Map<string, ConnectListener>()
const eventBus = {
  on: vi.fn((event: string, listener: ConnectListener) =>
    listeners.set(event, listener),
  ),
  off: vi.fn((event: string) => listeners.delete(event)),
}
const modelerRef = {
  current: { get: () => eventBus } as unknown as BpmnModeler,
}

function rejectConnection(context: Record<string, unknown>) {
  act(() => listeners.get('connect.rejected')?.({ context }))
}

describe('useRefusedConnectionNotice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    listeners.clear()
  })
  afterEach(() => vi.useRealTimers())

  it('explains a connection the BPMN rules refused', () => {
    const { validDataGateway, fillInData } = makeTwoPoolDiagram()
    const { result } = renderHook(() =>
      useRefusedConnectionNotice(modelerRef, 'ready'),
    )

    rejectConnection({
      start: validDataGateway,
      hover: fillInData,
      canExecute: false,
    })

    expect(result.current.refusedConnectionMessage).toBe(
      REFUSED_CONNECTION_REASONS.gatewaySendsToOtherPool,
    )
  })

  it('ignores drops the rules did not judge', () => {
    const { validDataGateway, fillInData } = makeTwoPoolDiagram()
    const { result } = renderHook(() =>
      useRefusedConnectionNotice(modelerRef, 'ready'),
    )

    rejectConnection({
      start: validDataGateway,
      hover: fillInData,
      canExecute: null,
    })
    rejectConnection({
      start: validDataGateway,
      hover: null,
      canExecute: false,
    })

    expect(result.current.refusedConnectionMessage).toBeNull()
  })

  it('hides the explanation when dismissed or after a while', () => {
    const { validDataGateway, fillInData } = makeTwoPoolDiagram()
    const refusal = {
      start: validDataGateway,
      hover: fillInData,
      canExecute: false,
    }
    const { result } = renderHook(() =>
      useRefusedConnectionNotice(modelerRef, 'ready'),
    )

    rejectConnection(refusal)
    act(() => result.current.dismissRefusedConnectionMessage())
    expect(result.current.refusedConnectionMessage).toBeNull()

    rejectConnection(refusal)
    act(() => vi.advanceTimersByTime(REFUSED_CONNECTION_NOTICE_DURATION_MS))
    expect(result.current.refusedConnectionMessage).toBeNull()
  })

  it('stops listening when the editor is not ready', () => {
    const { rerender } = renderHook(
      ({ status }) => useRefusedConnectionNotice(modelerRef, status),
      { initialProps: { status: 'ready' as 'ready' | 'loading' } },
    )

    rerender({ status: 'loading' })

    expect(listeners.has('connect.rejected')).toBe(false)
  })
})
