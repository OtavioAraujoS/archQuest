import type { DiagramRecord } from '@/lib/db'

interface GuestDiagramChecklistProps {
  guestDiagrams: DiagramRecord[]
  selectedDiagramIds: ReadonlySet<string>
  onToggle: (diagramId: string) => void
}

export function GuestDiagramChecklist({
  guestDiagrams,
  selectedDiagramIds,
  onToggle,
}: Readonly<GuestDiagramChecklistProps>) {
  return (
    <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border p-1">
      {guestDiagrams.map((diagram) => (
        <li key={diagram.id}>
          <label className="hover:bg-muted grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded px-2 py-1.5">
            <input
              type="checkbox"
              checked={selectedDiagramIds.has(diagram.id)}
              onChange={() => onToggle(diagram.id)}
              className="accent-primary row-span-2 size-4"
            />
            <span className="truncate text-sm font-medium">{diagram.name}</span>
            <span className="text-muted-foreground text-xs">
              Editado em {new Date(diagram.updatedAt).toLocaleString()}
            </span>
          </label>
        </li>
      ))}
    </ul>
  )
}
