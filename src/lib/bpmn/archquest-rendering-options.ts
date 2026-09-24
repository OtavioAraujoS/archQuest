import TextStyleRenderer from '@/components/editor/TextStyleRenderer'
import textStyleModdle from '@/components/editor/text-style-moddle.json'
import { THEMED_DIAGRAM_RENDERER_COLORS } from '@/lib/diagram-colors'

export const textStyleRendererModule = {
  __init__: ['textStyleRenderer'],
  textStyleRenderer: ['type', TextStyleRenderer],
}

export const ARCHQUEST_RENDERING_OPTIONS = {
  bpmnRenderer: THEMED_DIAGRAM_RENDERER_COLORS,
  moddleExtensions: { archquest: textStyleModdle },
}
