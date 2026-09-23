import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { isLabel } from 'bpmn-js/lib/util/LabelUtil'
import { isConnection } from 'diagram-js/lib/util/ModelUtil'
import { Bold, Italic, Underline } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

import { Button } from '@/components/ui/button'

import {
  type BpmnFactory,
  DEFAULT_TEXT_STYLE,
  getTextStyle,
  setTextStyle,
  type TextStyle,
  type TextStyleEventBus,
  type TextStyleModeling,
} from './text-style'

interface Props {
  modelerRef: RefObject<BpmnModeler | null>
  status: 'loading' | 'ready' | 'error'
}

function getDefaultTextColor(): string {
  return document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#000000'
}

export function ElementStylePanel({ modelerRef, status }: Props) {
  const [modeler, setModeler] = useState<BpmnModeler | null>(null)
  const [selected, setSelected] = useState<unknown[]>([])
  const [style, setStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE)
  const [, setThemeChanged] = useState(0)

  useEffect(() => {
    if (status !== 'ready' || !modelerRef.current) {
      setModeler(null)
      return
    }

    const current = modelerRef.current
    setModeler(current)

    const eventBus = current.get<{
      on: (event: string, cb: () => void) => void
      off: (event: string, cb: () => void) => void
    }>('eventBus')
    const selection = current.get<{ get: () => unknown[] }>('selection')

    function onSelectionChanged() {
      const elements = selection.get()
      setSelected(elements)
      setStyle(elements.length ? getTextStyle(elements[0] as never) : DEFAULT_TEXT_STYLE)
    }

    eventBus.on('selection.changed', onSelectionChanged)
    onSelectionChanged()

    return () => eventBus.off('selection.changed', onSelectionChanged)
  }, [status, modelerRef])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeChanged((prev) => prev + 1)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  if (selected.length === 0 || !modeler) return null

  const modeling = modeler.get<
    TextStyleModeling & {
      setColor: (elements: unknown[], colors: { fill?: string; stroke?: string }) => void
    }
  >('modeling')
  const bpmnFactory = modeler.get<BpmnFactory>('bpmnFactory')
  const eventBus = modeler.get<TextStyleEventBus>('eventBus')

  const shapesAndConnections = selected.filter((element) => !isLabel(element as never))
  const canFill = shapesAndConnections.some((element) => !isConnection(element as never))

  function applyFill(color: string) {
    modeling.setColor(shapesAndConnections, { fill: color })
  }

  function applyBorder(color: string) {
    modeling.setColor(shapesAndConnections, { stroke: color })
  }

  function applyTextStyle(next: Partial<TextStyle>) {
    const merged = { ...style, ...next }
    setStyle(merged)
    selected.forEach((element) =>
      setTextStyle(element as never, merged, { modeling, bpmnFactory, eventBus }),
    )
  }

  return (
    <div className="bg-popover text-popover-foreground absolute top-4 right-4 z-10 flex items-center gap-3 rounded-lg border p-2 shadow-md">
      {canFill && (
        <label className="flex items-center gap-1 text-xs" title="Cor de preenchimento">
          Fundo
          <input
            type="color"
            className="size-6 cursor-pointer rounded border"
            onChange={(event) => applyFill(event.target.value)}
          />
        </label>
      )}
      <label className="flex items-center gap-1 text-xs" title="Cor da borda">
        Borda
        <input
          type="color"
          className="size-6 cursor-pointer rounded border"
          onChange={(event) => applyBorder(event.target.value)}
        />
      </label>
      <label className="flex items-center gap-1 text-xs" title="Cor do texto">
        Texto
        <input
          type="color"
          value={style.color ?? getDefaultTextColor()}
          className="size-6 cursor-pointer rounded border"
          onChange={(event) => applyTextStyle({ color: event.target.value })}
        />
      </label>
      <div className="flex items-center gap-1 border-l pl-2">
        <Button
          variant={style.bold ? 'secondary' : 'ghost'}
          size="icon"
          aria-label="Negrito"
          onClick={() => applyTextStyle({ bold: !style.bold })}
        >
          <Bold />
        </Button>
        <Button
          variant={style.italic ? 'secondary' : 'ghost'}
          size="icon"
          aria-label="Itálico"
          onClick={() => applyTextStyle({ italic: !style.italic })}
        >
          <Italic />
        </Button>
        <Button
          variant={style.underline ? 'secondary' : 'ghost'}
          size="icon"
          aria-label="Sublinhado"
          onClick={() => applyTextStyle({ underline: !style.underline })}
        >
          <Underline />
        </Button>
      </div>
    </div>
  )
}
