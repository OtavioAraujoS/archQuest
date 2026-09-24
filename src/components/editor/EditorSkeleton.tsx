export function EditorSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Abrindo o editor"
      className="flex h-svh flex-col"
    >
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="bg-muted size-7 animate-pulse rounded-md" />
        <div className="bg-muted h-5 w-48 animate-pulse rounded-md" />
        <div className="bg-muted ml-auto h-8 w-24 animate-pulse rounded-md" />
      </div>
      <div className="relative flex-1">
        <div className="bg-muted absolute top-5 left-5 h-72 w-12 animate-pulse rounded-lg" />
      </div>
    </div>
  )
}
