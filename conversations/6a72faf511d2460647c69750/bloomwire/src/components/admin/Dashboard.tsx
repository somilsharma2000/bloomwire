import { useState, useMemo, useEffect } from 'react'
import { StatCard, ProgressBar, BarChart, EmptyState, LoadingSpinner, SectionHeader } from './shared'
import { api } from '../../lib/api'
import { products } from '../../data/products'

export interface DashboardStats {
  totalRevenue?: number
  totalOrders?: number
  totalUsers?: number
  totalPetalsDistributed?: number
  ordersToday?: number
  newUsersToday?: number
  checkInsToday?: number
  pendingSubmissions?: number
  pendingOrders?: number
  shippedOrders?: number
  deliveredOrders?: number
  revenueTrend?: number[]
  ordersByStatus?: Record<string, number>
  [key: string]: any
}

export interface DashboardSectionProps {
  stats?: DashboardStats | null
  orders?: any[]
  users?: any[]
  subscribers?: any[]
  onNavigate: (tab: string) => void
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'approval' | 'order' | 'system' | 'email'
  actionTab?: string
  actionLabel?: string
  read: boolean
}

export function DashboardSection({
  stats,
  orders = [],
  users = [],
  subscribers = [],
  onNavigate,
}: DashboardSectionProps) {
  const [activeNotificationFilter, setActiveNotificationFilter] = useState<'all' | 'unread' | 'action'>('all')
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([])
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState<{ day: number; amount: number; x: number; y: number } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [liveStats, setLiveStats] = useState<DashboardStats | null>(stats || null)

  // Sync props stats to liveStats
  useEffect(() => {
    if (stats) setLiveStats(stats)
  }, [stats])

  // Optional manual refresh triggering API
  const handleRefreshStats = async () => {
    setIsRefreshing(true)
    try {
      const res = await api.getAdminStats()
      if (res && res.success && res.data) {
        setLiveStats(res.data)
      }
    } catch {
      // Graceful error fallback
    } finally {
      setIsRefreshing(false)
    }
  }

  // Safe Stats Extractions & Calculations
  const totalRevenue = useMemo(() => {
    const current = liveStats || stats
    if (current?.totalRevenue !== undefined && current.totalRevenue !== null) return Number(current.totalRevenue)
    if (orders && orders.length > 0) {
      return orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.total || o.amount || 0)), 0)
    }
    return 0
  }, [liveStats, stats, orders])

  const totalOrders = useMemo(() => {
    const current = liveStats || stats
    if (current?.totalOrders !== undefined && current.totalOrders !== null) return Number(current.totalOrders)
    return orders ? orders.length : 0
  }, [liveStats, stats, orders])

  const totalUsers = useMemo(() => {
    const current = liveStats || stats
    if (current?.totalUsers !== undefined && current.totalUsers !== null) return Number(current.totalUsers)
    return users ? users.length : 0
  }, [liveStats, stats, users])

  const totalPetals = useMemo(() => {
    const current = liveStats || stats
    if (current?.totalPetalsDistributed !== undefined && current.totalPetalsDistributed !== null) return Number(current.totalPetalsDistributed)
    return 0
  }, [liveStats, stats])

  // Today's Stats
  const ordersToday = useMemo(() => {
    const current = liveStats || stats
    if (current?.ordersToday !== undefined && current.ordersToday !== null) return Number(current.ordersToday)
    if (current?.todayOrders !== undefined && current.todayOrders !== null) return Number(current.todayOrders)
    const todayStr = new Date().toISOString().split('T')[0]
    if (orders && orders.length > 0) {
      const todayCount = orders.filter(o => {
        const dateStr = o.created_at || o.date || o.createdAt
        return dateStr && String(dateStr).startsWith(todayStr)
      }).length
      if (todayCount > 0) return todayCount
    }
    return 0
  }, [liveStats, stats, orders])

  const newUsersToday = useMemo(() => {
    const current = liveStats || stats
    if (current?.newUsersToday !== undefined && current.newUsersToday !== null) return Number(current.newUsersToday)
    if (current?.todayUsers !== undefined && current.todayUsers !== null) return Number(current.todayUsers)
    const todayStr = new Date().toISOString().split('T')[0]
    if (users && users.length > 0) {
      const todayCount = users.filter(u => {
        const dateStr = u.created_at || u.createdAt || u.joined
        return dateStr && String(dateStr).startsWith(todayStr)
      }).length
      if (todayCount > 0) return todayCount
    }
    return 0
  }, [liveStats, stats, users])

  const checkInsToday = useMemo(() => {
    const current = liveStats || stats
    if (current?.checkInsToday !== undefined && current.checkInsToday !== null) return Number(current.checkInsToday)
    if (current?.todayCheckIns !== undefined && current.todayCheckIns !== null) return Number(current.todayCheckIns)
    return 0
  }, [liveStats, stats])

  const pendingSubmissions = useMemo(() => {
    const current = liveStats || stats
    if (current?.pendingSubmissions !== undefined && current.pendingSubmissions !== null) return Number(current.pendingSubmissions)
    if (current?.pendingApprovals !== undefined && current.pendingApprovals !== null) return Number(current.pendingApprovals)
    return 0
  }, [liveStats, stats])

  // 30-day Revenue Trend Data Generation / Formatting
  const revenueTrendData = useMemo(() => {
    const current = liveStats || stats
    if (current?.revenueTrend && Array.isArray(current.revenueTrend) && current.revenueTrend.length > 0) {
      return current.revenueTrend
    }
    // No real revenue data — return zeros for clean launch state
    return new Array(30).fill(0)
  }, [liveStats, stats, totalRevenue])

  // Orders by status calculation
  const statusData = useMemo(() => {
    const current = liveStats || stats
    if (current?.ordersByStatus && typeof current.ordersByStatus === 'object') {
      return Object.entries(current.ordersByStatus).map(([status, count]) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        count: Number(count)
      }))
    }
    if (orders && orders.length > 0) {
      const counts: Record<string, number> = {}
      orders.forEach(o => {
        const st = o.status ? (String(o.status).charAt(0).toUpperCase() + String(o.status).slice(1)) : 'Processing'
        counts[st] = (counts[st] || 0) + 1
      })
      return Object.entries(counts).map(([label, count]) => ({ label, count }))
    }
    return []  // Empty state — no orders yet
  }, [liveStats, stats, orders])

  // BarChart compatible data for Orders by Status
  const ordersByStatusBarData = useMemo(() => {
    return statusData.map(s => ({
      status: s.label,
      count: s.count
    }))
  }, [statusData])

  // Top 5 selling products by calculated revenue
  const topProducts = useMemo(() => {
    const ranked = products.map(p => {
      const estimatedUnits = 0  // No sales data yet — reset for launch
      const revenue = p.price * estimatedUnits
      return {
        ...p,
        unitsSold: estimatedUnits,
        totalRevenue: revenue
      }
    })
    ranked.sort((a, b) => b.totalRevenue - a.totalRevenue)
    return ranked.slice(0, 5)
  }, [])

  // Traffic sources data
  const trafficSourcesData = useMemo(() => {
    return [
      { source: 'No traffic data yet', percentage: 0, visits: '0 visits', color: 'bg-gray-500' },
    ]
  }, [])

  // Real-time recent signups from backend
  const recentSignups = useMemo(() => {
    const current = liveStats || stats
    if (current?.recentSignups && Array.isArray(current.recentSignups)) {
      return current.recentSignups
    }
    return []
  }, [liveStats, stats])

  // Initial Notifications list
  const initialNotifications: NotificationItem[] = useMemo(() => [
    {
      id: 'fresh-start',
      title: 'Fresh Start — Zero Data',
      message: 'All data has been reset to zero. Use the "Seed Demo Data" button in Settings to populate sample records.',
      time: 'now',
      type: 'system',
      actionTab: 'settings',
      actionLabel: 'Go to Settings',
      read: false
    }
  ], [])

  const visibleNotifications = useMemo(() => {
    return initialNotifications.filter(n => !dismissedNotifications.includes(n.id)).filter(n => {
      if (activeNotificationFilter === 'unread') return !n.read
      if (activeNotificationFilter === 'action') return Boolean(n.actionTab)
      return true
    })
  }, [initialNotifications, dismissedNotifications, activeNotificationFilter])

  const unreadCount = useMemo(() => {
    return initialNotifications.filter(n => !dismissedNotifications.includes(n.id) && !n.read).length
  }, [initialNotifications, dismissedNotifications])

  // Recent 5 orders and subscribers
  const recentOrders = useMemo(() => {
    if (orders && orders.length > 0) return orders.slice(0, 5)
    return []  // No orders yet — clean launch state
  }, [orders])

  const recentSubscribers = useMemo(() => {
    if (subscribers && subscribers.length > 0) return subscribers.slice(0, 5)
    if (users && users.length > 0) {
      return users.slice(0, 5).map(u => ({
        id: u.id || u.email,
        email: u.email,
        source: 'Registered User',
        claimed_at: u.created_at || u.createdAt || 'Today'
      }))
    }
    return []  // No subscribers yet — clean launch state
  }, [subscribers, users])

  // SVG parameters for Revenue Trend line chart
  const maxTrendRevenue = Math.max(...revenueTrendData, 1)
  const chartHeight = 180
  const chartWidth = 600
  const trendPoints = revenueTrendData.map((val, idx) => {
    const x = (idx / (revenueTrendData.length - 1)) * chartWidth
    const y = chartHeight - (val / maxTrendRevenue) * (chartHeight - 30) - 15
    return { x, y, val, day: idx + 1 }
  })

  const pathD = trendPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`
  }, '')

  const areaD = `${pathD} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`

  if (isRefreshing) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION HEADER & CONTROL BAR */}
      <SectionHeader
        title="Admin Control Center"
        subtitle="Real-time e-commerce analytics, customer engagement & store management"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshStats}
            className="px-3.5 py-1.5 glass rounded-xl text-xs font-medium text-[#6b5d4f] hover:text-[#2d2418] hover:bg-white/70 border border-[#2d2418]/10 transition flex items-center gap-1.5"
            title="Refresh Stats"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => onNavigate('email')}
            className="px-3.5 py-1.5 glass rounded-xl text-xs font-medium text-bloom-rose hover:bg-bloom-rose/10 border border-bloom-rose/30 transition flex items-center gap-1.5"
          >
            <span>✉️</span>
            <span>Email Blast</span>
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="px-3.5 py-1.5 bg-gradient-to-r from-bloom-rose to-bloom-neon text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-bloom-rose/25 transition shimmer-btn flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>New Product</span>
          </button>
        </div>
      </SectionHeader>

      {/* NOTIFICATIONS & LIVE SYSTEM ALERTS SECTION */}
      <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/10 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2d2418]/5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-bloom-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2d2418] uppercase tracking-wider flex items-center gap-2">
                Live Admin Notifications
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30">
                  {unreadCount} Unread
                </span>
              </h3>
              <p className="text-xs text-[#8a7a6a]">System events requiring attention or review</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-[#2d2418]/5 text-xs">
            <button
              onClick={() => setActiveNotificationFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeNotificationFilter === 'all' ? 'bg-bloom-rose text-white shadow-sm' : 'text-[#8a7a6a] hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveNotificationFilter('unread')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeNotificationFilter === 'unread' ? 'bg-bloom-rose text-white shadow-sm' : 'text-[#8a7a6a] hover:text-white'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveNotificationFilter('action')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeNotificationFilter === 'action' ? 'bg-bloom-rose text-white shadow-sm' : 'text-[#8a7a6a] hover:text-white'
              }`}
            >
              Action Required
            </button>
          </div>
        </div>

        {visibleNotifications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-[#a0918a]">No active notifications under this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleNotifications.map((note) => (
              <div
                key={note.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  note.read
                    ? 'bg-white/[0.02] border-[#2d2418]/5 hover:border-[#2d2418]/10'
                    : 'bg-bloom-rose/[0.04] border-bloom-rose/30 hover:border-bloom-rose/50 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg pt-0.5">
                    {note.type === 'approval' && '📸'}
                    {note.type === 'order' && '💎'}
                    {note.type === 'email' && '✉️'}
                    {note.type === 'system' && '⚡'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#2d2418]">{note.title}</h4>
                      <span className="text-[10px] text-[#a0918a]">{note.time}</span>
                    </div>
                    <p className="text-xs text-[#8a7a6a] mt-0.5 leading-relaxed">{note.message}</p>
                    {note.actionTab && (
                      <button
                        onClick={() => onNavigate(note.actionTab!)}
                        className="mt-2 text-xs text-bloom-neon font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>{note.actionLabel || 'Take Action'}</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setDismissedNotifications(prev => [...prev, note.id])}
                  className="text-[#a0918a] hover:text-[#6b5d4f] text-xs px-1.5 py-0.5 rounded hover:bg-white/70"
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ROW 1 — KEY METRICS (4 Stat Cards) */}
      <div>
        <h3 className="text-xs font-bold text-[#8a7a6a] uppercase tracking-widest mb-3">Overall Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue (This Month)"
            value={`₹${totalRevenue.toLocaleString('en-IN')}`}
            icon="💰"
            color="text-emerald-400"
            subtitle="No data yet"
          />
          <StatCard
            label="Total Orders"
            value={totalOrders.toLocaleString('en-IN')}
            icon="📦"
            color="text-bloom-rose"
            subtitle="Completed & active store orders"
          />
          <StatCard
            label="Total Users"
            value={totalUsers.toLocaleString('en-IN')}
            icon="👥"
            color="text-bloom-neon"
            subtitle="Registered floral members"
          />
          <StatCard
            label="Total Petals"
            value={totalPetals.toLocaleString('en-IN')}
            icon="🌸"
            color="text-bloom-gold"
            subtitle="Active loyalty points balance"
          />
        </div>
      </div>

      {/* ROW 2 — TODAY'S STATS (4 Stat Cards, 1 Clickable) */}
      <div>
        <h3 className="text-xs font-bold text-[#8a7a6a] uppercase tracking-widest mb-3">Today's Live Pulse</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Orders Today"
            value={ordersToday}
            icon="⚡"
            color="text-cyan-400"
            subtitle="Real-time sales today"
          />
          <StatCard
            label="New Users Today"
            value={newUsersToday}
            icon="✨"
            color="text-purple-400"
            subtitle="New customer signups"
          />
          <StatCard
            label="Check-ins Today"
            value={checkInsToday}
            icon="📅"
            color="text-pink-400"
            subtitle="Daily petal reward streaks"
          />

          {/* Pending Approvals Card — Clickable Navigation */}
          <div
            onClick={() => onNavigate('submissions')}
            className="glass-strong rounded-xl p-4 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span>Pending Approvals</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </span>
              <span className="text-lg group-hover:scale-110 transition-transform">📸</span>
            </div>
            <p className="text-2xl font-bold text-amber-400">{pendingSubmissions}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-amber-200/80">Unboxing videos awaiting review</p>
              <span className="text-[10px] font-bold text-amber-400 group-hover:translate-x-1 transition-transform">Review →</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3 — CHARTS (2x2 Grid) */}
      <div>
        <h3 className="text-xs font-bold text-[#8a7a6a] uppercase tracking-widest mb-3">Analytics & Intelligence</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CHART 1: Revenue Trend (Last 30 Days) */}
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>📈</span> Revenue Trend (Last 30 Days)
                </h4>
                <p className="text-xs text-[#8a7a6a]">Daily revenue trajectory and growth velocity</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  Peak: ₹{Math.max(...revenueTrendData).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="relative w-full pt-2">
              {/* SVG Area & Line Chart */}
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e91e63" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e91e63" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((pct, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={chartHeight * pct}
                    x2={chartWidth}
                    y2={chartHeight * pct}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Gradient Area Fill */}
                <path d={areaD} fill="url(#revenueGradient)" />

                {/* Smooth Trend Path Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#e91e63"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Trend Interactive Points */}
                {trendPoints.map((pt) => (
                  <circle
                    key={pt.day}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    className="fill-bloom-neon stroke-white hover:r-6 transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredTrendPoint({ day: pt.day, amount: pt.val, x: pt.x, y: pt.y })}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  />
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredTrendPoint && (
                <div
                  className="absolute bg-gray-900/90 backdrop-blur border border-bloom-rose text-[#2d2418] text-xs p-2 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-12 z-20"
                  style={{
                    left: `${(hoveredTrendPoint.x / chartWidth) * 100}%`,
                    top: `${(hoveredTrendPoint.y / chartHeight) * 100}%`
                  }}
                >
                  <p className="font-bold text-bloom-gold">Day {hoveredTrendPoint.day}</p>
                  <p className="text-emerald-400 font-semibold">₹{hoveredTrendPoint.amount.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#a0918a] mt-4 pt-3 border-t border-[#2d2418]/5">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
          </div>

          {/* CHART 2: Orders by Status */}
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>📊</span> Orders by Status
                </h4>
                <p className="text-xs text-[#8a7a6a]">Fulfillment lifecycle breakdown</p>
              </div>
              <span className="text-xs text-bloom-neon font-semibold bg-bloom-rose/10 px-2.5 py-1 rounded-full border border-bloom-rose/20">
                {statusData.reduce((a, b) => a + b.count, 0)} Total Orders
              </span>
            </div>

            <div className="py-2">
              <BarChart
                data={ordersByStatusBarData}
                labelKey="status"
                valueKey="count"
                color="bg-gradient-to-r from-bloom-rose to-bloom-neon"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2d2418]/5 text-[11px]">
              {statusData.map(st => (
                <div key={st.label} className="bg-black/30 p-2 rounded-xl border border-[#2d2418]/5 flex justify-between items-center">
                  <span className="text-[#8a7a6a] truncate">{st.label}</span>
                  <span className="font-bold text-[#2d2418]">{st.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 3: Top 5 Selling Products */}
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>🏆</span> Top 5 Selling Products
                </h4>
                <p className="text-xs text-[#8a7a6a]">Ranked by revenue contribution</p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs text-bloom-neon hover:underline font-semibold"
              >
                View Catalog →
              </button>
            </div>

            <div className="space-y-3">
              {topProducts.map((prod, idx) => (
                <div key={prod.slug || idx} className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-[#2d2418]/5 hover:border-[#2d2418]/10 transition">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover border border-[#2d2418]/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-xs font-bold text-[#2d2418] truncate">{idx + 1}. {prod.name}</h5>
                      <span className="text-xs font-bold text-emerald-400 ml-2">₹{prod.totalRevenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#8a7a6a] mt-1">
                      <span>{prod.category} • {prod.unitsSold} units</span>
                      <span className="text-bloom-gold">★ {prod.rating}</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar
                        value={prod.totalRevenue}
                        max={topProducts[0].totalRevenue}
                        color="bg-gradient-to-r from-bloom-rose to-bloom-gold"
                        showValue={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 4: Traffic Sources */}
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>🌐</span> Traffic Sources
                </h4>
                <p className="text-xs text-[#8a7a6a]">Visitor acquisition channels</p>
              </div>
              <span className="text-xs text-[#8a7a6a]">Last 30 Days</span>
            </div>

            <div className="space-y-4 my-2">
              {trafficSourcesData.map((item) => (
                <div key={item.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6b5d4f] font-medium flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      {item.source}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8a7a6a] text-[11px]">{item.visits}</span>
                      <span className="font-bold text-[#2d2418]">{item.percentage}%</span>
                    </div>
                  </div>
                  <ProgressBar
                    value={item.percentage}
                    max={100}
                    color={item.color}
                    showValue={false}
                  />
                </div>
              ))}
            </div>

            <div className="bg-bloom-rose/10 rounded-xl p-3 border border-bloom-rose/20 text-xs text-[#6b5d4f] mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>💡</span>
                <span>Referral traffic delivers highest conversion (+4.2%)</span>
              </span>
              <button
                onClick={() => onNavigate('coupons')}
                className="text-bloom-neon font-bold hover:underline whitespace-nowrap ml-2"
              >
                Boost Petals →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ROW 4 — QUICK ACTIONS (5 Buttons) */}
      <div>
        <h3 className="text-xs font-bold text-[#8a7a6a] uppercase tracking-widest mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('products')}
            className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5 hover:border-bloom-rose/50 hover:bg-bloom-rose/10 transition-all text-left group flex flex-col justify-between"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</div>
            <div>
              <h4 className="text-xs font-bold text-[#2d2418] group-hover:text-bloom-neon transition-colors">Add Product</h4>
              <p className="text-[10px] text-[#a0918a] mt-0.5">Catalog & stock</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('coupons')}
            className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5 hover:border-bloom-neon/50 hover:bg-bloom-neon/10 transition-all text-left group flex flex-col justify-between"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
            <div>
              <h4 className="text-xs font-bold text-[#2d2418] group-hover:text-bloom-neon transition-colors">Create Offer</h4>
              <p className="text-[10px] text-[#a0918a] mt-0.5">Discounts & rules</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('email')}
            className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all text-left group flex flex-col justify-between"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📧</div>
            <div>
              <h4 className="text-xs font-bold text-[#2d2418] group-hover:text-emerald-400 transition-colors">Send Festive Email</h4>
              <p className="text-[10px] text-[#a0918a] mt-0.5">Newsletter blast</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('coupons')}
            className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5 hover:border-bloom-gold/50 hover:bg-bloom-gold/10 transition-all text-left group flex flex-col justify-between"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎟️</div>
            <div>
              <h4 className="text-xs font-bold text-[#2d2418] group-hover:text-bloom-gold transition-colors">Add Custom Coupon</h4>
              <p className="text-[10px] text-[#a0918a] mt-0.5">Promo voucher</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('raffle')}
            className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5 hover:border-purple-400/50 hover:bg-purple-400/10 transition-all text-left group flex flex-col justify-between"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎰</div>
            <div>
              <h4 className="text-xs font-bold text-[#2d2418] group-hover:text-purple-400 transition-colors">New Raffle Draw</h4>
              <p className="text-[10px] text-[#a0918a] mt-0.5">Giveaways & rewards</p>
            </div>
          </button>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION (Two-Column Layout) */}
      <div>
        <h3 className="text-xs font-bold text-[#8a7a6a] uppercase tracking-widest mb-3">Recent Activity Feed</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Column 1: Latest 5 Orders */}
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>🛍️</span> Latest Orders
                </h4>
                <p className="text-xs text-[#8a7a6a]">Most recent customer purchases</p>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-bloom-neon hover:underline font-semibold"
              >
                View All Orders →
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <EmptyState text="No recent orders available." />
            ) : (
              <div className="space-y-3">
                {recentOrders.map((ord, idx) => (
                  <div
                    key={ord.id || idx}
                    onClick={() => onNavigate('orders')}
                    className="p-3 bg-black/20 rounded-xl border border-[#2d2418]/5 hover:border-[#2d2418]/10 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2d2418]">{ord.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/60 border border-[#2d2418]/10 text-[#6b5d4f]">
                          {ord.status || 'Processing'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8a7a6a] mt-0.5">{ord.customerName || ord.email || 'Guest Customer'}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">₹{Number(ord.totalAmount || ord.total || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-[#a0918a] mt-0.5">{ord.time || 'Today'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Latest 5 Subscribers */}
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>💌</span> Recent Subscribers
                </h4>
                <p className="text-xs text-[#8a7a6a]">New newsletter & promotional opted-in users</p>
              </div>
              <button
                onClick={() => onNavigate('subscribers')}
                className="text-xs text-bloom-neon hover:underline font-semibold"
              >
                View All Subscribers →
              </button>
            </div>

            {recentSubscribers.length === 0 ? (
              <EmptyState text="No subscribers found." />
            ) : (
              <div className="space-y-3">
                {recentSubscribers.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    onClick={() => onNavigate('subscribers')}
                    className="p-3 bg-black/20 rounded-xl border border-[#2d2418]/5 hover:border-[#2d2418]/10 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#2d2418] truncate">{sub.email}</p>
                      <span className="text-[10px] text-bloom-rose inline-block mt-0.5">
                        {sub.source || 'Newsletter Form'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                        Active
                      </span>
                      <p className="text-[10px] text-[#a0918a] mt-1">{sub.claimed_at || 'Recently'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* REAL-TIME SIGNUP FEED */}
      {recentSignups.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-[#8a7a6a] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Signups (Real-Time)
          </h3>
          <div className="glass-strong rounded-2xl p-5 border border-[#2d2418]/5">
            <div className="space-y-3">
              {recentSignups.map((signup, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-[#2d2418]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bloom-rose to-bloom-wine flex items-center justify-center text-white text-sm font-bold">
                      {(signup.name || signup.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2d2418]">{signup.name || 'Unknown'}</p>
                      <p className="text-xs text-[#8a7a6a]">{signup.email}</p>
                      {signup.phone && <p className="text-[10px] text-[#a0918a]">📞 {signup.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-bloom-rose/10 text-bloom-neon font-medium">
                      {signup.petalsBalance || 50} Petals
                    </span>
                    <p className="text-[10px] text-[#a0918a] mt-1">
                      {signup.createdAt ? new Date(signup.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#a0918a] mt-3 text-center">
              Auto-refreshing every 15 seconds · New signups appear here instantly
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardSection
