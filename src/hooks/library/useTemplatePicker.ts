import { useCallback, useState } from 'react'

export function useTemplatePicker() {
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const openTemplatePicker = useCallback(
    () => setIsTemplatePickerOpen(true),
    [],
  )
  const closeTemplatePicker = useCallback(
    () => setIsTemplatePickerOpen(false),
    [],
  )
  return { isTemplatePickerOpen, openTemplatePicker, closeTemplatePicker }
}
