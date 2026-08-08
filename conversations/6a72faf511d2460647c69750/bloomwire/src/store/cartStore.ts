import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useToastStore } from './toastStore'

export interface CartItem {
  slug: string
  name: string
  price: number
  image: string
  qty: number
}

interface CartState {
  items: CartItem[]
  giftWrap: boolean
  addItem: (item: { slug: string; name: string; price: number; image: string; qty?: number }) => void
  removeItem: (slug: string) => void
  updateQty: (slug: string, qty: number) => void
  toggleGiftWrap: () => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      giftWrap: false,
      addItem: (item) => {
        set((state) => {
          const qtyToAdd = item.qty ?? 1
          const existingIndex = state.items.findIndex((i) => i.slug === item.slug)
          if (existingIndex > -1) {
            const updated = [...state.items]
            updated[existingIndex] = {
              ...updated[existingIndex],
              qty: updated[existingIndex].qty + qtyToAdd,
            }
            return { items: updated }
          }
          return {
            items: [
              ...state.items,
              {
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                qty: qtyToAdd,
              },
            ],
          }
        })
        useToastStore.getState().showToast('✓ Added to cart', 'cart')
      },
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),
      updateQty: (slug, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        })),
      toggleGiftWrap: () => set((state) => ({ giftWrap: !state.giftWrap })),
      clear: () => set({ items: [], giftWrap: false }),
    }),
    {
      name: 'bloomwire-cart-storage',
    }
  )
)
