import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const DISPLAY_HEADING_SIZES = {
  title: 'text-3xl sm:text-4xl',
  subtitle: 'text-xl',
}

type DisplayHeadingProps = ComponentProps<'h2'> & {
  as?: 'h1' | 'h2' | 'h3'
  size?: keyof typeof DISPLAY_HEADING_SIZES
}

export function DisplayHeading({
  as: HeadingElement = 'h2',
  size = 'title',
  className,
  ...props
}: Readonly<DisplayHeadingProps>) {
  return (
    <HeadingElement
      className={cn(
        'font-display font-semibold tracking-[-0.02em] text-balance',
        DISPLAY_HEADING_SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
