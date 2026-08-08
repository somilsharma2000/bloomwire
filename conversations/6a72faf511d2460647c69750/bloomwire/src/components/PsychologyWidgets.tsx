import { useState } from 'react'
import { ShieldIcon, TruckIcon, HeartIcon, SparkleIcon } from './Icons'

// --- Free Shipping Progress Bar ---
export function FreeShippingBar({ subtotal, threshold = 499 }: { subtotal: number; threshold?: number }) {
  const remaining = Math.max(0, threshold - subtotal)
  const percentage = Math.min(100, (subtotal / threshold) * 100)
  const isComplete = remaining === 0
  const isClose = remaining > 0 && remaining <= 100

  return (
    <div className="glass rounded-xl p-4 neon-border">
      {isComplete ? (
        <p className="text-sm text-bloom-mint font-medium flex items-center gap-2 justify-center">
          <TruckIcon size={16} /> You've unlocked <span className="font-bold">FREE shipping!</span> 🎉
        </p>
      ) : (
        <>
          <p className={`text-sm text-center mb-3 ${isClose ? 'text-bloom-gold font-bold animate-pulse' : 'text-bloom-neon'}`}>
            {isClose ? (
              <>SO CLOSE! Add just <span className="font-bold text-lg">₹{remaining}</span> more for FREE shipping 🔥</>
            ) : (
              <>Add <span className="font-bold text-lg">₹{remaining}</span> more for <span className="font-bold">FREE shipping</span> 🚚</>
            )}
          </p>
          <div className="relative h-2.5 rounded-full bg-[#2d2418]/10 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-bloom-rose to-bloom-wine transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 shimmer-btn rounded-full" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-[#a0918a] mt-1.5">
            <span>₹{subtotal}</span>
            <span>₹{threshold}</span>
          </div>
        </>
      )}
    </div>
  )
}

// --- Trust Badges Row ---
export function TrustBadges() {
  const badges = [
    { Icon: ShieldIcon, text: 'UPI & COD Available' },
    { Icon: TruckIcon, text: 'Fast Delivery' },
    { Icon: HeartIcon, text: 'Handcrafted' },
    { Icon: SparkleIcon, text: 'Quality Guaranteed' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-2 glass rounded-lg p-2.5">
          <badge.Icon size={16} className="text-bloom-neon shrink-0" />
          <span className="text-xs text-[#8a7a6a] font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  )
}

// --- Post-Purchase Share CTA ---
export function ShareEarnCTA({ petals = 50 }: { petals?: number }) {
  const [copied, setCopied] = useState(false)
  const shareText = 'Just got my lasting flowers from Bloomwire! 🌸 Use my link to get 100 Petals on your first order.'

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bloomwire',
          text: shareText,
          url: window.location.origin,
        })
      } catch { /* user cancelled */ }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-6 mt-6 border border-bloom-gold/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-gold to-bloom-terracotta flex items-center justify-center shrink-0">
          <SparkleIcon size={20} className="text-[#2d2418]" />
        </div>
        <div className="text-left">
          <h3 className="font-serif font-bold text-[#2d2418]">Share & Earn {petals} Petals</h3>
          <p className="text-xs text-[#8a7a6a]">Tell your friends about your bloom — earn rewards when they shop!</p>
        </div>
      </div>
      <button
        onClick={handleShare}
        className="w-full px-4 py-3 bg-gradient-to-r from-bloom-gold to-bloom-terracotta text-[#2d2418] rounded-full font-medium text-sm shimmer-btn hover:scale-105 transition"
      >
        {copied ? '✓ Copied to clipboard!' : 'Share your unboxing 📸'}
      </button>
    </div>
  )
}

// --- Referral Card ---
export function ReferralCard({ referralCode, referralCount }: { referralCode: string; referralCount: number }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="glass-strong rounded-2xl p-6 border border-bloom-neon/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-neon to-bloom-rose flex items-center justify-center shrink-0">
          <HeartIcon size={20} className="text-[#2d2418]" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-[#2d2418]">Refer & Earn</h3>
          <p className="text-xs text-[#8a7a6a]">Share your link — you both get ₹50 off + 50 Petals!</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={link}
          className="flex-1 px-3 py-2 glass rounded-lg text-xs text-[#8a7a6a] border border-[#2d2418]/10"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gradient-to-r from-bloom-neon to-bloom-rose text-[#2d2418] rounded-lg text-xs font-medium hover:scale-105 transition shrink-0"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      {referralCount > 0 && (
        <p className="text-xs text-bloom-gold mt-3">
          🎉 {referralCount} friend{referralCount !== 1 ? 's' : ''} invited so far!
        </p>
      )}
    </div>
  )
}
