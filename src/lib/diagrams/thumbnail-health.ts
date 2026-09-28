const EMPTY_EXPORT_SIZE = 'width="20" height="20"'

export function needsNewThumbnail(thumbnail: string | undefined) {
  return !thumbnail || thumbnail.includes(EMPTY_EXPORT_SIZE)
}
