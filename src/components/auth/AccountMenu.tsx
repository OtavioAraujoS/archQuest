import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'

import { LoginDialog } from '@/components/auth/LoginDialog'
import { SignOutDialog } from '@/components/auth/SignOutDialog'
import { useSignOutRequest } from '@/hooks/auth/useSignOutRequest'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth/auth-store'
import { useCurrentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'

export function AccountMenu() {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const ownerId = useCurrentDiagramOwnerId()
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const { pendingDiagramCount, requestSignOut, closeSignOutDialog } =
    useSignOutRequest(ownerId)

  if (status === 'signed-out') {
    return (
      <>
        <Button variant="outline" onClick={() => setIsLoginDialogOpen(true)}>
          <LogIn /> Entrar
        </Button>
        {isLoginDialogOpen && (
          <LoginDialog onClose={() => setIsLoginDialogOpen(false)} />
        )}
      </>
    )
  }

  if (status !== 'signed-in' || !user || !ownerId) return null

  return (
    <div
      className="flex shrink-0 items-center gap-2"
      title={user.email ?? undefined}
    >
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt="" className="size-7 rounded-full" />
      )}
      <span className="max-w-40 truncate text-sm font-medium">
        {user.displayName}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Sair"
        onClick={() => void requestSignOut()}
      >
        <LogOut />
      </Button>
      {pendingDiagramCount !== null && (
        <SignOutDialog
          ownerId={ownerId}
          pendingDiagramCount={pendingDiagramCount}
          onClose={closeSignOutDialog}
        />
      )}
    </div>
  )
}
