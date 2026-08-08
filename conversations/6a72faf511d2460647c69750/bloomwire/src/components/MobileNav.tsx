import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../store/cartStore'

export const MobileNav: React.FC = () => {
  const location = useLocation()
  const items = useCart((state) => state.items)
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0)

  // Hide on admin route
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  const isHomeActive = location.pathname === '/'
  const isShopActive = location.pathname === '/shop' || location.pathname.startsWith('/product/')
  const isCartActive = location.pathname === '/cart' || location.pathname === '/checkout'
  const isAccountActive =
    location.pathname === '/profile' ||
    location.pathname === '/orders' ||
    location.pathname === '/addresses' ||
    location.pathname === '/my-gallery' ||
    location.pathname === '/login'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden border-t border-gray-100 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around h-[56px]">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium transition-colors ${
            isHomeActive ? 'text-[#C2185B]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium transition-colors ${
            isShopActive ? 'text-[#C2185B]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Shop</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium transition-colors relative ${
            isCartActive ? 'text-[#C2185B]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#C2185B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>

        {/* Account */}
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium transition-colors ${
            isAccountActive ? 'text-[#C2185B]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Account</span>
        </Link>
      </div>
    </nav>
  )
}

export default MobileNav
