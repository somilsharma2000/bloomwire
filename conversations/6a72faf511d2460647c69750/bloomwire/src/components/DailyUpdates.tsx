import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TiltCard from './TiltCard'
import { products, type Product } from '../data/products'
import {
  FlameIcon,
  SparkleIcon,
  TrophyIcon,
  ClockIcon,
  ArrowRightIcon,
  PetalIcon,
  StarIcon,
  InstagramIcon,
  GiftIcon,
  UserIcon,
} from './Icons'

// Helper function to derive deterministic seed from current date
function getDaySeed(date: Date = new Date()): number {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return y * 10000 + m * 100 + d
}

function getWeekSeed(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000)
  const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
  return date.getFullYear() * 100 + weekNum
}

// Challenge interface for rotation
interface Challenge {
  id: string
  title: string
  description: string
  petals: number
  badgeText: string
  ctaText: string
  link: string
  Icon: React.FC<{ className?: string; size?: number }>
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'review',
    title: 'Review for 10 Petals',
    description: 'Leave an honest review on any product to boost your Petals balance.',
    petals: 10,
    badgeText: 'Review Bonus',
    ctaText: 'Write a Review',
    link: '/rewards',
    Icon: StarIcon,
  },
  {
    id: 'refer',
    title: 'Refer a Friend for 100 Petals',
    description: 'Share your referral link. Earn 100 Petals when your friend completes an order!',
    petals: 100,
    badgeText: 'Referral Power',
    ctaText: 'Refer a Friend',
    link: '/rewards',
    Icon: GiftIcon,
  },
  {
    id: 'checkin',
    title: 'Daily Check-In Streak',
    description: 'Claim your daily check-in bonus today and keep your streak multiplier active!',
    petals: 15,
    badgeText: 'Streak Reward',
    ctaText: 'Claim Streak',
    link: '/rewards',
    Icon: UserIcon,
  },
  {
    id: 'instagram',
    title: 'Share on Instagram — submit for review (up to 20 Petals/week)',
    description: 'Tag @bloomwire_ in your IG story showing off your floral decor.',
    petals: 20,
    badgeText: 'Social Bloom',
    ctaText: 'Share Story',
    link: '/rewards',
    Icon: InstagramIcon,
  },
]

export const DailyUpdates: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date())

  // Countdown timer interval updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Seeds
  const daySeed = getDaySeed(now)
  const weekSeed = getWeekSeed(now)

  // 1. Trending Today product (date-seeded)
  const trendingIndex = daySeed % products.length
  const trendingProduct: Product = products[trendingIndex] || products[0]

  // 2. Daily Challenge (rotates through 4 challenges based on daySeed)
  const challengeIndex = daySeed % DAILY_CHALLENGES.length
  const currentChallenge = DAILY_CHALLENGES[challengeIndex]

  // 3. New This Week product (rotates weekly)
  const weeklyIndex = (weekSeed * 3 + 1) % products.length
  const weeklyProduct: Product = products[weeklyIndex] || products[1]

  // 4. Countdown calculation to midnight IST (UTC+5:30)
  const nowUTC = now.getTime()
  const istOffset = 5.5 * 60 * 60 * 1000 // IST is UTC+5:30
  const nowIST = new Date(nowUTC + istOffset)
  const endOfDayIST = new Date(nowIST)
  endOfDayIST.setHours(23, 59, 59, 999)
  const diff = Math.max(0, endOfDayIST.getTime() - nowIST.getTime())
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* CARD 1: TRENDING TODAY */}
      <Link to={`/product/${trendingProduct.slug}`} className="block h-full group">
        <TiltCard maxTilt={12} className="h-full">
          <div className="glass bg-white/70 hover:bg-white/90 border border-[#2d2418]/10 hover:border-bloom-rose/60 transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-xl group-hover:shadow-bloom-rose/20">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-bloom-rose/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30 shadow-sm">
                  <FlameIcon size={14} className="animate-pulse" />
                  Trending
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-white/60 px-2.5 py-1 rounded-full border border-[#2d2418]/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-medium text-emerald-700">Today's Pick</span>
                </span>
              </div>

              {/* Title & Subhead */}
              <h3 className="text-lg font-bold text-[#2d2418] mb-1 group-hover:text-bloom-neon transition-colors duration-200">
                Trending Today
              </h3>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-1">
                Most requested handcrafted plush bloom right now
              </p>

              {/* Product Preview Card */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#2d2418]/10 group-hover:border-bloom-rose/30 transition-colors duration-300">
                <img
                  src={trendingProduct.image}
                  alt={trendingProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/90 via-bloom-dark/20 to-transparent flex items-end p-3">
                  <div className="w-full flex items-center justify-between">
                    <p className="text-xs font-medium text-[#2d2418] truncate pr-2">
                      {trendingProduct.name}
                    </p>
                    <span className="text-xs font-bold text-bloom-neon whitespace-nowrap bg-[#FFF8F3]/80 px-2 py-0.5 rounded border border-bloom-rose/30">
                      ₹{trendingProduct.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-2 border-t border-[#2d2418]/5 flex items-center justify-between text-xs text-bloom-rose group-hover:text-bloom-neon font-medium">
              <span>View Product</span>
              <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </TiltCard>
      </Link>

      {/* CARD 2: DAILY CHALLENGE */}
      <Link to={currentChallenge.link} className="block h-full group">
        <TiltCard maxTilt={12} className="h-full">
          <div className="glass bg-white/70 hover:bg-white/90 border border-[#2d2418]/10 hover:border-bloom-gold/60 transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-xl group-hover:shadow-bloom-gold/20">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-bloom-gold/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-bloom-gold/20 text-bloom-gold border border-bloom-gold/30 shadow-sm">
                  <TrophyIcon size={14} className="text-bloom-gold" />
                  Daily Challenge
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-medium">
                  <PetalIcon size={12} className="text-bloom-gold" />
                  +{currentChallenge.petals} Petals
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#2d2418] mb-1 group-hover:text-bloom-gold transition-colors duration-200">
                {currentChallenge.title}
              </h3>
              <p className="text-xs text-zinc-300 mb-4 line-clamp-2">
                {currentChallenge.description}
              </p>

              {/* Challenge Banner Graphic */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-bloom-gold/15 via-amber-900/20 to-transparent border border-bloom-gold/20 mb-4 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-bloom-gold/20 text-bloom-gold border border-bloom-gold/30 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <currentChallenge.Icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-200">
                    {currentChallenge.badgeText}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Refreshes daily at midnight
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-2 border-t border-[#2d2418]/5 flex items-center justify-between text-xs text-bloom-gold font-medium">
              <span>{currentChallenge.ctaText}</span>
              <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </TiltCard>
      </Link>

      {/* CARD 3: NEW THIS WEEK */}
      <Link to={`/product/${weeklyProduct.slug}`} className="block h-full group">
        <TiltCard maxTilt={12} className="h-full">
          <div className="glass bg-white/70 hover:bg-white/90 border border-[#2d2418]/10 hover:border-cyan-400/60 transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-xl group-hover:shadow-cyan-500/20">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
                  <SparkleIcon size={14} className="text-cyan-300 animate-spin-slow" />
                  New Arrival
                </span>
                <span className="inline-flex items-center text-[11px] text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20 font-medium">
                  Weekly Drop
                </span>
              </div>

              {/* Title & Subhead */}
              <h3 className="text-lg font-bold text-[#2d2418] mb-1 group-hover:text-cyan-300 transition-colors duration-200">
                New This Week
              </h3>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-1">
                Freshly designed addition to our bouquet collection
              </p>

              {/* Product Preview Card */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#2d2418]/10 group-hover:border-cyan-400/30 transition-colors duration-300">
                <img
                  src={weeklyProduct.image}
                  alt={weeklyProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/90 via-bloom-dark/20 to-transparent flex items-end p-3">
                  <div className="w-full flex items-center justify-between">
                    <p className="text-xs font-medium text-[#2d2418] truncate pr-2">
                      {weeklyProduct.name}
                    </p>
                    <span className="text-xs font-bold text-cyan-300 whitespace-nowrap bg-[#FFF8F3]/80 px-2 py-0.5 rounded border border-cyan-400/30">
                      ₹{weeklyProduct.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-2 border-t border-[#2d2418]/5 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Explore New Drop</span>
              <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </TiltCard>
      </Link>

      {/* CARD 4: LIMITED TIME */}
      <Link to="/shop" className="block h-full group">
        <TiltCard maxTilt={12} className="h-full">
          <div className="glass bg-white/70 hover:bg-white/90 border border-[#2d2418]/10 hover:border-rose-500/60 transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-xl group-hover:shadow-rose-500/20">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm">
                  <ClockIcon size={14} className="text-rose-300 animate-pulse" />
                  Limited Time
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-500/20 font-medium">
                  Ends Today
                </span>
              </div>

              {/* Title & Promo banner */}
              <h3 className="text-lg font-bold text-[#2d2418] mb-1 group-hover:text-rose-300 transition-colors duration-200">
                Flash Reward
              </h3>
              <p className="text-xs font-medium text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 mb-4 leading-snug">
                Extra 50 Petals on orders over 999 today only!
              </p>

              {/* Live Countdown Timer Block */}
              <div className="p-3 rounded-xl bg-[#FFF8F3]/80 border border-rose-500/30 mb-4">
                <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1 text-center">
                  Offer Expires In
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/60 p-1.5 rounded-lg border border-[#2d2418]/5">
                    <div className="text-lg font-mono font-bold text-rose-400">{pad(hours)}</div>
                    <div className="text-[9px] text-zinc-400 font-medium uppercase">Hours</div>
                  </div>
                  <div className="bg-white/60 p-1.5 rounded-lg border border-[#2d2418]/5">
                    <div className="text-lg font-mono font-bold text-rose-400">{pad(minutes)}</div>
                    <div className="text-[9px] text-zinc-400 font-medium uppercase">Mins</div>
                  </div>
                  <div className="bg-white/60 p-1.5 rounded-lg border border-[#2d2418]/5">
                    <div className="text-lg font-mono font-bold text-rose-400">{pad(seconds)}</div>
                    <div className="text-[9px] text-zinc-400 font-medium uppercase">Secs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-2 border-t border-[#2d2418]/5 flex items-center justify-between text-xs text-rose-400 font-medium">
              <span>Shop Now</span>
              <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </TiltCard>
      </Link>
    </div>
  )
}

export default DailyUpdates
