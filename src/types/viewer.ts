import type { PublicDiagram } from '@/lib/supabase/database-types'

export type PublicDiagramLookup =
  | { status: 'loading' }
  | { status: 'found'; diagram: PublicDiagram }
  | { status: 'not-found' }
  | { status: 'failed' }
