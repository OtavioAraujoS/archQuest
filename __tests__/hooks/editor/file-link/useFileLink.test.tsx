import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useFileLink } from '@/hooks/editor/file-link/useFileLink'
import { FileWritePermissionDeniedError } from '@/lib/file-system/bpmn-file-access'

const { saveDiagramToFile, isFileSystemAccessSupported } = vi.hoisted(() => ({
  saveDiagramToFile: vi.fn(),
  isFileSystemAccessSupported: vi.fn(),
}))

vi.mock('@/lib/file-system/save-diagram-to-file', () => ({ saveDiagramToFile }))
vi.mock('@/lib/file-system/file-system-support', () => ({ isFileSystemAccessSupported }))

const fakeModeler = { saveXML: vi.fn(async () => ({ xml: '<xml>atual</xml>' })) }
const downloadBpmnInstead = vi.fn()

function FileLinkHarness() {
  const { isFileSystemSupported } = useFileLink({
    diagramId: 'purchase',
    diagramName: 'Compras',
    modelerRef: { current: fakeModeler as unknown as BpmnModeler },
    downloadBpmnInstead,
  })
  return <p>{isFileSystemSupported ? 'com suporte' : 'sem suporte'}</p>
}

function pressKey(init: KeyboardEventInit) {
  const keydown = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  window.dispatchEvent(keydown)
  return keydown
}

describe('useFileLink save shortcut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    saveDiagramToFile.mockResolvedValue('saved')
    isFileSystemAccessSupported.mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('saves the current diagram to its file on Ctrl+S, instead of saving the page', async () => {
    render(<FileLinkHarness />)

    const keydown = pressKey({ key: 's', ctrlKey: true })

    expect(keydown.defaultPrevented).toBe(true)
    await waitFor(() =>
      expect(saveDiagramToFile).toHaveBeenCalledWith('purchase', '<xml>atual</xml>', 'Compras'),
    )
  })

  it('also answers to Cmd+S on macOS', async () => {
    render(<FileLinkHarness />)

    pressKey({ key: 'S', metaKey: true })

    await waitFor(() => expect(saveDiagramToFile).toHaveBeenCalledOnce())
  })

  it('ignores plain typing and other shortcuts', () => {
    render(<FileLinkHarness />)

    const typing = pressKey({ key: 's' })
    pressKey({ key: 'z', ctrlKey: true })

    expect(typing.defaultPrevented).toBe(false)
    expect(saveDiagramToFile).not.toHaveBeenCalled()
  })

  it('downloads the .bpmn instead where the browser cannot write files', () => {
    isFileSystemAccessSupported.mockReturnValue(false)
    render(<FileLinkHarness />)

    const keydown = pressKey({ key: 's', ctrlKey: true })

    expect(screen.getByText('sem suporte')).toBeInTheDocument()
    expect(keydown.defaultPrevented).toBe(true)
    expect(downloadBpmnInstead).toHaveBeenCalledOnce()
    expect(saveDiagramToFile).not.toHaveBeenCalled()
  })

  it('explains a denied write permission', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    saveDiagramToFile.mockRejectedValue(new FileWritePermissionDeniedError())
    render(<FileLinkHarness />)

    pressKey({ key: 's', ctrlKey: true })

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('permissão')))
  })

  it('stops listening when the editor closes', () => {
    const { unmount } = render(<FileLinkHarness />)
    unmount()

    const keydown = pressKey({ key: 's', ctrlKey: true })

    expect(keydown.defaultPrevented).toBe(false)
    expect(saveDiagramToFile).not.toHaveBeenCalled()
  })
})
