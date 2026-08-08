import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../store/authStore'
import { useRewards } from '../store/rewardsStore'
import { useToastStore } from "../store/toastStore"
import {
  PetalIcon,
  ArrowRightIcon,
  SparkleIcon,
  GiftIcon,
  CheckCircleIcon,
  StarIcon,
  LockIcon,
  CartIcon,
  FlameIcon,
  TicketIcon,
} from '../components/Icons'
import { useSEO } from '../hooks/useSEO'
import { trackReferralClick } from '../lib/ga4'
import { api, resizeImage } from '../lib/api'

const BASE_IMAGE_URL = 'https://media.base44.com/images/public/6a72faf2ba70adb989a373b9/'

// Milestone Badge SVG Icons
function SproutIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12C12 7 7 5 3 6C3 11 8 13 12 12Z" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 12C12 7 17 5 21 6C21 11 16 13 12 12Z" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 22H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BloomBadgeIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C13.5 6 15 7.5 19 9C15 10.5 13.5 12 12 16C10.5 12 9 10.5 5 9C9 7.5 10.5 6 12 2Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" />
      <path d="M12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 19C10.5 18.5 12 19 12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 18C13.5 17.5 12 18 12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FullBloomIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M12 4V20M4 12H20M6.34 6.34L17.66 17.66M6.34 17.66L17.66 6.34" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      <path d="M12 6C13.5 9.5 14.5 10.5 18 12C14.5 13.5 13.5 14.5 12 18C10.5 14.5 9.5 13.5 6 12C9.5 10.5 10.5 9.5 12 6Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  )
}

function MasterGardenerIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 16L3 5L8.5 10L12 3L15.5 10L21 5L19 16H5Z" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
      <path d="M12 13V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LegendIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      <path d="M12 10.5L12.5 12L13.5 12.5L12.5 13L12 14.5L11.5 13L10.5 12.5L11.5 12L12 10.5Z" fill="#FFF" />
    </svg>
  )
}

interface SpecificReward {
  id: string
  name: string
  petalsCost: number
  valueBrackets: string
  imageFilename: string
  description: string
  levelLabel: string
}

const SPECIFIC_REWARDS: SpecificReward[] = [
  {
    id: 'reward-keychain',
    name: 'Complimentary Keychain',
    petalsCost: 2000,
    valueBrackets: '(₹2,000)',
    imageFilename: 'af6ed7668_generated_image.png',
    description: 'Complimentary keychain (value ₹200) — added to your next qualifying order of ₹200+. Handcrafted chenille mini flower keychain with durable alloy ring.',
    levelLabel: 'LEVEL 1',
  },
  {
    id: 'reward-flower',
    name: 'Complimentary Flower Stem',
    petalsCost: 1000,
    valueBrackets: '(₹1,000)',
    imageFilename: '4c2c8d86b_generated_image.png',
    description: 'Complimentary flower stem (value ₹300) — added to your next qualifying order of ₹300+. Single stem long-lasting handcrafted flower with ribbon wrap.',
    levelLabel: 'LEVEL 2',
  },
  {
    id: 'reward-pot',
    name: 'Complimentary Clay Pot',
    petalsCost: 2000,
    valueBrackets: '(₹2,000)',
    imageFilename: '973bd399e_generated_image.png',
    description: 'Complimentary clay pot (value ₹500) — added to your next qualifying order of ₹500+. Mini hand-sculpted flower arrangement in a rustic terracotta pot.',
    levelLabel: 'LEVEL 3',
  },
]

const RAFFLE_PRIZES = [
  {
    name: 'Velvet Sunset Rose Bouquet',
    value: '₹1,299',
    image: `${BASE_IMAGE_URL}5ebab43fd_generated_image.png`,
    badge: 'GRAND PRIZE',
  },
  {
    name: 'Ethereal Sunflower Medley',
    value: '₹1,199',
    image: `${BASE_IMAGE_URL}d189b46d8_generated_image.png`,
    badge: 'POPULAR',
  },
  {
    name: 'Midnight Lavender Mist Bouquet',
    value: '₹1,499',
    image: `${BASE_IMAGE_URL}614f2dcf3_generated_image.png`,
    badge: 'LUXURY',
  },
  {
    name: 'Master Artisan Bouquet DIY Box',
    value: '₹1,299',
    image: `${BASE_IMAGE_URL}0e0327f62_generated_image.png`,
    badge: 'EXCLUSIVE',
  },
]

const MILESTONES = [
  {
    days: 3,
    title: 'Sprout badge',
    badgeName: 'Sprout',
    description: 'Began your blooming journey with 3 consecutive check-ins.',
    Icon: SproutIcon,
    color: 'from-emerald-500 to-teal-400',
    borderColor: 'border-emerald-400/50',
    glowColor: 'shadow-[0_0_25px_rgba(52,211,153,0.3)]',
  },
  {
    days: 7,
    title: 'Bloom badge',
    badgeName: 'Bloom',
    description: 'Completed a full 7-day daily check-in week!',
    Icon: BloomBadgeIcon,
    color: 'from-bloom-rose to-pink-500',
    borderColor: 'border-bloom-rose/50',
    glowColor: 'shadow-[0_0_25px_rgba(255,64,129,0.3)]',
  },
  {
    days: 14,
    title: 'Full Bloom badge',
    badgeName: 'Full Bloom',
    description: 'Maintained a stellar 14-day check-in streak.',
    Icon: FullBloomIcon,
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-400/50',
    glowColor: 'shadow-[0_0_25px_rgba(168,85,247,0.3)]',
  },
  {
    days: 30,
    title: 'Master Gardener badge',
    badgeName: 'Master Gardener',
    description: 'An elite 30-day streak of relentless daily check-in dedication.',
    Icon: MasterGardenerIcon,
    color: 'from-bloom-gold to-amber-500',
    borderColor: 'border-bloom-gold/50',
    glowColor: 'shadow-[0_0_25px_rgba(245,197,99,0.35)]',
  },
  {
    days: 50,
    title: 'Bloomwire Legend badge',
    badgeName: 'Bloomwire Legend',
    description: 'The ultimate 50-day streak of true floral royalty.',
    Icon: LegendIcon,
    color: 'from-cyan-400 via-bloom-rose to-bloom-gold',
    borderColor: 'border-cyan-300/60',
    glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.4)]',
  },
]

export default function Rewards() {
  const navigate = useNavigate()
  useSEO({ title: "Bloomwire — Petals Rewards | Earn and Redeem", description: "Earn Petals on every order and redeem for complimentary handcrafted products. Daily check-ins, raffle entries, and tier rewards.", canonicalPath: "/#/rewards" })

  const user = useAuth(s => s.user)
  const deductPetals = useAuth(s => s.deductPetals)
  const claimDailyLogin = useAuth(s => s.claimDailyLogin)
  const addCoupon = useRewards(s => s.addCoupon)
  const showToast = useToastStore(s => s.showToast)

  const [orderCalcAmount, setOrderCalcAmount] = useState<number>(1000)
    const [, setRedeemedReward] = useState<string | null>(null)
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null)

  // Floating reward animation state
  const [floatingReward, setFloatingReward] = useState<{ amount: number; isDay7: boolean; key: number } | null>(null)
  const [showWeeklyBonusModal, setShowWeeklyBonusModal] = useState(false)
  const [referralCopied, setReferralCopied] = useState(false)
  const [unboxingFile, setUnboxingFile] = useState<File | null>(null)
  const [unboxingPreview, setUnboxingPreview] = useState<string>('')
  const [unboxingCaption, setUnboxingCaption] = useState('')
  const [unboxingSubmitting, setUnboxingSubmitting] = useState(false)
  const [unboxingStatus, setUnboxingStatus] = useState({ pending: 0, approved: 0, rejected: 0, totalPetals: 0, canSubmit: true })
  const [unboxingError, setUnboxingError] = useState('')

  // Fetch unboxing status on mount
  useEffect(() => {
    if (user?.email) {
      api.getUnboxingStatus(user.email).then((res: any) => {
        if (res.success && res.data) setUnboxingStatus(res.data)
      })
    }
  }, [user?.email])

  // Handle file selection
  const handleUnboxingFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setUnboxingError('Image must be under 10MB'); return }
    setUnboxingError('')
    setUnboxingFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setUnboxingPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // Submit unboxing
  const submitUnboxing = async () => {
    if (!user?.email || !unboxingFile) return
    setUnboxingSubmitting(true)
    setUnboxingError('')
    try {
      const resized = await resizeImage(unboxingFile, 800, 0.75)
      const res = await api.submitUnboxing(user.email, resized, 'image', unboxingCaption)
      if (res.success && res.data?.success !== false) {
        setUnboxingFile(null)
        setUnboxingPreview('')
        setUnboxingCaption('')
        showToast("✓ Submitted! We'll review and credit 50 Petals within 48 hours.", 'success')
        api.getUnboxingStatus(user.email).then((r: any) => { if (r.success && r.data) setUnboxingStatus(r.data) })
      } else {
        setUnboxingError(res.data?.error || res.error || 'Submission failed')
      }
    } catch (err: any) {
      setUnboxingError(err.message || 'Failed to submit')
    }
    setUnboxingSubmitting(false)
  }

  const [referralLink] = useState(() => {
    // Use user's unique referral code from authStore (server-assigned, collision-checked)
    const code = user?.referralCode || 'GUEST'
    return `https://somilsharma2000.github.io/bloomwire/?ref=${code}`
  })

  // Live countdown timer to next check-in (midnight)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      const diff = Math.max(0, tomorrow.getTime() - now.getTime())
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ hours, minutes, seconds })
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  // User petal count & streak
  const currentPetals = user ? user.petals : 0
  const totalSpent = user ? (user.totalSpent || 0) : 0
  const currentStreak = user?.streak || 0

  const today = new Date().toISOString().split('T')[0]
  const isCheckedInToday = !!user && (user.lastStreakDate === today || user.lastLoginDate === today)

  const yesterdayObj = new Date()
  yesterdayObj.setDate(yesterdayObj.getDate() - 1)
  const yesterdayStr = yesterdayObj.toISOString().split('T')[0]
  const lastDate = user?.lastStreakDate || user?.lastLoginDate
  const isConsecutiveFromYesterday = lastDate === yesterdayStr

  // Determine active day in 7-day cycle (1 to 7)
  let activeCycleDay = 1
  if (isCheckedInToday) {
    activeCycleDay = ((currentStreak - 1) % 7) + 1
  } else if (isConsecutiveFromYesterday) {
    activeCycleDay = (currentStreak % 7) + 1
  } else {
    activeCycleDay = 1
  }

  const STREAK_DAY_REWARDS = [
    { day: 1, petals: 5, bonus: null },
    { day: 2, petals: 10, bonus: null },
    { day: 3, petals: 15, bonus: null },
    { day: 4, petals: 20, bonus: null },
    { day: 5, petals: 30, bonus: null },
    { day: 6, petals: 40, bonus: null },
    { day: 7, petals: 75, bonus: '🎟️ +1 Ticket' },
  ]

  // Redirect to login if not signed in
  const handleSignIn = () => {
    navigate('/#/login?redirect=/#/rewards')
  }

  // Handle Daily Check-In
  const handleCheckInClick = () => {
    if (!user) {
      handleSignIn()
      return
    }
    const awarded = claimDailyLogin()
    // Backend sync happens in authStore now
    if (awarded > 0) {
      // Calculate updated streak cycle day
      const updatedStreak = (user.streak || 0) + 1
      const updatedCycleDay = ((updatedStreak - 1) % 7) + 1
      const isDay7 = awarded === 75 || updatedCycleDay === 7

      setFloatingReward({
        amount: awarded,
        isDay7,
        key: Date.now(),
      })

      if (isDay7) {
        setShowWeeklyBonusModal(true)
      }

      setTimeout(() => {
        setFloatingReward(null)
      }, 2800)
    }
  }

  // Calculation for Next Milestone (500, 1000, 2000)
  const getMilestoneInfo = (petals: number) => {
    if (petals < 500) {
      const needed = 500 - petals
      return {
        target: 500,
        nextReward: 'Complimentary Keychain',
        value: '₹200',
        needed,
        progressPercent: Math.min(100, Math.max(0, (petals / 500) * 100)),
        message: `You have ${petals} petals. Earn ${needed} more to unlock a Complimentary Keychain!`,
        tierName: 'Seed Member',
        unlockedPerks: '5% Petals cash back on all orders',
      }
    } else if (petals < 1000) {
      const needed = 1000 - petals
      return {
        target: 1000,
        nextReward: 'Complimentary Flower Stem',
        value: '₹300',
        needed,
        progressPercent: Math.min(100, Math.max(0, ((petals - 500) / 500) * 100)),
        message: `You have ${petals} petals. Earn ${needed} more to unlock a Complimentary Flower Stem!`,
        tierName: 'Petal Crafter',
        unlockedPerks: 'Complimentary Keychain Tier',
      }
    } else if (petals < 2000) {
      const needed = 2000 - petals
      return {
        target: 2000,
        nextReward: 'Complimentary Clay Pot',
        value: '₹500',
        needed,
        progressPercent: Math.min(100, Math.max(0, ((petals - 1000) / 1000) * 100)),
        message: `You have ${petals} petals. Earn ${needed} more to unlock a Complimentary Clay Pot!`,
        tierName: 'Master Sculptor',
        unlockedPerks: 'Complimentary Flower Stem Tier',
      }
    } else {
      return {
        target: 2000,
        nextReward: 'All Rewards Unlocked!',
        value: 'Max Tier',
        needed: 0,
        progressPercent: 100,
        message: `You have ${petals} petals! You've unlocked ALL Tier Rewards! Keep earning for unlimited raffle entries!`,
        tierName: 'Floral VIP',
        unlockedPerks: 'Complimentary Clay Pot Tier + VIP Perks',
      }
    }
  }

  const milestone = getMilestoneInfo(currentPetals)

  // Raffle Ticket Calculations
  const ticketCount = Math.floor(totalSpent / 500)

  // Next Raffle Draw Date Calculation
  const calculateNextDraw = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

    let drawDate: Date
    if (day < 15) {
      drawDate = new Date(year, month, 15)
    } else {
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
      if (day < lastDayOfMonth) {
        drawDate = new Date(year, month, lastDayOfMonth)
      } else {
        drawDate = new Date(year, month + 1, 15)
      }
    }

    const diffTime = drawDate.getTime() - now.getTime()
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    const formattedDate = drawDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    return { formattedDate, daysLeft: diffDays }
  }

  const nextDrawInfo = calculateNextDraw()

  // Handle Reward Redemption
  const handleRedeem = (reward: SpecificReward) => {
    if (!user) {
      handleSignIn()
      return
    }
    if (currentPetals < reward.petalsCost) return

    // Minimum order value = reward product value
    const minOrderMap: Record<string, number> = { 'reward-keychain': 199, 'reward-flower': 299, 'reward-pot': 499 }
    const minOrder = minOrderMap[reward.id] || 999
    if (!user.hasPurchased || (user.totalSpent || 0) < minOrder) {
      showToast(`Place a qualifying order of ₹${minOrder}+ to receive this complimentary reward`, 'error')
      return
    }

    deductPetals(reward.petalsCost)
    const code = `REWARD-${reward.name.replace(/\s+/g, '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    
    const discountVal = reward.petalsCost === 500 ? 199 : reward.petalsCost === 1000 ? 299 : 499
    addCoupon(code, discountVal)

    setRedeemedReward(reward.name + " — Complimentary with your next order of ₹" + minOrder + "+")
    setRedeemedCode(code)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 space-y-16">
      <style>{`
        @keyframes floatUpFade {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px) scale(0.7);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -25px) scale(1.15);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -75px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -110px) scale(0.85);
          }
        }
        .animate-float-up-fade {
          animation: floatUpFade 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* HERO HEADER */}
      <div className="text-center relative py-6">
        {/* Layered Gradient Glow Effect Behind Title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[750px] lg:h-[750px] bg-gradient-to-tr from-bloom-rose/30 via-bloom-neon/20 to-bloom-gold/30 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-bloom-wine/40 via-purple-600/30 to-amber-500/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-bloom-rose/15 border border-bloom-rose/40 text-bloom-neon text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(255,64,129,0.25)]">
          <SparkleIcon size={14} /> Gen Z Loyalty & Perks
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold mb-6 tracking-tight leading-tight text-[#2d2418] drop-shadow-xl">
          Bloomwire <span className="gradient-text drop-shadow-[0_0_30px_rgba(245,197,99,0.35)]">Rewards</span>
        </h1>

        <p className="text-[#6b5d4f] max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed font-normal drop-shadow-md">
          Level up your floral aesthetic. Collect Petals on every order, claim complimentary handcrafted products, and score entries into bi-weekly surprise raffles!
        </p>
      </div>

      {/* 1. DAILY BLOOM CHECK-IN SECTION */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-bloom-rose/20 relative overflow-hidden shadow-xl bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-bloom-rose/25 via-purple-600/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-bloom-gold/20 via-amber-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Floating Petals Earned Animation */}
        {floatingReward && (
          <div
            key={floatingReward.key}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center animate-float-up-fade"
          >
            <div className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-bloom-rose via-amber-400 to-bloom-gold text-white font-black text-2xl sm:text-4xl shadow-[0_0_50px_rgba(245,197,99,0.9)] border-2 border-white/80 flex items-center gap-2.5 backdrop-blur-md">
              <PetalIcon size={34} className="text-[#2d2418] animate-spin" />
              +{floatingReward.amount} Petals!
            </div>
            {floatingReward.isDay7 && (
              <div className="mt-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-[#2d2418] font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.8)] border border-white/60 animate-bounce flex items-center gap-1.5">
                <TicketIcon size={18} className="text-bloom-gold" />
                <span>Keep your streak alive!</span>
              </div>
            )}
          </div>
        )}

        {/* Header with Streak Status */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-[#2d2418]/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bloom-gold/15 border border-bloom-gold/30 text-bloom-gold text-xs font-bold uppercase tracking-wider mb-2">
              <FlameIcon size={14} className="animate-pulse" /> Daily Login Bonus
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2d2418] flex items-center gap-3">
              Daily Bloom <span className="gradient-text">Check-In</span>
            </h2>
            <p className="text-sm text-[#6b5d4f] mt-1">
              Check in daily to build your streak, harvest cascading Petals, and win weekly raffle entries!
            </p>
          </div>

          {/* Current Streak Pill */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-bloom-wine/60 to-purple-900/60 border border-bloom-rose/40 rounded-2xl px-5 py-3 shadow-[0_0_25px_rgba(255,64,129,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-bloom-rose flex items-center justify-center text-[#2d2418] shadow-lg shrink-0">
              <FlameIcon size={26} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[11px] text-[#6b5d4f] uppercase font-bold tracking-wider block">Current Streak</span>
              <div className="text-xl sm:text-2xl font-black text-[#2d2418] flex items-center gap-1.5">
                <span>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</span>
                {currentStreak > 0 && <span className="text-xs px-2 py-0.5 rounded-md bg-bloom-rose/30 text-bloom-neon border border-bloom-rose/40 font-semibold">Active 🔥</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Check-In Card & Main Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-10">
          <div className="lg:col-span-2 space-y-4">
            {!user ? (
              <div className="p-6 rounded-2xl bg-white/60 border border-[#2d2418]/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2d2418] mb-1">Start Your Check-In Streak Today!</h3>
                  <p className="text-xs text-[#6b5d4f]">Sign in to harvest your daily Petal rewards and unlock streak badges.</p>
                </div>
                <button
                  onClick={() => navigate("/#/profile")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-bloom-rose to-bloom-gold text-white text-sm font-bold shadow-lg hover:scale-105 transition-all duration-200 shrink-0"
                >
                  Quick Sign In
                </button>
              </div>
            ) : isCheckedInToday ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-900/30 to-emerald-900/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircleIcon size={32} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold mb-1">
                      <span>✓ Checked In Today!</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#2d2418]">See you tomorrow!</h3>
                    <p className="text-xs text-emerald-600">Your streak is safe! Next check-in resets at midnight.</p>
                  </div>
                </div>

                {/* Countdown Timer Pill */}
                <div className="text-center sm:text-right bg-emerald-50 border border-emerald-600/30 rounded-xl px-4 py-2.5 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#8a7a6a] block tracking-wider mb-0.5">Next Check-In In</span>
                  <div className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-bloom-rose/15 via-purple-900/20 to-bloom-gold/15 border border-bloom-rose/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-bloom-gold uppercase tracking-wider block mb-1">
                    Today's Available Bonus
                  </span>
                  <h3 className="text-2xl font-bold text-[#2d2418] flex items-center gap-2">
                    Claim Day {activeCycleDay} Reward
                  </h3>
                  <p className="text-xs text-[#6b5d4f] mt-1">
                    {activeCycleDay === 7
                      ? 'Weekly Max Bonus: Earn +20 Petals!'
                      : `Check in now to instantly claim +${STREAK_DAY_REWARDS[activeCycleDay - 1].petals} Petals.`}
                  </p>
                </div>

                {/* Pulsing Check In Button */}
                <button
                  onClick={handleCheckInClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-bloom-rose via-purple-600 to-bloom-gold text-white font-extrabold text-lg shadow-[0_0_35px_rgba(255,64,129,0.5)] border border-[#2d2418]/25 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse flex items-center justify-center gap-2.5 shrink-0 group"
                >
                  <SparkleIcon size={22} className="text-bloom-gold group-hover:rotate-180 transition-transform duration-500" />
                  <span>CHECK IN NOW</span>
                  <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Streak Tip Card */}
          <div className="glass rounded-2xl p-5 border border-[#2d2418]/10 space-y-3 bg-white/60">
            <div className="flex items-center gap-2 text-bloom-gold font-bold text-xs uppercase tracking-wider">
              <StarIcon size={16} /> Streak Rules & Escalation
            </div>
            <p className="text-xs text-[#6b5d4f] leading-relaxed">
              Check in consecutively each day to escalate daily Petal rewards from 5 to 75 Petals. Completing Day 7 grants bonus Petals and loops the cycle!
            </p>
            <div className="pt-2 border-t border-[#2d2418]/10 flex items-center justify-between text-[11px] text-[#8a7a6a]">
              <span>Missed a day? Streak resets to Day 1.</span>
            </div>
          </div>
        </div>

        {/* 2. STREAK VISUALIZATION TRACKER (Days 1 to 7) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#2d2418] uppercase tracking-wider flex items-center gap-2">
              <span>7-Day Check-In Rewards Tracker</span>
            </h3>
            <span className="text-xs text-bloom-gold font-medium">Cycle resets weekly • Streak stays active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {STREAK_DAY_REWARDS.map((item) => {
              const dayNum = item.day

              // Determine status of dayNum
              let isCompleted = false
              let isCurrentTarget = false

              if (isCheckedInToday) {
                if (dayNum <= activeCycleDay) isCompleted = true
              } else {
                if (dayNum < activeCycleDay) isCompleted = true
                if (dayNum === activeCycleDay) isCurrentTarget = true
              }

              return (
                <div
                  key={dayNum}
                  className={`relative rounded-2xl p-4 text-center transition-all duration-300 flex flex-col items-center justify-between border ${
                    isCompleted
                      ? 'bg-gradient-to-b from-bloom-rose/15 via-bloom-lavender/20 to-bloom-blush/30 border-bloom-rose/50 shadow-[0_0_20px_rgba(255,64,129,0.15)]'
                      : isCurrentTarget
                      ? 'bg-gradient-to-b from-bloom-gold/15 via-amber-100/30 to-bloom-gold/20 border-bloom-gold shadow-[0_0_25px_rgba(245,197,99,0.25)] animate-pulse scale-105'
                      : 'bg-white/60 border-[#2d2418]/10 text-[#a0918a] opacity-70'
                  }`}
                >
                  {/* Top Badge: Completed Checkmark or Day Label */}
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-[#6b5d4f]">
                    Day {dayNum}
                  </div>

                  {/* Circular Icon Display */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center my-1 font-bold text-sm transition-transform duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-tr from-bloom-rose to-purple-600 text-white shadow-md'
                        : isCurrentTarget
                        ? 'bg-gradient-to-tr from-bloom-gold via-amber-400 to-amber-600 text-black shadow-[0_0_15px_rgba(245,197,99,0.6)] scale-110'
                        : 'bg-white/70 border border-[#2d2418]/10 text-[#8a7a6a]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon size={24} className="text-[#2d2418]" />
                    ) : (
                      <PetalIcon size={22} className={isCurrentTarget ? 'text-black' : 'text-[#8a7a6a]'} />
                    )}
                  </div>

                  {/* Petal Reward Amount */}
                  <div className="mt-2">
                    <span
                      className={`text-sm font-black block ${
                        isCompleted
                          ? 'text-bloom-neon'
                          : isCurrentTarget
                          ? 'text-bloom-gold'
                          : 'text-[#8a7a6a]'
                      }`}
                    >
                      +{item.petals} Petals
                    </span>
                    {item.bonus && (
                      <span className="text-[10px] font-bold text-purple-700 block mt-0.5 bg-purple-500/20 px-1.5 py-0.5 rounded-full border border-purple-500/40">
                        {item.bonus}
                      </span>
                    )}
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="mt-3">
                    {isCompleted ? (
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Done ✓
                      </span>
                    ) : isCurrentTarget ? (
                      <span className="text-[9px] font-bold text-black uppercase tracking-wider bg-bloom-gold px-2 py-0.5 rounded-full shadow-sm">
                        Today
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-[#a0918a] uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. DISTINCT STREAK MILESTONES & BADGES SECTION */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-[#2d2418]/10 relative overflow-hidden shadow-2xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <StarIcon size={14} /> Streak Achievements
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-2">
            Milestone <span className="gradient-text">Badges</span>
          </h2>
          <p className="text-sm text-[#6b5d4f]">
            Showcase your consistency and unlock exclusive honor badges as your daily streak grows!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {MILESTONES.map((badge) => {
            const isUnlocked = currentStreak >= badge.days
            const BadgeIcon = badge.Icon

            return (
              <div
                key={badge.days}
                className={`relative rounded-2xl p-6 transition-all duration-300 border flex flex-col items-center text-center justify-between group ${
                  isUnlocked
                    ? `glass ${badge.borderColor} ${badge.glowColor} bg-gradient-to-b from-white via-bloom-blush/30 to-bloom-rose/10 hover:-translate-y-1`
                    : 'bg-white/60 border-[#2d2418]/10 opacity-60 grayscale hover:grayscale-0 transition-all'
                }`}
              >
                {/* Unlocked / Locked Pill Header */}
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a6a]">
                    {badge.days}-Day Streak
                  </span>
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-600/30 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircleIcon size={10} /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white/70 text-[#8a7a6a] border border-[#2d2418]/10 text-[10px] font-bold flex items-center gap-1">
                      <LockIcon size={10} /> Locked
                    </span>
                  )}
                </div>

                {/* Badge SVG Icon Display */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center my-2 transition-transform duration-300 group-hover:scale-110 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${badge.color} text-[#2d2418] shadow-xl shadow-black/50 border border-[#2d2418]/25`
                      : 'bg-white/70 border border-[#2d2418]/10 text-[#8a7a6a]'
                  }`}
                >
                  <BadgeIcon size={44} className={isUnlocked ? 'text-[#2d2418] drop-shadow-md' : 'text-[#8a7a6a]'} />
                </div>

                {/* Badge Title & Description */}
                <div className="mt-3">
                  <h3 className="text-lg font-bold text-[#2d2418] mb-1">{badge.title}</h3>
                  <p className="text-xs text-[#6b5d4f] leading-relaxed mb-4">{badge.description}</p>
                </div>

                {/* Progress Bar / Unlocked Tag */}
                <div className="w-full pt-3 border-t border-[#2d2418]/10">
                  {isUnlocked ? (
                    <span className="text-xs font-bold text-bloom-gold">Badge Active</span>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-[#8a7a6a] font-medium">
                        <span>Progress</span>
                        <span>{Math.min(currentStreak, badge.days)} / {badge.days} days</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/70 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-bloom-rose to-bloom-gold rounded-full"
                          style={{ width: `${Math.min(100, (currentStreak / badge.days) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 1: WHY USE PETALS */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-[#2d2418]/10 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-bloom-gold/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-bloom-gold tracking-widest uppercase mb-2 block">
            The Bloomwire Advantage
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">
            Why Use <span className="gradient-text">Petals</span>?
          </h2>
          <p className="text-base sm:text-lg font-medium text-bloom-neon bg-bloom-rose/10 border border-bloom-rose/25 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            “Earn Petals on every purchase, redeem them for complimentary products with qualifying orders, and enter promotional giveaways for surprise rewards”
          </p>
        </div>

        {/* 3 Visual Cards: Earn, Redeem, Win */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* EARN */}
          <div className="glass rounded-2xl p-6 border border-[#2d2418]/10 hover:border-bloom-rose/60 hover:shadow-[0_0_30px_rgba(255,64,129,0.2)] transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-rose/30 to-bloom-wine/30 border border-bloom-rose/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CartIcon size={28} className="text-bloom-neon" />
            </div>
            <div className="inline-block px-2.5 py-1 rounded-md bg-bloom-rose/20 text-bloom-neon text-xs font-bold uppercase mb-3">
              1. EARN
            </div>
            <h3 className="text-xl font-bold text-[#2d2418] mb-2">On Every Shopping</h3>
            <p className="text-sm text-[#8a7a6a] leading-relaxed">
              Earn <span className="text-[#2d2418] font-medium">5% back</span> of your total order value in Petals automatically every single time you shop on Bloomwire.
            </p>
          </div>

          {/* REDEEM */}
          <div className="glass rounded-2xl p-6 border border-[#2d2418]/10 hover:border-bloom-gold/60 hover:shadow-[0_0_30px_rgba(245,197,99,0.2)] transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-gold/30 to-amber-600/30 border border-bloom-gold/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <GiftIcon size={28} className="text-bloom-gold" />
            </div>
            <div className="inline-block px-2.5 py-1 rounded-md bg-bloom-gold/20 text-bloom-gold text-xs font-bold uppercase mb-3">
              2. REDEEM
            </div>
            <h3 className="text-xl font-bold text-[#2d2418] mb-2">For Free Products</h3>
            <p className="text-sm text-[#8a7a6a] leading-relaxed">
              Trade your accrued Petals for <span className="text-[#2d2418] font-medium">complimentary gifts</span> like chenille keychains, single blooms, and terracotta potted decor! Added to your next qualifying order.
            </p>
          </div>

          {/* WIN */}
          <div className="glass rounded-2xl p-6 border border-[#2d2418]/10 hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <SparkleIcon size={28} className="text-purple-700" />
            </div>
            <div className="inline-block px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-700 text-xs font-bold uppercase mb-3">
              3. WIN
            </div>
            <h3 className="text-xl font-bold text-[#2d2418] mb-2">Raffle Draws</h3>
            <p className="text-sm text-[#8a7a6a] leading-relaxed">
              Earn <span className="text-[#2d2418] font-medium">1 entry for every ₹500 spent</span> on paid orders. Bi-weekly surprise giveaways of full luxury bouquets! <span className="text-[#a0918a] text-xs">Email hello@bloomwire.in with "Raffle Entry" to enter for free. Void where prohibited.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: BALANCE CARD & PROGRESS */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-[#2d2418]/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-bloom-rose/20 via-bloom-gold/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-[#2d2418]/10 pb-6">
          <div>
            <span className="text-xs font-bold text-[#8a7a6a] uppercase tracking-wider block mb-1">
              Account Status & Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] flex items-center gap-2">
              Your Petal Balance
            </h2>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
            </div>
          ) : null}
        </div>

        {user ? (
          <div className="space-y-8">
            {/* Balance Card Big Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="glass rounded-2xl p-6 sm:p-7 border border-bloom-gold/40 bg-gradient-to-br from-bloom-gold/15 via-amber-950/20 to-transparent relative overflow-hidden shadow-[0_0_25px_rgba(245,197,99,0.15)]">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-bloom-gold via-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,197,99,0.5)] shrink-0 animate-glow">
                    <PetalIcon size={40} className="text-[#2d2418]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8a7a6a] uppercase font-bold tracking-wider mb-1">Available Balance</p>
                    <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bloom-gold via-amber-200 to-white drop-shadow-[0_0_20px_rgba(245,197,99,0.4)] animate-pulse">
                      {currentPetals} <span className="text-lg sm:text-xl text-bloom-gold font-semibold">Petals</span>
                    </div>
                    <p className="text-xs text-[#6b5d4f] mt-2 font-medium">
                      Equivalent to <span className="text-bloom-gold font-bold">₹{currentPetals}</span> in reward value
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Tier & Status */}
              <div className="glass rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8a7a6a] uppercase font-bold tracking-wider">Current Tier Status</span>
                  <span className="px-3 py-1 rounded-full bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30 text-xs font-bold">
                    {milestone.tierName}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#2d2418] mb-1">Unlocked Benefits</h4>
                  <p className="text-xs text-[#6b5d4f] leading-relaxed">{milestone.unlockedPerks}</p>
                </div>
                <div className="pt-2 border-t border-[#2d2418]/10 flex items-center justify-between text-xs text-[#8a7a6a]">
                  <span>Raffle Entries:</span>
                  <span className="font-bold text-bloom-gold">{ticketCount} Tickets</span>
                </div>
              </div>

              {/* Order Cash Back Calculator Box */}
              <div className="glass rounded-2xl p-6 border border-[#2d2418]/10 space-y-3 bg-white/60">
                <span className="text-xs font-bold text-bloom-gold uppercase tracking-wider block">
                  Quick Cash Back Calculator
                </span>
                <label className="block text-xs text-[#6b5d4f] font-medium">
                  Enter Order Value (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={orderCalcAmount}
                    onChange={(e) => setOrderCalcAmount(Number(e.target.value))}
                    className="w-full bg-white/70 border border-bloom-rose/15 rounded-xl px-3.5 py-2 text-sm text-[#2d2418] font-bold focus:outline-none focus:border-bloom-gold"
                  />
                </div>
                <div className="bg-bloom-gold/10 border border-bloom-gold/20 rounded-xl p-3 text-xs text-[#2d2418]">
                  Shopping ₹{orderCalcAmount} earns <span className="text-bloom-gold font-bold">{Math.floor(orderCalcAmount * 0.05)} Petals</span> (₹{Math.floor(orderCalcAmount * 0.05)} value back).
                </div>
              </div>
            </div>

            {/* Next Milestone Progress Bar Box */}
            <div className="glass rounded-2xl p-6 border border-bloom-rose/15 bg-gradient-to-r from-bloom-blush/10 via-white to-bloom-lavender/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-bloom-rose uppercase tracking-wider block mb-1">
                    Next Tier Milestone
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#2d2418] flex items-center gap-2">
                    Target: {milestone.target} Petals ({milestone.nextReward} {milestone.value})
                  </h3>
                </div>
                {milestone.needed > 0 && (
                  <span className="px-3.5 py-1.5 rounded-full bg-white/70 text-xs text-[#2d2418] font-medium border border-[#2d2418]/10 shrink-0">
                    Need <strong className="text-bloom-gold">{milestone.needed}</strong> more petals
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-4 rounded-full bg-bloom-blush/30 border border-bloom-rose/10 overflow-hidden p-0.5 relative shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-bloom-rose via-purple-500 to-bloom-gold rounded-full transition-all duration-700 relative"
                    style={{ width: `${milestone.progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/80 animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between text-xs font-medium text-[#8a7a6a]">
                  <span>Current: {currentPetals} Petals</span>
                  <span>Target: {milestone.target} Petals</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#6b5d4f] font-medium bg-white/60 rounded-xl p-3 border border-[#2d2418]/10">
                💡 {milestone.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 max-w-lg mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-bloom-rose/20 border border-bloom-rose/40 flex items-center justify-center mx-auto text-bloom-neon">
              <PetalIcon size={44} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2d2418]">Join Bloomwire Rewards</h3>
            <p className="text-sm text-[#6b5d4f] leading-relaxed">
              Sign in now to view your Petals balance, claim daily login bonuses, and start redeeming complimentary handcrafted rewards!
            </p>
            <button
              onClick={() => navigate("/#/profile")}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-bloom-rose to-bloom-gold text-white font-bold text-sm shadow-[0_0_25px_rgba(255,64,129,0.4)] hover:scale-105 transition-all"
            >
              Sign In to Your Account
            </button>
          </div>
        )}
      </section>

      {/* SECTION 3: TIER REWARDS (Keychain, Flower, Pot) */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-[#2d2418]/10 relative overflow-hidden shadow-2xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-bloom-gold tracking-widest uppercase mb-2 block">
            Exclusive Perks
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-2">
            Specific Tier <span className="gradient-text">Rewards</span>
          </h2>
          <p className="text-sm text-[#6b5d4f]">
            Reach Petals balance milestones and redeem complimentary handcrafted floral products with qualifying orders!
          </p>
        </div>

        {redeemedCode && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-center space-y-2 max-w-xl mx-auto backdrop-blur-md shadow-xl">
            <div className="inline-flex items-center gap-2 text-emerald-700 text-sm font-bold uppercase tracking-wider">
              <CheckCircleIcon size={18} /> Reward Redeemed Successfully!
            </div>
            <h3 className="text-xl font-bold text-[#2d2418]">Coupon Code Unlocked</h3>
            <div className="bg-emerald-50 border border-emerald-600/40 rounded-xl py-3 px-6 text-2xl font-mono font-bold text-emerald-700 tracking-wider inline-block my-2">
              {redeemedCode}
            </div>
            <p className="text-xs text-[#6b5d4f]">
              Code auto-added to your coupons! This complimentary reward will be added to your next qualifying order.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPECIFIC_REWARDS.map((reward) => {
            const canAfford = currentPetals >= reward.petalsCost
            const imageUrl = `${BASE_IMAGE_URL}${reward.imageFilename}`

            return (
              <div
                key={reward.id}
                className={`glass rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 ${
                  canAfford
                    ? 'border-bloom-gold/50 shadow-[0_0_25px_rgba(245,197,99,0.15)] bg-gradient-to-b from-bloom-gold/10 to-transparent'
                    : 'border-[#2d2418]/10 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-white/70 text-[#6b5d4f] text-[10px] font-bold tracking-wider">
                      {reward.levelLabel}
                    </span>
                    <span className="text-xs font-bold text-bloom-gold flex items-center gap-1">
                      <PetalIcon size={14} /> {reward.petalsCost} Petals
                    </span>
                  </div>

                  <div className="w-full h-48 rounded-xl overflow-hidden mb-5 relative bg-bloom-blush/20 border border-bloom-rose/10">
                    <img
                      src={imageUrl}
                      alt={reward.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[#2d2418] text-xs font-bold border border-bloom-rose/15 shadow-sm">
                      Value {reward.valueBrackets}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#2d2418] mb-2">{reward.name}</h3>
                  <p className="text-xs text-[#6b5d4f] leading-relaxed mb-6">{reward.description}</p>
                </div>

                <div>
                  {user ? (
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        canAfford
                          ? 'bg-gradient-to-r from-bloom-gold to-amber-500 text-black shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer'
                          : 'bg-white/70 text-[#8a7a6a] cursor-not-allowed border border-[#2d2418]/10'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <GiftIcon size={16} /> Claim {reward.name}
                        </>
                      ) : (
                        <>
                          <LockIcon size={14} /> Need {reward.petalsCost - currentPetals} More Petals
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/#/profile")}
                      className="w-full py-3 rounded-xl bg-white/70 hover:bg-white/80 text-[#2d2418] font-bold text-xs uppercase tracking-wider transition border border-[#2d2418]/10"
                    >
                      Sign In to Unlock
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 4: RAFFLE DRAW SECTION & PRIZES */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-[#2d2418]/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 border-b border-[#2d2418]/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <TicketIcon size={14} /> Bi-Weekly Giveaways
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2d2418] flex items-center gap-3">
              Bi-Weekly <span className="gradient-text">Raffle Draw</span>
            </h2>
            <p className="text-sm text-[#6b5d4f] mt-1">
              Earn 1 raffle entry for every ₹500 spent on paid orders. Bi-weekly surprise giveaways of full luxury bouquets!
            </p>
          </div>

          {/* Draw Countdown Pill */}
          <div className="glass rounded-2xl p-4 border border-purple-500/40 bg-purple-950/20 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-700">
              <SparkleIcon size={24} />
            </div>
            <div>
              <span className="text-[11px] text-[#8a7a6a] font-bold uppercase tracking-wider block">Next Draw Date</span>
              <span className="text-base font-bold text-[#2d2418]">{nextDrawInfo.formattedDate}</span>
              <span className="text-xs text-bloom-gold font-medium block">
                ({nextDrawInfo.daysLeft} {nextDrawInfo.daysLeft === 1 ? 'day' : 'days'} remaining)
              </span>
            </div>
          </div>
        </div>

        {/* Raffle Prizes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RAFFLE_PRIZES.map((prize, idx) => (
            <div
              key={idx}
              className="glass rounded-2xl p-5 border border-[#2d2418]/10 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-full h-44 rounded-xl overflow-hidden mb-4 relative bg-bloom-blush/20 border border-bloom-rose/10">
                <img
                  src={prize.image}
                  alt={prize.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-purple-600/80 backdrop-blur-md text-[#2d2418] text-[10px] font-bold border border-purple-300/40">
                  {prize.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2d2418] mb-1">{prize.name}</h3>
              <p className="text-xs text-[#8a7a6a]">Retail Value: <span className="text-bloom-gold font-bold">{prize.value}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* REFERRAL PROGRAM */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="glass-strong rounded-3xl p-8 border border-bloom-rose/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-bloom-rose/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold mb-2">
              Invite Friends, <span className="gradient-text">Earn Together</span> 🌸
            </h2>
            <p className="text-sm text-[#8a7a6a] mb-6 max-w-md">
              Share your unique link. When your friend makes their first purchase, you both get <span className="text-bloom-gold font-medium">₹50 off</span> and <span className="text-bloom-gold font-medium">50 Petals</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 glass rounded-xl px-4 py-3 flex items-center gap-2 overflow-hidden">
                <span className="text-xs text-[#a0918a] truncate flex-1">{referralLink}</span>
              </div>
              <button
                onClick={() => {
                  trackReferralClick('referral-copy'); navigator.clipboard?.writeText(referralLink)
                  setReferralCopied(true)
                  showToast('Referral link copied! Share it with friends 🌸', 'info')
                  setTimeout(() => setReferralCopied(false), 2500)
                }}
                className="px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium text-sm shimmer-btn hover:scale-105 transition whitespace-nowrap"
              >
                {referralCopied ? 'Copied! ✓' : 'Copy Link'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass rounded-xl p-3">
                <p className="text-2xl font-bold text-bloom-gold">{user?.referralCount || 0}</p>
                <p className="text-xs text-[#a0918a]">Friends invited</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-2xl font-bold text-bloom-mint">0</p>
                <p className="text-xs text-[#a0918a]">Made a purchase</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-2xl font-bold text-bloom-neon">₹0</p>
                <p className="text-xs text-[#a0918a]">Earned so far</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`https://wa.me/?text=Check out Bloomwire's handcrafted lasting flowers! 🌸 Use my link for ₹50 off: ${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 glass rounded-xl text-sm text-green-400 hover:bg-white/60 transition flex items-center gap-2">
                <span>●</span> Share on WhatsApp
              </a>
              <a href="https://www.instagram.com/bloomwire._" target="_blank" rel="noopener noreferrer" className="px-4 py-2 glass rounded-xl text-sm text-pink-400 hover:bg-white/60 transition flex items-center gap-2">
                <span>●</span> Share on Instagram
              </a>
              <p className="text-xs text-[#a0918a] self-center">Share with #Bloomwire → Submit for review (up to 20 Petals/week)</p>
            </div>
          </div>
        </div>
      </section>

      {/* UNBOXING UPLOAD SECTION */}
      <section className="glass-strong rounded-3xl p-6 sm:p-10 border border-bloom-rose/20 relative overflow-hidden shadow-xl bg-white">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-bloom-rose/8 blur-[80px]" />
        <div className="relative z-10">
          <h2 className="text-2xl font-serif font-bold mb-2">Share Your Unboxing 📸</h2>
          <p className="text-sm text-[#8a7a6a] mb-6 max-w-xl">Received your Bloomwire flowers? Share your unboxing photos and earn 50 Petals per approved post!</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="glass rounded-xl px-4 py-2.5"><span className="text-xs text-[#a0918a]">Pending: </span><span className="font-bold text-yellow-400">{unboxingStatus.pending}</span></div>
            <div className="glass rounded-xl px-4 py-2.5"><span className="text-xs text-[#a0918a]">Approved: </span><span className="font-bold text-emerald-400">{unboxingStatus.approved}</span></div>
            <div className="glass rounded-xl px-4 py-2.5"><span className="text-xs text-[#a0918a]">Petals earned: </span><span className="font-bold text-bloom-gold">{unboxingStatus.totalPetals} 🌸</span></div>
          </div>

          {user?.email ? (
            <>
              {!unboxingStatus.canSubmit ? (
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-sm text-yellow-400 mb-2">⏳ You have a submission pending review.</p>
                  <p className="text-xs text-[#a0918a]">Check back within 48 hours for your Petals credit.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File input */}
                  <input type="file" accept="image/*" onChange={handleUnboxingFile} className="hidden" id="unboxing-file-input" />
                  <label htmlFor="unboxing-file-input" className="block cursor-pointer">
                    {unboxingPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-bloom-rose/30">
                        <img src={unboxingPreview} alt="Preview" className="w-full max-h-64 object-contain bg-bloom-blush/20" />
                        <div className="absolute top-2 right-2">
                          <button onClick={(e) => { e.preventDefault(); setUnboxingFile(null); setUnboxingPreview('') }} className="px-3 py-1 rounded-lg bg-red-500/80 text-[#2d2418] text-xs font-medium hover:bg-red-500 transition">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <div className="glass rounded-2xl p-12 text-center border-2 border-dashed border-bloom-rose/20 hover:border-bloom-rose/40 transition">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-sm text-[#8a7a6a]">Click to upload unboxing photo</p>
                        <p className="text-xs text-[#a0918a] mt-1">Max 10MB • Images only</p>
                      </div>
                    )}
                  </label>

                  {/* Caption */}
                  {unboxingPreview && (
                    <>
                      <input type="text" value={unboxingCaption} onChange={(e) => setUnboxingCaption(e.target.value.slice(0, 200))} placeholder="Add a caption (optional, max 200 chars)" className="w-full px-4 py-3 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm" />
                      <p className="text-xs text-[#a0918a] text-right">{unboxingCaption.length}/200</p>

                      {unboxingError && <p className="text-sm text-red-400">{unboxingError}</p>}

                      <button onClick={submitUnboxing} disabled={unboxingSubmitting} className="w-full py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shimmer-btn neon-glow transition disabled:opacity-50">
                        {unboxingSubmitting ? 'Submitting…' : 'Submit for Review'}
                      </button>
                    </>
                  )}

                  {/* Rules */}
                  <div className="text-xs text-[#a0918a] space-y-1 pt-2 border-t border-[#2d2418]/10">
                    <p>• Earn 50 Petals per approved unboxing post (max 1 per week)</p>
                    <p>• Photos must show Bloomwire products</p>
                    <p>• Approval within 48 hours</p>
                    <p>• Your uploads are private — only you and Bloomwire admin can see them</p>
                    <a href="#/my-gallery" className="text-bloom-neon hover:underline">View your gallery →</a>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass rounded-xl p-6 text-center">
              <p className="text-sm text-[#8a7a6a] mb-3">Sign in to share your unboxing and earn Petals!</p>
              <a href="#/profile" className="inline-block px-6 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium text-sm shimmer-btn transition">Sign In</a>
            </div>
          )}
        </div>
      </section>

      {/* WEEKLY BONUS CELEBRATION MODAL */}
      {showWeeklyBonusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-strong max-w-md w-full rounded-3xl p-8 border border-bloom-gold/50 text-center space-y-6 relative shadow-[0_0_40px_rgba(245,197,99,0.3)] bg-white">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-bloom-gold via-amber-400 to-bloom-rose flex items-center justify-center mx-auto text-[#2d2418] shadow-xl animate-bounce">
              <SparkleIcon size={44} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-bloom-gold/20 text-bloom-gold border border-bloom-gold/30 text-xs font-bold uppercase tracking-wider">
                🎉 WEEKLY STREAK COMPLETE!
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2d2418]">7-Day Bonus Claimed!</h3>
              <p className="text-sm text-[#6b5d4f] leading-relaxed">
                You checked in 7 days in a row! You earned <strong className="text-bloom-gold">+75 Petals</strong> and <strong className="text-purple-700">+1 Bonus Raffle Entry</strong>!
              </p>
            </div>

            <button
              onClick={() => setShowWeeklyBonusModal(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bloom-rose to-bloom-gold text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-all"
            >
              Awesome! Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
