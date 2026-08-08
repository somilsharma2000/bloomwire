import { ShieldIcon } from '../components/Icons'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

export default function Terms() {
  useSEO({ title: "Bloomwire — Terms and Conditions | Legal", description: "Bloomwire Terms and Conditions, Privacy Policy, Returns Policy, and Shipping Policy. Full legal compliance for your peace of mind.", canonicalPath: "/#/terms" })

  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'returns' | 'shipping'>('terms')

  const tabs = [
    { id: 'terms' as const, label: 'Terms & Conditions' },
    { id: 'privacy' as const, label: 'Privacy Policy' },
    { id: 'returns' as const, label: 'Returns & Refunds' },
    { id: 'shipping' as const, label: 'Shipping Policy' },
  ]

  const termsSections = [
    { title: '1. Introduction', content: "Welcome to Bloomwire ('we,' 'us,' 'our'), a brand operated by Somil Sharma (Proprietor), a business registered at Jaipur, Rajasthan, India,  These Terms and Conditions ('Terms') govern your use of our website and your purchase of products from us. By accessing the Site or placing an order, you agree to be bound by these Terms." },
    { title: '2. Definitions', content: "'Products' refers to handcrafted pipe cleaner flower arrangements, bouquets, DIY kits, keychains, and related items. 'Petals' refers to loyalty points earned through the Bloomwire Rewards program. 'Order' refers to a request to purchase Products. 'User' refers to any individual who visits or uses the Site." },
    { title: '3. Account Registration', content: "To access certain features (Rewards, Creators, Checkout), you must register with accurate information. You are responsible for maintaining account confidentiality. You must be 18+ or have parental consent. Creating multiple accounts to exploit bonuses, referral rewards, or coupons is prohibited and will result in suspension and forfeiture of all Petals." },
    { title: '4. Orders & Acceptance', content: "All orders constitute offers to purchase. An order is confirmed only when we send confirmation. We reserve the right to refuse or cancel orders due to pricing errors, technical glitches, suspected fraud, or stock unavailability. Pricing Errors: If a product is listed at an incorrect price, we reserve the right to cancel and issue a full refund." },
    { title: '5. Coupons & Discounts', content: "Coupon codes (including BLOOM15) are valid for first-time customers only, single use per customer, non-transferable. Only one coupon per order — stacking is not permitted. Coupons cannot apply to already-discounted items. Abuse of coupon codes will result in order cancellation, account suspension, and forfeiture of rewards." },
    { title: '6. Shipping', content: "Free shipping on orders ₹499+. Orders below ₹499 incur ₹49 shipping. Handcrafted to order (1-2 days crafting) then dispatched from Jaipur. Metro: 3-5 days, Tier 2/3: 5-7 days, Remote: 7-10 days. If a partial return drops the remaining order below ₹499, shipping charges will be deducted from the refund." },
    { title: '7. Returns & Refunds', content: "All sales are final. As each product is handcrafted to order, we do not accept returns or exchanges for change of mind. Transit damage: contact within 48 hours with photos for a free replacement (same product only, no cash refunds). Order cancellation: within 12 hours of placing the order for a full refund. After 12 hours, production has begun and cancellation is not possible." },
    { title: '8. Bloomwire Rewards (Petals)', content: "Petals are loyalty points with no cash value. Earning rate: 5% of order value (1 Petal = ₹1 redemption value). Petals are valid for 12 months from date earned. Redemption requires at least one completed purchase (₹499+). Complimentary reward products require a qualifying order: 200 Petals (keychain) → min order ₹200, 300 Petals (flower) → min order ₹300, 500 Petals (pot) → min order ₹500. Reward products are not shipped standalone — they are added to the qualifying order as a ₹0 line item. We reserve the right to modify rates and tiers with 30 days notice." },
    { title: '9. Referral Program', content: "Share your unique referral link. When a referred friend completes their first order (₹499+), both get ₹50 off + 50 Petals. Self-referrals prohibited. Capped at 10 successful referrals per year. Rewards credited after friend's order is delivered. Cancelled/returned orders reverse the reward." },
    { title: '10. Creator Program', content: "Application does not guarantee acceptance — reviewed within 48 hours. Minimum: 500+ Instagram followers. Approved creators get 20% off personal orders + 10% in Petals on referral sales. Cannot earn commission on own purchases. Social share rewards capped at 1 per week. Posts must tag @bloomwire_ and be verified." },
    { title: '11. Product Descriptions & Disclaimers', content: "Products are handcrafted — slight variations in size, shape, and color are natural, not defects. Colors may vary due to monitor settings and photography. Products are designed to last for years with proper care. We do not guarantee indefinite durability. Reviews represent individual experiences, not guarantees." },
    { title: '12. Promotional Giveaways (Raffles)', content: "Bloomwire conducts promotional giveaways. No purchase is necessary to enter — alternative free entry available by emailing hello@bloomwire.in with 'Raffle Entry' in the subject line. Giveaways are void where prohibited by law. Winners selected randomly and notified by email/WhatsApp. Prizes are non-transferable and cannot be exchanged for cash." },
    { title: '13. Intellectual Property', content: "All content — text, images, logos, designs, 'Bloomwire' brand — is property of Somil Sharma (Proprietor) and protected under Indian copyright and trademark laws. User-generated content may be used for marketing unless the user objects in writing." },
    { title: '14. Limitation of Liability & Indemnity', content: "Bloomwire is not liable for indirect, incidental, or punitive damages. Total liability for any claim shall not exceed the amount paid for the Product(s) in question. Products are decorative items, not toys — keep out of reach of young children." },
    { title: '15. Grievance Redressal', content: "Grievance Officer: Somil Sharma, Email: hello@bloomwire.in, Phone: +91 94140 27836, Working Hours: Mon–Sat, 10 AM–6 PM IST. Grievances acknowledged within 48 hours, resolved within 30 days per Consumer Protection (E-Commerce) Rules, 2020. Unresolved complaints may be taken to the Consumer Disputes Redressal Commission or National Consumer Helpline (1915)." },
    { title: '16. Governing Law', content: "These Terms are governed by the laws of India. All disputes subject to the exclusive jurisdiction of courts in Jaipur, Rajasthan. Parties shall attempt good-faith negotiation for 30 days before legal proceedings." },
    { title: '17. Changes to Terms', content: "We reserve the right to modify these Terms at any time. Updated Terms will be posted with the updated date. Continued use constitutes acceptance." },
    { title: '18. Contact', content: "Email: hello@bloomwire.in · Address: Jaipur, Rajasthan, India" },
  ]

  const privacySections = [
    { title: '1. Introduction', content: "This Privacy Policy describes how Bloomwire collects, uses, stores, and protects your personal data, in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act)." },
    { title: '2. Data We Collect', content: "Account Data: Name, email, phone number. Order Data: Shipping address, order history, payment info (processed securely — we do not store card details). Communication Data: Messages via contact form, WhatsApp, or email. Usage Data: Pages visited, referral links (via cookies and local storage). Rewards Data: Petal balance, check-in streak, referral history." },
    { title: '3. How We Use Your Data', content: "To process and fulfill orders. To manage your account and Rewards/Creator program. To communicate about orders, promotions, and updates. To prevent fraud and Rewards abuse. To respond to inquiries and grievances." },
    { title: '4. Legal Basis', content: "Consent: You provide consent when registering, placing an order, or subscribing. Contractual Necessity: Data necessary to fulfill orders and provide Rewards. Legal Obligation: Data required by law (tax records, GST compliance)." },
    { title: '5. Data Sharing', content: "Courier Partners: Name, address, phone for delivery. Payment Gateway: Payment data processed securely (e.g., Razorpay) — we don't store cards. WhatsApp: Orders via WhatsApp are processed through WhatsApp/WhatsApp Business. We do not sell, rent, or trade personal data." },
    { title: '6. Data Retention', content: "Account data: Duration of account + 3 years for legal/tax compliance. Order data: 7 years (GST/tax laws). Rewards data: 12 months after last Petal expires." },
    { title: '7. Your Rights (DPDP Act 2023)', content: "Access: Request a copy of your data. Correction: Request correction of inaccurate data. Erasure: Request deletion (subject to legal retention). Grievance: File with our Grievance Officer. Withdraw Consent: Contact hello@bloomwire.in." },
    { title: '8. Cookies & Local Storage', content: "We use cookies and local storage to remember your cart, Petal balance, and login session. We do not use third-party tracking cookies for advertising. Disabling cookies may affect functionality." },
    { title: '9. Data Security', content: "We take reasonable measures including encrypted storage and access controls. In case of a data breach, we will notify affected users and authorities within 72 hours per DPDP Act." },
    { title: '10. Children\'s Privacy', content: "Our Site is intended for users 18+. We do not knowingly collect data from minors. Contact us for immediate deletion if a minor has provided data." },
    { title: '11. WhatsApp Data', content: "When you order via WhatsApp, your name, address, phone, and order details are processed through WhatsApp. WhatsApp's privacy policy applies to data on their platform. By ordering via WhatsApp, you consent to our Privacy Policy." },
    { title: '12. Contact', content: "For privacy questions: hello@bloomwire.in · Grievance Officer: Somil Sharma, hello@bloomwire.in, +91 94140 27836, Mon-Sat 10am-6pm IST" },
  ]

  const returnsSections = [
    { title: '1. All Sales Final', content: "All sales are final. Each product is handcrafted to order and cannot be returned or exchanged for change of mind." },
    { title: '2. Transit Damage Replacement', content: "If your order arrives damaged during shipping, contact us within 48 hours with a clear photo for a free replacement of the same product. Original packaging must be retained for verification." },
    { title: '3. Non-Returnable Items', content: "Customized or personalized products. Opened or partially used DIY kits. Items marked 'Final Sale' or 'Clearance.' Products returned after the 7-day window." },
    { title: '4. How to Initiate a Return', content: "Email hello@bloomwire.in with: Order number, Product name, Reason for return, Photos (if damaged/defective). We will arrange reverse pickup within 3-5 business days." },
    { title: '5. Refund Processing', content: "Refunds processed within 7-10 business days after inspection. Credited to original payment method (online: same account/card/UPI; COD: via UPI or bank transfer). If free shipping was applied and return drops remaining order below ₹499, shipping will be deducted from refund." },
    { title: '6. Damaged/Defective Products', content: "Contact within 48 hours of delivery with photos. Free replacement or full refund — your choice. No return shipping cost for damaged/defective items." },
    { title: '7. Exchange', content: "Available for different color or product of equal/lesser value. For higher value, pay the difference. Contact within 7 days of delivery." },
    { title: '8. Cancellation', content: "Orders can be cancelled before dispatch (within 12 hours of placing). Once dispatched, orders cannot be cancelled but can be returned after delivery. Prepaid cancellations refunded within 7 business days." },
  ]

  const shippingSections = [
    { title: '1. Shipping Areas', content: "We ship across India. International shipping is not available at this time." },
    { title: '2. Shipping Charges', content: "Orders ₹499 and above: FREE shipping. Orders below ₹499: ₹49 shipping. COD: Additional ₹30 handling fee (where available)." },
    { title: '3. Dispatch Time', content: "Orders dispatched within 24-48 hours of confirmation from our Jaipur studio (Mon–Sat, excluding public holidays)." },
    { title: '4. Estimated Delivery', content: "Metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune): 3-5 business days. Tier 2/3 cities: 7-10 business days. Remote/rural areas: 7-10 business days. These are estimates — actual time depends on courier and location." },
    { title: '5. Tracking', content: "All orders receive a tracking number via email/WhatsApp once dispatched." },
    { title: '6. Failed Deliveries', content: "If delivery is attempted 3 times and fails (wrong address, unavailable, refused), the order will be returned to our studio. Refund issued after deducting return shipping (₹49)." },
    { title: '7. Address Accuracy', content: "Please ensure your delivery address and pin code are correct. We are not responsible for delays or failed deliveries due to incorrect addresses." },
    { title: '8. Shipping on Returns', content: "Return shipping for damaged/defective products: borne by Bloomwire (free reverse pickup). Return shipping for change-of-mind: borne by the customer unless we offer free pickup for a promotion." },
  ]

  const sections = activeTab === 'terms' ? termsSections : activeTab === 'privacy' ? privacySections : activeTab === 'returns' ? returnsSections : shippingSections

  return (
    <div className="min-h-screen relative z-10 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center mb-4 neon-glow">
            <ShieldIcon className="text-[#2d2418]" size={24} />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">
            {activeTab === 'terms' && 'Terms & Conditions'}
            {activeTab === 'privacy' && 'Privacy Policy'}
            {activeTab === 'returns' && 'Returns & Refund Policy'}
            {activeTab === 'shipping' && 'Shipping Policy'}
          </h1>
          <p className="text-sm text-[#a0918a]">Last Updated: August 7, 2026</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white'
                  : 'glass text-[#8a7a6a] hover:text-[#2d2418]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="glass rounded-xl p-5 sm:p-6">
              <h2 className="font-semibold text-[#2d2418] mb-2 text-sm sm:text-base">{section.title}</h2>
              <p className="text-sm text-[#8a7a6a] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 glass rounded-xl p-5 text-center">
          <p className="text-xs text-[#a0918a]">
            Questions? Email us at{' '}
            <a href="mailto:hello@bloomwire.in" className="text-bloom-neon hover:underline">hello@bloomwire.in</a>
          </p>
          <p className="text-xs text-[#a0918a] mt-2">
            Grievance Officer: Somil Sharma · hello@bloomwire.in · Mon–Sat, 10 AM–6 PM IST · Grievances resolved within 30 days per E-Commerce Rules 2020
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-bloom-neon hover:underline text-sm">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
