import { cva } from 'class-variance-authority'

export const fieldVariants = cva(
  'border-input bg-background text-foreground rounded-md border text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-2',
        default: 'h-9 px-3',
      },
    },
    defaultVariants: { size: 'default' },
  },
)
