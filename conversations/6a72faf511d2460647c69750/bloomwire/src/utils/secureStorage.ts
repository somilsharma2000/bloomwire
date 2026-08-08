/**
 * Hardcoded salt key for XOR cipher obfuscation.
 * Provides a lightweight layer to deter casual browser DevTools editing.
 */
const SALT_KEY = 'bloomwire-secure-storage-salt-key-2026'

/**
 * Computes a djb2 hash string (checksum) for the given input string.
 */
export function djb2Hash(data: string): string {
  let hash = 5381
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) + hash + data.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return (hash >>> 0).toString(16)
}

/**
 * Encrypts a string using XOR with salt key, then base64 encodes it.
 */
export function encrypt(data: string): string {
  if (!data) return ''
  const encoder = new TextEncoder()
  const dataBytes = encoder.encode(data)
  const saltBytes = encoder.encode(SALT_KEY)

  const xorBytes = new Uint8Array(dataBytes.length)
  for (let i = 0; i < dataBytes.length; i++) {
    xorBytes[i] = dataBytes[i] ^ saltBytes[i % saltBytes.length]
  }

  let binary = ''
  const len = xorBytes.length
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(xorBytes[i])
  }

  return btoa(binary)
}

/**
 * Decrypts base64-encoded XOR string. Returns null if invalid or tampered.
 */
export function decrypt(data: string): string | null {
  if (!data) return null
  try {
    const binary = atob(data)
    const xorBytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      xorBytes[i] = binary.charCodeAt(i)
    }

    const encoder = new TextEncoder()
    const saltBytes = encoder.encode(SALT_KEY)

    const dataBytes = new Uint8Array(xorBytes.length)
    for (let i = 0; i < xorBytes.length; i++) {
      dataBytes[i] = xorBytes[i] ^ saltBytes[i % saltBytes.length]
    }

    const decoder = new TextDecoder('utf-8', { fatal: true })
    return decoder.decode(dataBytes)
  } catch {
    return null
  }
}

/**
 * Signs data by prefixing with djb2 checksum as "hash:data".
 */
export function sign(data: string): string {
  const hash = djb2Hash(data)
  return `${hash}:${data}`
}

/**
 * Verifies signed data ("hash:data"). Returns original data if checksum matches, null if tampered.
 */
export function verify(signedData: string): string | null {
  if (!signedData) return null
  const colonIndex = signedData.indexOf(':')
  if (colonIndex === -1) return null

  const hash = signedData.slice(0, colonIndex)
  const data = signedData.slice(colonIndex + 1)

  if (djb2Hash(data) !== hash) {
    return null
  }

  return data
}

/**
 * Encrypts and signs an object before saving to localStorage.
 * Pipeline: JSON.stringify → sign → encrypt → localStorage.setItem
 */
export function secureSet(key: string, value: any): void {
  try {
    const jsonString = JSON.stringify(value)
    const signedData = sign(jsonString)
    const encryptedData = encrypt(signedData)
    localStorage.setItem(key, encryptedData)
  } catch (error) {
    console.warn(`[secureStorage] Failed to store item for key "${key}":`, error)
  }
}

/**
 * Retrieves, decrypts, and verifies stored data from localStorage.
 * Pipeline: localStorage.getItem → decrypt → verify → JSON.parse
 * Returns fallback if item is missing, corrupted, or tampered.
 */
export function secureGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback

    const decrypted = decrypt(raw)
    if (decrypted === null) {
      console.warn(`[secureStorage] Decryption failed or tampered data for key "${key}". Returning fallback.`)
      return fallback
    }

    const verified = verify(decrypted)
    if (verified === null) {
      console.warn(`[secureStorage] Checksum verification failed for key "${key}". Data tampered. Returning fallback.`)
      return fallback
    }

    return JSON.parse(verified) as T
  } catch (error) {
    console.warn(`[secureStorage] Failed to retrieve item for key "${key}":`, error)
    return fallback
  }
}
