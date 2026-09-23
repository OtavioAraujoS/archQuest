import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import { attr as svgAttr, select as svgSelect } from "tiny-svg";

import { getTextStyle } from "./text-style";

const HIGH_PRIORITY = 1500;

export default class TextStyleRenderer extends BaseRenderer {
  static readonly $inject = ["eventBus", "bpmnRenderer"];

  private readonly bpmnRenderer: BaseRenderer;

  constructor(eventBus: unknown, bpmnRenderer: BaseRenderer) {
    // @ts-expect-error BaseRenderer's constructor signature isn't fully typed upstream
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender() {
    return true;
  }

  drawShape(parentNode: SVGElement, element: unknown, attrs?: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    const gfx = this.bpmnRenderer.drawShape(parentNode, element, attrs);
    applyTextStyle(parentNode, element);
    return gfx;
  }

  drawConnection(parentNode: SVGElement, element: unknown, attrs?: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    const gfx = this.bpmnRenderer.drawConnection(parentNode, element, attrs);
    applyTextStyle(parentNode, element);
    return gfx;
  }

  getShapePath(shape: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    return this.bpmnRenderer.getShapePath(shape);
  }

  getConnectionPath(connection: unknown) {
    // @ts-expect-error delegating to the wrapped renderer's own signature
    return this.bpmnRenderer.getConnectionPath(connection);
  }
}

function applyTextStyle(parentNode: SVGElement, element: unknown) {
  const label = svgSelect(parentNode, ".djs-label") as SVGElement | null;
  if (!label) return;

  const style = getTextStyle(element as never);

  svgAttr(label, {
    "font-weight": style.bold ? "bold" : null,
    "font-style": style.italic ? "italic" : null,
    "text-decoration": style.underline ? "underline" : null,
    fill: style.color || null,
  });
}
