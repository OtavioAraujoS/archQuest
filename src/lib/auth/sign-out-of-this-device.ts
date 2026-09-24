import { signOut } from '@/lib/auth/auth-actions'
import { forgetAccountDiagrams } from '@/lib/diagrams/forget-account-diagrams'

export async function signOutOfThisDevice() {
  await signOut()
  await forgetAccountDiagrams()
}
