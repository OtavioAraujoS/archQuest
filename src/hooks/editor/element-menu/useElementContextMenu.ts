import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import type Selection from 'diagram-js/lib/features/selection/Selection'
import { type RefObject, useCallback, useEffect, useState } from 'react'

import { OPEN_ELEMENT_MENU_EVENT } from '@/components/editor/element-menu/open-element-menu-event'
import { unionOfRects } from '@/components/editor/element-menu/place-element-menu'
import type { EventBusService } from '@/types/diagram-js-services'
import type { EditorStatus, MenuOpeningEvent } from '@/types/editor'
import type { MenuRect } from '@/types/geometry'

const CLOSING_EVENTS = ['selection.changed', 'canvas.viewbox.changing']

export function useElementContextMenu(
  modelerRef: RefObject<BpmnModeler | null>,
  containerRef: RefObject<HTMLElement | null>,
  status: EditorStatus,
) {
  const [menuAnchor, setMenuAnchor] = useState<MenuRect | null>(null)
  const closeMenu = useCallback(() => setMenuAnchor(null), [])

  useEffect(() => {
    const modeler = modelerRef.current
    if (status !== 'ready' || !modeler) return
    const eventBus = modeler.get<EventBusService>('eventBus')
    const selection = modeler.get<Selection>('selection')
    const elementRegistry = modeler.get<ElementRegistry>('elementRegistry')

    function measureSelection() {
      const container = containerRef.current
      const rects = selection
        .get()
        .map((element) => elementRegistry.getGraphics(element))
        .filter((graphics): graphics is SVGElement => Boolean(graphics))
        .map((graphics) => graphics.getBoundingClientRect())
      if (!container || rects.length === 0) return null
      return unionOfRects(rects, container.getBoundingClientRect())
    }

    function openMenu({ element, originalEvent }: MenuOpeningEvent) {
      const target = element.labelTarget ?? element
      if (!target.parent) return
      originalEvent?.preventDefault()
      if (!selection.isSelected(target)) selection.select(target)
      setMenuAnchor(measureSelection())
    }

    function followChangedElements() {
      setMenuAnchor((anchor) => (anchor ? measureSelection() : anchor))
    }

    eventBus.on('element.contextmenu', openMenu)
    eventBus.on(OPEN_ELEMENT_MENU_EVENT, openMenu)
    eventBus.on('elements.changed', followChangedElements)
    CLOSING_EVENTS.forEach((event) => eventBus.on(event, closeMenu))
    return () => {
      eventBus.off('element.contextmenu', openMenu)
      eventBus.off(OPEN_ELEMENT_MENU_EVENT, openMenu)
      eventBus.off('elements.changed', followChangedElements)
      CLOSING_EVENTS.forEach((event) => eventBus.off(event, closeMenu))
      setMenuAnchor(null)
    }
  }, [modelerRef, containerRef, status, closeMenu])

  return { menuAnchor, closeMenu }
}
