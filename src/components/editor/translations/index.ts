import { PT_BR_EDITOR_STRINGS } from './pt-br-editor-strings'

type TranslationReplacements = Record<string, string>

export function translateToPortuguese(
  template: string,
  replacements: TranslationReplacements = {},
) {
  const translatedTemplate = PT_BR_EDITOR_STRINGS[template] ?? template
  return translatedTemplate.replaceAll(
    /{([^}]+)}/g,
    (placeholder, key: string) => replacements[key] ?? placeholder,
  )
}

export default {
  translate: ['value', translateToPortuguese],
}
