import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type { ChangeEvent, RefObject } from 'react'

import { downloadBlob, exportPng, exportSvg } from '@/lib/export'

const FALLBACK_FILE_NAME = 'diagram'

export function useDiagramExports(
  modelerRef: RefObject<BpmnModeler | null>,
  diagramName: string,
) {
  const fileName = diagramName || FALLBACK_FILE_NAME

  async function handleExportBpmn() {
    const modeler = modelerRef.current
    if (!modeler) return
    const { xml } = await modeler.saveXML({ format: true })
    if (!xml) return
    downloadBlob(
      new Blob([xml], { type: 'application/xml' }),
      `${fileName}.bpmn`,
    )
  }

  async function handleExportSvg() {
    if (modelerRef.current) await exportSvg(modelerRef.current, fileName)
  }

  async function handleExportPng() {
    if (modelerRef.current) await exportPng(modelerRef.current, fileName)
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    const modeler = modelerRef.current
    if (!file || !modeler) return
    await modeler.importXML(await file.text())
    modeler
      .get<{ zoom: (level: string) => void }>('canvas')
      .zoom('fit-viewport')
  }

  return { handleExportBpmn, handleExportSvg, handleExportPng, handleImport }
}
