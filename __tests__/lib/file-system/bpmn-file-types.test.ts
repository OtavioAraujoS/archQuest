import { describe, expect, it } from 'vitest'

import { bpmnFileNameFor, diagramNameFromFileName } from '@/lib/file-system/bpmn-file-types'

describe('BPMN file names', () => {
  it('names the diagram after the opened file, without the extension', () => {
    expect(diagramNameFromFileName('Reembolso de despesas.bpmn')).toBe('Reembolso de despesas')
    expect(diagramNameFromFileName('processo.XML')).toBe('processo')
  })

  it('keeps the whole file name when nothing is left without the extension', () => {
    expect(diagramNameFromFileName('.bpmn')).toBe('.bpmn')
  })

  it('suggests a .bpmn file named after the diagram', () => {
    expect(bpmnFileNameFor('Onboarding')).toBe('Onboarding.bpmn')
    expect(bpmnFileNameFor('   ')).toBe('diagrama.bpmn')
  })
})
