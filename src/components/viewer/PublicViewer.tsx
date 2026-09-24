import { Link, useParams } from 'react-router-dom'

import { PublicDiagramView } from '@/components/viewer/PublicDiagramView'
import { usePublicDiagram } from '@/hooks/viewer/usePublicDiagram'

function PublicViewerMessage({ title, detail }: Readonly<{ title: string; detail: string }>) {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-3 px-6 py-16 text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{detail}</p>
      <Link to="/" className="text-sm font-medium underline underline-offset-4">
        Ir para o archQuest
      </Link>
    </main>
  )
}

export function PublicViewer() {
  const { slug } = useParams<{ slug: string }>()
  const publicDiagramLookup = usePublicDiagram(slug)

  if (publicDiagramLookup.status === 'loading') {
    return (
      <p className="text-muted-foreground p-10 text-center text-sm">Carregando diagrama…</p>
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
