import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { isLabel, isLabelExternal } from 'bpmn-js/lib/util/LabelUtil'
import { isConnection } from 'diagram-js/lib/util/ModelUtil'
import type { RefObject } from 'react'

import { ColorPickerField } from './style/ColorPickerField'
import { TextFormatButtons } from './style/TextFormatButtons'
import { useIsDarkTheme } from './style/useIsDarkTheme'
import {
  type BpmnFactory,
  getTextStyle,
  setTextStyle,
  type TextStyle,
  type TextStyleEventBus,
  type TextStyleModeling,
} from './text-style'
import { type EditorStatus, useSelectedElements } from './useSelectedElements'

interface ElementStylePanelProps {
  modelerRef: RefObject<BpmnModeler | null>
  status: EditorStatus
}

type ColorModeling = TextStyleModeling & {
  setColor(elements: unknown[], colors: { fill?: string; stroke?: string }): void
}

const TEXT_COLOR_ON_SHAPE = '#000000'
const TEXT_COLOR_ON_DARK_CANVAS = '#E5E7EB'

function defaultTextColor(isDarkTheme: boolean, element: unknown) {
  const textSitsOnCanvas =
    isLabel(element as never) || isLabelExternal(element as never)
  return isDarkTheme && textSitsOnCanvas
    ? TEXT_COLOR_ON_DARK_CANVAS
    : TEXT_COLOR_ON_SHAPE
}

export function ElementStylePanel({
  modelerRef,
  status,
}: Readonly<ElementStylePanelProps>) {
  const { modeler, selectedElements } = useSelectedElements(modelerRef, status)
  const isDarkTheme = useIsDarkTheme()

  if (selectedElements.length === 0 || !modeler) return null

  const modeling = modeler.get<ColorModeling>('modeling')
  const textStyleServices = {
    modeling,
    bpmnFactory: modeler.get<BpmnFactory>('bpmnFactory'),
    eventBus: modeler.get<TextStyleEventBus>('eventBus'),
  }
  const textStyle = getTextStyle(selectedElements[0] as never)
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
    <div className="bg-popover text-popover-foreground absolute top-4 right-4 z-10 flex items-center gap-3 rounded-lg border p-2 shadow-md">
      {canSetFillColor && (
        <ColorPickerField
          label="Fundo"
          title="Cor de preenchimento"
          onColorChange={(fill) => modeling.setColor(colorableElements, { fill })}
        />
      )}
      <ColorPickerField
        label="Borda"
        title="Cor da borda"
        onColorChange={(stroke) =>
          modeling.setColor(colorableElements, { stroke })
        }
      />
      <ColorPickerField
        label="Texto"
        title="Cor do texto"
        value={
          textStyle.color ?? defaultTextColor(isDarkTheme, selectedElements[0])
        }
        onColorChange={(color) => applyTextStyle({ color })}
      />
      <TextFormatButtons
        textStyle={textStyle}
        onTextStyleChange={applyTextStyle}
      />
    </div>
  )
}
