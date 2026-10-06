import { inPortugueseLowerCase } from '@/lib/spelling/portuguese-word-forms'
import {
  readStoredValue,
  writeStoredValue,
} from '@/lib/storage/safe-local-storage'

export const ACCEPTED_TERMS_STORAGE_KEY = 'archquest.spelling.acceptedTerms'

const BUILT_IN_TERMS = new Set([
  'backlog',
  'backlogs',
  'checklist',
  'checklists',
  'dashboard',
  'dashboards',
  'email',
  'emails',
  'feedback',
  'feedbacks',
  'kanban',
  'onboarding',
  'workflow',
  'workflows',
])

const listeners = new Set<() => void>()

export function onlyTerms(stored: unknown): string[] {
  return Array.isArray(stored)
    ? stored.filter((term) => typeof term === 'string')
    : []
}

function readStoredTerms(): string[] {
  try {
    return onlyTerms(
      JSON.parse(readStoredValue(ACCEPTED_TERMS_STORAGE_KEY) ?? '[]'),
    )
  } catch {
    return []
  }
}

let userTerms = new Set(readStoredTerms())
let sortedUserTerms: readonly string[] = [...userTerms]

export function isAcceptedTerm(word: string) {
  const term = inPortugueseLowerCase(word)
  return BUILT_IN_TERMS.has(term) || userTerms.has(term)
}

export function userAcceptedTerms() {
  return sortedUserTerms
}

export function onUserTermsChange(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function replaceUserTerms(terms: Iterable<string>) {
  userTerms = new Set([...terms].map(inPortugueseLowerCase))
  sortedUserTerms = [...userTerms].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  writeStoredValue(ACCEPTED_TERMS_STORAGE_KEY, JSON.stringify(sortedUserTerms))
  listeners.forEach((listener) => listener())
}

export function acceptTerm(word: string) {
  replaceUserTerms([...userTerms, word])
}

export function forgetTerm(term: string) {
  replaceUserTerms([...userTerms].filter((userTerm) => userTerm !== term))
}
