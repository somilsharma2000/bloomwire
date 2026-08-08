import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '../store/cartStore'
import { useAuth } from '../store/authStore'
import { useWatchlist } from '../store/watchlistStore'
import { products } from '../data/products'
import ToastContainer from './Toast'
import {
  CartIcon,
  PetalIcon,
  UserIcon,
  SearchIcon,
  BookmarkIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  ThreadsIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  SparkleIcon,
  CloseIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from './Icons'
import AuthModal from './AuthModal'
import EntryPopup from './EntryPopup'
import CookieConsent from './CookieConsent'
import MobileNav from './MobileNav'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  
  // Search Modal state
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mini Cart dropdown state
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  
  // Back to Top button state
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Floating WhatsApp Support Popup State
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const [expandedOption, setExpandedOption] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<{ text: string; fromBot: boolean }[]>([])

  const [claimToast, setClaimToast] = useState<string | null>(null)

  // Refs for click outside handling
  const chatWidgetRef = useRef<HTMLDivElement>(null)
  const miniCartRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const cartItems = useCart((s) => s.items)
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0)
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const updateCartQty = useCart((s) => s.updateQty)
  const removeCartItem = useCart((s) => s.removeItem)

  const watchlistCount = useWatchlist((s) => s.items.length)
  const user = useAuth((s) => s.user)
  const claimDailyLogin = useAuth((s) => s.claimDailyLogin)
  const location = useLocation()
  const navigate = useNavigate()

  const isCheckout = location.pathname === '/checkout'
  const today = new Date().toISOString().split('T')[0]
  const showClaimButton = !!user && user.lastLoginDate !== today

  // Track header scroll state & back to top threshold
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus, search, mini-cart, chat on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setMiniCartOpen(false)
    setWhatsappOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Focus search input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  // Listen to ESC key to close search modal, mini-cart, and chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false)
        if (miniCartOpen) setMiniCartOpen(false)
        if (whatsappOpen) setWhatsappOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, miniCartOpen, whatsappOpen])

  // Click outside handling for WhatsApp chat and Mini Cart
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (whatsappOpen && chatWidgetRef.current && !chatWidgetRef.current.contains(target)) {
        // Close chat if clicked outside
        setWhatsappOpen(false)
      }
      if (miniCartOpen && miniCartRef.current && !miniCartRef.current.contains(target)) {
        // Close mini-cart if clicked outside
        setMiniCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [whatsappOpen, miniCartOpen])

  const handleClaimDaily = () => {
    const success = claimDailyLogin()
    if (success) {
      setClaimToast('🎉 Daily Petals Claimed!')
      setTimeout(() => setClaimToast(null), 4000)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/creators', label: 'Creators' },
    { to: '/rewards', label: 'Rewards' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const quickHelpOptions = [
    {
      id: 'track',
      title: 'Track my order',
      response: 'Please share your order ID and we will track it for you!',
    },
    {
      id: 'product',
      title: 'Product questions',
      response: 'Ask us anything about our handcrafted flowers!',
    },
    {
      id: 'petals',
      title: 'Petals and Rewards',
      response: 'Questions about your Petals balance or raffle tickets?',
    },
    {
      id: 'wrapping',
      title: 'Gift wrapping',
      response: 'We offer premium gift wrapping for just 199 rupees!',
    },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const userMsg = chatMessage.trim()
      setChatMessages((prev) => [...prev, { text: userMsg, fromBot: false }])
      setChatMessage('')
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            text: 'Thanks for your message! For faster help, chat with us on WhatsApp — just click the button below. 🌸',
            fromBot: true,
          },
        ])
      }, 800)
    }
  }

  const toggleOption = (id: string) => {
    setExpandedOption(expandedOption === id ? null : id)
  }

  // Filter products for Search Modal
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.price > 0 &&
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))))
      )
    : []

  const handleSearchResultClick = (slug: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    navigate(`/product/${slug}`)
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWhatsAppButtonClick = () => {
    if (isCheckout) {
      window.open('https://wa.me/message/VT4TW64X2EJKH1', '_blank')
    } else {
      setWhatsappOpen(!whatsappOpen)
    }
  }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-bloom-rose focus:text-white focus:rounded-lg">Skip to content</a>
    <div className="min-h-screen flex flex-col relative bg-[#FFF8F3] text-[#2d2418] selection:bg-bloom-rose selection:text-white">
      {/* Top Announcement Bar */}
      <div className="relative z-50 bg-gradient-to-r from-bloom-wine via-bloom-rose to-bloom-wine text-white text-center text-xs py-2 px-4 tracking-wide font-medium shadow-md">
        Free shipping on orders over ₹499 — Handcrafted with love in India
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 shadow-md backdrop-blur-xl border-b border-[#2d2418]/10'
            : 'bg-transparent border-b border-[#2d2418]/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Brand / Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-serif font-bold gradient-text-cool group-hover:scale-105 transition-transform duration-300 tracking-tight">
                Bloomwire
              </span>
            </Link>

            {/* Centered Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-all relative py-1 ${
                      isActive ? 'text-bloom-rose font-semibold' : 'text-[#6b5d4f] hover:text-[#2d2418]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-bloom-rose to-bloom-gold rounded-full shadow-[0_0_8px_#ff4081]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 relative">
              {/* Claim Daily Petals Button */}
              {showClaimButton && (
                <button
                  onClick={handleClaimDaily}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-bloom-rose via-purple-600 to-bloom-wine text-white text-xs font-bold shadow-lg neon-glow hover:scale-105 transition-all duration-200"
                  title="Claim your daily streak petals bonus!"
                >
                  <SparkleIcon size={14} className="text-bloom-gold animate-spin" />
                  <span className="hidden sm:inline">Harvest Daily Petals</span>
                  <span className="sm:hidden">Harvest</span>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bloom-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-bloom-gold"></span>
                  </span>
                </button>
              )}

              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#6b5d4f] hover:text-bloom-rose transition-colors duration-200 rounded-full hover:bg-[#2d2418]/5"
                aria-label="Search"
                title="Search products"
              >
                <SearchIcon size={20} />
              </button>

              {/* Watchlist / Bookmark Icon */}
              <Link
                to="/wishlist"
                className="relative p-2 text-[#6b5d4f] hover:text-bloom-rose transition-colors duration-200 rounded-full hover:bg-[#2d2418]/5 group"
                title="My Wishlist"
              >
                <BookmarkIcon size={20} className="group-hover:scale-110 transition-transform" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bloom-neon text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {watchlistCount}
                  </span>
                )}
              </Link>

              {/* Rewards Pill */}
              <Link
                to="/rewards"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium transition-all hover:neon-border hover:scale-105"
                title="Your Petals balance"
              >
                <PetalIcon size={16} className="text-bloom-gold animate-pulse" />
                <span className="text-bloom-gold tracking-wide">{user ? user.petals : 0} Petals</span>
              </Link>

              {/* User / Auth State */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="text-xs text-[#6b5d4f] hover:text-[#2d2418] transition-colors max-w-[100px] truncate hidden xl:inline"
                  >
                    Hi, {user.name.split(' ')[0]}
                  </Link>
                  <Link
                    to="/profile"
                    className="p-2 text-[#6b5d4f] hover:text-bloom-rose transition-colors duration-200 rounded-full hover:bg-[#2d2418]/5 group"
                    title="My Profile"
                  >
                    <UserIcon size={20} className="group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="p-2 text-[#6b5d4f] hover:text-bloom-rose transition-colors duration-200 rounded-full hover:bg-[#2d2418]/5"
                  title="Sign In / Register"
                >
                  <UserIcon size={20} />
                </button>
              )}

              {/* Mini Cart Toggle Button */}
              <div className="relative" ref={miniCartRef}>
                <button
                  onClick={() => setMiniCartOpen(!miniCartOpen)}
                  className="relative p-2 text-[#6b5d4f] hover:text-bloom-rose transition-colors duration-200 rounded-full hover:bg-[#2d2418]/5 group"
                  aria-label="Your Collection"
                  title="Mini Cart Preview"
                >
                  <CartIcon className="group-hover:scale-110 transition-transform" size={21} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-bloom-rose to-bloom-neon text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in neon-glow">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mini-Cart Preview Dropdown */}
                {miniCartOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#2d2418]/15 rounded-2xl shadow-2xl p-4 z-[95] animate-scale-in text-[#2d2418]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#2d2418]/10 mb-3">
                      <div className="flex items-center gap-2">
                        <CartIcon size={18} className="text-bloom-neon" />
                        <h3 className="font-serif font-bold text-sm">Your Collection</h3>
                        <span className="text-xs text-[#8a7a6a]">({cartCount} items)</span>
                      </div>
                      <button
                        onClick={() => setMiniCartOpen(false)}
                        className="p-1 text-[#8a7a6a] hover:text-[#2d2418] rounded-full hover:bg-[#2d2418]/10 transition"
                        aria-label="Close cart preview"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="py-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#FFF8F3] border border-[#2d2418]/10 flex items-center justify-center mx-auto text-[#8a7a6a]">
                          <CartIcon size={24} />
                        </div>
                        <p className="text-sm font-medium text-[#6b5d4f]">Your cart is empty.</p>
                        <button
                          onClick={() => {
                            setMiniCartOpen(false)
                            navigate('/shop')
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-semibold hover:scale-105 transition shadow-md"
                        >
                          Shop Now <ArrowRightIcon size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Cart Items List */}
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                          {cartItems.map((item) => (
                            <div key={item.slug} className="flex items-center gap-3 p-2 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/10 hover:bg-white transition">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover bg-[#FFF8F3] flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/product/${item.slug}`}
                                  onClick={() => setMiniCartOpen(false)}
                                  className="text-xs font-medium text-[#2d2418] hover:text-bloom-rose truncate block"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-[11px] text-[#8a7a6a]">₹{item.price} each</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={() => updateCartQty(item.slug, item.qty - 1)}
                                    className="w-5 h-5 rounded bg-[#2d2418]/10 hover:bg-[#2d2418]/20 flex items-center justify-center text-xs text-[#2d2418]"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-medium">{item.qty}</span>
                                  <button
                                    onClick={() => updateCartQty(item.slug, item.qty + 1)}
                                    className="w-5 h-5 rounded bg-[#2d2418]/10 hover:bg-[#2d2418]/20 flex items-center justify-center text-xs text-[#2d2418]"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-bold">₹{item.price * item.qty}</p>
                                <button
                                  onClick={() => removeCartItem(item.slug)}
                                  className="text-[10px] text-red-400 hover:underline mt-1"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Subtotal & Action Buttons */}
                        <div className="pt-3 border-t border-[#2d2418]/10 mt-3 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#8a7a6a]">Subtotal</span>
                            <span className="font-bold text-[#2d2418]">₹{cartSubtotal}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setMiniCartOpen(false)
                                navigate('/cart')
                              }}
                              className="w-full py-2.5 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/15 text-xs font-semibold text-[#2d2418] hover:bg-white transition text-center"
                            >
                              View Cart
                            </button>
                            <button
                              onClick={() => {
                                setMiniCartOpen(false)
                                navigate('/checkout')
                              }}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-bloom-rose to-bloom-wine text-xs font-semibold text-white hover:scale-105 transition text-center shadow-md neon-glow"
                            >
                              Checkout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                className="lg:hidden p-2 text-[#6b5d4f] hover:text-[#2d2418] rounded-lg hover:bg-[#2d2418]/5 transition"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Mobile Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {menuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-[#2d2418]/10 p-4 space-y-3 animate-fade-down text-[#2d2418]">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive ? 'bg-bloom-rose/20 text-bloom-rose font-medium' : 'text-[#6b5d4f] hover:bg-[#2d2418]/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* Claim Daily Petals Button for Mobile */}
              {showClaimButton && (
                <div className="pt-2 border-t border-[#2d2418]/10">
                  <button
                    onClick={() => {
                      handleClaimDaily()
                      setMenuOpen(false)
                    }}
                    className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-bloom-rose via-purple-600 to-bloom-wine text-white text-xs font-bold shadow-md hover:scale-[1.02] transition"
                  >
                    <div className="flex items-center gap-2">
                      <SparkleIcon size={16} className="text-bloom-gold animate-spin" />
                      <span>Harvest Daily Petals</span>
                    </div>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bloom-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bloom-gold"></span>
                    </span>
                  </button>
                </div>
              )}

              {/* User / Rewards status in Mobile drawer */}
              <div className="pt-2 border-t border-[#2d2418]/10 flex flex-col gap-2">
                <Link
                  to="/rewards"
                  className="flex items-center justify-between px-4 py-2 rounded-xl glass text-xs font-medium text-bloom-gold"
                >
                  <span className="flex items-center gap-1.5">
                    <PetalIcon size={16} /> Petals Balance
                  </span>
                  <span className="font-bold">{user ? user.petals : 0}</span>
                </Link>

                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-[#8a7a6a]">Account Status</span>
                  {user ? (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1.5 text-xs text-bloom-neon hover:underline"
                    >
                      <UserIcon size={16} /> My Profile
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1.5 text-xs text-bloom-neon hover:underline"
                    >
                      <UserIcon size={16} /> Sign In / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* SEARCH MODAL OVERLAY */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#2d2418]/50 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12 overflow-y-auto"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="max-w-2xl w-full bg-white border border-[#2d2418]/15 rounded-3xl p-6 shadow-2xl relative animate-scale-in text-[#2d2418]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Input */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#2d2418]/10">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search handcrafted flowers, bouquets, keychains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FFF8F3] border border-[#2d2418]/15 text-[#2d2418] placeholder-[#a0918a] focus:border-bloom-rose text-sm focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7a6a] hover:text-[#2d2418] p-1 text-xs"
                    aria-label="Clear search query"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-[#8a7a6a] hover:text-[#2d2418] hover:bg-[#2d2418]/10 rounded-full transition"
                aria-label="Close search"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Results Grid */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {!searchQuery.trim() ? (
                <div className="py-8 text-center text-[#8a7a6a] text-xs sm:text-sm space-y-2">
                  <p>Type to search by bloom name, category, or keyword.</p>
                  <p className="text-[#a0918a] text-xs">Popular: Roses, Tulips, Daisies, Keychains, DIY Kits</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 text-center text-[#8a7a6a] space-y-2">
                  <p className="text-base font-serif text-[#6b5d4f]">No blooms found. Try a different search.</p>
                  <p className="text-xs text-[#a0918a]">Check for spelling or try searching for broad categories like 'Bouquets' or 'Keychains'.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.slug}
                      onClick={() => handleSearchResultClick(product.slug)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF8F3] border border-[#2d2418]/10 hover:border-bloom-rose/50 hover:bg-white transition cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#FFF8F3] flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-bloom-neon uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h4 className="text-sm font-medium text-[#2d2418] group-hover:text-bloom-rose transition truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-bold text-[#6b5d4f] mt-1">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content — keyed to force clean remount on route change */}
      <main id="main-content" className="flex-1 relative z-10" key={location.pathname}>
        <Outlet />
      </main>

      {/* Toast Notification */}
      {claimToast && (
        <div className="fixed bottom-24 right-6 z-[100] bg-white border border-bloom-gold/50 text-[#2d2418] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <PetalIcon size={22} className="text-bloom-gold" />
          <span className="text-sm font-medium">{claimToast}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-[#F5EDE6] border-t border-[#2d2418]/10 mt-20 text-[#2d2418]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Description & Socials */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-serif font-bold gradient-text">Bloomwire™</h3>
              <p className="text-sm text-[#8a7a6a] max-w-sm leading-relaxed">
                Handcrafted pipe cleaner flowers crafted to last for years. Dark aesthetic, Gen Z energy, and eternal flowers individually twisted by passionate artisans in India.
              </p>

              {/* Social Media Links */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/bloomwire._"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/10 flex items-center justify-center text-[#8a7a6a] hover:text-bloom-rose hover:border-bloom-rose/50 hover:scale-110 transition-all duration-200"
                  aria-label="Instagram @bloomwire_"
                  title="Instagram @bloomwire_"
                >
                  <InstagramIcon size={18} />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61592187074281"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/10 flex items-center justify-center text-[#8a7a6a] hover:text-bloom-rose hover:border-bloom-rose/50 hover:scale-110 transition-all duration-200"
                  aria-label="Facebook Bloomwire"
                  title="Facebook Bloomwire"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href="https://www.threads.com/@bloomwire2000"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/10 flex items-center justify-center text-[#8a7a6a] hover:text-bloom-rose hover:border-bloom-rose/50 hover:scale-110 transition-all duration-200"
                  aria-label="Threads @bloomwire2000"
                  title="Threads @bloomwire2000"
                >
                  <ThreadsIcon size={18} />
                </a>
                <a
                  href="https://wa.me/message/VT4TW64X2EJKH1"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/10 flex items-center justify-center text-[#8a7a6a] hover:text-bloom-rose hover:border-bloom-rose/50 hover:scale-110 transition-all duration-200"
                  aria-label="WhatsApp Bloomwire"
                  title="WhatsApp Bloomwire"
                >
                  <WhatsAppIcon size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#2d2418] mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-[#8a7a6a]">
                <li><Link to="/shop" className="hover:text-bloom-rose transition-colors">Shop Collection</Link></li>
                <li><Link to="/gallery" className="hover:text-bloom-rose transition-colors">Visual Gallery</Link></li>
                <li><Link to="/my-gallery" className="hover:text-bloom-rose transition-colors">My Gallery</Link></li>
                <li><Link to="/creators" className="hover:text-bloom-rose transition-colors">Creator Spotlights</Link></li>
                <li><Link to="/rewards" className="hover:text-bloom-rose transition-colors">Rewards</Link></li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#2d2418] mb-4">About & Info</h4>
              <ul className="space-y-2.5 text-sm text-[#8a7a6a]">
                <li><Link to="/about" className="hover:text-bloom-rose transition-colors">Our Story</Link></li>
                <li><Link to="/giving" className="hover:text-bloom-rose transition-colors flex items-center gap-1"><span className="text-xs">🐾</span> Every Bloom Gives a Dog a Home</Link></li>
                <li><Link to="/faq" className="hover:text-bloom-rose transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-bloom-rose transition-colors">Contact Support</Link></li>
                <li><Link to="/terms" className="hover:text-bloom-rose transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-bloom-rose transition-colors">Privacy Policy</Link></li>
                <li><Link to="/returns" className="hover:text-bloom-rose transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/shipping" className="hover:text-bloom-rose transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>

            {/* Contact Info Column */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#2d2418] mb-4">Get in Touch</h4>
              <ul className="space-y-3 text-xs text-[#8a7a6a]">
                <li className="flex items-start gap-2">
                  <MailIcon size={16} className="text-bloom-rose flex-shrink-0 mt-0.5" />
                  <span>hello@bloomwire.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <PhoneIcon size={16} className="text-bloom-rose flex-shrink-0 mt-0.5" />
                  <span>Mon-Sat, 10am-6pm IST</span>
                </li>
                <li className="flex items-start gap-2">
                  <PinIcon size={16} className="text-bloom-rose flex-shrink-0 mt-0.5" />
                  <span>Handcrafted with love in Jaipur, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Signals Bar */}
          <div className="mt-10 pt-6 border-t border-[#2d2418]/10">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[#8a7a6a]">
              <span className="flex items-center gap-1.5"><span>🇮🇳</span> Handmade in India</span>
              <span className="flex items-center gap-1.5"><span>💳</span> UPI & COD Available</span>
              <span className="flex items-center gap-1.5"><span>↩️</span> 7-Day Replacement</span>
              <span className="flex items-center gap-1.5"><span>📦</span> Tracked Shipping</span>
              <span className="flex items-center gap-1.5"><span>🌸</span> Petals valid 12 months</span>
            </div>
          </div>

          {/* Business Info (Legal Compliance) */}
          <div className="border-t border-[#2d2418]/10 pt-6 mt-6 text-center sm:text-left">
            <p className="text-xs text-[#a0918a] leading-relaxed">
              <span className="text-[#8a7a6a] font-medium">Bloomwire™</span> · Jaipur, Rajasthan, India
            </p>
            <p className="text-xs text-[#a0918a] mt-1">
              Grievance Officer: Somil Sharma · hello@bloomwire.in · Mon–Sat, 10 AM–6 PM IST
            </p>
            <p className="text-xs text-[#8a7a6a] mt-3 font-medium">
              🐾 2% of every order supports Dog Home Foundation, Jodhpur — caring for 800+ stray animals
            </p>
          </div>

          {/* Bottom Footer Credit */}
          <div className="mt-12 pt-8 border-t border-[#2d2418]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#a0918a]">
            <p>© {new Date().getFullYear()} Bloomwire Flowers. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span className="text-center sm:text-right break-words">Handcrafted lasting blooms <span className="text-bloom-rose">&hearts;</span> Gen Z Aesthetic</span>
            </p>
          </div>
          <p className="italic font-serif text-[#9A9A9A] text-sm text-center mt-6 pt-4 border-t border-[#2d2418]/10">
            ✿ Where flowers bloom, so does hope. — Lady Bird Johnson ✿
          </p>
        </div>
      </footer>

      {/* Floating Back To Top Button (Bottom Left) */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 left-6 z-[90] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#2d2418]/15 text-[#2d2418] flex items-center justify-center shadow-2xl hover:border-bloom-rose/50 hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronDownIcon size={24} className="rotate-180 text-[#6b5d4f] group-hover:text-bloom-rose transition-colors" />
        </button>
      )}

      {/* Floating WhatsApp Support Popup (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[95] flex flex-col items-end pointer-events-auto" ref={chatWidgetRef}>
        {/* Chat Popup — Auto-collapsed on checkout route */}
        {!isCheckout && whatsappOpen && (
          <>
            {/* Non-blocking Backdrop for visual softness; pointer-events-none ensures navbar/links remain clickable */}
            <div className="fixed inset-0 z-[94] bg-[#2d2418]/20 backdrop-blur-xs pointer-events-none" />

            {/* Popup Container */}
            <div className="relative z-[96] pointer-events-auto w-[calc(100vw-3rem)] sm:w-96 max-h-[calc(100vh-6.5rem)] bg-white border border-[#2d2418]/15 rounded-3xl shadow-2xl overflow-hidden mb-4 animate-scale-in flex flex-col text-[#2d2418]">
              {/* Header */}
              <div className="bg-gradient-to-r from-bloom-rose via-bloom-wine to-bloom-rose p-4 border-b border-[#2d2418]/10 flex items-center justify-between flex-shrink-0 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#e91e63]/20 border border-[#e91e63]/50 flex items-center justify-center text-[#e91e63]">
                      <WhatsAppIcon size={20} />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#e91e63] rounded-full border-2 border-bloom-wine" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm tracking-wide text-[#2d2418]">
                      Bloomwire Support
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-medium">Online • Always Blooming</p>
                  </div>
                </div>
                <button
                  onClick={() => setWhatsappOpen(false)}
                  className="p-1.5 text-[#2d2418]/80 hover:text-[#2d2418] hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close Bloomwire Support"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 space-y-4 max-h-[380px] sm:max-h-[420px] flex-1 min-h-0 overflow-y-auto">
                {/* Welcome Message */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-bloom-rose to-bloom-wine flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md">
                    🌸
                  </div>
                  <div className="bg-[#FFF8F3] p-3 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-[#2d2418] border border-[#2d2418]/10 leading-relaxed shadow-sm">
                    Hi! How can we help you bloom today?
                  </div>
                </div>

                {/* Chat Messages */}
                {chatMessages.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex items-start gap-2.5 ${msg.fromBot ? '' : 'flex-row-reverse'}`}>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                            msg.fromBot ? 'bg-gradient-to-tr from-bloom-rose to-bloom-wine text-white' : 'bg-[#2d2418]/10 text-[#2d2418]'
                          }`}
                        >
                          {msg.fromBot ? '🌸' : 'You'}
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs sm:text-sm border border-[#2d2418]/10 leading-relaxed shadow-sm max-w-[80%] ${
                            msg.fromBot ? 'bg-[#FFF8F3] text-[#2d2418] rounded-tl-xs' : 'bg-bloom-rose/20 text-bloom-wine rounded-tr-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Help Options */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#8a7a6a] px-1">
                    Quick Help
                  </p>
                  <div className="space-y-2">
                    {quickHelpOptions.map((option) => {
                      const isExpanded = expandedOption === option.id
                      return (
                        <div key={option.id} className="rounded-xl border border-[#2d2418]/10 bg-[#FFF8F3] overflow-hidden transition-all duration-200">
                          <button
                            onClick={() => toggleOption(option.id)}
                            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-medium text-[#2d2418] hover:bg-white transition-colors"
                          >
                            <span>{option.title}</span>
                            <ChevronDownIcon
                              size={16}
                              className={`text-[#8a7a6a] transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-bloom-rose' : ''
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-3.5 pb-3 pt-2 text-xs text-[#6b5d4f] border-t border-[#2d2418]/5 bg-white leading-relaxed animate-fade-in space-y-2.5">
                              <p>{option.response}</p>
                              <a
                                href={`https://wa.me/message/VT4TW64X2EJKH1?text=${encodeURIComponent('Hi! I need help with: ' + option.title)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e91e63]/20 hover:bg-[#e91e63] text-[#e91e63] hover:text-black font-medium text-[11px] transition-all border border-[#e91e63]/40 group"
                              >
                                <WhatsAppIcon size={14} className="group-hover:scale-110 transition-transform" />
                                <span>Chat on WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Direct WhatsApp Action Button */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/message/VT4TW64X2EJKH1"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#e91e63] hover:bg-[#c2185b] text-black font-medium text-xs sm:text-sm shadow-lg hover:shadow-[#e91e63]/20 transition-all duration-200 group"
                  >
                    <WhatsAppIcon size={18} className="text-black group-hover:scale-110 transition-transform" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Chat Footer / Input */}
              <div className="p-3 bg-[#FFF8F3] border-t border-[#2d2418]/10 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 bg-white border border-[#2d2418]/15 rounded-xl px-3.5 py-2 text-xs text-[#2d2418] placeholder-[#a0918a] focus:outline-none focus:border-bloom-rose transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1"
                  >
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Floating WhatsApp Button — hidden on checkout */}
        {!isCheckout && (
        <button
          onClick={handleWhatsAppButtonClick}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none pointer-events-auto"
          aria-label="Open Bloomwire WhatsApp Help Support"
          title="Bloomwire WhatsApp Help"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping pointer-events-none" />
          <WhatsAppIcon size={24} className="text-[#2d2418] relative z-10 sm:hidden group-hover:scale-110 transition-transform" />
          <WhatsAppIcon size={28} className="text-[#2d2418] relative z-10 hidden sm:block group-hover:scale-110 transition-transform" />
        </button>
        )}
      </div>

      {/* Global Overlays & Widgets */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <EntryPopup />
      <ToastContainer />
      <MobileNav />
      {!location.pathname.startsWith("/admin") && <CookieConsent />}
    </div>
    </>
  )
}