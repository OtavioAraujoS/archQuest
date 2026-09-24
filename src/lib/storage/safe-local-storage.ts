export function readStoredValue(key: string) {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Failed to read "${key}" from local storage`, error)
    return null
  }
}

export function writeStoredValue(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Failed to write "${key}" to local storage`, error)
    return false
  }
}
