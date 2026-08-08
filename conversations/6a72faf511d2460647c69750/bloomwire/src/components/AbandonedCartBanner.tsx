import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../store/cartStore'

const LAST_VISIT_KEY = 'bloomwire_last_visit_time'
const DISMISSED_KEY = 'bloomwire_abandoned_cart_dismissed'
const THIRTY_MINUTES_MS = 30 * 60 * 1000

export const AbandonedCartBanner: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const items = useCart((state) => state.items)
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0)
  const location = useLocation()

  useEffect(() => {
    // Do not show on admin, cart, or checkout routes
    if (
      location.pathname.startsWith('/admin') ||
      location.pathname === '/cart' ||
      location.pathname === '/checkout'
    ) {
      setVisible(false)
      return
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem(DISMISSED_KEY)
    if (isDismissed === 'true') {
      setVisible(false)
      return
    }

    // Do not show if cart is empty
    if (cartCount === 0) {
      setVisible(false)
      return
    }

    const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
    const now = Date.now()

    if (lastVisit) {
      const timeDiff = now - parseInt(lastVisit, 10)
      if (timeDiff >= THIRTY_MINUTES_MS) {
        setVisible(true)
      }
    } else {
      localStorage.setItem(LAST_VISIT_KEY, now.toString())
    }

    const updateVisitTime = () => {
      localStorage.setItem(LAST_VISIT_KEY, Date.now().toString())
    }

    window.addEventListener('beforeunload', updateVisitTime)
    return () => {
      window.removeEventListener('beforeunload', updateVisitTime)
    }
  }, [cartCount, location.pathname])

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true')
    setVisible(false)
  }

  if (!visible || cartCount === 0) {
    return null
  }

  return (
    <div className="bg-[#FDF2F8] border border-[#C2185B]/20 rounded-lg p-3 sm:p-4 mx-4 sm:mx-6 my-3 flex items-center justify-between gap-3 text-[#2D2D2D] shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
        <span>You left items in your cart 🌸 — Complete your order</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to="/cart"
          className="px-3.5 py-1.5 bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white text-xs font-semibold rounded-full shadow-sm hover:opacity-95 transition-all"
        >
          View Cart
        </Link>
        <button
          onClick={handleDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors focus:outline-none"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AbandonedCartBanner
