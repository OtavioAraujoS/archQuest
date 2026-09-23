import { useBpmnEditor } from '@/components/editor/useBpmnEditor'

export function BpmnEditorTestHarness({ id }: Readonly<{ id?: string }>) {
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
