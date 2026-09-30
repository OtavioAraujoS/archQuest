import { useSpellingSuggestions } from '@/hooks/spelling/useSpellingSuggestions'

interface SpellingSuggestionListProps {
  word: string
  onChoose: (suggestion: string) => void
}

export function SpellingSuggestionList({
  word,
  onChoose,
}: Readonly<SpellingSuggestionListProps>) {
  const { suggestions, isLoading } = useSpellingSuggestions(word)

  if (isLoading || suggestions.length === 0) {
    return (
      <p className="text-muted-foreground px-2 py-1 text-xs">
        {isLoading ? 'Buscando sugestões…' : 'Sem sugestões'}
      </p>
    )
  }

  return (
    <ul aria-label={`Sugestões para ${word}`} className="flex flex-col">
      {suggestions.map((suggestion) => (
        <li key={suggestion}>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChoose(suggestion)}
            className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 w-full rounded-md px-2 py-1 text-left text-sm outline-none focus-visible:ring-[3px]"
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  )
}
