import { persist, type PersistOptions, type PersistStorage, type StorageValue } from 'zustand/middleware'
import type { StateCreator, StoreMutatorIdentifier } from 'zustand/vanilla'
import { secureGet, secureSet } from './secureStorage'

/**
 * Creates a custom encrypted PersistStorage adapter using secureSet and secureGet.
 */
function createSecureStorage<S>(): PersistStorage<S> {
  return {
    getItem: (name: string): StorageValue<S> | null => {
      try {
        const raw = localStorage.getItem(name)
        if (raw === null) {
          return null
        }

        const data = secureGet<StorageValue<S> | null>(name, null)
        if (data === null) {
          console.warn(
            `[securePersist] Tamper detected or invalid storage for key "${name}". Resetting to default state.`
          )
          return null
        }

        return data
      } catch (error) {
        console.warn(
          `[securePersist] Error loading storage key "${name}". Resetting to default state.`,
          error
        )
        return null
      }
    },
    setItem: (name: string, value: StorageValue<S>): void => {
      try {
        secureSet(name, value)
      } catch (error) {
        console.warn(`[securePersist] Error setting storage key "${name}":`, error)
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name)
      } catch (error) {
        console.warn(`[securePersist] Error removing storage key "${name}":`, error)
      }
    },
  }
}

/**
 * Zustand middleware wrapper that replaces plain JSON storage with encrypted storage and tamper detection.
 * Prepends 'bloomwire-secure-' to storage key names.
 */
export function createSecurePersist<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  U = T
>(
  initializer: StateCreator<T, [...Mps, ['zustand/persist', unknown]], Mcs>,
  options: PersistOptions<T, U>
) {
  const prefix = 'bloomwire-secure-'
  const name = options.name.startsWith(prefix) ? options.name : `${prefix}${options.name}`

  const secureStorage = createSecureStorage<U>()

  return persist(initializer, {
    ...options,
    name,
    storage: secureStorage,
  })
}
