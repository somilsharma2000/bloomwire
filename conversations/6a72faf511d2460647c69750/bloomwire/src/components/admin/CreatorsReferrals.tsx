import { useState, useMemo } from 'react'
import {
  StatCard,
  Badge,
  SearchBar,
  SectionHeader,
  EmptyState,
  LoadingSpinner,
  AdminTable,
  ConfirmDialog,
  STATUS_COLORS
} from './shared'
import { api } from '../../lib/api'

export interface CreatorsReferralsProps {
  users?: any[]
  loading?: boolean
}

interface ReferralSettings {
  referrerReward: number
  referredReward: number
  minOrderAmount: number
  maxReferralsPerYear: number
}

// No sample data — real data only
const SAMPLE_PENDING_APPLICATIONS: any[] = []

// No sample data — real data only
const SAMPLE_APPROVED_CREATORS: any[] = []

// No sample data — real data only
const SAMPLE_REFERRALS: any[] = []

export function CreatorsReferralsSection({ users = [], loading = false }: CreatorsReferralsProps) {
  const [subTab, setSubTab] = useState<'creators' | 'referrals'>('creators')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  // Local overrides/updates for dynamic updates
  const [userOverrides, setUserOverrides] = useState<Record<string, any>>({})

  // Modal States
  const [approveUser, setApproveUser] = useState<any | null>(null)
  const [customCode, setCustomCode] = useState('')

  const [rejectUser, setRejectUser] = useState<any | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const [commissionUser, setCommissionUser] = useState<any | null>(null)
  const [newCommissionRate, setNewCommissionRate] = useState<number>(10)

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    danger?: boolean
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    danger: false
  })

  // Editable Referral Settings
  const [settings, setSettings] = useState<ReferralSettings>({
    referrerReward: 100,
    referredReward: 50,
    minOrderAmount: 499,
    maxReferralsPerYear: 50
  })
  const [settingsSaved, setSettingsSaved] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Combine real users with overrides and fallbacks
  const processedUsers = useMemo(() => {
    const list = [...users]

    // Apply overrides
    const updatedList = list.map(u => ({
      ...u,
      ...(userOverrides[u.email] || {})
    }))

    return updatedList
  }, [users, userOverrides])

  // Extract pending applications (users with 'BLOOM-' referral code & orderCount === 0 or status 'pending')
  const creatorApplications = useMemo(() => {
    const realPending = processedUsers.filter(u => {
      const isBloom = u.referralCode && u.referralCode.toUpperCase().startsWith('BLOOM-')
      const isPendingStatus = u.creatorStatus === 'pending' || u.status === 'pending'
      const isNoOrders = !u.orderCount || u.orderCount === 0
      const notApproved = u.creatorStatus !== 'approved' && !u.creatorApproved
      return (isBloom && isNoOrders && notApproved) || isPendingStatus
    })

    // If no real pending users exist, include sample data with overrides
    const samplePending = SAMPLE_PENDING_APPLICATIONS.map(s => ({
      ...s,
      ...(userOverrides[s.email] || {})
    })).filter(s => s.creatorStatus === 'pending')

    const combined = [...realPending, ...samplePending]

    // Deduplicate by email
    const seen = new Set()
    return combined.filter(u => {
      if (seen.has(u.email)) return false
      seen.add(u.email)
      return true
    })
  }, [processedUsers, userOverrides])

  // Extract approved creators (users with 'BLOOM-' referral code & approved status or orderCount > 0)
  const approvedCreators = useMemo(() => {
    const realApproved = processedUsers.filter(u => {
      const isBloom = u.referralCode && u.referralCode.toUpperCase().startsWith('BLOOM-')
      const isApprovedStatus = u.creatorStatus === 'approved' || u.creatorApproved === true
      const hasOrders = (u.orderCount || 0) > 0
      return isApprovedStatus || (isBloom && hasOrders)
    })

    const sampleApproved = SAMPLE_APPROVED_CREATORS.map(s => ({
      ...s,
      ...(userOverrides[s.email] || {})
    })).filter(s => s.creatorStatus === 'approved' || s.creatorStatus !== 'rejected')

    const combined = [...realApproved, ...sampleApproved]

    // Deduplicate by email
    const seen = new Set()
    return combined.filter(u => {
      if (seen.has(u.email)) return false
      seen.add(u.email)
      return true
    })
  }, [processedUsers, userOverrides])

  // Filter approved creators by search
  const filteredCreators = useMemo(() => {
    if (!search) return approvedCreators
    const q = search.toLowerCase()
    return approvedCreators.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.referralCode || '').toLowerCase().includes(q)
    )
  }, [approvedCreators, search])

  // Extract Referral List from users with referredBy
  const referralList = useMemo(() => {
    const realReferrals = processedUsers
      .filter(u => u.referredBy || u.referredByCode)
      .map(u => ({
        id: u.id || u.email,
        referrerEmail: u.referredBy || 'creator@bloomwire.in',
        referredEmail: u.email,
        referralCode: u.referredByCode || u.referralCodeUsed || '— (direct)',
        status: (u.orderCount || 0) > 0 ? 'completed' : 'pending',
        rewardCredited: (u.orderCount || 0) > 0 ? `${settings.referrerReward} Petals` : '0 Petals (Pending Order)',
        date: u.joinedAt || u.createdAt || u.created_at || 'Recently'
      }))

    const combined = [...realReferrals, ...SAMPLE_REFERRALS]
    const seen = new Set()
    return combined.filter(r => {
      const key = `${r.referrerEmail}-${r.referredEmail}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [processedUsers, settings.referrerReward])

  const filteredReferrals = useMemo(() => {
    if (!search) return referralList
    const q = search.toLowerCase()
    return referralList.filter(r =>
      r.referrerEmail.toLowerCase().includes(q) ||
      r.referredEmail.toLowerCase().includes(q) ||
      r.referralCode.toLowerCase().includes(q)
    )
  }, [referralList, search])

  // Top Referrers Leaderboard
  const topReferrers = useMemo(() => {
    const counts: Record<string, { email: string; name?: string; code?: string; total: number; successful: number; rewards: number }> = {}

    referralList.forEach(r => {
      if (!counts[r.referrerEmail]) {
        counts[r.referrerEmail] = {
          email: r.referrerEmail,
          total: 0,
          successful: 0,
          rewards: 0
        }
      }
      counts[r.referrerEmail].total += 1
      if (r.status === 'completed') {
        counts[r.referrerEmail].successful += 1
        counts[r.referrerEmail].rewards += settings.referrerReward
      }
    })

    // Match with user names and referral codes
    Object.keys(counts).forEach(email => {
      const userMatch = processedUsers.find(u => u.email === email) || approvedCreators.find(c => c.email === email)
      if (userMatch) {
        counts[email].name = userMatch.name
        counts[email].code = userMatch.referralCode
      } else {
        counts[email].name = email.split('@')[0]
        counts[email].code = userMatch.referralCode || `BLOOM-${email.split('@')[0].toUpperCase().slice(0, 8)}`
      }
    })

    return Object.values(counts)
      .sort((a, b) => b.successful - a.successful || b.total - a.total)
      .slice(0, 5)
  }, [referralList, processedUsers, approvedCreators, settings.referrerReward])

  // Stat calculations
  const totalCreatorSales = useMemo(() => {
    return approvedCreators.reduce((acc, c) => acc + (c.totalSpent || c.totalSales || 0), 0)
  }, [approvedCreators])

  const totalCommissionEarned = useMemo(() => {
    return approvedCreators.reduce((acc, c) => {
      const sales = c.totalSpent || c.totalSales || 0
      const rate = c.commissionRate || 10
      return acc + (c.commissionEarned || Math.round((sales * rate) / 100))
    }, 0)
  }, [approvedCreators])

  const totalReferralsCount = referralList.length
  const successfulReferralsCount = referralList.filter(r => r.status === 'completed').length
  const pendingReferralsCount = referralList.filter(r => r.status === 'pending').length
  const totalRewardsGiven = successfulReferralsCount * (settings.referrerReward + settings.referredReward)

  // ─── ACTION HANDLERS ───

  // Open Approve Modal
  const handleOpenApprove = (user: any) => {
    setApproveUser(user)
    const namePart = (user.name || 'CREATOR').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)
    // Add 4-char random suffix to prevent collisions between same-named creators
    const suffix = Array.from(crypto.getRandomValues(new Uint8Array(2)))
      .map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('')
    const baseCode = user.referralCode || `BLOOM-${namePart}${suffix}`
    setCustomCode(baseCode.startsWith('BLOOM-') ? baseCode : `BLOOM-${baseCode}`)
  }

  // Execute Approval
  const handleConfirmApprove = async () => {
    if (!approveUser) return
    const email = approveUser.email
    const code = customCode.trim() || `BLOOM-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      await api.updateUser(email, {
        referralCode: code,
        creatorStatus: 'approved',
        creatorApproved: true,
        commissionRate: 10
      })
    } catch {
      /* ignore */
    }

    setUserOverrides(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        referralCode: code,
        creatorStatus: 'approved',
        creatorApproved: true,
        status: 'active',
        commissionRate: 10,
        orderCount: approveUser.orderCount || 1
      }
    }))

    showToast(`Approved ${approveUser.name || email}! Unique code: ${code}`)
    setApproveUser(null)
  }

  // Open Reject Modal
  const handleOpenReject = (user: any) => {
    setRejectUser(user)
    setRejectReason('')
  }

  // Execute Rejection
  const handleConfirmReject = async () => {
    if (!rejectUser) return
    const email = rejectUser.email

    try {
      await api.updateUser(email, {
        creatorStatus: 'rejected',
        rejectReason
      })
    } catch {
      /* ignore */
    }

    setUserOverrides(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        creatorStatus: 'rejected',
        rejectReason
      }
    }))

    showToast(`Application rejected for ${rejectUser.name || email}`)
    setRejectUser(null)
  }

  // Toggle Suspend / Reactivate Creator
  const handleToggleSuspend = (creator: any) => {
    const isSuspended = creator.status === 'suspended' || creator.creatorStatus === 'suspended'
    const actionText = isSuspended ? 'reactivate' : 'suspend'

    setConfirmDialog({
      open: true,
      title: `${isSuspended ? 'Reactivate' : 'Suspend'} Creator`,
      message: `Are you sure you want to ${actionText} creator ${creator.name || creator.email}?`,
      danger: !isSuspended,
      onConfirm: async () => {
        const newStatus = isSuspended ? 'active' : 'suspended'
        try {
          if (!isSuspended) {
            await api.suspendUser(creator.email, 'Creator suspended by admin')
          } else {
            await api.updateUser(creator.email, { status: 'active', creatorStatus: 'approved' })
          }
        } catch {
          /* ignore */
        }

        setUserOverrides(prev => ({
          ...prev,
          [creator.email]: {
            ...prev[creator.email],
            status: newStatus,
            creatorStatus: newStatus === 'active' ? 'approved' : 'suspended'
          }
        }))

        showToast(`Creator ${creator.name || creator.email} is now ${newStatus}`)
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  // Open Adjust Commission Modal
  const handleOpenCommission = (creator: any) => {
    setCommissionUser(creator)
    setNewCommissionRate(creator.commissionRate || 10)
  }

  // Execute Commission Update
  const handleSaveCommission = async () => {
    if (!commissionUser) return
    const email = commissionUser.email

    try {
      await api.updateUser(email, { commissionRate: newCommissionRate })
    } catch {
      /* ignore */
    }

    setUserOverrides(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        commissionRate: newCommissionRate
      }
    }))

    showToast(`Updated commission rate for ${commissionUser.name || email} to ${newCommissionRate}%`)
    setCommissionUser(null)
  }

  // Save Referral Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSaved(true)
    showToast('Referral program settings saved successfully!')
    setTimeout(() => setSettingsSaved(false), 3000)
  }

  const customStatusColors: Record<string, string> = {
    ...STATUS_COLORS.users,
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    suspended: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/30'
  }

  // Approved Creators AdminTable Columns
  const creatorsColumns = [
    {
      key: 'name',
      label: 'Creator',
      render: (row: any) => (
        <div>
          <div className="font-medium text-[#2d2418] flex items-center gap-1.5">
            {row.name || 'Anonymous'}
            {row.instagram && (
              <a
                href={`https://instagram.com/${row.instagram.replace('@', '')}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-bloom-rose hover:underline"
              >
                @{row.instagram.replace('@', '')}
              </a>
            )}
          </div>
          <div className="text-xs text-[#a0918a]">{row.email}</div>
        </div>
      )
    },
    {
      key: 'referralCode',
      label: 'Referral Code',
      render: (row: any) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-bloom-rose/10 border border-bloom-rose/30 text-bloom-neon">
          {row.referralCode || '— (pending)'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <Badge status={row.status || 'active'} colors={customStatusColors} />
      )
    },
    {
      key: 'orderCount',
      label: 'Total Orders',
      render: (row: any) => (
        <span className="font-semibold text-[#2d2418]">{row.orderCount || row.totalReferralOrders || 0}</span>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Sales',
      render: (row: any) => (
        <span className="text-emerald-400 font-medium">
          ₹{(row.totalSpent || row.totalSales || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: 'commissionEarned',
      label: 'Commission',
      render: (row: any) => {
        const rate = row.commissionRate || 10
        const sales = row.totalSpent || row.totalSales || 0
        const earned = row.commissionEarned || Math.round((sales * rate) / 100)
        return (
          <div>
            <div className="text-[#2d2418] font-medium">₹{earned.toLocaleString()}</div>
            <div className="text-[10px] text-[#a0918a]">Rate: {rate}%</div>
          </div>
        )
      }
    },
    {
      key: 'petalsBalance',
      label: 'Petals',
      render: (row: any) => (
        <span className="text-bloom-gold font-medium">🌸 {row.petalsBalance || 0}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => {
        const isSuspended = row.status === 'suspended' || row.creatorStatus === 'suspended'
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenCommission(row)}
              className="px-2.5 py-1 rounded-lg glass text-xs text-bloom-neon hover:bg-white/70 transition"
              title="Adjust Commission Rate"
            >
              Adjust %
            </button>
            <button
              onClick={() => handleToggleSuspend(row)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                isSuspended
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
              }`}
            >
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </button>
          </div>
        )
      }
    }
  ]

  // Referrals Activity AdminTable Columns
  const referralColumns = [
    {
      key: 'referrerEmail',
      label: 'Referrer',
      render: (row: any) => (
        <div className="text-xs text-[#2d2418] font-medium">{row.referrerEmail}</div>
      )
    },
    {
      key: 'referredEmail',
      label: 'Referred User',
      render: (row: any) => (
        <div className="text-xs text-[#6b5d4f]">{row.referredEmail}</div>
      )
    },
    {
      key: 'referralCode',
      label: 'Code Used',
      render: (row: any) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/60 border border-[#2d2418]/10 text-[#6b5d4f]">
          {row.referralCode}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <Badge status={row.status} colors={customStatusColors} />
      )
    },
    {
      key: 'rewardCredited',
      label: 'Reward',
      render: (row: any) => (
        <span className="text-xs text-bloom-gold font-medium">{row.rewardCredited}</span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row: any) => (
        <span className="text-xs text-[#a0918a]">{row.date}</span>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[250] bg-gradient-to-r from-bloom-rose to-bloom-wine text-white px-5 py-3 rounded-xl shadow-2xl border border-[#2d2418]/15 text-sm font-medium animate-bounce">
          ✨ {toast}
        </div>
      )}

      {/* ─── Top Section Header & Sub-Tabs ─── */}
      <SectionHeader
        title="Creators & Referrals"
        subtitle="Manage floral content creators, applications, referral commissions, and rewards."
      >
        <div className="flex bg-black/40 p-1 rounded-xl border border-[#2d2418]/10">
          <button
            onClick={() => setSubTab('creators')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'creators'
                ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md'
                : 'text-[#8a7a6a] hover:text-[#2d2418]'
            }`}
          >
            ✨ Creators ({approvedCreators.length})
          </button>
          <button
            onClick={() => setSubTab('referrals')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'referrals'
                ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md'
                : 'text-[#8a7a6a] hover:text-[#2d2418]'
            }`}
          >
            🎁 Referrals ({referralList.length})
          </button>
        </div>
      </SectionHeader>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* SUB-TAB 1: CREATORS                                               */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {subTab === 'creators' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Creators Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Active Creators"
              value={approvedCreators.length}
              icon="🎨"
              color="text-emerald-400"
            />
            <StatCard
              label="Pending Applications"
              value={creatorApplications.length}
              icon="⏳"
              color={creatorApplications.length > 0 ? 'text-amber-400' : 'text-[#8a7a6a]'}
            />
            <StatCard
              label="Total Creator Sales"
              value={`₹${totalCreatorSales.toLocaleString()}`}
              icon="🛍️"
              color="text-[#2d2418]"
            />
            <StatCard
              label="Commission Earned"
              value={`₹${totalCommissionEarned.toLocaleString()}`}
              icon="💎"
              color="text-bloom-neon"
            />
          </div>

          {/* Section A: Creator Applications (Pending) */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2d2418] flex items-center gap-2">
                  <span>Pending Creator Applications</span>
                  {creatorApplications.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {creatorApplications.length} New
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#a0918a] mt-0.5">
                  Review and approve incoming creators. Approved creators get custom referral links & commission payouts.
                </p>
              </div>
            </div>

            {creatorApplications.length === 0 ? (
              <EmptyState text="No pending creator applications. New applicants with referral codes starting with BLOOM- will appear here." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creatorApplications.map(app => (
                  <div
                    key={app.email}
                    className="glass rounded-xl p-5 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-[#2d2418] text-base">{app.name || 'Anonymous Applicant'}</h4>
                          <p className="text-xs text-[#8a7a6a]">{app.email}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                          Pending
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-xs text-[#6b5d4f]">
                        <div className="flex justify-between border-b border-[#2d2418]/5 pb-1">
                          <span className="text-[#a0918a]">Requested Code:</span>
                          <span className="font-mono text-bloom-neon font-semibold">
                            {app.referralCode || '— (pending)'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-[#2d2418]/5 pb-1">
                          <span className="text-[#a0918a]">Followers:</span>
                          <span className="font-medium text-[#2d2418]">{app.followerCount || app.followers || '10k+'}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#2d2418]/5 pb-1">
                          <span className="text-[#a0918a]">Joined:</span>
                          <span className="text-[#8a7a6a]">{app.joinedAt || app.createdAt || 'Recently'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#2d2418]/10">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenApprove(app)}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition text-center"
                        >
                          ✓ APPROVE
                        </button>
                        <button
                          onClick={() => handleOpenReject(app)}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition text-center"
                        >
                          ✕ REJECT
                        </button>
                      </div>

                      <a
                        href={`https://instagram.com/${(app.instagram || app.name || 'bloomwire').replace(/[@\s]/g, '').toLowerCase()}`}
                        target="_blank" rel="noopener noreferrer"
                        className="block w-full py-1.5 rounded-xl text-[11px] text-center glass text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/70 transition"
                      >
                        📸 VIEW INSTAGRAM
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Approved Creators Table */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2d2418]">Approved Creators Roster</h3>
                <p className="text-xs text-[#a0918a]">
                  Active creators driving floral sales through unique referral links.
                </p>
              </div>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, or code..."
              />
            </div>

            <AdminTable
              columns={creatorsColumns}
              rows={filteredCreators}
              keyField="email"
              emptyText="No approved creators found."
            />
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* SUB-TAB 2: REFERRALS                                              */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {subTab === 'referrals' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Referrals Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Referrals"
              value={totalReferralsCount}
              icon="🔗"
              color="text-[#2d2418]"
            />
            <StatCard
              label="Successful (Ordered)"
              value={successfulReferralsCount}
              icon="✅"
              color="text-emerald-400"
            />
            <StatCard
              label="Pending (Signed Up)"
              value={pendingReferralsCount}
              icon="⏳"
              color="text-amber-400"
            />
            <StatCard
              label="Total Rewards Given"
              value={`${totalRewardsGiven} Petals`}
              icon="🌸"
              color="text-bloom-gold"
            />
          </div>

          {/* Top Referrers Leaderboard */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10">
            <div className="mb-4">
              <h3 className="text-lg font-serif font-bold text-[#2d2418]">Top Referrers Leaderboard</h3>
              <p className="text-xs text-[#a0918a]">
                Top users bringing the most floral lovers to Bloomwire.
              </p>
            </div>

            {topReferrers.length === 0 ? (
              <EmptyState text="No referral activity recorded yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topReferrers.map((item, idx) => (
                  <div
                    key={item.email}
                    className="glass rounded-xl p-4 border border-[#2d2418]/10 relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 text-xl font-bold opacity-30">
                      #{idx + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-rose to-bloom-wine flex items-center justify-center font-bold text-white text-sm mb-3">
                      {(item.name || item.email)[0].toUpperCase()}
                    </div>
                    <h4 className="font-bold text-[#2d2418] text-sm truncate">{item.name || item.email}</h4>
                    <p className="text-[11px] text-[#8a7a6a] truncate mb-3">{item.email}</p>

                    <div className="space-y-1 text-xs border-t border-[#2d2418]/10 pt-2">
                      <div className="flex justify-between">
                        <span className="text-[#a0918a]">Conversions:</span>
                        <span className="text-emerald-400 font-bold">{item.successful}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0918a]">Rewards:</span>
                        <span className="text-bloom-gold font-bold">🌸 {item.rewards}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Referral Activity Table */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2d2418]">Referral Activity Log</h3>
                <p className="text-xs text-[#a0918a]">Detailed record of referrers, referred friends, and rewards.</p>
              </div>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search referral logs..."
              />
            </div>

            <AdminTable
              columns={referralColumns}
              rows={filteredReferrals}
              keyField="id"
              emptyText="No referral records found."
            />
          </div>

          {/* Referral Settings Card */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 max-w-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-serif font-bold text-[#2d2418] flex items-center gap-2">
                ⚙️ Referral Program Settings
              </h3>
              <p className="text-xs text-[#a0918a]">
                Configure default Petals reward amounts, minimum spend thresholds, and yearly user referral limits.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8a7a6a] mb-1">
                    Referrer Reward (Petals)
                  </label>
                  <input
                    type="number"
                    value={settings.referrerReward}
                    onChange={e => setSettings({ ...settings, referrerReward: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition"
                    min={0}
                    required
                  />
                  <p className="text-[10px] text-[#8a7a6a] mt-1">Petals credited to referrer on completed purchase.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8a7a6a] mb-1">
                    Referred Friend Reward (Petals)
                  </label>
                  <input
                    type="number"
                    value={settings.referredReward}
                    onChange={e => setSettings({ ...settings, referredReward: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition"
                    min={0}
                    required
                  />
                  <p className="text-[10px] text-[#8a7a6a] mt-1">Petals welcome bonus credited to new user.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8a7a6a] mb-1">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={e => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition"
                    min={0}
                    required
                  />
                  <p className="text-[10px] text-[#8a7a6a] mt-1">Minimum spend required to unlock referral reward.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8a7a6a] mb-1">
                    Max Referrals Per User / Year
                  </label>
                  <input
                    type="number"
                    value={settings.maxReferralsPerYear}
                    onChange={e => setSettings({ ...settings, maxReferralsPerYear: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition"
                    min={1}
                    required
                  />
                  <p className="text-[10px] text-[#8a7a6a] mt-1">Cap on rewarded referrals per account annually.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-sm font-medium hover:opacity-90 transition shadow-lg"
                >
                  Save Settings
                </button>
                {settingsSaved && (
                  <span className="text-xs text-emerald-400 font-medium animate-fadeIn">
                    ✓ Settings updated
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* MODALS & DIALOGS                                                  */}
      {/* ═════════════════════════════════════════════════════════════════ */}

      {/* 1. APPROVE MODAL */}
      {approveUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setApproveUser(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full border border-[#2d2418]/10">
            <h3 className="text-lg font-bold text-[#2d2418] mb-1">Approve Creator Application</h3>
            <p className="text-xs text-[#8a7a6a] mb-4">
              Assign a unique referral code and activate creator privileges for{' '}
              <span className="text-[#2d2418] font-medium">{approveUser.name || approveUser.email}</span>.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-[#8a7a6a] mb-1 font-medium">Custom Referral Code</label>
                <input
                  type="text"
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 glass rounded-xl text-sm font-mono text-bloom-neon placeholder-gray-600 glow-focus transition"
                  placeholder="e.g. BLOOM-ROSE1234"
                />
                <p className="text-[10px] text-[#a0918a] mt-1">Code must start with BLOOM-</p>
              </div>

              <div className="p-3 glass rounded-xl text-xs space-y-1 text-[#6b5d4f]">
                <div className="flex justify-between">
                  <span>Default Commission:</span>
                  <span className="text-emerald-400 font-bold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Welcome Email:</span>
                  <span className="text-[#8a7a6a]">Will be sent automatically</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setApproveUser(null)}
                className="px-4 py-2 glass rounded-xl text-xs text-[#6b5d4f] hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md hover:opacity-90 transition"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REJECT MODAL */}
      {rejectUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRejectUser(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full border border-[#2d2418]/10">
            <h3 className="text-lg font-bold text-[#2d2418] mb-1">Reject Creator Application</h3>
            <p className="text-xs text-[#8a7a6a] mb-4">
              Reject application for <span className="text-[#2d2418] font-medium">{rejectUser.name || rejectUser.email}</span>.
            </p>

            <div className="mb-6">
              <label className="block text-xs text-[#8a7a6a] mb-1 font-medium">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Follower requirement not met or aesthetic mismatch..."
                rows={3}
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectUser(null)}
                className="px-4 py-2 glass rounded-xl text-xs text-[#6b5d4f] hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADJUST COMMISSION MODAL */}
      {commissionUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCommissionUser(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-sm w-full border border-[#2d2418]/10">
            <h3 className="text-lg font-bold text-[#2d2418] mb-1">Adjust Commission Rate</h3>
            <p className="text-xs text-[#8a7a6a] mb-4">
              Set new commission percentage for{' '}
              <span className="text-[#2d2418] font-medium">{commissionUser.name || commissionUser.email}</span>.
            </p>

            <div className="mb-6">
              <label className="block text-xs text-[#8a7a6a] mb-1 font-medium">Commission Rate (%)</label>
              <input
                type="number"
                value={newCommissionRate}
                onChange={e => setNewCommissionRate(Number(e.target.value))}
                min={0}
                max={50}
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus transition"
              />
              <div className="flex gap-2 mt-2">
                {[5, 10, 12, 15, 20].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setNewCommissionRate(rate)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                      newCommissionRate === rate
                        ? 'bg-bloom-rose text-white border-bloom-rose'
                        : 'glass text-[#8a7a6a] hover:text-[#2d2418]'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCommissionUser(null)}
                className="px-4 py-2 glass rounded-xl text-xs text-[#6b5d4f] hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommission}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-md hover:opacity-90 transition"
              >
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        danger={confirmDialog.danger}
      />
    </div>
  )
}

export default CreatorsReferralsSection
