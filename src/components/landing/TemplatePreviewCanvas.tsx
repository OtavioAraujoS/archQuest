import { useTemplatePreviewViewer } from '@/components/landing/useTemplatePreviewViewer'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import '@/components/editor/bpmn-theme.css'

interface TemplatePreviewCanvasProps {
  bpmnXml: string
}

export default function TemplatePreviewCanvas({ bpmnXml }: Readonly<TemplatePreviewCanvasProps>) {
  const { containerRef, hasRenderFailed } = useTemplatePreviewViewer(bpmnXml)

  return (
    <>
      {hasRenderFailed && (
        <p role="alert" className="text-muted-foreground p-6 text-sm">
          Não foi possível desenhar a prévia deste modelo.
        </p>
      )}
      <div ref={containerRef} className="archquest-bpmn h-full w-full" />
    </>
  )
}
