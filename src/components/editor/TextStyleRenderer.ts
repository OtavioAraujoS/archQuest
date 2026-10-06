import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import { attr as svgAttr, select as svgSelect } from 'tiny-svg'

import { makeColorsReadable } from '@/lib/bpmn/readable-colors'
import { isDarkThemeActive } from '@/lib/theme'
import type { EventBusService } from '@/types/diagram-js-services'

import { getTextStyle } from './text-style'

const HIGH_PRIORITY = 1500

export default class TextStyleRenderer extends BaseRenderer {
  static readonly $inject = ['eventBus', 'bpmnRenderer', 'elementRegistry']

  private readonly bpmnRenderer: BaseRenderer

  constructor(
    eventBus: EventBusService,
    bpmnRenderer: BaseRenderer,
    elementRegistry: ElementRegistry,
  ) {
    // @ts-expect-error BaseRenderer's constructor signature isn't fully typed upstream
    super(eventBus, HIGH_PRIORITY)
    this.bpmnRenderer = bpmnRenderer
    redrawWhenThemeChanges(eventBus, elementRegistry)
  }

  canRender() {
    return true
  }

  drawShape(parentNode: SVGElement, element: unknown, attrs?: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    const gfx = this.bpmnRenderer.drawShape(parentNode, element, attrs)
    applyTextStyle(parentNode, element)
    makeColorsReadable(parentNode, isDarkThemeActive())
    return gfx
  }

  drawConnection(parentNode: SVGElement, element: unknown, attrs?: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    const gfx = this.bpmnRenderer.drawConnection(parentNode, element, attrs)
    applyTextStyle(parentNode, element)
    makeColorsReadable(parentNode, isDarkThemeActive())
    return gfx
  }

  getShapePath(shape: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    return this.bpmnRenderer.getShapePath(shape)
  }

  getConnectionPath(connection: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    return this.bpmnRenderer.getConnectionPath(connection)
  }
}

function redrawWhenThemeChanges(
  eventBus: EventBusService,
  elementRegistry: ElementRegistry,
) {
  const themeObserver = new MutationObserver(() =>
    eventBus.fire('elements.changed', {
      elements: elementRegistry.filter((element) => Boolean(element.parent)),
    }),
  )
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  eventBus.on('diagram.destroy', () => themeObserver.disconnect())
}

function applyTextStyle(parentNode: SVGElement, element: unknown) {
  const label = svgSelect(parentNode, '.djs-label') as SVGElement | null
  if (!label) return

  const style = getTextStyle(element as never)

  svgAttr(label, {
    'font-weight': style.bold ? 'bold' : null,
    'font-style': style.italic ? 'italic' : null,
    'text-decoration': style.underline ? 'underline' : null,
  })
  if (style.color) label.style.setProperty('fill', style.color, 'important')
}
