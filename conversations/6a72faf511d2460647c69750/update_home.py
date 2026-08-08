import re

home_code = '''import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { products, HERO_IMAGES, type Product } from '../data/products'
import TiltCard from '../components/TiltCard'
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
  ShieldIcon,
  ClockIcon,
  MailIcon,
  CartIcon,
  PlantIcon,
  InstagramIcon,
  CheckIcon,
} from '../components/Icons'
import { useReviewStore } from '../store/reviewStore'
import { useCart } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { useSEO } from '../hooks/useSEO'

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function Home() {
  useSEO({
    title: "Bloomwire — Handcrafted Pipe Cleaner Flowers | Jaipur",
    description: "Handcrafted pipe cleaner flowers that last for years. Shop bouquets, keychains, potted decor, DIY kits and gift bundles. Free shipping above Rs.499.",
    canonicalPath: "/"
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const addItem = useCart((s) => s.addItem)
  const showToast = useToastStore((s) => s.showToast)

  const [floatingProducts, setFloatingProducts] = useState<Product[]>(() =>
    products.slice(0, 4)
  )
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => {
    const feat = products.filter((p) => p.featured)
    return feat.length >= 8 ? feat.slice(0, 8) : products.slice(0, 8)
  })
  const [subscribed, setSubscribed] = useState(false)
  const [totalDonations, setTotalDonations] = useState('₹0')

  useEffect(() => {
    const shuffledAll = shuffleArray(products)
    setFloatingProducts(shuffledAll.slice(0, 4))

    const featuredOnly = products.filter((p) => p.featured)
    const shuffledFeatured = shuffleArray(
      featuredOnly.length >= 4 ? featuredOnly : products
    )
    setFeaturedProducts(shuffledFeatured.slice(0, 8))
  }, [])

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

  // Attempt to fetch total donations or default to ₹0
  useEffect(() => {
    try {
      fetch(import.meta.env.VITE_BACKEND_URL || 'https://elara-89a373b9.base44.app/functions/bloomwireApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getTotalDonations' })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.totalFormatted) setTotalDonations(data.totalFormatted)
        else if (data && data.total) setTotalDonations(`₹${data.total}`)
      })
      .catch(() => {})
    } catch {}
  }, [])

  // Floating particles with multi-color pastel petals
  const pastelColors = ['#ffb7c5', '#ffd5a5', '#c8b4e6', '#b4dcc8', '#f5c563', '#a8c4a0']
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 5.8 + 2) % 100}%`,
    delay: `${(i * 1.1) % 12}s`,
    duration: `${10 + (i % 6) * 2.5}s`,
    size: `${4 + (i % 4) * 2}px`,
    color: pastelColors[i % pastelColors.length],
  }))

  const categoryBubbles = [
    {
      name: 'Bouquets',
      link: '/shop?category=Bouquets',
      image: products.find((p) => p.category === 'Bouquets')?.image || HERO_IMAGES.flatLay,
    },
    {
      name: 'Single Stems',
      link: '/shop?category=Single+Flowers',
      image: products.find((p) => p.category === 'Single Flowers')?.image || HERO_IMAGES.crafting,
    },
    {
      name: 'Keychains',
      link: '/shop?category=Keychains',
      image: products.find((p) => p.category === 'Keychains')?.image || HERO_IMAGES.workspace,
    },
    {
      name: 'Potted Decor',
      link: '/shop?category=Potted+Decor',
      image: products.find((p) => p.category === 'Potted Decor')?.image || HERO_IMAGES.homeDecor,
    },
    {
      name: 'DIY Kits',
      link: '/shop?category=DIY+Kits',
      image: products.find((p) => p.category === 'DIY Kits')?.image || HERO_IMAGES.crafting,
    },
    {
      name: 'Gift Bundles',
      link: '/shop?category=Gift+Bundles',
      image: products.find((p) => p.category === 'Gift Bundles')?.image || HERO_IMAGES.giftWrap,
    },
    {
      name: 'Custom Orders',
      link: '/shop?category=Custom+Orders',
      image: HERO_IMAGES.shelves,
    },
  ]

  const instaImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80', alt: 'Pipe cleaner bouquet styling' },
    { id: 2, url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80', alt: 'Pastel flower arrangement' },
    { id: 3, url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80', alt: 'Handcrafted floral art' },
    { id: 4, url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80', alt: 'Aesthetic desk flower pot' },
    { id: 5, url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&q=80', alt: 'Everlasting rose charm' },
    { id: 6, url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80', alt: 'Bloomwire community gift box' },
  ]

  return (
    <div className="relative overflow-hidden bg-[#FFF8F3] text-[#2D2D2D]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden py-12 sm:py-16 lg:py-0">
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#ffb7c5] opacity-[0.07] rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-[#ffd5a5] opacity-[0.06] rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-[#c8b4e6] opacity-[0.07] rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute opacity-80 blur-[0.5px]"
              style={{
                left: p.left,
                bottom: '-20px',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: '50% 10% 50% 10%',
                transform: `rotate(${p.id * 20}deg)`,
                animation: `floatUp ${p.duration} linear infinite`,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[75vh]">
            {/* LEFT: Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-bloom-rose/30 text-bloom-wine text-xs sm:text-sm font-medium mb-6 shadow-sm animate-fade-in">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bloom-rose opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bloom-rose" />
                </span>
                <span>Handcrafted Velvet Pipe Cleaner Artistry</span>
                <SparkleIcon size={14} className="text-bloom-gold" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2D2D2D] tracking-tight leading-[1.05] mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Hand-Twisted Blooms
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
                That <span className="gradient-text-cool">Last & Last.</span>
              </h1>

              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="h-[2px] w-12 bg-gradient-to-r from-bloom-rose to-transparent rounded-full" />
                <div className="h-1 w-1 rounded-full bg-bloom-gold" />
                <div className="h-[2px] w-20 bg-gradient-to-r from-bloom-gold/40 to-transparent rounded-full" />
              </div>

              <p className="text-[#6B6B6B] text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: '0.25s' }}>
                Plush, vibrant flower arrangements and DIY craft kits — sculpted from high-density chenille stems for an aesthetic look that lasts for years with proper care
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white font-medium rounded-full shimmer-btn shadow-lg shadow-bloom-rose/25 hover:shadow-xl transition flex items-center justify-center gap-2 group hover:scale-105 text-base"
                >
                  Explore Collections <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition" />
                </Link>
                <button
                  onClick={() => {
                    document.getElementById('featured-blooms')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white/90 text-[#2D2D2D] font-medium rounded-full border border-gray-200 hover:border-bloom-rose/40 hover:bg-white transition flex items-center justify-center gap-2 text-base shadow-sm"
                >
                  Shop Bestsellers <SparkleIcon size={16} className="text-bloom-gold" />
                </button>
              </div>

              {/* Required Flower Quote below CTAs */}
              <p className="italic font-serif text-[#9A9A9A] text-sm text-center lg:text-left mb-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                ✿ Every flower is a soul blossoming in nature. — Gérard de Nerval ✿
              </p>

              {/* Quick stats row */}
              <div className="relative flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-6 border-t border-gray-200/60 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-serif font-bold gradient-text">18+</p>
                  <p className="text-[11px] sm:text-xs text-[#6B6B6B] mt-0.5">Unique Designs</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-bloom-gold">100%</p>
                  <p className="text-[11px] sm:text-xs text-[#6B6B6B] mt-0.5">Hand-Twisted</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-bloom-wine">5%</p>
                  <p className="text-[11px] sm:text-xs text-[#6B6B6B] mt-0.5">Back in Petals</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />
                <div className="text-center lg:text-left hidden sm:block">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} size={14} className="text-bloom-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#6B6B6B] mt-1">Hand-Crafted Care</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Featured Product Showcase */}
            <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: '0.35s' }}>
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-br from-bloom-rose via-bloom-gold to-bloom-sage rounded-full" />
              {floatingProducts[0] && (
                <Link to={`/product/${floatingProducts[0].slug}`} className="group block">
                  <TiltCard
                    className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden bg-white border border-gray-100 transition-all duration-500 shadow-md"
                    maxTilt={12}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={floatingProducts[0].image}
                        alt={floatingProducts[0].name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {floatingProducts[0].badges && floatingProducts[0].badges.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <span className="bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            {floatingProducts[0].badges[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </TiltCard>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR — Soft peach tint #FFF0E8 */}
      <section className="bg-[#FFF0E8] border-y border-amber-100/60 py-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🇮🇳</span>
              <span className="text-xs sm:text-sm font-medium text-[#2D2D2D]">Handcrafted in Jaipur Studio</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TruckIcon size={18} className="text-bloom-wine" />
              <span className="text-xs sm:text-sm font-medium text-[#2D2D2D]">Free Shipping Above ₹499</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FlowerIcon size={18} className="text-bloom-rose" />
              <span className="text-xs sm:text-sm font-medium text-[#2D2D2D]">100% Everlasting Chenille</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <PetalIcon size={18} className="text-bloom-gold" />
              <span className="text-xs sm:text-sm font-medium text-[#2D2D2D]">5% Back in Petals</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW: DOG HOME FOUNDATION CHARITY BANNER — Soft peach-to-rose gradient bg #FFF0E8 → #FDF2F8 */}
      <section className="bg-gradient-to-r from-[#FFF0E8] to-[#FDF2F8] py-12 sm:py-16 relative z-10 overflow-hidden border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Dog image card with badge */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-rose-100/80 bg-white">
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80"
                alt="Rescued Dog at Dog Home Foundation, Jodhpur"
                className="w-full h-[280px] sm:h-[360px] object-cover"
                onError={(e) => {
                  // Fallback if unsplash fails
                  e.currentTarget.style.display = 'none'
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<div className="w-full h-[280px] sm:h-[360px] bg-[#FDF2F8] rounded-2xl flex flex-col items-center justify-center p-6 text-center"><span className="text-6xl mb-3">🐕</span><p className="text-sm font-serif font-semibold text-[#2D2D2D]">Dog Home Foundation, Jodhpur</p></div>'
                  }
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-[#2D2D2D] shadow-md flex items-center gap-2 border border-gray-100">
                <span className="text-base">🐕</span> Rescued & Cared for at Dog Home Foundation, Jodhpur
              </div>
            </div>

            {/* Right: Charity info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-bloom-wine text-xs font-bold uppercase tracking-wider mb-3">
                <HeartIcon size={14} className="text-bloom-rose fill-current" /> Giving Back
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] mb-4 leading-tight">
                Every Bloom Gives a Dog a Home
              </h2>
              <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed mb-6">
                2% of every order goes to Dog Home Foundation, Jodhpur — Rajasthan's largest animal shelter caring for 800+ injured and stray dogs. Your flowers don't just last forever — they feed, heal, and shelter a voiceless friend.
              </p>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-sm mb-6 inline-block w-full sm:w-auto">
                <p className="text-xl sm:text-2xl font-bold text-bloom-rose flex items-center gap-2 font-serif">
                  🌸 {totalDonations} donated by Bloomwire customers
                </p>
              </div>

              <div>
                <Link
                  to="/giving"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 transition text-sm"
                >
                  See Our Impact <ArrowRightIcon size={16} />
                </Link>
                <p className="text-xs text-[#9A9A9A] mt-3 flex items-center gap-1">
                  In partnership with Dog Home Foundation, Jodhpur 🐾
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY BUBBLES (REPLACE rectangular cards) */}
      <section className="bg-[#FFF8F3] py-14 sm:py-20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium tracking-widest text-bloom-wine uppercase mb-2 flex items-center justify-center gap-1.5">
            <SparkleIcon size={14} /> Find Your Aesthetic
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D2D2D] mb-8">
            Shop by Category
          </h2>

          <div className="flex overflow-x-auto justify-start md:justify-center gap-4 sm:gap-6 pb-4 px-2 no-scrollbar">
            {categoryBubbles.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="flex flex-col items-center gap-2.5 flex-shrink-0 group cursor-pointer"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-sm border border-gray-100 p-1 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:ring-2 group-hover:ring-bloom-rose/40">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-medium text-[#2D2D2D] text-center max-w-[90px] group-hover:text-bloom-rose transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED BLOOMS (RENAME from Bestsellers) — Soft gold tint #FEF9E7 */}
      <section id="featured-blooms" className="bg-[#FEF9E7] py-16 sm:py-24 relative z-10 overflow-hidden border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 reveal">
            <div>
              <p className="text-xs font-medium tracking-widest text-bloom-rose uppercase mb-2 flex items-center gap-1.5">
                <SparkleIcon size={14} /> Handcrafted Favourites
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D]">
                Featured Blooms
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-bloom-rose hover:text-bloom-wine transition"
            >
              View All Products →
            </Link>
          </div>

          {/* Required Flower Quote below heading */}
          <p className="italic font-serif text-[#9A9A9A] text-sm text-center sm:text-left mb-8">
            ✿ Flowers are the music of the ground. From earth's lips spoken without sound. — Edwin Curran ✿
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts.map((product, i) => (
              <div key={product.slug} className="reveal group flex flex-col" style={{ transitionDelay: `${i * 0.06}s` }}>
                <Link to={`/product/${product.slug}`} className="block h-full flex flex-col justify-between bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-bloom-rose/30 transition-all duration-300">
                  <div>
                    <div className="aspect-square overflow-hidden bg-[#FFF8F3] rounded-xl relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.badges && product.badges.length > 0 && (
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {product.badges[0]}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="absolute top-2 right-2 bg-bloom-gold text-[#2D2D2D] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Sale
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-[#2D2D2D] text-sm sm:text-base group-hover:text-bloom-rose transition line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 line-clamp-1">{product.description}</p>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#2D2D2D]">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#9A9A9A] line-through">₹{product.originalPrice}</span>
                      )}
                    </div>

                    {/* ALWAYS VISIBLE 'Add to Cart' button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addItem(product)
                        showToast(`${product.name} added to cart! 🌸`, 'cart')
                      }}
                      className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      <CartIcon size={14} /> Add to Cart
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR STORY (Moved up, trimmed to 2-3 sentences + 1 image) — Soft gold tint #FEF9E7 */}
      <section className="bg-[#FEF9E7] py-16 sm:py-20 relative z-10 overflow-hidden border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: 1 Image */}
            <div className="lg:col-span-5 reveal">
              <div className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-md aspect-[4/3]">
                <img
                  src={HERO_IMAGES.crafting}
                  alt="Artisan sculpting pipe cleaner flower in Jaipur"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right: Story Text trimmed to 2-3 sentences */}
            <div className="lg:col-span-7 reveal">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-amber-200 text-bloom-wine text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <SparkleIcon size={12} className="text-bloom-gold" /> Jaipur Artisanship
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] mb-4">
                Our Story
              </h2>

              <p className="text-[#6B6B6B] text-base sm:text-lg leading-relaxed mb-6">
                Born in a cozy Jaipur studio, Bloomwire creates everlasting velvet pipe cleaner blooms individually sculpted by hand. Each stem combines artisanal Indian craftsmanship with a modern aesthetic, giving you flowers that never wilt or fade. From statement bouquets to desk companions, our creations bring eternal color and joy into your home.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="bg-white/90 rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
                  <p className="text-xl font-serif font-bold text-bloom-wine">100%</p>
                  <p className="text-[10px] text-[#6B6B6B] uppercase">Hand-Twisted</p>
                </div>
                <div className="bg-white/90 rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
                  <p className="text-xl font-serif font-bold text-bloom-rose">Jaipur</p>
                  <p className="text-[10px] text-[#6B6B6B] uppercase">Studio Crafted</p>
                </div>
                <div className="bg-white/90 rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
                  <p className="text-xl font-serif font-bold text-bloom-gold">Years</p>
                  <p className="text-[10px] text-[#6B6B6B] uppercase">Of Vibrant Color</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS (Moved down) — Soft lavender tint #F8F4FD */}
      <section className="bg-[#F8F4FD] py-16 sm:py-20 relative z-10 overflow-hidden border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-xs font-medium tracking-widest text-purple-700 uppercase mb-2">Simple & Heartfelt</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D]">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center reveal">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D2D2D] mb-2">Hand-Crafted Stems</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Passionate artisans shape high-density velvet chenille wires petal by petal in our Jaipur studio.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D2D2D] mb-2">Thoughtful Packaging</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Safely wrapped in aesthetic tissue with optional fairy lights and custom handwritten gift notes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D2D2D] mb-2">Everlasting Joy</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Display in your home or gift to loved ones — zero watering, zero fading, 100% eternal beauty.
              </p>
            </div>
          </div>

          {/* Required Flower Quote at end of How It Works */}
          <p className="italic font-serif text-[#9A9A9A] text-sm text-center mt-10 reveal">
            ✿ The earth laughs in flowers. — Ralph Waldo Emerson ✿
          </p>
        </div>
      </section>

      {/* 8. LIMITED EDITION DROP — Soft lavender tint #F8F4FD */}
      <section className="bg-[#F8F4FD] py-12 sm:py-16 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm relative overflow-hidden reveal">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                    Next Drop
                  </span>
                  <span className="text-xs text-[#6B6B6B]">Aug 20, 2026 • 11:59 PM IST</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2D2D2D] mb-1">Midnight Bloom Collection</h3>
                <p className="text-xs sm:text-sm text-[#6B6B6B]">
                  A limited run of 20 hand-sculpted midnight-blue roses with silver wire stems. Each one numbered and signed.
                </p>
              </div>

              <div className="text-center flex-shrink-0">
                <p className="text-xs text-[#9A9A9A] mb-1">Drop starts in</p>
                <div className="flex gap-2 justify-center mb-3">
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 min-w-[42px]">
                    <p className="text-base font-bold text-purple-700 font-mono">12</p>
                    <p className="text-[8px] text-[#6B6B6B]">DAYS</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 min-w-[42px]">
                    <p className="text-base font-bold text-purple-700 font-mono">07</p>
                    <p className="text-[8px] text-[#6B6B6B]">HRS</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 min-w-[42px]">
                    <p className="text-base font-bold text-purple-700 font-mono">23</p>
                    <p className="text-[8px] text-[#6B6B6B]">MIN</p>
                  </div>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex px-5 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full text-xs font-medium shadow-sm hover:scale-105 transition"
                >
                  Join Waitlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REWARDS / PETALS — Soft mint tint #F0F8F0 */}
      <section className="bg-[#F0F8F0] py-16 sm:py-20 relative z-10 overflow-hidden border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <PetalIcon size={14} className="text-emerald-600" /> Petals Loyalty Program
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] mb-3">
            Bloom Rewards & Petals 🌸
          </h2>
          <p className="text-[#6B6B6B] text-sm sm:text-base max-w-md mx-auto mb-10">
            Earn 5% back in Petals on every order & unlock exclusive reward blooms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <PetalIcon size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2D2D] mb-1">Earn 5% Back</h3>
              <p className="text-xs text-[#6B6B6B]">Collect Petals on every bouquet, keychain & DIY kit you purchase.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <GiftIcon size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2D2D] mb-1">Exclusive Freebies</h3>
              <p className="text-xs text-[#6B6B6B]">Claim bonus keychains, single stems & ceramic pots with your Petals balance.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <SparkleIcon size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2D2D] mb-1">Raffles & Perks</h3>
              <p className="text-xs text-[#6B6B6B]">Get early drop access and entry tickets into monthly flower giveaways.</p>
            </div>
          </div>

          <Link
            to="/rewards"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white font-medium rounded-full shadow-md hover:scale-105 transition text-sm"
          >
            Explore Rewards Program <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS — Soft rose tint #FDF2F8 */}
      <section className="bg-[#FDF2F8] py-16 sm:py-20 relative z-10 overflow-hidden border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-xs font-medium tracking-widest text-bloom-rose uppercase mb-2">Customer Love</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D]">
              Real Reviews, <span className="gradient-text">Real Blooms</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 max-w-md mx-auto">
              Only verified purchasers can review our products. Handcrafted with love in Jaipur, India. 🌸
            </p>
          </div>

          {(() => {
            const allReviews = (useReviewStore.getState().reviews || []) as any[]
            const recentReviews = allReviews.slice(0, 3)

            if (recentReviews.length === 0) {
              // Required Empty state fix: show 3 placeholder cards
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: '🌸', title: 'Review coming soon' },
                    { icon: '🌷', title: 'Review coming soon' },
                    { icon: '🌻', title: 'Review coming soon' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px]"
                    >
                      <span className="text-3xl mb-3">{item.icon}</span>
                      <h3 className="font-serif font-bold text-[#2D2D2D] text-lg mb-2">{item.title}</h3>
                      <p className="text-xs text-[#6B6B6B] leading-relaxed">
                        Be among the first to share your Bloomwire experience — earn 10 Petals when you do!
                      </p>
                    </div>
                  ))}
                </div>
              )
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentReviews.map((review: any, i: number) => (
                  <div key={review.id || i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm reveal">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-rose to-bloom-wine flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {review.userName ? review.userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'BW'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2D2D2D]">{review.userName || 'Verified Buyer'}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} size={10} className={s <= (review.rating || 5) ? 'text-bloom-gold fill-current' : 'text-gray-300'} />
                          ))}
                          {review.verified && <span className="text-[10px] text-emerald-700 ml-1">✓ Verified</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </section>

      {/* 11. NEW: INSTAGRAM FEED 'From Our Community' — Warm cream bg #FFF8F3 */}
      <section className="bg-[#FFF8F3] py-16 sm:py-20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 reveal">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] mb-2">
              From Our Community 📸
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B]">
              Follow us <span className="font-semibold text-bloom-rose">@bloomwire._</span> for daily flower styling & behind-the-scenes magic
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {instaImages.map((img) => (
              <a
                key={img.id}
                href="https://www.instagram.com/bloomwire._/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 block"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                  <InstagramIcon size={24} />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/bloomwire._/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs sm:text-sm font-medium shadow-sm hover:scale-105 transition"
            >
              <InstagramIcon size={16} /> Follow us @bloomwire._
            </a>
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER — Soft peach tint #FFF0E8 */}
      <section className="bg-[#FFF0E8] py-16 sm:py-20 relative z-10 overflow-hidden border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-sm text-center reveal">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-bloom-wine text-[10px] font-bold uppercase tracking-widest mb-4">
              <MailIcon size={12} /> Join the Bloom Circle
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D] mb-3">
              Get <span className="gradient-text">15% Off</span> Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mb-6 max-w-md mx-auto leading-relaxed">
              Subscribe for early access to new drops, exclusive offers, and flower styling tips. Plus get a 15% off code instantly.
            </p>

            {subscribed ? (
              <div className="max-w-md mx-auto space-y-3">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center">
                  <p className="text-xs sm:text-sm text-emerald-800 font-medium mb-1">✓ You're subscribed!</p>
                  <p className="text-xs text-[#6B6B6B]">Check your inbox for your 15% off coupon code.</p>
                </div>
                <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium shadow-sm hover:scale-105 transition">
                  Start Shopping <ArrowRightIcon size={14} />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.currentTarget.querySelector('input') as HTMLInputElement
                  if (input && input.value && input.checkValidity()) {
                    setSubscribed(true)
                    showToast('Successfully subscribed to newsletter! 🌸', 'success')
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 rounded-full bg-white border border-gray-200 text-[#2D2D2D] placeholder-[#9A9A9A] text-xs sm:text-sm focus:outline-none focus:border-bloom-rose shadow-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs sm:text-sm font-medium shadow-sm hover:scale-105 transition whitespace-nowrap"
                >
                  Claim 15% Code
                </button>
              </form>
            )}
            <p className="text-[10px] text-[#9A9A9A] mt-4">No spam. Unsubscribe anytime. By subscribing you agree to our Terms of Service.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
'''

with open('bloomwire/src/pages/Home.tsx', 'w') as f:
    f.write(home_code)

print("Home.tsx updated successfully!")
