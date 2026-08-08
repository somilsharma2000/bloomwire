import { useSEO } from '../hooks/useSEO'
import {
  TruckIcon,
  ClockIcon,
  PinIcon,
  WhatsAppIcon,
  GiftIcon,
  ShieldIcon,
  MailIcon,
  CartIcon,
} from '../components/Icons'
import { Link } from 'react-router-dom'

export default function Shipping() {
  useSEO({
    title: 'Bloomwire — Shipping Policy | Delivery Information',
    description:
      'Bloomwire Shipping Policy: free shipping above ₹499, crafting timelines, standard (4-7 business days) and express delivery (2-4 business days), COD availability, and tracking.',
    canonicalPath: '/#/shipping',
  })

  const sections = [
    {
      id: 'cost',
      num: '1',
      title: 'Shipping Cost & Free Shipping Threshold',
      icon: TruckIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>We keep shipping simple and transparent across India:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
            <div className="p-4 rounded-xl glass border border-bloom-rose/40 bg-gradient-to-br from-bloom-wine/30 to-transparent">
              <span className="text-xs font-bold text-bloom-rose uppercase tracking-wider block mb-1">Orders ₹499 and Above</span>
              <p className="text-2xl font-serif font-bold text-white mb-1">FREE Shipping</p>
              <p className="text-xs text-gray-300">Complimentary standard shipping across India on orders totaling ₹499 or more.</p>
            </div>
            <div className="p-4 rounded-xl glass border border-white/10">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Orders Below ₹499</span>
              <p className="text-2xl font-serif font-bold text-white mb-1">Flat ₹49</p>
              <p className="text-xs text-gray-300">A flat shipping fee of ₹49 applies to cover courier handling for smaller orders.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'crafting',
      num: '2',
      title: 'Crafting & Hand-Sculpting Time',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            Every single Bloomwire arrangement is meticulously hand-sculpted by artisans in our Jaipur studio:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>
              <strong className="text-white font-medium">Crafting Time:</strong> <strong className="text-bloom-gold">1–2 business days</strong> for all items prior to dispatch.
            </li>
            <li>
              <strong className="text-white font-medium">Handmade Disclaimer:</strong> Because every flower stem and bouquet is handcrafted with artisanal precision, next-day delivery is never promised or possible.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'delivery-time',
      num: '3',
      title: 'Delivery Timelines & Express Shipping',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            We offer two delivery tiers across India:
          </p>
          <div className="space-y-3 my-2">
            <div className="p-4 rounded-xl glass border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">Standard Shipping</span>
                <span className="text-xs text-bloom-gold font-semibold">FREE (over ₹499) / ₹49</span>
              </div>
              <p className="text-sm text-gray-300 font-semibold text-bloom-rose">
                4–7 business days total (1–2 days crafting + 3–5 days shipping)
              </p>
            </div>
            <div className="p-4 rounded-xl glass border border-bloom-neon/30 bg-bloom-wine/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">Express Shipping</span>
                <span className="text-xs text-bloom-neon font-semibold">+₹99 fee</span>
              </div>
              <p className="text-sm text-gray-300 font-semibold text-bloom-neon">
                2–4 business days total (1–2 days crafting + 1–2 days shipping)
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-amber-300/90 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
            <strong>Important Note on Express Shipping:</strong> Express delivery speeds up courier transit/shipping time (+₹99), NOT crafting time. Crafting still takes 1–2 business days because each piece is individually hand-sculpted in Jaipur. Next-day delivery is not offered.
          </p>
        </div>
      ),
    },
    {
      id: 'cod',
      num: '4',
      title: 'Cash on Delivery (COD)',
      icon: CartIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            Cash on Delivery is available for eligible pin codes across India:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong className="text-white font-medium">COD Fee:</strong> A flat <strong className="text-bloom-rose">₹49 handling fee</strong> applies at checkout for cash collection handling by courier partners.</li>
            <li><strong className="text-white font-medium">Verification:</strong> Our team conducts a brief phone/WhatsApp verification call before dispatching COD orders. Unverified orders will not be shipped.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'tracking',
      num: '5',
      title: 'Order Tracking',
      icon: WhatsAppIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            Tracking is provided for all orders without exception:
          </p>
          <p>
            As soon as your parcel is packed and handed over to courier partners (Delhivery, Bluedart, Xpressbees, Speed Post), a tracking link and AWB number are sent directly to your <strong className="text-emerald-400 font-medium">WhatsApp and email</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'serviceable',
      num: '6',
      title: 'Shipping Across India Only',
      icon: PinIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            We ship to over 19,000+ pin codes <strong className="text-white">across India only</strong>.
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            International shipping is not available. We ship exclusively within India.
          </p>
        </div>
      ),
    },
    {
      id: 'packaging',
      num: '7',
      title: 'Signature Gift Packaging',
      icon: GiftIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            Every order is delivered ready to gift!
          </p>
          <div className="p-4 rounded-xl glass border border-white/10 flex items-start gap-3 mt-2">
            <GiftIcon size={24} className="text-bloom-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white text-sm mb-1">Free Signature Packaging Included</p>
              <p className="text-xs text-gray-300">
                All flower stems and bouquets are wrapped in protective boxes with signature tissue, ribbon accents, and an eco-friendly care instruction card at zero extra cost.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-bloom-rose/30 text-bloom-rose text-xs font-semibold uppercase tracking-wider mb-4">
          <TruckIcon size={14} /> Reliable Delivery
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
          Shipping Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Handcrafted in our Jaipur studio and shipped across India. Here is everything you need to know about crafting times, delivery options, costs, and tracking.
        </p>
        <p className="text-xs text-gray-500 mt-3">Handcrafted with care in Jaipur, Rajasthan, India</p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Free Shipping</p>
          <p className="text-lg font-bold text-white">Above ₹499</p>
          <p className="text-[11px] text-gray-400 mt-0.5">₹49 below ₹499</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Crafting</p>
          <p className="text-lg font-bold text-white">1–2 Days</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Hand-sculpted per order</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Standard Delivery</p>
          <p className="text-lg font-bold text-white">4–7 Days</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Crafting + 3-5d shipping</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Express Delivery</p>
          <p className="text-lg font-bold text-white">2–4 Days</p>
          <p className="text-[11px] text-gray-400 mt-0.5">+₹99 (faster transit)</p>
        </div>
      </div>

      {/* Accordion / List Sections */}
      <div className="space-y-6">
        {sections.map((sec) => {
          const Icon = sec.icon
          return (
            <section
              key={sec.id}
              id={sec.id}
              className="glass rounded-2xl p-6 border border-white/10 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-bloom-wine/60 to-bloom-rose/30 text-bloom-rose border border-bloom-rose/30">
                  <Icon size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-bloom-gold uppercase tracking-wider block">
                    Section {sec.num}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {sec.title}
                  </h2>
                </div>
              </div>
              <div>{sec.content}</div>
            </section>
          )
        })}
      </div>

      {/* Support Box */}
      <div className="mt-10 glass-dark rounded-2xl p-6 border border-white/10 text-center">
        <h3 className="text-lg font-serif font-bold text-white mb-2">Have a question about your delivery?</h3>
        <p className="text-xs sm:text-sm text-gray-300 mb-4 max-w-xl mx-auto">
          Message us on WhatsApp with your order ID or email us at hello@bloomwire.in for live delivery updates.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <a
            href="mailto:hello@bloomwire.in"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/20 text-white hover:border-bloom-neon hover:text-bloom-neon transition-colors"
          >
            <MailIcon size={16} /> hello@bloomwire.in
          </a>
          <a
            href="https://wa.me/message/VT4TW64X2EJKH1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            <WhatsAppIcon size={16} /> WhatsApp Support
          </a>
        </div>
      </div>

      {/* Footer Nav Links */}
      <div className="mt-12 text-center pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
        <Link to="/privacy" className="hover:text-bloom-neon transition-colors underline">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link to="/returns" className="hover:text-bloom-neon transition-colors underline">
          Replacement & Refund Policy
        </Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-bloom-neon transition-colors underline">
          Terms & Conditions
        </Link>
      </div>
    </div>
  )
}
