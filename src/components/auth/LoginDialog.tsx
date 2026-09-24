import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton'
import { MagicLinkForm } from '@/components/auth/MagicLinkForm'
import { ModalDialog } from '@/components/ui/modal-dialog'

interface LoginDialogProps {
  onClose: () => void
}

export function LoginDialog({ onClose }: Readonly<LoginDialogProps>) {
  return (
    <ModalDialog
      title="Entrar no archQuest"
      onClose={onClose}
      className="max-w-sm"
    >
      <p className="text-muted-foreground mb-4 text-sm">
        Entre para salvar seus diagramas na nuvem e compartilhá-los por link.
      </p>
      <GitHubSignInButton />
      <div className="text-muted-foreground my-4 flex items-center gap-3 text-xs">
        <span className="bg-border h-px flex-1" />
        <span>ou</span>
        <span className="bg-border h-px flex-1" />
      </div>
      <MagicLinkForm />
    </ModalDialog>
  )
}
