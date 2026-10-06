import { useSpellingSuggestions } from '@/hooks/spelling/useSpellingSuggestions'

interface SpellingSuggestionListProps {
  word: string
  onChoose: (suggestion: string) => void
  onAccept: () => void
}

const OPTION_CLASS =
  'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 w-full rounded-md px-2 py-1 text-left text-sm outline-none focus-visible:ring-[3px]'

export function SpellingSuggestionList({
  word,
  onChoose,
  onAccept,
}: Readonly<SpellingSuggestionListProps>) {
  const { suggestions, isLoading } = useSpellingSuggestions(word)

  return (
    <>
      {isLoading || suggestions.length === 0 ? (
        <p className="text-muted-foreground px-2 py-1 text-xs">
          {isLoading ? 'Buscando sugestões…' : 'Sem sugestões'}
        </p>
      ) : (
        <ul aria-label={`Sugestões para ${word}`} className="flex flex-col">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onChoose(suggestion)}
                className={OPTION_CLASS}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onAccept}
        className={`${OPTION_CLASS} text-muted-foreground mt-1 border-t`}
      >
        Adicionar ao dicionário
      </button>
    </>
  )
}
