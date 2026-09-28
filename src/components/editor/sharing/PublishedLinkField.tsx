import { Check, Copy } from 'lucide-react'
import { useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PublishedLinkFieldProps {
  publicUrl: string
}

export function PublishedLinkField({
  publicUrl,
}: Readonly<PublishedLinkFieldProps>) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [wasCopied, setWasCopied] = useState(false)

  async function copyPublicUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setWasCopied(true)
    } catch {
      inputRef.current?.select()
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        Link público
      </label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          ref={inputRef}
          readOnly
          value={publicUrl}
          onFocus={(event) => event.target.select()}
          className="min-w-0 flex-1"
        />
        <Button variant="outline" onClick={copyPublicUrl}>
          {wasCopied ? <Check /> : <Copy />}
          {wasCopied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
    </div>
  )
}
