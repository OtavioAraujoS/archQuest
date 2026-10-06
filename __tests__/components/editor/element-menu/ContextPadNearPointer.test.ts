import type Canvas from 'diagram-js/lib/core/Canvas'
import { describe, expect, it } from 'vitest'

import ContextPadNearPointer from '@/components/editor/element-menu/ContextPadNearPointer'
import type { ContextPadPosition } from '@/types/diagram-js-services'

const pool = { id: 'Participant_1' }

function setUpContextPad(defaultPosition: ContextPadPosition) {
  const viewbox = { x: 0, y: 0, scale: 1 }
  const pointer = { clientX: 400, clientY: 300 }
  const contextPad = { _getPosition: (_target: unknown) => defaultPosition }
  const canvas = {
    getContainer: () => ({
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 800,
        height: 600,
      }),
    }),
    viewbox: () => viewbox,
  } as unknown as Canvas
  const mouse = { getLastMoveEvent: () => pointer as MouseEvent }
  const listeners: Record<string, (event: never) => void> = {}
  const eventBus = {
    on: (event: string | string[], listener: (event: never) => void) => {
      listeners[String(event)] = listener
    },
  }
  new ContextPadNearPointer(contextPad, canvas, mouse, eventBus)
  const closePad = () => listeners['contextPad.close']({} as never)
  return { contextPad, viewbox, pointer, closePad }
}

describe('ContextPadNearPointer', () => {
  it('keeps the default place when the pad is on screen', () => {
    const { contextPad } = setUpContextPad({ left: 300, top: 50 })

    expect(contextPad._getPosition(pool)).toEqual({ left: 300, top: 50 })
  })

  it('opens next to the pointer when the element is wider than the canvas', () => {
    const { contextPad } = setUpContextPad({ left: 2000, top: -30 })

    expect(contextPad._getPosition(pool)).toEqual({ left: 308, top: 200 })
  })

  it('stays on the clicked spot of the diagram while the canvas scrolls', () => {
    const { contextPad, viewbox, pointer } = setUpContextPad({
      left: 2000,
      top: -30,
    })
    contextPad._getPosition(pool)

    viewbox.x = 100
    pointer.clientX = 50

    expect(contextPad._getPosition(pool)).toEqual({ left: 208, top: 200 })
  })

  it('reads the pointer again when the pad reopens', () => {
    const { contextPad, pointer, closePad } = setUpContextPad({
      left: 2000,
      top: -30,
    })
    contextPad._getPosition(pool)

    closePad()
    pointer.clientX = 600

    expect(contextPad._getPosition(pool)).toEqual({ left: 508, top: 200 })
  })
})
