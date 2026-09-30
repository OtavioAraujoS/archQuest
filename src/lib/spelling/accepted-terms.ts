import { inPortugueseLowerCase } from '@/lib/spelling/portuguese-word-forms'

const ACCEPTED_TERMS = new Set([
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

export function isAcceptedTerm(word: string) {
  return ACCEPTED_TERMS.has(inPortugueseLowerCase(word))
}
