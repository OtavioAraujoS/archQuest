import { Bold, Italic, type LucideIcon, Underline } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { TextStyle } from '../text-style'

type TextFormat = 'bold' | 'italic' | 'underline'

const TEXT_FORMAT_BUTTONS = [
  { format: 'bold', label: 'Negrito', Icon: Bold },
  { format: 'italic', label: 'Itálico', Icon: Italic },
  { format: 'underline', label: 'Sublinhado', Icon: Underline },
] as const satisfies readonly {
  format: TextFormat
  label: string
  Icon: LucideIcon
}[]

interface TextFormatButtonsProps {
  textStyle: TextStyle
  onTextStyleChange: (change: Partial<TextStyle>) => void
}

export function TextFormatButtons({
  textStyle,
  onTextStyleChange,
}: Readonly<TextFormatButtonsProps>) {
  return (
    <div className="flex items-center gap-1 border-l pl-2">
      {TEXT_FORMAT_BUTTONS.map(({ format, label, Icon }) => (
        <Button
          key={format}
          variant={textStyle[format] ? 'secondary' : 'ghost'}
          size="icon"
          aria-label={label}
          aria-pressed={textStyle[format]}
          onClick={() => onTextStyleChange({ [format]: !textStyle[format] })}
        >
          <Icon />
        </Button>
      ))}
    </div>
  )
}
