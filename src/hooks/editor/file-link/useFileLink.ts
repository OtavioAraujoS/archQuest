import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, useEffectEvent, useState, type RefObject } from 'react'

import { FileWritePermissionDeniedError } from '@/lib/file-system/bpmn-file-access'
import { isFileSystemAccessSupported } from '@/lib/file-system/file-system-support'
import { useLinkedFilesStore } from '@/lib/file-system/linked-files-store'
import { saveDiagramToFile } from '@/lib/file-system/save-diagram-to-file'

interface UseFileLinkOptions {
  diagramId: string | undefined
  diagramName: string
  modelerRef: RefObject<BpmnModeler | null>
  downloadBpmnInstead: () => void
}

function isSaveShortcut(event: KeyboardEvent) {
  return (
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    event.key.toLowerCase() === 's'
  )
}

function fileSaveProblemMessage(error: unknown) {
  if (error instanceof FileWritePermissionDeniedError) {
    return 'O navegador não deu permissão para gravar no arquivo. Tente de novo e permita a gravação.'
  }
  return 'Não foi possível salvar no arquivo. Confira se ele ainda existe e tente de novo.'
}

export function useFileLink({
  diagramId,
  diagramName,
  modelerRef,
  downloadBpmnInstead,
}: UseFileLinkOptions) {
  const isFileSystemSupported = isFileSystemAccessSupported()
  const linkedFile = useLinkedFilesStore((state) =>
    diagramId ? state.fileHandlesByDiagramId[diagramId] : undefined,
  )
  const [isSavingToFile, setIsSavingToFile] = useState(false)

  async function saveToFile() {
    const modeler = modelerRef.current
    if (!diagramId || !modeler || isSavingToFile) return
    setIsSavingToFile(true)
    try {
      const { xml } = await modeler.saveXML({ format: true })
      if (xml) await saveDiagramToFile(diagramId, xml, diagramName)
    } catch (error) {
      alert(fileSaveProblemMessage(error))
    } finally {
      setIsSavingToFile(false)
    }
  }

  const handleSaveShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!isSaveShortcut(event)) return
    event.preventDefault()
    if (isFileSystemSupported) void saveToFile()
    else downloadBpmnInstead()
  })

  useEffect(() => {
    window.addEventListener('keydown', handleSaveShortcut, { capture: true })
    return () =>
      window.removeEventListener('keydown', handleSaveShortcut, {
        capture: true,
      })
  }, [])

  return {
    isFileSystemSupported,
    linkedFileName: linkedFile?.name ?? null,
    isSavingToFile,
    saveToFile,
  }
}
