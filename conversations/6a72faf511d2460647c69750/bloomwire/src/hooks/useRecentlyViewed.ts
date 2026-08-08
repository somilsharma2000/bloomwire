import { useState, useEffect, useCallback } from 'react'

export interface RecentlyViewedProduct {
  slug: string
  name: string
  price: number
  image: string
  category: string
}

const STORAGE_KEY = 'bloomwire_recently_viewed'

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to load recently viewed products:', e)
    }
  }, [])

  const addProduct = useCallback((product: RecentlyViewedProduct) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.slug !== product.slug)
      const updated = [
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category || 'Handcrafted Flowers',
        },
        ...filtered,
      ].slice(0, 5)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save recently viewed product:', e)
      }

      return updated
    })
  }, [])

  return {
    recentlyViewed,
    addProduct,
    hasMinimumViewed: recentlyViewed.length >= 2,
  }
}

export default useRecentlyViewed
