import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { useOrderStore } from '../store/orderStore'
import { useWatchlist } from '../store/watchlistStore'
import { useCart } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import {
  UserIcon,
  HeartIcon,
  CartIcon,
  TruckIcon,
  PetalIcon,
  GiftIcon,
  ShieldIcon,
  LogoutIcon,
  CheckCircleIcon,
  FlowerIcon,
  MailIcon,
  PhoneIcon,
  ArrowRightIcon,
  SparkleIcon,
  StarIcon,
} from '../components/Icons'

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth()
  const syncWithBackend = useAuth((s: any) => s.syncWithBackend)

  // Sync user data from backend on mount
  useEffect(() => {
    if (user?.email) {
      syncWithBackend()
    }
  }, [user?.email])
  const getUserOrders = useOrderStore((s) => s.getUserOrders)
  const watchlistItems = useWatchlist((s) => s.items)
  const cartItems = useCart((s) => s.items)
  const showToast = useToastStore((s) => s.showToast)
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editPhone, setEditPhone] = useState(user?.phone || '')
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) {
    return null
  }

  const userOrders = getUserOrders(user.email) || []

  const initials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Member'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be under 5MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      updateProfile({ avatar: base64 })
      showToast('Profile photo updated successfully!', 'success', )
    }
    reader.onerror = () => {
      showToast('Failed to upload image', 'error')
    }
    reader.readAsDataURL(file)
  }

  const handleStartEdit = () => {
    setEditName(user.name || '')
    setEditPhone(user.phone || '')
    setIsEditing(true)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error')
      return
    }
    updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
    })
    setIsEditing(false)
    showToast('Profile updated successfully!', 'success', )
  }

  const handleCopyReferral = () => {
    if (!user.referralCode) return
    navigator.clipboard.writeText(user.referralCode)
    setIsCopying(true)
    showToast('Referral code copied to clipboard!', 'success', '📋')
    setTimeout(() => setIsCopying(false), 2000)
  }

  const handleSignOut = () => {
    signOut()
    showToast('Signed out successfully', 'auth')
    navigate('/')
  }

  const dashboardCards = [
    {
      id: 'orders',
      title: 'Your Orders',
      subtitle: `${userOrders.length} order${userOrders.length === 1 ? '' : 's'} total • Track & manage`,
      icon: TruckIcon,
      href: '/orders',
      badge: userOrders.length > 0 ? `${userOrders.length} Order${userOrders.length === 1 ? '' : 's'}` : undefined,
      color: 'from-bloom-rose to-bloom-wine',
      accentText: 'text-bloom-neon',
    },
    {
      id: 'wishlist',
      title: 'Your Wishlist',
      subtitle: `${watchlistItems.length} saved item${watchlistItems.length === 1 ? '' : 's'} in your collection`,
      icon: HeartIcon,
      href: '/wishlist',
      badge: watchlistItems.length > 0 ? `${watchlistItems.length} Saved` : undefined,
      color: 'from-pink-500 to-rose-600',
      accentText: 'text-pink-400',
    },
    {
      id: 'cart',
      title: 'My Collection',
      subtitle: `${cartItems.length} item${cartItems.length === 1 ? '' : 's'} waiting in your collection`,
      icon: CartIcon,
      href: '/cart',
      badge: cartItems.length > 0 ? `${cartItems.length} Item${cartItems.length === 1 ? '' : 's'}` : undefined,
      color: 'from-amber-500 to-bloom-gold',
      accentText: 'text-bloom-gold',
    },
    {
      id: 'my-gallery',
      title: 'My Gallery',
      subtitle: 'Your private unboxing photos & approved submissions',
      icon: GiftIcon,
      href: '/my-gallery',
      color: 'from-pink-500 to-rose-600',
      accentText: 'text-pink-400',
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      subtitle: `${user.addresses?.length || 0} delivery address${(user.addresses?.length || 0) === 1 ? '' : 'es'} saved`,
      icon: ShieldIcon,
      href: '/addresses',
      badge: (user.addresses?.length || 0) > 0 ? `${user.addresses.length} Saved` : undefined,
      color: 'from-emerald-500 to-teal-600',
      accentText: 'text-emerald-400',
    },
    {
      id: 'rewards',
      title: 'Rewards',
      subtitle: `${user.petals} Petals available • Tier perks & discounts`,
      icon: GiftIcon,
      href: '/rewards',
      badge: `${user.petals} Petals`,
      color: 'from-bloom-gold to-amber-600',
      accentText: 'text-bloom-gold',
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      subtitle: `${user.reviewedProducts?.length || 0} product review${(user.reviewedProducts?.length || 0) === 1 ? '' : 's'} submitted`,
      icon: StarIcon,
      href: '/reviews',
      badge: (user.reviewedProducts?.length || 0) > 0 ? `${user.reviewedProducts.length} Written` : undefined,
      color: 'from-purple-500 to-indigo-600',
      accentText: 'text-purple-400',
    },
    {
      id: 'faq',
      title: 'Help Center',
      subtitle: 'Frequently asked questions & order guidance',
      icon: FlowerIcon,
      href: '/faq',
      color: 'from-blue-500 to-cyan-600',
      accentText: 'text-blue-400',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      subtitle: 'Reach out to our 24/7 floral support concierge',
      icon: MailIcon,
      href: '/contact',
      color: 'from-rose-500 to-pink-600',
      accentText: 'text-rose-400',
    },
    {
      id: 'terms',
      title: 'Terms & Policies',
      subtitle: 'Shipping policies, returns & privacy guarantee',
      icon: CheckCircleIcon,
      href: '/terms',
      color: 'from-slate-500 to-gray-600',
      accentText: 'text-[#8a7a6a]',
    },
  ]

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-bloom-rose/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-bloom-gold/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bloom-neon mb-2">
            <SparkleIcon size={14} className="text-bloom-neon animate-pulse" />
            <span>Account Concierge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2d2418] tracking-tight">
            Welcome Back, <span className="gradient-text">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-[#8a7a6a] text-sm md:text-base mt-1">
            Manage your profile, order history, rewards, and saved floral collections.
          </p>
        </div>

        <button
          onClick={() => setShowSignOutModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 glass text-[#6b5d4f] hover:text-[#2d2418] hover:bg-red-500/15 hover:border-red-500/30 rounded-full text-xs sm:text-sm font-medium transition-all group self-start sm:self-auto"
        >
          <LogoutIcon size={16} className="text-[#8a7a6a] group-hover:text-red-400 transition" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 1. Profile Header Card */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 mb-8 md:mb-10 border border-[#2d2418]/10 relative overflow-hidden neon-border">
        {/* Subtle background glow accent inside card */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-bloom-rose/20 to-bloom-gold/10 rounded-full blur-2xl pointer-events-none" />

        {!isEditing ? (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8 relative z-10">
            {/* Avatar Section */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden hollow-frame p-1 bg-[#FFF8F3]/60 flex items-center justify-center relative shadow-2xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-bloom-rose via-bloom-wine to-bloom-dark flex items-center justify-center font-serif text-3xl sm:text-4xl font-bold text-white tracking-wider shadow-inner">
                    {initials}
                  </div>
                )}

                {/* Avatar Overlay / Change Button */}
                <button
                  onClick={handleAvatarClick}
                  type="button"
                  title="Upload profile photo"
                  className="absolute inset-0 bg-bloom-rose/15 backdrop-blur-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-[#2d2418] text-xs font-medium cursor-pointer"
                >
                  <UserIcon size={22} className="mb-1 text-bloom-neon" />
                  <span>Upload Photo</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Status Badge Indicator */}
              <div
                className="absolute bottom-1 right-1 bg-[#FFF8F3] p-1 rounded-full border border-bloom-rose/40"
                title="Verified Member"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold">
                  ✓
                </div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] flex items-center justify-center md:justify-start gap-2">
                    <span>{user.name}</span>
                    <SparkleIcon size={18} className="text-bloom-gold" />
                  </h2>
                  <p className="text-xs text-[#8a7a6a] font-mono mt-0.5">
                    ID: BLOOM-{user.email.split('@')[0].toUpperCase().slice(0, 8)}
                  </p>
                </div>

                <button
                  onClick={handleStartEdit}
                  className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full text-xs sm:text-sm font-semibold shimmer-btn neon-glow hover:scale-105 transition-all self-center md:self-start shadow-lg"
                >
                  Edit Profile
                </button>
              </div>

              {/* Contact Details */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-5 text-xs sm:text-sm text-[#6b5d4f] pt-1">
                <div className="flex items-center gap-1.5 text-[#6b5d4f]">
                  <MailIcon size={15} className="text-bloom-neon" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#6b5d4f]">
                  <PhoneIcon size={15} className="text-bloom-gold" />
                  <span>{user.phone || 'No phone added'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#8a7a6a]">
                  <FlowerIcon size={15} className="text-bloom-sage" />
                  <span>Member since {formatDate(user.memberSince)}</span>
                </div>
              </div>

              {/* Badges & Petals Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                {/* Petals Count Badge */}
                <Link
                  to="/rewards"
                  className="px-3.5 py-1.5 bg-bloom-gold/15 border border-bloom-gold/40 text-bloom-gold rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-bloom-gold/25 transition group shadow-sm"
                >
                  <PetalIcon size={15} className="text-bloom-gold group-hover:scale-110 transition-transform" />
                  <span>{user.petals} Petals</span>
                </Link>

                {/* VIP Status Badge */}
                <div className="px-3.5 py-1.5 bg-bloom-rose/15 border border-bloom-rose/40 text-bloom-neon rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <CheckCircleIcon size={15} className="text-bloom-neon" />
                  <span>VIP Member</span>
                </div>

                {/* Streak Badge */}
                {user.streak ? (
                  <div className="px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <SparkleIcon size={15} className="text-amber-400 animate-pulse" />
                    <span>{user.streak}-Day Login Streak</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          /* Inline Edit Form */
          <form onSubmit={handleSaveProfile} className="space-y-5 relative z-10 max-w-xl mx-auto md:mx-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2418]/10">
              <h3 className="text-xl font-serif font-bold text-[#2d2418] flex items-center gap-2">
                <UserIcon size={20} className="text-bloom-neon" />
                <span>Edit Profile Details</span>
              </h3>
              <span className="text-xs text-[#8a7a6a]">Update your account info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6b5d4f] mb-1.5">
                  Full Name <span className="text-bloom-neon">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl glass glow-focus text-sm text-[#2d2418] placeholder-[#a0918a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6b5d4f] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 94140 27836"
                    className="w-full px-4 py-2.5 rounded-xl glass glow-focus text-sm text-[#2d2418] placeholder-[#a0918a]"
                  />
                </div>
              </div>
            </div>

            {/* Avatar Upload inside Edit Form */}
            <div className="p-4 rounded-2xl glass border border-[#2d2418]/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FFF8F3] flex items-center justify-center border border-bloom-rose/40">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif font-bold text-[#2d2418] text-sm">{initials}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2d2418]">Profile Photo</p>
                  <p className="text-[11px] text-[#8a7a6a]">JPG, PNG or WEBP up to 5MB</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAvatarClick}
                className="px-3.5 py-2 glass hover:bg-white/70 text-xs font-medium text-[#2d2418] rounded-lg transition"
              >
                Change Photo
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 glass hover:bg-white/70 text-[#6b5d4f] rounded-full text-xs font-medium transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full text-xs font-semibold shimmer-btn neon-glow hover:scale-105 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Quick Stats Row */}
      <div className="mb-8 md:mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8a7a6a] mb-4 flex items-center gap-2">
          <span>Account Overview</span>
          <div className="h-px bg-white/70 flex-1" />
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Stat 1: Orders */}
          <Link
            to="/orders"
            className="glass hover:glass-strong rounded-2xl p-4 sm:p-5 border border-[#2d2418]/10 hover:border-bloom-rose/40 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-bloom-rose/15 flex items-center justify-center text-bloom-neon group-hover:scale-110 transition-transform">
                <TruckIcon size={20} />
              </div>
              <ArrowRightIcon size={16} className="text-[#a0918a] group-hover:text-bloom-neon group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-0.5">
              {userOrders.length}
            </div>
            <p className="text-xs font-medium text-[#6b5d4f]">Total Orders</p>
            <p className="text-[11px] text-[#a0918a] mt-1 truncate">
              {userOrders.length > 0 ? 'View history & track' : 'No orders placed yet'}
            </p>
          </Link>

          {/* Stat 2: Wishlist */}
          <Link
            to="/wishlist"
            className="glass hover:glass-strong rounded-2xl p-4 sm:p-5 border border-[#2d2418]/10 hover:border-pink-500/40 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <HeartIcon size={20} />
              </div>
              <ArrowRightIcon size={16} className="text-[#a0918a] group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-0.5">
              {watchlistItems.length}
            </div>
            <p className="text-xs font-medium text-[#6b5d4f]">Wishlist Items</p>
            <p className="text-[11px] text-[#a0918a] mt-1 truncate">
              {watchlistItems.length > 0 ? 'Favorites saved' : 'Browse & save blooms'}
            </p>
          </Link>

          {/* Stat 3: Petals Earned */}
          <Link
            to="/rewards"
            className="glass hover:glass-strong rounded-2xl p-4 sm:p-5 border border-[#2d2418]/10 hover:border-bloom-gold/40 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-bloom-gold/15 flex items-center justify-center text-bloom-gold group-hover:scale-110 transition-transform">
                <PetalIcon size={20} />
              </div>
              <ArrowRightIcon size={16} className="text-[#a0918a] group-hover:text-bloom-gold group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-0.5">
              {user.petals}
            </div>
            <p className="text-xs font-medium text-[#6b5d4f]">Petals Earned</p>
            <p className="text-[11px] text-[#a0918a] mt-1 truncate">Redeem for discounts</p>
          </Link>

          {/* Stat 4: Referral Count */}
          <div className="glass rounded-2xl p-4 sm:p-5 border border-[#2d2418]/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                <SparkleIcon size={20} />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded glass text-bloom-gold border border-bloom-gold/30">
                {user.referralCode}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-0.5">
              {user.referralCount || 0}
            </div>
            <p className="text-xs font-medium text-[#6b5d4f]">Referrals Count</p>
            <p className="text-[11px] text-[#a0918a] mt-1 truncate">Friends referred</p>
          </div>
        </div>
      </div>

      {/* 3. Dashboard Cards Grid */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8a7a6a] mb-4 flex items-center gap-2">
          <span>Quick Access Dashboard</span>
          <div className="h-px bg-white/70 flex-1" />
        </h2>

        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            return (
              <Link
                key={card.id}
                to={card.href}
                className="glass hover:glass-strong rounded-2xl p-5 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-[#FFF8F3]/80 rounded-[14px] flex items-center justify-center text-[#2d2418]">
                        <IconComponent size={22} className={card.accentText} />
                      </div>
                    </div>

                    {card.badge && (
                      <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/60 border border-[#2d2418]/10 text-[#6b5d4f] group-hover:border-[#2d2418]/15 transition">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#2d2418] group-hover:text-bloom-neon transition-colors mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#8a7a6a] leading-relaxed mb-4">
                    {card.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[#8a7a6a] group-hover:text-[#2d2418] pt-2 border-t border-[#2d2418]/10">
                  <span>Explore Section</span>
                  <ArrowRightIcon size={14} className="group-hover:translate-x-1.5 transition-transform text-bloom-neon" />
                </div>
              </Link>
            )
          })}

          {/* Special Action Card: Sign Out Card in Grid */}
          <button
            type="button"
            onClick={() => setShowSignOutModal(true)}
            className="glass hover:bg-red-500/10 rounded-2xl p-5 border border-[#2d2418]/10 hover:border-red-500/30 transition-all duration-300 group flex flex-col justify-between text-left relative overflow-hidden hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-[#FFF8F3]/80 rounded-[14px] flex items-center justify-center text-red-400">
                    <LogoutIcon size={22} />
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  Account
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#2d2418] group-hover:text-red-400 transition-colors mb-1">
                Sign Out
              </h3>
              <p className="text-xs text-[#8a7a6a] leading-relaxed mb-4">
                Safely exit your current session on this device.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-[#8a7a6a] group-hover:text-red-400 pt-2 border-t border-[#2d2418]/10">
              <span>Log Out Now</span>
              <LogoutIcon size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Referral & Perks Banner */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-[#2d2418]/10 relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-gold/15 text-bloom-gold border border-bloom-gold/30 text-xs font-semibold">
              <GiftIcon size={14} />
              <span>Bloomwire Referral Program</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2d2418]">
              Share the Joy of Flowers & Earn <span className="gradient-text">50 Petals</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6b5d4f] max-w-xl">
              Invite your friends to Bloomwire. When they sign up using your code, you both earn bonus Petals towards hand-sculpted bouquets!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="px-5 py-3 rounded-2xl bg-[#FFF8F3]/80 border border-bloom-gold/30 font-mono text-base font-bold text-bloom-gold tracking-widest text-center min-w-[160px] shadow-inner">
              {user.referralCode}
            </div>

            <button
              type="button"
              onClick={handleCopyReferral}
              disabled={isCopying}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-bloom-gold to-amber-600 text-black font-semibold text-xs sm:text-sm rounded-full shimmer-btn hover:scale-105 transition shadow-lg flex items-center justify-center gap-2"
            >
              <SparkleIcon size={16} />
              <span>{isCopying ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong border border-[#2d2418]/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <LogoutIcon size={28} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#2d2418]">
                Sign Out of Bloomwire?
              </h3>
              <p className="text-xs sm:text-sm text-[#8a7a6a]">
                Are you sure you want to log out? You can sign back in anytime to access your orders and saved wishlist.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 py-3 glass hover:bg-white/70 text-[#6b5d4f] rounded-full text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-[#2d2418] rounded-full text-xs font-semibold shadow-lg hover:scale-105 transition"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
