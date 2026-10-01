import { useLatestAnswer } from '@/hooks/ui/useLatestAnswer'
import { fetchPublicDiagram } from '@/lib/sharing/fetch-public-diagram'
import type { PublicDiagram } from '@/lib/supabase/database-types'

export type PublicDiagramLookup =
  | { status: 'loading' }
  | { status: 'found'; diagram: PublicDiagram }
  | { status: 'not-found' }
  | { status: 'failed' }

function lookUpPublicDiagram(slug: string): Promise<PublicDiagramLookup> {
  if (!slug) return Promise.resolve({ status: 'not-found' })
  return fetchPublicDiagram(slug).then(
    (diagram) =>
      diagram ? { status: 'found', diagram } : { status: 'not-found' },
    () => ({ status: 'failed' }),
  )
}

export function usePublicDiagram(slug = ''): PublicDiagramLookup {
  const lookedUp = useLatestAnswer(slug, lookUpPublicDiagram)
  return lookedUp?.answer ?? { status: slug ? 'loading' : 'not-found' }
}
