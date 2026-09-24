export const CLOUD_MAX_TEXT_BYTES = 2 * 1024 * 1024

export function exceedsCloudSizeLimit(text: string) {
  return new TextEncoder().encode(text).byteLength > CLOUD_MAX_TEXT_BYTES
}
