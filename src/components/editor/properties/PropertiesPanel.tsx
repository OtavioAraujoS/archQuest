import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type { RefObject } from 'react'

import type { EditorStatus } from '../useSelectedElements'
import { findMessageEventDefinition } from './message/message-event-definition'
import { MessageField } from './message/MessageField'
import { propertyEditingServices } from './property-editing-services'
import { findTimerEventDefinition } from './timer/timer-event-definition'
import { TimerField } from './timer/TimerField'
import { useSelectedElement } from './useSelectedElement'

interface PropertiesPanelProps {
  modelerRef: RefObject<BpmnModeler | null>
  status: EditorStatus
}

export function PropertiesPanel({
  modelerRef,
  status,
}: Readonly<PropertiesPanelProps>) {
  const { modeler, selectedElement } = useSelectedElement(modelerRef, status)
  if (!modeler || !selectedElement) return null

  const messageDefinition = findMessageEventDefinition(selectedElement)
  const timerDefinition = findTimerEventDefinition(selectedElement)
  if (!messageDefinition && !timerDefinition) return null

  const services = propertyEditingServices(modeler)

  return (
    <aside
      aria-label="Propriedades"
      className="bg-popover text-popover-foreground absolute top-20 right-4 z-10 flex w-64 flex-col gap-3 rounded-lg border p-3 shadow-md"
    >
      {messageDefinition && (
        <MessageField
          services={services}
          element={selectedElement}
          eventDefinition={messageDefinition}
        />
      )}
      {timerDefinition && (
        <TimerField
          services={services}
          element={selectedElement}
          timerDefinition={timerDefinition}
        />
      )}
    </aside>
  )
}
