import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { products } from '../data/products'
import { api } from '../lib/api'
import { useCart } from '../store/cartStore'
import { useAuth } from '../store/authStore'
import { useWatchlist } from '../store/watchlistStore'
import { useToastStore } from '../store/toastStore'
import TiltCard from '../components/TiltCard'
import {
  StarIcon, CheckCircleIcon, FlowerIcon, HandIcon,
  GiftIcon, PlusIcon, MinusIcon, HeartIcon,
  PetalIcon, FlameIcon, SparkleIcon
} from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

export default function ProductDetail() {
  useSEO({
    title: "Bloomwire — Product Details",
    description: "Handcrafted pipe cleaner flower product. Made to order in Jaipur with premium chenille materials.",
    canonicalPath: "/#/shop"
  })

  const { slug } = useParams()
  const product = products.find((p) => p.slug === slug)
  const addItem = useCart((s) => s.addItem)
  const user = useAuth((s) => s.user)
  const addReviewReward = useAuth((s) => s.addReviewReward)
  const watchlistToggle = useWatchlist((s) => s.toggle)
  const watchlistIsInList = useWatchlist((s) => s.isInList)
  const showToast = useToastStore((s) => s.showToast)

  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  // Frequently Bought Together (N8)
  const fbtProducts = useMemo(() => {
    if (!product) return []
    const sameCat = products.filter((p) => p.category === product.category && p.slug !== product.slug)
    if (sameCat.length >= 2) {
      return sameCat.slice(0, 3)
    }
    const others = products.filter((p) => p.slug !== product.slug && p.category !== product.category)
    return [...sameCat, ...others].slice(0, 3)
  }, [product])

  const [fbtSelections, setFbtSelections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (fbtProducts.length > 0) {
      setFbtSelections(new Set(fbtProducts.map((p) => p.slug)))
    } else {
      setFbtSelections(new Set())
    }
  }, [product?.slug, fbtProducts])

  const selectedFbt = fbtProducts.filter((p) => fbtSelections.has(p.slug))
  const combinedPrice = product ? product.price + selectedFbt.reduce((sum, p) => sum + p.price, 0) : 0

  const handleAddAllToCart = () => {
    if (!product) return
    addItem({ slug: product.slug, name: product.name, price: product.price, image: product.image })
    selectedFbt.forEach((p) => {
      addItem({ slug: p.slug, name: p.name, price: p.price, image: p.image })
    })
    setAdded(true)
    showToast(`Added ${1 + selectedFbt.length} items to cart! 🌸`, 'cart')
    setTimeout(() => setAdded(false), 2500)
  }

  // Reviews state (N7)
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true)
  const [hasPurchasedProduct, setHasPurchasedProduct] = useState<boolean>(false)

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    setAdded(false)
    setQty(1)
    setActiveImage(0)
    setShowReviewForm(false)
    setReviewerName(user?.name || '')
    setReviewRating(5)
    setHoverRating(0)
    setReviewTitle('')
    setReviewComment('')
    setIsSubmitting(false)
    setReviewSubmitted(false)
    setReviewError('')
  }, [product, user])

  // Fetch reviews via api.getProductReviews(productId)
  useEffect(() => {
    let isMounted = true
    async function loadReviews() {
      if (!product?.slug) return
      setLoadingReviews(true)
      try {
        const res = await api.getProductReviews(product.slug)
        if (isMounted) {
          if (res && res.success && Array.isArray(res.data)) {
            setReviews(res.data)
          } else {
            setReviews([])
          }
        }
      } catch (err) {
        if (isMounted) setReviews([])
      } finally {
        if (isMounted) setLoadingReviews(false)
      }
    }
    loadReviews()
    return () => { isMounted = false }
  }, [product?.slug])

  // Check purchase eligibility via api.hasUserPurchased(email, productId)
  useEffect(() => {
    let isMounted = true
    async function checkPurchase() {
      if (user?.email && product?.slug) {
        try {
          const res = await api.hasUserPurchased(user.email, product.slug)
          if (isMounted) {
            const purchased = res && res.success && (res.data?.hasPurchased || res.hasPurchased)
            setHasPurchasedProduct(!!purchased)
          }
        } catch (err) {
          if (isMounted) setHasPurchasedProduct(false)
        }
      } else {
        if (isMounted) setHasPurchasedProduct(false)
      }
    }
    checkPurchase()
    return () => { isMounted = false }
  }, [user?.email, product?.slug])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Product not found</h1>
        <Link to="/shop" className="text-bloom-neon hover:underline">Back to Shop</Link>
      </div>
    )
  }

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)

  // Inject Product JSON-LD structured data
  useEffect(() => {
    if (!product) return
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description || product.longDescription || 'Handcrafted pipe cleaner flower',
      "image": product.image,
      "offers": { "@type": "Offer", "priceCurrency": "INR", "price": product.price, "availability": "https://schema.org/InStock" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": product.rating, "reviewCount": product.reviewCount }
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    script.id = 'product-jsonld'
    document.head.appendChild(script)
    return () => { document.getElementById('product-jsonld')?.remove() }
  }, [product])

  const handleAddToCart = () => {
    if (product.price === 0) return
    for (let i = 0; i < qty; i++) addItem({ slug: product.slug, name: product.name, price: product.price, image: product.image })
    setAdded(true)
    showToast('Added to cart 🌸', 'cart')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlistToggle = () => {
    watchlistToggle({ slug: product.slug, name: product.name, price: product.price, image: product.image })
    if (isWishlisted) {
      showToast('Removed from wishlist', 'wishlist')
    } else {
      showToast('Added to wishlist ❤️', 'wishlist')
    }
  }

  const isWishlisted = watchlistIsInList(product.slug)

  // Calculate rating stats
  const totalReviewsCount = reviews.length
  const avgRating = totalReviewsCount > 0
    ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalReviewsCount
    : 0

  const canReview = !!user && hasPurchasedProduct

  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate)
      if (isNaN(date.getTime())) return 'Recently'
      const diff = Date.now() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if (days === 0) return 'Today'
      if (days === 1) return '1 day ago'
      if (days < 7) return `${days} days ago`
      if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`
      return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
    } catch (e) {
      return 'Recently'
    }
  }

  // Submit review handler calling api.addReview()
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError('')
    if (!reviewerName.trim()) {
      setReviewError('Please enter your name')
      return
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write your review text')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.addReview({
        productId: product.slug,
        userEmail: user?.email || '',
        userName: reviewerName.trim(),
        rating: reviewRating,
        title: reviewTitle.trim() || 'Product Review',
        comment: reviewComment.trim(),
      })

      if (res && (res.success || res.data || res.id)) {
        setReviewSubmitted(true)
        if (addReviewReward) {
          addReviewReward(product.slug)
        }
        // Refetch reviews
        const updatedRes = await api.getProductReviews(product.slug)
        if (updatedRes && updatedRes.success && Array.isArray(updatedRes.data)) {
          setReviews(updatedRes.data)
        } else {
          setReviews((prev) => [
            {
              id: res.data?.id || res.id || Date.now().toString(),
              productId: product.slug,
              userEmail: user?.email || '',
              userName: reviewerName.trim(),
              rating: reviewRating,
              title: reviewTitle.trim() || 'Product Review',
              comment: reviewComment.trim(),
              created_date: new Date().toISOString(),
              verified: true,
            },
            ...prev,
          ])
        }
      } else {
        setReviewError(res?.error || res?.message || 'Failed to submit review')
      }
    } catch (err: any) {
      setReviewError(err.message || 'Error submitting review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const whyYouLove = [
    { Icon: FlowerIcon, title: 'Lasts for Years', desc: 'No wilting, no fading. Your bloom stays vibrant for years with proper care — a true keepsake.' },
    { Icon: HandIcon, title: 'Hand-Sculpted', desc: 'Every stem is individually twisted by Jaipur artisans. No two blooms are exactly alike.' },
    { Icon: SparkleIcon, title: 'Unique Personality', desc: 'Each bloom develops its own character through the hand-craft process.' },
    { Icon: GiftIcon, title: 'Eco-Friendly', desc: 'Reusable materials, zero-waste packaging, and a sustainable alternative to cut flowers.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6 text-[#9A9A9A]">
        <Link to="/" className="hover:text-bloom-rose transition">Home</Link>
        <span>›</span>
        <Link to="/shop" className="hover:text-bloom-rose transition">Shop</Link>
        <span>›</span>
        <Link to={'/shop?category=' + encodeURIComponent(product.category)} className="hover:text-bloom-rose transition">{product.category}</Link>
        <span>›</span>
        <span className="text-[#6B6B6B]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div>
          <TiltCard className="aspect-square rounded-2xl overflow-hidden glass" maxTilt={8}>
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </TiltCard>
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden glass cursor-pointer transition ${activeImage === i ? 'neon-border' : 'hover:opacity-70'}`}>
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.badges.length > 0 && (
            <div className="flex gap-2 mb-4">
              {product.badges.map((badge) => (
                <span key={badge} className="px-3 py-1 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-bold rounded-full neon-glow">{badge}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={16} className={i < Math.round(avgRating) ? 'text-bloom-gold fill-current' : 'text-[#a0918a]'} />
              ))}
            </div>
            <span className="text-sm text-[#8a7a6a]">
              {avgRating > 0 ? avgRating.toFixed(1) : '0.0'} · {totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">{product.name}</h1>
          <p className="text-sm text-[#a0918a] mb-2">SKU: {product.sku}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[#2d2418]">₹{product.price}</span>
            {product.originalPrice && <span className="text-xl text-[#a0918a] line-through">₹{product.originalPrice}</span>}
            {product.originalPrice && <span className="text-sm font-medium text-bloom-gold">Save ₹{product.originalPrice - product.price}</span>}
          </div>

          <div className="flex items-center gap-2 mb-6 glass rounded-xl px-4 py-3">
            <PetalIcon size={20} className="text-bloom-gold" />
            <span className="text-sm text-[#6b5d4f]">Earn <span className="font-bold text-bloom-gold">{product.petalsEarned} Petals</span> with this purchase</span>
          </div>

          <p className="text-[#8a7a6a] mb-6 leading-relaxed">{product.longDescription}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-[#6b5d4f]">Quantity</span>
            <div className="flex items-center gap-3 glass rounded-full px-2 py-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center hover:bg-white/70 transition"><MinusIcon size={16} /></button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center hover:bg-white/70 transition"><PlusIcon size={16} /></button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium text-lg shimmer-btn neon-glow hover:scale-105 transition"
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart 🌸'}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`w-14 h-14 rounded-full glass flex items-center justify-center transition ${isWishlisted ? 'text-bloom-rose' : 'text-[#8a7a6a] hover:text-[#2d2418]'}`}
            >
              <HeartIcon size={22} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Why You'll Love It */}
      <div className="mt-20">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8 text-center">Why You'll <span className="gradient-text">Love It</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyYouLove.map((item, idx) => (
            <div key={idx} className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10">
              <div className="w-12 h-12 rounded-xl bg-bloom-rose/10 text-bloom-neon flex items-center justify-center mb-4">
                <item.Icon size={22} />
              </div>
              <h3 className="font-serif font-bold text-[#2d2418] mb-2">{item.title}</h3>
              <p className="text-sm text-[#8a7a6a] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Bought Together (N8) */}
      {fbtProducts.length > 0 && (
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Bundle & Save</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418]">Frequently Bought Together</h2>
            <p className="text-sm text-[#8a7a6a] mt-2">
              <FlameIcon size={14} className="inline text-bloom-neon mr-1" />
              Complete your collection with these related items
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10">
            <div className="flex flex-col gap-3">
              {/* Current product (always included) */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-bloom-rose/10 border border-bloom-rose/30">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF8F3] shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#2d2418] truncate">{product.name}</p>
                  <p className="text-xs text-bloom-gold font-medium">₹{product.price}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-bloom-rose/20 text-bloom-neon font-medium border border-bloom-rose/30">
                  This Item (Included)
                </span>
              </div>

              {/* Related products */}
              {fbtProducts.map((p) => {
                const selected = fbtSelections.has(p.slug)
                return (
                  <label
                    key={p.slug}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition ${
                      selected ? 'bg-bloom-rose/5 border border-bloom-rose/20' : 'glass border border-[#2d2418]/10 hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        setFbtSelections((prev) => {
                          const next = new Set(prev)
                          if (next.has(p.slug)) next.delete(p.slug)
                          else next.add(p.slug)
                          return next
                        })
                      }}
                      className="w-4 h-4 accent-bloom-rose shrink-0"
                    />
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF8F3] shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#2d2418] truncate">{p.name}</p>
                      <p className="text-xs text-[#8a7a6a]">₹{p.price}</p>
                    </div>
                    <span className={`text-xs font-medium ${selected ? 'text-bloom-gold' : 'text-[#a0918a]'}`}>
                      +₹{p.price}
                    </span>
                  </label>
                )
              })}
            </div>

            {/* Combined price and Add All to Cart button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#2d2418]/10">
              <div className="text-center sm:text-left">
                <p className="text-xs text-[#8a7a6a] uppercase tracking-wider mb-1">
                  Combined Price ({1 + selectedFbt.length} items)
                </p>
                <p className="text-2xl font-bold text-[#2d2418]">
                  ₹{combinedPrice}
                </p>
              </div>
              <button
                onClick={handleAddAllToCart}
                className="px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition whitespace-nowrap"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews section (N7) */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">
            Customer <span className="gradient-text">Reviews</span>
          </h2>
        </div>

        {/* Header showing average rating and total review count */}
        <div className="glass-strong rounded-2xl p-6 mb-8 border border-[#2d2418]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center sm:text-left">
              <div className="text-4xl font-serif font-bold text-[#2d2418] mb-1">
                {avgRating > 0 ? avgRating.toFixed(1) : '0.0'}
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    size={18}
                    className={i < Math.round(avgRating) ? 'text-bloom-gold fill-current' : 'text-[#a0918a]'}
                  />
                ))}
              </div>
            </div>
            <div className="h-12 w-px bg-white/70 hidden sm:block" />
            <div>
              <p className="text-lg font-medium text-[#2d2418]">Overall Rating</p>
              <p className="text-sm text-[#8a7a6a]">
                {totalReviewsCount === 0
                  ? 'No reviews yet'
                  : `Based on ${totalReviewsCount} ${totalReviewsCount === 1 ? 'review' : 'reviews'}`}
              </p>
            </div>
          </div>

          {canReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium text-sm shimmer-btn neon-glow hover:scale-105 transition"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Verified buyers 'Write a Review' Form */}
        {canReview && showReviewForm && (
          <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8 border border-bloom-rose/30 shadow-xl">
            {reviewSubmitted ? (
              <div className="text-center py-6">
                <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-gold to-bloom-terracotta items-center justify-center mb-4 neon-glow">
                  <CheckCircleIcon size={32} className="text-[#2d2418]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2d2418] mb-2">Review Submitted!</h3>
                <p className="text-[#6b5d4f] text-sm mb-6">Thank you for sharing your feedback with the Bloomwire community.</p>
                <button
                  type="button"
                  onClick={() => { setShowReviewForm(false); setReviewSubmitted(false); }}
                  className="px-6 py-2.5 glass text-sm font-medium text-[#2d2418] rounded-full hover:bg-white/70 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-4 border-b border-[#2d2418]/10">
                  <span className="px-3 py-1 bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-[#2d2418] text-xs font-bold rounded-full">
                    Verified Purchaser
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-xs text-[#8a7a6a] hover:text-[#2d2418] transition"
                  >
                    Cancel
                  </button>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-6">Write Your Review</h3>

                {/* Reviewer Name */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#6b5d4f] mb-2">Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] focus:outline-none focus:border-bloom-rose transition"
                  />
                </div>

                {/* Rating Selector */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#6b5d4f] mb-2">Star Rating</label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition transform hover:scale-110"
                        >
                          <StarIcon
                            size={24}
                            className={star <= (hoverRating || reviewRating) ? 'text-bloom-gold fill-current' : 'text-[#a0918a]'}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-bloom-gold">
                      {reviewRating === 5 && '5/5 - Excellent'}
                      {reviewRating === 4 && '4/5 - Very Good'}
                      {reviewRating === 3 && '3/5 - Average'}
                      {reviewRating === 2 && '2/5 - Poor'}
                      {reviewRating === 1 && '1/5 - Terrible'}
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#6b5d4f] mb-2">Review Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Brief headline for your review"
                    className="w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] focus:outline-none focus:border-bloom-rose transition"
                  />
                </div>

                {/* Review Text */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#6b5d4f] mb-2">Review Text</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us about the quality, appearance, and your experience with this product..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] focus:outline-none focus:border-bloom-rose transition resize-none"
                  />
                </div>

                {reviewError && <p className="text-sm text-red-400 mb-4">{reviewError}</p>}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !reviewerName.trim() || !reviewComment.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#2d2418]/20 border-t-white rounded-full animate-spin inline-block" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 glass text-[#8a7a6a] rounded-full font-medium hover:bg-white/70 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* List of Individual Reviews / Empty state */}
        {loadingReviews ? (
          <div className="glass-strong rounded-2xl p-8 border border-[#2d2418]/10 text-center py-12">
            <div className="w-8 h-8 border-2 border-bloom-rose/30 border-t-bloom-neon rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#8a7a6a] text-sm">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-strong rounded-2xl p-8 border border-[#2d2418]/10 text-center py-12">
            <p className="text-[#6b5d4f] text-lg font-medium mb-2">No reviews yet — be the first to review!</p>
            {canReview && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium text-sm shimmer-btn neon-glow hover:scale-105 transition"
              >
                Write a Review
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review: any, idx: number) => {
              const name = review.userName || review.user_name || review.name || 'Verified Buyer'
              const dateVal = review.created_date || review.date || review.createdDate
              const formattedDate = dateVal ? formatDate(dateVal) : 'Recently'
              const starRating = Number(review.rating) || 5
              const text = review.comment || review.reviewText || ''
              const titleText = review.title || ''

              return (
                <div
                  key={review.id || idx}
                  className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bloom-rose/20 border border-bloom-rose/30 flex items-center justify-center">
                          <span className="font-bold text-bloom-neon">
                            {name[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#2d2418] text-sm">{name}</p>
                          <p className="text-xs text-[#a0918a]">{formattedDate}</p>
                        </div>
                      </div>
                      {review.verified !== false && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircleIcon size={12} className="text-emerald-400" />
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <StarIcon
                          key={j}
                          size={14}
                          className={j < starRating ? 'text-bloom-gold fill-current' : 'text-[#a0918a]'}
                        />
                      ))}
                    </div>

                    {titleText && <h4 className="font-medium text-[#2d2418] mb-2">{titleText}</h4>}
                    <p className="text-sm text-[#6b5d4f] leading-relaxed">{text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8 text-center">You May Also <span className="gradient-text">Like</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {related.map((p) => (
              <Link key={p.slug} to={`/product/${p.slug}`} className="group">
                <TiltCard className="glass rounded-2xl overflow-hidden" maxTilt={8}>
                  <div className="aspect-square overflow-hidden bg-[#FFF8F3]">
                    <div className="img-zoom w-full h-full"><img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" /></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#2d2418] group-hover:text-bloom-neon transition text-sm sm:text-base">{p.name}</h3>
                    <p className="text-sm font-medium text-[#2d2418] mt-1">₹{p.price}</p>
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Buy Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-[#2d2418]/10 p-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[10px] text-[#8a7a6a]">{product.name.length > 30 ? product.name.slice(0, 30) + '...' : product.name}</p>
          <p className="text-lg font-bold text-[#2d2418]">₹{product.price}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium text-sm shimmer-btn neon-glow"
        >
          {added ? '✓ Added!' : 'Add to Cart 🌸'}
        </button>
      </div>
    </div>
  )
}
