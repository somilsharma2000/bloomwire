import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WatchlistItem {
  slug: string
  name: string
  price: number
  image: string
}

interface WatchlistState {
  items: WatchlistItem[]
  toggle: (item: WatchlistItem) => void
  remove: (slug: string) => void
  isInList: (slug: string) => boolean
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.slug === item.slug)
          if (exists) {
            return { items: state.items.filter((i) => i.slug !== item.slug) }
          }
          return { items: [...state.items, item] }
        }),
      remove: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),
      isInList: (slug) => get().items.some((i) => i.slug === slug),
    }),
    {
      name: 'bloomwire-watchlist-storage',
    }
  )
)
