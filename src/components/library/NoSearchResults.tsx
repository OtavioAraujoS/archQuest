import { Button } from '@/components/ui/button'

interface NoSearchResultsProps {
  searchQuery: string
  onClearSearch: () => void
}

export function NoSearchResults({
  searchQuery,
  onClearSearch,
}: Readonly<NoSearchResultsProps>) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border px-6 py-10 text-center">
      <p className="text-sm">
        Nenhum diagrama encontrado para “{searchQuery.trim()}”.
      </p>
      <Button variant="outline" size="sm" onClick={onClearSearch}>
        Limpar busca
      </Button>
    </div>
  )
}
