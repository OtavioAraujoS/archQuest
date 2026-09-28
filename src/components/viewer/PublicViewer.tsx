import { useParams } from 'react-router-dom'

import { MessagePage } from '@/components/layout/MessagePage'
import { PublicDiagramView } from '@/components/viewer/PublicDiagramView'
import { usePublicDiagram } from '@/hooks/viewer/usePublicDiagram'
import { LANDING_PATH } from '@/lib/routes'

function PublicViewerMessage({
  title,
  detail,
}: Readonly<{ title: string; detail: string }>) {
  return (
    <MessagePage
      title={title}
      detail={detail}
      linkLabel="Ir para o archQuest"
      linkTo={LANDING_PATH}
    />
  )
}

export function PublicViewer() {
  const { slug } = useParams<{ slug: string }>()
  const publicDiagramLookup = usePublicDiagram(slug)

  if (publicDiagramLookup.status === 'loading') {
    return (
      <p className="text-muted-foreground p-10 text-center text-sm">
        Carregando diagrama…
      </p>
    )
  }
  if (publicDiagramLookup.status === 'not-found') {
    return (
      <PublicViewerMessage
        title="Diagrama não encontrado"
        detail="O link pode ter sido desativado ou o diagrama pode ter sido excluído."
      />
    )
  }
  if (publicDiagramLookup.status === 'failed') {
    return (
      <PublicViewerMessage
        title="Não foi possível carregar o diagrama"
        detail="Confira a conexão e recarregue a página."
      />
    )
  }
  return <PublicDiagramView diagram={publicDiagramLookup.diagram} />
}
