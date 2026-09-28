import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { fieldVariants } from '@/components/ui/field-variants'
import { cn } from '@/lib/utils'

type InputProps = Omit<ComponentProps<'input'>, 'size'> &
  VariantProps<typeof fieldVariants>

export function Input({ className, size, ...props }: Readonly<InputProps>) {
  return (
    <input
      data-slot="input"
      className={cn(fieldVariants({ size }), className)}
      {...props}
    />
  )
}
