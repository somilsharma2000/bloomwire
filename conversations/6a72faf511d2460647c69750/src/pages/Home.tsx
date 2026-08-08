import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, useMemo } from 'react'
import { products, HERO_IMAGES, type Product } from '../data/products'
import TiltCard from '../components/TiltCard'
import DailyUpdates from '../components/DailyUpdates'
import {
  FlowerIcon,
  HandIcon,
  TruckIcon,
  GiftIcon,
  StarIcon,
  ArrowRightIcon,
  SparkleIcon,
  PetalIcon,
  ScissorsIcon,
  KeyIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../components/Icons'

// Helper function to shuffle an array using Fisher-Yates Math.random
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  // State for hero carousel
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselProducts = useMemo(() => products.filter((p) => p.featured), [])

  // Auto-advance hero carousel every 5 seconds
  useEffect(() => {
    if (carouselProducts.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselProducts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carouselProducts.length])

  // State for randomized featured products grid (8 items)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => {
    const feat = products.filter((p) => p.featured)
    return feat.length >= 8 ? feat.slice(0, 8) : products.slice(0, 8)
  })

  // Randomize featured products on each page load
  useEffect(() => {
    const featuredOnly = products.filter((p) => p.featured)
    const shuffledFeatured = shuffleArray(
      featuredOnly.length >= 4 ? featuredOnly : products
    )
    setFeaturedProducts(shuffledFeatured.slice(0, 8))
  }, [])

  // Scroll reveal animation observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [featuredProducts])

  // Floating particles
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 5.8 + 2) % 100}%`,
    delay: `${(i * 1.1) % 12}s`,
    duration: `${10 + (i % 6) * 2.5}s`,
    size: `${3 + (i % 4) * 2}px`,
  }))

  const ctaItems = [
    {
      category: 'Bouquets',
      title: 'Shop Bouquets',
      desc: 'Luxurious everlasting bouquets hand-twisted for every special moment & room accent.',
      link: '/shop?category=Bouquets',
      Icon: FlowerIcon,
      badge: 'Popular',
      gradient: 'from-bloom-rose/30 via-bloom-wine/20 to-transparent',
      borderColor: 'hover:border-bloom-rose/50',
    },
    {
      category: 'Gift Bundles',
      title: 'Build a Gift Bundle',
      desc: 'Curate a personalized set with custom flowers, mini pots & handwritten notes.',
      link: '/shop?category=Gift+Bundles',
      Icon: GiftIcon,
      badge: 'Best Gift',
      gradient: 'from-bloom-gold/30 via-bloom-terracotta/20 to-transparent',
      borderColor: 'hover:border-bloom-gold/50',
    },
    {
      category: 'DIY Kits',
      title: 'Try a DIY Kit',
      desc: 'Unleash your inner artist with premium chenille stems, wires & step-by-step guides.',
      link: '/shop?category=DIY+Kits',
      Icon: ScissorsIcon,
      badge: 'Craft Vibe',
      gradient: 'from-purple-500/30 via-bloom-rose/20 to-transparent',
      borderColor: 'hover:border-purple-400/50',
    },
    {
      category: 'Keychains',
      title: 'Browse Keychains',
      desc: 'Cute mini blooms to aestheticize your keys, tote bags, and backpacks.',
      link: '/shop?category=Keychains',
      Icon: KeyIcon,
      badge: 'Trending',
      gradient: 'from-emerald-500/30 via-bloom-sage/20 to-transparent',
      borderColor: 'hover:border-emerald-400/50',
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-center overflow-hidden py-10 sm:py-16">
        {/* Floating particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-bloom-rose/30 blur-[1px]"
              style={{
                left: p.left,
                bottom: '-20px',
                width: p.size,
                height: p.size,
                animation: `floatUp ${p.duration} linear infinite`,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* Tagline Badge & Headline */}
        <div className="max-w-4xl mx-auto text-center px-4 z-20 relative mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/15 text-bloom-neon text-xs sm:text-sm font-medium mb-4 shadow-lg">
            <SparkleIcon size={16} className="text-bloom-gold animate-pulse" />
            <span>Handcrafted Velvet Pipe Cleaner Artistry</span>
            <span className="w-1.5 h-1.5 rounded-full bg-bloom-neon animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-2 sm:mb-3">
            Hand-Twisted Blooms That <span className="gradient-text">Never Fade.</span>
          </h1>
        </div>

        {/* Dynamic Multi-Image Carousel Showcase */}
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 z-20 group min-h-[500px] sm:min-h-[480px] lg:min-h-[440px] flex items-center">
          {carouselProducts.map((product, index) => {
            const isEven = index % 2 === 0
            const isCurrent = currentSlide === index

            return (
              <div
                key={product.slug}
                className={`absolute inset-x-4 sm:inset-x-6 top-0 bottom-0 transition-opacity duration-700 ease-in-out flex items-center justify-center ${
                  isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="w-full glass-dark rounded-3xl p-5 sm:p-8 lg:p-10 border border-white/15 shadow-2xl backdrop-blur-xl">
                  <div
                    className={`flex flex-col ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } items-center gap-6 sm:gap-8 lg:gap-12`}
                  >
                    {/* Product Image (Top on mobile, alternating left/right on desktop) */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center">
                      <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden glass border border-white/20 shadow-2xl group/img flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-full glass-dark border border-bloom-rose/40 text-bloom-neon text-[11px] font-semibold tracking-wide uppercase shadow-md">
                            {product.badges?.[0] || product.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info (Below on mobile, alternating right/left on desktop) */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-3 sm:space-y-4">
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-bloom-rose/20 text-bloom-neon text-xs font-medium border border-bloom-rose/30">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-bloom-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              size={14}
                              className={i < Math.floor(product.rating) ? 'fill-bloom-gold text-bloom-gold' : 'text-gray-500'}
                            />
                          ))}
                          <span className="text-xs text-gray-300 font-medium ml-1">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                        <Link to={`/product/${product.slug}`} className="hover:text-bloom-rose transition-colors">
                          {product.name}
                        </Link>
                      </h2>

                      <div className="flex items-baseline justify-center lg:justify-start gap-3">
                        <span className="text-2xl sm:text-3xl font-extrabold text-bloom-neon">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm sm:text-base text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                        {product.description}
                      </p>

                      <div className="pt-2 flex flex-row items-center justify-center lg:justify-start gap-3">
                        <Link
                          to={`/product/${product.slug}`}
                          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white font-medium rounded-full shimmer-btn neon-glow transition flex items-center justify-center gap-2 group/btn hover:scale-105 text-xs sm:text-sm"
                        >
                          View Product <ArrowRightIcon size={16} className="group-hover/btn:translate-x-1 transition" />
                        </Link>

                        <Link
                          to="/shop"
                          className="px-5 sm:px-6 py-2.5 sm:py-3 glass text-white font-medium rounded-full border border-white/20 hover:border-bloom-neon/50 hover:bg-white/10 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          Shop All
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Left Arrow Button (visible on hover or mobile touch) */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length)}
            aria-label="Previous Slide"
            className="absolute -left-2 sm:left-1 lg:-left-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full glass border border-white/20 text-white hover:bg-bloom-rose/50 hover:border-bloom-rose/70 transition shadow-xl backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeftIcon size={20} />
          </button>

          {/* Right Arrow Button (visible on hover or mobile touch) */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselProducts.length)}
            aria-label="Next Slide"
            className="absolute -right-2 sm:right-1 lg:-right-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full glass border border-white/20 text-white hover:bg-bloom-rose/50 hover:border-bloom-rose/70 transition shadow-xl backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="mt-6 flex items-center justify-center gap-2.5 z-20">
          {carouselProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-8 bg-bloom-rose shadow-[0_0_12px_rgba(244,114,182,0.8)]'
                  : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Social Proof Pills */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-400 z-20 relative max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-bloom-rose border border-bloom-dark flex items-center justify-center text-[10px] text-white font-bold">🌸</div>
              <div className="w-7 h-7 rounded-full bg-bloom-wine border border-bloom-dark flex items-center justify-center text-[10px] text-white font-bold">🌷</div>
              <div className="w-7 h-7 rounded-full bg-bloom-terracotta border border-bloom-dark flex items-center justify-center text-[10px] text-white font-bold">🌻</div>
            </div>
            <span className="text-gray-300 font-medium">500+ Gen Z Homes Loved</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-bloom-gold">
            <StarIcon size={16} />
            <StarIcon size={16} />
            <StarIcon size={16} />
            <StarIcon size={16} />
            <StarIcon size={16} />
            <span className="text-gray-300 font-medium ml-1">4.9 / 5 Rating</span>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS BAR */}
      <section className="border-y border-white/10 bg-bloom-darker/60 py-6 glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bloom-rose/10 border border-bloom-rose/20 flex items-center justify-center text-bloom-rose">
                <HandIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Hand-Twisted</p>
                <p className="text-[11px] text-gray-400">Sculpted stem by stem</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bloom-gold/10 border border-bloom-gold/20 flex items-center justify-center text-bloom-gold">
                <FlowerIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Everlasting Beauty</p>
                <p className="text-[11px] text-gray-400">No watering or wilting</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bloom-neon/10 border border-bloom-neon/20 flex items-center justify-center text-bloom-neon">
                <TruckIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Free Gift Wrap & Shipping</p>
                <p className="text-[11px] text-gray-400">On orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <GiftIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Custom Notes & Lights</p>
                <p className="text-[11px] text-gray-400">Aesthetic ready-to-gift box</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS / TRENDING NOW */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bloom-rose/10 border border-bloom-rose/20 text-bloom-neon text-xs font-medium mb-3">
              <SparkleIcon size={14} className="text-bloom-gold" />
              <span>Trending Gen Z Favs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Best-Selling <span className="gradient-text">Velvet Stems</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 text-sm font-medium text-bloom-rose hover:text-bloom-neon transition flex items-center gap-1 group"
          >
            View All Products <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product, i) => (
            <div key={product.slug} className="reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              <TiltCard
                className="h-full rounded-2xl overflow-hidden glass border border-white/10 hover:border-bloom-rose/40 transition-all duration-300 flex flex-col group shadow-xl hover:shadow-bloom-rose/20"
                maxTilt={10}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-bloom-darker/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-bloom-dark/80 text-bloom-neon border border-bloom-neon/30 backdrop-blur-md">
                        {product.badges[0]}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center text-white/70 hover:text-bloom-rose hover:border-bloom-rose/50 transition shadow-md"
                      aria-label="Add to Wishlist"
                    >
                      <HeartIcon size={16} />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <Link
                      to={`/product/${product.slug}`}
                      className="w-full py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-semibold rounded-xl text-center shimmer-btn shadow-lg"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-medium text-bloom-gold/90 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-bloom-gold text-xs">
                        <StarIcon size={12} className="fill-bloom-gold text-bloom-gold" />
                        <span className="font-bold">{product.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-white text-lg group-hover:text-bloom-rose transition line-clamp-1">
                      <Link to={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-bloom-neon">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through ml-1.5">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-xs font-semibold text-white/80 group-hover:text-bloom-neon flex items-center gap-1 transition"
                    >
                      Details <ArrowRightIcon size={12} />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY & EXPERIENCE HIGHLIGHTS */}
      <section className="py-16 sm:py-24 bg-bloom-darker/40 border-y border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bloom-wine/20 border border-bloom-wine/30 text-bloom-rose text-xs font-medium mb-3">
              <PetalIcon size={14} className="text-bloom-rose" />
              <span>Curated Creations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
              Explore Our <span className="gradient-text">Artisan Worlds</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Whether you want a finished luxury centerpiece, a custom keychain charm, or the joy of crafting your own stems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ctaItems.map((item) => {
              const IconComp = item.Icon
              return (
                <Link
                  key={item.category}
                  to={item.link}
                  className="group relative rounded-3xl overflow-hidden glass p-8 border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col justify-between min-h-[280px] shadow-xl hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl glass border border-white/20 flex items-center justify-center text-bloom-neon group-hover:scale-110 transition duration-300 shadow-lg">
                        <IconComp size={28} />
                      </div>
                      <span className="px-3 py-1 rounded-full glass text-[10px] font-bold text-white/80 border border-white/10 uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-bloom-neon transition">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center text-xs font-bold text-bloom-rose group-hover:text-bloom-neon gap-1.5 transition">
                    Explore <ArrowRightIcon size={14} className="group-hover:translate-x-1.5 transition" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. VISUAL INSPIRATION & ARTISAN GALLERY */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bloom-gold/10 border border-bloom-gold/20 text-bloom-gold text-xs font-medium mb-3">
            <SparkleIcon size={14} />
            <span>Aesthetic Living</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Designed for <span className="gradient-text">Cozy Aesthetics</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            Velvet stem arrangements captured in real living spaces, study setups, and cozy bedrooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <TiltCard className="aspect-[4/5] rounded-3xl overflow-hidden glass border border-white/10 group shadow-xl" maxTilt={12}>
              <div className="relative w-full h-full">
                <img
                  src={HERO_IMAGES.homeDecor}
                  alt="Aesthetic room decor with velvet flowers"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <p className="text-xs text-bloom-gold font-semibold uppercase tracking-wider">Room Accents</p>
                  <h3 className="text-lg font-serif font-bold text-white">Cozy Bedroom Vibe</h3>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 group shadow-xl" maxTilt={12}>
              <div className="relative w-full h-full">
                <img
                  src={HERO_IMAGES.workspace}
                  alt="Desk setup with plush stems"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <p className="text-xs text-bloom-neon font-semibold uppercase tracking-wider">Desk Aesthetics</p>
                  <h3 className="text-lg font-serif font-bold text-white">Study & Work Inspiration</h3>
                </div>
              </div>
            </TiltCard>
          </div>

          <div className="space-y-6">
            <TiltCard className="aspect-square rounded-3xl overflow-hidden glass border border-white/10 group shadow-xl" maxTilt={12}>
              <div className="relative w-full h-full">
                <img
                  src={HERO_IMAGES.flatLay}
                  alt="Flatlay of hand-twisted pipe cleaner flowers"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <p className="text-xs text-bloom-rose font-semibold uppercase tracking-wider">Artisan Process</p>
                  <h3 className="text-lg font-serif font-bold text-white">Handcrafted Precision</h3>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 group shadow-xl" maxTilt={12}>
              <div className="relative w-full h-full">
                <img
                  src={HERO_IMAGES.giftWrap}
                  alt="Gift box with fairy lights and ribbon"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <p className="text-xs text-bloom-gold font-semibold uppercase tracking-wider">Unboxing Experience</p>
                  <h3 className="text-lg font-serif font-bold text-white">Signature Gift Packaging</h3>
                </div>
              </div>
            </TiltCard>
          </div>

          <div className="space-y-6 md:col-span-1">
            <TiltCard className="aspect-[16/9] md:aspect-[4/5] rounded-3xl overflow-hidden glass border border-white/10 group shadow-xl" maxTilt={12}>
              <div className="relative w-full h-full">
                <img
                  src={HERO_IMAGES.shelves}
                  alt="Shelves decorated with plush potted blooms"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <p className="text-xs text-bloom-neon font-semibold uppercase tracking-wider">Shelfie Goals</p>
                  <h3 className="text-lg font-serif font-bold text-white">Everlasting Gallery Wall</h3>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 5. DAILY UPDATES & REWARDS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <DailyUpdates />
      </section>
    </div>
  )
}
