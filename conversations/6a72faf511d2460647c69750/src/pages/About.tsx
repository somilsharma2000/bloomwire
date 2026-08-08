import { Link } from 'react-router-dom'
import { HERO_IMAGES, products } from '../data/products'
import TiltCard from '../components/TiltCard'
import {
  FlowerIcon,
  HandIcon,
  GiftIcon,
  HeartIcon,
  ArrowRightIcon,
  SparkleIcon,
  ScissorsIcon,
  ShieldIcon,
  CheckCircleIcon,
} from '../components/Icons'

export default function About() {
  const sections = [
    {
      h: 'The Beginning',
      p1: "It started in a small home studio in Jaipur, where a pair of hands twisted the first pipe cleaner rose. What began as a hobby — making flowers that wouldn't wilt — quickly became something more. Friends wanted them. Then friends of friends. The demand grew, and so did the dream.",
      p2: "Today, Bloomwire is a collective of skilled artisans who hand-twist every single flower. No machines, no assembly lines — just patience, skill, and premium chenille stems. Every rose takes 15 minutes. A full bouquet? Several hours. But the result is a flower that lasts a lifetime.",
      image: HERO_IMAGES.workspace,
    },
    {
      h: 'Our Craft',
      p1: "Each flower begins as a simple chenille stem — soft, flexible wire wrapped in fuzzy fibers. Our artisans shape each petal individually, layering and twisting until the bloom comes to life. The process is meditative, almost like meditation. Each twist is deliberate, each layer intentional.",
      p2: "We use only premium chenille stems sourced for their color-fastness and softness. The result: flowers that look real, feel soft, and last forever. Every bouquet is wrapped in premium craft paper with a satin ribbon. Every potted flower comes in a real terracotta pot. No detail is too small.",
      image: HERO_IMAGES.crafting,
    },
    {
      h: 'Our Promise',
      p1: "Every Bloomwire creation is handmade with care. No two flowers are exactly alike — and that's the point. Each one carries the unique touch of the artisan who made it. When you hold a Bloomwire flower, you're holding hours of careful work, years of honed skill, and a genuine piece of someone's craft.",
      p2: "We believe in quality over quantity, in craft over mass production, and in the idea that the best gifts are the ones that last. That's why every product comes with our forever guarantee — if it doesn't bloom beautifully, we'll make it right.",
      image: HERO_IMAGES.shelves,
    },
  ]

  const values = [
    { Icon: FlowerIcon, title: 'Sustainable', desc: 'Long-lasting materials, zero waste packaging' },
    { Icon: HandIcon, title: 'Handmade', desc: 'Every flower individually twisted by artisans' },
    { Icon: HeartIcon, title: 'Made with Care', desc: 'Crafted in India with pride and attention' },
    { Icon: GiftIcon, title: 'Gift Ready', desc: 'Beautifully packaged for every order' },
  ]

  const stats = [
    { value: '10,000+', label: 'Flowers Hand-Twisted' },
    { value: '500+', label: 'Happy Customers' },
    { value: '15+', label: 'Flower Designs' },
    { value: '100%', label: 'Handmade' },
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Sourcing Premium Chenille',
      desc: 'We select high-density, velvety plush chenille stems in vibrant, fade-resistant colors for silky soft petals.',
      Icon: SparkleIcon,
    },
    {
      step: '02',
      title: 'Twisting & Shaping',
      desc: 'Our artisans hand-curve and twist pliable wire stems into intricate individual petals and botanical leaves.',
      Icon: ScissorsIcon,
    },
    {
      step: '03',
      title: 'Assembly & Layering',
      desc: 'Petals are meticulously layered and bound together, creating realistic depth, volume, and natural flower shapes.',
      Icon: FlowerIcon,
    },
    {
      step: '04',
      title: 'Quality Check & Packaging',
      desc: 'Each everlasting arrangement is inspected, hand-wrapped in eco-craft paper, and tied with satin ribbon ready for gifting.',
      Icon: GiftIcon,
    },
  ]

  const craftGallery = [
    {
      step: '01',
      title: 'Raw Chenille Sourcing',
      desc: 'Selecting high-density, velvety wire stems in custom-dyed pigments.',
      image: HERO_IMAGES.workspace,
    },
    {
      step: '02',
      title: 'Petal Wire Sculpting',
      desc: 'Hand-curving each individual wire petal to mimic real floral geometry.',
      image: HERO_IMAGES.crafting,
    },
    {
      step: '03',
      title: 'Multi-Tone Gradienting',
      desc: 'Layering warm sunset and rich magenta hues for natural depth.',
      image: products[0]?.image || HERO_IMAGES.flatLay,
    },
    {
      step: '04',
      title: 'Botanical Stem Shaping',
      desc: 'Bending flexible stem wires into organic, flowing flower positions.',
      image: products[1]?.image || HERO_IMAGES.homeDecor,
    },
    {
      step: '05',
      title: 'Studio Display & Inspection',
      desc: 'Reviewing assembled stems under soft studio light before bouquet binding.',
      image: HERO_IMAGES.shelves,
    },
    {
      step: '06',
      title: 'Bespoke Bouquet Assembly',
      desc: 'Clustering multiple flower varieties with green foliage accents.',
      image: products[2]?.image || HERO_IMAGES.flatLay,
    },
    {
      step: '07',
      title: 'Artisan Gift Wrapping',
      desc: 'Hand-wrapping in eco-craft tissue paper finished with satin ribbons.',
      image: HERO_IMAGES.giftWrap,
    },
    {
      step: '08',
      title: 'Everlasting Delivery',
      desc: 'Carefully packaged arrangements ready to bloom forever in your home.',
      image: HERO_IMAGES.flatLay,
    },
  ]

  const qualityStandards = [
    {
      title: 'Color-Fastness Testing',
      desc: 'Our premium chenille fibers undergo light exposure and friction testing to guarantee vibrant, fade-proof petals that maintain color intensity indefinitely.',
      Icon: SparkleIcon,
      tag: 'Fade Proof',
    },
    {
      title: 'Stem Density Checks',
      desc: 'We strictly verify wire core thickness and plush fiber density so that every stem remains fully bendable while holding its exact sculpted shape.',
      Icon: ShieldIcon,
      tag: 'Structural Integrity',
    },
    {
      title: 'Petal Symmetry Inspection',
      desc: 'Every completed bloom is hand-checked for natural curvature, petal balance, and realistic volume before joining a bouquet or potted arrangement.',
      Icon: CheckCircleIcon,
      tag: 'Precision Craft',
    },
  ]

  const artisans = [
    {
      name: 'Priya Sharma',
      initials: 'PS',
      role: 'Master Floral Artist',
      experience: '6+ Years Exp.',
      bio: 'Pioneered our classic rose and peony twisting techniques in Jaipur, bringing intricate petal sculpture and wire bending artistry to life.',
      quote: 'Every twist tells a story — some are loud, some are quiet, but all are beautiful.',
      avatarGradient: 'from-pink-500 via-rose-500 to-purple-600',
    },
    {
      name: 'Lakshmi Nair',
      initials: 'LN',
      role: 'Wire Twisting Specialist',
      experience: '5 Years Exp.',
      bio: 'Specializes in sculpting multi-stem bouquets and hand-setting mini blossoms with delicate curves and balanced stems.',
      quote: 'When you mold wire into a bloom, you capture a moment of nature that never fades.',
      avatarGradient: 'from-purple-600 via-indigo-500 to-blue-500',
    },
    {
      name: 'Anjali Reddy',
      initials: 'AR',
      role: 'Color Design Lead',
      experience: '4+ Years Exp.',
      bio: 'Curates color palettes, ribbon wrappings, and arrangement harmony to ensure every gift box feels magical.',
      quote: 'Color is emotion. Finding the harmony between soft blush and deep wine is where magic happens.',
      avatarGradient: 'from-amber-400 via-rose-500 to-pink-500',
    },
    {
      name: 'Meera Singh',
      initials: 'MS',
      role: 'Quality & Packaging Lead',
      experience: '3+ Years Exp.',
      bio: 'Ensures every everlasting bouquet passes rigorous quality checks before being hand-wrapped in eco-friendly paper for shipment.',
      quote: "A flower isn't finished when it's twisted — it's finished when the person unboxing it smiles.",
      avatarGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    },
  ]

  const milestones = [
    {
      year: '2021',
      title: 'The First Stem',
      badge: 'Genesis',
      desc: 'How it started with a single pipe cleaner flower twisted late at night in a small Jaipur bedroom. What began as a personal effort to craft non-wilting blooms sparked a community passion.',
    },
    {
      year: '2022',
      title: 'The Studio',
      badge: 'Growth',
      desc: 'Moving into a proper workspace in Jaipur custom-fitted for sorting raw chenille stems, color dying, wire bending workstations, and climate-controlled floral storage.',
    },
    {
      year: '2023',
      title: 'The Collective',
      badge: 'Community',
      desc: 'Growing to multiple local artisans trained in signature wire-twisting and flower assembly, creating flexible, fair-wage craft careers for women in Jaipur.',
    },
    {
      year: '2024+',
      title: 'The Vision Ahead',
      badge: 'Future',
      desc: 'What’s next: expanding our zero-waste floral creations worldwide, innovating with new botanical wire shapes, and hosting craft workshops for flower enthusiasts.',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-3">Our Story</p>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6 text-white">
          Crafted with <span className="gradient-text-cool">love</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Bloomwire began with a simple idea: flowers should last as long as the memories they represent.
        </p>
      </div>

      {/* Hero image */}
      <div className="mb-16 reveal">
        <TiltCard className="rounded-3xl overflow-hidden glass aspect-[16/9]" maxTilt={5}>
          <img src={HERO_IMAGES.flatLay} alt="Bloomwire flowers" className="w-full h-full object-cover" loading="lazy" />
        </TiltCard>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, i) => (
          <div key={i} className="glass-strong rounded-2xl p-6 text-center reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <p className="text-3xl sm:text-4xl font-serif font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Story sections with images */}
      <div className="space-y-20 mb-24">
        {sections.map((section, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center reveal" style={{ flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4 text-white">{section.h}</h2>
              <p className="text-gray-400 leading-relaxed mb-4">{section.p1}</p>
              <p className="text-gray-400 leading-relaxed">{section.p2}</p>
            </div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <TiltCard className="aspect-[4/3] rounded-2xl overflow-hidden glass" maxTilt={12}>
                <img src={section.image} alt={section.h} className="w-full h-full object-cover" loading="lazy" />
              </TiltCard>
            </div>
          </div>
        ))}
      </div>

      {/* Process Section */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Behind the Craft</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">How Our Flowers Are Made</h2>
          <p className="text-gray-400 font-normal">
            Four meticulous steps of artisanal hand-twisting that turn soft chenille wire into everlasting floral art.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((proc, i) => (
            <div
              key={i}
              className="glass-strong rounded-2xl p-6 relative flex flex-col justify-between border border-bloom-rose/30 hover:border-bloom-rose/70 transition-all duration-300 shadow-lg shadow-bloom-rose/5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-bloom-rose/10 flex items-center justify-center text-bloom-neon border border-bloom-rose/20 group-hover:scale-110 transition-transform">
                    <proc.Icon size={22} />
                  </div>
                  <span className="text-2xl font-serif font-bold text-bloom-rose/40 group-hover:text-bloom-rose/80 transition-colors">
                    {proc.step}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">{proc.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">{proc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Craft Journey Gallery */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Visual Showcase</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">The Handcrafted Journey</h2>
          <p className="text-gray-400 font-normal">
            A step-by-step visual gallery demonstrating the transformation from raw wire stems to finished floral masterpieces.
          </p>
        </div>

        {/* Masonry-style gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {craftGallery.map((item, i) => (
            <div
              key={i}
              className="break-inside-avoid glass-strong rounded-2xl overflow-hidden border border-white/10 hover:border-bloom-rose/50 transition-all duration-300 group shadow-lg"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-serif font-bold rounded-full bg-black/60 backdrop-blur-md text-bloom-neon border border-bloom-rose/30">
                  Step {item.step}
                </span>
              </div>
              <div className="p-5 bg-black/40 backdrop-blur-sm border-t border-white/5">
                <h3 className="text-base font-serif font-bold text-white mb-1 group-hover:text-bloom-neon transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 font-normal leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Craftsmanship Section */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Our Standards</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">Quality Craftsmanship</h2>
          <p className="text-gray-400 font-normal">
            Every Bloomwire floral piece undergoes rigorous quality verification to ensure lasting beauty, color vibrancy, and resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityStandards.map((qs, i) => (
            <div
              key={i}
              className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-bloom-rose/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-bloom-rose/10 flex items-center justify-center text-bloom-neon border border-bloom-rose/20 group-hover:scale-110 transition-transform">
                    <qs.Icon size={22} />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-bloom-rose/10 text-bloom-neon border border-bloom-rose/20 font-medium">
                    {qs.tag}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">{qs.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">{qs.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team / Artisans Section */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">The Hands Behind the Blooms</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">Meet Our Artisans</h2>
          <p className="text-gray-400 font-normal">
            Dedicated craftspeople in Jaipur who bring creativity, patience, and love to every hand-twisted stem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artisans.map((artisan, i) => (
            <div
              key={i}
              className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-bloom-rose/40 transition-all flex flex-col sm:flex-row gap-5 items-start"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${artisan.avatarGradient} flex items-center justify-center text-white text-xl sm:text-2xl font-serif font-bold shadow-lg shrink-0 border border-white/20`}>
                {artisan.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white">{artisan.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-bloom-rose/10 text-bloom-neon border border-bloom-rose/20 font-medium">
                    {artisan.experience}
                  </span>
                </div>
                <p className="text-xs font-medium text-bloom-gold mb-2">{artisan.role}</p>
                <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed mb-3">{artisan.bio}</p>
                <blockquote className="text-xs sm:text-sm italic text-bloom-rose/90 font-serif border-l-2 border-bloom-rose/40 pl-3 py-1 bg-bloom-rose/5 rounded-r-lg">
                  &ldquo;{artisan.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behind the Scenes Timeline */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Our Journey</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">Behind the Scenes</h2>
          <p className="text-gray-400 font-normal">
            Key milestones in our evolution from a single hand-twisted stem to a thriving artisan collective.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-10 border-l-2 border-bloom-rose/30 ml-2 sm:ml-6 space-y-10">
          {milestones.map((m, i) => (
            <div key={i} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black border-2 border-bloom-neon flex items-center justify-center text-bloom-neon shadow-[0_0_12px_rgba(233,30,99,0.5)] group-hover:scale-110 transition-transform">
                <SparkleIcon size={12} className="sm:hidden" />
                <SparkleIcon size={16} className="hidden sm:block" />
              </div>

              {/* Milestone card */}
              <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-bloom-rose/40 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-serif font-bold gradient-text">{m.year}</span>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white">{m.title}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-bloom-rose/10 text-bloom-neon border border-bloom-rose/20 font-medium">
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission / Vision Banner */}
      <div className="mb-24 reveal">
        <div className="glass-strong rounded-3xl p-8 sm:p-14 border border-bloom-rose/50 relative overflow-hidden text-center shadow-[0_0_35px_rgba(233,30,99,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-bloom-rose/15 via-transparent to-bloom-wine/20 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-bloom-rose/10 text-bloom-neon flex items-center justify-center mx-auto mb-6 border border-bloom-rose/30">
              <SparkleIcon size={24} />
            </div>
            <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-4">Our Mission & Vision</p>
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-white via-bloom-rose/90 to-pink-200 mb-6">
              &ldquo;To replace short-lived, disposable flowers with everlasting, zero-waste floral decor while empowering local craft artisans to share their extraordinary hand-twisted art with the world.&rdquo;
            </blockquote>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 font-medium">
              — The Bloomwire Vision
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
        {values.map((v, i) => (
          <div key={i} className="glass-strong rounded-2xl p-6 text-center border border-white/10 hover:border-bloom-rose/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-bloom-rose/10 flex items-center justify-center mx-auto mb-3">
              <v.Icon size={22} className="text-bloom-neon" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2 text-white">{v.title}</h3>
            <p className="text-sm text-gray-400">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition"
        >
          Explore Our Collection <ArrowRightIcon size={18} />
        </Link>
      </div>
    </div>
  )
}
