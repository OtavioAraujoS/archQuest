export interface CloudConfig {
  url: string
  anonKey: string
}

export function readCloudConfig(): CloudConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  return url && anonKey ? { url, anonKey } : null
}

export function isCloudEnabled() {
  return readCloudConfig() !== null
}
