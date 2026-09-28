import type { KeyboardEvent } from 'react'

import { Input } from '@/components/ui/input'

interface DimensionInputProps {
  label: string
  value: number | undefined
  onCommit: (value: number) => void
}

function commitTypedValue(
  input: HTMLInputElement,
  onCommit: (value: number) => void,
) {
  const typedValue = Math.round(Number(input.value))
  if (input.value.trim() !== '' && typedValue > 0) onCommit(typedValue)
}

export function DimensionInput({
  label,
  value,
  onCommit,
}: Readonly<DimensionInputProps>) {
  function commitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commitTypedValue(event.currentTarget, onCommit)
  }

  return (
    <label className="flex flex-1 flex-col gap-1 text-sm">
      <span>{label}</span>
      <span className="relative">
        <Input
          size="sm"
          type="number"
          inputMode="numeric"
          min={1}
          defaultValue={value === undefined ? '' : Math.round(value)}
          placeholder="—"
          className="w-full pr-8 tabular-nums"
          onBlur={(event) => commitTypedValue(event.currentTarget, onCommit)}
          onKeyDown={commitOnEnter}
        />
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs">
          px
        </span>
      </span>
    </label>
  )
}
