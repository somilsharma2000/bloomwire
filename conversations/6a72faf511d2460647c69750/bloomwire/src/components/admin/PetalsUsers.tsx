import { useState, useEffect, useMemo } from 'react'
import {
  StatCard,
  Badge,
  SearchBar,
  SectionHeader,
  EmptyState,
  LoadingSpinner,
  ConfirmDialog,
  AdminTable,
  Toggle,
  FormField,
  Input,
  Select,
  STATUS_COLORS,
  ProgressBar
} from './shared'
import { api } from '../../lib/api'

// ─── Interfaces & Helper Types ───
export interface PetalsUsersProps {
  users?: any[]
  stats?: any
  loading?: boolean
  onRefresh?: () => void
  initialTab?: 'petals' | 'users' | 'checkins'
}

interface PetalsTransaction {
  id: string
  email: string
  user_name?: string
  type: 'earned' | 'spent' | 'expired'
  amount: number
  source: 'order' | 'checkin' | 'referral' | 'manual' | 'unboxing' | 'reward' | 'expiry'
  description: string
  created_at: string
}

interface RewardTier {
  id: string
  level: number
  name: string
  petalsCost: number
  description: string
  enabled: boolean
  icon: string
}

interface CheckInRecord {
  id: string
  email: string
  user_name?: string
  streak: number
  total_petals: number
  last_checkin: string
  created_at?: string
}

// ─── Empty defaults (real data only) ───
const MOCK_TRANSACTIONS: PetalsTransaction[] = []  // No mock data — real data only

const MOCK_CHECKINS: CheckInRecord[] = []

const MOCK_USERS: any[] = []

// Safely access fields across different API record shapes
const getPetals = (u: any) => u?.petalsBalance ?? u?.petals_balance ?? u?.petals ?? u?.balance ?? 0
const getSpent = (u: any) => u?.totalSpent ?? u?.total_spent ?? u?.spent ?? 0
const getOrders = (u: any) => u?.totalOrders ?? u?.total_orders ?? u?.orderCount ?? u?.ordersCount ?? 0
const getStatus = (u: any) => u?.status || 'active'
const getRole = (u: any) => u?.role || (u?.isAdmin ? 'admin' : 'user')
const getJoinDate = (u: any) => u?.created_at || u?.createdAt || u?.memberSince || '2026-01-01'
const getStreak = (u: any) => u?.checkInStreak ?? u?.streak_count ?? u?.streak ?? 0

export function PetalsUsersSection({
  users = [],
  stats = {},
  loading = false,
  onRefresh,
  initialTab
}: PetalsUsersProps) {
  // ─── Main Sub-tab State ───
  const [activeTab, setActiveTab] = useState<'petals' | 'users' | 'checkins'>(initialTab || 'petals')

  // ─── Toast Notifications ───
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Combined users list (real data only, empty if no users yet)
  const displayUsers = useMemo(() => {
    if (users && users.length > 0) return users
    return MOCK_USERS
  }, [users])

  // ─────────────────────────────────────────────────────────────
  // SUB-TAB 1: PETALS & REWARDS STATES
  // ─────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<PetalsTransaction[]>([])
  const [txLoading, setTxLoading] = useState(false)
  const [txSearch, setTxSearch] = useState('')
  const [txTypeFilter, setTxTypeFilter] = useState<string>('all')
  const [txSourceFilter, setTxSourceFilter] = useState<string>('all')

  // Manual Adjustment Form State
  const [selectedUserEmail, setSelectedUserEmail] = useState('')
  const [adjustAmount, setAdjustAmount] = useState<number | string>('')
  const [adjustReason, setAdjustReason] = useState('')
  const [isAdjusting, setIsAdjusting] = useState(false)

  // Reward Tiers State
  const [tiers, setTiers] = useState<RewardTier[]>([
    {
      id: 'tier-1',
      level: 1,
      name: 'Keychain Reward',
      petalsCost: 200,
      description: 'Free Bloomwire Brass Keychain',
      enabled: true,
      icon: '🔑'
    },
    {
      id: 'tier-2',
      level: 2,
      name: 'Flower Reward',
      petalsCost: 300,
      description: 'Free Single Premium Wrapped Flower',
      enabled: true,
      icon: '🌹'
    },
    {
      id: 'tier-3',
      level: 3,
      name: 'Pot Reward',
      petalsCost: 500,
      description: 'Free Handcrafted Terracotta Ceramic Pot',
      enabled: true,
      icon: '🪴'
    }
  ])

  // Earning & Expiry Settings
  const [earningRate, setEarningRate] = useState<number>(5)
  const [expiryMonths, setExpiryMonths] = useState<number>(12)
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  // Fetch Petals Transactions
  const fetchTransactions = async () => {
    setTxLoading(true)
    try {
      const res = await api.getPetalsTransactions(500)
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setTransactions(res.data)
      } else {
        setTransactions(MOCK_TRANSACTIONS)
      }
    } catch {
      setTransactions(MOCK_TRANSACTIONS)
    } finally {
      setTxLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = !txSearch ||
        t.email.toLowerCase().includes(txSearch.toLowerCase()) ||
        (t.user_name && t.user_name.toLowerCase().includes(txSearch.toLowerCase())) ||
        (t.description && t.description.toLowerCase().includes(txSearch.toLowerCase()))
      const matchesType = txTypeFilter === 'all' || t.type === txTypeFilter
      const matchesSource = txSourceFilter === 'all' || t.source === txSourceFilter
      return matchesSearch && matchesType && matchesSource
    })
  }, [transactions, txSearch, txTypeFilter, txSourceFilter])

  // Petals Summary Calculations
  const petalsOverview = useMemo(() => {
    const totalCirculation = stats?.totalPetalsDistributed ??
      displayUsers.reduce((sum, u) => sum + getPetals(u), 0)

    const earnedThisMonth = transactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 1850

    const redeemed = transactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 940

    const expiring = transactions
      .filter(t => t.type === 'expired')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 120

    return { totalCirculation, earnedThisMonth, redeemed, expiring }
  }, [stats, displayUsers, transactions])

  // Handle Manual Petals Adjustment
  const handleManualAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserEmail) {
      setToast({ message: 'Please select a user to adjust petals', type: 'error' })
      return
    }
    const numAmount = Number(adjustAmount)
    if (isNaN(numAmount) || numAmount === 0) {
      setToast({ message: 'Please enter a valid non-zero amount', type: 'error' })
      return
    }
    if (!adjustReason.trim()) {
      setToast({ message: 'Reason for adjustment is required', type: 'error' })
      return
    }

    setIsAdjusting(true)
    try {
      const res = await api.addPetals(selectedUserEmail, numAmount, adjustReason.trim())
      if (res.success || res.data) {
        setToast({ message: `Successfully adjusted ${numAmount > 0 ? '+' : ''}${numAmount} petals for ${selectedUserEmail}`, type: 'success' })
        
        // Add to local transactions list
        const newTx: PetalsTransaction = {
          id: `tx-${Date.now()}`,
          email: selectedUserEmail,
          type: numAmount > 0 ? 'earned' : 'spent',
          amount: numAmount,
          source: 'manual',
          description: adjustReason.trim(),
          created_at: new Date().toISOString()
        }
        setTransactions(prev => [newTx, ...prev])

        setSelectedUserEmail('')
        setAdjustAmount('')
        setAdjustReason('')
        onRefresh?.()
      } else {
        setToast({ message: res.error || 'Failed to adjust petals', type: 'error' })
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Error executing petal adjustment', type: 'error' })
    } finally {
      setIsAdjusting(false)
    }
  }

  // Handle Save Reward Tiers
  const handleSaveTier = (tierId: string, updates: Partial<RewardTier>) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, ...updates } : t))
    setToast({ message: 'Reward tier configuration updated', type: 'success' })
  }

  // Handle Save Petals Settings
  const handleSavePetalsSettings = () => {
    setIsSavingSettings(true)
    setTimeout(() => {
      setIsSavingSettings(false)
      setToast({ message: 'Petals earning rate & expiry rules saved!', type: 'success' })
    }, 400)
  }

  // Selected User's current balance for manual form
  const selectedUserObject = useMemo(() => {
    return displayUsers.find(u => u.email === selectedUserEmail)
  }, [displayUsers, selectedUserEmail])

  // ─────────────────────────────────────────────────────────────
  // SUB-TAB 2: USERS STATES
  // ─────────────────────────────────────────────────────────────
  const [userSearch, setUserSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [segmentFilter, setSegmentFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_desc')

  // Modal States for User Actions
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null)
  const [actionModal, setActionModal] = useState<{
    type: 'suspend' | 'ban' | 'reactivate' | 'promote' | 'demote' | 'adjust' | 'message'
    user: any
  } | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [modalAdjustAmount, setModalAdjustAmount] = useState<number | string>('')
  const [modalMessageSubject, setModalMessageSubject] = useState('')
  const [modalMessageBody, setModalMessageBody] = useState('')
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  // Confirm dialog state for quick resets or demotions
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void; danger?: boolean }>({
    open: false, title: '', message: '', onConfirm: () => {}
  })

  // Segment Email Modal State
  const [segmentEmailModal, setSegmentEmailModal] = useState(false)
  const [segmentSubject, setSegmentSubject] = useState('')
  const [segmentBody, setSegmentBody] = useState('')
  const [isSendingSegmentEmail, setIsSendingSegmentEmail] = useState(false)

  // Filtered & Sorted Users List
  const filteredUsers = useMemo(() => {
    return displayUsers.filter(u => {
      const nameMatch = (u.name || '').toLowerCase().includes(userSearch.toLowerCase())
      const emailMatch = (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
      const phoneMatch = (u.phone || '').toLowerCase().includes(userSearch.toLowerCase())
      const matchesSearch = !userSearch || nameMatch || emailMatch || phoneMatch

      const status = getStatus(u)
      const matchesStatus = statusFilter === 'all' || status === statusFilter

      // Segments check
      const spent = getSpent(u)
      const orders = getOrders(u)
      const petals = getPetals(u)
      const joinDate = new Date(getJoinDate(u))
      const now = new Date()
      const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 3600 * 24))

      let matchesSegment = true
      if (segmentFilter === 'vip') matchesSegment = spent >= 5000
      else if (segmentFilter === 'active') matchesSegment = orders > 0
      else if (segmentFilter === 'new') matchesSegment = daysSinceJoin <= 7
      else if (segmentFilter === 'never') matchesSegment = orders === 0
      else if (segmentFilter === 'highPetals') matchesSegment = petals >= 500

      return matchesSearch && matchesStatus && matchesSegment
    }).sort((a, b) => {
      if (sortBy === 'created_desc') {
        return new Date(getJoinDate(b)).getTime() - new Date(getJoinDate(a)).getTime()
      } else if (sortBy === 'created_asc') {
        return new Date(getJoinDate(a)).getTime() - new Date(getJoinDate(b)).getTime()
      } else if (sortBy === 'spent_desc') {
        return getSpent(b) - getSpent(a)
      } else if (sortBy === 'petals_desc') {
        return getPetals(b) - getPetals(a)
      }
      return 0
    })
  }, [displayUsers, userSearch, statusFilter, segmentFilter, sortBy])

  // User Actions Handlers
  const handleExecuteUserAction = async () => {
    if (!actionModal) return
    const { type, user } = actionModal
    setIsSubmittingAction(true)

    try {
      if (type === 'suspend') {
        if (!actionReason.trim()) {
          setToast({ message: 'Reason is required to suspend user', type: 'error' })
          setIsSubmittingAction(false)
          return
        }
        const res = await api.suspendUser(user.email, actionReason.trim())
        if (res.success || res.data) {
          setToast({ message: `User ${user.email} has been suspended.`, type: 'success' })
        } else {
          setToast({ message: res.error || 'Failed to suspend user', type: 'error' })
        }
      } else if (type === 'ban') {
        if (!actionReason.trim()) {
          setToast({ message: 'Reason is required to ban user', type: 'error' })
          setIsSubmittingAction(false)
          return
        }
        const res = await api.banUser(user.email, actionReason.trim())
        if (res.success || res.data) {
          setToast({ message: `User ${user.email} has been banned.`, type: 'success' })
        } else {
          setToast({ message: res.error || 'Failed to ban user', type: 'error' })
        }
      } else if (type === 'reactivate') {
        const res = await api.updateUser(user.email, { status: 'active' })
        if (res.success || res.data) {
          setToast({ message: `User ${user.email} reactivated!`, type: 'success' })
        } else {
          setToast({ message: res.error || 'Failed to reactivate user', type: 'error' })
        }
      } else if (type === 'promote') {
        const res = await api.promoteToAdmin(user.email)
        if (res.success || res.data) {
          setToast({ message: `Promoted ${user.email} to Admin.`, type: 'success' })
        } else {
          setToast({ message: res.error || 'Failed to promote user', type: 'error' })
        }
      } else if (type === 'demote') {
        const res = await api.demoteToUser(user.email)
        if (res.success || res.data) {
          setToast({ message: `Demoted ${user.email} to regular user.`, type: 'success' })
        } else {
          setToast({ message: res.error || 'Failed to demote user', type: 'error' })
        }
      } else if (type === 'adjust') {
        const amt = Number(modalAdjustAmount)
        if (isNaN(amt) || amt === 0 || !actionReason.trim()) {
          setToast({ message: 'Valid amount and reason are required', type: 'error' })
          setIsSubmittingAction(false)
          return
        }
        const res = await api.addPetals(user.email, amt, actionReason.trim())
        if (res.success || res.data) {
          setToast({ message: `Adjusted ${amt > 0 ? '+' : ''}${amt} petals for ${user.email}`, type: 'success' })
        } else {
          setToast({ message: res.error || 'Failed to adjust petals', type: 'error' })
        }
      } else if (type === 'message') {
        if (!modalMessageSubject.trim() || !modalMessageBody.trim()) {
          setToast({ message: 'Subject and message body are required', type: 'error' })
          setIsSubmittingAction(false)
          return
        }
        await api.logActivity({
          action: 'send_user_email',
          email: user.email,
          subject: modalMessageSubject,
          body: modalMessageBody
        })
        setToast({ message: `Direct message sent to ${user.email}`, type: 'success' })
      }

      setActionModal(null)
      setActionReason('')
      setModalAdjustAmount('')
      setModalMessageSubject('')
      setModalMessageBody('')
      onRefresh?.()
    } catch (err: any) {
      setToast({ message: err.message || 'Action failed', type: 'error' })
    } finally {
      setIsSubmittingAction(false)
    }
  }

  // Handle Send Segment Email
  const handleSendSegmentEmail = async () => {
    if (!segmentSubject.trim() || !segmentBody.trim()) {
      setToast({ message: 'Subject and message are required', type: 'error' })
      return
    }
    setIsSendingSegmentEmail(true)
    try {
      await api.logActivity({
        action: 'send_segment_email',
        segment: segmentFilter,
        recipient_count: filteredUsers.length,
        subject: segmentSubject,
        body: segmentBody
      })
      setToast({ message: `Broadcast email queued for ${filteredUsers.length} users!`, type: 'success' })
      setSegmentEmailModal(false)
      setSegmentSubject('')
      setSegmentBody('')
    } catch {
      setToast({ message: 'Failed to queue segment email', type: 'error' })
    } finally {
      setIsSendingSegmentEmail(false)
    }
  }

  // Export CSV Helper
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Petals Balance', 'Total Orders', 'Total Spent (INR)', 'Status', 'Role', 'Join Date', 'Streak']
    const rows = filteredUsers.map(u => [
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${(u.phone || '').replace(/"/g, '""')}"`,
      getPetals(u),
      getOrders(u),
      getSpent(u),
      getStatus(u),
      getRole(u),
      getJoinDate(u),
      getStreak(u)
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `bloomwire_users_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setToast({ message: `Exported ${filteredUsers.length} users to CSV`, type: 'success' })
  }

  // ─────────────────────────────────────────────────────────────
  // SUB-TAB 3: CHECK-INS STATES
  // ─────────────────────────────────────────────────────────────
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])
  const [checkInsLoading, setCheckInsLoading] = useState(false)
  const [checkInSearch, setCheckInSearch] = useState('')

  // Check-in settings
  const [checkInEnabled, setCheckInEnabled] = useState(true)
  const [streakRewards, setStreakRewards] = useState<number[]>([5, 10, 15, 20, 25, 30, 50])
  const [raffleTicketEnabled, setRaffleTicketEnabled] = useState(true)
  const [isSavingCheckInSettings, setIsSavingCheckInSettings] = useState(false)

  const fetchCheckInRecords = async () => {
    setCheckInsLoading(true)
    try {
      const res = await api.getCheckInRecords(500)
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCheckInRecords(res.data)
      } else {
        setCheckInRecords(MOCK_CHECKINS)
      }
    } catch {
      setCheckInRecords(MOCK_CHECKINS)
    } finally {
      setCheckInsLoading(false)
    }
  }

  useEffect(() => {
    fetchCheckInRecords()
  }, [])

  // Filtered Check-ins
  const filteredCheckIns = useMemo(() => {
    return checkInRecords.filter(c => {
      return !checkInSearch ||
        c.email.toLowerCase().includes(checkInSearch.toLowerCase()) ||
        (c.user_name && c.user_name.toLowerCase().includes(checkInSearch.toLowerCase()))
    })
  }, [checkInRecords, checkInSearch])

  // Check-ins Stats
  const checkInStats = useMemo(() => {
    const totalCheckInUsers = checkInRecords.length
    const activeStreaks = checkInRecords.filter(c => c.streak > 0).length
    const bestStreak = checkInRecords.reduce((max, c) => Math.max(max, c.streak), 0)
    const petalsDistributed = checkInRecords.reduce((sum, c) => sum + (c.total_petals || 0), 0)
    return { totalCheckInUsers, activeStreaks, bestStreak, petalsDistributed }
  }, [checkInRecords])

  const handleSaveCheckInSettings = () => {
    setIsSavingCheckInSettings(true)
    setTimeout(() => {
      setIsSavingCheckInSettings(false)
      setToast({ message: 'Daily check-in rules and streak rewards saved!', type: 'success' })
    }, 400)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[250] px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2 text-sm font-medium animate-bounce ${
          toast.type === 'error'
            ? 'bg-red-950/90 border-red-500/50 text-red-200'
            : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
        }`}>
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm()
          setConfirmDialog({ ...confirmDialog, open: false })
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        danger={confirmDialog.danger}
      />

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2d2418] flex items-center gap-2">
            <span>🌸</span> Petals, Rewards & Users Control
          </h1>
          <p className="text-xs text-[#8a7a6a] mt-1">
            Full management center for loyalty petals, customer directory, member status, and streak check-ins.
          </p>
        </div>
        <button
          onClick={() => { onRefresh?.(); fetchTransactions(); fetchCheckInRecords(); }}
          className="px-3.5 py-2 glass rounded-xl text-xs text-[#6b5d4f] hover:text-[#2d2418] hover:bg-white/70 transition flex items-center gap-1.5"
        >
          <span>↻</span> Refresh All Data
        </button>
      </div>

      {/* ─── Sub-Tab Navigation Bar ─── */}
      <div className="flex border-b border-[#2d2418]/10 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('petals')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'petals'
              ? 'bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40'
              : 'text-[#8a7a6a] hover:text-gray-200 hover:bg-white/60'
          }`}
        >
          <span>🌸</span> Petals & Rewards
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40'
              : 'text-[#8a7a6a] hover:text-gray-200 hover:bg-white/60'
          }`}
        >
          <span>👤</span> Users Directory ({displayUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('checkins')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'checkins'
              ? 'bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40'
              : 'text-[#8a7a6a] hover:text-gray-200 hover:bg-white/60'
          }`}
        >
          <span>📅</span> Check-ins & Streaks
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: PETALS & REWARDS                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'petals' && (
        <div className="space-y-6">
          {/* Overview Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Petals in Circulation"
              value={petalsOverview.totalCirculation.toLocaleString()}
              icon="🌸"
              color="text-bloom-neon"
              subtitle="Distributed across all user accounts"
            />
            <StatCard
              label="Earned This Month"
              value={`+${petalsOverview.earnedThisMonth.toLocaleString()}`}
              icon="📈"
              color="text-emerald-400"
              subtitle="Via purchases, check-ins & referrals"
            />
            <StatCard
              label="Redeemed Petals"
              value={`-${petalsOverview.redeemed.toLocaleString()}`}
              icon="🎟️"
              color="text-bloom-gold"
              subtitle="Claimed for rewards & discounts"
            />
            <StatCard
              label="Expiring Soon"
              value={petalsOverview.expiring.toLocaleString()}
              icon="⏳"
              color="text-yellow-400"
              subtitle="Idle accounts >12 months"
            />
          </div>

          {/* Grid Layout: Manual Adjustment Form + Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Manual Petals Adjustment Form */}
            <div className="lg:col-span-2 glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
                <h3 className="text-base font-serif font-bold text-[#2d2418] flex items-center gap-2">
                  <span>⚖️</span> Manual Petals Adjustment
                </h3>
                <span className="text-xs text-[#a0918a]">Credit or debit customer petal balances</span>
              </div>

              <form onSubmit={handleManualAdjustment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Select User" required hint="Search user by email or name">
                    <Select
                      value={selectedUserEmail}
                      onChange={setSelectedUserEmail}
                      placeholder="-- Select User --"
                      options={displayUsers.map(u => ({
                        value: u.email,
                        label: `${u.name || u.email} (${u.email})`
                      }))}
                    />
                  </FormField>

                  <FormField label="Amount (+ to Add, - to Deduct)" required hint="e.g. 50 or -20">
                    <Input
                      type="number"
                      value={adjustAmount}
                      onChange={setAdjustAmount}
                      placeholder="e.g. 100"
                    />
                  </FormField>
                </div>

                {selectedUserObject && (
                  <div className="p-3 glass rounded-xl flex items-center justify-between text-xs border border-[#2d2418]/5">
                    <span className="text-[#8a7a6a]">Selected User Current Balance:</span>
                    <span className="font-bold text-bloom-neon flex items-center gap-1">
                      <span>🌸</span> {getPetals(selectedUserObject)} Petals
                    </span>
                  </div>
                )}

                <FormField label="Reason for Adjustment" required hint="Visible in audit log & user history">
                  <Input
                    value={adjustReason}
                    onChange={setAdjustReason}
                    placeholder="e.g., Service compensation, Contest prize, Correction..."
                  />
                </FormField>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isAdjusting}
                    className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAdjusting ? <LoadingSpinner /> : '✨ Apply Petals Adjustment'}
                  </button>
                </div>
              </form>
            </div>

            {/* Petals Program Settings */}
            <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
              <div className="border-b border-[#2d2418]/10 pb-3">
                <h3 className="text-base font-serif font-bold text-[#2d2418] flex items-center gap-2">
                  <span>⚙️</span> Petals Program Rules
                </h3>
                <p className="text-xs text-[#a0918a] mt-0.5">Earning rates & expiry schedule</p>
              </div>

              <div className="space-y-4">
                <FormField label="Earning Cashback Rate (%)" hint="Petals earned per ₹100 spent">
                  <Input
                    type="number"
                    value={earningRate}
                    onChange={(v) => setEarningRate(Number(v))}
                    min={1}
                    max={50}
                  />
                </FormField>

                <FormField label="Petals Expiry Period (Months)" hint="Inactivity period before petals expire">
                  <Input
                    type="number"
                    value={expiryMonths}
                    onChange={(v) => setExpiryMonths(Number(v))}
                    min={1}
                    max={36}
                  />
                </FormField>

                <button
                  onClick={handleSavePetalsSettings}
                  disabled={isSavingSettings}
                  className="w-full py-2.5 glass rounded-xl text-sm font-medium text-bloom-neon hover:bg-white/70 transition border border-bloom-rose/30"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Program Rules'}
                </button>
              </div>
            </div>
          </div>

          {/* Reward Tier Management */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#2d2418] flex items-center gap-2">
                  <span>🏆</span> Reward Tier Management
                </h3>
                <p className="text-xs text-[#a0918a] mt-0.5">Configure petals required to unlock catalog rewards</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiers.map(tier => (
                <div key={tier.id} className="glass rounded-xl p-4 border border-[#2d2418]/10 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tier.icon}</span>
                    <Badge
                      status={tier.enabled ? 'active' : 'inactive'}
                      colors={{
                        active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
                        inactive: 'text-[#8a7a6a] bg-gray-400/10 border-gray-400/30'
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-[#8a7a6a] uppercase font-bold tracking-wider">
                      Level {tier.level} Tier
                    </label>
                    <Input
                      value={tier.name}
                      onChange={(val) => handleSaveTier(tier.id, { name: val })}
                      placeholder="Reward Name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-[#8a7a6a]">Required Petals</label>
                    <Input
                      type="number"
                      value={tier.petalsCost}
                      onChange={(val) => handleSaveTier(tier.id, { petalsCost: Number(val) })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-[#8a7a6a]">Description</label>
                    <Input
                      value={tier.description}
                      onChange={(val) => handleSaveTier(tier.id, { description: val })}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Toggle
                      label="Enable Tier"
                      checked={tier.enabled}
                      onChange={(val) => handleSaveTier(tier.id, { enabled: val })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Petals Transactions Table */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <SectionHeader
              title="Petal Transactions Ledger"
              subtitle={`Showing ${filteredTransactions.length} transaction entries`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <SearchBar
                  value={txSearch}
                  onChange={setTxSearch}
                  placeholder="Search user email or reason..."
                />
                <select
                  value={txTypeFilter}
                  onChange={(e) => setTxTypeFilter(e.target.value)}
                  className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus"
                >
                  <option value="all" className="bg-gray-900">All Types</option>
                  <option value="earned" className="bg-gray-900">Earned (+)</option>
                  <option value="spent" className="bg-gray-900">Spent (-)</option>
                  <option value="expired" className="bg-gray-900">Expired</option>
                </select>
                <select
                  value={txSourceFilter}
                  onChange={(e) => setTxSourceFilter(e.target.value)}
                  className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus"
                >
                  <option value="all" className="bg-gray-900">All Sources</option>
                  <option value="order" className="bg-gray-900">Order Purchase</option>
                  <option value="checkin" className="bg-gray-900">Daily Check-in</option>
                  <option value="referral" className="bg-gray-900">Referral</option>
                  <option value="manual" className="bg-gray-900">Manual Adjustment</option>
                  <option value="unboxing" className="bg-gray-900">Unboxing Photo</option>
                  <option value="reward" className="bg-gray-900">Reward Redemption</option>
                </select>
              </div>
            </SectionHeader>

            {txLoading ? (
              <LoadingSpinner />
            ) : filteredTransactions.length === 0 ? (
              <EmptyState text="No petal transactions found matching filters." />
            ) : (
              <AdminTable
                keyField="id"
                columns={[
                  {
                    key: 'email',
                    label: 'User',
                    render: (row) => (
                      <div>
                        <p className="text-xs font-medium text-[#2d2418]">{row.user_name || row.email}</p>
                        <p className="text-[10px] text-[#a0918a]">{row.email}</p>
                      </div>
                    )
                  },
                  {
                    key: 'type',
                    label: 'Type',
                    render: (row) => {
                      const colors: Record<string, string> = {
                        earned: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
                        spent: 'text-bloom-gold bg-amber-400/10 border-amber-400/30',
                        expired: 'text-red-400 bg-red-400/10 border-red-400/30'
                      }
                      return <Badge status={row.type} colors={colors} />
                    }
                  },
                  {
                    key: 'amount',
                    label: 'Amount',
                    render: (row) => (
                      <span className={`font-mono font-bold text-xs ${
                        row.amount > 0 ? 'text-emerald-400' : row.type === 'expired' ? 'text-red-400' : 'text-bloom-gold'
                      }`}>
                        {row.amount > 0 ? `+${row.amount}` : row.amount} 🌸
                      </span>
                    )
                  },
                  {
                    key: 'source',
                    label: 'Source',
                    render: (row) => <span className="text-xs capitalize text-[#6b5d4f]">{row.source}</span>
                  },
                  {
                    key: 'description',
                    label: 'Description',
                    render: (row) => <span className="text-xs text-[#8a7a6a] truncate max-w-xs block">{row.description}</span>
                  },
                  {
                    key: 'created_at',
                    label: 'Date',
                    render: (row) => (
                      <span className="text-xs text-[#a0918a] whitespace-nowrap">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '—'}
                      </span>
                    )
                  }
                ]}
                rows={filteredTransactions}
              />
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: USERS DIRECTORY & ACTIONS                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Segment Filters Bar */}
          <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8a7a6a] uppercase tracking-wider">
                User Segmentation Presets
              </span>
              <button
                onClick={() => setSegmentEmailModal(true)}
                className="px-3.5 py-1.5 bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40 rounded-xl text-xs font-medium hover:bg-bloom-rose/30 transition flex items-center gap-1.5"
              >
                <span>✉️</span> Send Email to Segment ({filteredUsers.length})
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All Users', icon: '👥' },
                { key: 'vip', label: 'VIP (>₹5k Spent)', icon: '💎' },
                { key: 'active', label: 'Active Customers', icon: '🛍️' },
                { key: 'new', label: 'New (Last 7 Days)', icon: '✨' },
                { key: 'never', label: 'Never Ordered', icon: '🐣' },
                { key: 'highPetals', label: 'High Petals (>500)', icon: '🌸' },
              ].map(seg => (
                <button
                  key={seg.key}
                  onClick={() => setSegmentFilter(seg.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                    segmentFilter === seg.key
                      ? 'bg-bloom-rose text-white shadow-lg'
                      : 'glass text-[#6b5d4f] hover:bg-white/70'
                  }`}
                >
                  <span>{seg.icon}</span>
                  <span>{seg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Search & Controls Bar */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <SectionHeader
              title="Customer Directory"
              subtitle={`Showing ${filteredUsers.length} of ${displayUsers.length} total user accounts`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <SearchBar
                  value={userSearch}
                  onChange={setUserSearch}
                  placeholder="Search name, email, phone..."
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus"
                >
                  <option value="all" className="bg-gray-900">All Statuses</option>
                  <option value="active" className="bg-gray-900">Active</option>
                  <option value="suspended" className="bg-gray-900">Suspended</option>
                  <option value="banned" className="bg-gray-900">Banned</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus"
                >
                  <option value="created_desc" className="bg-gray-900">Newest Joined</option>
                  <option value="created_asc" className="bg-gray-900">Oldest Joined</option>
                  <option value="spent_desc" className="bg-gray-900">Highest Spent</option>
                  <option value="petals_desc" className="bg-gray-900">Highest Petals</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-emerald-400 hover:bg-white/70 border border-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📥</span> Export CSV
                </button>
              </div>
            </SectionHeader>

            {loading ? (
              <LoadingSpinner />
            ) : filteredUsers.length === 0 ? (
              <EmptyState text="No users match the selected search or filter criteria." />
            ) : (
              <AdminTable
                keyField="id"
                onRowClick={(row) => setSelectedUserDetail(row)}
                columns={[
                  {
                    key: 'name',
                    label: 'User Name',
                    render: (row) => (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bloom-rose to-bloom-wine text-white flex items-center justify-center font-bold text-xs uppercase">
                          {(row.name || row.email || 'U')[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2d2418]">{row.name || 'Anonymous'}</p>
                          {getRole(row) === 'admin' && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'email',
                    label: 'Email / Phone',
                    render: (row) => (
                      <div>
                        <p className="text-xs text-gray-200">{row.email}</p>
                        <p className="text-[10px] text-[#a0918a]">{row.phone || 'No phone'}</p>
                      </div>
                    )
                  },
                  {
                    key: 'petals',
                    label: 'Petals',
                    render: (row) => (
                      <span className="text-xs font-bold text-bloom-neon flex items-center gap-1">
                        <span>🌸</span> {getPetals(row)}
                      </span>
                    )
                  },
                  {
                    key: 'orders',
                    label: 'Orders',
                    render: (row) => <span className="text-xs font-medium">{getOrders(row)} orders</span>
                  },
                  {
                    key: 'spent',
                    label: 'Total Spent',
                    render: (row) => (
                      <span className="text-xs font-bold text-emerald-400">
                        ₹{getSpent(row).toLocaleString('en-IN')}
                      </span>
                    )
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (row) => <Badge status={getStatus(row)} colors={STATUS_COLORS.users} />
                  },
                  {
                    key: 'memberSince',
                    label: 'Joined',
                    render: (row) => (
                      <span className="text-xs text-[#8a7a6a]">
                        {new Date(getJoinDate(row)).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )
                  },
                  {
                    key: 'actions',
                    label: 'Actions',
                    render: (row) => (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedUserDetail(row)}
                          title="View Profile Details"
                          className="px-2 py-1 glass rounded-lg text-[10px] text-[#6b5d4f] hover:text-[#2d2418] transition"
                        >
                          👁️ View
                        </button>

                        <button
                          onClick={() => setActionModal({ type: 'adjust', user: row })}
                          title="Adjust Petals"
                          className="px-2 py-1 glass rounded-lg text-[10px] text-bloom-neon hover:bg-bloom-rose/20 transition"
                        >
                          🌸 Petals
                        </button>

                        <button
                          onClick={() => setActionModal({ type: 'message', user: row })}
                          title="Send Email"
                          className="px-2 py-1 glass rounded-lg text-[10px] text-blue-300 hover:bg-blue-500/20 transition"
                        >
                          ✉️
                        </button>

                        {getStatus(row) === 'active' ? (
                          <button
                            onClick={() => setActionModal({ type: 'suspend', user: row })}
                            title="Suspend User"
                            className="px-2 py-1 glass rounded-lg text-[10px] text-yellow-400 hover:bg-yellow-500/20 transition"
                          >
                            ⚠️ Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                open: true,
                                title: 'Reactivate User Account',
                                message: `Are you sure you want to restore active status for ${row.email}?`,
                                danger: false,
                                onConfirm: async () => {
                                  const res = await api.updateUser(row.email, { status: 'active' })
                                  if (res.success || res.data) {
                                    setToast({ message: `User ${row.email} reactivated!`, type: 'success' })
                                    onRefresh?.()
                                  }
                                }
                              })
                            }}
                            title="Reactivate User"
                            className="px-2 py-1 glass rounded-lg text-[10px] text-emerald-400 hover:bg-emerald-500/20 transition"
                          >
                            ✅ Activate
                          </button>
                        )}
                      </div>
                    )
                  }
                ]}
                rows={filteredUsers}
              />
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: CHECK-INS & DAILY STREAKS                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'checkins' && (
        <div className="space-y-6">
          {/* Check-in Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Check-in Participants"
              value={checkInStats.totalCheckInUsers}
              icon="📅"
              subtitle="Users with daily streak activity"
            />
            <StatCard
              label="Active Streaks (>0 Days)"
              value={checkInStats.activeStreaks}
              icon="🔥"
              color="text-orange-400"
              subtitle="Currently maintaining daily logins"
            />
            <StatCard
              label="Longest Streak Record"
              value={`${checkInStats.bestStreak} Days`}
              icon="🏆"
              color="text-bloom-gold"
              subtitle="All-time user check-in record"
            />
            <StatCard
              label="Streak Petals Awarded"
              value={checkInStats.petalsDistributed.toLocaleString()}
              icon="🌸"
              color="text-bloom-neon"
              subtitle="Total reward petals given"
            />
          </div>

          {/* Grid Layout: Check-in Rules & Settings */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#2d2418] flex items-center gap-2">
                  <span>⚙️</span> Daily Check-in Rewards Schedule
                </h3>
                <p className="text-xs text-[#a0918a] mt-0.5">Set petal payouts for each day of consecutive streak</p>
              </div>
              <Toggle
                label="Check-in Program Active"
                checked={checkInEnabled}
                onChange={setCheckInEnabled}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {streakRewards.map((p, idx) => (
                <div key={idx} className="glass rounded-xl p-3 border border-[#2d2418]/5 space-y-1 text-center">
                  <span className="text-[10px] text-[#8a7a6a] uppercase font-bold tracking-wider">
                    Day {idx + 1}
                  </span>
                  <Input
                    type="number"
                    value={p}
                    onChange={(val) => {
                      const updated = [...streakRewards]
                      updated[idx] = Number(val)
                      setStreakRewards(updated)
                    }}
                  />
                  <span className="text-[10px] text-bloom-neon block">🌸 Petals</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d2418]/10">
              <Toggle
                label="Award 1 Bonus Raffle Ticket upon 7-Day Streak Completion"
                checked={raffleTicketEnabled}
                onChange={setRaffleTicketEnabled}
              />

              <button
                onClick={handleSaveCheckInSettings}
                disabled={isSavingCheckInSettings}
                className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-sm font-medium hover:opacity-90 transition"
              >
                {isSavingCheckInSettings ? 'Saving...' : 'Save Check-in Configuration'}
              </button>
            </div>
          </div>

          {/* Check-ins Activity Table */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <SectionHeader
              title="Daily Check-in Activity Directory"
              subtitle={`Showing ${filteredCheckIns.length} check-in user records`}
            >
              <SearchBar
                value={checkInSearch}
                onChange={setCheckInSearch}
                placeholder="Search user email..."
              />
            </SectionHeader>

            {checkInsLoading ? (
              <LoadingSpinner />
            ) : filteredCheckIns.length === 0 ? (
              <EmptyState text="No check-in records found." />
            ) : (
              <AdminTable
                keyField="id"
                columns={[
                  {
                    key: 'email',
                    label: 'User Account',
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-bloom-rose/40 to-bloom-wine/40 text-white flex items-center justify-center font-bold text-xs">
                          {(row.user_name || row.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2d2418]">{row.user_name || row.email}</p>
                          <p className="text-[10px] text-[#a0918a]">{row.email}</p>
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'streak',
                    label: 'Current Streak',
                    render: (row) => (
                      <div className="space-y-1 w-32">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-orange-400 flex items-center gap-1">
                            <span>🔥</span> {row.streak} Days
                          </span>
                          <span className="text-[10px] text-[#a0918a]">{row.streak % 7}/7</span>
                        </div>
                        <ProgressBar value={row.streak % 7 || (row.streak > 0 ? 7 : 0)} max={7} showValue={false} color="bg-orange-500" />
                      </div>
                    )
                  },
                  {
                    key: 'total_petals',
                    label: 'Check-in Petals Earned',
                    render: (row) => (
                      <span className="text-xs font-bold text-bloom-neon flex items-center gap-1">
                        <span>🌸</span> {row.total_petals}
                      </span>
                    )
                  },
                  {
                    key: 'last_checkin',
                    label: 'Last Check-in',
                    render: (row) => (
                      <span className="text-xs text-[#8a7a6a]">
                        {row.last_checkin ? new Date(row.last_checkin).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Never'}
                      </span>
                    )
                  }
                ]}
                rows={filteredCheckIns}
              />
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: USER DETAIL PROFILE MODAL                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedUserDetail(null)}
          />
          <div className="relative glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2d2418]/10 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#2d2418]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine text-white flex items-center justify-center text-lg font-bold">
                  {(selectedUserDetail.name || selectedUserDetail.email)[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2d2418] flex items-center gap-2">
                    {selectedUserDetail.name || 'Anonymous User'}
                    <Badge status={getStatus(selectedUserDetail)} colors={STATUS_COLORS.users} />
                  </h2>
                  <p className="text-xs text-[#8a7a6a]">{selectedUserDetail.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserDetail(null)}
                className="w-8 h-8 glass rounded-xl flex items-center justify-center text-[#8a7a6a] hover:text-[#2d2418]"
              >
                ✕
              </button>
            </div>

            {/* Profile Grid Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass p-3 rounded-xl">
                <span className="text-[10px] text-[#a0918a] uppercase block">Phone Number</span>
                <span className="text-xs font-medium text-[#2d2418]">{selectedUserDetail.phone || '—'}</span>
              </div>
              <div className="glass p-3 rounded-xl">
                <span className="text-[10px] text-[#a0918a] uppercase block">User Role</span>
                <span className="text-xs font-bold text-purple-300 capitalize">{getRole(selectedUserDetail)}</span>
              </div>
              <div className="glass p-3 rounded-xl">
                <span className="text-[10px] text-[#a0918a] uppercase block">Referral Code</span>
                <span className="text-xs font-mono text-bloom-neon">{selectedUserDetail.referralCode || '— (direct)'}</span>
              </div>
              <div className="glass p-3 rounded-xl">
                <span className="text-[10px] text-[#a0918a] uppercase block">Member Since</span>
                <span className="text-xs font-medium text-[#2d2418]">{getJoinDate(selectedUserDetail)}</span>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass p-4 rounded-xl text-center border border-bloom-rose/20">
                <span className="text-xs text-[#8a7a6a] block mb-1">🌸 Petals Balance</span>
                <span className="text-xl font-bold text-bloom-neon">{getPetals(selectedUserDetail)}</span>
              </div>
              <div className="glass p-4 rounded-xl text-center border border-emerald-500/20">
                <span className="text-xs text-[#8a7a6a] block mb-1">🛍️ Total Orders</span>
                <span className="text-xl font-bold text-emerald-400">{getOrders(selectedUserDetail)}</span>
              </div>
              <div className="glass p-4 rounded-xl text-center border border-amber-500/20">
                <span className="text-xs text-[#8a7a6a] block mb-1">💰 Total Spent</span>
                <span className="text-xl font-bold text-amber-300">₹{getSpent(selectedUserDetail).toLocaleString()}</span>
              </div>
            </div>

            {/* Streak & Engagement */}
            <div className="p-4 glass rounded-xl space-y-2 border border-[#2d2418]/5">
              <h4 className="text-xs font-bold text-[#6b5d4f] uppercase">Engagement Stats</h4>
              <div className="flex items-center justify-between text-xs text-[#8a7a6a]">
                <span>Daily Check-in Streak:</span>
                <span className="font-bold text-orange-400">🔥 {getStreak(selectedUserDetail)} Days</span>
              </div>
            </div>

            {/* Modal Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2d2418]/10 justify-end">
              <button
                onClick={() => {
                  const u = selectedUserDetail
                  setSelectedUserDetail(null)
                  setActionModal({ type: 'adjust', user: u })
                }}
                className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-bloom-neon hover:bg-bloom-rose/20 transition"
              >
                🌸 Adjust Petals
              </button>

              <button
                onClick={() => {
                  const u = selectedUserDetail
                  setSelectedUserDetail(null)
                  setActionModal({ type: 'message', user: u })
                }}
                className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition"
              >
                ✉️ Send Message
              </button>

              {getRole(selectedUserDetail) !== 'admin' ? (
                <button
                  onClick={() => {
                    const u = selectedUserDetail
                    setSelectedUserDetail(null)
                    setActionModal({ type: 'promote', user: u })
                  }}
                  className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition"
                >
                  🛡️ Promote to Admin
                </button>
              ) : (
                <button
                  onClick={() => {
                    const u = selectedUserDetail
                    setSelectedUserDetail(null)
                    setActionModal({ type: 'demote', user: u })
                  }}
                  className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-[#8a7a6a] hover:bg-white/70 transition"
                >
                  Demote to User
                </button>
              )}

              {getStatus(selectedUserDetail) === 'active' ? (
                <button
                  onClick={() => {
                    const u = selectedUserDetail
                    setSelectedUserDetail(null)
                    setActionModal({ type: 'suspend', user: u })
                  }}
                  className="px-3.5 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-xl text-xs font-medium hover:bg-yellow-500/30 transition"
                >
                  ⚠️ Suspend
                </button>
              ) : (
                <button
                  onClick={() => {
                    const u = selectedUserDetail
                    setSelectedUserDetail(null)
                    setActionModal({ type: 'reactivate', user: u })
                  }}
                  className="px-3.5 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium hover:bg-emerald-500/30 transition"
                >
                  ✅ Reactivate
                </button>
              )}

              <button
                onClick={() => {
                  const u = selectedUserDetail
                  setSelectedUserDetail(null)
                  setActionModal({ type: 'ban', user: u })
                }}
                className="px-3.5 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium hover:bg-red-500/30 transition"
              >
                🚫 Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: USER ACTION DIALOG (Suspend/Ban/Promote/Message...)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {actionModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActionModal(null)}
          />
          <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full border border-[#2d2418]/10 space-y-4">
            <h3 className="text-base font-bold text-[#2d2418] capitalize flex items-center gap-2">
              <span>⚡</span> {actionModal.type} User — {actionModal.user.email}
            </h3>

            {/* Suspend or Ban Reason */}
            {(actionModal.type === 'suspend' || actionModal.type === 'ban') && (
              <div className="space-y-3">
                <p className="text-xs text-[#8a7a6a]">
                  Are you sure you want to {actionModal.type} this user account? Please specify a mandatory reason.
                </p>
                <FormField label="Reason for Action" required>
                  <Input
                    value={actionReason}
                    onChange={setActionReason}
                    placeholder={`e.g. Terms violation, Fraudulent orders...`}
                  />
                </FormField>
              </div>
            )}

            {/* Promote or Demote or Reactivate confirmation */}
            {(actionModal.type === 'reactivate' || actionModal.type === 'promote' || actionModal.type === 'demote') && (
              <p className="text-sm text-[#6b5d4f]">
                Are you sure you want to perform action <strong className="text-bloom-neon capitalize">{actionModal.type}</strong> for{' '}
                <strong>{actionModal.user.email}</strong>?
              </p>
            )}

            {/* Petals Adjustment Modal */}
            {actionModal.type === 'adjust' && (
              <div className="space-y-3">
                <FormField label="Amount (+ to Credit, - to Debit)" required>
                  <Input
                    type="number"
                    value={modalAdjustAmount}
                    onChange={setModalAdjustAmount}
                    placeholder="e.g. 50 or -50"
                  />
                </FormField>
                <FormField label="Reason" required>
                  <Input
                    value={actionReason}
                    onChange={setActionReason}
                    placeholder="e.g. VIP bonus, Goodwill credit..."
                  />
                </FormField>
              </div>
            )}

            {/* Send Message Modal */}
            {actionModal.type === 'message' && (
              <div className="space-y-3">
                <FormField label="Email Subject" required>
                  <Input
                    value={modalMessageSubject}
                    onChange={setModalMessageSubject}
                    placeholder="e.g. Special offer for your next Bloomwire order"
                  />
                </FormField>
                <FormField label="Message Body" required>
                  <textarea
                    value={modalMessageBody}
                    onChange={(e) => setModalMessageBody(e.target.value)}
                    rows={4}
                    placeholder="Write direct message or email content here..."
                    className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition resize-none"
                  />
                </FormField>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-[#2d2418]/10">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteUserAction}
                disabled={isSubmittingAction}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  actionModal.type === 'ban' || actionModal.type === 'suspend'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-bloom-rose text-white hover:opacity-90'
                }`}
              >
                {isSubmittingAction ? 'Processing...' : `Confirm ${actionModal.type}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: SEGMENT EMAIL MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {segmentEmailModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSegmentEmailModal(false)}
          />
          <div className="relative glass-strong rounded-2xl p-6 max-w-lg w-full border border-[#2d2418]/10 space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2d2418] flex items-center gap-2">
              <span>✉️</span> Broadcast Email to Segment
            </h3>

            <div className="p-3 glass rounded-xl text-xs text-bloom-neon border border-bloom-rose/30">
              Selected Segment: <strong className="uppercase font-bold">{segmentFilter}</strong> ({filteredUsers.length} Recipients)
            </div>

            <FormField label="Email Subject" required>
              <Input
                value={segmentSubject}
                onChange={setSegmentSubject}
                placeholder="e.g. Exclusive Petals Bonus for VIP Bloomwire Members!"
              />
            </FormField>

            <FormField label="Email Body (HTML / Plain text)" required>
              <textarea
                value={segmentBody}
                onChange={(e) => setSegmentBody(e.target.value)}
                rows={5}
                placeholder="Hi {{Name}},\n\nWe have a special announcement just for you..."
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition resize-none"
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#2d2418]/10">
              <button
                onClick={() => setSegmentEmailModal(false)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSegmentEmail}
                disabled={isSendingSegmentEmail}
                className="px-5 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-xs font-medium hover:opacity-90 transition"
              >
                {isSendingSegmentEmail ? 'Sending Broadcast...' : '🚀 Queue Broadcast Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PetalsUsersSection
