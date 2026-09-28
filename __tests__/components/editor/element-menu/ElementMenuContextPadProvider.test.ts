import { describe, expect, it, vi } from 'vitest'

import ElementMenuContextPadProvider from '@/components/editor/element-menu/ElementMenuContextPadProvider'
import { OPEN_ELEMENT_MENU_EVENT } from '@/components/editor/element-menu/open-element-menu-event'

function setupProvider() {
  const contextPad = { registerProvider: vi.fn() }
  const eventBus = { fire: vi.fn() }
  const provider = new ElementMenuContextPadProvider(contextPad, eventBus)
  return { provider, contextPad, eventBus }
}

describe('ElementMenuContextPadProvider', () => {
  it('adds an entry that opens the element menu', () => {
    const { provider, contextPad, eventBus } = setupProvider()
    const task = { id: 'Task_1', labelTarget: undefined }

    const entry = provider.getContextPadEntries(task)['archquest.edit-element']!
    entry.action.click()

    expect(contextPad.registerProvider).toHaveBeenCalledWith(500, provider)
    expect(entry.title).toBe('Editar aparência e tamanho')
    expect(eventBus.fire).toHaveBeenCalledWith(OPEN_ELEMENT_MENU_EVENT, {
      element: task,
    })
  })

  it('offers the entry for several selected elements', () => {
    const { provider } = setupProvider()

    expect(provider.getMultiElementContextPadEntries([{}, {}])).toHaveProperty(
      'archquest.edit-element',
    )
  })

  it('leaves labels without the entry', () => {
    const { provider } = setupProvider()

    expect(provider.getContextPadEntries({ labelTarget: {} })).toEqual({})
  })
})
