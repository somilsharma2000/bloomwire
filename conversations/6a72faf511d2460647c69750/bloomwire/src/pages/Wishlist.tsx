import { Link, useNavigate } from 'react-router-dom'
import { useWatchlist } from '../store/watchlistStore'
import { useCart } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { products, type Product } from '../data/products'
import { HeartIcon, ArrowRightIcon, FlowerIcon, StarIcon, FlameIcon } from '../components/Icons'

export default function Wishlist() {
  const items = useWatchlist((s) => s.items)
  const remove = useWatchlist((s) => s.remove)
  const addItem = useCart((s) => s.addItem)
  const showToast = useToastStore((s) => s.showToast)
  const navigate = useNavigate()

  // Enrich wishlist items with full product data
  const enrichedItems = items
    .map((item) => {
      const product = products.find((p) => p.slug === item.slug)
      return product ? { ...item, product } : null
    })
    .filter(Boolean) as ({ slug: string; name: string; price: number; image: string; product: Product })[]

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-bloom-rose/10 flex items-center justify-center mx-auto mb-6">
          <HeartIcon size={40} className="text-bloom-neon" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-[#8a7a6a] mb-8 max-w-md mx-auto">Browse our collection of hand-sculpted chenille flowers and save your favorites here.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition">
          Explore Our Collection <ArrowRightIcon size={18} />
        </Link>
      </div>
    )
  }

  const handleMoveToCart = (item: typeof enrichedItems[0]) => {
    addItem({ slug: item.slug, name: item.name, price: item.price, image: item.image })
    remove(item.slug)
    showToast(`${item.name} moved to collection`, 'cart')
  }

  const handleBuyNow = (item: typeof enrichedItems[0]) => {
    addItem({ slug: item.slug, name: item.name, price: item.price, image: item.image })
    showToast('Added to collection — redirecting to checkout', 'cart')
    navigate('/checkout')
  }

  const handleRemove = (slug: string) => {
    remove(slug)
    showToast('Removed from wishlist 💔', 'wishlist')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <HeartIcon size={28} className="text-bloom-neon" />
        <h1 className="text-3xl sm:text-4xl font-serif font-bold">My Wishlist</h1>
        <span className="px-3 py-1 glass text-sm text-[#8a7a6a] rounded-full">{items.length} item{items.length > 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrichedItems.map((item) => {
          const p = item.product
          return (
            <div key={item.slug} className="glass-strong rounded-2xl overflow-hidden border border-[#2d2418]/10 hover:border-bloom-rose/40 transition group">
              <Link to={`/product/${item.slug}`} className="block relative">
                <div className="aspect-square overflow-hidden bg-[#FFF8F3]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {p.badges.length > 0 && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-[10px] font-bold rounded-full neon-glow">{p.badges[0]}</span>
                  )}
                  {p.originalPrice && (
                    <span className="px-2.5 py-1 bg-bloom-gold/20 text-bloom-gold text-[10px] font-bold rounded-full border border-bloom-gold/30">
                      Save ₹{p.originalPrice - p.price}
                    </span>
                  )}
                </div>
                {/* Stock badge */}
                <div className="absolute top-3 right-3">
                  {p.stock < 15 ? (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-medium rounded-full border border-red-500/30 flex items-center gap-1">
                      <FlameIcon size={10} /> Only {p.stock} left
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-medium rounded-full border border-emerald-500/20">
                      In Stock
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${item.slug}`}>
                  <h3 className="font-medium text-[#2d2418] group-hover:text-bloom-neon transition">{item.name}</h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={12} className={i < Math.round(p.rating) ? 'text-bloom-gold fill-current' : 'text-[#a0918a]'} />
                    ))}
                  </div>
                  <span className="text-xs text-[#a0918a]">{p.rating.toFixed(1)} ({p.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-[#2d2418]">₹{item.price}</span>
                  {p.originalPrice && <span className="text-sm text-[#a0918a] line-through">₹{p.originalPrice}</span>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full text-sm font-medium shimmer-btn hover:scale-105 transition"
                  >
                    Move to Collection
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="px-4 py-2.5 bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-[#2d2418] rounded-full text-sm font-medium hover:scale-105 transition"
                  >
                    Add to Cart 🌸
                  </button>
                  <button
                    onClick={() => handleRemove(item.slug)}
                    className="px-3 py-2.5 glass rounded-full text-[#8a7a6a] hover:text-bloom-rose transition"
                    aria-label="Remove from wishlist"
                  >
                    <HeartIcon size={16} className="fill-current" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 glass text-[#6b5d4f] rounded-full font-medium hover:bg-white/70 transition text-sm">
          <FlowerIcon size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}
