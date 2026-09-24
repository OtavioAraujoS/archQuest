import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { fieldVariants } from '@/components/ui/field-variants'
import { cn } from '@/lib/utils'

type NativeSelectProps = Omit<ComponentProps<'select'>, 'size'> &
  VariantProps<typeof fieldVariants>

export function NativeSelect({
  className,
  size,
  ...props
}: Readonly<NativeSelectProps>) {
  return (
    <select
      data-slot="native-select"
      className={cn(fieldVariants({ size }), 'cursor-pointer', className)}
      {...props}
    />
  )
}
