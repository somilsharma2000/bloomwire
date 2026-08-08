import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FlowerIcon,
  InstagramIcon,
  WhatsAppIcon,
  PetalIcon,
  SparkleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserIcon,
  MailIcon,
  GiftIcon,
  ShareIcon,
  StarIcon,
  CheckIcon
} from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

interface Creator {
  id: string
  name: string
  handle: string
  followers: string
  petals: string
  niche: string
  avatarGradient: string
  initials: string
  instagramUrl: string
}

// No creators yet — real creators will be added via admin approval
const topCreators: Creator[] = []

const creatorPerks = [
  {
    icon: PetalIcon,
    title: '10% Back in Petals',
    description: 'Coming Soon: Earn 10% back in Petals on orders placed using your custom creator referral link.',
    badge: '10% Rewards',
    glow: 'from-bloom-rose/20 to-bloom-wine/20'
  },
  {
    icon: SparkleIcon,
    title: 'Early Access to New Products',
    description: 'Get exclusive first dibs on limited edition stems, seasonal bouquets, and new DIY flower kits before launch.',
    badge: 'VIP Access',
    glow: 'from-bloom-gold/20 to-bloom-terracotta/20'
  },
  {
    icon: StarIcon,
    title: 'Featured On Our Page',
    description: 'Get spotlighted across Bloomwire’s official Instagram and website homepage to reach thousands.',
    badge: 'Spotlight Feature',
    glow: 'from-bloom-neon/20 to-purple-600/20'
  },
  {
    icon: GiftIcon,
    title: 'Exclusive Creator Discount',
    description: 'Enjoy a 20% creator discount on personal orders (subject to approval).',
    badge: '20% OFF Stash',
    glow: 'from-pink-500/20 to-bloom-rose/20'
  }
]

export default function Creators() {
  useSEO({ title: "Bloomwire — Creators | Floral Artists", description: "Meet the talented creators and floral artists behind Bloomwire handcrafted pipe cleaner flowers.", canonicalPath: "/#/creators" })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    handle: ''
  })
  const [hasFollowed, setHasFollowed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [followedStatus, setFollowedStatus] = useState({
    instagram: false,
    whatsapp: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasFollowed) return
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 overflow-hidden">

      {/* 1. CREATE-SHARE-EARN SECTION */}
      <section className="mb-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bloom-rose/10 border border-bloom-rose/30 text-bloom-neon text-xs font-bold uppercase tracking-widest mb-4 neon-border animate-glow">
            <SparkleIcon size={16} /> Monetize Your Aesthetic
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6 tracking-tight">
            Create. Share. <span className="gradient-text-cool">Earn.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#6b5d4f] leading-relaxed">
            Turn your floral passion into cash & rewards! Craft stunning pipe cleaner creations with Bloomwire, showcase your floral art on Instagram, and earn <span className="text-bloom-gold font-medium">10% back in Petals</span> on every single sale your aesthetic content inspires.
          </p>
        </div>

        {/* 3 Steps Pipeline with Large Icons & Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="rounded-3xl p-8 relative z-10 border border-bloom-rose/30 hover:border-bloom-neon transition-all duration-300 group hover:-translate-y-2 bg-[rgba(20,12,18,0.95)] backdrop-blur-xl">
            <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-bloom-rose to-bloom-wine text-white font-bold flex items-center justify-center text-sm shadow-lg border-2 border-bloom-dark">
              01
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-bloom-rose/20 to-pink-500/10 border border-bloom-rose/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-[0_0_25px_rgba(233,30,99,0.25)]">
              <FlowerIcon size={40} className="text-bloom-neon" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2d2418] mb-3">
              1. Create with Bloomwire
            </h3>
            <p className="text-[#8a7a6a] text-sm leading-relaxed">
              Order DIY pipe cleaner flower stem kits or ready-made arrangements. Twist, shape, and style beautifully blooming floral art in your unique room aesthetic.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl p-8 relative z-10 border border-bloom-rose/30 hover:border-bloom-neon transition-all duration-300 group hover:-translate-y-2 bg-[rgba(20,12,18,0.95)] backdrop-blur-xl">
            <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-[#2d2418] font-bold flex items-center justify-center text-sm shadow-lg border-2 border-bloom-dark">
              02
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              <InstagramIcon size={40} className="text-pink-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2d2418] mb-3">
              2. Share on Instagram
            </h3>
            <p className="text-[#8a7a6a] text-sm leading-relaxed">
              Post Reels, aesthetic desk setup photos, or unboxing videos tagging <span className="text-bloom-neon font-mono font-medium">@bloomwire_</span>. Share your custom link in bio.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl p-8 relative z-10 border border-bloom-rose/30 hover:border-bloom-neon transition-all duration-300 group hover:-translate-y-2 bg-[rgba(20,12,18,0.95)] backdrop-blur-xl">
            <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-bloom-gold to-bloom-terracotta text-[#2d2418] font-bold flex items-center justify-center text-sm shadow-lg border-2 border-bloom-dark">
              03
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-bloom-gold/20 to-amber-500/10 border border-bloom-gold/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-[0_0_25px_rgba(245,197,99,0.25)]">
              <PetalIcon size={40} className="text-bloom-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2d2418] mb-3">
              3. Earn Petals & Rewards
            </h3>
            <p className="text-[#8a7a6a] text-sm leading-relaxed">
              Earn <span className="text-bloom-gold font-medium">10% back in Petals</span> on every purchase made through your link. Redeem for complimentary products or store credit.
            </p>
          </div>
        </div>
      </section>

      {/* 2. TOP CREATORS WITH CREATOR SPOTLIGHTS */}
      <section className="mb-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-gold/10 border border-bloom-gold/30 text-bloom-gold text-xs font-bold uppercase tracking-wider mb-3">
            <StarIcon size={14} /> Bloomwire Hall of Fame
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            Meet Our <span className="gradient-text">Top Creators</span>
          </h2>
          <p className="text-[#8a7a6a] text-sm sm:text-base">
            Check out top Indian creators rocking the community spotlight with their viral Bloomwire creations.
          </p>
        </div>

        {/* Creator Spotlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCreators.map((creator) => (
            <div
              key={creator.id}
              className="relative group rounded-2xl border-2 border-bloom-rose/50 hover:border-bloom-neon bg-transparent p-6 shadow-[0_0_25px_rgba(233,30,99,0.25)] hover:shadow-[0_0_35px_rgba(233,30,99,0.5)] transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-[2px]"
            >
              {/* Creator Spotlight Corner Viewfinder Accents */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-bloom-neon opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-bloom-neon opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-bloom-neon opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-bloom-neon opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />

              {/* Inner ambient light gradient inside community spotlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-bloom-rose/5 via-transparent to-bloom-wine/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Top Tag */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-bloom-rose/20 border border-bloom-rose/40 text-bloom-neon flex items-center gap-1">
                  <InstagramIcon size={12} /> {creator.niche}
                </span>
                <span className="text-[11px] text-bloom-gold font-mono flex items-center gap-1">
                  <SparkleIcon size={12} /> Top
                </span>
              </div>

              {/* Card Main Body */}
              <div className="text-center my-2 relative z-10">
                {/* Gradient Circle Avatar Placeholder */}
                <div className="relative inline-block mb-3">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-bloom-rose via-bloom-gold to-bloom-neon group-hover:rotate-12 transition-transform duration-500 shadow-md">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${creator.avatarGradient} flex items-center justify-center text-[#2d2418] text-xl font-serif font-bold shadow-inner`}>
                      {creator.initials}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#FFF8F3] border-2 border-bloom-neon flex items-center justify-center text-bloom-neon shadow">
                    <CheckIcon size={12} />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-serif font-bold text-[#2d2418] group-hover:text-bloom-neon transition-colors">
                  {creator.name}
                </h3>

                {/* SMALLER text for Instagram handle/username */}
                <a
                  href={creator.instagramUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-bloom-neon/90 hover:text-white hover:underline mb-4 inline-block bg-bloom-rose/10 px-2.5 py-0.5 rounded-md border border-bloom-rose/20 hover:bg-bloom-rose/20 transition-colors"
                >
                  {creator.handle}
                </a>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#2d2418]/10 text-left">
                  <div className="bg-[#FFF8F3]/60 p-2.5 rounded-xl border border-[#2d2418]/10">
                    <p className="text-[10px] uppercase text-[#8a7a6a] font-medium">Followers</p>
                    <p className="text-xs sm:text-sm font-bold text-[#2d2418]">{creator.followers}</p>
                  </div>
                  <div className="bg-[#FFF8F3]/60 p-2.5 rounded-xl border border-[#2d2418]/10">
                    <p className="text-[10px] uppercase text-[#8a7a6a] font-medium">Petals Earned</p>
                    <p className="text-xs sm:text-sm font-bold text-bloom-gold flex items-center gap-1">
                      <PetalIcon size={12} className="text-bloom-gold inline shrink-0" />
                      <span>{creator.petals}</span>
                    </p>
                  </div>
                </div>

                {/* Instagram Profile Button */}
                <a
                  href={creator.instagramUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-rose-500/20 hover:from-pink-500/30 hover:via-purple-500/30 hover:to-rose-500/30 border border-bloom-rose/30 hover:border-bloom-neon text-[#2d2418] text-xs font-medium transition-all group/ig"
                >
                  <InstagramIcon size={16} className="text-pink-400 group-hover/ig:scale-110 transition-transform" />
                  <span className="hover:underline">Follow on Instagram</span>
                </a>
              </div>

              {/* Bottom Creator Spotlight Bar */}
              <div className="mt-3 pt-3 border-t border-bloom-rose/20 text-center relative z-10 flex items-center justify-center gap-1.5 text-xs text-[#8a7a6a] group-hover:text-[#2d2418] transition-colors">
                <InstagramIcon size={14} className="text-bloom-rose" />
                <span className="text-[11px] font-mono text-emerald-400">Coming Soon</span>
                <ArrowRightIcon size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CREATOR FORM WITH MANDATORY MUST-FOLLOW */}
      <section className="mb-24 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="glass-strong rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-bloom-rose/30 shadow-[0_0_40px_rgba(233,30,99,0.15)]">

            {submitted ? (
              <div className="text-center py-8 relative z-10">
                <div className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-bloom-gold to-bloom-terracotta items-center justify-center mb-6 neon-glow animate-bounce">
                  <CheckCircleIcon size={40} className="text-[#2d2418]" />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-3 text-[#2d2418]">Welcome to the Bloom Crew!</h2>
                <p className="text-[#6b5d4f] text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
                  Your creator application for <span className="text-bloom-neon font-mono font-bold">{formData.handle || '@creator'}</span> has been submitted! Our team reviews each application manually. If approved, you'll get an email within 3-5 business days. Check your inbox at <span className="text-bloom-neon font-medium">{formData.email}</span> for the review result. If approved, you'll get an email within 3-5 business days with your creator link and perks.
                </p>
                <div className="bg-bloom-gold/10 border border-bloom-gold/30 rounded-2xl p-4 max-w-md mx-auto text-bloom-gold text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                  <PetalIcon size={18} />
                  <span>100 Welcome Petals credited to your account!</span>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center mb-4 neon-glow">
                    <ShareIcon size={28} className="text-[#2d2418]" />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-2 text-[#2d2418]">Join the Creator Program</h2>
                  <p className="text-[#8a7a6a] text-sm">Apply now to unlock 10% Petal rewards, creator spotlights, and community features.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#6b5d4f] mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#6b5d4f] mb-1">Email Address</label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" size={18} />
                      <input
                        required
                        type="email"
                        placeholder="e.g. ananya@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Instagram Handle Input */}
                  <div>
                    <label className="block text-xs font-medium uppercase text-[#6b5d4f] mb-1">Instagram Handle</label>
                    <div className="relative">
                      <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="e.g. @ananya.blooms"
                        value={formData.handle}
                        onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl glass text-[#2d2418] placeholder-[#a0918a] glow-focus transition text-sm"
                      />
                    </div>
                  </div>

                  {/* MANDATORY 'Must Follow Us' Section */}
                  <div className="bg-[#FFF8F3]/80 rounded-2xl p-5 border border-bloom-rose/40 my-6">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-bloom-gold mb-3 uppercase tracking-wider">
                      <SparkleIcon size={16} />
                      <span>To join, you must follow us on:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Instagram Link */}
                      <a
                        href="https://www.instagram.com/bloomwire._"
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => setFollowedStatus((p) => ({ ...p, instagram: true }))}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium ${
                          followedStatus.instagram
                            ? 'bg-bloom-rose/20 border-bloom-rose text-white'
                            : 'bg-white/60 border-[#2d2418]/10 hover:border-bloom-rose/60 hover:bg-bloom-rose/10 text-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 flex items-center justify-center text-[#2d2418] shrink-0">
                          <InstagramIcon size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-[#2d2418] text-[11px]">Instagram</p>
                          <p className="text-bloom-neon text-[10px] font-mono truncate">@bloomwire_</p>
                        </div>
                      </a>

                      {/* WhatsApp Link */}
                      <a
                        href="https://wa.me/message/VT4TW64X2EJKH1"
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => setFollowedStatus((p) => ({ ...p, whatsapp: true }))}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium ${
                          followedStatus.whatsapp
                            ? 'bg-emerald-500/20 border-emerald-500 text-[#2d2418]'
                            : 'bg-white/60 border-[#2d2418]/10 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-[#2d2418]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-[#2d2418] shrink-0">
                          <WhatsAppIcon size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-[#2d2418] text-[11px]">WhatsApp</p>
                          <p className="text-emerald-700 text-[10px] truncate">Join our community</p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Mandatory Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group my-4">
                    <input
                      type="checkbox"
                      required
                      checked={hasFollowed}
                      onChange={(e) => setHasFollowed(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-[#FFF8F3] text-bloom-rose focus:ring-bloom-rose cursor-pointer accent-bloom-rose"
                    />
                    <span className="text-xs sm:text-sm text-[#6b5d4f] group-hover:text-[#2d2418] transition-colors leading-tight">
                      I follow Bloomwire on all platforms <span className="text-bloom-rose font-bold">*</span>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!hasFollowed}
                    className="w-full py-4 bg-gradient-to-r from-bloom-rose via-bloom-wine to-bloom-neon text-white rounded-xl font-bold shimmer-btn neon-glow hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span>Join the Bloom Crew</span>
                    <ArrowRightIcon size={18} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CREATOR PERKS SECTION */}
      <section className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-rose/10 border border-bloom-rose/30 text-bloom-neon text-xs font-bold uppercase tracking-wider mb-3">
            <GiftIcon size={14} /> Creator Perks & VIP Benefits
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            Why Creators <span className="gradient-text">Love Us</span>
          </h2>
          <p className="text-[#8a7a6a] text-sm sm:text-base">
            Everything you need to turn your floral aesthetic into a thriving creator brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creatorPerks.map((perk, index) => {
            const Icon = perk.icon
            return (
              <div
                key={index}
                className="glass-strong rounded-3xl p-6 relative border border-[#2d2418]/10 hover:border-bloom-rose/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.glow} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-bloom-rose/10 border border-bloom-rose/20 flex items-center justify-center text-bloom-neon group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/60 border border-[#2d2418]/10 text-bloom-gold">
                      {perk.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-2 group-hover:text-bloom-neon transition-colors">
                    {perk.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8a7a6a] leading-relaxed mb-4">
                    {perk.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2d2418]/10 flex items-center justify-between text-xs text-[#8a7a6a]">
                  <span>Included in Bloom Crew</span>
                  <CheckCircleIcon size={16} className="text-bloom-rose" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#8a7a6a] text-sm mb-4">
            Have questions about the program? Check our rewards FAQ or reach out anytime.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/rewards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFF8F3]/80 border border-[#2d2418]/10 hover:border-bloom-rose text-[#2d2418] rounded-full text-xs font-medium transition"
            >
              <span>Explore Rewards Program</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
