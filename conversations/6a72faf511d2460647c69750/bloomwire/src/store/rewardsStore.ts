import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Coupon {
  code: string
  discount: number
  used: boolean
}

interface RewardsState {
  coupons: Coupon[]
  addCoupon: (couponOrCode: { code: string; discount: number } | string, discount?: number) => void
  useCoupon: (code: string) => void
  raffleTickets: number
  addTickets: (n: number) => void
  hasVisited: boolean
  setVisited: () => void
}

export const useRewards = create<RewardsState>()(
  persist(
    (set) => ({
      coupons: [
        
        { code: 'FREESHIP', discount: 0, used: false },
        { code: 'COMEBACK10', discount: 10, used: false },
      ],
      addCoupon: (couponOrCode, discount) =>
        set((state) => {
          const code = typeof couponOrCode === 'string' ? couponOrCode : couponOrCode.code
          const disc = typeof couponOrCode === 'string' ? (discount ?? 10) : couponOrCode.discount
          if (state.coupons.some((c) => c.code === code)) return state
          return { coupons: [...state.coupons, { code, discount: disc, used: false }] }
        }),
      useCoupon: (code) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, used: true } : c
          ),
        })),
      raffleTickets: 0,
      addTickets: (n) =>
        set((state) => ({
          raffleTickets: state.raffleTickets + n,
        })),
      hasVisited: false,
      setVisited: () => set({ hasVisited: true }),
    }),
    {
      name: 'bloomwire-rewards-storage',
    }
  )
)
