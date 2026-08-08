import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

export default function FAQ() {
  useSEO({
    title: "Bloomwire — FAQ | Frequently Asked Questions",
    description: "Answers to common questions about ordering, shipping, replacements, product care, rewards, account settings, and creator program.",
    canonicalPath: "/#/faq",
  })

  const [open, setOpen] = useState<number | null>(0)

  const categories = [
    {
      title: 'Orders & Payment',
      faqs: [
        {
          q: 'How do I place an order?',
          a: 'Ordering is simple! Browse our Shop, select your desired handcrafted flowers or arrangements, add them to your cart, and proceed to checkout. You can also place an order directly via WhatsApp by clicking the WhatsApp button on any product page.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay via Razorpay), and Cash on Delivery (COD). A ₹49 handling fee applies for COD orders.',
        },
        {
          q: 'Can I use a coupon code?',
          a: "Yes! Enter your coupon code at checkout in the 'Apply' field. Use code BLOOM15 to get 15% off your first order. Only one coupon code can be applied per order (coupons cannot be stacked).",
        },
        {
          q: 'How do I know my order is confirmed?',
          a: 'Once your order is placed, you will receive an instant order confirmation via email and WhatsApp containing your order ID and summary.',
        },
      ],
    },
    {
      title: 'Shipping & Delivery',
      faqs: [
        {
          q: 'What are your shipping timelines?',
          a: 'All Bloomwire creations are hand-sculpted in our Jaipur studio. Timelines include crafting time: Standard Delivery takes 4–7 business days total (1–2 days crafting + 3–5 days shipping, FREE on orders over ₹499). Express Delivery takes 2–4 business days total (1–2 days crafting + 1–2 days shipping, +₹99).',
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! Tracking is provided for all orders. As soon as your order is dispatched, a tracking link and AWB number are sent to your email and WhatsApp.',
        },
        {
          q: 'Is Cash on Delivery (COD) available?',
          a: 'Yes, COD is available for eligible pin codes across India with a ₹49 COD handling fee. COD orders are verified via WhatsApp/phone before dispatch.',
        },
        {
          q: 'Does Express Delivery mean faster crafting?',
          a: 'No. Express delivery (+₹99) means faster shipping transit times with premium courier partners, NOT faster crafting. Crafting requires 1–2 business days as every piece is individually handcrafted.',
        },
      ],
    },
    {
      title: 'Returns & Replacements',
      faqs: [
        {
          q: 'What is your replacement policy?',
          a: 'We offer a 7-day replacement policy (NOT returns or refunds for general preference — because our items are handmade, open/dispatched items cannot be resold).',
        },
        {
          q: 'What situations qualify for a replacement?',
          a: 'Replacements are provided for manufacturing defects, wrong items received, or damage in transit when reported within 7 days of delivery.',
        },
        {
          q: 'What items are NOT eligible for replacement?',
          a: 'We do NOT offer replacements or returns for change of mind, custom or personalized orders, or items that have been used or displayed.',
        },
        {
          q: 'What is the refund timeline if a replacement is unavailable?',
          a: 'If a replacement cannot be provided or an order is cancelled before crafting, refunds are processed to your original payment method within 7–10 business days.',
        },
        {
          q: 'How do I request a replacement?',
          a: 'Email hello@bloomwire.in within 7 days of delivery with your order ID and photos/videos of the damaged or wrong item.',
        },
      ],
    },
    {
      title: 'Petals & Rewards',
      faqs: [
        {
          q: 'How do I earn Petals?',
          a: 'You earn 5% of your subtotal in Petals on every order (1 Petal = ₹1 value). You can also earn Petals through daily check-ins (5–75 Petals), submitting product reviews (10 Petals), and referring friends.',
        },
        {
          q: 'What are the Petals reward tiers?',
          a: 'Our tiers are: Bronze Tier (500 Petals = 5% discount voucher), Silver Tier (1000 Petals = 10% discount voucher), and Gold Tier (2000 Petals = free product + 15% discount voucher).',
        },
        {
          q: 'Do Petals expire?',
          a: 'Yes, Petals expire 12 months from the date they are earned.',
        },
        {
          q: 'How can I redeem my Petals?',
          a: 'Petals can be redeemed at checkout for discount vouchers, free gift products, or entry into promotional raffle giveaways.',
        },
      ],
    },
    {
      title: 'Product Care',
      faqs: [
        {
          q: 'How do I clean my Bloomwire flowers?',
          a: 'Clean your velvet chenille flowers gently using a soft brush or compressed air to dust off particles. Do not wash or submerge in water.',
        },
        {
          q: 'Where should I display my flowers?',
          a: 'Display your flowers indoors, away from direct sunlight and moisture to prevent color fading and keep the velvet stems pristine.',
        },
        {
          q: 'Are there any safety warnings?',
          a: 'Bloomwire items are decorative objects, not toys. For children under 12, supervision is advised as flexible wire ends inside stems may be sharp if exposed.',
        },
      ],
    },
    {
      title: 'Account',
      faqs: [
        {
          q: 'How do I create a Bloomwire account?',
          a: 'Click on the Profile/Account icon in the header, select Sign Up, and enter your email address to register your account.',
        },
        {
          q: 'How do I log in to my account?',
          a: 'Click the Profile icon and sign in with your registered email and password.',
        },
        {
          q: 'How do I update my account information?',
          a: 'Log in and visit your Profile page to update your personal information, contact details, and saved delivery addresses.',
        },
      ],
    },
    {
      title: 'Referral & Creator Program',
      faqs: [
        {
          q: 'How does the referral program work?',
          a: 'Share your unique referral link. When your friend completes their first order (₹499+), both of you get ₹50 off and 50 Petals after delivery.',
        },
        {
          q: 'How do I join the Creator Program?',
          a: 'Apply on our Creators page with your Instagram handle. Approved creators get 10% back in Petals on referral sales and 20% off personal orders.',
        },
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
          <p className="text-sm text-gray-400">Everything you need to know about Bloomwire</p>
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
                      className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/5 transition"
                    >
                      <span className="text-sm font-medium text-white">{faq.q}</span>
                      <ArrowRightIcon className={`text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={16} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 -mt-1">
                        <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-10 glass rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-2">Still have questions?</p>
          <Link to="/contact" className="text-bloom-neon hover:underline text-sm">Contact us →</Link>
        </div>
      </div>
    </div>
  )
}
