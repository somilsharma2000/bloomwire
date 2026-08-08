import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { products, categories } from '../data/products'
import type { Product } from '../data/products'

export interface GalleryItem {
  id: string
  src: string
  name: string
  category: string
  slug: string
  price: number
  originalPrice?: number
  description: string
  tags: string[]
  rating: number
  reviewCount: number
  badges: string[]
  product: Product
  imageIndex: number
}

// Inline SVG Icon Helpers
const LeafIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9 0 4.4-3.6 8-8 8Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const FlowerIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a4 4 0 0 0-4 4c0 2 2 4 4 4 2 0 4-2 4-4a4 4 0 0 0-4-4Z" />
    <path d="M12 22a4 4 0 0 0 4-4c0-2-2-4-4-4-2 0-4 2-4 4a4 4 0 0 0 4 4Z" />
    <path d="M2 12a4 4 0 0 0 4 4c2 0 4-2 4-4 0-2-2-4-4-4a4 4 0 0 0-4 4Z" />
    <path d="M22 12a4 4 0 0 0-4-4c-2 0-4 2-4 4 0 2 2 4 4 4a4 4 0 0 0 4-4Z" />
  </svg>
)

const SparkleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3 1.91 5.82L19.73 10.73l-5.82 1.91L12 18.46l-1.91-5.82L4.27 10.73l5.82-1.91L12 3z" />
    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  </svg>
)

const HeartIcon = ({ className = "w-5 h-5", filled = false }: { className?: string; filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </svg>
)

const ShareIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.51M15.41 6.51 8.59 10.49" />
  </svg>
)

const ChevronLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const GridIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
)

const EyeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// Lightbox Component with Touch Swipe Gestures & Enhancements
interface LightboxProps {
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  likes: Record<string, number>
  userLiked: Record<string, boolean>
  onToggleLike: (id: string, e: React.MouseEvent) => void
}

function LightboxModal({
  items,
  currentIndex,
  onClose,
  onNavigate,
  likes,
  userLiked,
  onToggleLike,
}: LightboxProps) {
  const currentItem = items[currentIndex]
  const [copied, setCopied] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length)
  }, [currentIndex, items.length, onNavigate])

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length)
  }, [currentIndex, items.length, onNavigate])

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, handlePrev, handleNext])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbRef.current) {
      const activeThumb = thumbRef.current.children[currentIndex] as HTMLElement
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [currentIndex])

  if (!currentItem) return null

  const handleShare = () => {
    const url = `${window.location.origin}/product/${currentItem.slug}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isLiked = userLiked[currentItem.id]
  const likeCount = (likes[currentItem.id] || 0) + (currentItem.rating > 4.7 ? 24 : 12)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/92 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Top Bar Controls */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto px-3 sm:px-4 py-1.5 rounded-full glass-dark text-[11px] sm:text-xs text-gray-300 flex items-center gap-1.5 sm:gap-2 border border-white/10 shadow-lg">
          <SparkleIcon className="w-3.5 h-3.5 text-bloom-neon animate-pulse shrink-0" />
          <span>
            Bloom <strong className="text-white">{currentIndex + 1}</strong> of{' '}
            <strong className="text-white">{items.length}</strong>
          </span>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto p-2 sm:p-2.5 rounded-full glass-dark text-gray-300 hover:text-white hover:bg-bloom-rose/30 transition-all border border-white/10 hover:border-bloom-rose/50 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close Lightbox"
        >
          <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Navigation Arrows with smooth pulse glow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3.5 rounded-full glass-dark text-white/90 hover:text-white hover:bg-bloom-rose/40 hover:scale-110 shadow-[0_0_15px_rgba(255,64,129,0.3)] hover:shadow-[0_0_25px_rgba(255,64,129,0.7)] animate-pulse-glow transition-all duration-300 border border-white/15 hover:border-bloom-rose/60 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Previous image"
      >
        <ChevronLeftIcon className="w-5 h-5 sm:w-8 sm:h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3.5 rounded-full glass-dark text-white/90 hover:text-white hover:bg-bloom-rose/40 hover:scale-110 shadow-[0_0_15px_rgba(255,64,129,0.3)] hover:shadow-[0_0_25px_rgba(255,64,129,0.7)] animate-pulse-glow transition-all duration-300 border border-white/15 hover:border-bloom-rose/60 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Next image"
      >
        <ChevronRightIcon className="w-5 h-5 sm:w-8 sm:h-8" />
      </button>

      {/* Main Lightbox Content Card with subtle scale-in animation */}
      <div className="relative w-full max-w-5xl my-auto max-h-[90vh] glass-strong rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-[0_0_60px_rgba(255,64,129,0.25)] border border-white/15 flex flex-col lg:flex-row bg-bloom-darker/90 animate-scale-in">
        {/* Left Side: Image Display */}
        <div className="relative lg:w-3/5 bg-gradient-to-br from-bloom-blush/80 via-black/80 to-bloom-dark flex items-center justify-center p-4 sm:p-8 min-h-[260px] sm:min-h-[420px] overflow-hidden group shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,30,99,0.15)_0,transparent_70%)] pointer-events-none" />

          {/* Leaf Accent Framing overlay */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl glass-dark text-emerald-400 flex items-center gap-1.5 text-[10px] sm:text-xs font-medium border border-emerald-500/20 z-10">
            <LeafIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Botanical Detail</span>
          </div>

          <img
            src={currentItem.src}
            alt={currentItem.name}
            className="max-h-[45vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Thumbnail navigation bar with smooth scrolling */}
          <div
            ref={thumbRef}
            className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 max-w-[90%] flex gap-1.5 sm:gap-2 overflow-x-auto p-1 sm:p-1.5 rounded-xl sm:rounded-2xl glass-dark border border-white/10 scrollbar-none scroll-smooth"
          >
            {items.map((item, realIdx) => (
              <button
                key={item.id}
                onClick={() => onNavigate(realIdx)}
                className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                  realIdx === currentIndex
                    ? 'border-bloom-neon scale-105 ring-2 ring-bloom-rose/50 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="lg:w-2/5 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[90vh]">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
              <span className="px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md shadow-bloom-rose/20">
                {currentItem.category}
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium glass text-bloom-gold flex items-center gap-1">
                <SparkleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-bloom-gold" />
                Handcrafted
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight break-words">
              {currentItem.name}
            </h2>

            {/* Rating & Price */}
            <div className="flex items-center justify-between my-2 sm:my-3 pb-2 sm:pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-bloom-gold text-xs sm:text-sm font-medium">
                <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                <span>{currentItem.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-[10px] sm:text-xs font-normal">({currentItem.reviewCount} reviews)</span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold text-white">₹{currentItem.price}</span>
                {currentItem.originalPrice && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through ml-2">₹{currentItem.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-sans line-clamp-4 sm:line-clamp-none">
              {currentItem.description}
            </p>

            {/* Gen Z Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {currentItem.tags.map((tag) => (
                <span key={tag} className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg glass-dark text-pink-300 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col gap-2.5 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={(e) => onToggleLike(currentItem.id, e)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                  isLiked
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20'
                    : 'glass text-gray-300 hover:text-white border-white/10 hover:border-bloom-rose/40'
                }`}
              >
                <HeartIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'text-rose-400 fill-rose-400' : ''}`} filled={isLiked} />
                <span>{likeCount} Likes</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all relative shrink-0"
                title="Share product link"
              >
                <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Share'}</span>
              </button>
            </div>

            <Link
              to={`/product/${currentItem.slug}`}
              className="w-full shimmer-btn bg-gradient-to-r from-bloom-rose via-pink-500 to-bloom-wine text-white font-medium py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-bloom-rose/30 hover:shadow-bloom-rose/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm"
            >
              <span>View Product Details</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const galleryNames = [
  'Sunlit Daisy Desk Pot', 'Velvet Rose Window Display', 'Pastel Peony Gift Set',
  'Lavender Mist Nightstand Bloom', 'Ethereal Sunflower Reading Nook', 'Crimson Romance Centerpiece',
  'Golden Autumn Shelf Decor', 'Ivory Pearl Boutonniere', 'Cherry Blossom Branch Vase',
  'Midnight Tulip Study Desk', 'Rainbow Bloom Nursery Mobile', 'Soft Pink Peony Vanity'
]

const galleryCredits = [
  'Styled by Priya from Jaipur', 'Styled by Arjun from Mumbai', 'Styled by Sneha from Delhi',
  'Styled by Meera from Jaipur', 'Styled by Karan from Pune', 'Styled by Ananya from Hyderabad',
  'Styled by Vikram from Chennai', 'Styled by Divya from Bangalore', 'Styled by Rohit from Jaipur',
  'Styled by Ishita from Kolkata', 'Styled by Kabir from Chandigarh', 'Styled by Sara from Lucknow'
]

export default function Gallery() {
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'vine' | 'masonry'>('vine')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({})
  const [isFiltering, setIsFiltering] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Extract gallery items from products
  const allItems: GalleryItem[] = products.flatMap((p) =>
    p.images.map((src, idx) => ({
      id: `${p.slug}-${idx}`,
      src,
      name: p.name,
      category: p.category,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      tags: p.tags,
      rating: p.rating,
      reviewCount: p.reviewCount,
      badges: p.badges || [],
      product: p,
      imageIndex: idx,
    }))
  )

  const filteredItems = activeCat
    ? allItems.filter((item) => item.category === activeCat)
    : allItems

  // Scroll reveal setup with IntersectionObserver
  useEffect(() => {
    const timer = setTimeout(() => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      )
      const elements = document.querySelectorAll('.reveal')
      elements.forEach((el) => observerRef.current?.observe(el))
    }, 50)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [activeCat, viewMode, isFiltering])

  const handleCategoryChange = (catName: string | null) => {
    if (catName === activeCat) return
    setIsFiltering(true)
    setTimeout(() => {
      setActiveCat(catName)
      setIsFiltering(false)
    }, 200)
  }

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setUserLiked((prev) => {
      const isLiked = !prev[id]
      setLikes((likePrev) => ({
        ...likePrev,
        [id]: (likePrev[id] || 0) + (isLiked ? 1 : -1),
      }))
      return { ...prev, [id]: isLiked }
    })
  }

  const categoryList = Array.from(categories)

  return (
    <div
      className="relative min-h-screen pb-24 pt-8 overflow-x-hidden touch-pan-y"
      style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Custom Keyframe Animations & Utilities CSS */}
      <style>{`
        @keyframes leafSwayLeft {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes leafSwayRight {
          0%, 100% { transform: translateY(0px) rotate(1.5deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes vineGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes floatingPetal {
          0% { transform: translateY(105vh) rotate(0deg) scale(0.6); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% { transform: translateY(-10vh) rotate(360deg) scale(1.1); opacity: 0; }
        }
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-sway-left {
          animation: leafSwayLeft 6s ease-in-out infinite;
        }
        .animate-sway-right {
          animation: leafSwayRight 7s ease-in-out infinite;
        }
        .animate-vine-glow {
          animation: vineGlow 4s ease-in-out infinite;
        }
        .animate-float-soft {
          animation: floatSoft 3s ease-in-out infinite;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background Section - Floating Petals (sm and above only) & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle radial gradient glow at top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-bloom-rose/5 to-transparent pointer-events-none" />

        {/* Floating Petals: Hidden on mobile (sm and below) to avoid performance issues */}
        <div className="hidden sm:block absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-bloom-rose/30 fill-bloom-rose/20"
              style={{
                left: `${(i * 8.5 + 3) % 95}%`,
                animation: `floatingPetal ${12 + (i % 6) * 3}s linear infinite`,
                animationDelay: `${i * 1.2}s`,
              }}
            >
              <FlowerIcon className={`w-${(i % 3) + 4} h-${(i % 3) + 4}`} />
            </div>
          ))}
        </div>

        {/* Glowing Ambient Background Spots */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-bloom-rose/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-bloom-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 left-1/3 w-[300px] h-[300px] max-w-[90vw] max-h-[90vw] bg-emerald-900/15 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 reveal">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full glass-strong text-bloom-neon text-[11px] sm:text-xs font-medium uppercase tracking-widest mb-4 border border-bloom-rose/30 neon-glow animate-float-soft">
            <SparkleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-bloom-gold animate-spin-slow shrink-0" />
            <span className="truncate">Gen Z Botanical Aesthetic</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold mb-3 sm:mb-4 tracking-tight break-words">
            <span className="gradient-text-cool">The Bloom Gallery</span>
          </h1>

          <p className="text-base sm:text-xl font-serif italic text-pink-200/90 tracking-wide mb-4 sm:mb-6 animate-float-soft" style={{ animationDelay: '0.5s' }}>
            “Every bloom tells a story”
          </p>

          <p className="text-gray-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            Explore our handcrafted chenille flowers growing on living vines. Click any photo to inspect, like, or explore the story behind the stem.
          </p>
        </div>

        {/* View Switcher & Category Filter Bar */}
        <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6 reveal">
          {/* View Toggle */}
          <div className="flex items-center justify-between gap-3 sm:gap-4 glass-dark p-2.5 sm:p-3 rounded-2xl border border-white/10 max-w-4xl mx-auto shadow-lg">
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode('vine')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all min-h-[38px] ${
                  viewMode === 'vine'
                    ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md shadow-bloom-rose/30 neon-glow'
                    : 'text-gray-400 hover:text-white'
                }`}
                aria-label="Botanical Vine View"
              >
                <LeafIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Botanical Vine</span>
              </button>

              <button
                onClick={() => setViewMode('masonry')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all min-h-[38px] ${
                  viewMode === 'masonry'
                    ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md shadow-bloom-rose/30 neon-glow'
                    : 'text-gray-400 hover:text-white'
                }`}
                aria-label="Masonry Flow View"
              >
                <GridIcon className="w-4 h-4 text-pink-300 shrink-0" />
                <span className="hidden sm:inline">Masonry Flow</span>
              </button>
            </div>

            <div className="text-[11px] sm:text-xs text-gray-400 font-mono px-2 truncate">
              Showing <strong className="text-bloom-gold font-bold">{filteredItems.length}</strong> living blooms
            </div>
          </div>

          {/* Category Filter Pills (Refined, touch-friendly min-h-10) */}
          <div className="flex overflow-x-auto flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto pb-2 px-1 scrollbar-none">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`shrink-0 whitespace-nowrap min-h-[40px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center transition-all duration-300 active:scale-95 ${
                !activeCat
                  ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-[0_0_20px_rgba(255,64,129,0.3)] scale-105'
                  : 'glass text-gray-300 hover:text-white hover:border-bloom-rose/30 border border-white/10'
              }`}
            >
              All Blooms ({allItems.length})
            </button>

            {categoryList.map((cat) => {
              const count = allItems.filter((i) => i.category === cat.name).length
              const isActive = activeCat === cat.name
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`shrink-0 whitespace-nowrap min-h-[40px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center transition-all duration-300 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-[0_0_20px_rgba(255,64,129,0.3)] scale-105'
                      : 'glass text-gray-300 hover:text-white hover:border-bloom-rose/30 border border-white/10'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Gallery Content Container with smooth category layout animation */}
        <div className={`transition-all duration-300 ease-out ${isFiltering ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
          {/* 1. CREATIVE CONCEPT - Photos on Plant Leaves View ('vine') */}
          {viewMode === 'vine' && (
            <div className="relative py-4 sm:py-8">
              {/* SVG Background Vine Stem (Center Winding Branch) */}
              <div className="absolute inset-0 flex justify-center pointer-events-none z-0 overflow-hidden opacity-30">
                <svg className="w-full max-w-4xl h-full" viewBox="0 0 800 2400" fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="vineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#e91e63" />
                      <stop offset="100%" stopColor="#f5c563" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M400 0 C 250 200, 550 400, 400 600 C 250 800, 550 1000, 400 1200 C 250 1400, 550 1600, 400 1800 C 250 2000, 550 2200, 400 2400"
                    stroke="url(#vineGrad)"
                    strokeWidth="6"
                    strokeDasharray="8 8"
                    className="animate-vine-glow"
                  />
                </svg>
              </div>

              {/* Vine View Cards: Stacked full width on mobile (grid-cols-1), 2 cols on tablet, 3 cols on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
                {filteredItems.map((item, i) => {
                  const isEven = i % 2 === 0
                  const swayClass = isEven ? 'animate-sway-left' : 'animate-sway-right'
                  const userLikedThis = userLiked[item.id]

                  return (
                    <div
                      key={item.id}
                      className={`reveal group cursor-pointer ${swayClass}`}
                      style={{
                        transitionDelay: `${(i % 10) * 80}ms`,
                        animationDelay: `${(i % 5) * 0.4}s`,
                      }}
                      onClick={() => setLightboxIndex(filteredItems.indexOf(item))}
                    >
                      <div className="relative p-1 rounded-[32px] sm:rounded-[40px] rounded-tl-sm border border-white/10 group-hover:border-bloom-rose/50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xl group-hover:shadow-[0_0_30px_rgba(255,64,129,0.35)] group-hover:scale-[1.03] overflow-hidden">
                        {/* Gradient Border Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-bloom-rose/40 to-bloom-gold/30 group-hover:from-bloom-rose group-hover:via-pink-500 group-hover:to-bloom-gold opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Leaf Card Interior */}
                        <div className="relative z-10 rounded-[30px] sm:rounded-[38px] rounded-tl-sm overflow-hidden bg-bloom-darker/90 backdrop-blur-md">
                          {/* Leaf Stem Connection Accent */}
                          <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 border-b-2 border-r-2 border-emerald-400/40 rounded-br-2xl pointer-events-none z-20 flex items-center justify-center bg-emerald-950/40">
                            <LeafIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
                          </div>

                          {/* Top Right Floating Heart/Like */}
                          <button
                            onClick={(e) => toggleLike(item.id, e)}
                            className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full glass-dark border transition-all ${
                              userLikedThis
                                ? 'border-rose-500 text-rose-400 bg-rose-500/20 shadow-lg'
                                : 'border-white/10 text-gray-300 hover:text-white hover:border-bloom-rose/50'
                            }`}
                            title="Like this bloom"
                          >
                            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" filled={userLikedThis} />
                          </button>

                          {/* Product Photo inside Leaf Mask with zoom on hover */}
                          <div className="relative aspect-[4/5] min-h-[220px] sm:min-h-[280px] overflow-hidden bg-gradient-to-b from-bloom-blush/40 to-black/60">
                            <img
                              src={item.src}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              loading="lazy"
                            />

                            {/* Hover Gradient Overlay showing product name and price */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bloom-darker/95 via-bloom-darker/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 sm:p-6">
                              <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-bloom-rose text-white shadow-md">
                                    {item.category}
                                  </span>
                                  <span className="text-xs text-bloom-gold font-bold font-mono">₹{item.price}</span>
                                </div>

                                <h3 className="text-base sm:text-xl font-serif font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-bloom-rose group-hover:to-bloom-gold transition-all duration-300 mb-1 truncate">
                                  {item.name}
                                </h3>

                                <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
                                  <span className="flex items-center gap-1 text-bloom-gold font-medium">
                                    <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    {item.rating.toFixed(1)}
                                  </span>

                                  <span className="flex items-center gap-1 text-bloom-neon font-medium group-hover:underline">
                                    <EyeIcon className="w-3.5 h-3.5" /> Inspect Bloom
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Always-Visible Leaf Footnote Banner */}
                          <div className="p-3 sm:p-4 bg-bloom-dark/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/5">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-bloom-rose group-hover:to-bloom-gold transition-all duration-300 truncate">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-emerald-400/80 flex items-center gap-1 truncate">
                                <LeafIcon className="w-3 h-3 shrink-0" /> <span className="truncate">{galleryNames[i % galleryNames.length]}</span>
                              </p>
                              <p className="text-[10px] text-gray-500 truncate">{galleryCredits[i % galleryCredits.length]}</p>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-bloom-gold">₹{item.price}</span>
                              {item.originalPrice && (
                                <span className="text-[10px] text-gray-400 line-through sm:ml-0 ml-1.5">₹{item.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2. ALTERNATIVE CONCEPT - Dynamic Masonry Flow View ('masonry') */}
          {/* Adaptable CSS Columns layout: Mobile columns-1, Tablet sm:columns-2, Desktop columns-3 lg:columns-4 */}
          {viewMode === 'masonry' && (
            <div className="columns-1 sm:columns-2 columns-3 lg:columns-4 gap-4 sm:gap-6 py-4 sm:py-6">
              {filteredItems.map((item, i) => {
                const aspectRatios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[3/5]']
                const aspectClass = aspectRatios[i % aspectRatios.length]
                const userLikedThis = userLiked[item.id]

                return (
                  <div
                    key={item.id}
                    className="break-inside-avoid mb-4 sm:mb-6 reveal cursor-pointer group"
                    style={{ transitionDelay: `${(i % 10) * 80}ms` }}
                    onClick={() => setLightboxIndex(filteredItems.indexOf(item))}
                  >
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-strong border border-white/10 group-hover:border-bloom-rose/50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] shadow-xl group-hover:shadow-[0_0_30px_rgba(255,64,129,0.35)]">
                      <div className={`relative ${aspectClass} min-h-[220px] sm:min-h-[260px] overflow-hidden bg-bloom-darker`}>
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between z-10 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 truncate max-w-[70%]">
                            {item.category}
                          </span>
                          <button
                            onClick={(e) => toggleLike(item.id, e)}
                            className={`pointer-events-auto p-2 rounded-full glass-dark transition-all ${
                              userLikedThis
                                ? 'text-rose-400 fill-rose-400 bg-rose-500/20 border-rose-500/50'
                                : 'text-white/80 hover:text-white border-white/10'
                            }`}
                            title="Like this bloom"
                          >
                            <HeartIcon className="w-4 h-4" filled={userLikedThis} />
                          </button>
                        </div>

                        {/* Hover Overlay showing product name and price */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bloom-darker/95 via-bloom-darker/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 sm:p-5">
                          <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-bloom-rose group-hover:to-bloom-gold transition-all duration-300 mb-1 truncate">
                              {item.name}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-300">
                              <span className="text-bloom-gold font-bold text-xs sm:text-sm">₹{item.price}</span>
                              <span className="flex items-center gap-1 text-bloom-neon font-medium">
                                <EyeIcon className="w-3.5 h-3.5" /> Expand
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL Component */}
      {lightboxIndex !== null && (
        <LightboxModal
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(idx) => setLightboxIndex(idx)}
          likes={likes}
          userLiked={userLiked}
          onToggleLike={toggleLike}
        />
      )}
    </div>
  )
}
