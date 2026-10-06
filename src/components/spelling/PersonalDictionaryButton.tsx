import { BookA, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ModalDialog } from '@/components/ui/modal-dialog'
import { useUserAcceptedTerms } from '@/hooks/spelling/useUserAcceptedTerms'
import { forgetTerm } from '@/lib/spelling/accepted-terms'

export function PersonalDictionaryButton() {
  const [isOpen, setIsOpen] = useState(false)
  const terms = useUserAcceptedTerms()

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label="Dicionário pessoal"
        onClick={() => setIsOpen(true)}
      >
        <BookA />
      </Button>
      {isOpen && (
        <ModalDialog
          title="Dicionário pessoal"
          onClose={() => setIsOpen(false)}
          className="max-w-sm"
        >
          {terms.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma palavra adicionada. Use “Adicionar ao dicionário” nas
              sugestões de ortografia.
            </p>
          ) : (
            <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
              {terms.map((term) => (
                <li
                  key={term}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  {term}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${term}`}
                    onClick={() => forgetTerm(term)}
                  >
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ModalDialog>
      )}
    </>
  )
}
