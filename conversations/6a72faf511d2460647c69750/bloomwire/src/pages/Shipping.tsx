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
      'Bloomwire Shipping Policy: free shipping above Rs.499, dispatch times, delivery timeline, COD availability, and tracking.',
    canonicalPath: '/#/shipping',
  })

  const sections = [
    {
      id: 'cost',
      num: '1',
      title: 'Shipping Cost & Free Shipping Threshold',
      icon: TruckIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>We strive to keep shipping fair and simple for our customers across India:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
            <div className="p-4 rounded-xl glass border border-bloom-rose/40 bg-gradient-to-br from-bloom-wine/30 to-transparent">
              <span className="text-xs font-bold text-bloom-rose uppercase tracking-wider block mb-1">Orders ₹499 and Above</span>
              <p className="text-2xl font-serif font-bold text-[#2d2418] mb-1">FREE Shipping</p>
              <p className="text-xs text-[#6b5d4f]">Enjoy 100% complimentary standard shipping pan-India on orders totaling ₹499 or more.</p>
            </div>
            <div className="p-4 rounded-xl glass border border-[#2d2418]/10">
              <span className="text-xs font-bold text-[#8a7a6a] uppercase tracking-wider block mb-1">Orders Below ₹499</span>
              <p className="text-2xl font-serif font-bold text-[#2d2418] mb-1">Flat ₹49</p>
              <p className="text-xs text-[#6b5d4f]">A flat nominal delivery fee of ₹49 applies to cover courier handling for smaller orders.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dispatch',
      num: '2',
      title: 'Dispatch Time',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            All our products are crafted and packaged in our Jaipur studio:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li>
              <strong className="text-[#2d2418] font-medium">In-Stock Items:</strong> Dispatched within <strong className="text-bloom-gold">24 hours</strong> of order placement (Monday through Saturday).
            </li>
            <li>
              <strong className="text-[#2d2418] font-medium">Made-to-Order & Custom Creations:</strong> Require <strong className="text-bloom-gold">3–5 business days</strong> for our Jaipur artisans to hand-sculpt, assemble, and quality-check prior to dispatch.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'delivery-time',
      num: '3',
      title: 'Delivery Timelines',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Once dispatched from Jaipur, standard estimated delivery takes <strong className="text-[#2d2418]">3 to 7 business days</strong> pan-India:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">Metro Cities (Delhi, Mumbai, Bengaluru, etc.):</strong> 3–4 business days.</li>
            <li><strong className="text-[#2d2418] font-medium">Tier 2 / Tier 3 Cities:</strong> 4–6 business days.</li>
            <li><strong className="text-[#2d2418] font-medium">North-East & Remote Pin Codes:</strong> 7–10 business days.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'cod',
      num: '4',
      title: 'Cash on Delivery (COD)',
      icon: CartIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Cash on Delivery is available for eligible pin codes across India with specific conditions:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">COD Convenience Fee:</strong> An additional <strong className="text-bloom-rose">₹49 COD handling fee</strong> is applied at checkout to cover cash handling charges levied by courier partners.</li>
            <li><strong className="text-[#2d2418] font-medium">Verification Call:</strong> Our Jaipur team conducts an automated or manual WhatsApp/phone verification call before dispatching any COD parcel. Unverified orders will not be shipped.</li>
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
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            We keep you informed every step of the journey:
          </p>
          <p>
            As soon as your flower arrangement is packed and handed over to our courier partner, a tracking link and AWB courier number will be sent directly to your <strong className="text-emerald-400 font-medium">WhatsApp number</strong> and email address.
          </p>
          <p>
            You can also check live status directly on our website or by messaging our support line on WhatsApp.
          </p>
        </div>
      ),
    },
    {
      id: 'serviceable',
      num: '6',
      title: 'Serviceable Areas',
      icon: PinIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            We ship to over 19,000+ pin codes across <strong className="text-[#2d2418]">All India</strong> through tier-1 courier partners like Delhivery, Bluedart, Xpressbees, and Speed Post.
          </p>
          <p className="text-xs sm:text-sm text-[#8a7a6a]">
            *Please note: Extremely remote regions or hill station pin codes may experience extended transit times of 10 to 14 days.
          </p>
        </div>
      ),
    },
    {
      id: 'international',
      num: '7',
      title: 'International Shipping',
      icon: ShieldIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            <strong className="text-[#2d2418] font-medium">International shipping is currently not available.</strong> We currently ship exclusively within India.
          </p>
          <p className="text-xs sm:text-sm text-[#8a7a6a]">
            If you are located overseas and wish to send a handcrafted gift to an address in India, you can easily place an order online using international credit cards or PayPal (via WhatsApp support).
          </p>
        </div>
      ),
    },
    {
      id: 'packaging',
      num: '8',
      title: 'Premium Gift Packaging',
      icon: GiftIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Every single Bloomwire™ order is delivered ready to gift!
          </p>
          <div className="p-4 rounded-xl glass border border-[#2d2418]/10 flex items-start gap-3 mt-2">
            <GiftIcon size={24} className="text-bloom-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#2d2418] text-sm mb-1">Free Signature Packaging Included</p>
              <p className="text-xs text-[#6b5d4f]">
                All flower stems, bouquets, and pots are wrapped in sturdy protective boxes with signature tissue, ribbon accents, and an eco-friendly care instruction card at zero extra charge.
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2d2418] tracking-tight mb-4">
          Shipping Policy
        </h1>
        <p className="text-sm sm:text-base text-[#8a7a6a] max-w-2xl mx-auto leading-relaxed">
          From our Jaipur studio right to your doorstep. Here is everything you need to know about dispatch timelines, shipping costs, and tracking your Bloomwire™ parcel.
        </p>
        <p className="text-xs text-[#a0918a] mt-3">Handcrafted with care in Jaipur, Rajasthan, India</p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
        <div className="glass rounded-xl p-4 border border-[#2d2418]/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Free Shipping</p>
          <p className="text-lg font-bold text-[#2d2418]">Above ₹499</p>
          <p className="text-[11px] text-[#8a7a6a] mt-0.5">₹49 below ₹499</p>
        </div>
        <div className="glass rounded-xl p-4 border border-[#2d2418]/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Dispatch</p>
          <p className="text-lg font-bold text-[#2d2418]">24 Hours</p>
          <p className="text-[11px] text-[#8a7a6a] mt-0.5">3-5 days made-to-order</p>
        </div>
        <div className="glass rounded-xl p-4 border border-[#2d2418]/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">Delivery</p>
          <p className="text-lg font-bold text-[#2d2418]">3–7 Days</p>
          <p className="text-[11px] text-[#8a7a6a] mt-0.5">Pan-India coverage</p>
        </div>
        <div className="glass rounded-xl p-4 border border-[#2d2418]/10">
          <p className="text-xs text-bloom-gold font-bold uppercase mb-1">COD Option</p>
          <p className="text-lg font-bold text-[#2d2418]">Available</p>
          <p className="text-[11px] text-[#8a7a6a] mt-0.5">₹49 COD fee</p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8">
        {sections.map((sec) => {
          const Icon = sec.icon
          return (
            <section
              key={sec.id}
              id={sec.id}
              className="glass rounded-2xl p-6 sm:p-8 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-bloom-wine/60 to-bloom-rose/30 text-bloom-rose border border-bloom-rose/30">
                  <Icon size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-bloom-gold uppercase tracking-wider block">
                    Section {sec.num}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2d2418]">
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
      <div className="mt-10 glass rounded-2xl p-6 border border-[#2d2418]/10 text-center">
        <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-2">Have a question about your delivery?</h3>
        <p className="text-xs sm:text-sm text-[#6b5d4f] mb-4 max-w-xl mx-auto">
          Message us on WhatsApp with your order ID or email us at hello@bloomwire.in for live delivery updates.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <a
            href="mailto:hello@bloomwire.in"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-[#2d2418]/15 text-[#2d2418] hover:border-bloom-neon hover:text-bloom-neon transition-colors"
          >
            <MailIcon size={16} /> hello@bloomwire.in
          </a>
          <a
            href="https://wa.me/message/VT4TW64X2EJKH1"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#2d2418] font-medium transition-colors"
          >
            <WhatsAppIcon size={16} /> WhatsApp Support
          </a>
        </div>
      </div>

      {/* Footer Nav Links */}
      <div className="mt-12 text-center pt-8 border-t border-[#2d2418]/10 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8a7a6a]">
        <Link to="/privacy" className="hover:text-bloom-neon transition-colors underline">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link to="/returns" className="hover:text-bloom-neon transition-colors underline">
          Returns & Refunds Policy
        </Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-bloom-neon transition-colors underline">
          Terms & Conditions
        </Link>
      </div>
    </div>
  )
}
