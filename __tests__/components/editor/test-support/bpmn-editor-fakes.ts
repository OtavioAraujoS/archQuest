import { vi } from 'vitest'

import { GUEST_SYNC_FIELDS, type DiagramRecord } from '@/lib/db'

export const fakeModeler = {
  importXML: vi.fn(),
  saveXML: vi.fn(),
  saveSVG: vi.fn(),
  destroy: vi.fn(),
  zoom: vi.fn(),
  triggerDiagramChange: undefined as (() => void) | undefined,
}

export const fakeExport = {
  downloadBlob: vi.fn(),
  exportSvg: vi.fn(),
  exportPng: vi.fn(),
}

export function resetBpmnEditorFakes() {
  vi.clearAllMocks()
  fakeModeler.importXML.mockResolvedValue(undefined)
  fakeModeler.saveXML.mockResolvedValue({ xml: '<xml>saved</xml>' })
  fakeModeler.saveSVG.mockResolvedValue({ svg: '<svg>saved</svg>' })
  fakeExport.exportSvg.mockResolvedValue(undefined)
  fakeExport.exportPng.mockResolvedValue(undefined)
  fakeModeler.triggerDiagramChange = undefined
}

function modelerService(service: string) {
  if (service === 'canvas') return { zoom: fakeModeler.zoom }
  if (service === 'eventBus') {
    return {
      on: (event: string, handler: () => void) => {
        if (event === 'commandStack.changed') {
          fakeModeler.triggerDiagramChange = handler
        }
      },
    }
  }
  throw new Error(`Unexpected service: ${service}`)
}

export const fakeBpmnModelerModule = {
  default: vi.fn().mockImplementation(function FakeBpmnModeler() {
    return {
      importXML: fakeModeler.importXML,
      saveXML: fakeModeler.saveXML,
      saveSVG: fakeModeler.saveSVG,
      destroy: fakeModeler.destroy,
      get: modelerService,
    }
  }),
}

export function makeDiagramRecord(
  overrides: Partial<DiagramRecord> = {},
): DiagramRecord {
  return {
    id: 'diagram-1',
    name: 'Processo original',
    bpmnXml: '<xml>original</xml>',
    createdAt: 1,
    updatedAt: 1,
    ...GUEST_SYNC_FIELDS,
    ...overrides,
  }
}
