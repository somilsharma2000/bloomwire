import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cartStore'
import { useAuth } from '../store/authStore'
import { useReviewStore } from '../store/reviewStore'
import {
  LockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PetalIcon,
  GiftIcon,
  ShieldIcon,
  CheckIcon,
} from '../components/Icons'

const Spinner = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const XCircleIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const RefreshIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

const QRCodeMock = ({ amount }: { amount: number }) => (
  <div className="flex flex-col items-center justify-center p-5 rounded-2xl glass border border-white/10 bg-bloom-darker/60 my-4 text-center">
    <div className="relative bg-white p-3.5 rounded-xl shadow-xl border border-white/20">
      <svg width="130" height="130" viewBox="0 0 100 100" className="text-gray-900 fill-current">
        {/* Corner 1 Top-Left */}
        <rect x="5" y="5" width="25" height="25" rx="3" fill="#0f172a" />
        <rect x="9" y="9" width="17" height="17" rx="2" fill="#ffffff" />
        <rect x="13" y="13" width="9" height="9" fill="#0f172a" />

        {/* Corner 2 Top-Right */}
        <rect x="70" y="5" width="25" height="25" rx="3" fill="#0f172a" />
        <rect x="74" y="9" width="17" height="17" rx="2" fill="#ffffff" />
        <rect x="78" y="13" width="9" height="9" fill="#0f172a" />

        {/* Corner 3 Bottom-Left */}
        <rect x="5" y="70" width="25" height="25" rx="3" fill="#0f172a" />
        <rect x="9" y="74" width="17" height="17" rx="2" fill="#ffffff" />
        <rect x="13" y="78" width="9" height="9" fill="#0f172a" />

        {/* Pattern Data Blocks */}
        <rect x="35" y="5" width="6" height="6" fill="#0f172a" />
        <rect x="46" y="5" width="12" height="6" fill="#0f172a" />
        <rect x="60" y="5" width="6" height="6" fill="#0f172a" />
        <rect x="35" y="15" width="10" height="6" fill="#0f172a" />
        <rect x="50" y="15" width="6" height="6" fill="#0f172a" />
        <rect x="60" y="15" width="6" height="10" fill="#0f172a" />

        <rect x="5" y="35" width="6" height="10" fill="#0f172a" />
        <rect x="15" y="35" width="10" height="6" fill="#0f172a" />
        <rect x="15" y="45" width="6" height="10" fill="#0f172a" />
        <rect x="25" y="35" width="6" height="20" fill="#0f172a" />

        <rect x="35" y="32" width="10" height="10" fill="#e11d48" />
        <rect x="50" y="35" width="10" height="6" fill="#0f172a" />
        <rect x="65" y="35" width="10" height="10" fill="#0f172a" />
        <rect x="80" y="35" width="15" height="6" fill="#0f172a" />
        <rect x="80" y="45" width="6" height="10" fill="#0f172a" />

        <rect x="35" y="50" width="6" height="10" fill="#0f172a" />
        <rect x="45" y="46" width="15" height="6" fill="#0f172a" />
        <rect x="50" y="56" width="10" height="10" fill="#0f172a" />
        <rect x="70" y="56" width="15" height="6" fill="#0f172a" />
        <rect x="90" y="56" width="5" height="15" fill="#0f172a" />

        <rect x="35" y="70" width="10" height="6" fill="#0f172a" />
        <rect x="35" y="80" width="6" height="15" fill="#0f172a" />
        <rect x="50" y="70" width="15" height="6" fill="#0f172a" />
        <rect x="45" y="80" width="10" height="10" fill="#0f172a" />
        <rect x="60" y="85" width="15" height="10" fill="#0f172a" />
        <rect x="80" y="70" width="15" height="15" fill="#0f172a" />
        <rect x="80" y="90" width="10" height="5" fill="#0f172a" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-bloom-wine text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-white/40">
          BLOOM
        </div>
      </div>
    </div>
    <p className="mt-3 text-sm font-semibold text-bloom-gold flex items-center justify-center gap-1.5">
      <span>Scan to Pay ₹{amount}</span>
    </p>
    <p className="text-xs text-gray-400 mt-1">Accepts GPay, PhonePe, Paytm, BHIM & all UPI apps</p>
  </div>
)

export default function Checkout() {
  const items = useCart((s) => s.items)
  const giftWrap = useCart((s) => s.giftWrap)
  const toggleGiftWrap = useCart((s) => s.toggleGiftWrap)
  const clear = useCart((s) => s.clear)
  const user = useAuth((s) => s.user)
  const addPetals = useAuth((s) => s.addPetals)
  const { recordPurchase } = useReviewStore()

  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', state: '', pincode: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod')
  const [placed, setPlaced] = useState(false)
  const [placedSummary, setPlacedSummary] = useState<{ items: typeof items; giftWrap: boolean; total: number } | null>(null)

  // Demo Payment Gateway States
  const [paymentStep, setPaymentStep] = useState<'select' | 'form' | 'processing' | 'success' | 'failed'>('select')
  const [upiId, setUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)
  const [upiVerifying, setUpiVerifying] = useState(false)
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [processing, setProcessing] = useState(false)
  const [cardError, setCardError] = useState('')

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping = subtotal >= 499 ? 0 : 50
  const giftWrapFee = giftWrap ? 49 : 0
  const total = subtotal + shipping + giftWrapFee
  const petalsEarned = Math.round(subtotal * 0.05)

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, '')
    if (clean.startsWith('4')) return 'Visa'
    if (clean.startsWith('5')) return 'Mastercard'
    if (clean.startsWith('6')) return 'RuPay'
    return ''
  }

  const cardBrand = getCardBrand(cardData.number)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw
    setCardData((prev) => ({ ...prev, number: formatted }))
    if (cardError) setCardError('')
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`
    }
    setCardData((prev) => ({ ...prev, expiry: raw }))
    if (cardError) setCardError('')
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardData((prev) => ({ ...prev, cvv: raw }))
    if (cardError) setCardError('')
  }

  const handleVerifyUpi = () => {
    if (!upiId.trim()) return
    setUpiVerifying(true)
    setTimeout(() => {
      setUpiVerifying(false)
      setUpiVerified(true)
    }, 1500)
  }

  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value)
    if (upiVerified) setUpiVerified(false)
    if (cardError) setCardError('')
  }

  const handleSelectMethod = (id: 'cod' | 'upi' | 'card') => {
    setPaymentMethod(id)
    setCardError('')
    if (paymentStep === 'failed' || paymentStep === 'select') {
      setPaymentStep('form')
    }
  }

  const handleRetry = () => {
    setPaymentStep('form')
    setProcessing(false)
    setCardError('')
  }

  const executeOrderSuccess = () => {
    const purchasedSlugs = items.map((item) => item.slug)
    recordPurchase(form.email, purchasedSlugs)
    if (user && user.email === form.email) {
      addPetals(petalsEarned)
    }
    setPlacedSummary({ items, giftWrap, total })
    setPlaced(true)
    setProcessing(false)
    setTimeout(() => clear(), 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === 'cod') {
      executeOrderSuccess()
      return
    }

    if (paymentMethod === 'card') {
      const cleanNum = cardData.number.replace(/\D/g, '')
      if (cleanNum.length === 0 || !['4', '5', '6'].includes(cleanNum[0])) {
        setCardError('Invalid card number')
        return
      }
      if (!cardData.name.trim() || !cardData.expiry.trim() || !cardData.cvv.trim()) {
        setCardError('Please complete all card details.')
        return
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        setCardError('Please enter a valid UPI ID.')
        return
      }
    }

    // Start payment processing flow
    setCardError('')
    setProcessing(true)
    setPaymentStep('processing')

    setTimeout(() => {
      // 5% chance of simulated failure
      const isFailed = Math.random() < 0.05
      if (isFailed) {
        setProcessing(false)
        setPaymentStep('failed')
      } else {
        setPaymentStep('success')
        setTimeout(() => {
          executeOrderSuccess()
        }, 1000)
      }
    }, 2000)
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
        <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
        <Link to="/shop" className="text-bloom-neon hover:underline">
          Start shopping
        </Link>
      </div>
    )
  }

  if (placed) {
    const summaryItems = placedSummary?.items || items
    const summaryGiftWrap = placedSummary ? placedSummary.giftWrap : giftWrap
    const summaryTotal = placedSummary ? placedSummary.total : total

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-up relative z-10">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-gold to-bloom-terracotta items-center justify-center mb-6 neon-glow">
          <CheckCircleIcon size={32} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Order Placed!</h1>
        <p className="text-gray-400 mb-4">
          Thank you for your order. We'll send a confirmation to{' '}
          <span className="font-medium text-bloom-neon">{form.email}</span>. Your forever flowers are on their way!
        </p>
        <div className="glass rounded-2xl p-4 mb-4 inline-flex items-center gap-2">
          <PetalIcon size={20} className="text-bloom-gold" />
          <span className="text-sm text-bloom-gold">You earned {petalsEarned} Petals on this order</span>
        </div>
        <div className="glass rounded-2xl p-4 mb-8 inline-flex items-center gap-2">
          <CheckCircleIcon size={18} className="text-bloom-mint" />
          <span className="text-sm text-bloom-mint">Your purchases are now unlocked for review!</span>
        </div>
        <div className="glass-strong rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-serif font-bold mb-4">Order Summary</h2>
          {summaryItems.map((item) => (
            <div key={item.slug} className="flex justify-between text-sm py-2">
              <span>
                {item.name} × {item.qty}
              </span>
              <span className="font-medium">₹{item.price * item.qty}</span>
            </div>
          ))}
          {summaryGiftWrap && (
            <div className="flex justify-between text-sm py-2 text-bloom-rose">
              <span>Gift Wrap</span>
              <span className="font-medium">₹49</span>
            </div>
          )}
          <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{summaryTotal}</span>
          </div>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition"
        >
          Continue Shopping <ArrowRightIcon size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="glass-strong rounded-2xl p-6">
            <h2 className="text-lg font-serif font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition"
              />
              <input
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition"
              />
              <input
                required
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition sm:col-span-2"
              />
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition"
              />
              <input
                required
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition"
              />
              <input
                required
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-600 glow-focus transition sm:col-span-2"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h2 className="text-lg font-serif font-bold">Payment Method</h2>
              <span className="text-xs bg-bloom-rose/10 border border-bloom-rose/30 text-bloom-rose px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 self-start sm:self-auto">
                <ShieldIcon size={13} /> Demo Mode — No real charges
              </span>
            </div>

            {/* Selectable Payment Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your flowers arrive' },
                { id: 'upi', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm' },
                { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
              ].map((method) => (
                <label
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id as 'cod' | 'upi' | 'card')}
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition relative ${
                    paymentMethod === method.id
                      ? 'neon-border bg-bloom-rose/10 shadow-lg'
                      : 'glass hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white">{method.label}</span>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => handleSelectMethod(method.id as 'cod' | 'upi' | 'card')}
                      className="accent-bloom-rose"
                    />
                  </div>
                  <p className="text-xs text-gray-400">{method.desc}</p>
                </label>
              ))}
            </div>

            {/* Processing State */}
            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center justify-center p-8 glass rounded-2xl border border-bloom-rose/30 bg-bloom-darker/80 animate-fade-up my-4 text-center">
                <Spinner className="w-10 h-10 text-bloom-rose mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">Processing Payment...</h3>
                <p className="text-xs text-gray-400 max-w-xs">
                  Securing transaction with end-to-end 256-bit SSL encryption. Please do not refresh.
                </p>
              </div>
            )}

            {/* Success State */}
            {paymentStep === 'success' && (
              <div className="flex flex-col items-center justify-center p-8 glass rounded-2xl border border-emerald-500/30 bg-emerald-950/20 animate-fade-up my-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircleIcon size={32} />
                </div>
                <h3 className="text-lg font-bold text-emerald-300 mb-1">Payment Successful!</h3>
                <p className="text-xs text-gray-400">Finalizing your order confirmation...</p>
              </div>
            )}

            {/* Failed State */}
            {paymentStep === 'failed' && (
              <div className="flex flex-col items-center justify-center p-6 glass rounded-2xl border border-rose-500/40 bg-rose-950/30 animate-fade-up my-4 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <XCircleIcon size={32} />
                </div>
                <h3 className="text-lg font-bold text-rose-300 mb-1">Payment Failed</h3>
                <p className="text-xs text-gray-400 mb-4 max-w-sm">
                  Simulated network failure (5% test rate). No charges were applied to your account.
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition shadow-lg"
                >
                  <RefreshIcon size={16} /> Retry Payment
                </button>
              </div>
            )}

            {/* Form View */}
            {paymentStep !== 'processing' && paymentStep !== 'success' && paymentStep !== 'failed' && (
              <div>
                {/* UPI Payment Form */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 animate-fade-up pt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                        <LockIcon size={12} className="text-bloom-rose" />
                        <span>UPI ID / Virtual Payment Address</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="yourname@paytm"
                            value={upiId}
                            onChange={handleUpiIdChange}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 glow-focus transition text-sm"
                          />
                          {upiVerified && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                              <CheckIcon size={12} /> Verified
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          disabled={!upiId.trim() || upiVerifying || upiVerified}
                          className={`px-4 py-3 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shrink-0 ${
                            upiVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 disabled:opacity-50'
                          }`}
                        >
                          {upiVerifying ? (
                            <>
                              <Spinner className="w-3.5 h-3.5" /> Verifying...
                            </>
                          ) : upiVerified ? (
                            'Verified'
                          ) : (
                            'Verify UPI ID'
                          )}
                        </button>
                      </div>
                    </div>

                    <QRCodeMock amount={total} />

                    {cardError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                        <XCircleIcon size={16} className="shrink-0 text-rose-400" />
                        <span>{cardError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shadow-lg hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
                    >
                      <span>Pay Now</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                )}

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fade-up pt-2">
                    {/* Visual Card Preview */}
                    <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-bloom-wine via-bloom-darker to-bloom-dark border border-white/20 shadow-2xl text-white mb-6">
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-bloom-rose/20 blur-2xl pointer-events-none" />
                      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-bloom-gold/10 blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-start mb-6 relative z-10">
                        {/* Chip */}
                        <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-yellow-500/50 p-1 flex flex-col justify-between shadow-inner">
                          <div className="border-b border-yellow-800/30 h-1/2 w-full" />
                          <div className="border-t border-yellow-800/30 h-1/2 w-full" />
                        </div>

                        {/* Card Brand */}
                        <div>
                          {cardBrand === 'Visa' && (
                            <span className="font-extrabold italic text-xl tracking-wider text-blue-300 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-400/30 shadow-inner">
                              VISA
                            </span>
                          )}
                          {cardBrand === 'Mastercard' && (
                            <div className="flex items-center gap-1 bg-neutral-900/60 px-3 py-1 rounded-lg border border-white/10">
                              <div className="w-4 h-4 rounded-full bg-red-500 opacity-90" />
                              <div className="w-4 h-4 rounded-full bg-amber-400 -ml-2.5 opacity-90" />
                              <span className="text-xs font-bold text-gray-200 ml-1">mastercard</span>
                            </div>
                          )}
                          {cardBrand === 'RuPay' && (
                            <span className="font-extrabold text-sm tracking-widest text-emerald-300 bg-teal-950/60 px-3 py-1 rounded-lg border border-emerald-400/30 shadow-inner">
                              RuPay<span className="text-amber-400">❯</span>
                            </span>
                          )}
                          {!cardBrand && (
                            <span className="text-xs text-gray-400 font-mono uppercase bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                              CARD
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-mono text-lg sm:text-xl tracking-widest my-4 text-gray-100 font-semibold drop-shadow-sm relative z-10">
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end mt-4 text-xs font-mono relative z-10">
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Card Holder</div>
                          <div className="font-semibold text-gray-100 tracking-wider truncate max-w-[180px]">
                            {cardData.name.trim().toUpperCase() || 'CARDHOLDER NAME'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Expires</div>
                          <div className="font-semibold text-gray-100 tracking-wider">
                            {cardData.expiry || 'MM/YY'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                          <LockIcon size={12} className="text-bloom-rose" />
                          <span>Card Number</span>
                        </label>
                        <input
                          type="text"
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 glow-focus transition text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="Full name as on card"
                          value={cardData.name}
                          onChange={(e) => {
                            setCardData({ ...cardData, name: e.target.value })
                            if (cardError) setCardError('')
                          }}
                          className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 glow-focus transition text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 glow-focus transition text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                            <LockIcon size={12} className="text-bloom-rose" />
                            <span>CVV</span>
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardData.cvv}
                            onChange={handleCvvChange}
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 glow-focus transition text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {cardError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                        <XCircleIcon size={16} className="shrink-0 text-rose-400" />
                        <span>{cardError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shadow-lg hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Pay ₹{total}</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                )}

                {/* COD Details */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl glass border border-white/10 text-xs text-gray-300 space-y-2 animate-fade-up">
                    <p className="font-semibold text-white">Cash on Delivery Selected</p>
                    <p className="text-gray-400">
                      You will pay ₹{total} via cash or UPI QR code to our delivery executive when your flowers arrive.
                    </p>
                  </div>
                )}

                {/* Security SSL Badge */}
                <div className="flex items-center justify-center gap-2 mt-6 py-2.5 px-4 rounded-xl glass border border-white/10 text-xs text-gray-400">
                  <LockIcon size={14} className="text-bloom-gold" />
                  <ShieldIcon size={14} className="text-bloom-neon" />
                  <span>256-bit SSL Secured</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-serif font-bold mb-6">Your Order</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-bloom-darker"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium truncate max-w-[140px]">{item.name}</p>
                      <p className="text-gray-500 text-xs">× {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-medium">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 mb-4">
              <label className="flex items-center gap-3 cursor-pointer select-none glass p-3 rounded-xl hover:bg-white/5 transition border border-bloom-rose/30">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={toggleGiftWrap}
                  className="w-4 h-4 rounded accent-bloom-rose cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GiftIcon size={16} className="text-bloom-rose" />
                  <span>Add Premium Gift Wrap (+49 rupees)</span>
                </div>
              </label>
            </div>

            <div className="space-y-2 text-sm border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Gift Wrap</span>
                  <span className="font-medium">₹49</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between items-center text-bloom-gold">
                <span className="flex items-center gap-1">
                  <PetalIcon size={14} /> You'll earn
                </span>
                <span className="font-medium">{petalsEarned} Petals</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="flex items-center justify-center gap-2 w-full mt-6 px-6 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Spinner className="w-5 h-5" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${total}`}</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <LockIcon size={14} className="text-gray-600" />
              <p className="text-xs text-gray-600">Secure checkout</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
