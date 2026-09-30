import { useEffect, useRef, useState, type SubmitEvent } from 'react'

import { SpellingHint } from '@/components/spelling/SpellingHint'
import { Button } from '@/components/ui/button'
import { DialogActions } from '@/components/ui/dialog-actions'
import { ErrorMessage } from '@/components/ui/error-message'
import { Input } from '@/components/ui/input'
import { ModalDialog } from '@/components/ui/modal-dialog'
import { FOLDER_NAME_MAX_LENGTH } from '@/hooks/folders/useFolder'

interface FolderNameDialogProps {
  currentName?: string
  error: string | null
  isSaving: boolean
  onCancel: () => void
  onSubmit: (typedName: string) => void
}

export function FolderNameDialog({
  currentName,
  error,
  isSaving,
  onCancel,
  onSubmit,
}: Readonly<FolderNameDialogProps>) {
  const isRenaming = currentName !== undefined
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [typedName, setTypedName] = useState(currentName ?? '')

  useEffect(() => nameInputRef.current?.select(), [])

  function replaceTypedName(correctedName: string) {
    if (nameInputRef.current) nameInputRef.current.value = correctedName
    setTypedName(correctedName)
  }

  function submitTypedName(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const folderName = new FormData(event.currentTarget).get('folderName')
    onSubmit(typeof folderName === 'string' ? folderName : '')
  }

  return (
    <ModalDialog
      title={isRenaming ? 'Renomear pasta' : 'Nova pasta'}
      onClose={onCancel}
      isDismissible={!isSaving}
      className="max-w-sm"
    >
      <form onSubmit={submitTypedName}>
        <label className="flex flex-col gap-1.5 text-sm">
          Nome da pasta
          <Input
            name="folderName"
            defaultValue={currentName}
            maxLength={FOLDER_NAME_MAX_LENGTH}
            autoComplete="off"
            ref={nameInputRef}
            onChange={(event) => setTypedName(event.target.value)}
          />
        </label>
        <SpellingHint
          text={typedName}
          onReplaceText={replaceTypedName}
          className="mt-2"
        />
        {error && <ErrorMessage className="mt-3">{error}</ErrorMessage>}
        <DialogActions>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isRenaming ? 'Salvar' : 'Criar pasta'}
          </Button>
        </DialogActions>
      </form>
    </ModalDialog>
  )
}
