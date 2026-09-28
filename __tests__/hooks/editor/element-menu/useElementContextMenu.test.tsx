import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OPEN_ELEMENT_MENU_EVENT } from '@/components/editor/element-menu/open-element-menu-event'
import { useElementContextMenu } from '@/hooks/editor/element-menu/useElementContextMenu'
import { createElementMenuModeler, rect } from './element-menu-fakes'

const task = { id: 'Task_1', parent: {} }

function renderContextMenuHook() {
  const fakes = createElementMenuModeler(() => rect(150, 120, 100, 80))
  const container = document.createElement('div')
  container.getBoundingClientRect = () => rect(100, 100, 800, 600)
  const modelerRef = { current: fakes.modeler }
  const containerRef = { current: container }
  const { result } = renderHook(() =>
    useElementContextMenu(modelerRef, containerRef, 'ready'),
  )
  return { ...fakes, result }
}

describe('useElementContextMenu', () => {
  it('opens above the right-clicked element and selects it', () => {
    const { eventBus, selection, result } = renderContextMenuHook()
    const originalEvent = { preventDefault: vi.fn() }

    act(() =>
      eventBus.fire('element.contextmenu', { element: task, originalEvent }),
    )

    expect(originalEvent.preventDefault).toHaveBeenCalled()
    expect(selection.select).toHaveBeenCalledWith(task)
    expect(result.current.menuAnchor).toEqual({
      left: 50,
      top: 20,
      width: 100,
      height: 80,
    })
  })

  it('opens from the context pad entry too', () => {
    const { eventBus, result } = renderContextMenuHook()

    act(() => eventBus.fire(OPEN_ELEMENT_MENU_EVENT, { element: task }))

    expect(result.current.menuAnchor).not.toBeNull()
  })

  it('ignores a right-click on the empty canvas', () => {
    const { eventBus, result } = renderContextMenuHook()
    const originalEvent = { preventDefault: vi.fn() }

    act(() =>
      eventBus.fire('element.contextmenu', { element: {}, originalEvent }),
    )

    expect(originalEvent.preventDefault).not.toHaveBeenCalled()
    expect(result.current.menuAnchor).toBeNull()
  })

  it('closes when the selection changes or the canvas moves', () => {
    const { eventBus, result } = renderContextMenuHook()

    act(() => eventBus.fire(OPEN_ELEMENT_MENU_EVENT, { element: task }))
    act(() => eventBus.fire('canvas.viewbox.changing'))
    expect(result.current.menuAnchor).toBeNull()

    act(() => eventBus.fire(OPEN_ELEMENT_MENU_EVENT, { element: task }))
    act(() => eventBus.fire('selection.changed'))
    expect(result.current.menuAnchor).toBeNull()
  })
})
