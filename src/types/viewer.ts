import type Viewer from 'bpmn-js/lib/Viewer'

import type { PublicDiagram } from '@/lib/supabase/database-types'

export type ViewerClass<DiagramViewer extends Viewer> = new (
  options: ConstructorParameters<typeof Viewer>[0],
) => DiagramViewer

export type PublicDiagramLookup =
  | { status: 'loading' }
  | { status: 'found'; diagram: PublicDiagram }
  | { status: 'not-found' }
  | { status: 'failed' }
