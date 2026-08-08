import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'
import { useReviewStore } from './reviewStore'

export interface User {
  email: string
  name: string
  phone?: string
  avatar?: string
  petals: number
  lastLoginDate?: string
  streak: number
  lastStreakDate?: string
  referralCode: string
  referralCount: number
  usedCoupons: string[]
  reviewedProducts: string[]
  memberSince: string
  addresses: Address[]
  hasPurchased: boolean
  lastOrderValue: number
  totalSpent: number
  unlockedRewards: { id: string; name: string; minOrder: number; petalsCost: number }[]
}

export interface Address {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

interface AuthState {
  user: User | null
  signIn: (email: string, name: string, referralCodeInput?: string, phone?: string) => void
  signOut: () => void
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>) => void
  addPetals: (n: number) => void
  deductPetals: (n: number) => void
  claimDailyLogin: () => number
  addReviewReward: (productId: string) => boolean
  hasReviewed: (productId: string) => boolean
  addAddress: (addr: Omit<Address, 'id'>) => void
  updateAddress: (id: string, data: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  markPurchased: (orderValue: number) => void
  isReferredBySelf: (referrerEmail: string) => boolean
  unlockReward: (reward: { id: string; name: string; minOrder: number; petalsCost: number }) => void
  clearUnlockedReward: (rewardId: string) => void
}

// Cryptographically secure referral code generator with collision resistance
const genSecureReferralCode = (): string => {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
  return `BLOOM-${hex.slice(0, 8)}`;
};

const genId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      signIn: (email: string, name: string, referralCodeInput?: string, phone?: string) => {
        // Self-referral prevention: if referral code matches user's own code, ignore it
        if (referralCodeInput && get().user?.referralCode === referralCodeInput) {
          console.warn('Self-referral attempt blocked')
          referralCodeInput = undefined
        }
        const cleanName = name.trim() || email.split('@')[0]
        const generatedReferralCode = genSecureReferralCode()
        const existingUser = get().user
        const today = new Date().toISOString().split('T')[0]

        set({
          user: {
            email,
            name: cleanName,
            phone: phone || existingUser?.phone,
            petals: existingUser?.petals ?? 50,
            streak: existingUser?.streak ?? 0,
            referralCode: existingUser?.referralCode || generatedReferralCode,
            referralCount: existingUser?.referralCount ?? 0,
            usedCoupons: existingUser?.usedCoupons ?? [],
            reviewedProducts: existingUser?.reviewedProducts ?? [],
            memberSince: existingUser?.memberSince ?? today,
            addresses: existingUser?.addresses ?? [],
            hasPurchased: existingUser?.hasPurchased ?? false,
            lastOrderValue: existingUser?.lastOrderValue ?? 0,
            totalSpent: existingUser?.totalSpent ?? 0,
            unlockedRewards: existingUser?.unlockedRewards ?? [],
          },
        })

        // Merge guest review store purchases into account
        const guestPurchases = useReviewStore.getState().purchasedProducts
        if (Object.keys(guestPurchases).length > 0) {
          const guestEmails = Object.keys(guestPurchases)
          guestEmails.forEach((guestEmail) => {
            if (guestEmail === email) return
            const guestSlugs = guestPurchases[guestEmail] || []
            if (guestSlugs.length > 0) {
              useReviewStore.getState().recordPurchase(email, guestSlugs)
            }
          })
        }

        // Sync with backend (fire-and-forget)
        api.createUser(email, cleanName, phone, referralCodeInput).then((res: any) => {
          if (res.success && res.data) {
            set({ user: { email: res.data.email, name: res.data.name || cleanName, petals: res.data.petalsBalance ?? 50, streak: res.data.checkInStreak ?? 0, referralCode: res.data.referralCode ?? generatedReferralCode, referralCount: res.data.orderCount ?? 0, usedCoupons: res.data.usedCoupons ?? [], reviewedProducts: existingUser?.reviewedProducts ?? [], memberSince: existingUser?.memberSince ?? today, addresses: existingUser?.addresses ?? [], hasPurchased: (res.data.orderCount ?? 0) > 0, lastOrderValue: 0, totalSpent: res.data.totalSpent ?? 0, unlockedRewards: res.data.unlockedRewards ?? [] } })
          }
        })
      },
      signOut: () => set({ user: null }),
      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
        // Sync to backend
        const u = get().user
        if (u) api.updateUser(u.email, data).catch(() => {})
      },
      addPetals: (n) => {
        set((state) => ({
          user: state.user ? { ...state.user, petals: state.user.petals + n } : null,
        }))
        // Petals are managed server-side via createOrder, recordCheckIn, addReview — no direct API call
      },
      deductPetals: (n) => {
        set((state) => ({
          user: state.user ? { ...state.user, petals: Math.max(0, state.user.petals - n) } : null,
        }))
        // Petals are managed server-side — no direct API call
      },
      claimDailyLogin: () => {
        const state = get()
        if (!state.user) return 0
        const today = new Date().toISOString().split('T')[0]
        const lastDate = state.user.lastStreakDate || state.user.lastLoginDate
        if (lastDate === today) return 0
        const yesterdayObj = new Date()
        yesterdayObj.setDate(yesterdayObj.getDate() - 1)
        const yesterday = yesterdayObj.toISOString().split('T')[0]
        const isConsecutive = lastDate === yesterday
        const currentStreak = state.user.streak || 0
        const newStreak = isConsecutive ? currentStreak + 1 : 1
        const cycleDay = ((newStreak - 1) % 7) + 1
        const STREAK_REWARDS = [5, 10, 15, 20, 30, 40, 75]
        const petalsAwarded = STREAK_REWARDS[cycleDay - 1]
        const referralCode = state.user.referralCode || genSecureReferralCode()
        set({
          user: {
            ...state.user, petals: state.user.petals + petalsAwarded, streak: newStreak,
            lastLoginDate: today, lastStreakDate: today, referralCode,
            referralCount: state.user.referralCount || 0,
            usedCoupons: state.user.usedCoupons || [], reviewedProducts: state.user.reviewedProducts || [],
          },
        })
        // Sync check-in to backend
        api.recordCheckIn(state.user.email).catch(() => {})
        return petalsAwarded
      },
      addReviewReward: (productId) => {
        const state = get()
        if (!state.user) return false
        const reviewed = state.user.reviewedProducts || []
        if (reviewed.includes(productId)) return false
        const referralCode = state.user.referralCode || genSecureReferralCode()
        set({
          user: {
            ...state.user, petals: state.user.petals + 10, reviewedProducts: [...reviewed, productId],
            streak: state.user.streak || 0, referralCode, referralCount: state.user.referralCount || 0,
            usedCoupons: state.user.usedCoupons || [],
          },
        })
        // Sync review reward to backend
        /* Review petals awarded server-side via addReview endpoint */
        return true
      },
      hasReviewed: (productId) => {
        const user = get().user
        return !!(user && user.reviewedProducts && user.reviewedProducts.includes(productId))
      },
      addAddress: (addr) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: [...state.user.addresses, { ...addr, id: genId() }] }
            : null,
        })),
      updateAddress: (id, data) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: state.user.addresses.map((a) => (a.id === id ? { ...a, ...data } : a)) }
            : null,
        })),
      removeAddress: (id) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: state.user.addresses.filter((a) => a.id !== id) }
            : null,
        })),
      setDefaultAddress: (id) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: state.user.addresses.map((a) => ({ ...a, isDefault: a.id === id })) }
            : null,
        })),
      markPurchased: (orderValue: number) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, hasPurchased: true, lastOrderValue: orderValue, totalSpent: (state.user.totalSpent || 0) + orderValue }
            : null,
        }))
        // Sync to backend
        const u = get().user
        if (u) api.updateUser(u.email, { totalSpent: (u.totalSpent || 0) + orderValue, hasPurchased: true }).catch(() => {})
      },
      isReferredBySelf: (referrerEmail: string) => {
        const u = get().user
        return !!(u && u.email === referrerEmail)
      },
      unlockReward: (reward) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, unlockedRewards: [...state.user.unlockedRewards.filter(r => r.id !== reward.id), reward] }
            : null,
        }))
        // Sync to backend
        const u = get().user
        if (u) api.unlockReward(u.email, reward.id, reward.name, reward.minOrder).catch(() => {})
      },
      clearUnlockedReward: (rewardId: string) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, unlockedRewards: state.user.unlockedRewards.filter(r => r.id !== rewardId) }
            : null,
        }))
        // Sync to backend
        const u = get().user
        if (u) api.clearUnlockedReward(u.email, rewardId).catch(() => {})
      },
      syncWithBackend: async () => {
        const u = get().user
        if (!u?.email) return
        const res = await api.getUser(u.email)
        if (res.success && res.data) {
          set({ user: { ...u, petals: res.data.petalsBalance ?? u.petals, streak: res.data.checkInStreak ?? u.streak, totalSpent: res.data.totalSpent ?? u.totalSpent, usedCoupons: res.data.usedCoupons ?? u.usedCoupons, unlockedRewards: res.data.unlockedRewards ?? u.unlockedRewards } })
        }
      },
    }),
    { 
      name: 'bloomwire-auth-storage',
      version: 2,
      migrate: () => ({ user: null, isSignedUp: false, isGuest: false, usedCoupons: [], reviewedProducts: [], addresses: [], memberSince: '', hasPurchased: false, totalSpent: 0, unlockedRewards: [], streak: 0, referralCode: '', referralCount: 0 })
    }
  )
)
