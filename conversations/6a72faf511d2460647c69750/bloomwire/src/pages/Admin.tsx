import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useSEO } from '../hooks/useSEO'

// Section components (built by sub-agents)
import { DashboardSection } from '../components/admin/Dashboard'
import { OrdersSection } from '../components/admin/Orders'
import ProductsSection from '../components/admin/Products'
import { ReviewsGallerySection } from '../components/admin/ReviewsGallery'
import { CreatorsReferralsSection } from '../components/admin/CreatorsReferrals'
import { OffersRaffleSection } from '../components/admin/OffersRaffle'
import { PetalsUsersSection } from '../components/admin/PetalsUsers'
import MiscSections from '../components/admin/MiscSections'
import { StatCard, SearchBar, SectionHeader, EmptyState, LoadingSpinner } from '../components/admin/shared'

// Admin password validated server-side via api.adminLogin()

type Section = 'dashboard' | 'orders' | 'products' | 'reviews' | 'creators' | 'coupons' | 'petals' | 'users' | 'raffle' | 'email' | 'analytics' | 'blog' | 'giftcards' | 'settings' | 'checkins' | 'customorders' | 'subscribers'

interface NavItem { key: Section; label: string; icon: string; group?: string }
interface NavGroup { label: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    ]
  },
  {
    label: 'Commerce',
    items: [
      { key: 'orders', label: 'Orders', icon: '📦' },
      { key: 'customorders', label: 'Custom Orders', icon: '🎨' },
      { key: 'products', label: 'Products', icon: '🌸' },
      { key: 'reviews', label: 'Reviews & Gallery', icon: '⭐' },
    ]
  },
  {
    label: 'Marketing',
    items: [
      { key: 'coupons', label: 'Offers & Coupons', icon: '🎟️' },
      { key: 'raffle', label: 'Raffle / Giveaway', icon: '🎁' },
      { key: 'creators', label: 'Creators & Referrals', icon: '👥' },
      { key: 'email', label: 'Email & Automations', icon: '✉️' },
    ]
  },
  {
    label: 'Customers',
    items: [
      { key: 'users', label: 'Users', icon: '👤' },
      { key: 'petals', label: 'Petals & Rewards', icon: '🌸' },
      { key: 'checkins', label: 'Check-ins', icon: '📅' },
      { key: 'subscribers', label: 'Subscribers', icon: '📧' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { key: 'analytics', label: 'Analytics', icon: '📈' },
      { key: 'blog', label: 'Blog / Content', icon: '📝' },
      { key: 'giftcards', label: 'Gift Cards', icon: '🎴' },
      { key: 'settings', label: 'Settings', icon: '⚙️' },
    ]
  },
]

export default function Admin() {
  useSEO({ title: 'Bloomwire — Admin Panel', description: 'Full control center for Bloomwire.', canonicalPath: '/#/admin' })

  const [authed, setAuthed] = useState(() => sessionStorage.getItem('bloomwire_admin') === 'true')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data state
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // ─── Login ───
  const [loginLoading, setLoginLoading] = useState(false)
  const handleLogin = async () => {
    setLoginLoading(true)
    const res = await api.adminLogin(password)
    if (res.success && res.data?.token) {
      sessionStorage.setItem('bloomwire_admin', 'true')
      sessionStorage.setItem('bloomwire_admin_token', res.data.token)
      setAuthed(true)
      setError('')
    } else {
      setError(res.error || 'Incorrect password')
    }
    setLoginLoading(false)
  }

  // ─── Data Refresh ───
  const refresh = useCallback(async () => {
    setLoading(true)
    const [statsRes, ordersRes, usersRes, subsRes] = await Promise.all([
      api.getAdminStats(),
      api.getAllOrders(500),
      api.getAllUsers(500),
      api.getPendingSubmissions(),
    ])
    if (statsRes.success) setStats(statsRes.data)
    if (ordersRes.success) setOrders(ordersRes.data || [])
    if (usersRes.success) setUsers(usersRes.data || [])
    if (subsRes.success) setSubmissions(subsRes.data || [])

    // Fetch subscribers from Supabase
    try {
      const subs = await api.getSubscribers()
      if (Array.isArray(subs)) setSubscribers(subs)
    } catch { /* ignore */ }

    setLoading(false)
    setLastRefresh(new Date())
  }, [])

  useEffect(() => { if (authed) refresh() }, [authed, refresh])

  useEffect(() => {
    if (!authed) return
    const interval = setInterval(refresh, 15000) // 15 second auto-refresh for near real-time sync
    return () => clearInterval(interval)
  }, [authed, refresh])

  const approveSub = async (id: string) => {
    await api.approveSubmission(id)
    await refresh()
  }

  const rejectSub = async (id: string) => {
    await api.rejectSubmission(id)
    await refresh()
  }

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section)
    setSidebarOpen(false)
  }

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  // ─── Pending counts for notification badges ───
  const pendingOrders = orders.filter(o => (o.status || 'Processing') === 'Processing').length
  const pendingSubs = submissions.length
  const totalPending = pendingOrders + pendingSubs

  // ─── Login Screen ───
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center mb-4 neon-glow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
            </div>
            <h1 className="text-2xl font-serif font-bold">Admin Panel</h1>
            <p className="text-sm text-[#a0918a] mt-1">Bloomwire Mission Control</p>
          </div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3.5 glass rounded-xl text-[#2d2418] placeholder-[#a0918a] glow-focus transition mb-3" autoFocus />
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <button onClick={handleLogin} disabled={loginLoading} className="w-full py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shimmer-btn neon-glow transition disabled:opacity-50">{loginLoading ? "Logging in..." : "Login"}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative z-10">
      {/* ─── Mobile Sidebar Overlay ─── */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ─── Sidebar ─── */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-10 h-screen w-64 glass border-r border-[#2d2418]/10 overflow-y-auto transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex-shrink-0`}>
        <div className="p-4 border-b border-[#2d2418]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bloom-rose to-bloom-wine flex items-center justify-center text-white text-sm font-bold">B</div>
            <div>
              <h1 className="text-sm font-bold">Bloomwire</h1>
              <p className="text-[10px] text-[#a0918a]">Admin Control Center</p>
            </div>
          </div>
        </div>

        <nav className="p-2">
          {NAV_GROUPS.map(group => {
            const isCollapsed = collapsedGroups.has(group.label)
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#a0918a] uppercase tracking-wider hover:text-[#6b5d4f] transition"
                >
                  <span>{group.label}</span>
                  <svg className={`w-3 h-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                {!isCollapsed && (
                  <div className="ml-2 mb-2 space-y-0.5">
                    {group.items.map(item => (
                      <button
                        key={item.key}
                        onClick={() => handleNavigate(item.key)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${activeSection === item.key ? 'bg-bloom-rose/15 text-bloom-neon border border-bloom-rose/20' : 'text-[#8a7a6a] hover:bg-white/60 hover:text-[#6b5d4f]'}`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs">{item.label}</span>
                        {item.key === 'orders' && pendingOrders > 0 && <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 rounded-full">{pendingOrders}</span>}
                        {item.key === 'reviews' && pendingSubs > 0 && <span className="ml-auto text-[10px] bg-bloom-rose/20 text-bloom-neon px-1.5 rounded-full">{pendingSubs}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-[#2d2418]/10">
          <button
            onClick={() => { sessionStorage.removeItem('bloomwire_admin'); setAuthed(false) }}
            className="w-full px-3 py-2 glass rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 min-w-0">
        {/* ─── Top Bar ─── */}
        <header className="sticky top-0 z-30 glass border-b border-[#2d2418]/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 glass rounded-lg">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-serif font-bold capitalize">
                {NAV_GROUPS.flatMap(g => g.items).find(i => i.key === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-[10px] text-[#a0918a]">
                {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString('en-IN')} • Auto-refresh 60s` : 'Loading…'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <button onClick={() => handleNavigate('reviews')} className="relative p-2 glass rounded-lg hover:bg-white/60 transition" title={`${totalPending} pending approvals`}>
              <span className="text-lg">🔔</span>
              {totalPending > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bloom-rose rounded-full text-[9px] text-white flex items-center justify-center font-bold">{totalPending}</span>}
            </button>
            <button onClick={refresh} disabled={loading} className="px-3 py-2 glass rounded-lg text-sm hover:bg-white/60 transition disabled:opacity-50">
              {loading ? '↻' : '↻'}
            </button>
          </div>
        </header>

        {/* ─── Content Area ─── */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {activeSection === 'dashboard' && (
            <DashboardSection stats={stats} orders={orders} users={users} subscribers={subscribers} onNavigate={handleNavigate} />
          )}
          {activeSection === 'orders' && (
            <OrdersSection orders={orders} loading={loading} onRefresh={refresh} onNavigate={handleNavigate} />
          )}
          {activeSection === 'customorders' && (
            <CustomOrdersSection loading={loading} />
          )}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'reviews' && (
            <ReviewsGallerySection submissions={submissions} loading={loading} onRefresh={refresh} onApprove={approveSub} onReject={rejectSub} />
          )}
          {activeSection === 'creators' && <CreatorsReferralsSection users={users} loading={loading} />}
          {activeSection === 'coupons' && (
            <OffersRaffleSection subscribers={subscribers} loading={loading} />
          )}
          {activeSection === 'raffle' && (
            <RaffleSection loading={loading} />
          )}
          {activeSection === 'petals' && (
            <PetalsUsersSection users={users} stats={stats} loading={loading} onRefresh={refresh} initialTab="petals" />
          )}
          {activeSection === 'users' && (
            <PetalsUsersSection users={users} stats={stats} loading={loading} onRefresh={refresh} initialTab="users" />
          )}
          {activeSection === 'checkins' && (
            <PetalsUsersSection users={users} stats={stats} loading={loading} onRefresh={refresh} initialTab="checkins" />
          )}
          {(activeSection === 'subscribers') && <SubscribersSection subscribers={subscribers} loading={loading} />}
          {(activeSection === 'email' || activeSection === 'analytics' || activeSection === 'blog' || activeSection === 'giftcards' || activeSection === 'settings') && (
            <MiscSections activeSection={activeSection} users={users} subscribers={subscribers} orders={orders} loading={loading} />
          )}
        </main>
      </div>
    </div>
  )
}

// ─── Subscribers Section (inline — simple enough) ───
function SubscribersSection({ subscribers, loading }: { subscribers: any[]; loading: boolean }) {
  const [search, setSearch] = useState('')
  const filtered = subscribers.filter(s =>
    !search || (s.email || '').toLowerCase().includes(search.toLowerCase()) || (s.discount_code || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <SectionHeader title="Newsletter Subscribers" subtitle={`${filtered.length} of ${subscribers.length} subscribers (Supabase)`}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search email or code…" />
      </SectionHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total" value={subscribers.length} icon="📧" />
        <StatCard label="Emailed" value={subscribers.filter(s => s.emailed).length} icon="✉️" color="text-emerald-400" />
        <StatCard label="Pending Email" value={subscribers.filter(s => !s.emailed).length} icon="⏳" color="text-yellow-400" />
        <StatCard label="Code Used" value={subscribers.filter(s => s.used).length} icon="🎟️" color="text-bloom-gold" />
      </div>
      <div className="glass-strong rounded-2xl p-6 overflow-x-auto">
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState text="No subscribers found." /> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[#a0918a] border-b border-[#2d2418]/10">
              <th className="pb-3 pr-4">Email</th><th className="pb-3 pr-4">Code</th><th className="pb-3 pr-4">Discount</th>
              <th className="pb-3 pr-4">Emailed</th><th className="pb-3 pr-4">Used</th><th className="pb-3 pr-4">Source</th><th className="pb-3 pr-4">Date</th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-[#2d2418]/10 hover:bg-white/60 transition">
                  <td className="py-3 pr-4 text-xs">{s.email}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-bloom-neon">{s.discount_code}</td>
                  <td className="py-3 pr-4 text-xs text-bloom-gold">{s.discount_percent}%</td>
                  <td className="py-3 pr-4">{s.emailed ? <span className="text-xs text-emerald-400">✓ Sent</span> : <span className="text-xs text-yellow-400">⏳</span>}</td>
                  <td className="py-3 pr-4">{s.used ? <span className="text-xs text-emerald-400">✓</span> : <span className="text-xs text-[#a0918a]">—</span>}</td>
                  <td className="py-3 pr-4 text-xs">{s.source || 'popup'}</td>
                  <td className="py-3 pr-4 text-xs text-[#a0918a]">{s.claimed_at ? new Date(s.claimed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Custom Orders Section ───
function CustomOrdersSection({ loading }: { loading: boolean }) {
  const [orders, setOrders] = useState<any[]>([])
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL || 'https://bloomwire-api.base44.app/api/functions/bloomwireApi', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getCustomOrders', data: {} })
        })
        const json = await res.json()
        if (json.success) setOrders(json.data || [])
      } catch (e) {}
      setLocalLoading(false)
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2d2418] mb-1">Custom Orders</h2>
        <p className="text-sm text-[#8a7a6a]">Customer custom order requests and quotes</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={orders.length} icon="📋" color="text-bloom-rose" />
        <StatCard label="Pending" value={orders.filter(o => o.status === 'pending').length} icon="⏳" color="text-yellow-400" />
        <StatCard label="Quoted" value={orders.filter(o => o.status === 'quoted').length} icon="💬" color="text-bloom-neon" />
        <StatCard label="Accepted" value={orders.filter(o => o.status === 'accepted').length} icon="✅" color="text-emerald-400" />
      </div>
      <div className="glass-strong rounded-2xl p-6 overflow-x-auto">
        {(localLoading || loading) ? <LoadingSpinner /> : orders.length === 0 ? <EmptyState text="No custom order requests yet. When customers submit custom order requests, they'll appear here." /> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[#a0918a] border-b border-[#2d2418]/10">
              <th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Product Type</th>
              <th className="pb-3 pr-4">Budget</th><th className="pb-3 pr-4">Deadline</th>
              <th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4">Quote</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-[#2d2418]/10 hover:bg-white/60 transition">
                  <td className="py-3 pr-4 text-xs"><div className="font-medium text-[#2d2418]">{o.customerName}</div><div className="text-[#a0918a]">{o.customerEmail}</div></td>
                  <td className="py-3 pr-4 text-xs">{o.productType}</td>
                  <td className="py-3 pr-4 text-xs text-bloom-gold">₹{o.budget || '—'}</td>
                  <td className="py-3 pr-4 text-xs">{o.deadline || '—'}</td>
                  <td className="py-3 pr-4"><span className={`text-xs px-2 py-1 rounded-full ${o.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' : o.status === 'accepted' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-bloom-rose/15 text-bloom-rose'}`}>{o.status}</span></td>
                  <td className="py-3 pr-4 text-xs">{o.quoteAmount ? `₹${o.quoteAmount}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Raffle Section ───
function RaffleSection({ loading }: { loading: boolean }) {
  const [raffles, setRaffles] = useState<any[]>([])
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL || 'https://bloomwire-api.base44.app/api/functions/bloomwireApi', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getRaffles', data: {} })
        })
        const json = await res.json()
        if (json.success) setRaffles(json.data || [])
      } catch (e) {}
      setLocalLoading(false)
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2d2418] mb-1">Raffle & Giveaway Management</h2>
        <p className="text-sm text-[#8a7a6a]">Create and manage product raffles and giveaway campaigns</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Raffles" value={raffles.length} icon="🎁" color="text-bloom-rose" />
        <StatCard label="Active" value={raffles.filter(r => r.status === 'active').length} icon="🔥" color="text-bloom-neon" />
        <StatCard label="Completed" value={raffles.filter(r => r.status === 'completed').length} icon="✅" color="text-emerald-400" />
        <StatCard label="Total Entries" value={raffles.reduce((sum, r) => sum + (r.totalEntries || 0), 0)} icon="🎟️" color="text-bloom-gold" />
      </div>
      <div className="glass-strong rounded-2xl p-6">
        {(localLoading || loading) ? <LoadingSpinner /> : raffles.length === 0 ? (
          <EmptyState text="No raffles created yet. Create a raffle to collect entries and run giveaways for your customers." />
        ) : (
          <div className="space-y-4">
            {raffles.map(r => (
              <div key={r.id} className="glass rounded-xl p-4 border border-[#2d2418]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-[#2d2418] text-lg">{r.name || 'Untitled Raffle'}</h3>
                    <p className="text-xs text-[#8a7a6a] mt-1">Draw: {r.drawDate || 'TBD'} · {r.totalEntries || 0} entries</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full ${r.status === 'active' ? 'bg-bloom-neon/15 text-bloom-neon' : r.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-[#8a7a6a]'}`}>{r.status}</span>
                </div>
                {r.winners && r.winners.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#2d2418]/10">
                    <p className="text-xs text-bloom-gold">🏆 Winner(s): {r.winners.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
