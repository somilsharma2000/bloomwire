import { useSEO } from '../hooks/useSEO'
import {
  ShieldIcon,
  MailIcon,
  WhatsAppIcon,
  SparkleIcon,
} from '../components/Icons'
import { Link } from 'react-router-dom'

export default function Returns() {
  useSEO({
    title: 'Bloomwire — Returns & Refunds Policy',
    description: 'Bloomwire Returns & Refunds Policy: All handcrafted items are final sale. Replacements available for transit-damaged products only.',
    canonicalPath: '/#/returns',
  })

  const sections = [
    {
      id: 'no-returns',
      title: 'All Sales Are Final',
      icon: ShieldIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            At Bloomwire™, every bouquet and DIY kit is <strong className="text-bloom-rose font-semibold">handcrafted to order</strong> — individually twisted, assembled, and quality-checked by our artisans in Jaipur. Because each piece is made specifically for you, <strong className="text-[#2d2418] font-medium">all sales are final and we do not accept returns or exchanges for change of mind.</strong>
          </p>
          <p>
            This policy applies to all products across our catalogue, including ready-made arrangements, DIY craft kits, and custom orders.
          </p>
        </div>
      ),
    },
    {
      id: 'damage-replacement',
      title: 'Transit Damage Replacement',
      icon: ShieldIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            If your order arrives damaged during shipping, we've got you covered. We offer <strong className="text-bloom-neon font-semibold">free replacement</strong> for items damaged in transit, subject to the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">Report within 48 hours:</strong> Contact us within 48 hours of delivery with a clear photo of the damaged product and packaging.</li>
            <li><strong className="text-[#2d2418] font-medium">Original packaging:</strong> Keep the original box and packing materials for verification.</li>
            <li><strong className="text-[#2d2418] font-medium">Replacement only:</strong> We will send a replacement of the same product. No cash refunds.</li>
          </ul>
          <p>
            To request a damage replacement, reach out via WhatsApp or email with your order ID and a photo of the damage.
          </p>
        </div>
      ),
    },
    {
      id: 'cancellation',
      title: 'Order Cancellation',
      icon: SparkleIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Orders can be cancelled <strong className="text-[#2d2418] font-medium">within 12 hours of placement</strong> for a full refund. Once production has begun (after 12 hours), cancellation is no longer possible as materials and artisan time have already been committed.
          </p>
          <p>
            To cancel an order, contact us immediately via WhatsApp or email with your order ID.
          </p>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: MailIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>For any questions about our returns policy, damaged items, or order cancellations:</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="https://wa.me/message/VT4TW64X2EJKH1"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-bloom-neon/30 text-bloom-neon hover:bg-bloom-neon/10 transition text-sm font-medium"
            >
              <WhatsAppIcon size={16} /> WhatsApp Us
            </a>
            <a
              href="mailto:hello@bloomwire.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-[#2d2418]/15 text-[#2d2418] hover:bg-white/70 transition text-sm font-medium"
            >
              <MailIcon size={16} /> hello@bloomwire.in
            </a>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F3] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-bloom-rose/20 text-bloom-rose text-xs font-medium mb-4">
            <ShieldIcon size={14} /> Returns & Refunds Policy
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2d2418] mb-4">
            Returns & <span className="gradient-text">Refunds</span>
          </h1>
          <p className="text-[#8a7a6a] max-w-2xl mx-auto">
            Handcrafted with care, made just for you. Please read our policy carefully before placing your order.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon
            return (
              <div
                key={section.id}
                className="glass rounded-2xl border border-[#2d2418]/10 p-6 sm:p-8 hover:border-bloom-neon/30 transition duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-bloom-rose/10 border border-bloom-rose/20 flex items-center justify-center text-bloom-rose shrink-0">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2d2418]">
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-[#a0918a]">
            This policy is part of Bloomwire's{' '}
            <Link to="/terms" className="text-bloom-neon hover:underline">Terms & Conditions</Link>
            {' '}and may be updated from time to time.
          </p>
        </div>
      </div>
    </div>
  )
}
