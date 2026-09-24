import type { DiagramTemplate } from '@/templates'

export const TEMPLATE_PREVIEW_PANEL_ID = 'template-preview-panel'

export function templateTabId(template: DiagramTemplate) {
  return `template-tab-${template.id}`
}
