import { useSyncExternalStore } from 'react'

import {
  onUserTermsChange,
  userAcceptedTerms,
} from '@/lib/spelling/accepted-terms'

export function useUserAcceptedTerms() {
  return useSyncExternalStore(onUserTermsChange, userAcceptedTerms)
}
