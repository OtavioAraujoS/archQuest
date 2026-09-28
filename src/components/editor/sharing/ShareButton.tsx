import { Share2 } from 'lucide-react'
import { useState } from 'react'

import { ShareDialog } from '@/components/editor/sharing/ShareDialog'
import { Button } from '@/components/ui/button'
import { useCachedDiagram } from '@/hooks/diagrams/useCachedDiagram'

interface ShareButtonProps {
  diagramId: string | undefined
}

export function ShareButton({ diagramId }: Readonly<ShareButtonProps>) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const diagram = useCachedDiagram(diagramId)

  if (!diagram || diagram.ownerId === null) return null

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsShareDialogOpen(true)}
      >
        <Share2 /> Compartilhar
      </Button>
      {isShareDialogOpen && (
        <ShareDialog
          diagram={diagram}
          onClose={() => setIsShareDialogOpen(false)}
        />
      )}
    </>
  )
}
