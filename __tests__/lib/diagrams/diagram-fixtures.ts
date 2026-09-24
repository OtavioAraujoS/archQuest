import { GUEST_SYNC_FIELDS, type DiagramRecord } from '@/lib/db'
import type { DiagramRow } from '@/lib/supabase/database-types'

export const OWNER_ID = 'owner-1'

export function makeGuestDiagram(overrides: Partial<DiagramRecord> = {}): DiagramRecord {
  return {
    id: 'guest-1',
    name: 'Rascunho local',
    bpmnXml: '<xml>guest</xml>',
    createdAt: 1,
    updatedAt: 1,
    ...GUEST_SYNC_FIELDS,
    ...overrides,
  }
}

export function makeAccountDiagram(overrides: Partial<DiagramRecord> = {}): DiagramRecord {
  return makeGuestDiagram({
    id: 'account-1',
    name: 'Processo na conta',
    bpmnXml: '<xml>account</xml>',
    ownerId: OWNER_ID,
    version: 3,
    ...overrides,
  })
}

export function makeDiagramRow(overrides: Partial<DiagramRow> = {}): DiagramRow {
  return {
    id: 'account-1',
    owner_id: OWNER_ID,
    name: 'Processo na nuvem',
    bpmn_xml: '<xml>cloud</xml>',
    thumbnail: '<svg>cloud</svg>',
    version: 4,
    public_slug: null,
    created_at: '2026-09-20T10:00:00.000Z',
    updated_at: '2026-09-24T10:00:00.000Z',
    ...overrides,
  }
}
