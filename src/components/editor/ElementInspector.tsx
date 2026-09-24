import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { X } from 'lucide-react'
import type { RefObject } from 'react'

import { ElementStylePanel } from '@/components/editor/ElementStylePanel'
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel'
import { Button } from '@/components/ui/button'
import {
  type EditorStatus,
  useSelectedElements,
} from '@/hooks/editor/useSelectedElements'

interface ElementInspectorProps {
  modelerRef: RefObject<BpmnModeler | null>
  status: EditorStatus
}

function describeSelection(selectedCount: number) {
  return selectedCount === 1
    ? '1 elemento selecionado'
    : `${selectedCount} elementos selecionados`
}

export function ElementInspector({
  modelerRef,
  status,
}: Readonly<ElementInspectorProps>) {
  const { modeler, selectedElements } = useSelectedElements(modelerRef, status)
  if (!modeler || selectedElements.length === 0) return null

  function clearSelection() {
    modeler
      ?.get<{ select: (elements: unknown[]) => void }>('selection')
      .select([])
  }

  return (
    <aside
      aria-label="Elemento selecionado"
      className="bg-background flex max-h-[45%] shrink-0 flex-col overflow-y-auto border-t md:max-h-none md:w-72 md:border-t-0 md:border-l"
    >
      <div className="flex items-center justify-between gap-2 border-b py-2 pr-2 pl-4">
        <h2 className="text-sm font-medium">
          {describeSelection(selectedElements.length)}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Limpar seleção"
          onClick={clearSelection}
        >
          <X />
        </Button>
      </div>
      <div className="flex flex-col gap-6 p-4">
        <ElementStylePanel modelerRef={modelerRef} status={status} />
        <PropertiesPanel modelerRef={modelerRef} status={status} />
      </div>
    </aside>
  )
}
