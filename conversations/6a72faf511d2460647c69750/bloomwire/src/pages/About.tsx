import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
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
  PlantIcon,
} from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

export default function About() {
  useSEO({ title: "Bloomwire — About | Our Story from Jaipur", description: "Learn about Bloomwire — handcrafted pipe cleaner flowers made with love in Jaipur, India. Our artisans, quality standards, and craft journey.", canonicalPath: "/#/about" })

  const observerRef = useRef<IntersectionObserver | null>(null)

  // Scroll reveal animation observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const sections = [
    {
      h: 'Rooted in Passion',
      tagline: 'Where it all began',
      p1: "Bloomwire was born in a cozy Jaipur studio tucked away in the heart of Jaipur — a space filled with spools of velvet thread, afternoon light slanting through dusty windows, and the quiet hum of creative obsession. It was here, surrounded by bolts of premium fabric and the lingering scent of marigold garlands from the street below, that the first pipe cleaner stem was bent into a petal.",
      p2: "What started as an experiment — could simple wire and chenille be coaxed into something beautiful enough to gift, to keep, to remember? — became a quiet revolution. We weren't just making flowers that wouldn't wilt. We were reimagining floral art itself through the lens of premium chenille craft, blending the textile heritage of Jaipur with a thoroughly modern idea: that keepsakes should be as enduring as the moments they celebrate.",
      p3: "From that first studio, Bloomwire grew into a collective of local artisans — each one trained in the meticulous craft of hand-sculpting stems, each one bringing their own sensitivity to the work. Today, every Bloomwire creation traces its roots back to that same cozy studio, where the philosophy remains unchanged: if it can't be made with care, it shouldn't be made at all.",
      image: HERO_IMAGES.workspace,
    },
    {
      h: 'The Art of the Stem',
      tagline: 'Premium chenille, reimagined',
      p1: "Every Bloomwire flower begins with a material most people overlook: the humble pipe cleaner. But ours are anything but ordinary. We source high-density velvet chenille stems — luxuriously soft to the touch, richly saturated in color, and wrapped around flexible, durable inner steel cores that hold their shape through years of display, rearranging, and admiration.",
      p2: "This is what sets a Bloomwire bloom apart. The velvet chenille gives each petal a silken, almost real texture — you'll find yourself reaching out to touch them. The steel core within means every stem can be gently bent, curved, and posed to suit your vase, your shelf, your vision. They're designed to last for years with proper care — no water needed, just occasional dusting.",
      p3: "We reimagined floral art through premium chenille craft — not by imitating nature, but by capturing its essence. The weight of a peony. The sweep of a rose. The playful tilt of a daisy. All translated into a medium that lasts for years with proper care.",
      image: HERO_IMAGES.crafting,
    },
    {
      h: 'Hand-Sculpted by Local Artisans',
      tagline: 'Every twist tells a story',
      p1: "Every single stem is hand-sculpted by local artisans in our Jaipur studio — not assembled, not stamped, not machine-pressed. Each artisan trained for months before touching their first production bloom, learning the precise tension, angle, and rhythm that transforms a straight chenille stem into a living petal.",
      p2: "The process is slow by design. A single rose takes 15 minutes of focused, meditative work — each petal shaped individually, then layered and bound with practiced precision. A full bouquet? Several hours. Our artisans work with the kind of meticulous care that mass production simply cannot replicate, turning simple wire into prominent, vibrant keepsakes that are designed to last for years with proper care.",
      p3: "When you hold a Bloomwire flower, you're holding the work of someone who cares. Not a factory line. Not a machine. A person who learned their craft in Jaipur, who takes pride in every twist, and who signs each bloom with the invisible signature of their own hand.",
      image: HERO_IMAGES.shelves,
    },
    {
      h: 'Every Bloom Has a Personality',
      tagline: "No two are alike — and that's the point",
      p1: "Here's the thing about hand-craft: it resists sameness. Every Bloomwire bloom carries its own unique personality — a slightly different petal curve, a subtle variation in how the layers fall, a character that only comes from human hands shaping soft materials one twist at a time.",
      p2: "We celebrate this. When you order a Bloomwire rose, you won't get an identical copy of the photo — you'll get a flower with its own presence, its own slight asymmetry, its own quiet charm. That's not a flaw. That's the difference between something manufactured and something made.",
      p3: "It's also why our artisans love their work. They're not producing widgets — they're creating individual characters. Some blooms come out bold and exuberant. Others are shy and delicate. All of them are alive in a way that only hand-craft can achieve. And when one of them finds its way to you, it becomes yours — a one-of-a-kind keepsake that no one else in the world will ever hold.",
      image: HERO_IMAGES.flatLay,
    },
  ]

  const values = [
    { Icon: FlowerIcon, title: 'Sustainable', desc: 'Long-lasting materials, zero waste packaging' },
    { Icon: HandIcon, title: 'Handmade', desc: 'Every flower individually twisted by artisans' },
    { Icon: HeartIcon, title: 'Made with Care', desc: 'Crafted in Jaipur with pride and attention' },
    { Icon: GiftIcon, title: 'Gift Ready', desc: 'Beautifully packaged for every order' },
  ]

  const stats = [
    { value: 'Crafted with', label: 'Love in Jaipur' },
    { value: '2026', label: 'Newly Launched' },
    { value: '15+', label: 'Flower Designs' },
    { value: '100%', label: 'Handmade' },
  ]

  const materialSpecs = [
    {
      title: 'High-Density Velvet Chenille',
      desc: 'Luxuriously soft exterior with rich color saturation that resists fading with proper care.',
      badge: 'Velvet Soft',
      Icon: SparkleIcon,
    },
    {
      title: 'Flexible Inner Steel Core',
      desc: 'Durable, bendable wire at the heart of every stem — pose it, curve it, shape it to your space. It holds.',
      badge: 'Bendable & Durable',
      Icon: ShieldIcon,
    },
    {
      title: 'Color-Fast & Fade-Resistant',
      desc: 'The dense velvet chenille holds its color well with proper care — keep away from direct sunlight and moisture.',
      badge: 'Fade Resistant',
      Icon: CheckCircleIcon,
    },
    {
      title: 'Zero Water, Minimal Upkeep',
      desc: 'No watering needed. Display in indirect light and dust occasionally — they stay beautiful for years with proper care.',
      badge: 'Low Maintenance',
      Icon: PlantIcon,
    },
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Sourcing Premium Chenille',
      desc: 'We select high-density, velvety plush chenille stems with flexible steel cores — sourced for their color-fastness, softness, and structural integrity.',
      Icon: SparkleIcon,
    },
    {
      step: '02',
      title: 'Hand-Sculpting Petals',
      desc: 'Our artisans hand-curve and twist each stem into individual petals and botanical leaves, shaping every curve with practiced precision and care.',
      Icon: ScissorsIcon,
    },
    {
      step: '03',
      title: 'Layering & Assembly',
      desc: 'Petals are meticulously layered and bound together, creating realistic depth, volume, and natural flower shapes — each bloom developing its own personality.',
      Icon: FlowerIcon,
    },
    {
      step: '04',
      title: 'Quality Check & Packaging',
      desc: "Each long-lasting arrangement is inspected, hand-wrapped in eco-craft paper, and tied with satin ribbon — ready to become someone's keepsake.",
      Icon: GiftIcon,
    },
  ]

  const artisans = [
    {
      name: 'Our Artisan Team',
      initials: 'PS',
      role: 'Master Floral Artist',
      experience: 'Skilled Artisan',
      bio: 'Pioneered our classic rose and peony twisting techniques in Jaipur, bringing intricate petal sculpture and wire bending artistry to life.',
      avatarGradient: 'from-pink-500 via-rose-500 to-purple-600',
      quote: 'Every twist tells a story — some are loud, some are quiet, but all are beautiful.',
    },
    {
      name: 'Our Artisan Team',
      initials: 'LN',
      role: 'Wire Twisting Specialist',
      experience: 'Skilled Artisan',
      bio: 'Specializes in sculpting multi-stem bouquets and hand-setting mini blossoms with delicate curves and balanced stems.',
      avatarGradient: 'from-purple-600 via-indigo-500 to-blue-500',
      quote: 'When you mold wire into a bloom, you capture a moment of nature that lasts for years.',
    },
    {
      name: 'Our Artisan Team',
      initials: 'AR',
      role: 'Color Design Lead',
      experience: 'Skilled Artisan',
      bio: 'Curates color palettes, ribbon wrappings, and arrangement harmony to ensure every gift box feels magical.',
      avatarGradient: 'from-amber-400 via-rose-500 to-pink-500',
      quote: 'Color is emotion. Finding the harmony between soft blush and deep wine is where magic happens.',
    },
    {
      name: 'Our Artisan Team',
      initials: 'MS',
      role: 'Quality & Packaging Lead',
      experience: 'Skilled Artisan',
      bio: 'Ensures every long-lasting bouquet passes rigorous quality checks before being hand-wrapped in eco-friendly paper for shipment.',
      avatarGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      quote: "A flower isn't finished when it's twisted — it's finished when the person unboxing it smiles.",
    },
  ]

  // Craft journey gallery images
  const journeyImages = [
    { img: HERO_IMAGES.crafting, caption: 'Raw chenille stems, sorted by color and density', step: '01' },
    { img: HERO_IMAGES.workspace, caption: 'First twists — shaping individual petals by hand', step: '02' },
    { img: products[2]?.image || HERO_IMAGES.flatLay, caption: 'Layering petals into full blooms', step: '03' },
    { img: HERO_IMAGES.shelves, caption: 'Assembling stems into balanced bouquets', step: '04' },
    { img: products[3]?.image || HERO_IMAGES.crafting, caption: 'Color-matching and palette curation', step: '05' },
    { img: HERO_IMAGES.flatLay, caption: 'Quality inspection under natural light', step: '06' },
    { img: products[4]?.image || HERO_IMAGES.workspace, caption: 'Hand-wrapping in eco-craft paper', step: '07' },
    { img: HERO_IMAGES.giftWrap || HERO_IMAGES.shelves, caption: 'Ready to bloom in a new home', step: '08' },
  ]

  const milestones = [
    { year: 'Jan 2026', title: 'The First Stem', desc: 'A single pipe cleaner rose, twisted in a cozy Jaipur studio. Friends saw it and wanted their own.' },
    { year: 'Mar 2026', title: 'The Studio', desc: 'Moved into a dedicated workspace in Jaipur. First artisan hired. Production scaled from hobby to craft business.' },
    { year: 'Jun 2026', title: 'The Collective', desc: 'Grew to a team of skilled local artisans. Expanded to bouquets, potted decor, keychains, and DIY kits. Launched online.' },
    { year: 'Aug 2026', title: 'Online Launch', desc: 'Building a community of flower lovers across India. Creator program, rewards, and a growing collection of lasting blooms.' },
  ]

  const qualityStandards = [
    { Icon: SparkleIcon, title: 'Color-Fastness Testing', badge: 'Fade Resistant', desc: 'Our chenille stems are selected for color-fastness and durability to ensure your blooms stay vibrant for years.' },
    { Icon: ShieldIcon, title: 'Stem Density Checks', badge: 'Structural Integrity', desc: 'Each inner steel core is inspected for flexibility and strength, ensuring it holds its shape through endless arrangements.' },
    { Icon: CheckCircleIcon, title: 'Petal Symmetry Inspection', badge: 'Precision Craft', desc: 'Petals are measured and compared for consistent shape, size, and layering — ensuring every bloom looks natural.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-3">Our Story</p>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6 text-[#2d2418]">
          Rooted in <span className="gradient-text-cool">passion</span>
        </h1>
        <p className="text-lg text-[#8a7a6a] leading-relaxed max-w-2xl mx-auto">
          Bloomwire was born in a cozy Jaipur studio — reimagining floral art through premium chenille craft, one hand-sculpted stem at a time.
        </p>
      </div>

      {/* Hero image */}
      <div className="mb-16 reveal">
        <TiltCard className="rounded-3xl overflow-hidden glass aspect-[16/9]" maxTilt={5}>
          <img src={HERO_IMAGES.flatLay} alt="Bloomwire hand-crafted flowers" className="w-full h-full object-cover" loading="lazy" />
        </TiltCard>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, i) => (
          <div key={i} className="glass-strong rounded-2xl p-6 text-center reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <p className="text-3xl sm:text-4xl font-serif font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-[#8a7a6a] font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Story sections with images */}
      <div className="space-y-24 mb-24">
        {sections.map((section, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center reveal">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <p className="text-xs font-medium tracking-widest text-bloom-gold uppercase mb-2">{section.tagline}</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-5 text-[#2d2418]">{section.h}</h2>
              <p className="text-[#8a7a6a] leading-relaxed mb-4">{section.p1}</p>
              <p className="text-[#8a7a6a] leading-relaxed mb-4">{section.p2}</p>
              <p className="text-[#8a7a6a] leading-relaxed">{section.p3}</p>
            </div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <TiltCard className="aspect-[4/3] rounded-2xl overflow-hidden glass" maxTilt={12}>
                <img src={section.image} alt={section.h} className="w-full h-full object-cover" loading="lazy" />
              </TiltCard>
            </div>
          </div>
        ))}
      </div>

      {/* Material Specification Section */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">What Makes Our Stems Different</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">Premium Materials, Built to Last</h2>
          <p className="text-[#8a7a6a] font-normal">
            High-density velvet chenille. Flexible, durable inner steel cores. Every element chosen so your blooms never need water — and are designed to last for years.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materialSpecs.map((spec, i) => (
            <div key={i} className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 hover:border-bloom-rose/40 transition-all text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-rose/20 to-bloom-gold/10 border border-bloom-rose/20 flex items-center justify-center mx-auto mb-4 text-bloom-neon group-hover:scale-110 transition-transform">
                <spec.Icon size={26} />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-bloom-gold/10 border border-bloom-gold/30 text-bloom-gold text-[10px] font-bold uppercase tracking-wider mb-3">{spec.badge}</span>
              <h3 className="text-base font-serif font-bold text-[#2d2418] mb-2">{spec.title}</h3>
              <p className="text-sm text-[#8a7a6a] leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Behind the Craft</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">How Our Flowers Are Made</h2>
          <p className="text-[#8a7a6a] font-normal">
            Four meticulous steps of artisanal hand-sculpting that turn simple wire into prominent, vibrant keepsakes.
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
                <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-2">{proc.title}</h3>
                <p className="text-xs sm:text-sm text-[#6b5d4f] font-normal leading-relaxed">{proc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Handcrafted Journey - Gallery */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">From Wire to Bloom</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">The Handcrafted Journey</h2>
          <p className="text-[#8a7a6a] font-normal">
            A visual walkthrough of how raw chenille stems transform into long-lasting floral art in our Jaipur studio.
          </p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {journeyImages.map((item, i) => (
            <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden glass-strong border border-[#2d2418]/10 hover:border-bloom-rose/40 transition-all duration-500 group">
              <div className="relative overflow-hidden">
                <img src={item.img} alt={item.caption} className="w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-bloom-rose/80 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold border border-[#2d2418]/15">
                  {item.step}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-darker/80 via-transparent to-transparent" />
              </div>
              <p className="p-4 text-sm text-[#6b5d4f] leading-relaxed">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Craftsmanship */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Quality You Can Feel</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">Quality Craftsmanship</h2>
          <p className="text-[#8a7a6a] font-normal">
            Every Bloomwire creation passes rigorous quality standards before it reaches your hands.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityStandards.map((qs, i) => (
            <div key={i} className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 hover:border-bloom-rose/40 transition-all text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-rose/20 to-bloom-gold/10 border border-bloom-rose/20 flex items-center justify-center mx-auto mb-4 text-bloom-neon">
                <qs.Icon size={26} />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-bloom-gold/10 border border-bloom-gold/30 text-bloom-gold text-[10px] font-bold uppercase tracking-wider mb-3">{qs.badge}</span>
              <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-2">{qs.title}</h3>
              <p className="text-sm text-[#8a7a6a] leading-relaxed">{qs.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team / Artisans Section with Quotes */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">The Hands Behind the Blooms</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">Meet Our Artisans</h2>
          <p className="text-[#8a7a6a] font-normal">
            Local craftspeople in Jaipur who bring creativity, patience, and meticulous care to every hand-sculpted stem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artisans.map((artisan, i) => (
            <div
              key={i}
              className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 hover:border-bloom-rose/40 transition-all flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${artisan.avatarGradient} flex items-center justify-center text-[#2d2418] text-xl sm:text-2xl font-serif font-bold shadow-lg shrink-0 border border-[#2d2418]/15`}>
                  {artisan.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2d2418]">{artisan.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-bloom-rose/10 text-bloom-neon border border-bloom-rose/20 font-medium">
                      {artisan.experience}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-bloom-gold mb-2">{artisan.role}</p>
                  <p className="text-xs sm:text-sm text-[#6b5d4f] font-normal leading-relaxed">{artisan.bio}</p>
                </div>
              </div>
              {/* Artisan Quote */}
              <blockquote className="border-l-2 border-bloom-rose/40 pl-4 py-1 italic text-sm text-bloom-neon/80 leading-relaxed">
                "{artisan.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      {/* Behind the Scenes Timeline */}
      <div className="mb-24 reveal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-2">Our Journey</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] mb-4">Behind the Scenes</h2>
          <p className="text-[#8a7a6a] font-normal">
            From a single pipe cleaner rose in a cozy Jaipur studio to a collective of artisans — the Bloomwire story so far.
          </p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-bloom-rose/50 via-bloom-neon/30 to-transparent" />
          {milestones.map((m, i) => (
            <div key={i} className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
              {/* Timeline node */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-bloom-rose border-2 border-bloom-darker shadow-[0_0_15px_rgba(255,64,129,0.5)] z-10" />
              {/* Content */}
              <div className={`flex-1 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'} pl-12 sm:pl-0`}>
                <span className="text-xs font-bold text-bloom-gold uppercase tracking-wider">{m.year}</span>
                <h3 className="text-xl font-serif font-bold text-[#2d2418] mt-1 mb-2">{m.title}</h3>
                <p className="text-sm text-[#8a7a6a] leading-relaxed">{m.desc}</p>
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Mission / Vision Banner */}
      <div className="mb-24 reveal">
        <div className="glass-strong rounded-3xl p-8 sm:p-14 border border-bloom-rose/50 relative overflow-hidden text-center shadow-[0_0_35px_rgba(233,30,99,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-bloom-rose/15 via-transparent to-bloom-wine/20 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-bloom-rose/10 text-bloom-neon flex items-center justify-center mx-auto mb-6">
              <HeartIcon size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2418] mb-4">Our Promise</h2>
            <p className="text-[#6b5d4f] leading-relaxed text-base sm:text-lg">
              We believe in quality over quantity, in craft over mass production, and in the idea that the best gifts are the ones that last.
              Every Bloomwire creation is handmade with meticulous care by local artisans in Jaipur — turning simple wire into vibrant keepsakes
              that are designed to last for years with proper care. If it doesn't bloom beautifully, we'll make it right.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
        {values.map((v, i) => (
          <div key={i} className="glass-strong rounded-2xl p-6 text-center border border-[#2d2418]/10 hover:border-bloom-rose/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-bloom-rose/10 flex items-center justify-center mx-auto mb-3">
              <v.Icon size={22} className="text-bloom-neon" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2 text-[#2d2418]">{v.title}</h3>
            <p className="text-sm text-[#8a7a6a]">{v.desc}</p>
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
