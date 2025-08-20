export const loadState = (key, defaultValue) => {
  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) return defaultValue
    return JSON.parse(serialized)
  } catch {
    return defaultValue
  }
}

export const saveState = (key, value) => {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch {
    // ignore errors
  }
}
