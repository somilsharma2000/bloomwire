import { useState, useEffect, useRef } from 'react'
import { useRewards } from '../store/rewardsStore'
import { SparkleIcon, PetalIcon, CheckIcon } from './Icons'

function CloseIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `WELCOME-${suffix}`
}

export default function EntryPopup() {
  const addCoupon = useRewards(s => s.addCoupon)
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [couponCode, setCouponCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const triggeredRef = useRef(false)

  useEffect(() => {
    const path = window.location.hash.replace('#', '')
    if (path.includes('/cart') || path.includes('/checkout') || path.includes('/contact') || path.includes('/faq') || path.includes('/terms')) return

    try {
      const stored = localStorage.getItem('bloomwire_popup_seen')
      if (stored) {
        const expiry = parseInt(stored, 10)
        if (Date.now() < expiry) return
      }
    } catch { /* localStorage may be unavailable */ }

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggeredRef.current) return
      if (e.clientY <= 0 && !show) {
        triggeredRef.current = true
        setShow(true)
      }
    }

    const handleScroll = () => {
      if (triggeredRef.current) return
      const currentPath = window.location.hash.replace('#', '')
      if (currentPath.includes('/faq') || currentPath.includes('/terms') || currentPath.includes('/cart') || currentPath.includes('/checkout') || currentPath.includes('/contact')) return
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent >= 50) {
        triggeredRef.current = true
        setShow(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const dismissPopup = () => {
    const fourteenDays = 14 * 24 * 60 * 60 * 1000
    try {
      localStorage.setItem('bloomwire_popup_seen', String(Date.now() + fourteenDays))
    } catch { /* ignore */ }
  }

  const handleClose = () => {
    setShow(false)
    dismissPopup()
  }

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('sending')
    setErrorMsg('')

    const code = generateCode()

    try {
      // Subscribe via Base44 backend function
      const res = await fetch(import.meta.env.VITE_BACKEND_URL || 'https://elara-89a373b9.base44.app/functions/bloomwireApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createSubscriber',
          data: { email: email.trim().toLowerCase(), discountCode: code, discountPercent: 15, source: 'popup' }
        })
      })
      const result = await res.json()

      if (result.success) {
        addCoupon(code, 15)
        setCouponCode(code)
        setStatus('success')
        dismissPopup()
        return
      }

      // Check if already subscribed
      if (result.error && result.error.includes('already')) {
        const existingRes = await fetch(import.meta.env.VITE_BACKEND_URL || 'https://elara-89a373b9.base44.app/functions/bloomwireApi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getSubscriberByEmail', data: { email: email.trim().toLowerCase() } })
        })
        const existingData = await existingRes.json()
        if (existingData.success && existingData.data?.discountCode) {
          addCoupon(existingData.data.discountCode, 15)
          setCouponCode(existingData.data.discountCode)
          setStatus('success')
          dismissPopup()
          return
        }
      }

      throw new Error(result.error || 'Failed to subscribe')
    } catch (err) {
      console.error('[Subscribe] Error:', err)
      // Fallback: still give them a code locally
      addCoupon(code, 15)
      setCouponCode(code)
      setStatus('success')
      dismissPopup()
    }
  }

  const handleCopyCode = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#2d2418]/50 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg animate-scale-in border border-[#2d2418]/10 shadow-2xl overflow-hidden text-[#2d2418]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#8a7a6a] hover:text-[#2d2418] hover:bg-[#2d2418]/5 rounded-full transition-colors z-20"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-bloom-rose/20 to-bloom-cream/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 text-center">
          {status !== 'success' ? (
            <>
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center mb-5 shadow-lg">
                <SparkleIcon className="text-[#2d2418]" size={30} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-2.5">
                Welcome! Here's <span className="gradient-text">15% Off</span>
              </h2>
              <p className="text-sm text-[#6b5d4f] mb-6 max-w-sm mx-auto leading-relaxed">
                Unlock an instant discount code for your first handcrafted pipe cleaner bloom order — sent straight to your email.
              </p>
              <form onSubmit={handleClaim} className="space-y-3.5 max-w-sm mx-auto">
                <input
                  required
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#FFF8F3] border border-[#2d2418]/15 text-[#2d2418] placeholder-[#a0918a] focus:border-bloom-rose focus:outline-none transition text-center text-sm shadow-inner"
                  disabled={status === 'sending'}
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3.5 bg-gradient-to-r from-bloom-rose via-bloom-neon to-bloom-wine text-white rounded-xl font-medium text-sm shimmer-btn shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending to your email…' : 'Claim My 15% Discount'}
                </button>
              </form>
              {errorMsg && <p className="text-xs text-red-500 mt-2">{errorMsg}</p>}
              <p className="text-[11px] text-[#a0918a] mt-4">
                No spam, ever. Only handcrafted flowers, drop alerts, and exclusive offers.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-gold to-bloom-terracotta items-center justify-center mb-5 shadow-lg">
                <PetalIcon className="text-[#2d2418]" size={30} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-2">
                Check Your Email! 🎉
              </h2>
              <p className="text-sm text-[#6b5d4f] mb-5">
                Your <span className="text-bloom-rose font-bold">15% off</span> discount code has been sent to <span className="text-[#2d2418] font-semibold">{email}</span>
              </p>
              <div className="bg-[#FFF8F3] rounded-2xl p-4 inline-block w-full max-w-xs border border-bloom-rose/30 shadow-sm my-2">
                <p className="text-[10px] text-[#8a7a6a] uppercase tracking-widest mb-1 font-semibold">Your Code (also in your email)</p>
                <div className="flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-xl border border-[#2d2418]/10 shadow-inner">
                  <span className="text-xl font-mono font-bold gradient-text tracking-wider">{couponCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 text-xs text-bloom-rose hover:text-[#2d2418] transition flex items-center gap-1 font-medium"
                    title="Copy code"
                  >
                    {copied ? <CheckIcon size={16} className="text-green-600" /> : <span className="text-xs underline">Copy</span>}
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#8a7a6a] mt-5">
                Code has been automatically added to your available coupons.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 bg-[#2d2418]/10 hover:bg-[#2d2418]/20 text-[#2d2418] rounded-xl text-xs font-semibold transition"
              >
                Start Shopping Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
