import { useState } from 'react'

export function useGuardedChange(failureMessage: string) {
  const [changeError, setChangeError] = useState<string | null>(null)
  const [isChanging, setIsChanging] = useState(false)

  async function runGuardedChange<Result>(change: () => Promise<Result>) {
    setChangeError(null)
    setIsChanging(true)
    try {
      return await change()
    } catch {
      setChangeError(failureMessage)
      return null
    } finally {
      setIsChanging(false)
    }
  }

  return {
    changeError,
    isChanging,
    runGuardedChange,
    showChangeError: setChangeError,
    dismissChangeError: () => setChangeError(null),
  }
}
