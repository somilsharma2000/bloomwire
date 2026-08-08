import { Link } from 'react-router-dom'
import { useCart } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { LockIcon, ArrowRightIcon, PetalIcon, GiftIcon, FlameIcon } from '../components/Icons'
import { FreeShippingBar, TrustBadges } from '../components/PsychologyWidgets'

export default function Cart() {
  const items = useCart(s => s.items)
  const giftWrap = useCart(s => s.giftWrap)
  const toggleGiftWrap = useCart(s => s.toggleGiftWrap)
  const removeItem = useCart(s => s.removeItem)
  const updateQty = useCart(s => s.updateQty)
  const clear = useCart(s => s.clear)
  const showToast = useToastStore((s) => s.showToast)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping = subtotal >= 499 ? 0 : 50
  const giftWrapFee = giftWrap ? 49 : 0
  const total = subtotal + shipping + giftWrapFee

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
        <div className="inline-flex w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#a0918a]"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.145a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zM14.25 14.145a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 5l2.5 9h11l2-7H5.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 className="text-3xl font-serif font-bold mb-3">Your Collection</h1>
        <p className="text-[#a0918a] mb-8">Your collection is empty. Let's find something beautiful.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition">
          Start Shopping <ArrowRightIcon size={18} />
        </Link>
        <div className="mt-12 max-w-md mx-auto">
          <p className="text-xs text-[#a0918a] uppercase tracking-wider mb-4">🔥 Trending right now</p>
          <p className="text-sm text-[#a0918a]">Our Velvet Rose Bouquet is flying off the shelves — 12 sold today!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Your Collection</h1>
      <p className="text-sm text-[#a0918a] mb-8">{items.length} item{items.length > 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <FreeShippingBar subtotal={subtotal} threshold={499} />

          <div className="glass rounded-2xl p-4 border border-bloom-gold/20">
            <p className="text-sm font-medium text-bloom-gold">🌸 You'll earn {Math.round(subtotal * 0.05)} Petals on this order (5% of subtotal)</p>
            <p className="text-xs text-[#8a7a6a] mt-1">Redeem Petals for discounts, free gifts, and raffle entries</p>
          </div>

          {items.map((item) => (
            <div key={item.slug} className="flex gap-4 items-center glass rounded-2xl p-4">
              <Link to={`/product/${item.slug}`}><img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-[#FFF8F3]"  loading="lazy" /></Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="hover:text-bloom-neon transition"><h3 className="font-medium truncate">{item.name}</h3></Link>
                <p className="text-sm text-[#a0918a]">₹{item.price} each</p>
                <div className="mt-1.5">
                </div>
              </div>
              <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
                <button onClick={() => updateQty(item.slug, item.qty - 1)} className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center hover:bg-white/70 transition text-sm">-</button>
                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                <button onClick={() => updateQty(item.slug, item.qty + 1)} className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center hover:bg-white/70 transition text-sm">+</button>
              </div>
              <p className="font-medium w-20 text-right">₹{item.price * item.qty}</p>
              <button onClick={() => { removeItem(item.slug); showToast("Item removed from collection", "cart") } } className="text-[#a0918a] hover:text-red-400 transition p-1" aria-label="Remove">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <button onClick={() => { clear(); showToast("Collection cleared", "cart") } } className="text-sm text-[#a0918a] hover:text-red-400 transition">Clear collection</button>
            <Link to="/shop" className="text-sm text-bloom-neon hover:underline">Continue shopping</Link>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4 sticky top-24">
          <div className="glass-strong rounded-2xl p-5 border border-bloom-rose/30">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={toggleGiftWrap}
                className="w-4 h-4 rounded accent-bloom-rose cursor-pointer"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="font-medium text-sm flex items-center gap-2">
                  <GiftIcon size={18} className="text-bloom-rose" />
                  Add Premium Gift Wrap
                </span>
                <span className="text-sm font-medium text-bloom-neon">+₹49</span>
              </div>
            </label>
            {giftWrap && (
              <p className="mt-3 text-xs text-bloom-rose bg-bloom-rose/10 p-2.5 rounded-lg border border-bloom-rose/20 leading-relaxed">
                Premium gift wrapping with handcrafted floral ribbon
              </p>
            )}
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h2 className="text-lg font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#8a7a6a]">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span className="text-[#8a7a6a]">Gift Wrap</span>
                  <span className="font-medium">₹49</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-[#8a7a6a]">Shipping</span><span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex justify-between items-center text-bloom-gold">
                <span className="flex items-center gap-1"><PetalIcon size={14} /> You'll earn</span>
                <span className="font-medium">{Math.round(subtotal * 0.05)} Petals (₹{Math.round(subtotal * 0.05)} value)</span>
              </div>
              <div className="border-t border-[#2d2418]/10 pt-3 mt-3">
                <div className="flex justify-between"><span className="font-bold">Total</span><span className="font-bold text-lg">₹{total}</span></div>
              </div>
            </div>

            <div className="mt-4">
            </div>

            <Link to="/checkout" className="flex items-center justify-center gap-2 mt-4 px-6 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition">
              Proceed to Checkout <ArrowRightIcon size={18} />
            </Link>

            <TrustBadges />

            <div className="mt-4 text-center flex items-center justify-center gap-1.5">
              <LockIcon size={14} className="text-[#a0918a]" />
              <p className="text-xs text-[#a0918a]">Secure checkout process</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 glass rounded-xl border border-bloom-rose/20">
            <FlameIcon size={16} className="text-bloom-neon shrink-0 animate-pulse" />
            <p className="text-xs text-[#8a7a6a]">
              Take your time choosing the perfect bloom! 🌸
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
