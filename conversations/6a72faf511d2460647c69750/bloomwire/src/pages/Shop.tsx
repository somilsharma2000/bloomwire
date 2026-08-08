import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import TiltCard from '../components/TiltCard'
import BloomFinder from '../components/BloomFinder'
import { StarIcon, PetalIcon, FlameIcon, CartIcon, SparkleIcon } from '../components/Icons'
import { useCart } from '../store/cartStore'
import { toast } from '../store/toastStore'
import { useSEO } from '../hooks/useSEO'
import { trackAddToCart } from '../lib/ga4'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

const CATEGORY_TABS = [
  'All',
  'Bouquets',
  'Single Stems',
  'Keychains',
  'Potted Decor',
  'DIY Kits',
  'Gift Bundles',
]

export default function Shop() {
  useSEO({
    title: "Bloomwire — Shop Handcrafted Flowers | Bouquets and Decor",
    description: "Shop handcrafted pipe cleaner flower bouquets, keychains, potted decor and DIY kits. Made to order in Jaipur. Free shipping above Rs.499.",
    canonicalPath: "/#/shop"
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [cartToast, setCartToast] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addItem = useCart(s => s.addItem)
  const { recentlyViewed } = useRecentlyViewed()

  const activeTab = categoryParam || 'All'

  const handleTabClick = (tab: string) => {
    if (tab === 'All') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      searchParams.set('category', tab)
      setSearchParams(searchParams)
    }
  }

  // Read URL query params for search (from header search)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const q = params.get('q')
    if (q) setSearch(q)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [categoryParam, search, sortBy])

  let filtered = products.filter((p) => p.price > 0)

  if (activeTab !== 'All') {
    filtered = filtered.filter(p => {
      if (activeTab === 'Single Stems') {
        return p.category === 'Single Flowers' || p.category === 'Single Stems'
      }
      return p.category === activeTab
    })
  }

  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  }

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  if (sortBy === 'featured') filtered = [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured))

  const handleQuickAdd = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ slug: product.slug, name: product.name, price: product.price, image: product.image, qty: 1 })
    toast.show(`${product.name} added to cart!`, 'cart')
    trackAddToCart(product.name, product.price)

    setCartToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setCartToast(false), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
      {/* Added to Cart Toast */}
      {cartToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#2D2D2D] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm animate-fade-up">
          <span>✓ Added to cart</span>
          <Link to="/cart" className="text-bloom-rose font-semibold hover:underline border-l border-gray-600 pl-3">
            View Cart
          </Link>
        </div>
      )}

      {/* Launch Banner */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-bloom-rose/20 via-bloom-wine/10 to-bloom-gold/20 border border-bloom-rose/30 p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer-btn opacity-20" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-rose/30 text-bloom-neon text-[10px] font-bold uppercase tracking-widest mb-2">
            <SparkleIcon size={12} /> Grand Opening Sale
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-1">
            Up to <span className="gradient-text">15% Off</span> All Handcrafted Blooms
          </h2>
          <p className="text-sm text-[#8a7a6a]">Plus free shipping on orders above ₹499 • Use code <span className="text-bloom-gold font-mono font-bold">BLOOM15</span> for extra 15% off your first order</p>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-3">Collection</p>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">The <span className="gradient-text">Bloomwire</span> Catalog</h1>
        <p className="text-[#a0918a]">Find your long-lasting flower</p>
      </div>

      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search flowers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-full glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0918a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      {/* Category Pill Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-bloom-rose text-white shadow-md'
                    : 'bg-white text-[#6B6B6B] border border-gray-200 hover:bg-[#FDF2F8] hover:text-bloom-rose'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-full glass text-sm font-medium text-[#6b5d4f] glow-focus cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <p className="text-sm text-[#a0918a] mb-6">{filtered.length} products</p>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filtered.map((product, i) => (
          <div key={product.slug} className="group reveal" style={{ transitionDelay: `${(i % 8) * 0.05}s` }}>
            <Link to={`/product/${product.slug}`} className="block h-full">
              <TiltCard className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col" maxTilt={8}>
                <div className="aspect-square overflow-hidden bg-[#FFF8F3] relative">
                  <div className="img-zoom w-full h-full">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  {product.slug === 'velvet-sunset-rose-bouquet' && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-bloom-dark text-xs font-bold px-2.5 py-1 rounded-full">#1 Bestseller</span>
                  )}
                  {product.slug === 'midnight-lavender-mist-bouquet' && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-bloom-dark text-xs font-bold px-2.5 py-1 rounded-full">#2 Bestseller</span>
                  )}
                  {product.slug === 'ultimate-bloom-gift-box' && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-bloom-dark text-xs font-bold px-2.5 py-1 rounded-full">#3 Bestseller</span>
                  )}
                  {product.slug !== 'velvet-sunset-rose-bouquet' && product.slug !== 'midnight-lavender-mist-bouquet' && product.slug !== 'ultimate-bloom-gift-box' && product.badges.length > 0 && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-bold px-3 py-1 rounded-full neon-glow">{product.badges[0]}</span>
                  )}
                  {product.originalPrice && (
                    <span className="absolute top-3 right-3 bg-bloom-gold text-bloom-dark text-xs font-bold px-2.5 py-1 rounded-full">Sale</span>
                  )}
                  {product.stock < 15 && (
                    <span className="absolute bottom-3 left-3 glass text-bloom-neon text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <FlameIcon size={10} /> Only {product.stock} left
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-xs text-[#a0918a] mb-1">{product.category}</p>
                  <h3 className="font-serif font-bold text-[#2D2D2D] group-hover:text-bloom-rose transition text-sm sm:text-base line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-[#2D2D2D]">₹{product.price}</span>
                    {product.originalPrice && <span className="text-xs text-[#a0918a] line-through">₹{product.originalPrice}</span>}
                  </div>
                  {/* Charity Badge */}
                  <p className="text-[10px] text-[#9A9A9A] mt-0.5">🐾 2% feeds a dog</p>

                  {product.originalPrice && (
                    <>
                      <p className="text-xs text-bloom-mint font-medium mt-0.5">You save ₹{product.originalPrice - product.price} ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)</p>
                      <p className="text-[10px] text-[#a0918a] mt-0.5">Inclusive of all taxes</p>
                    </>
                  )}
                  <div className="flex items-center justify-between mt-1 mb-3">
                    <div className="flex items-center gap-1">
                      <StarIcon size={12} className="text-bloom-gold" />
                      <span className="text-xs text-[#a0918a]">{product.rating} ({product.reviewCount})</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-bloom-gold">
                      <PetalIcon size={12} /> +{product.petalsEarned}
                    </span>
                  </div>

                  {/* Quick Add to Cart 🌸 */}
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    disabled={product.stock === 0}
                    className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-sm font-medium hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <CartIcon size={14} />
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart 🌸'}
                  </button>
                </div>
              </TiltCard>
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#a0918a] text-lg">No products found.</p>
          <button onClick={() => { setSearch(''); handleTabClick('All') }} className="mt-4 text-bloom-rose hover:underline font-medium">Clear filters</button>
        </div>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed.length >= 2 && (
        <div className="mt-16 border-t border-gray-200/60 pt-10">
          <h2 className="text-2xl font-serif font-bold text-[#2D2D2D] mb-6">Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x">
            {recentlyViewed.slice(0, 5).map((p) => (
              <Link
                key={p.slug}
                to={`/product/${p.slug}`}
                className="shrink-0 w-48 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition snap-start block"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-[#FFF8F3] mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="text-xs text-[#9A9A9A]">{p.category}</p>
                <h3 className="font-serif font-bold text-[#2D2D2D] text-sm truncate">{p.name}</h3>
                <p className="text-sm font-bold text-[#2D2D2D] mt-1">₹{p.price}</p>
                <p className="text-[10px] text-[#9A9A9A] mt-0.5">🐾 2% feeds a dog</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Custom Order CTA */}
      <div className="mt-16 rounded-2xl glass border border-[#2d2418]/10 p-8 text-center">
        <h3 className="text-xl font-serif font-bold text-[#2D2D2D] mb-2">Can't find the perfect bloom?</h3>
        <p className="text-sm text-[#8a7a6a] mb-4">We craft custom arrangements for weddings, gifting, and home decor. Message us on WhatsApp for personalized orders.</p>
        <a
          href="https://wa.me/message/VT4TW64X2EJKH1?text=Hi%20Bloomwire%2C%20I%27d%20like%20to%20order%20a%20custom%20flower%20arrangement"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-[#2d2418] text-sm font-medium hover:scale-105 transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m0-21.785C6.539 1 1 6.539 1 13.26c0 2.347.613 4.596 1.777 6.583L1 25l5.326-1.398a13.15 13.15 0 006.31 1.6h.004c7.22 0 13.26-5.79 13.26-13.26C25.9 6.539 20.36 1 13.64 1"/></svg>
          Order on WhatsApp
        </a>
      </div>

      {/* Find Your Bloom */}
      <div className="mt-16">
        <BloomFinder />
      </div>
    </div>
  )
}
