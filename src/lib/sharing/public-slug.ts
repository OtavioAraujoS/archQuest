export const PUBLIC_SLUG_RANDOM_BYTES = 16

export function createPublicSlug() {
  const randomBytes = crypto.getRandomValues(
    new Uint8Array(PUBLIC_SLUG_RANDOM_BYTES),
  )
  const base64 = btoa(String.fromCodePoint(...randomBytes))
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}
