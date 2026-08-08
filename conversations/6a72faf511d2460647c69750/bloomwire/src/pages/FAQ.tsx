import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

export default function FAQ() {
  useSEO({ title: "Bloomwire — FAQ | Frequently Asked Questions", description: "Answers to common questions about ordering, shipping, returns, product care, rewards, referrals and the Bloomwire creator program.", canonicalPath: "/#/faq" })

  const [open, setOpen] = useState<number | null>(0)

  const categories = [
    {
      title: 'Orders & Payment',
      faqs: [
        { q: 'How do I place an order?', a: "You can order directly through our Shop page — add products to your cart and click 'Checkout.' We also accept orders via WhatsApp. Click the WhatsApp button on any page to start your order." },
        { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), and Cash on Delivery (COD). A ₹49 COD handling fee applies.' },
        { q: 'Can I use a coupon code?', a: "Yes! Enter your coupon code at checkout in the 'Apply' field. BLOOM15 gives 15% off your first order. Only one coupon per order. Coupons cannot be stacked or used on already-discounted items." },
        { q: "I placed an order but haven't received confirmation. What do I do?", a: "Check your email and WhatsApp for order confirmation. If you haven't received it within 10 minutes, email us at hello@bloomwire.in or message us on WhatsApp with your order details." },
      ],
    },
    {
      title: 'Shipping & Delivery',
      faqs: [
        { q: 'How long does delivery take?', a: 'Standard delivery: 4-7 business days (1-2 days crafting + 3-5 days shipping). Metro cities: 3-4 days. Tier 2/3: 4-6 days. Remote areas: 7-10 days. Express delivery: 2-4 business days (1-2 days crafting + 1-2 days shipping).' },
        { q: 'Do you offer free shipping?', a: 'Yes! Free shipping on orders above ₹499. Orders below ₹499 incur a flat ₹49 shipping fee.' },
        { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available for eligible pin codes across India. A ₹49 COD handling fee applies. We verify COD orders via WhatsApp/phone before dispatch.' },
        { q: 'Can I track my order?', a: "Yes! Once your order is dispatched, we send a tracking link and AWB number to your WhatsApp and email. You can also check status on our website or message us on WhatsApp." },
      ],
    },
    {
      title: 'Returns & Refunds',
      faqs: [
        { q: 'What is your return policy?', a: 'We offer a 7-day return window from delivery date. Products must be unused, in original packaging with all tags. Damaged/defective items: contact within 48 hours with photos for free replacement or full refund.' },
        { q: 'How do I return a product?', a: "Contact us on WhatsApp or email hello@bloomwire.in within 7 days of delivery with your order ID and reason. We'll provide a Return Authorization Number and shipping details." },
        { q: 'When will I get my refund?', a: 'Refunds are processed within 7-10 business days after we receive and inspect the returned item. Refunds go to your original payment method (UPI, card, bank account).' },
        { q: 'I received a damaged product. What do I do?', a: 'Notify us within 48 hours of delivery with unboxing photos/videos on WhatsApp or email. We\'ll arrange a free replacement or full refund with zero return shipping charge.' },
      ],
    },
    {
      title: 'Products & Care',
      faqs: [
        { q: 'What are Bloomwire flowers made of?', a: 'High-density velvet chenille stems with flexible inner steel cores. Each flower is hand-sculpted by artisans in our Jaipur studio — no machines, no mass production.' },
        { q: 'How long do they last?', a: "With proper care, our flowers are designed to last for years. Keep them indoors, away from water and direct sunlight. Dust gently with a soft brush. No watering or maintenance needed." },
        { q: 'Will my product look exactly like the photo?', a: "Not exactly — and that's the beauty of handcraft. Every bloom has its own unique personality with slight variations in petal shape and curve. This is a feature of handmade art, not a defect." },
        { q: 'Are they safe for children?', a: 'Our products are decorative items, not toys. They contain wire and small parts. Keep out of reach of young children. Not suitable for children under 12 years. Contains wire ends that may be sharp.' },
      ],
    },
    {
      title: 'Rewards (Petals)',
      faqs: [
        { q: 'What are Petals?', a: 'Petals are Bloomwire loyalty points. Earn 5% back on every order (1 Petal = ₹1 value). Use them to unlock complimentary products like keychains, flower stems, and potted decor.' },
        { q: 'How do I redeem Petals for complimentary products?', a: 'When your Petals balance reaches a tier milestone (200, 300, or 500 Petals), the complimentary product is added to your next qualifying order as a ₹0 item. Redemption requires a minimum qualifying order.' },
        { q: 'Do Petals expire?', a: 'Yes, Petals are valid for 12 months from the date earned. Check your Rewards page for expiring Petals.' },
        { q: 'Can I redeem Petals without making a purchase?', a: 'No. Petals redemption requires at least one qualifying order (minimum order value varies by tier: ₹200 for keychain, ₹300 for flower, ₹500 for pot).' },
        { q: 'Can I get cash instead of Petals?', a: 'No. Petals have no cash value and cannot be exchanged for cash. They can only be redeemed for complimentary products with qualifying orders.' },
      ],
    },
    {
      title: 'Referral Program',
      faqs: [
        { q: 'How does the referral program work?', a: "Share your unique referral link. When your friend makes their first purchase (₹499+), you both get ₹50 off and 50 Petals. Rewards are credited after the friend's order is delivered." },
        { q: 'Can I refer myself?', a: 'No. Self-referrals are strictly prohibited. Our system checks email addresses to prevent self-referral. Attempting to self-refer may result in account suspension.' },
        { q: 'Is there a limit to referrals?', a: 'Yes, capped at 10 successful referrals per year per user. Cancelled or returned orders reverse the referral reward.' },
      ],
    },
    {
      title: 'Creator Program',
      faqs: [
        { q: 'How do I join the Creator Program?', a: "Apply on our Creators page with your name, email, and Instagram handle. You must follow @bloomwire_ on Instagram and join our WhatsApp community. Applications are reviewed within 48 hours." },
        { q: 'What do creators get?', a: 'Approved creators get 10% back in Petals on referral sales, 20% off personal orders, early access to new products, and spotlight features on our page and Instagram.' },
        { q: 'Can I use my own creator link for personal orders?', a: 'No. Creators cannot earn commission on their own purchases. This is monitored and enforced.' },
      ],
    },
  ]

  const flatFaqs = categories.flatMap((cat, ci) => 
    cat.faqs.map((faq, fi) => ({ ...faq, category: cat.title, flatIndex: ci * 100 + fi }))
  )

  return (
    <div className="min-h-screen relative z-10 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-sm text-[#8a7a6a]">Everything you need to know about Bloomwire</p>
        </div>

        {categories.map((category, ci) => (
          <div key={ci} className="mb-8">
            <h2 className="text-sm font-medium tracking-wide text-bloom-gold uppercase mb-3">{category.title}</h2>
            <div className="space-y-2">
              {category.faqs.map((faq, fi) => {
                const flatIndex = flatFaqs.findIndex(f => f.q === faq.q && f.category === category.title)
                const isOpen = open === flatIndex
                return (
                  <div key={fi} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpen(isOpen ? null : flatIndex)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/60 transition"
                    >
                      <span className="text-sm font-medium text-[#2d2418]">{faq.q}</span>
                      <ArrowRightIcon className={`text-[#a0918a] flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={16} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 -mt-1">
                        <p className="text-sm text-[#8a7a6a] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-10 glass rounded-xl p-6 text-center">
          <p className="text-sm text-[#8a7a6a] mb-2">Still have questions?</p>
          <Link to="/contact" className="text-bloom-neon hover:underline text-sm">Contact us →</Link>
        </div>
      </div>
    </div>
  )
}
