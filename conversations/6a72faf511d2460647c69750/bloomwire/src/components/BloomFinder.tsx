import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products, type Product } from '../data/products'
import {
  SparkleIcon,
  GiftIcon,
  HeartIcon,
  PlantIcon,
  FlowerIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  PetalIcon,
} from './Icons'

export const OCCASIONS = [
  { id: 'Birthday', label: 'Birthday', desc: 'Bright, cheerful & celebratory arrangements', icon: GiftIcon },
  { id: 'Anniversary', label: 'Anniversary', desc: 'Romantic plush rose bouquets & couple sets', icon: HeartIcon },
  { id: 'Home Decor', label: 'Home Decor', desc: 'Aesthetic desk clay pots & long-lasting blooms', icon: PlantIcon },
  { id: 'Gift for Someone', label: 'Gift for Someone', desc: 'Curated gift boxes complete with fairy lights', icon: GiftIcon },
  { id: 'Just Because', label: 'Just Because', desc: 'Sweet everyday tokens & single floral stems', icon: FlowerIcon },
  { id: 'Wedding', label: 'Wedding', desc: 'Grand velvet bouquets & luxury custom arrangements', icon: SparkleIcon },
]

export const PALETTES = [
  {
    id: 'Warm (reds, pinks, terracotta)',
    label: 'Warm (reds, pinks, terracotta)',
    desc: 'Passionate crimson, blush pink, and warm terracotta tones',
    colors: ['#e91e63', '#ad1457', '#e8945e'],
  },
  {
    id: 'Cool (blues, purples, lavenders)',
    label: 'Cool (blues, purples, lavenders)',
    desc: 'Calming lavender, violet, and dark mist indigo',
    colors: ['#7c4dff', '#9c27b0', '#3f51b5'],
  },
  {
    id: 'Bright (yellows, oranges, sunflower)',
    label: 'Bright (yellows, oranges, sunflower)',
    desc: 'Radiant golden sunflowers, cheerful daisies, and bright yellow',
    colors: ['#f5c563', '#ff9800', '#ffeb3b'],
  },
  {
    id: 'Pastel (soft pinks, creams, ivories)',
    label: 'Pastel (soft pinks, creams, ivories)',
    desc: 'Gentle blush pink, soft cream, and delicate ivory tulips',
    colors: ['#f8bbd0', '#fff8f0', '#e1bee7'],
  },
  {
    id: 'Bold (dark, moody, dramatic)',
    label: 'Bold (dark, moody, dramatic)',
    desc: 'Moody Gen-Z violet, dark magenta, and rich velvet tones',
    colors: ['#880e4f', '#311b92', '#1a1a2e'],
  },
]

export const BUDGETS = [
  { id: 'Under ₹500', label: 'Under ₹500', desc: 'Charms, keychains & single flower stems' },
  { id: '₹500-₹1000', label: '₹500-₹1000', desc: 'Potted clay plants & starter craft kits' },
  { id: '₹1000-₹2000', label: '₹1000-₹2000', desc: 'Full handcrafted bouquets & artisan DIY boxes' },
  { id: 'No limit', label: 'No limit', desc: 'Deluxe fairy light gift boxes & couple bundles' },
  { id: 'Custom budget', label: 'Custom budget', desc: 'Bespoke custom order built to your exact price' },
]

export function findBloomRecommendations(
  occasion: string | null,
  palette: string | null,
  budget: string | null
) {
  if (!occasion || !palette || !budget) {
    return { isExact: false, matches: [], closest: products.slice(0, 3) }
  }

  const passesBudget = (price: number) => {
    if (budget === 'Under ₹500') return price < 500
    if (budget === '₹500-₹1000') return price >= 500 && price <= 1000
    if (budget === '₹1000-₹2000') return price >= 1000 && price <= 2000
    if (budget === 'No limit') return true
    if (budget === 'Custom budget') return false
    return true
  }

  const scoreProduct = (p: Product) => {
    const text = `${p.name} ${p.category} ${p.subcategory || ''} ${p.description} ${p.longDescription} ${p.tags.join(' ')}`.toLowerCase()

    let paletteScore = 0
    if (palette.includes('Warm')) {
      if (text.includes('rose') || text.includes('sunset') || text.includes('terracotta') || text.includes('red') || text.includes('pink') || text.includes('warm') || text.includes('cherry')) paletteScore += 5
    } else if (palette.includes('Cool')) {
      if (text.includes('lavender') || text.includes('violet') || text.includes('blue') || text.includes('purple') || text.includes('midnight') || text.includes('cool') || text.includes('mist')) paletteScore += 5
    } else if (palette.includes('Bright')) {
      if (text.includes('sunflower') || text.includes('yellow') || text.includes('orange') || text.includes('bright') || text.includes('daisy') || text.includes('gold') || text.includes('cheerful')) paletteScore += 5
    } else if (palette.includes('Pastel')) {
      if (text.includes('pastel') || text.includes('soft') || text.includes('tulip') || text.includes('cream') || text.includes('blush') || text.includes('peony') || text.includes('spring')) paletteScore += 5
    } else if (palette.includes('Bold')) {
      if (text.includes('bold') || text.includes('dark') || text.includes('moody') || text.includes('dramatic') || text.includes('midnight') || text.includes('velvet')) paletteScore += 5
    }

    let occasionScore = 0
    if (occasion === 'Anniversary' || occasion === 'Wedding') {
      if (p.category === 'Bouquets' || p.category === 'Gift Bundles') occasionScore += 4
      if (text.includes('rose') || text.includes('romantic') || text.includes('couple') || text.includes('love')) occasionScore += 3
    } else if (occasion === 'Home Decor') {
      if (p.category === 'Potted Decor' || p.category === 'DIY Kits' || p.category === 'Single Flowers') occasionScore += 4
      if (text.includes('desk') || text.includes('decor') || text.includes('pot') || text.includes('room') || text.includes('accent')) occasionScore += 3
    } else if (occasion === 'Gift for Someone') {
      if (p.category === 'Gift Bundles' || p.category === 'Bouquets' || p.category === 'DIY Kits') occasionScore += 4
      if (text.includes('gift') || text.includes('box') || text.includes('bestseller') || text.includes('top gift')) occasionScore += 3
    } else if (occasion === 'Birthday') {
      if (p.category === 'Bouquets' || p.category === 'Gift Bundles' || p.category === 'Keychains' || p.category === 'DIY Kits') occasionScore += 3
      if (text.includes('cheerful') || text.includes('popular') || text.includes('bestseller')) occasionScore += 2
    } else if (occasion === 'Just Because') {
      occasionScore += 2
    }

    return { score: paletteScore + occasionScore, paletteScore, occasionScore }
  }

  const candidates = products.filter(p => p.price > 0)
  const budgetMatches = candidates.filter(p => passesBudget(p.price))

  const scoredBudgetMatches = budgetMatches
    .map(p => {
      const { score, paletteScore, occasionScore } = scoreProduct(p)
      return { product: p, score, paletteScore, occasionScore }
    })
    .sort((a, b) => b.score - a.score)

  const isExact =
    budget !== 'Custom budget' &&
    scoredBudgetMatches.length > 0 &&
    scoredBudgetMatches.some(m => m.paletteScore > 0 || m.occasionScore > 0)

  let matches: Product[] = []
  if (isExact) {
    matches = scoredBudgetMatches
      .filter(m => m.paletteScore > 0 || m.occasionScore > 0)
      .slice(0, 3)
      .map(m => m.product)
  }

  const closest = candidates
    .map(p => ({ product: p, score: scoreProduct(p).score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(m => m.product)

  return { isExact, matches, closest }
}

export default function BloomFinder() {
  const [step, setStep] = useState<number>(1)
  const [occasion, setOccasion] = useState<string | null>(null)
  const [palette, setPalette] = useState<string | null>(null)
  const [budget, setBudget] = useState<string | null>(null)
  const [animating, setAnimating] = useState<boolean>(false)

  const handleSelectOccasion = (id: string) => {
    setOccasion(id)
    triggerTransition(() => setStep(2))
  }

  const handleSelectPalette = (id: string) => {
    setPalette(id)
    triggerTransition(() => setStep(3))
  }

  const handleSelectBudget = (id: string) => {
    setBudget(id)
    triggerTransition(() => setStep(4))
  }

  const triggerTransition = (callback: () => void) => {
    setAnimating(true)
    setTimeout(() => {
      callback()
      setAnimating(false)
    }, 200)
  }

  const handleReset = () => {
    setAnimating(true)
    setTimeout(() => {
      setStep(1)
      setOccasion(null)
      setPalette(null)
      setBudget(null)
      setAnimating(false)
    }, 200)
  }

  const handleGoBack = () => {
    if (step > 1) {
      triggerTransition(() => setStep(step - 1))
    }
  }

  const { isExact, matches, closest } = findBloomRecommendations(occasion, palette, budget)

  const customOrderMessage = `Hi Bloomwire team! I used 'Find Your Bloom' and would love to request a bespoke custom order:
- Occasion: ${occasion || 'N/A'}
- Color Palette: ${palette || 'N/A'}
- Budget: ${budget || 'N/A'}

Please let me know how we can craft this custom floral design!`

  const encodedCustomMsg = encodeURIComponent(customOrderMessage)

  return (
    <div className="w-full max-w-4xl mx-auto mb-14 transition-all duration-300">
      <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-bloom-neon/30 shadow-[0_0_30px_rgba(255,64,129,0.15)] relative overflow-hidden backdrop-blur-xl">
        {/* Glowing Background Glows */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-bloom-rose/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-bloom-neon/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10 pb-6 border-b border-[#2d2418]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine flex items-center justify-center neon-glow">
              <SparkleIcon size={20} className="text-[#2d2418] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider text-bloom-neon uppercase px-2.5 py-0.5 rounded-full glass border border-bloom-neon/30">
                  Interactive AI Assistant
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2d2418] mt-0.5">
                Find Your <span className="gradient-text">Bloom</span>
              </h2>
            </div>
          </div>

          {step < 4 ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-semibold text-[#8a7a6a]">
                Step <span className="text-bloom-neon">{step}</span> of 3
              </span>
              <div className="w-28 sm:w-36 h-2 rounded-full glass overflow-hidden p-0.5 border border-[#2d2418]/10">
                <div
                  className="h-full bg-gradient-to-r from-bloom-rose via-bloom-neon to-bloom-gold rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleReset}
              className="px-4 py-1.5 rounded-full text-xs font-semibold glass text-[#6b5d4f] hover:text-[#2d2418] hover:border-bloom-neon/50 transition flex items-center gap-1.5"
            >
              <SparkleIcon size={14} className="text-bloom-neon" />
              Retake Quiz
            </button>
          )}
        </div>

        {/* Quiz Steps */}
        <div className={`transition-opacity duration-200 ${animating ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'}`}>
          {/* STEP 1: Occasion */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-medium text-[#2d2418] mb-1">
                  1. What occasion is this for?
                </h3>
                <p className="text-xs sm:text-sm text-[#8a7a6a]">
                  Select the special moment or purpose for your lasting flowers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {OCCASIONS.map((occ) => {
                  const Icon = occ.icon
                  const isSelected = occasion === occ.id
                  return (
                    <button
                      key={occ.id}
                      onClick={() => handleSelectOccasion(occ.id)}
                      className={`group text-left p-4 rounded-2xl transition-all duration-300 flex items-start gap-3.5 cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'glass-strong border-2 border-bloom-neon neon-glow'
                          : 'glass hover:border-bloom-neon/50 hover:shadow-[0_0_20px_rgba(255,64,129,0.25)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-bloom-neon text-white' : 'glass text-bloom-neon group-hover:bg-bloom-neon/20'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-[#2d2418] group-hover:text-bloom-neon transition-colors">
                            {occ.label}
                          </h4>
                          {isSelected && <CheckIcon size={16} className="text-bloom-neon" />}
                        </div>
                        <p className="text-xs text-[#8a7a6a] mt-0.5 line-clamp-2">{occ.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Color Palette */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-[#2d2418] mb-1">
                    2. Which color palette speaks to you?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8a7a6a]">
                    Choose the hue combination that best matches your aesthetic vibe.
                  </p>
                </div>
                <button
                  onClick={handleGoBack}
                  className="text-xs text-[#8a7a6a] hover:text-[#2d2418] underline px-2 py-1"
                >
                  ← Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PALETTES.map((pal) => {
                  const isSelected = palette === pal.id
                  return (
                    <button
                      key={pal.id}
                      onClick={() => handleSelectPalette(pal.id)}
                      className={`group text-left p-4 rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'glass-strong border-2 border-bloom-neon neon-glow'
                          : 'glass hover:border-bloom-neon/50 hover:shadow-[0_0_20px_rgba(255,64,129,0.25)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-[#2d2418] group-hover:text-bloom-neon transition-colors">
                            {pal.label}
                          </h4>
                          {isSelected && <CheckIcon size={16} className="text-bloom-neon" />}
                        </div>
                        <p className="text-xs text-[#8a7a6a] mb-3">{pal.desc}</p>
                      </div>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center gap-1.5">
                        {pal.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full border border-[#2d2418]/15 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Budget */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-[#2d2418] mb-1">
                    3. What's your budget?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8a7a6a]">
                    Select your comfortable price range or choose custom order options.
                  </p>
                </div>
                <button
                  onClick={handleGoBack}
                  className="text-xs text-[#8a7a6a] hover:text-[#2d2418] underline px-2 py-1"
                >
                  ← Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {BUDGETS.map((b) => {
                  const isSelected = budget === b.id
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBudget(b.id)}
                      className={`group text-left p-4 rounded-2xl transition-all duration-300 flex items-start gap-3.5 cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'glass-strong border-2 border-bloom-neon neon-glow'
                          : 'glass hover:border-bloom-neon/50 hover:shadow-[0_0_20px_rgba(255,64,129,0.25)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-bloom-neon text-white' : 'glass text-bloom-gold group-hover:bg-bloom-neon/20'
                      }`}>
                        <PetalIcon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-[#2d2418] group-hover:text-bloom-neon transition-colors">
                            {b.label}
                          </h4>
                          {isSelected && <CheckIcon size={16} className="text-bloom-neon" />}
                        </div>
                        <p className="text-xs text-[#8a7a6a] mt-0.5">{b.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Results Display */}
          {step === 4 && (
            <div>
              {/* Selection Summary Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl glass border border-[#2d2418]/10">
                <span className="text-xs text-[#8a7a6a] mr-1">Your Criteria:</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30">
                  {occasion}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bloom-wine/20 text-white border border-bloom-wine/30">
                  {palette}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bloom-gold/20 text-bloom-gold border border-bloom-gold/30">
                  {budget}
                </span>
              </div>

              {isExact ? (
                /* Exact Match Found Section */
                <div>
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2d2418]">
                        Recommended <span className="gradient-text">Matches</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8a7a6a]">
                        Based on your style preferences and budget, here are our top picks for you:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    {matches.map((product) => (
                      <div
                        key={product.slug}
                        className="glass rounded-2xl overflow-hidden border border-[#2d2418]/10 hover:border-bloom-neon/50 hover:shadow-[0_0_20px_rgba(255,64,129,0.25)] transition-all group flex flex-col"
                      >
                        <div className="aspect-square relative overflow-hidden bg-[#FFF8F3]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.badges.length > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full neon-glow">
                              {product.badges[0]}
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] text-[#8a7a6a] uppercase tracking-wider mb-1">
                              {product.category}
                            </p>
                            <h4 className="font-semibold text-sm text-[#2d2418] group-hover:text-bloom-neon transition-colors line-clamp-1 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-[#8a7a6a] line-clamp-2 mb-3">
                              {product.description}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-base font-bold text-[#2d2418]">₹{product.price}</span>
                              <div className="flex items-center gap-1 text-xs text-[#8a7a6a]">
                                <StarIcon size={12} className="text-bloom-gold" />
                                <span>{product.rating}</span>
                              </div>
                            </div>
                            <Link
                              to={`/product/${product.slug}`}
                              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-semibold shimmer-btn neon-glow flex items-center justify-center gap-1.5 hover:scale-[1.02] transition"
                            >
                              View Product
                              <ArrowRightIcon size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Option for Bespoke / Custom modification callout */}
                  <div className="p-4 rounded-2xl glass border border-bloom-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="text-sm font-semibold text-[#2d2418]">Want a custom variation of these?</h4>
                      <p className="text-xs text-[#8a7a6a]">We customize colors, stem counts, ribbon wraps, and gift tags.</p>
                    </div>
                    <Link
                      to={`/contact?message=${encodedCustomMsg}`}
                      className="px-4 py-2 rounded-full glass border border-bloom-gold/50 text-bloom-gold text-xs font-semibold hover:bg-bloom-gold/10 transition whitespace-nowrap"
                    >
                      Request Customizing
                    </Link>
                  </div>
                </div>
              ) : (
                /* No Exact Match Found Card */
                <div>
                  <div className="p-6 sm:p-8 rounded-2xl glass border border-bloom-neon/40 shadow-[0_0_25px_rgba(255,64,129,0.2)] text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-bloom-rose/20 border border-bloom-neon/40 flex items-center justify-center mx-auto mb-4 text-bloom-neon">
                      <SparkleIcon size={28} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2d2418] mb-2">
                      No Exact Match Found
                    </h3>
                    <p className="text-sm sm:text-base text-[#6b5d4f] max-w-lg mx-auto mb-6 leading-relaxed">
                      We couldn't find a perfect match, but we'd love to craft something custom for you!
                    </p>
                    <Link
                      to={`/contact?message=${encodedCustomMsg}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-bloom-rose via-bloom-neon to-bloom-wine text-white font-medium text-sm shimmer-btn neon-glow hover:scale-105 transition"
                    >
                      Request Custom Order
                      <ArrowRightIcon size={16} />
                    </Link>
                  </div>

                  {/* Fallback "You might also like" products */}
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-semibold text-[#2d2418] mb-4">
                      You Might Also Like
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {closest.map((product) => (
                        <div
                          key={product.slug}
                          className="glass rounded-2xl overflow-hidden border border-[#2d2418]/10 hover:border-bloom-neon/40 transition-all group flex flex-col"
                        >
                          <div className="aspect-square relative overflow-hidden bg-[#FFF8F3]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-[11px] text-[#8a7a6a] uppercase tracking-wider mb-1">
                                {product.category}
                              </p>
                              <h5 className="font-semibold text-sm text-[#2d2418] group-hover:text-bloom-neon transition-colors line-clamp-1 mb-1">
                                {product.name}
                              </h5>
                              <p className="text-xs text-[#8a7a6a] line-clamp-2 mb-3">
                                {product.description}
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-base font-bold text-[#2d2418]">₹{product.price}</span>
                                <div className="flex items-center gap-1 text-xs text-[#8a7a6a]">
                                  <StarIcon size={12} className="text-bloom-gold" />
                                  <span>{product.rating}</span>
                                </div>
                              </div>
                              <Link
                                to={`/product/${product.slug}`}
                                className="w-full py-2 px-3 rounded-xl glass border border-[#2d2418]/15 text-[#2d2418] text-xs font-semibold hover:border-bloom-neon hover:text-bloom-neon flex items-center justify-center gap-1.5 transition"
                              >
                                View Product
                                <ArrowRightIcon size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Restart Button */}
              <div className="mt-8 text-center pt-6 border-t border-[#2d2418]/10">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full glass border border-[#2d2418]/15 text-[#6b5d4f] hover:text-[#2d2418] hover:border-bloom-neon transition text-xs font-semibold inline-flex items-center gap-2"
                >
                  <SparkleIcon size={14} className="text-bloom-neon" />
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
