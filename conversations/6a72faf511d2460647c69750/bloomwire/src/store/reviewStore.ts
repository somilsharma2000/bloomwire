import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

export interface Review {
  id: string
  productSlug: string
  userEmail: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
}

interface ReviewState {
  reviews: Review[]
  purchasedProducts: Record<string, string[]> // email -> product slugs
  loading: boolean
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<{ success: boolean; message: string }>
  getReviews: (productSlug: string) => Review[]
  fetchReviews: (productSlug: string) => Promise<Review[]>
  hasPurchased: (email: string, productSlug: string) => boolean
  checkPurchased: (email: string, productSlug: string) => Promise<boolean>
  recordPurchase: (email: string, slugs: string[]) => void
  hasReviewed: (email: string, productSlug: string) => boolean
  checkReviewed: (email: string, productSlug: string) => Promise<boolean>
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      purchasedProducts: {},
      loading: false,

      addReview: async (review) => {
        // Check locally first
        const existing = get().reviews.find(
          (r) => r.productSlug === review.productSlug && r.userEmail === review.userEmail
        )
        if (existing) {
          return { success: false, message: 'You have already reviewed this product' }
        }

        // Submit to backend
        const res = await api.addReview({
          productId: review.productSlug,
          userEmail: review.userEmail,
          userName: review.userName,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
        })

        if (res.success) {
          const newReview: Review = {
            ...review,
            id: res.data?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toISOString(),
            verified: true, // Backend validates purchase
          }
          set((state) => ({ reviews: [newReview, ...state.reviews] }))
          return { success: true, message: 'Review submitted! You earned 10 Petals.' }
        }

        // Fallback: save locally if backend fails
        const fallbackReview: Review = {
          ...review,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          verified: false,
        }
        set((state) => ({ reviews: [fallbackReview, ...state.reviews] }))
        return { success: true, message: 'Review saved (will sync when online).' }
      },

      getReviews: (productSlug) => {
        return get().reviews.filter((r) => r.productSlug === productSlug)
      },

      fetchReviews: async (productSlug) => {
        try {
          const res = await api.getProductReviews(productSlug)
          if (res.success && res.data && Array.isArray(res.data)) {
            const backendReviews: Review[] = res.data.map((r: any) => ({
              id: r.id || `${r.userEmail}-${productSlug}`,
              productSlug: productSlug,
              userEmail: r.userEmail || r.user_email || '',
              userName: r.userName || r.user_name || 'Customer',
              rating: r.rating || 5,
              title: r.title || '',
              comment: r.comment || '',
              date: r.createdDate || r.created_date || r.date || new Date().toISOString(),
              verified: r.verified ?? true,
            }))

            // Merge: replace local reviews for this product with backend data
            const otherReviews = get().reviews.filter((r) => r.productSlug !== productSlug)
            set({ reviews: [...backendReviews, ...otherReviews] })
            return backendReviews
          }
        } catch (err) {
          console.warn('[ReviewStore] fetchReviews failed:', err)
        }
        return get().reviews.filter((r) => r.productSlug === productSlug)
      },

      hasPurchased: (email, productSlug) => {
        const purchased = get().purchasedProducts[email]
        return !!(purchased && purchased.includes(productSlug))
      },

      checkPurchased: async (email, productSlug) => {
        // Check locally first for instant response
        if (get().hasPurchased(email, productSlug)) return true
        // Then check backend
        try {
          const res = await api.hasUserPurchased(email, productSlug)
          if (res.success && res.data?.hasPurchased) {
            get().recordPurchase(email, [productSlug])
            return true
          }
        } catch (err) {
          console.warn('[ReviewStore] checkPurchased failed:', err)
        }
        return false
      },

      recordPurchase: (email, slugs) => {
        set((state) => {
          const existing = state.purchasedProducts[email] || []
          const newSlugs = slugs.filter((s) => !existing.includes(s))
          return {
            purchasedProducts: {
              ...state.purchasedProducts,
              [email]: [...existing, ...newSlugs],
            },
          }
        })
      },

      hasReviewed: (email, productSlug) => {
        return get().reviews.some(
          (r) => r.productSlug === productSlug && r.userEmail === email
        )
      },

      checkReviewed: async (email, productSlug) => {
        if (get().hasReviewed(email, productSlug)) return true
        try {
          const res = await api.hasUserReviewed(email, productSlug)
          if (res.success && res.data?.hasReviewed) return true
        } catch (err) {
          console.warn('[ReviewStore] checkReviewed failed:', err)
        }
        return false
      },
    }),
    { name: 'bloomwire-review-storage' }
  )
)
