import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { isLabel } from 'bpmn-js/lib/util/LabelUtil'
import { isConnection } from 'diagram-js/lib/util/ModelUtil'
import type { RefObject } from 'react'

import { ColorPickerField } from '@/components/editor/style/ColorPickerField'
import { TextFormatButtons } from '@/components/editor/style/TextFormatButtons'
import { readElementColors } from '@/components/editor/style/element-colors'
import { getTextStyle, setTextStyle } from '@/components/editor/text-style'
import { useIsDarkTheme } from '@/hooks/editor/style/useIsDarkTheme'
import { useSelectedElements } from '@/hooks/editor/useSelectedElements'
import type {
  BpmnFactoryService,
  EventBusService,
} from '@/types/diagram-js-services'
import type {
  ColorModeling,
  EditorStatus,
  TextStyle,
  TextStyleServices,
} from '@/types/editor'

interface ElementStylePanelProps {
  modelerRef: RefObject<BpmnModeler | null>
  status: EditorStatus
}

export function ElementStylePanel({
  modelerRef,
  status,
}: Readonly<ElementStylePanelProps>) {
  const { modeler, selectedElements } = useSelectedElements(modelerRef, status)
  const isDarkTheme = useIsDarkTheme()

  if (selectedElements.length === 0 || !modeler) return null

  const modeling = modeler.get<ColorModeling>('modeling')
  const textStyleServices: TextStyleServices = {
    modeling,
    bpmnFactory: modeler.get<BpmnFactoryService>('bpmnFactory'),
    eventBus: modeler.get<EventBusService>('eventBus'),
  }
  const textStyle = getTextStyle(selectedElements[0] as never)
  const colors = readElementColors(
    selectedElements[0],
    textStyle.color,
    isDarkTheme,
  )
  const colorableElements = selectedElements.filter(
    (element) => !isLabel(element as never),
  )
  const canSetFillColor = colorableElements.some(
    (element) => !isConnection(element as never),
  )

  function applyTextStyle(change: Partial<TextStyle>) {
    const nextTextStyle = { ...textStyle, ...change }
    selectedElements.forEach((element) =>
      setTextStyle(element as never, nextTextStyle, textStyleServices),
    )
  }

  return (
    <section aria-label="Aparência" className="flex flex-col gap-3">
      <h3 className="text-muted-foreground text-xs font-medium">Aparência</h3>
      {canSetFillColor && (
        <ColorPickerField
          label="Fundo"
          title="Cor de preenchimento"
          value={colors.fill}
          onColorChange={(fill) =>
            modeling.setColor(colorableElements, { fill })
          }
        />
      )}
      <ColorPickerField
        label="Borda"
        title="Cor da borda"
        value={colors.stroke}
        onColorChange={(stroke) =>
          modeling.setColor(colorableElements, { stroke })
        }
      />
      <ColorPickerField
        label="Texto"
        title="Cor do texto"
        value={colors.text}
        onColorChange={(color) => applyTextStyle({ color })}
      />
      <TextFormatButtons
        textStyle={textStyle}
        onTextStyleChange={applyTextStyle}
      />
    </section>
  )
}
