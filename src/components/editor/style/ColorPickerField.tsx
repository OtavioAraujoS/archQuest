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
    <label className="flex items-center gap-1 text-xs" title={title}>
      <span>{label}</span>
      <input
        type="color"
        value={value}
        className="size-6 cursor-pointer rounded border"
        onChange={(event) => onColorChange(event.target.value)}
      />
    </label>
  )
}
