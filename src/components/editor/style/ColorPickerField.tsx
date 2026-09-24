interface ColorPickerFieldProps {
  label: string
  title: string
  value?: string
  onColorChange: (color: string) => void
}

export function ColorPickerField({
  label,
  title,
  value,
  onColorChange,
}: Readonly<ColorPickerFieldProps>) {
  return (
    <label
      className="flex items-center justify-between gap-3 text-sm"
      title={title}
    >
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-muted-foreground font-mono text-xs uppercase tabular-nums">
          {value}
        </span>
        <input
          type="color"
          value={value}
          className="focus-visible:ring-ring/50 size-7 cursor-pointer rounded-md border bg-transparent p-0.5 outline-none focus-visible:ring-[3px]"
          onChange={(event) => onColorChange(event.target.value)}
        />
      </span>
    </label>
  )
}
