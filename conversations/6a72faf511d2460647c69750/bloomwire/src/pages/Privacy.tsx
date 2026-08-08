import { useSEO } from '../hooks/useSEO'
import {
  ShieldIcon,
  LockIcon,
  UserIcon,
  MailIcon,
  CheckCircleIcon,
  PetalIcon,
  SparkleIcon,
  ClockIcon,
  EyeIcon,
  PinIcon,
} from '../components/Icons'
import { Link } from 'react-router-dom'

export default function Privacy() {
  useSEO({
    title: 'Bloomwire — Privacy Policy | Data Protection',
    description:
      'Bloomwire Privacy Policy: how we collect, use, and protect your personal data. GDPR and Indian data protection compliant.',
    canonicalPath: '/#/privacy',
  })

  const sections = [
    {
      id: 'collect',
      num: '1',
      title: 'Information We Collect',
      icon: UserIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            When you interact with Bloomwire™, we collect several types of information to provide you with an exceptional handcrafted floral shopping experience:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li>
              <strong className="text-[#2d2418] font-medium">Personal & Contact Details:</strong> Your full name, email address, phone number, and delivery address provided during registration or checkout.
            </li>
            <li>
              <strong className="text-[#2d2418] font-medium">Order History:</strong> Details of handcrafted flower bouquets, DIY kits, custom arrangements, and accessories you have purchased.
            </li>
            <li>
              <strong className="text-[#2d2418] font-medium">Petals Balance & Rewards Activity:</strong> Information regarding your loyalty points (Petals), daily check-in streaks, reward redemptions, and referral participation.
            </li>
            <li>
              <strong className="text-[#2d2418] font-medium">Browsing & Technical Data:</strong> IP address, device type, browser specifications, pages visited, and interaction timestamps.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'use',
      num: '2',
      title: 'How We Use Information',
      icon: SparkleIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>We utilize the collected information for specific, legitimate operational purposes:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">Order Fulfillment:</strong> Processing transactions, crafting made-to-order items, and dispatching packages to your address.</li>
            <li><strong className="text-[#2d2418] font-medium">Customer Communication:</strong> Sending order confirmations, WhatsApp tracking updates, delivery notifications, and customer support responses.</li>
            <li><strong className="text-[#2d2418] font-medium">Rewards & Creator Programs:</strong> Calculating Petals, applying discounts, verifying referral actions, and managing creator payouts.</li>
            <li><strong className="text-[#2d2418] font-medium">Analytics & Improvements:</strong> Understanding popular arrangements and enhancing website navigation and overall user experience.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'sharing',
      num: '3',
      title: 'Information Sharing',
      icon: ShieldIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Bloomwire™ strictly respects your privacy. <strong className="text-bloom-rose font-medium">We do not sell, rent, or trade your personal data to third parties under any circumstances.</strong>
          </p>
          <p>We only share essential information with trusted logistics and processing partners:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">Couriers for Shipping:</strong> Delivery partners (e.g. Delhivery, Bluedart, Speed Post) receive your name, address, and phone number exclusively for shipping your parcel.</li>
            <li><strong className="text-[#2d2418] font-medium">Payment Processors:</strong> PCI-DSS compliant gateways (such as Razorpay) process card, UPI, or net banking credentials securely. Bloomwire™ does not store sensitive card or banking credentials on our servers.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'security',
      num: '4',
      title: 'Data Security',
      icon: LockIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            We implement appropriate technical and organizational measures—including TLS encryption for data in transit—to protect your personal information against unauthorized access, loss, or alteration. Customer data is stored securely with our infrastructure providers.
          </p>
          <p className="text-xs sm:text-sm text-[#8a7a6a] italic">
            Note: While we adhere to strict industry safety standard requirements, no transmission method over the Internet or electronic storage system is 100% immune from security breaches. We maintain reasonable security measures but cannot guarantee absolute security.
          </p>
        </div>
      ),
    },
    {
      id: 'cookies',
      num: '5',
      title: 'Cookie Usage',
      icon: PetalIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Cookies and local browser storage help our e-commerce platform remember your preferences and cart contents:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">Essential Cookies:</strong> Required to maintain your active login session, cart items, and wishlist preferences.</li>
            <li><strong className="text-[#2d2418] font-medium">Analytics Cookies:</strong> Help us measure site traffic patterns and popular flower categories without identifying individual visitors.</li>
          </ul>
          <p>
            You can configure your web browser settings to block or notify you about cookies. Note that disabling essential cookies may impact cart functionality and account logins.
          </p>
        </div>
      ),
    },
    {
      id: 'analytics',
      num: '6',
      title: 'Google Analytics',
      icon: EyeIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            We use Google Analytics (GA4) to understand visitor traffic and site interaction trends. GA4 collects data with IP anonymization enabled by default, ensuring your geographic IP information is obscured.
          </p>
          <p>
            You can opt out of Google Analytics tracking across all websites by installing the Google Analytics Opt-out Browser Add-on provided by Google.
          </p>
        </div>
      ),
    },
    {
      id: 'gallery',
      num: '7',
      title: 'Gallery Photos',
      icon: SparkleIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            When customers upload unboxing photos, flower arrangement showcases, or customer showcase images to our Gallery, these images are stored on secure cloud infrastructure.
          </p>
          <p>
            You retain ownership of your photos. You can request immediate removal of any photo you uploaded at any time by emailing us at{' '}
            <a href="mailto:hello@bloomwire.in" className="text-bloom-rose underline hover:text-[#2d2418] transition-colors">
              hello@bloomwire.in
            </a>.
          </p>
        </div>
      ),
    },
    {
      id: 'rights',
      num: '8',
      title: 'User Rights',
      icon: CheckCircleIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            In accordance with applicable privacy regulations (including Indian Digital Personal Data Protection laws), you possess the following rights regarding your data:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6b5d4f]">
            <li><strong className="text-[#2d2418] font-medium">Right to Access:</strong> Request a digital summary of the personal data we store about you.</li>
            <li><strong className="text-[#2d2418] font-medium">Right to Correction:</strong> Request updates or corrections to incomplete or inaccurate personal records.</li>
            <li><strong className="text-[#2d2418] font-medium">Right to Deletion:</strong> Request permanent deletion of your account and personal details.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:hello@bloomwire.in" className="text-bloom-neon font-medium underline hover:text-[#2d2418] transition-colors">
              hello@bloomwire.in
            </a>.
          </p>
        </div>
      ),
    },
    {
      id: 'retention',
      num: '9',
      title: 'Data Retention',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            We retain personal data only for as long as needed to fulfill order operations or satisfy mandatory legal, accounting, and GST tax compliance periods in India.
          </p>
          <p>
            When data is no longer required or upon verified user request, we securely delete or anonymize your records where legally permissible.
          </p>
        </div>
      ),
    },
    {
      id: 'children',
      num: '10',
      title: "Children's Privacy",
      icon: ShieldIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            Bloomwire™ is not directed at or designed for children under 18 years of age. We do not knowingly collect personal data from minors.
          </p>
          <p>
            If a parent or guardian discovers that a child under 18 has submitted personal information without consent, please contact us at{' '}
            <a href="mailto:hello@bloomwire.in" className="text-bloom-rose underline hover:text-[#2d2418] transition-colors">
              hello@bloomwire.in
            </a>{' '}
            for immediate deletion.
          </p>
        </div>
      ),
    },
    {
      id: 'changes',
      num: '11',
      title: 'Changes to Policy',
      icon: ClockIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in legal mandates, technology, or business practices.
          </p>
          <p>
            Any updates will be posted on this page with an updated modification date. Continued usage of Bloomwire™ following posted updates signifies your agreement.
          </p>
        </div>
      ),
    },
    {
      id: 'contact',
      num: '12',
      title: 'Contact & Grievances',
      icon: MailIcon,
      content: (
        <div className="space-y-3 text-[#6b5d4f] leading-relaxed text-sm sm:text-base">
          <p>
            For privacy inquiries, data access requests, or grievance concerns under Indian E-Commerce and DPDP laws, please reach out to our team:
          </p>
          <div className="p-4 rounded-xl glass border border-[#2d2418]/10 space-y-2 text-sm mt-3">
            <p className="font-semibold text-[#2d2418]">Bloomwire™ Grievance Redressal</p>
            <p className="text-[#6b5d4f] flex items-center gap-2">
              <MailIcon size={16} className="text-bloom-rose" /> Email:{' '}
              <a href="mailto:hello@bloomwire.in" className="text-bloom-neon hover:underline">
                hello@bloomwire.in
              </a>
            </p>
            <p className="text-[#6b5d4f] flex items-center gap-2">
              <PinIcon size={16} className="text-bloom-rose" /> Location: Jaipur, Rajasthan, India
            </p>
            <p className="text-xs text-[#8a7a6a] pt-1">
              Working Hours: Mon–Sat, 10:00 AM – 6:00 PM IST (Grievances acknowledged within 48 hours)
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-bloom-rose/30 text-bloom-rose text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldIcon size={14} /> Legal & Data Security
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2d2418] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-[#8a7a6a] max-w-2xl mx-auto leading-relaxed">
          At Bloomwire™, we value your trust and are committed to safeguarding your personal data. Here is a transparent breakdown of how your information is collected, used, and protected.
        </p>
        <p className="text-xs text-[#a0918a] mt-3">Last Updated: August 2026 · Jaipur, Rajasthan, India</p>
      </div>

      {/* Table of Contents Quick Nav */}
      <div className="glass rounded-2xl p-6 border border-[#2d2418]/10 mb-10">
        <h2 className="text-xs font-semibold text-bloom-gold uppercase tracking-wider mb-4 flex items-center gap-2">
          <SparkleIcon size={14} /> Policy Highlights & Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-[#6b5d4f]">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors hover:text-bloom-neon truncate"
            >
              <span className="w-5 h-5 rounded-full bg-white/70 text-[#2d2418] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {sec.num}
              </span>
              <span className="truncate">{sec.title}</span>
            </a>
          ))}
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
              className="glass rounded-2xl p-6 sm:p-8 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition-all duration-300 scroll-mt-24"
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

      {/* Footer Navigation Back to Terms */}
      <div className="mt-12 text-center pt-8 border-t border-[#2d2418]/10 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8a7a6a]">
        <Link to="/terms" className="hover:text-bloom-neon transition-colors underline">
          Terms & Conditions
        </Link>
        <span>·</span>
        <Link to="/returns" className="hover:text-bloom-neon transition-colors underline">
          Returns & Refunds Policy
        </Link>
        <span>·</span>
        <Link to="/shipping" className="hover:text-bloom-neon transition-colors underline">
          Shipping Policy
        </Link>
      </div>
    </div>
  )
}
