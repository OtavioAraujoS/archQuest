import { GUEST_SYNC_FIELDS, type DiagramRecord } from '@/lib/db'

export function makeLibraryDiagram(
  overrides: Partial<DiagramRecord> = {},
): DiagramRecord {
  return {
    id: 'diagram-1',
    name: 'Processo de vendas',
    bpmnXml: '<xml />',
    createdAt: 1,
    updatedAt: 1,
    ...GUEST_SYNC_FIELDS,
    ...overrides,
  }
}
