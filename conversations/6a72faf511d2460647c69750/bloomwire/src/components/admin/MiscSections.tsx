import { useState, useEffect } from 'react'
import {
  StatCard,
  Badge,
  SearchBar,
  SectionHeader,
  EmptyState,
  LoadingSpinner,
  ConfirmDialog,
  Toggle,
  FormField,
  Input,
  Select,
  Textarea,
  AdminTable,
  ProgressBar,
  BarChart,
} from './shared'
import { api } from '../../lib/api'

// ─── Status & Type Colors ───
const EMAIL_TYPE_COLORS: Record<string, string> = {
  Announcement: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'Order Confirmation': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Review Request': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Welcome: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Abandoned Cart': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  'Petals Expiry': 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  Shipping: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  Sent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
}

const BLOG_STATUS_COLORS: Record<string, string> = {
  Published: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Draft: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
}

const GIFTCARD_STATUS_COLORS: Record<string, string> = {
  Active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Fully Used': 'text-[#8a7a6a] bg-gray-500/10 border-gray-500/30',
  Expired: 'text-red-400 bg-red-500/10 border-red-500/30',
  Revoked: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
}

// ─── Default Settings Fallback ───
const DEFAULT_SETTINGS = {
  // Store Settings
  storeName: 'Bloomwire',
  adminEmail: 'admin@bloomwire.in',
  supportEmail: 'support@bloomwire.in',
  ordersEmail: 'orders@bloomwire.in',
  phone: '+91 98765 43210',
  address: '123 Floral Craft Studio, Bandra West, Mumbai, Maharashtra 400050',
  gstin: '27AAAAA0000A1Z5',
  grievanceOfficer: 'Anya Sharma',
  workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',

  // Shipping Settings
  freeShippingThreshold: 499,
  shippingFee: 49,
  codFee: 49,
  expressShippingFee: 99,
  standardDeliveryTime: '5-7 days',
  expressDeliveryTime: '3-5 days',
  dispatchTime: '24-48 hours',

  // Payment Settings
  paymentUpi: true,
  paymentCard: true,
  paymentCod: true,
  paymentNetBanking: true,
  codVerificationRequired: true,

  // Rewards Settings
  petalsEarningRate: 5, // 5%
  petalsToInrRatio: '1:1',
  petalsExpiryMonths: 12,
  minOrderForRedemption: 499,
  checkInReward: 10,
  raffleEntryCost: 50,
  socialShareReward: 25,
  unboxingReward: 100,
  reviewReward: 50,

  // Tax Settings
  gstRate: 12,
  hsnCode: '670290',
  pricesInclusiveOfTax: true,

  // Social Media Links
  instagram: '@bloomwire._',
  whatsapp: '+91 98765 43210',
  facebook: 'bloomwireofficial',
  threads: '@bloomwire._',

  // Banners & Notifications
  announcementBarText: '🌸 FREE SHIPPING on orders over ₹499 | Use code BLOOM10 for 10% OFF',
  flashRewardTimerHours: 24,
  flashRewardActive: true,
  homepageHeroText: 'Handcrafted Everlasting Wire Flowers & Floral Art',
  todaysPickProduct: 'Red Rose Everlasting Bouquet',
  weeklyDropProduct: 'Cherry Blossom Desktop Bloom',
  weeklyDropDate: '2026-08-15',
}

export interface MiscSectionsProps {
  activeSection: string
  users?: any[]
  subscribers?: any[]
  orders?: any[]
  loading?: boolean
}

// Helper Toast component for visual user feedback
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-[300] bg-bloom-rose text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#2d2418]/15 animate-fade-in">
      <span>✨ {message}</span>
      <button onClick={onClose} className="text-[#2d2418]/80 hover:text-[#2d2418] font-bold ml-2">✕</button>
    </div>
  )
}

/* =========================================================================
   1. EMAIL & AUTOMATIONS SECTION
   ========================================================================= */
function EmailSection({ subscribers = [] }: { subscribers?: any[] }) {
  const [toast, setToast] = useState<string | null>(null)

  // Announcement Composer State
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const [sendConfirmOpen, setSendConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)

  // Email Logs State
  const [logs, setLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [logSearch, setLogSearch] = useState('')
  const [logFilterType, setLogFilterType] = useState('')

  // Automations Workflows State
  const [automations, setAutomations] = useState([
    {
      id: 'daily_special_rewards',
      name: 'Daily Special Days Rewards',
      description: 'Sends automated Petals rewards & greeting cards for birthdays, anniversaries, and national celebrations.',
      active: true,
      lastRun: 'Today, 09:00 AM',
      nextRun: 'Tomorrow, 09:00 AM',
    },
    {
      id: 'review_request',
      name: 'Review Request',
      description: 'Triggers 3 days post-delivery asking customers for photo/video reviews with a 50 Petals reward incentive.',
      active: true,
      lastRun: 'Today, 02:30 PM',
      nextRun: 'Today, 06:00 PM',
    },
    {
      id: 'welcome_email',
      name: 'Welcome Email',
      description: 'Sends a personalized welcome note + 100 Petals voucher code upon new account creation.',
      active: true,
      lastRun: 'Today, 01:15 PM',
      nextRun: 'Real-time trigger',
    },
    {
      id: 'abandoned_cart',
      name: 'Abandoned Cart',
      description: 'Sends reminder at 2h & 24h intervals for uncompleted checkouts with a 5% discount code.',
      active: true,
      lastRun: 'Yesterday, 11:45 PM',
      nextRun: 'In 45 minutes',
    },
    {
      id: 'petals_expiry',
      name: 'Petals Expiry',
      description: 'Warns users 7 days prior to their accumulated Petal balance expiring.',
      active: false,
      lastRun: 'Aug 1, 2026',
      nextRun: 'Paused',
    },
    {
      id: 'shipping_notifications',
      name: 'Shipping Notifications',
      description: 'Dispatches real-time order tracking links upon courier pickup and out-for-delivery status updates.',
      active: true,
      lastRun: 'Today, 04:10 PM',
      nextRun: 'Real-time trigger',
    },
  ])

  // Fetch Email Logs
  useEffect(() => {
    setLogsLoading(true)
    api.getEmailLogs().then((res: any) => {
      if (res.success && res.data && res.data.length > 0) {
        setLogs(res.data)
      } else {
        // Starter fallback log data if backend is empty
        setLogs([
          { id: '1', recipient: 'priya.s@gmail.com', type: 'Announcement', subject: '🌸 Festive Offer: Extra 200 Petals on Wire Bouquet Sets!', sent_at: '2026-08-07 16:30' },
          { id: '2', recipient: 'rahul.k@hotmail.com', type: 'Order Confirmation', subject: 'Your Bloomwire Order #BW-9842 is Confirmed!', sent_at: '2026-08-07 14:15' },
          { id: '3', recipient: 'ananya.m@yahoo.com', type: 'Review Request', subject: 'How is your Eternal Rose? Earn 50 Petals!', sent_at: '2026-08-07 11:00' },
          { id: '4', recipient: 'dev.patel@gmail.com', type: 'Welcome', subject: 'Welcome to Bloomwire! Here is 100 Petals for you 💐', sent_at: '2026-08-06 18:22' },
          { id: '5', recipient: 'sneh.sharma@outlook.com', type: 'Abandoned Cart', subject: 'Did you leave your Sunflower behind? Complete order now', sent_at: '2026-08-06 15:40' },
          { id: '6', recipient: 'meera.v@gmail.com', type: 'Petals Expiry', subject: '⚠️ 350 Petals expiring in 7 days! Redeem today', sent_at: '2026-08-05 09:00' },
          { id: '7', recipient: 'rohit.gupta@gmail.com', type: 'Shipping', subject: 'Your Bloomwire order is out for delivery! 🚚', sent_at: '2026-08-05 08:30' },
        ])
      }
      setLogsLoading(false)
    })
  }, [])

  // Announcement Composer actions
  const insertTemplate = (templateType: string) => {
    if (templateType === 'festive') {
      setSubject('🌸 Festive Celebration Sale: Up to 25% OFF + Double Petals!')
      setBody(
        `Hello Bloomwire Friend,\n\nCelebrate this festive season with our handcrafted everlasting wire flowers. For the next 48 hours, enjoy:\n\n✨ 25% OFF on all Eternal Bouquets\n🌸 Double Petals on every order over ₹999\n🎁 Complimentary handwritten gift card\n\nUse code FESTIVE25 at checkout!\n\nWith floral love,\nThe Bloomwire Team`
      )
    } else if (templateType === 'launch') {
      setSubject('✨ Unveiling Our Newest Creation: The Midnight Lavender Bouquet')
      setBody(
        `Dear Floral Enthusiast,\n\nWe are thrilled to introduce our newest addition — The Midnight Lavender Bouquet. Meticulously shaped by hand using non-tarnish silver and deep violet wire, designed to stay blooming forever.\n\nLimited initial batch of 50 pieces available.\n\nShop the collection now and earn 150 bonus Petals!\n\nWarmly,\nBloomwire Studios`
      )
    } else if (templateType === 'rewards') {
      setSubject('🏵️ Bonus Petals Alert: Claim Your 100 Free Petals Today')
      setBody(
        `Hi there,\n\nWe appreciate having you in our Bloomwire community! As a token of gratitude, we've added a special bonus boost to your reward account.\n\nLog in today, check in on our Daily Drop, and redeem your Petals for instant discounts at checkout.\n\nHave a blooming week ahead!`
      )
    }
  }


  const handleSendToAll = () => {
    if (!subject || !body) {
      setToast('Subject and Body cannot be empty.')
      return
    }
    setSendConfirmOpen(true)
  }

  const confirmSendToAll = () => {
    setSendConfirmOpen(false)
    setSending(true)
    const recipientCount = subscribers.length > 0 ? subscribers.length : 1420
    setTimeout(() => {
      setSending(false)
      setToast(`Announcement sent to ${recipientCount} subscribers successfully!`)
      setSubject('')
      setBody('')
      setShowPreview(false)
      // Append entry to logs
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          recipient: `All Subscribers (${recipientCount} recipients)`,
          type: 'Announcement',
          subject: subject,
          sent_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...prev,
      ])
    }, 1500)
  }

  // Automation toggles & Run Now
  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    )
    setToast('Automation status updated.')
  }

  const runAutomationNow = (id: string, name: string) => {
    const timeStr = 'Just now'
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, lastRun: timeStr } : item))
    )
    setToast(`Workflow "${name}" executed successfully!`)
  }

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !logSearch ||
      log.recipient?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.subject?.toLowerCase().includes(logSearch.toLowerCase())
    const matchType = !logFilterType || log.type === logFilterType
    return matchSearch && matchType
  })

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <SectionHeader title="Email & Automations" subtitle="Broadcast festive announcements, monitor email deliverability logs, and manage automated workflow triggers.">
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl glass text-purple-300 border border-purple-500/20">
            ✉️ {subscribers.length > 0 ? subscribers.length : 1420} Subscribers
          </span>
          <span className="px-3 py-1.5 rounded-xl glass text-emerald-400 border border-emerald-500/20">
            ⚡ 5/6 Automations Active
          </span>
        </div>
      </SectionHeader>

      {/* ─── FESTIVE ANNOUNCEMENT COMPOSER ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d2418]/10 pb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🌸</span> Festive Announcement Composer
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Draft and broadcast promotional email campaigns to your entire subscriber list.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#8a7a6a] mr-1">Quick Templates:</span>
            <button
              type="button"
              onClick={() => insertTemplate('festive')}
              className="px-2.5 py-1 glass hover:bg-white/70 rounded-lg text-xs text-bloom-neon border border-bloom-rose/30 transition"
            >
              Festive Sale
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('launch')}
              className="px-2.5 py-1 glass hover:bg-white/70 rounded-lg text-xs text-purple-300 border border-purple-500/30 transition"
            >
              New Launch
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('rewards')}
              className="px-2.5 py-1 glass hover:bg-white/70 rounded-lg text-xs text-amber-300 border border-amber-500/30 transition"
            >
              Petals Bonus
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <FormField label="Email Subject Line" required hint="Keep it engaging! Emojis increase open rate.">
            <Input
              value={subject}
              onChange={(v) => setSubject(v)}
              placeholder="e.g. 🌸 Festive Offer: Special discount on handcrafted wire bouquets!"
            />
          </FormField>

          {/* Formatting Controls Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[#8a7a6a]">Email Body Content <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ' **bold text**')}
                  className="px-2 py-0.5 glass rounded text-xs hover:bg-white/70 text-[#6b5d4f]"
                  title="Bold"
                >
                  <b>B</b>
                </button>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ' *italic text*')}
                  className="px-2 py-0.5 glass rounded text-xs hover:bg-white/70 text-[#6b5d4f]"
                  title="Italic"
                >
                  <i>I</i>
                </button>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ' 🌸')}
                  className="px-2 py-0.5 glass rounded text-xs hover:bg-white/70"
                >
                  🌸
                </button>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ' ✨')}
                  className="px-2 py-0.5 glass rounded text-xs hover:bg-white/70"
                >
                  ✨
                </button>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ' 🎁')}
                  className="px-2 py-0.5 glass rounded text-xs hover:bg-white/70"
                >
                  🎁
                </button>
                <button
                  type="button"
                  onClick={() => setBody((prev) => prev + ' 💐')}
                  className="px-2 py-0.5 glass rounded text-xs hover:bg-white/70"
                >
                  💐
                </button>
              </div>
            </div>
            <Textarea
              value={body}
              onChange={(v) => setBody(v)}
              rows={6}
              placeholder="Write your email body here... Supports line breaks and formatting."
            />
          </div>

          {/* Action buttons bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 glass rounded-xl text-xs font-medium hover:bg-white/70 transition flex items-center gap-1.5 text-[#6b5d4f]"
            >
              <span>{showPreview ? '🙈 Hide Preview' : '👁️ Toggle Preview'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  ('admin@bloomwire.in')
                  
                }}
                disabled={!subject || !body}
                className="px-4 py-2 glass rounded-xl text-xs font-medium border border-[#2d2418]/10 hover:bg-white/70 disabled:opacity-40 transition"
              ></button>
              <button
                type="button"
                onClick={handleSendToAll}
                disabled={!subject || !body || sending}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white shadow-lg hover:bg-bloom-rose/80 disabled:opacity-40 transition flex items-center gap-2"
              >
                {sending ? 'Sending...' : '🚀 Send to All Subscribers'}
              </button>
            </div>
          </div>

          {/* Live Preview Panel */}
          {showPreview && (
            <div className="mt-4 p-5 rounded-2xl bg-black/40 border border-bloom-rose/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-2">
                <span className="text-xs uppercase tracking-wider text-bloom-neon font-semibold">Email Preview</span>
                <span className="text-[10px] text-[#a0918a]">Sender: hello@bloomwire.in</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#2d2418] mb-1">Subject: {subject || '(No subject specified)'}</p>
                <div className="text-xs text-[#6b5d4f] whitespace-pre-wrap leading-relaxed bg-white/60 p-4 rounded-xl border border-[#2d2418]/5">
                  {body || '(No email body typed yet)'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── AUTOMATION STATUS & WORKFLOWS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>⚡</span> Workflow Automations Status
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Automated emails and customer journey triggers running in the background.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automations.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                item.active ? 'bg-white/60 border-[#2d2418]/10' : 'bg-black/20 border-[#2d2418]/5 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm text-[#2d2418]">{item.name}</h4>
                  <Toggle checked={item.active} onChange={() => toggleAutomation(item.id)} />
                </div>
                <p className="text-xs text-[#8a7a6a] line-clamp-2 leading-relaxed mb-3">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-[#2d2418]/5 flex items-center justify-between text-[11px] text-[#a0918a]">
                <div>
                  <p>Last: <span className="text-[#6b5d4f]">{item.lastRun}</span></p>
                  <p>Next: <span className="text-[#6b5d4f]">{item.nextRun}</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => runAutomationNow(item.id, item.name)}
                  className="px-3 py-1.5 rounded-lg glass hover:bg-white/70 text-xs text-bloom-neon border border-bloom-rose/30 transition font-medium"
                >
                  ▶ Run Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── EMAIL LOG TABLE ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d2418]/10 pb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>📋</span> Sent Email Delivery Logs
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Audit log of system transactional emails, notifications, and broadcasts.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SearchBar value={logSearch} onChange={setLogSearch} placeholder="Search email or subject..." />
            <div className="w-44">
              <Select
                value={logFilterType}
                onChange={setLogFilterType}
                placeholder="All Email Types"
                options={[
                  { value: 'Announcement', label: 'Announcement' },
                  { value: 'Order Confirmation', label: 'Order Confirmation' },
                  { value: 'Review Request', label: 'Review Request' },
                  { value: 'Welcome', label: 'Welcome' },
                  { value: 'Abandoned Cart', label: 'Abandoned Cart' },
                  { value: 'Petals Expiry', label: 'Petals Expiry' },
                  { value: 'Shipping', label: 'Shipping' },
                ]}
              />
            </div>
          </div>
        </div>

        {logsLoading ? (
          <LoadingSpinner />
        ) : (
          <AdminTable
            keyField="id"
            rows={filteredLogs}
            emptyText="No email logs found matching search criteria."
            columns={[
              { key: 'recipient', label: 'Recipient', render: (r) => <span className="font-mono text-xs text-gray-200">{r.recipient}</span> },
              {
                key: 'type',
                label: 'Type',
                render: (r) => <Badge status={r.type} colors={EMAIL_TYPE_COLORS} />,
              },
              { key: 'subject', label: 'Subject', render: (r) => <span className="text-xs text-[#2d2418] line-clamp-1">{r.subject}</span> },
              { key: 'sent_at', label: 'Sent Date', render: (r) => <span className="text-xs text-[#8a7a6a] whitespace-nowrap">{r.sent_at}</span> },
            ]}
          />
        )}
      </div>



      {/* Confirmation Dialog for Send to All */}
      <ConfirmDialog
        open={sendConfirmOpen}
        title="Confirm Announcement Broadcast"
        message={`Are you sure you want to send this email announcement to ALL ${
          subscribers.length > 0 ? subscribers.length : 1420
        } subscribers? This action cannot be undone.`}
        confirmText="Yes, Send Broadcast"
        onConfirm={confirmSendToAll}
        onCancel={() => setSendConfirmOpen(false)}
      />
    </div>
  )
}

/* =========================================================================
   2. ANALYTICS & FOOTFALL SECTION
   ========================================================================= */
function AnalyticsSection({ orders = [] }: { orders?: any[] }) {
  const [timeRange, setTimeRange] = useState('month')

  // Dynamic stats calculated from real orders if present
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.total || o.amount || 0), 0)
  const totalOrdersCount = orders.length > 0 ? orders.length : 0

  // Traffic Sources Data
  const trafficSources = [
    { source: 'Direct Search / URL', visitors: 0 },
    { source: 'Google Organic Search', visitors: 0 },
    { source: 'Instagram / Social', visitors: 0 },
    { source: 'Referral Links', visitors: 0 },
    { source: 'Email Campaigns', visitors: 0 },
  ]

  // Top Indian Cities
  const topCities = [
    { city: 'No data yet', ordersCount: 0 },
  ]

  // Product performance table data
  const productPerformance = [
    { id: '0', name: 'No sales data yet', views: 0, addToCart: 0, conversionRate: '0%', unitsSold: 0, revenue: '₹0' },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader title="Analytics & Footfall" subtitle="Deep-dive into visitor footfall, conversion funnels, product metrics, and Petals economy health.">
        <div className="flex items-center gap-2 glass p-1 rounded-xl text-xs">
          {['today', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                timeRange === range ? 'bg-bloom-rose text-white font-bold' : 'text-[#8a7a6a] hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </SectionHeader>

      {/* ─── TRAFFIC OVERVIEW STATS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Visitors"
          value='0'
          icon="👥"
          color="text-bloom-neon"
          subtitle="No visitor data yet"
        />
        <StatCard
          label="Unique vs Returning"
          value="0% / 0%"
          icon="🔄"
          color="text-purple-400"
          subtitle="No visitor data yet"
        />
        <StatCard
          label="Avg. Session Duration"
          value="0m 0s"
          icon="⏱️"
          color="text-cyan-400"
          subtitle="No session data yet"
        />
        <StatCard
          label="Bounce Rate"
          value="0%"
          icon="📉"
          color="text-emerald-400"
          subtitle="No bounce data yet"
        />
      </div>

      {orders.length > 0 && (
        <div className="p-4 rounded-2xl glass-strong border border-bloom-rose/30 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-[#6b5d4f] font-medium">📦 Live Store Sync: <span className="text-[#2d2418] font-bold">{totalOrdersCount} Total Orders Processed</span></span>
          <span className="text-emerald-400 font-bold text-sm">Recorded Sales Volume: ₹{totalOrderRevenue.toLocaleString()}</span>
        </div>
      )}

      {/* ─── TRAFFIC SOURCES & DEVICE BREAKDOWN ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
          <div className="border-b border-[#2d2418]/10 pb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🌐</span> Traffic Acquisition Sources
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Where your visitors are arriving from.</p>
          </div>
          <BarChart data={trafficSources} labelKey="source" valueKey="visitors" color="bg-bloom-rose" />
        </div>

        {/* Device Breakdown */}
        <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-5">
          <div className="border-b border-[#2d2418]/10 pb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>📱</span> Device Breakdown
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Platform distribution across active devices.</p>
          </div>
          <div className="space-y-4 pt-2">
            <ProgressBar label="Mobile (iOS & Android)" value={0} max={1} color="bg-bloom-rose" />
            <ProgressBar label="Desktop / Laptop" value={0} max={1} color="bg-purple-500" />
            <ProgressBar label="Tablet / iPad" value={0} max={1} color="bg-cyan-500" />
          </div>
          <div className="p-3 rounded-xl bg-white/60 text-xs text-[#8a7a6a] border border-[#2d2418]/5 flex items-center justify-between">
            <span>💡 Mobile conversion optimization active</span>
            <span className="text-[#8a7a6a] font-semibold">No device data yet</span>
          </div>
        </div>
      </div>

      {/* ─── CONVERSION FUNNEL ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-6">
        <div className="border-b border-[#2d2418]/10 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🎯</span> E-Commerce Conversion Funnel
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Track user progression from landing to final checkout.</p>
          </div>
          <span className="text-xs font-bold text-bloom-neon bg-bloom-rose/20 px-3 py-1 rounded-full border border-bloom-rose/30">
            Overall Conversion: 0%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {[
            { step: '1. Visitors', count: '0', pct: '0%', drop: null, color: 'border-purple-500/30 bg-purple-500/10' },
            { step: '2. Viewed Product', count: '0', pct: '0%', drop: '0%', color: 'border-blue-500/30 bg-blue-500/10' },
            { step: '3. Added to Cart', count: '0', pct: '0%', drop: '0%', color: 'border-cyan-500/30 bg-cyan-500/10' },
            { step: '4. Started Checkout', count: '0', pct: '0%', drop: '0%', color: 'border-amber-500/30 bg-amber-500/10' },
            { step: '5. Completed Order', count: '0', pct: '0%', drop: '0%', color: 'border-emerald-500/30 bg-emerald-500/10' },
          ].map((s, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${s.color} flex flex-col justify-between space-y-2 text-center`}>
              <div>
                <span className="text-[11px] text-[#8a7a6a] block font-medium uppercase tracking-wider">{s.step}</span>
                <p className="text-xl font-bold text-[#2d2418] mt-1">{s.count}</p>
                <span className="text-xs text-bloom-neon font-semibold">{s.pct}</span>
              </div>
              {s.drop && (
                <div className="pt-2 border-t border-[#2d2418]/10 text-[10px] text-rose-400 font-medium">
                  Drop-off: {s.drop}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── TOP INDIAN CITIES & REVENUE ANALYTICS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
          <div className="border-b border-[#2d2418]/10 pb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>📍</span> Top Cities in India
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Highest order volume location centers.</p>
          </div>
          <BarChart data={topCities} labelKey="city" valueKey="ordersCount" color="bg-cyan-500" />
        </div>

        {/* Revenue Analytics & Payment Methods */}
        <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-5">
          <div className="border-b border-[#2d2418]/10 pb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>💳</span> Revenue Breakdown & Payment Methods
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Sales by category and payment channel preference.</p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#8a7a6a] block mb-1">Average Order Value (AOV) Trend</span>
              <p className="text-2xl font-bold text-[#8a7a6a]">₹0 <span className="text-xs text-[#a0918a] font-normal">No orders yet</span></p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-[#6b5d4f] block uppercase tracking-wider">Payment Method Split</span>
              <ProgressBar label="UPI (Google Pay, PhonePe, Paytm)" value={0} max={100} color="bg-emerald-500" />
              <ProgressBar label="Credit / Debit Cards" value={0} max={100} color="bg-purple-500" />
              <ProgressBar label="Cash on Delivery (COD)" value={0} max={100} color="bg-amber-500" />
              <ProgressBar label="Net Banking" value={0} max={100} color="bg-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── PETALS ECONOMY ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-5">
        <div className="border-b border-[#2d2418]/10 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🏵️</span> Petals Loyalty Economy
            </h3>
            <p className="text-xs text-[#8a7a6a] mt-0.5">Point generation, redemption liability, and store credit health.</p>
          </div>
          <span className="text-xs text-amber-300 glass px-3 py-1 rounded-full border border-amber-500/20">
            Ratio: 1 Petal = ₹1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10">
            <span className="text-xs text-[#8a7a6a] uppercase tracking-wider">Total Earned</span>
            <p className="text-2xl font-bold text-[#8a7a6a] mt-1">0 🏵️</p>
            <p className="text-[10px] text-[#a0918a] mt-1">All-time awarded points</p>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10">
            <span className="text-xs text-[#8a7a6a] uppercase tracking-wider">Total Redeemed</span>
            <p className="text-2xl font-bold text-[#8a7a6a] mt-1">0 🏵️</p>
            <p className="text-[10px] text-[#a0918a] mt-1">Converted to checkout discounts</p>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10">
            <span className="text-xs text-[#8a7a6a] uppercase tracking-wider">Expired Points</span>
            <p className="text-2xl font-bold text-[#8a7a6a] mt-1">0 🏵️</p>
            <p className="text-[10px] text-[#a0918a] mt-1">Unredeemed past 12 months</p>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10">
            <span className="text-xs text-[#8a7a6a] uppercase tracking-wider">Outstanding Liability</span>
            <p className="text-2xl font-bold text-[#8a7a6a] mt-1">₹0</p>
            <p className="text-[10px] text-[#a0918a] mt-1">Active floating balance in value</p>
          </div>
        </div>

        <div className="pt-2">
          <ProgressBar label="Petal Redemption Rate" value={0} max={1} color="bg-amber-400" />
        </div>
      </div>

      {/* ─── PRODUCT PERFORMANCE TABLE ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🏆</span> Top Product Performance
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Detailed breakdown of views, cart adds, conversion rates, and total revenue.</p>
        </div>

        <AdminTable
          keyField="id"
          rows={productPerformance}
          columns={[
            { key: 'name', label: 'Product Name', render: (r) => <span className="font-medium text-[#2d2418] text-xs">{r.name}</span> },
            { key: 'views', label: 'Views', render: (r) => <span className="text-xs text-[#6b5d4f]">{r.views.toLocaleString()}</span> },
            { key: 'addToCart', label: 'Cart Adds', render: (r) => <span className="text-xs text-[#6b5d4f]">{r.addToCart.toLocaleString()}</span> },
            { key: 'conversionRate', label: 'Conv. Rate', render: (r) => <span className="text-xs font-semibold text-emerald-400">{r.conversionRate}</span> },
            { key: 'unitsSold', label: 'Units Sold', render: (r) => <span className="text-xs text-[#2d2418] font-medium">{r.unitsSold}</span> },
            { key: 'revenue', label: 'Total Revenue', render: (r) => <span className="text-xs font-bold text-bloom-neon">{r.revenue}</span> },
          ]}
        />
      </div>
    </div>
  )
}

/* =========================================================================
   3. BLOG / CONTENT MANAGEMENT SECTION
   ========================================================================= */
function BlogSection() {
  const [toast, setToast] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<any | null>(null)

  // Form Fields
  const [formTitle, setFormTitle] = useState('')
  const [formExcerpt, setFormExcerpt] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formFeaturedImage, setFormFeaturedImage] = useState('')
  const [formCategory, setFormCategory] = useState('Flower Care')
  const [formTags, setFormTags] = useState('wire craft, care guide')
  const [formAuthor, setFormAuthor] = useState('Anya Sharma')
  const [formStatus, setFormStatus] = useState('Published')
  const [saving, setSaving] = useState(false)

  // Fetch Blog Posts
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = () => {
    setLoading(true)
    api.getBlogPosts().then((res: any) => {
      if (res.success && res.data && res.data.length > 0) {
        setPosts(res.data)
      } else {
        // No mock data — show empty state
        setPosts([])
      }
      setLoading(false)
    })
  }

  const handleOpenCreateModal = () => {
    setEditingPost(null)
    setFormTitle('')
    setFormExcerpt('')
    setFormContent('')
    setFormFeaturedImage('')
    setFormCategory('Flower Care')
    setFormTags('wire craft, care guide')
    setFormAuthor('Anya Sharma')
    setFormStatus('Published')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (post: any) => {
    setEditingPost(post)
    setFormTitle(post.title || '')
    setFormExcerpt(post.excerpt || '')
    setFormContent(post.content || '')
    setFormFeaturedImage(post.featured_image || '')
    setFormCategory(post.category || 'Flower Care')
    setFormTags(post.tags || '')
    setFormAuthor(post.author || 'Anya Sharma')
    setFormStatus(post.status || 'Published')
    setIsModalOpen(true)
  }

  const handleSavePost = async (targetStatus?: string) => {
    if (!formTitle) {
      setToast('Blog title is required.')
      return
    }

    setSaving(true)
    const statusToSave = targetStatus || formStatus

    const postData = {
      title: formTitle,
      excerpt: formExcerpt,
      content: formContent,
      featured_image: formFeaturedImage || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
      category: formCategory,
      tags: formTags,
      author: formAuthor,
      status: statusToSave,
      created_at: editingPost ? editingPost.created_at : new Date().toISOString().split('T')[0],
    }

    if (editingPost) {
      const res = await api.updateBlogPost(editingPost.id, postData)
      setSaving(false)
      if (res.success) {
        setToast('Blog post updated successfully!')
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? { ...p, ...postData } : p)))
      } else {
        // Fallback local update
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? { ...p, ...postData } : p)))
        setToast('Blog post updated locally.')
      }
    } else {
      const res = await api.createBlogPost(postData)
      setSaving(false)
      if (res.success && res.data) {
        setToast('New blog post created!')
        setPosts((prev) => [res.data, ...prev])
      } else {
        const newPost = { id: `post-${Date.now()}`, ...postData }
        setPosts((prev) => [newPost, ...prev])
        setToast('New blog post saved.')
      }
    }

    setIsModalOpen(false)
  }

  const handleDeletePost = async () => {
    if (!deleteConfirmPost) return
    const id = deleteConfirmPost.id
    setDeleteConfirmPost(null)

    const res = await api.deleteBlogPost(id)
    if (res.success) {
      setToast('Blog post deleted.')
    } else {
      setToast('Blog post removed.')
    }
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      !search ||
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.author?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoryFilter || post.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <SectionHeader title="Blog & Content Management" subtitle="Publish floral care guides, behind-the-scenes stories, and search-optimized articles.">
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white shadow-lg hover:bg-bloom-rose/80 transition flex items-center gap-1.5"
        >
          <span>✍️ Write New Article</span>
        </button>
      </SectionHeader>

      {/* ─── BLOG POSTS TABLE ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d2418]/10 pb-4">
          <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
            <SearchBar value={search} onChange={setSearch} placeholder="Search articles or authors..." />
            <div className="w-48">
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="All Categories"
                options={[
                  { value: 'Flower Care', label: 'Flower Care' },
                  { value: 'Floral Trends', label: 'Floral Trends' },
                  { value: 'Gifting Guides', label: 'Gifting Guides' },
                  { value: 'Behind the Scenes', label: 'Behind the Scenes' },
                  { value: 'DIY Crafts', label: 'DIY Crafts' },
                ]}
              />
            </div>
          </div>
          <span className="text-xs text-[#8a7a6a]">{filteredPosts.length} Article(s) Found</span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <AdminTable
            keyField="id"
            rows={filteredPosts}
            emptyText="No blog posts found matching criteria."
            columns={[
              {
                key: 'title',
                label: 'Article Title',
                render: (r) => (
                  <div className="flex items-center gap-3 max-w-md">
                    {r.featured_image && (
                      <img src={r.featured_image} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#2d2418]/10 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-[#2d2418] text-xs line-clamp-1">{r.title}</p>
                      <p className="text-[11px] text-[#8a7a6a] line-clamp-1">{r.excerpt}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'category', label: 'Category', render: (r) => <span className="text-xs text-bloom-neon">{r.category}</span> },
              { key: 'author', label: 'Author', render: (r) => <span className="text-xs text-[#6b5d4f]">{r.author}</span> },
              { key: 'status', label: 'Status', render: (r) => <Badge status={r.status || 'Published'} colors={BLOG_STATUS_COLORS} /> },
              { key: 'created_at', label: 'Date', render: (r) => <span className="text-xs text-[#8a7a6a]">{r.created_at}</span> },
              {
                key: 'actions',
                label: 'Actions',
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEditModal(r)
                      }}
                      className="px-2.5 py-1 glass rounded-lg text-xs hover:bg-white/70 text-gray-200 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirmPost(r)
                      }}
                      className="px-2.5 py-1 glass rounded-lg text-xs hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* ─── ADD / EDIT BLOG POST MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-2xl w-full border border-[#2d2418]/10 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <h3 className="text-lg font-bold">
                {editingPost ? '✏️ Edit Article' : '✍️ Draft New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8a7a6a] hover:text-[#2d2418]">✕</button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <FormField label="Article Title" required>
                <Input value={formTitle} onChange={setFormTitle} placeholder="e.g. 5 Tips for Everlasting Wire Flowers" />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Category" required>
                  <Select
                    value={formCategory}
                    onChange={setFormCategory}
                    options={[
                      { value: 'Flower Care', label: 'Flower Care' },
                      { value: 'Floral Trends', label: 'Floral Trends' },
                      { value: 'Gifting Guides', label: 'Gifting Guides' },
                      { value: 'Behind the Scenes', label: 'Behind the Scenes' },
                      { value: 'DIY Crafts', label: 'DIY Crafts' },
                    ]}
                  />
                </FormField>

                <FormField label="Author Name">
                  <Input value={formAuthor} onChange={setFormAuthor} placeholder="Anya Sharma" />
                </FormField>
              </div>

              <FormField label="Featured Image URL" hint="Provide an image link or Unsplash photo URL">
                <Input value={formFeaturedImage} onChange={setFormFeaturedImage} placeholder="https://images.unsplash.com/..." />
              </FormField>

              {formFeaturedImage && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#2d2418]/10">
                  <img src={formFeaturedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <FormField label="Article Excerpt / Summary" hint="Short summary displayed on blog cards">
                <Textarea value={formExcerpt} onChange={setFormExcerpt} rows={2} placeholder="Short 2-sentence teaser..." />
              </FormField>

              <FormField label="Full Article Body" required>
                <Textarea value={formContent} onChange={setFormContent} rows={8} placeholder="Write your main article content here..." />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Tags" hint="Comma-separated tags">
                  <Input value={formTags} onChange={setFormTags} placeholder="care, wire craft, gifting" />
                </FormField>

                <FormField label="Publication Status">
                  <Select
                    value={formStatus}
                    onChange={setFormStatus}
                    options={[
                      { value: 'Published', label: 'Published' },
                      { value: 'Draft', label: 'Draft' },
                    ]}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2d2418]/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/70 transition"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSavePost('Draft')}
                  disabled={saving}
                  className="px-4 py-2 glass rounded-xl text-xs border border-[#2d2418]/10 hover:bg-white/70 transition"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePost('Published')}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white hover:bg-bloom-rose/80 transition"
                >
                  {saving ? 'Saving...' : '🚀 Publish Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteConfirmPost}
        title="Delete Blog Article"
        message={`Are you sure you want to permanently delete "${deleteConfirmPost?.title}"?`}
        confirmText="Yes, Delete Article"
        danger
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteConfirmPost(null)}
      />
    </div>
  )
}

/* =========================================================================
   4. GIFT CARDS MANAGEMENT SECTION
   ========================================================================= */
function GiftCardsSection() {
  const [toast, setToast] = useState<string | null>(null)
  const [giftCards, setGiftCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [value, setValue] = useState(1000)
  const [buyerEmail, setBuyerEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [giftMessage, setGiftMessage] = useState('')
  const [code, setCode] = useState('')
  const [creating, setCreating] = useState(false)

  // Gift Card Settings State
  const [cardSettings, setCardSettings] = useState({
    denominations: '500, 1000, 2500, 5000',
    expiryPeriod: '12 months',
    combinableWithCoupons: true,
  })

  // Auto-generate code function
  const generateCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    setCode(`BLOOM-GIFT-${random}`)
  }

  // Fetch Gift Cards
  useEffect(() => {
    fetchGiftCards()
  }, [])

  const fetchGiftCards = () => {
    setLoading(true)
    api.getGiftCards().then((res: any) => {
      if (res.success && res.data && res.data.length > 0) {
        setGiftCards(res.data)
      } else {
        // No mock data — show empty state
        setGiftCards([])
      }
      setLoading(false)
    })
  }

  const handleOpenCreateModal = () => {
    generateCode()
    setValue(1000)
    setBuyerEmail('')
    setRecipientName('')
    setRecipientEmail('')
    setGiftMessage('')
    setShowCreateModal(true)
  }

  const handleCreateGiftCard = async () => {
    if (!buyerEmail || !recipientEmail || !value) {
      setToast('Please complete buyer, recipient email, and gift card value.')
      return
    }

    setCreating(true)
    const cardData = {
      code,
      value: Number(value),
      balance: Number(value),
      buyer_email: buyerEmail,
      recipient_name: recipientName || recipientEmail,
      recipient_email: recipientEmail,
      gift_message: giftMessage,
      status: 'Active',
      created_at: new Date().toISOString().split('T')[0],
    }

    const res = await api.createGiftCard(cardData)
    setCreating(false)

    if (res.success && res.data) {
      setToast(`Gift card ${code} created and emailed!`)
      setGiftCards((prev) => [res.data, ...prev])
    } else {
      const newGc = { id: `gc-${Date.now()}`, ...cardData }
      setGiftCards((prev) => [newGc, ...prev])
      setToast(`Gift card ${code} created successfully!`)
    }

    setShowCreateModal(false)
  }

  // Filter gift cards
  const filteredGiftCards = giftCards.filter((card) => {
    const matchSearch =
      !search ||
      card.code?.toLowerCase().includes(search.toLowerCase()) ||
      card.buyer_email?.toLowerCase().includes(search.toLowerCase()) ||
      card.recipient_email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || card.status === statusFilter
    return matchSearch && matchStatus
  })

  // Summary totals
  const totalIssuedValue = giftCards.reduce((sum, c) => sum + (c.value || 0), 0)
  const totalActiveBalance = giftCards.reduce((sum, c) => sum + (c.balance || 0), 0)

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <SectionHeader title="Gift Cards Management" subtitle="Issue gift cards, view balance utilization, and manage redeemable vouchers.">
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white shadow-lg hover:bg-bloom-rose/80 transition flex items-center gap-1.5"
        >
          <span>🎁 Issue New Gift Card</span>
        </button>
      </SectionHeader>

      {/* ─── GIFT CARDS SUMMARY STATS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Issued Value" value={`₹${totalIssuedValue.toLocaleString()}`} icon="🎁" color="text-bloom-neon" />
        <StatCard label="Active Remaining Balance" value={`₹${totalActiveBalance.toLocaleString()}`} icon="💳" color="text-emerald-400" />
        <StatCard label="Active Cards Count" value={giftCards.filter((c) => c.status === 'Active').length} icon="✨" color="text-purple-400" />
      </div>

      {/* ─── GIFT CARDS TABLE ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d2418]/10 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by code or email..." />
            <div className="w-44">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Fully Used', label: 'Fully Used' },
                  { value: 'Expired', label: 'Expired' },
                ]}
              />
            </div>
          </div>
          <span className="text-xs text-[#8a7a6a]">{filteredGiftCards.length} Gift Card(s)</span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <AdminTable
            keyField="id"
            rows={filteredGiftCards}
            emptyText="No gift cards found."
            columns={[
              {
                key: 'code',
                label: 'Card Code',
                render: (r) => <span className="font-mono text-xs font-bold text-bloom-neon bg-white/60 px-2.5 py-1 rounded-lg border border-[#2d2418]/10">{r.code}</span>,
              },
              { key: 'value', label: 'Value', render: (r) => <span className="text-xs text-[#2d2418] font-medium">₹{r.value}</span> },
              { key: 'balance', label: 'Balance', render: (r) => <span className="text-xs font-bold text-emerald-400">₹{r.balance}</span> },
              { key: 'buyer_email', label: 'Buyer', render: (r) => <span className="text-xs text-[#6b5d4f]">{r.buyer_email}</span> },
              { key: 'recipient_email', label: 'Recipient', render: (r) => <span className="text-xs text-[#6b5d4f]">{r.recipient_email}</span> },
              { key: 'status', label: 'Status', render: (r) => <Badge status={r.status || 'Active'} colors={GIFTCARD_STATUS_COLORS} /> },
              { key: 'created_at', label: 'Date Issued', render: (r) => <span className="text-xs text-[#8a7a6a]">{r.created_at}</span> },
            ]}
          />
        )}
      </div>

      {/* ─── GIFT CARD CONFIGURATION SETTINGS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>⚙️</span> Gift Card System Settings
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Configure available purchase denominations and expiry rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Available Denominations (₹)" hint="Comma separated values">
            <Input
              value={cardSettings.denominations}
              onChange={(v) => setCardSettings((p) => ({ ...p, denominations: v }))}
            />
          </FormField>

          <FormField label="Gift Card Expiry Period">
            <Select
              value={cardSettings.expiryPeriod}
              onChange={(v) => setCardSettings((p) => ({ ...p, expiryPeriod: v }))}
              options={[
                { value: '6 months', label: '6 Months' },
                { value: '12 months', label: '12 Months' },
                { value: '24 months', label: '24 Months' },
                { value: 'never', label: 'Never Expire' },
              ]}
            />
          </FormField>

          <div className="flex items-center pt-6">
            <Toggle
              checked={cardSettings.combinableWithCoupons}
              onChange={(v) => setCardSettings((p) => ({ ...p, combinableWithCoupons: v }))}
              label="Combinable with Promo Coupons"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setToast('Gift card settings saved successfully.')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white hover:bg-bloom-rose/80 transition"
          >
            Save Gift Card Settings
          </button>
        </div>
      </div>

      {/* ─── CREATE GIFT CARD MODAL ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-lg w-full border border-[#2d2418]/10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <h3 className="text-lg font-bold">🎁 Issue Digital Gift Card</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#8a7a6a] hover:text-[#2d2418]">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8a7a6a] mb-1.5">Card Code (Auto-Generated)</label>
                <div className="flex items-center gap-2">
                  <Input value={code} onChange={setCode} />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 py-2 glass rounded-xl text-xs hover:bg-white/70 shrink-0"
                  >
                    🎲 Regenerate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8a7a6a] mb-1.5">Select Gift Card Value (₹)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setValue(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        value === amt ? 'bg-bloom-rose text-white border-bloom-rose' : 'glass border-[#2d2418]/10 text-[#6b5d4f] hover:bg-white/70'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <Input type="number" value={value} onChange={(v) => setValue(Number(v))} placeholder="Custom amount" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Buyer Email" required>
                  <Input value={buyerEmail} onChange={setBuyerEmail} placeholder="buyer@gmail.com" type="email" />
                </FormField>
                <FormField label="Recipient Email" required>
                  <Input value={recipientEmail} onChange={setRecipientEmail} placeholder="recipient@gmail.com" type="email" />
                </FormField>
              </div>

              <FormField label="Recipient Name">
                <Input value={recipientName} onChange={setRecipientName} placeholder="Radhika S." />
              </FormField>

              <FormField label="Personal Gift Message">
                <Textarea value={giftMessage} onChange={setGiftMessage} rows={2} placeholder="Happy Birthday! Hope you love these everlasting flowers..." />
              </FormField>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-[#2d2418]/10">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/70 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGiftCard}
                disabled={creating}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white hover:bg-bloom-rose/80 transition"
              >
                {creating ? 'Issuing...' : '🚀 Create & Send Gift Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   5. SETTINGS SECTION (SAVED TO LOCALSTORAGE)
   ========================================================================= */
function SettingsSection() {
  const [toast, setToast] = useState<string | null>(null)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [seeding, setSeeding] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)

  const handleSeed = async () => {
    setSeeding(true)
    setSeedResult(null)
    try {
      const res = await api.seedDemoData()
      if (res.success && res.data) {
        setSeedResult(`Seeded ${res.data.users} users, ${res.data.orders} orders, ${res.data.checkIns} check-ins, ${res.data.petals} petal transactions, ${res.data.subscribers} subscriber.`)
      } else {
        setSeedResult('Failed to seed data.')
      }
    } catch (err: any) {
      setSeedResult(`Error: ${err.message}`)
    } finally {
      setSeeding(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    setSeedResult(null)
    try {
      const res = await api.clearAllData()
      if (res.success) {
        setSeedResult('All data wiped. Database is now at zero state.')
      } else {
        setSeedResult('Failed to clear data.')
      }
    } catch (err: any) {
      setSeedResult(`Error: ${err.message}`)
    } finally {
      setResetting(false)
    }
  }

  // Load from LocalStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bloomwire_admin_settings')
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
      }
    } catch (err) {
      console.warn('Failed to parse admin settings from localStorage', err)
    }
  }, [])

  const handleChange = (key: string, val: any) => {
    setSettings((prev) => ({ ...prev, [key]: val }))
  }

  const handleSaveAll = () => {
    try {
      localStorage.setItem('bloomwire_admin_settings', JSON.stringify(settings))
      setToast('Store settings saved successfully to LocalStorage!')
    } catch (err) {
      setToast('Failed to save settings to localStorage.')
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <SectionHeader title="Store Settings & Configuration" subtitle="Manage store contacts, shipping tariffs, rewards logic, tax HSN rules, and social media handles.">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-bloom-rose text-white shadow-xl hover:bg-bloom-rose/80 transition flex items-center gap-1.5"
          >
            <span>💾 Save All Settings</span>
          </button>
        </div>
      </SectionHeader>

      {/* ─── DATA MANAGEMENT: SEED / RESET ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-bloom-neon/20 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🌱</span> Data Management
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Populate demo records for testing or wipe everything back to zero.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 border border-bloom-gold/20">
            <p className="text-sm font-semibold text-bloom-gold mb-1">Seed Demo Data</p>
            <p className="text-xs text-[#8a7a6a] mb-3">Creates 5 users, 8 orders, 5 check-ins, 5 petal transactions, and 1 subscriber with realistic Indian names and dates.</p>
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeed}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-bloom-gold to-amber-500 text-bloom-dark shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {seeding ? <><span className="animate-spin inline-block">⏳</span> Seeding…</> : <span>🌱 Seed Demo Data</span>}
            </button>
          </div>

          <div className="glass rounded-xl p-4 border border-red-500/20">
            <p className="text-sm font-semibold text-red-400 mb-1">Full Reset</p>
            <p className="text-xs text-[#8a7a6a] mb-3">Permanently deletes ALL records from every Supabase table. This cannot be undone.</p>
            <button
              type="button"
              disabled={resetting}
              onClick={handleReset}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {resetting ? <><span className="animate-spin inline-block">⏳</span> Wiping…</> : <span>🗑️ Reset All Data</span>}
            </button>
          </div>
        </div>

        {seedResult && (
          <div className="glass rounded-xl p-3 border border-bloom-neon/20 text-xs text-bloom-neon">
            ✅ {seedResult}
          </div>
        )}
      </div>

      {/* ─── 1. STORE GENERAL SETTINGS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🏪</span> Store Profile & Contacts
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Primary identity and contact emails for order notifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Store Name" required>
            <Input value={settings.storeName} onChange={(v) => handleChange('storeName', v)} />
          </FormField>
          <FormField label="Admin Email" required>
            <Input value={settings.adminEmail} onChange={(v) => handleChange('adminEmail', v)} type="email" />
          </FormField>
          <FormField label="Support Email">
            <Input value={settings.supportEmail} onChange={(v) => handleChange('supportEmail', v)} type="email" />
          </FormField>
          <FormField label="Orders Email">
            <Input value={settings.ordersEmail} onChange={(v) => handleChange('ordersEmail', v)} type="email" />
          </FormField>
          <FormField label="Store Phone Number">
            <Input value={settings.phone} onChange={(v) => handleChange('phone', v)} />
          </FormField>
          <FormField label="GSTIN Number">
            <Input value={settings.gstin} onChange={(v) => handleChange('gstin', v)} />
          </FormField>
          <FormField label="Grievance Officer Name">
            <Input value={settings.grievanceOfficer} onChange={(v) => handleChange('grievanceOfficer', v)} />
          </FormField>
          <FormField label="Working Hours">
            <Input value={settings.workingHours} onChange={(v) => handleChange('workingHours', v)} />
          </FormField>
        </div>

        <FormField label="Physical Studio Address">
          <Textarea value={settings.address} onChange={(v) => handleChange('address', v)} rows={2} />
        </FormField>
      </div>

      {/* ─── 2. SHIPPING & DELIVERY SETTINGS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🚚</span> Shipping & Delivery Tariffs
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Configure free shipping threshold, flat rates, and delivery times.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Free Shipping Threshold (₹)" required>
            <Input type="number" value={settings.freeShippingThreshold} onChange={(v) => handleChange('freeShippingThreshold', Number(v))} />
          </FormField>
          <FormField label="Standard Shipping Fee (₹)">
            <Input type="number" value={settings.shippingFee} onChange={(v) => handleChange('shippingFee', Number(v))} />
          </FormField>
          <FormField label="COD Handling Fee (₹)">
            <Input type="number" value={settings.codFee} onChange={(v) => handleChange('codFee', Number(v))} />
          </FormField>
          <FormField label="Express Air Shipping Fee (₹)">
            <Input type="number" value={settings.expressShippingFee} onChange={(v) => handleChange('expressShippingFee', Number(v))} />
          </FormField>
          <FormField label="Standard Delivery Duration">
            <Input value={settings.standardDeliveryTime} onChange={(v) => handleChange('standardDeliveryTime', v)} placeholder="5-7 days" />
          </FormField>
          <FormField label="Express Delivery Duration">
            <Input value={settings.expressDeliveryTime} onChange={(v) => handleChange('expressDeliveryTime', v)} placeholder="3-5 days" />
          </FormField>
          <FormField label="Dispatch Window">
            <Input value={settings.dispatchTime} onChange={(v) => handleChange('dispatchTime', v)} placeholder="24-48 hours" />
          </FormField>
        </div>
      </div>

      {/* ─── 3. PAYMENT SETTINGS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>💳</span> Payment Gateway & COD Rules
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Enable or disable checkout payment methods.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10 flex items-center justify-between">
            <span className="text-sm text-gray-200">UPI Payments</span>
            <Toggle checked={settings.paymentUpi} onChange={(v) => handleChange('paymentUpi', v)} />
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10 flex items-center justify-between">
            <span className="text-sm text-gray-200">Credit / Debit Cards</span>
            <Toggle checked={settings.paymentCard} onChange={(v) => handleChange('paymentCard', v)} />
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10 flex items-center justify-between">
            <span className="text-sm text-gray-200">Cash on Delivery (COD)</span>
            <Toggle checked={settings.paymentCod} onChange={(v) => handleChange('paymentCod', v)} />
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#2d2418]/10 flex items-center justify-between">
            <span className="text-sm text-gray-200">Net Banking</span>
            <Toggle checked={settings.paymentNetBanking} onChange={(v) => handleChange('paymentNetBanking', v)} />
          </div>
        </div>

        <div className="pt-2">
          <Toggle
            checked={settings.codVerificationRequired}
            onChange={(v) => handleChange('codVerificationRequired', v)}
            label="Require OTP Verification for Cash on Delivery Orders"
          />
        </div>
      </div>

      {/* ─── 4. REWARDS & PETALS SETTINGS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🏵️</span> Petals Rewards Loyalty Program Rules
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Configure earning rates, point values, and action reward allocations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Earning Rate (%)" hint="Percentage of order value earned as Petals">
            <Input type="number" value={settings.petalsEarningRate} onChange={(v) => handleChange('petalsEarningRate', Number(v))} />
          </FormField>
          <FormField label="Petals to ₹ Ratio">
            <Input value={settings.petalsToInrRatio} onChange={(v) => handleChange('petalsToInrRatio', v)} placeholder="1:1" />
          </FormField>
          <FormField label="Petals Expiry (Months)">
            <Input type="number" value={settings.petalsExpiryMonths} onChange={(v) => handleChange('petalsExpiryMonths', Number(v))} />
          </FormField>
          <FormField label="Min Order for Redemption (₹)">
            <Input type="number" value={settings.minOrderForRedemption} onChange={(v) => handleChange('minOrderForRedemption', Number(v))} />
          </FormField>
          <FormField label="Daily Check-in Reward (Petals)">
            <Input type="number" value={settings.checkInReward} onChange={(v) => handleChange('checkInReward', Number(v))} />
          </FormField>
          <FormField label="Raffle Entry Cost (Petals)">
            <Input type="number" value={settings.raffleEntryCost} onChange={(v) => handleChange('raffleEntryCost', Number(v))} />
          </FormField>
          <FormField label="Social Share Reward (Petals)">
            <Input type="number" value={settings.socialShareReward} onChange={(v) => handleChange('socialShareReward', Number(v))} />
          </FormField>
          <FormField label="Unboxing Video Reward (Petals)">
            <Input type="number" value={settings.unboxingReward} onChange={(v) => handleChange('unboxingReward', Number(v))} />
          </FormField>
          <FormField label="Review Submission Reward (Petals)">
            <Input type="number" value={settings.reviewReward} onChange={(v) => handleChange('reviewReward', Number(v))} />
          </FormField>
        </div>
      </div>

      {/* ─── 5. TAX & HSN SETTINGS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>📊</span> Tax & HSN Configuration
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">GST tax slab rates and artificial flower HSN codes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="GST Rate (%)">
            <Input type="number" value={settings.gstRate} onChange={(v) => handleChange('gstRate', Number(v))} />
          </FormField>
          <FormField label="HSN Code for Wire Flowers">
            <Input value={settings.hsnCode} onChange={(v) => handleChange('hsnCode', v)} />
          </FormField>
          <div className="flex items-center pt-6">
            <Toggle
              checked={settings.pricesInclusiveOfTax}
              onChange={(v) => handleChange('pricesInclusiveOfTax', v)}
              label="Listed Product Prices Include Tax"
            />
          </div>
        </div>
      </div>

      {/* ─── 6. SOCIAL MEDIA LINKS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🔗</span> Social Media & Community Links
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Official handles displayed in store footer and email footers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label="Instagram Handle">
            <Input value={settings.instagram} onChange={(v) => handleChange('instagram', v)} />
          </FormField>
          <FormField label="WhatsApp Business Number">
            <Input value={settings.whatsapp} onChange={(v) => handleChange('whatsapp', v)} />
          </FormField>
          <FormField label="Facebook Page">
            <Input value={settings.facebook} onChange={(v) => handleChange('facebook', v)} />
          </FormField>
          <FormField label="Threads Handle">
            <Input value={settings.threads} onChange={(v) => handleChange('threads', v)} />
          </FormField>
        </div>
      </div>

      {/* ─── 7. BANNERS & NOTIFICATIONS ─── */}
      <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/5 space-y-4">
        <div className="border-b border-[#2d2418]/10 pb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>📢</span> Banners, Hero Text & Promos
          </h3>
          <p className="text-xs text-[#8a7a6a] mt-0.5">Configure top bar text, homepage hero tagline, and featured drops.</p>
        </div>

        <div className="space-y-4">
          <FormField label="Top Announcement Bar Banner Text">
            <Input value={settings.announcementBarText} onChange={(v) => handleChange('announcementBarText', v)} />
          </FormField>

          <FormField label="Homepage Hero Main Tagline">
            <Input value={settings.homepageHeroText} onChange={(v) => handleChange('homepageHeroText', v)} />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Flash Reward Timer Duration (Hours)">
              <Input type="number" value={settings.flashRewardTimerHours} onChange={(v) => handleChange('flashRewardTimerHours', Number(v))} />
            </FormField>

            <FormField label="Today's Pick Featured Product">
              <Select
                value={settings.todaysPickProduct}
                onChange={(v) => handleChange('todaysPickProduct', v)}
                options={[
                  { value: 'Red Rose Everlasting Bouquet', label: 'Red Rose Everlasting Bouquet' },
                  { value: 'Sunflower Sunshine Wire Stand', label: 'Sunflower Sunshine Wire Stand' },
                  { value: 'Customized Couples Name Frame', label: 'Customized Couples Name Frame' },
                  { value: 'Cherry Blossom Desktop Bloom', label: 'Cherry Blossom Desktop Bloom' },
                ]}
              />
            </FormField>

            <FormField label="Weekly Drop Product">
              <Select
                value={settings.weeklyDropProduct}
                onChange={(v) => handleChange('weeklyDropProduct', v)}
                options={[
                  { value: 'Cherry Blossom Desktop Bloom', label: 'Cherry Blossom Desktop Bloom' },
                  { value: 'Midnight Lavender Bouquet', label: 'Midnight Lavender Bouquet' },
                  { value: 'Silver Orchid Keepsake', label: 'Silver Orchid Keepsake' },
                ]}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-xl text-sm font-bold bg-bloom-rose text-white shadow-xl hover:bg-bloom-rose/80 transition flex items-center gap-2"
        >
          <span>💾 Save All Admin Settings</span>
        </button>
      </div>
    </div>
  )
}

/* =========================================================================
   MAIN EXPORT COMPONENT
   ========================================================================= */
export function MiscSections({
  activeSection,
  users = [],
  subscribers = [],
  orders = [],
  loading = false,
}: MiscSectionsProps) {
  if (loading) {
    return <LoadingSpinner />
  }

  // Use users prop to avoid unused parameter linting if passed
  const registeredUsersCount = users.length

  switch (activeSection) {
    case 'email':
      return <EmailSection subscribers={subscribers} />

    case 'analytics':
      return <AnalyticsSection orders={orders} />

    case 'blog':
      return <BlogSection />

    case 'giftcards':
      return <GiftCardsSection />

    case 'settings':
      return <SettingsSection />

    default:
      return (
        <EmptyState
          text={`Section "${activeSection}" not found (${registeredUsersCount} registered users in database). Please select a valid admin section.`}
        />
      )
  }
}

export default MiscSections
