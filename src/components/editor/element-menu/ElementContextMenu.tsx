import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, type RefObject } from 'react'

import { ElementStylePanel } from '@/components/editor/ElementStylePanel'
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel'
import { Button } from '@/components/ui/button'
import { useElementMenuPlacement } from '@/hooks/editor/element-menu/useElementMenuPlacement'
import {
  type EditorStatus,
  useSelectedElements,
} from '@/hooks/editor/useSelectedElements'
import { useDismissOnOutsideOrEscape } from '@/hooks/ui/useDismissOnOutsideOrEscape'

import { ElementSizeFields } from './ElementSizeFields'
import type { MenuRect } from './place-element-menu'

interface ElementContextMenuProps {
  modelerRef: RefObject<BpmnModeler | null>
  status: EditorStatus
  anchor: MenuRect | null
  onClose: () => void
}

function describeSelection(selectedCount: number) {
  return selectedCount === 1
    ? '1 elemento selecionado'
    : `${selectedCount} elementos selecionados`
}

export function ElementContextMenu({
  modelerRef,
  status,
  anchor,
  onClose,
}: Readonly<ElementContextMenuProps>) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { selectedElements } = useSelectedElements(modelerRef, status)
  const isOpen = anchor !== null && selectedElements.length > 0
  const closeAndReturnToCanvas = useCallback(() => {
    onClose()
    modelerRef.current?.get<{ focus(): void }>('canvas').focus()
  }, [onClose, modelerRef])
  const dismissMenu = useCallback(
    (reason: 'outside' | 'escape') =>
      reason === 'escape' ? closeAndReturnToCanvas() : onClose(),
    [closeAndReturnToCanvas, onClose],
  )

  useElementMenuPlacement(menuRef, isOpen ? anchor : null)
  useDismissOnOutsideOrEscape(menuRef, isOpen, dismissMenu)
  useEffect(() => {
    if (isOpen) menuRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-label="Editar elemento"
      tabIndex={-1}
      className="bg-popover text-popover-foreground absolute z-20 flex max-h-[calc(100%-1rem)] w-72 max-w-[calc(100%-1rem)] flex-col overflow-y-auto rounded-xl border shadow-lg outline-none"
    >
      <div className="flex items-center justify-between gap-2 border-b py-1.5 pr-1.5 pl-4">
        <h2 className="text-sm font-medium">
          {describeSelection(selectedElements.length)}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Fechar"
          onClick={closeAndReturnToCanvas}
        >
          <X />
        </Button>
      </div>
      <div className="flex flex-col gap-5 p-4">
        <ElementStylePanel modelerRef={modelerRef} status={status} />
        <ElementSizeFields modelerRef={modelerRef} status={status} />
        <PropertiesPanel modelerRef={modelerRef} status={status} />
      </div>
    </div>
  )
}
