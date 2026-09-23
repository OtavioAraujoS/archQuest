import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockImportXML,
  mockSaveXML,
  mockSaveSVG,
  mockDestroy,
  mockZoom,
  mockDownloadBlob,
  mockExportSvg,
  mockExportPng,
  commandStackRef,
} = vi.hoisted(() => ({
  mockImportXML: vi.fn().mockResolvedValue(undefined),
  mockSaveXML: vi.fn().mockResolvedValue({ xml: '<xml>saved</xml>' }),
  mockSaveSVG: vi.fn().mockResolvedValue({ svg: '<svg>saved</svg>' }),
  mockDestroy: vi.fn(),
  mockZoom: vi.fn(),
  mockDownloadBlob: vi.fn(),
  mockExportSvg: vi.fn().mockResolvedValue(undefined),
  mockExportPng: vi.fn().mockResolvedValue(undefined),
  commandStackRef: { handler: undefined as (() => void) | undefined },
}))

vi.mock('bpmn-js/lib/Modeler', () => ({
  default: vi.fn().mockImplementation(function FakeBpmnModeler() {
    return {
      importXML: mockImportXML,
      saveXML: mockSaveXML,
      saveSVG: mockSaveSVG,
      destroy: mockDestroy,
      get: (service: string) => {
        if (service === 'canvas') return { zoom: mockZoom }
        if (service === 'eventBus') {
          return {
            on: (event: string, handler: () => void) => {
              if (event === 'commandStack.changed') commandStackRef.handler = handler
            },
          }
        }
        throw new Error(`Unexpected service: ${service}`)
      },
    }
  }),
}))

vi.mock('@/lib/export', () => ({
  downloadBlob: mockDownloadBlob,
  exportSvg: mockExportSvg,
  exportPng: mockExportPng,
}))

import { db, type DiagramRecord } from '@/lib/db'

import { useBpmnEditor } from './useBpmnEditor'

function makeRecord(overrides: Partial<DiagramRecord> = {}): DiagramRecord {
  return {
    id: 'diagram-1',
    name: 'Processo original',
    bpmnXml: '<xml>original</xml>',
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  }
}

function TestHarness({ id }: { id?: string }) {
  const {
    containerRef,
    name,
    status,
    persistName,
    handleExportBpmn,
    handleExportSvg,
    handleExportPng,
  } = useBpmnEditor(id)

  return (
    <div>
      <div data-testid="status">{status}</div>
      <input
        data-testid="name"
        value={name}
        onChange={(event) => persistName(event.target.value)}
      />
      <div ref={containerRef} />
      <button onClick={handleExportBpmn}>export-bpmn</button>
      <button onClick={handleExportSvg}>export-svg</button>
      <button onClick={handleExportPng}>export-png</button>
    </div>
  )
}

describe('useBpmnEditor', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    vi.clearAllMocks()
    commandStackRef.handler = undefined
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads the diagram from the database and marks status as ready', async () => {
    await db.diagrams.add(makeRecord())
    render(<TestHarness id="diagram-1" />)

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))

    expect(screen.getByTestId('name')).toHaveValue('Processo original')
    expect(mockImportXML).toHaveBeenCalledWith('<xml>original</xml>')
    expect(mockZoom).toHaveBeenCalledWith('fit-viewport')
  })

  it('keeps loading when the diagram does not exist', async () => {
    render(<TestHarness id="missing" />)

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('loading'))
    expect(mockImportXML).not.toHaveBeenCalled()
  })

  it('persists a renamed diagram to the database', async () => {
    await db.diagrams.add(makeRecord())
    render(<TestHarness id="diagram-1" />)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Novo nome' } })

    await waitFor(async () => {
      const updated = await db.diagrams.get('diagram-1')
      expect(updated?.name).toBe('Novo nome')
    })
  })

  it('autosaves after the diagram changes, debounced', async () => {
    await db.diagrams.add(makeRecord())
    render(<TestHarness id="diagram-1" />)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))

    vi.useFakeTimers()
    commandStackRef.handler?.()
    await vi.advanceTimersByTimeAsync(800)
    vi.useRealTimers()

    await waitFor(async () => {
      const updated = await db.diagrams.get('diagram-1')
      expect(updated?.bpmnXml).toBe('<xml>saved</xml>')
      expect(updated?.thumbnail).toBe('<svg>saved</svg>')
    })
  })

  it('exports the diagram as .bpmn via downloadBlob', async () => {
    await db.diagrams.add(makeRecord())
    render(<TestHarness id="diagram-1" />)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))

    fireEvent.click(screen.getByText('export-bpmn'))

    await waitFor(() => expect(mockDownloadBlob).toHaveBeenCalledTimes(1))
    const [blob, filename] = mockDownloadBlob.mock.calls[0]
    expect(blob.type).toBe('application/xml')
    expect(filename).toBe('Processo original.bpmn')
  })

  it('delegates SVG and PNG export to the export helpers', async () => {
    await db.diagrams.add(makeRecord())
    render(<TestHarness id="diagram-1" />)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))

    fireEvent.click(screen.getByText('export-svg'))
    fireEvent.click(screen.getByText('export-png'))

    await waitFor(() => {
      expect(mockExportSvg).toHaveBeenCalledWith(expect.anything(), 'Processo original')
      expect(mockExportPng).toHaveBeenCalledWith(expect.anything(), 'Processo original')
    })
  })

  it('destroys the modeler on unmount', async () => {
    await db.diagrams.add(makeRecord())
    const { unmount } = render(<TestHarness id="diagram-1" />)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))

    unmount()

    expect(mockDestroy).toHaveBeenCalledTimes(1)
  })
})
