import { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useCart } from '../store/cartStore'
import { useAuth } from '../store/authStore'
import { useReviewStore } from '../store/reviewStore'
import { useOrderStore } from '../store/orderStore'
import { useToastStore } from '../store/toastStore'
import { LockIcon, CheckCircleIcon, ArrowRightIcon, PetalIcon, GiftIcon, TruckIcon, SparkleIcon, FlameIcon } from '../components/Icons'
import { TrustBadges, ShareEarnCTA } from '../components/PsychologyWidgets'
import { products } from '../data/products'
import { useSEO } from '../hooks/useSEO'
import { trackPurchase } from '../lib/ga4'
import { api } from '../lib/api'

// Mock QR Code SVG
function MockQRCode({ amount }: { amount: number }) {
  const cells = Array.from({ length: 144 }, (_, i) => (i * 7 + 13) % 3 === 0 || (i * 3 + 5) % 4 === 0)
  return (
    <div className="flex flex-col items-center gap-3 p-4 glass rounded-2xl border border-[#2d2418]/10">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 12 12" className="rounded-lg bg-white p-2">
          {cells.map((on, i) => on && (
            <rect key={i} x={i % 12} y={Math.floor(i / 12)} width="1" height="1" fill="#1a0d14" />
          ))}
          <rect x="0" y="0" width="3" height="3" fill="#1a0d14" />
          <rect x="1" y="1" width="1" height="1" fill="white" />
          <rect x="9" y="0" width="3" height="3" fill="#1a0d14" />
          <rect x="10" y="1" width="1" height="1" fill="white" />
          <rect x="0" y="9" width="3" height="3" fill="#1a0d14" />
          <rect x="1" y="10" width="1" height="1" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bloom-rose to-bloom-wine flex items-center justify-center text-white text-xs font-bold border-2 border-white">B</div>
        </div>
      </div>
      <p className="text-sm text-[#6b5d4f] font-medium">Scan to Pay ₹{amount}</p>
      <p className="text-xs text-[#a0918a]">Powered by Bloomwire Pay</p>
    </div>
  )
}

// Card Preview Component
function CardPreview({ number, name, expiry, brand }: { number: string; name: string; expiry: string; brand: string }) {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-bloom-rose via-bloom-wine to-bloom-plum p-5 shadow-2xl shadow-bloom-rose/20 border border-[#2d2418]/10 overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-bloom-rose/20 rounded-full blur-2xl" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500" />
          <span className="text-xs font-bold text-[#2d2418]/80 uppercase tracking-wider">{brand}</span>
        </div>
        <div className="font-mono text-lg sm:text-xl text-[#2d2418]/90 tracking-wider">
          {number || '•••• •••• •••• ••••'}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] text-[#a0918a] uppercase mb-1">Card Holder</p>
            <p className="text-sm text-[#2d2418]/80 font-medium uppercase">{name || 'YOUR NAME'}</p>
          </div>
          <div>
            <p className="text-[8px] text-[#a0918a] uppercase mb-1">Expires</p>
            <p className="text-sm text-[#2d2418]/80 font-mono">{expiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Delivery Tier Option
const DELIVERY_TIERS: { id: string; label: string; desc: string; cost: number; badge: string; Icon: typeof TruckIcon; featured?: boolean }[] = [
  {
    id: 'standard',
    label: 'Standard',
    desc: '5-7 business days',
    cost: 0,
    badge: 'FREE',
    Icon: TruckIcon,
  },
  {
    id: 'express',
    label: 'Express',
    desc: '3-5 business days',
    cost: 99,
    badge: '+₹99',
    Icon: FlameIcon,
  },
] as const

// Premium Gift Wrap add-on (not a delivery tier)
const PREMIUM_WRAP_COST = 49
const COD_FEE = 49

export default function Checkout() {
  useSEO({ title: "Bloomwire — Checkout", description: "Complete your order for handcrafted pipe cleaner flowers. Secure checkout with UPI, card, or WhatsApp ordering.", canonicalPath: "/#/checkout" })

  const items = useCart(s => s.items)
  const giftWrap = useCart(s => s.giftWrap)
  const toggleGiftWrap = useCart(s => s.toggleGiftWrap)
  const clear = useCart(s => s.clear)
  const user = useAuth(s => s.user)
  const addPetals = useAuth(s => s.addPetals)
  const markPurchased = useAuth(s => s.markPurchased)
  const clearUnlockedReward = useAuth(s => s.clearUnlockedReward)
  const { recordPurchase } = useReviewStore()
  const createOrder = useOrderStore((s) => s.createOrder)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', state: '', pincode: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [placed, setPlaced] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('')
  const [placedSummary, setPlacedSummary] = useState<{ items: typeof items; giftWrap: boolean; total: number; deliveryTier: string; deliveryCost: number; giftNote: string; giftWrapInstructions: string; orderNotes: string; paymentMethod: string } | null>(null)
  const [giftNote, setGiftNote] = useState('')
  const [giftWrapInstructions, setGiftWrapInstructions] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [deliveryTier, setDeliveryTier] = useState<string>('standard')
  const [couponCode, setCouponCode] = useState('')
  const [needGstInvoice, setNeedGstInvoice] = useState(false)
  const [gstCompany, setGstCompany] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [gstAddress, setGstAddress] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponType, setCouponType] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [freeShipping, setFreeShipping] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Payment gateway state
  const [paymentStep, setPaymentStep] = useState<'select' | 'form' | 'processing' | 'success' | 'failed'>('select')
  const [upiId, setUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)
  const [upiVerifying, setUpiVerifying] = useState(false)
  const navigate = useNavigate()
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [cardError, setCardError] = useState('')
  const [processing, setProcessing] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping = subtotal >= 499 ? 0 : 50
  const giftWrapFee = giftWrap ? PREMIUM_WRAP_COST : 0
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0
  const deliveryCost = DELIVERY_TIERS.find(t => t.id === deliveryTier)?.cost ?? 0
  const total = subtotal + shipping + giftWrapFee + deliveryCost + codFee
  const couponDiscount = couponApplied ? couponDiscountAmount : 0
  const totalWithCoupon = total - couponDiscount - (freeShipping ? shipping : 0)
  const petalsEarned = Math.round(Math.max(0, subtotal - couponDiscount) * 0.05)
  const donationAmount = Math.round(subtotal * 0.02)
  
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) { setCouponError('Enter a coupon code'); return }
    
    // Server-side coupon validation — no client-side logic
    const res = await api.validateCouponSecure(code, user?.email || '', user?.referralCount || 0)
    if (res.success && res.data?.valid) {
      setCouponApplied(true)
      setCouponType(code)
      setCouponDiscountAmount(res.data.discountValue || 0)
      setFreeShipping(res.data.freeShipping || false)
      setCouponError('')
      showToast(res.data.message || 'Coupon applied! 🎉', 'success')
    } else {
      setCouponError(res.error || 'Invalid coupon code')
      setCouponApplied(false)
      setFreeShipping(false)
      setCouponDiscountAmount(0)
    }
  }

  const cardBrand = cardData.number.charAt(0) === '4' ? 'Visa' : cardData.number.charAt(0) === '5' ? 'Mastercard' : cardData.number.charAt(0) === '6' ? 'RuPay' : ''

  if (items.length === 0 && !placed) {
    return (<div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10"><h1 className="text-3xl font-serif font-bold mb-4">Your collection is empty</h1><Link to="/shop" className="text-bloom-neon hover:underline">Start shopping</Link></div>)
  }

  if (placed) {
    const summaryItems = placedSummary?.items || items
    const summaryGiftWrap = placedSummary ? placedSummary.giftWrap : giftWrap
    const summaryTotal = placedSummary ? placedSummary.total : total
    const summaryDeliveryTier = placedSummary ? placedSummary.deliveryTier : deliveryTier
    const summaryDeliveryCost = placedSummary ? placedSummary.deliveryCost : deliveryCost
    const tierLabel = DELIVERY_TIERS.find(t => t.id === summaryDeliveryTier)?.label || 'Standard'

    const orderNum = placedOrderId ? `BLM-2026-${placedOrderId.replace(/\D/g, '').slice(-4).padStart(4, '0')}` : 'BLM-2026-0001'
    const etaDate = new Date()
    etaDate.setDate(etaDate.getDate() + (summaryDeliveryTier === 'express' ? 4 : 7))
    const etaStr = etaDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    const etaEnd = new Date(etaDate.getTime() + 2 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

    // Get recommended products (excluding what was ordered)
    const orderedSlugs = new Set(summaryItems.map(i => i.slug))
    const recommendations = products.filter(p => !orderedSlugs.has(p.slug)).sort(() => Math.random() - 0.5).slice(0, 3)

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-up relative z-10">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-gold to-bloom-terracotta items-center justify-center mb-6 neon-glow">
          <CheckCircleIcon size={32} className="text-[#2d2418]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Order Confirmed! 🎉</h1>
        <p className="text-bloom-neon font-mono text-sm mb-3">Order #{orderNum}</p>
        <p className="text-[#8a7a6a] mb-4">Your bloom is being handcrafted in Jaipur 🌸<br />We'll send a confirmation to <span className="font-medium text-bloom-neon">{form.email}</span></p>

        <div className="glass rounded-2xl p-4 mb-6 inline-flex items-center gap-3">
          <TruckIcon size={20} className="text-bloom-neon" />
          <span className="text-sm text-[#6b5d4f]">Estimated delivery: <span className="font-bold text-[#2d2418]">{etaStr} – {etaEnd}</span></span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="glass rounded-2xl p-4 inline-flex items-center gap-2">
            <PetalIcon size={20} className="text-bloom-gold" />
            <span className="text-sm text-bloom-gold">{petalsEarned} Petals pending — credited after order dispatch</span>
          </div>
          <div className="glass rounded-2xl p-4 inline-flex items-center gap-2 border border-bloom-gold/30 bg-bloom-gold/5">
            <SparkleIcon size={18} className="text-bloom-gold" />
            <span className="text-sm text-bloom-gold font-medium">50 Petals sign-up bonus already credited. Earn more with every order!</span>
          </div>
          <div className="glass rounded-2xl p-4 inline-flex items-center gap-2">
            <CheckCircleIcon size={18} className="text-bloom-mint" />
            <span className="text-sm text-bloom-mint">Reviews unlocked!</span>
          </div>
        </div>

        
        {/* GST Invoice Option */}
        <div className="glass rounded-2xl p-4 mb-4 text-left">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={needGstInvoice}
              onChange={(e) => setNeedGstInvoice(e.target.checked)}
              className="w-4 h-4 accent-bloom-rose"
            />
            <span className="text-sm text-[#6b5d4f]">I need a GST invoice</span>
          </label>
          {needGstInvoice && (
            <div className="mt-3 space-y-2">
              <input type="text" placeholder="Company Name" value={gstCompany} onChange={(e) => setGstCompany(e.target.value)} className="w-full px-3 py-2 glass rounded-lg text-[#2d2418] text-sm placeholder-[#a0918a] focus:border-bloom-rose/40 focus:outline-none" />
              <input type="text" placeholder="GSTIN" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="w-full px-3 py-2 glass rounded-lg text-[#2d2418] text-sm placeholder-[#a0918a] focus:border-bloom-rose/40 focus:outline-none" />
              <input type="text" placeholder="Billing Address" value={gstAddress} onChange={(e) => setGstAddress(e.target.value)} className="w-full px-3 py-2 glass rounded-lg text-[#2d2418] text-sm placeholder-[#a0918a] focus:border-bloom-rose/40 focus:outline-none" />
            </div>
          )}
          <p className="text-xs text-[#a0918a] mt-2">GST Invoice will be provided with your order if applicable.</p>
        </div>
        <div className="glass-strong rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-serif font-bold mb-4">Order Summary</h2>
          {summaryItems.map((item) => (<div key={item.slug} className="flex justify-between text-sm py-2"><span>{item.name} × {item.qty}</span><span className="font-medium">₹{item.price * item.qty}</span></div>))}
          {summaryGiftWrap && (
            <div className="flex justify-between text-sm py-2 text-bloom-rose">
              <span>Premium Gift Wrap</span>
              <span className="font-medium">₹{giftWrapFee}</span>
            </div>
          )}
          {!placedSummary && paymentMethod === 'cod' && (
            <div className="flex justify-between text-sm py-2">
              <span>COD Fee</span>
              <span className="font-medium">₹{COD_FEE}</span>
            </div>
          )}
          {placedSummary?.paymentMethod === 'cod' && (
            <div className="flex justify-between text-sm py-2">
              <span>COD Fee</span>
              <span className="font-medium">₹{COD_FEE}</span>
            </div>
          )}
          {summaryDeliveryCost > 0 && (
            <div className="flex justify-between text-sm py-2 text-bloom-neon">
              <span>{tierLabel} Delivery</span>
              <span className="font-medium">₹{summaryDeliveryCost}</span>
            </div>
          )}
          
          {/* Complimentary Reward Line Item */}
          {user?.unlockedRewards && user.unlockedRewards.length > 0 && (() => {
            const reward = user.unlockedRewards[0]
            const remaining = Math.max(0, reward.minOrder - (totalWithCoupon || total))
            return (
              <div className="flex justify-between text-sm py-2 text-emerald-400">
                <span>Complimentary Reward: {reward.name} {remaining > 0 ? `(add ₹{remaining} more)` : '✓'}</span>
                <span className="font-medium">₹0</span>
              </div>
            )
          })()}
          {donationAmount > 0 && (
            <div className="mt-2 pt-2">
              <div className="flex justify-between text-sm text-[#6b5d4f]">
                <span>🐾 Dog Home Foundation donation</span>
                <span>₹{donationAmount}</span>
              </div>
              <p className="text-[10px] text-[#a0918a] mt-0.5 ml-1">2% of your order supports stray dogs in Rajasthan. Thank you. 🌸</p>
            </div>
          )}
          <div className="border-t border-[#2d2418]/10 mt-3 pt-3 flex justify-between font-bold"><span>Total</span><span>₹{summaryTotal}</span></div>
        </div>

        {/* Gift Message & Personalization Summary */}
        {((placedSummary?.giftNote || giftNote) || (placedSummary?.orderNotes || orderNotes) || (placedSummary?.giftWrapInstructions || giftWrapInstructions)) && (
          <div className="glass-strong rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-serif font-bold mb-4">Gift Message & Notes</h2>
            {(placedSummary?.giftNote || giftNote) && (
              <div className="mb-3">
                <p className="text-xs text-[#a0918a] uppercase tracking-wider mb-1">Gift Note</p>
                <p className="text-sm text-[#6b5d4f]">{placedSummary?.giftNote || giftNote}</p>
              </div>
            )}
            {(placedSummary?.giftWrapInstructions || giftWrapInstructions) && (
              <div className="mb-3">
                <p className="text-xs text-[#a0918a] uppercase tracking-wider mb-1">Gift Wrap Instructions</p>
                <p className="text-sm text-[#6b5d4f]">{placedSummary?.giftWrapInstructions || giftWrapInstructions}</p>
              </div>
            )}
            {(placedSummary?.orderNotes || orderNotes) && (
              <div className="mb-3">
                <p className="text-xs text-[#a0918a] uppercase tracking-wider mb-1">Order Notes</p>
                <p className="text-sm text-[#6b5d4f]">{placedSummary?.orderNotes || orderNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Perfect Pairings */}
        <div className="glass-strong rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-serif font-bold mb-4 text-center">You Might Also Love 🌸</h3>
          <div className="grid grid-cols-3 gap-3">
            {recommendations.map((p) => (
              <Link key={p.slug} to={`/product/${p.slug}`} className="group">
                <div className="rounded-xl overflow-hidden glass border border-[#2d2418]/10 hover:border-bloom-rose/30 transition">
                  <div className="aspect-square overflow-hidden bg-[#FFF8F3]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-[#2d2418] truncate">{p.name}</p>
                    <p className="text-xs text-bloom-gold font-medium">₹{p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Viral loop: Share & Earn */}
        <ShareEarnCTA petals={50} />

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link to="/orders" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition">
            View Your Orders <ArrowRightIcon size={18} />
          </Link>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3.5 glass text-[#2d2418] rounded-full font-medium hover:bg-white/70 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const finalizeOrder = () => {
    const purchasedSlugs = items.map((item) => item.slug)
    trackPurchase(`order-${Date.now()}`, totalWithCoupon || total, items.map(i => ({ name: i.name, price: i.price, quantity: i.qty })))
    recordPurchase(form.email, purchasedSlugs)

    // Pre-fill WhatsApp order message
    const orderItems = items.map(i => `• ${i.name} × ${i.qty} — ₹${i.price * i.qty}`).join('\n')
    const couponLine = couponApplied ? `Coupon: ${couponType} - ₹${couponDiscount}${couponType === 'FREESHIP' ? ' (Free Shipping)' : ''}` : 'Coupon: None'
    const codLine = paymentMethod === 'cod' ? `\nCOD Fee: ₹${COD_FEE}` : ''
    const giftLine = giftNote ? `\nGift Note: ${giftNote}` : ''
    const wrapInstrLine = (giftWrap && giftWrapInstructions) ? `\nGift Wrap Instructions: ${giftWrapInstructions}` : ''
    const orderNotesLine = orderNotes ? `\nOrder Notes: ${orderNotes}` : ''
    const gstLine = needGstInvoice ? `\nGST Invoice: Yes (Company: ${gstCompany}, GSTIN: ${gstNumber})` : ''
    const waMessage = `Hi Bloomwire! I'd like to place an order:\n${orderItems}\nSubtotal: ₹${subtotal}\nShipping: ${shipping === 0 ? 'Free' : '₹' + shipping}\n${couponLine}${codLine}\nTotal: ₹${totalWithCoupon || total}\nName: ${form.name}\nAddress: ${form.address}\nPhone: ${form.phone}${giftLine}${wrapInstrLine}${orderNotesLine}${gstLine}\nI agree to Bloomwire's Terms & Conditions (https://somilsharma2000.github.io/bloomwire/#/terms)`
    window.open(`https://wa.me/message/VT4TW64X2EJKH1?text=${encodeURIComponent(waMessage)}`, '_blank')
    if (user && user.email === form.email) {
      // Petals credited after order dispatch, not at checkout
      // addPetals(petalsEarned) — disabled until payment verification
      addPetals(0) // No immediate credit; admin marks as paid → then credit
      // Clear unlocked rewards that were applied to this order
      if (user.unlockedRewards && user.unlockedRewards.length > 0) {
        const reward = user.unlockedRewards[0]
        const orderTotal = totalWithCoupon || total
        if (orderTotal >= reward.minOrder) {
          clearUnlockedReward(reward.id)
          showToast(`Your complimentary ${reward.name} will be included with this order! 🎁`, 'success')
        }
      }
    }
    // Create a real order record
    const _orderId = createOrder({
      userEmail: form.email,
      items: items.map(i => ({ slug: i.slug, name: i.name, price: i.price, image: i.image, qty: i.qty })),
      subtotal,
      shipping,
      giftWrap,
      giftWrapFee,
      deliveryTier,
      deliveryCost,
      giftNote,
      giftWrapInstructions,
      orderNotes,
      total,
      petalsEarned,
      paymentMethod,
      shippingAddress: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, pincode: form.pincode },
    })

    // Sync order to backend API
    api.createOrder({
      userEmail: form.email,
      items: items.map(i => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty })),
      subtotal: subtotal,
      total: totalWithCoupon || total,
      paymentMethod: paymentMethod,
      shippingAddress: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, pincode: form.pincode },
      couponCode: couponApplied || '',
      deliveryTier: deliveryTier || 'standard',
      petalsEarned: Math.floor(Math.max(0, subtotal - couponDiscount) * 0.05),
      donationAmount: donationAmount,
    }).then((res: any) => {
      if (res.success && res.data) { /* Order created server-side */ }
      else console.warn('[API] Order sync failed:', res.error)
    }).catch((err: any) => console.warn('[API] Order sync failed:', err.message))

    // Record purchase for review eligibility
    useReviewStore.getState().recordPurchase(form.email, items.map(i => i.slug))

    // Mark purchased in auth store
    markPurchased(totalWithCoupon || total)
    showToast('Order placed successfully! 📦', 'success')
    setPlacedSummary({ items, giftWrap, total, deliveryTier, deliveryCost, giftNote, giftWrapInstructions, orderNotes, paymentMethod })
    setPlacedOrderId(_orderId)
    setPlaced(true)
    setPaymentStep('select')
    setProcessing(false)
    setTimeout(() => clear(), 100)
  }

  const handleProcessPayment = () => {
    // For UPI/Card, open Razorpay checkout
    const amountInPaise = Math.round((totalWithCoupon || total) * 100)
    
    // @ts-ignore - Razorpay loaded via script tag
    const rzp = new window.Razorpay({
      key: (import.meta as any).env?.VITE_RAZORPAY_KEY || '',
      amount: amountInPaise,
      currency: 'INR',
      name: 'Bloomwire',
      description: 'Handcrafted Pipe Cleaner Flowers',
      image: 'https://media.base44.com/images/public/6a72faf2ba70adb989a373b9/ff37ec194_generated_image.png',
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: '#ec4899' },
      handler: function(_response: any) {
        // Payment successful
        setPaymentStep('success')
        finalizeOrder()
        // Navigate to order success page
        const eta = new Date()
        eta.setDate(eta.getDate() + 5)
        sessionStorage.setItem('bloomwire-last-order', JSON.stringify({
          orderId: `BLM-${Date.now().toString().slice(-6)}`,
          items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
          total: totalWithCoupon || total,
          paymentMethod: paymentMethod,
          estimatedDelivery: `${new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} – ${eta.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`,
        }))
        setTimeout(() => navigate('/order-success'), 500)
      },
      modal: {
        ondismiss: function() {
          setProcessing(false)
          setPaymentStep('select')
          showToast('Payment cancelled — your cart is saved.', 'info')
        }
      }
    })
    
    rzp.on('payment.failed', function(_response: any) {
      setPaymentStep('failed')
      setProcessing(false)
      showToast('Payment failed. Please try again.', 'error')
    })
    
    rzp.open()
  }

  const handleVerifyUpi = () => {
    if (!upiId || !upiId.includes('@')) return
    setUpiVerifying(true)
    setTimeout(() => { setUpiVerifying(false); setUpiVerified(true) }, 1500)
  }

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format'
    if (!form.phone.trim()) errors.phone = 'Phone is required'
    else if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Phone must be 10 digits'
    if (!form.address.trim()) errors.address = 'Address is required'
    if (!form.city.trim()) errors.city = 'City is required'
    if (!form.state.trim()) errors.state = 'State is required'
    if (!form.pincode.trim()) errors.pincode = 'Pincode is required'
    else if (form.pincode.replace(/\D/g, '').length !== 6) errors.pincode = 'Pincode must be 6 digits'
    return errors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      showToast('Please fix the highlighted fields', 'error')
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      const el = document.querySelector(`[data-field="${firstErrorField}"]`)
      if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setFormErrors({})
    if (paymentMethod === 'cod') {
      finalizeOrder()
      // Navigate to order success page
      const eta = new Date()
      eta.setDate(eta.getDate() + 5)
      sessionStorage.setItem('bloomwire-last-order', JSON.stringify({
        orderId: `BLM-${Date.now().toString().slice(-6)}`,
        items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total: totalWithCoupon || total,
        paymentMethod: 'cod',
        estimatedDelivery: `${new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} – ${eta.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`,
      }))
      setTimeout(() => navigate('/order-success'), 500)
    } else {
      handleProcessPayment()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-8">Checkout</h1>

      {/* Payment Processing Overlay */}
      {paymentStep === 'processing' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-strong rounded-3xl p-6 sm:p-10 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full border-4 border-bloom-rose/20 border-t-bloom-rose animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-serif font-bold text-[#2d2418] mb-2">Processing Payment...</h2>
            <p className="text-sm text-[#8a7a6a]">Please wait while we securely process your transaction.</p>
          </div>
        </div>
      )}

      {/* Payment Success Overlay */}
      {paymentStep === 'success' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-strong rounded-3xl p-6 sm:p-10 text-center max-w-sm animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon size={32} className="text-[#2d2418]" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2d2418] mb-2">Payment Successful!</h2>
            <p className="text-sm text-[#8a7a6a]">Redirecting to your order confirmation...</p>
          </div>
        </div>
      )}

      {/* Payment Failed Overlay */}
      {paymentStep === 'failed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-strong rounded-3xl p-6 sm:p-10 text-center max-w-sm animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#2d2418]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2d2418] mb-2">Payment Failed</h2>
            <p className="text-sm text-[#8a7a6a] mb-6">A simulated bank network error occurred. Please try again.</p>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-200 mb-4">
          ⚠️ Safety Notice: Contains wire and small parts. Not suitable for children under 3 years. Handle with care.
        </div>
        <button onClick={() => { setPaymentStep('select'); setProcessing(false) }} className="px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium text-sm shimmer-btn neon-glow hover:scale-105 transition">Retry Payment</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="glass-strong rounded-2xl p-6">
            <h2 className="text-lg font-serif font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div data-field="name" className="sm:col-span-1">
                <input placeholder="Full Name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.name ? 'border border-red-500/50' : ''}`} />
                {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
              </div>
              <div data-field="email" className="sm:col-span-1">
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.email ? 'border border-red-500/50' : ''}`} />
                {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
              </div>
              <div data-field="phone" className="sm:col-span-1">
                <input placeholder="Phone Number" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.phone ? 'border border-red-500/50' : ''}`} />
                {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
              </div>
              <div data-field="address" className="sm:col-span-2">
                <input placeholder="Address" value={form.address} onChange={(e) => { setForm({ ...form, address: e.target.value }); if (formErrors.address) setFormErrors({ ...formErrors, address: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.address ? 'border border-red-500/50' : ''}`} />
                {formErrors.address && <p className="text-xs text-red-400 mt-1">{formErrors.address}</p>}
              </div>
              <div data-field="city" className="sm:col-span-1">
                <input placeholder="City" value={form.city} onChange={(e) => { setForm({ ...form, city: e.target.value }); if (formErrors.city) setFormErrors({ ...formErrors, city: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.city ? 'border border-red-500/50' : ''}`} />
                {formErrors.city && <p className="text-xs text-red-400 mt-1">{formErrors.city}</p>}
              </div>
              <div data-field="state" className="sm:col-span-1">
                <input placeholder="State" value={form.state} onChange={(e) => { setForm({ ...form, state: e.target.value }); if (formErrors.state) setFormErrors({ ...formErrors, state: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.state ? 'border border-red-500/50' : ''}`} />
                {formErrors.state && <p className="text-xs text-red-400 mt-1">{formErrors.state}</p>}
              </div>
              <div data-field="pincode" className="sm:col-span-2">
                <input placeholder="Pincode" value={form.pincode} onChange={(e) => { setForm({ ...form, pincode: e.target.value }); if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: '' }) }} className={`w-full px-4 py-3 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition ${formErrors.pincode ? 'border border-red-500/50' : ''}`} />
                {formErrors.pincode && <p className="text-xs text-red-400 mt-1">{formErrors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Helix Delivery Tier Selection */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold">Delivery Experience</h2>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-bloom-gold/10 border border-bloom-gold/30 text-bloom-gold font-medium uppercase tracking-wider">Choose your tier</span>
            </div>
            <div className="space-y-3">
              {DELIVERY_TIERS.map((tier) => (
                <label
                  key={tier.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${deliveryTier === tier.id ? 'neon-border bg-bloom-rose/10' : 'glass hover:bg-white/60'} ${tier.featured ? 'relative' : ''}`}
                >
                  <input type="radio" name="delivery" value={tier.id} checked={deliveryTier === tier.id} onChange={(e) => setDeliveryTier(e.target.value)} className="accent-bloom-rose" />
                  <div className="w-10 h-10 rounded-xl bg-bloom-rose/10 flex items-center justify-center text-bloom-neon border border-bloom-rose/20 shrink-0">
                    <tier.Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{tier.label}</p>
                      {tier.featured && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-[#2d2418] font-bold uppercase tracking-wider">Recommended</span>
                      )}
                    </div>
                    <p className="text-xs text-[#a0918a]">{tier.desc}</p>
                  </div>
                  <span className={`text-sm font-bold ${tier.cost === 0 ? 'text-bloom-mint' : 'text-bloom-neon'}`}>{tier.badge}</span>
                </label>
              ))}
            </div>
          </div>


          {/* Gift Message & Personalization */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold">Gift Message & Personalization</h2>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-bloom-rose/10 border border-bloom-rose/30 text-bloom-neon font-medium uppercase tracking-wider">Optional</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">Gift Note (for handwritten note)</label>
                <textarea
                  placeholder="Write a message to include with your gift…"
                  maxLength={200}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value.slice(0, 200))}
                  rows={3}
                  className="w-full px-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition resize-none"
                />
                <p className="text-xs text-[#a0918a] mt-1 text-right">{giftNote.length}/200</p>
              </div>
              {giftWrap && (
                <div>
                  <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">Gift Wrap Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Wrap in pink ribbon, add 'Happy Birthday' tag…"
                    maxLength={100}
                    value={giftWrapInstructions}
                    onChange={(e) => setGiftWrapInstructions(e.target.value.slice(0, 100))}
                    className="w-full px-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition"
                  />
                  <p className="text-xs text-[#a0918a] mt-1 text-right">{giftWrapInstructions.length}/100</p>
                </div>
              )}
              <div>
                <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">Order Notes</label>
                <textarea
                  placeholder="Any special instructions for your order…"
                  maxLength={200}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value.slice(0, 200))}
                  rows={3}
                  className="w-full px-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition resize-none"
                />
                <p className="text-xs text-[#a0918a] mt-1 text-right">{orderNotes.length}/200</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold">Payment Method</h2>
              
            </div>

            <div className="space-y-3">
              {[
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your flowers arrive (+₹49 COD fee)' },
                { id: 'upi', label: 'UPI Payment', desc: 'Pay via UPI (GPay, PhonePe, Paytm)' },
                { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
              ].map((method) => (
                <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === method.id ? 'neon-border bg-bloom-rose/10' : 'glass hover:bg-white/60'}`}>
                  <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => { setPaymentMethod(e.target.value); setCardError(''); setUpiVerified(false); setPaymentStep('select') }} className="accent-bloom-rose" />
                  <div><p className="font-medium text-sm">{method.label}</p><p className="text-xs text-[#a0918a]">{method.desc}</p></div>
                </label>
              ))}
            </div>

            {/* UPI Payment Form */}
            {paymentMethod === 'upi' && (
              <div className="mt-6 space-y-5 animate-fade-up">
                <div>
                  <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">UPI ID</label>
                  <div className="relative">
                    <LockIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                    <input type="text" placeholder="yourname@paytm" value={upiId} onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false) }} className="w-full pl-11 pr-32 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition" />
                    <button type="button" onClick={handleVerifyUpi} disabled={!upiId || !upiId.includes('@') || upiVerifying || upiVerified} className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-xs font-medium rounded-lg bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30 hover:bg-bloom-rose/30 transition disabled:opacity-40 disabled:cursor-not-allowed">
                      {upiVerifying ? 'Verifying...' : upiVerified ? 'Verified ✓' : 'Verify UPI ID'}
                    </button>
                  </div>
                </div>
                <MockQRCode amount={total} />
                <p className="text-xs text-[#a0918a] text-center">Enter your UPI ID, verify, then click "Place Order" below to simulate payment.</p>
              </div>
            )}

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="mt-6 space-y-5 animate-fade-up">
                <CardPreview number={cardData.number} name={cardData.name} expiry={cardData.expiry} brand={cardBrand} />
                <div>
                  <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">Card Number</label>
                  <div className="relative">
                    <LockIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" value={cardData.number} onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })} className="w-full pl-11 pr-20 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition font-mono" />
                    {cardBrand && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-bloom-gold">{cardBrand}</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">Cardholder Name</label>
                  <input type="text" placeholder="Name on card" value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} className="w-full px-4 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">Expiry (MM/YY)</label>
                    <input type="text" placeholder="MM/YY" value={cardData.expiry} onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })} className="w-full px-4 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-[#8a7a6a] mb-2 block uppercase tracking-wider">CVV</label>
                    <div className="relative">
                      <LockIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0918a]" />
                      <input type="password" placeholder="•••" maxLength={4} value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} className="w-full pl-11 pr-4 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition font-mono" />
                    </div>
                  </div>
                </div>
                {cardError && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{cardError}</div>}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-[#2d2418]/10">
              <LockIcon size={14} className="text-[#a0918a]" />
              <p className="text-xs text-[#a0918a]">Secure checkout process</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-serif font-bold mb-6">Your Order</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-[#FFF8F3]" loading="lazy" />
                    <div>
                      <p className="font-medium truncate max-w-[140px]">{item.name}</p>
                      <p className="text-[#a0918a] text-xs">× {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-medium">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Gift Wrap */}
            <div className="pt-4 border-t border-[#2d2418]/10 mb-4">
              <label className="flex items-center gap-3 cursor-pointer select-none glass p-3 rounded-xl hover:bg-white/60 transition border border-bloom-rose/30">
                <input type="checkbox" checked={giftWrap} onChange={toggleGiftWrap} className="w-4 h-4 rounded accent-bloom-rose cursor-pointer" />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GiftIcon size={16} className="text-bloom-rose" />
                  <span>Add Premium Gift Wrap (+₹49)</span>
                </div>
              </label>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm border-t border-[#2d2418]/10 pt-4">
              <div className="flex justify-between"><span className="text-[#8a7a6a]">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
              {giftWrap && <div className="flex justify-between"><span className="text-[#8a7a6a]">Premium Gift Wrap</span><span className="font-medium">₹{giftWrapFee}</span></div>}
              {paymentMethod === 'cod' && <div className="flex justify-between"><span className="text-[#8a7a6a]">COD Fee</span><span className="font-medium">₹{COD_FEE}</span></div>}
              <div className="flex justify-between"><span className="text-[#8a7a6a]">Shipping</span><span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              {deliveryCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#8a7a6a]">{DELIVERY_TIERS.find(t => t.id === deliveryTier)?.label} Delivery</span>
                  <span className="font-medium text-bloom-neon">₹{deliveryCost}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-bloom-gold">
                <span className="flex items-center gap-1"><PetalIcon size={14} /> You'll earn</span>
                <span className="font-medium">{petalsEarned} Petals (pending — credited after dispatch)</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-bloom-mint">
                  <span className="flex items-center gap-1">✓ Discount ({couponType})</span>
                  <span className="font-medium">-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#2d2418]/10 pt-3 mt-3">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">₹{couponApplied ? totalWithCoupon : total}</span>
              </div>
            </div>

            {/* Live dispatch countdown */}

            {/* Place Order button */}
            <button
              type="submit"
              disabled={processing || (paymentMethod === 'upi' && !upiVerified)}
              className="flex items-center justify-center gap-2 w-full mt-5 px-6 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {processing ? (
                <><div className="w-5 h-5 rounded-full border-2 border-[#2d2418]/20 border-t-white animate-spin" /> Processing...</>
              ) : paymentMethod === 'cod' ? (
                <>Place Order <ArrowRightIcon size={18} /></>
              ) : (
                <>Pay ₹{couponApplied ? totalWithCoupon : total} <ArrowRightIcon size={18} /></>
              )}
            </button>

            {/* Coupon Code */}
            <div className="mt-4 pt-4 border-t border-[#2d2418]/10">
              {couponApplied ? (
                <div className="flex items-center justify-between p-3 glass rounded-xl border border-bloom-mint/30">
                  <span className="text-sm text-bloom-mint font-medium">✓ {couponCode.toUpperCase()} applied{couponType === 'BLOOM15' ? ' — 15% off!' : couponType === 'COMEBACK10' ? ' — 10% off!' : ' — Free Shipping!'}</span>
                  <button type="button" onClick={() => { setCouponApplied(false); setCouponCode('') }} className="text-xs text-[#a0918a] hover:text-red-400 transition">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon() } }}
                    className="flex-1 px-4 py-2.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] text-sm glow-focus transition"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 bg-bloom-rose/20 text-bloom-neon rounded-xl text-sm font-medium hover:bg-bloom-rose/30 transition whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-400 mt-1.5">{couponError}</p>}
            </div>

            <TrustBadges />

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <LockIcon size={14} className="text-[#a0918a]" />
              <p className="text-xs text-[#a0918a]">Secure checkout process</p>
            </div>
            <p className="text-center text-xs text-[#a0918a] mt-2"></p>
          </div>
        </div>
      </form>
    </div>
  )
}
