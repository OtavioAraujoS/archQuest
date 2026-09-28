import { OPEN_ELEMENT_MENU_EVENT } from './open-element-menu-event'

const PRIORITY_AFTER_DEFAULT_ENTRIES = 500
const EDIT_ELEMENT_ENTRY_ID = 'archquest.edit-element'
const PAINTBRUSH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>`

interface ContextPadService {
  registerProvider(priority: number, provider: unknown): void
}

interface MenuEventBus {
  fire(event: string, payload: Record<string, unknown>): void
}

export default class ElementMenuContextPadProvider {
  static readonly $inject = ['contextPad', 'eventBus']

  private readonly eventBus: MenuEventBus

  constructor(contextPad: ContextPadService, eventBus: MenuEventBus) {
    this.eventBus = eventBus
    contextPad.registerProvider(PRIORITY_AFTER_DEFAULT_ENTRIES, this)
  }

  getContextPadEntries(element: { labelTarget?: unknown }) {
    if (element.labelTarget) return {}
    return { [EDIT_ELEMENT_ENTRY_ID]: this.editElementEntry(element) }
  }

  getMultiElementContextPadEntries(elements: unknown[]) {
    return { [EDIT_ELEMENT_ENTRY_ID]: this.editElementEntry(elements[0]) }
  }

  private editElementEntry(element: unknown) {
    return {
      group: 'edit',
      title: 'Editar aparência e tamanho',
      html: `<div class="entry archquest-edit-element-entry">${PAINTBRUSH_ICON}</div>`,
      action: {
        click: () => this.eventBus.fire(OPEN_ELEMENT_MENU_EVENT, { element }),
      },
    }
  }
}
