const EMPTY_EXPORT_SIZE = 'width="20" height="20"'
const XML_DECLARATION = /<\?xml/g

export function needsNewThumbnail(thumbnail: string | undefined) {
  if (!thumbnail) return true
  const hasDuplicatedDeclaration =
    (thumbnail.match(XML_DECLARATION)?.length ?? 0) > 1
  return thumbnail.includes(EMPTY_EXPORT_SIZE) || hasDuplicatedDeclaration
}
