import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { type RefObject, useState } from 'react'

import { RESIZE_ELEMENTS } from '@/components/editor/element-resize/ResizeElementsHandler'
import { findResizeTargets } from '@/components/editor/multi-resize/find-resize-targets'
import { useSelectedElements } from '@/hooks/editor/useSelectedElements'
import type { EditorStatus } from '@/types/editor'
import type { RequestedSize } from '@/types/geometry'
import type {
  ResizableShape,
  ResizeCommandStack,
  ResizeService,
  RulesService,
} from '@/types/resize'

import { DimensionInput } from './DimensionInput'
import { planElementSizes, sharedDimension } from './plan-element-sizes'

interface ElementSizeFieldsProps {
  modelerRef: RefObject<BpmnModeler | null>
  status: EditorStatus
}

export function ElementSizeFields({
  modelerRef,
  status,
}: Readonly<ElementSizeFieldsProps>) {
  const { modeler, selectedElements } = useSelectedElements(modelerRef, status)
  const [wasLimitedByMinimum, setWasLimitedByMinimum] = useState(false)
  if (!modeler) return null

  const shapes = findResizeTargets(
    selectedElements as ResizableShape[],
    modeler.get<RulesService>('rules'),
  )
  if (shapes.length === 0) return null
  const sharedWidth = sharedDimension(shapes, 'width')
  const sharedHeight = sharedDimension(shapes, 'height')

  function applySize(requested: RequestedSize) {
    if (!modeler) return
    const plan = planElementSizes(
      shapes,
      requested,
      modeler.get<ResizeService>('resize'),
    )
    setWasLimitedByMinimum(plan.wasLimitedByMinimum)
    if (plan.resizes.length === 0) return
    modeler
      .get<ResizeCommandStack>('commandStack')
      .execute(RESIZE_ELEMENTS, { resizes: plan.resizes })
  }

  return (
    <section aria-label="Tamanho" className="flex flex-col gap-3">
      <h3 className="text-muted-foreground text-xs font-medium">Tamanho</h3>
      <div className="flex gap-3">
        <DimensionInput
          key={`width-${sharedWidth}`}
          label="Largura"
          value={sharedWidth}
          onCommit={(width) => applySize({ width })}
        />
        <DimensionInput
          key={`height-${sharedHeight}`}
          label="Altura"
          value={sharedHeight}
          onCommit={(height) => applySize({ height })}
        />
      </div>
      {wasLimitedByMinimum && (
        <p className="text-muted-foreground text-xs">
          Ajustado ao tamanho mínimo que o elemento permite.
        </p>
      )}
    </section>
  )
}
