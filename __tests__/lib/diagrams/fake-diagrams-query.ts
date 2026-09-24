import { vi, type Mock } from 'vitest'

export interface FakeQueryResult {
  data?: unknown
  error: unknown
}

export function createFakeDiagramsQuery(getSupabaseClient: Mock, result: FakeQueryResult) {
  const query = {
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(async () => result),
    single: vi.fn(async () => result),
    maybeSingle: vi.fn(async () => result),
    then: (resolve: (value: unknown) => void) => resolve(result),
  }
  getSupabaseClient.mockResolvedValue({ from: vi.fn(() => query) })
  return query
}
