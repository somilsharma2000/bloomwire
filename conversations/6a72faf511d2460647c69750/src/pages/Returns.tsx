import { useSEO } from '../hooks/useSEO'
import {
  ClockIcon,
  CheckCircleIcon,
  ScissorsIcon,
  WhatsAppIcon,
  CartIcon,
  TruckIcon,
  ShieldIcon,
  MailIcon,
  SparkleIcon,
  ArrowRightIcon,
  PinIcon,
} from '../components/Icons'
import { Link } from 'react-router-dom'

export default function Returns() {
  useSEO({
    title: 'Bloomwire — Returns and Refunds | Policy',
    description:
      'Bloomwire Returns and Refund Policy: 7-day return window, eligibility criteria, refund process, and cancellation terms.',
    canonicalPath: '/#/returns',
  })

  const returnSteps = [
    {
      step: '01',
      title: 'Contact Us via WhatsApp / Email',
      desc: 'Reach out to our Jaipur support team on WhatsApp or email hello@bloomwire.in within 7 days of delivery with your order ID and reason.',
    },
    {
      step: '02',
      title: 'Receive Return Authorization',
      desc: 'Our team will verify your request and provide a Return Authorization Number along with shipping details.',
    },
    {
      step: '03',
      title: 'Ship Product Back',
      desc: 'Pack the unused item securely in its original packaging and dispatch it via a trackable courier service.',
    },
    {
      step: '04',
      title: 'Inspection & Refund',
      desc: 'Once received at our Jaipur studio, we inspect the bouquet/item and initiate your refund within 7-10 business days.',
    },
  ]

  const sections = [
    {
      id: 'window',
      num: '1',
      title: 'Return Window',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            At Bloomwire™, customer satisfaction is our top priority. We offer a generous{' '}
            <strong className="text-bloom-rose font-semibold">7-Day Return Window</strong> starting from the exact date your parcel is marked delivered by our courier partner.
          </p>
          <p>
            Requests submitted after 7 calendar days from delivery cannot be accepted for return or refund.
          </p>
        </div>
      ),
    },
    {
      id: 'eligibility',
      num: '2',
      title: 'Return Eligibility',
      icon: CheckCircleIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>To qualify for a valid return and refund, the item must meet all of the following conditions:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong className="text-white font-medium">Unused Condition:</strong> The handcrafted flowers, stems, or bouquets must be brand new, unaltered, and free from signs of display or use.</li>
            <li><strong className="text-white font-medium">Original Packaging:</strong> The item must be returned with all original tags, protective wrap, gift boxes, and complementary accessories included.</li>
            <li><strong className="text-white font-medium">No Buyer Damage:</strong> The product must not be bent, cut, washed, or damaged after delivery.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'non-returnable',
      num: '3',
      title: 'Non-Returnable Items',
      icon: ScissorsIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>Due to the custom nature of artisanal pipe cleaner crafting, certain items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong className="text-white font-medium">Customized / Personalized Arrangements:</strong> Bouquets made-to-order with custom colors, initial tags, or bespoke flower counts.</li>
            <li><strong className="text-white font-medium">Opened DIY Kits:</strong> Crafting kits once the seal or internal pipe cleaner/wire bags have been opened or used.</li>
            <li><strong className="text-white font-medium">Clearance & Final Sale Items:</strong> Items explicitly marked under special clearance sales or final flash deals.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'process',
      num: '4',
      title: 'Step-by-Step Return Process',
      icon: WhatsAppIcon,
      content: (
        <div className="space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>Returning an item is simple and straightforward:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {returnSteps.map((s) => (
              <div key={s.step} className="p-4 rounded-xl glass border border-white/10 relative overflow-hidden">
                <span className="text-3xl font-bold font-serif text-white/10 absolute top-2 right-3">
                  {s.step}
                </span>
                <div className="text-xs font-bold text-bloom-gold mb-1">Step {s.step}</div>
                <h3 className="font-semibold text-white text-base mb-1">{s.title}</h3>
                <p className="text-xs text-gray-300 leading-normal">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/message/VT4TW64X2EJKH1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md"
            >
              <WhatsAppIcon size={18} /> Initiate Return via WhatsApp
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'refund-method',
      num: '5',
      title: 'Refund Method & Timeline',
      icon: CartIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            Once your returned item arrives at our Jaipur studio and passes quality verification, we will process your refund:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong className="text-white font-medium">Original Payment Method:</strong> Refunds are credited directly back to the original UPI ID, credit/debit card, or bank account used at checkout.</li>
            <li><strong className="text-white font-medium">COD Orders:</strong> For Cash on Delivery orders, our support team will contact you to collect bank account details or UPI ID for direct transfer.</li>
            <li><strong className="text-white font-medium">Processing Time:</strong> Refunds take 7–10 business days to reflect in your account depending on your banking provider.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'return-shipping',
      num: '6',
      title: 'Return Shipping Costs',
      icon: TruckIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            For standard preference returns (change of mind or wrong selection), the buyer is responsible for return shipping costs.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            If a reverse courier pickup is arranged by Bloomwire™, the return shipping fee (typically ₹70–₹120) will be deducted from your final refund amount.
          </p>
        </div>
      ),
    },
    {
      id: 'damaged',
      num: '7',
      title: 'Damaged or Defective Items',
      icon: ShieldIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            We take extreme care in packaging our pipe cleaner creations. However, if your order arrives damaged or incorrect:
          </p>
          <div className="p-4 rounded-xl bg-bloom-wine/30 border border-bloom-rose/40 text-gray-200 text-sm space-y-2">
            <p className="font-semibold text-white flex items-center gap-2">
              <SparkleIcon size={16} className="text-bloom-gold" /> 100% Bloomwire Guarantee
            </p>
            <p>
              Notify us within <strong className="text-white">48 hours of delivery</strong> with unboxing photos/videos. We will immediately arrange a complimentary replacement or issue a <strong className="text-white">full refund</strong> with <strong className="text-bloom-rose">zero return shipping charge</strong> to you!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'cancellation',
      num: '8',
      title: 'Order Cancellation Terms',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>Because each flower is individually handcrafted in Jaipur, cancellation terms depend on time elapsed:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>
              <strong className="text-white font-medium">Within 12 Hours:</strong> You can cancel your order within 12 hours of placing it by messaging us on WhatsApp or emailing hello@bloomwire.in for a full 100% refund.
            </li>
            <li>
              <strong className="text-white font-medium">After 12 Hours:</strong> Once 12 hours have passed, your item moves into hand-sculpting production or dispatch. Orders cannot be canceled mid-production, but you can initiate a standard return after delivery.
            </li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-bloom-rose/30 text-bloom-rose text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldIcon size={14} /> Hassle-Free Policies
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
          Return & Refund Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We want you to love every single stem from Bloomwire™. If something isn't right, our 7-day return policy is designed to make things simple and stress-free.
        </p>
        <p className="text-xs text-gray-500 mt-3">Handcrafted in Jaipur, India · Contact: hello@bloomwire.in</p>
      </div>

      {/* Policy Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="glass rounded-xl p-5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-bloom-wine/50 text-bloom-rose flex items-center justify-center mx-auto mb-3">
            <ClockIcon size={20} />
          </div>
          <h3 className="font-bold text-white text-base mb-1">7-Day Return Window</h3>
          <p className="text-xs text-gray-400">Request returns within 7 calendar days from delivery date.</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-bloom-wine/50 text-bloom-gold flex items-center justify-center mx-auto mb-3">
            <ShieldIcon size={20} />
          </div>
          <h3 className="font-bold text-white text-base mb-1">Damaged Protection</h3>
          <p className="text-xs text-gray-400">Free replacement or 100% refund for transit damages within 48h.</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/10 text-center">
          <div className="w-10 h-10 rounded-full bg-bloom-wine/50 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <WhatsAppIcon size={20} />
          </div>
          <h3 className="font-bold text-white text-base mb-1">WhatsApp Support</h3>
          <p className="text-xs text-gray-400">Quick authorization and help via our official WhatsApp channel.</p>
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
              className="glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
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
        <h3 className="text-lg font-serif font-bold text-white mb-2">Need help with a return or order issue?</h3>
        <p className="text-xs sm:text-sm text-gray-300 mb-4 max-w-xl mx-auto">
          Our customer care team in Jaipur is ready to assist you via email or WhatsApp message.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <a
            href="mailto:hello@bloomwire.in"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/20 text-white hover:border-bloom-neon hover:text-bloom-neon transition-colors"
          >
            <MailIcon size={16} /> Email Support (hello@bloomwire.in)
          </a>
          <a
            href="https://wa.me/message/VT4TW64X2EJKH1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            <WhatsAppIcon size={16} /> WhatsApp Chat
          </a>
        </div>
      </div>

      {/* Footer Nav Links */}
      <div className="mt-12 text-center pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
        <Link to="/privacy" className="hover:text-bloom-neon transition-colors underline">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-bloom-neon transition-colors underline">
          Terms & Conditions
        </Link>
        <span>·</span>
        <Link to="/shipping" className="hover:text-bloom-neon transition-colors underline">
          Shipping Policy
        </Link>
      </div>
    </div>
  )
}
