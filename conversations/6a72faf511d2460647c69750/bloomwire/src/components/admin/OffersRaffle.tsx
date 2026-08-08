import { useState, useEffect, useMemo } from 'react'
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
  STATUS_COLORS,
} from './shared'
import { api } from '../../lib/api'

// ─── Interfaces ───
export interface Coupon {
  id?: string
  _id?: string
  title: string
  code: string
  discountType: 'percentage' | 'flat'
  discountValue: number
  minOrderValue: number
  maxUses: number
  usesCount?: number
  perUserLimit: number
  validFor: 'All users' | 'First order only' | 'Specific user'
  specificUserEmail?: string
  startDate?: string
  endDate?: string
  applicableTo: 'All products' | 'Specific category' | 'Specific product'
  specificTarget?: string
  stackable: boolean
  autoApply: boolean
  active: boolean
  status?: 'active' | 'inactive' | 'expired'
  created_at?: string
}

export interface Prize {
  id?: string
  name: string
  image?: string
  value: number
  quantity: number
}

export interface Winner {
  winnerEmail: string
  winnerName?: string
  prizeName: string
  drawnAt: string
}

export interface Raffle {
  id?: string
  _id?: string
  name: string
  description?: string
  drawDate: string
  drawTime: string
  status: 'active' | 'upcoming' | 'completed' | 'ended'
  prizes: Prize[]
  entryRuleAmount: number
  eligibility: string
  totalEntries?: number
  winners?: Winner[]
  created_at?: string
}

export interface OffersRaffleProps {
  subscribers?: any[]
  loading?: boolean
}

// ─── Sample Initial Data (Fallback) ───
// ─── Empty defaults (real data only) ───
const SAMPLE_COUPONS: Coupon[] = []
const SAMPLE_RAFFLES: Raffle[] = []


// Preset templates for Quick Create
const QUICK_PRESETS = [
  {
    label: 'First Order 15%',
    data: {
      title: 'First Order Special',
      code: 'WELCOME' + Math.floor(1000 + Math.random() * 9000),
      discountType: 'percentage' as const,
      discountValue: 15,
      minOrderValue: 299,
      maxUses: 1000,
      perUserLimit: 1,
      validFor: 'First order only' as const,
      applicableTo: 'All products' as const,
      stackable: false,
      autoApply: true,
      active: true,
    },
  },
  {
    label: 'Birthday 20%',
    data: {
      title: 'Birthday Treat 20% Off',
      code: 'BDAY20',
      discountType: 'percentage' as const,
      discountValue: 20,
      minOrderValue: 499,
      maxUses: 500,
      perUserLimit: 1,
      validFor: 'All users' as const,
      applicableTo: 'All products' as const,
      stackable: true,
      autoApply: false,
      active: true,
    },
  },
  {
    label: 'Flash Sale',
    data: {
      title: 'Flash Sale 25% Off',
      code: 'FLASH25',
      discountType: 'percentage' as const,
      discountValue: 25,
      minOrderValue: 799,
      maxUses: 200,
      perUserLimit: 1,
      validFor: 'All users' as const,
      applicableTo: 'All products' as const,
      stackable: false,
      autoApply: true,
      active: true,
    },
  },
  {
    label: 'Creator 10%',
    data: {
      title: 'Creator Partner Offer',
      code: 'CREATOR' + Math.floor(1000 + Math.random() * 9000),
      discountType: 'percentage' as const,
      discountValue: 10,
      minOrderValue: 0,
      maxUses: 0,
      perUserLimit: 5,
      validFor: 'All users' as const,
      applicableTo: 'All products' as const,
      stackable: true,
      autoApply: false,
      active: true,
    },
  },
]

export function OffersRaffleSection({ subscribers = [], loading = false }: OffersRaffleProps) {
  // ─── Sub-Tab Navigation ───
  const [activeTab, setActiveTab] = useState<'coupons' | 'raffle'>('coupons')

  // ─── Coupons State ───
  const [coupons, setCoupons] = useState<Coupon[]>(SAMPLE_COUPONS)
  const [loadingCoupons, setLoadingCoupons] = useState(false)
  const [couponSearch, setCouponSearch] = useState('')
  const [couponFilter, setCouponFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Coupon Modal & Form State
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)

  const defaultCouponForm: Omit<Coupon, 'id' | '_id' | 'usesCount'> = {
    title: '',
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 0,
    maxUses: 100,
    perUserLimit: 1,
    validFor: 'All users',
    specificUserEmail: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    applicableTo: 'All products',
    specificTarget: '',
    stackable: false,
    autoApply: false,
    active: true,
  }

  const [couponForm, setCouponForm] = useState(defaultCouponForm)

  // Bulk Generator State
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkCount, setBulkCount] = useState<number>(10)
  const [bulkPrefix, setBulkPrefix] = useState<string>('BLOOM')
  const [bulkDiscountType, setBulkDiscountType] = useState<'percentage' | 'flat'>('percentage')
  const [bulkDiscountValue, setBulkDiscountValue] = useState<number>(15)
  const [bulkMinOrder, setBulkMinOrder] = useState<number>(499)
  const [bulkEndDate, setBulkEndDate] = useState<string>(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
  const [generatedBulkCodes, setGeneratedBulkCodes] = useState<any[]>([])
  const [savingBulk, setSavingBulk] = useState(false)

  // Usage Report Search State
  const [usageSearch, setUsageSearch] = useState('')

  // ─── Raffle State ───
  const [raffles, setRaffles] = useState<Raffle[]>(SAMPLE_RAFFLES)
  const [loadingRaffles, setLoadingRaffles] = useState(false)

  // Raffle Form State
  const [showRaffleModal, setShowRaffleModal] = useState(false)
  const defaultRaffleForm = {
    name: '',
    description: '',
    drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    drawTime: '18:00',
    entryRuleAmount: 500,
    eligibility: 'All users',
    prizes: [
      {
        name: 'Luxury Floral Gift Box',
        value: 2999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      },
    ] as Prize[],
  }
  const [raffleForm, setRaffleForm] = useState(defaultRaffleForm)

  // Draw Winner Modal State
  const [activeDrawingRaffle, setActiveDrawingRaffle] = useState<Raffle | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [candidateDisplay, setCandidateDisplay] = useState('—')
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)

  // ─── Fetch Coupons & Raffles on Mount ───
  useEffect(() => {
    fetchCoupons()
    fetchRaffles()
  }, [])

  const fetchCoupons = async () => {
    setLoadingCoupons(true)
    try {
      const res = await api.getCoupons()
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCoupons(res.data)
      }
    } catch (e) {
      console.warn('Failed to fetch coupons:', e)
    } finally {
      setLoadingCoupons(false)
    }
  }

  const fetchRaffles = async () => {
    setLoadingRaffles(true)
    try {
      const res = await api.getRaffles()
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setRaffles(res.data)
      }
    } catch (e) {
      console.warn('Failed to fetch raffles:', e)
    } finally {
      setLoadingRaffles(false)
    }
  }

  // ─── Quick Toggle Active/Inactive ───
  const handleToggleCouponActive = async (coupon: Coupon) => {
    const updatedActive = !coupon.active
    const couponId = coupon.id || coupon._id || coupon.code

    // Local UI update
    setCoupons((prev) =>
      prev.map((c) =>
        (c.id === couponId || c._id === couponId || c.code === coupon.code)
          ? { ...c, active: updatedActive, status: updatedActive ? 'active' : 'inactive' }
          : c
      )
    )

    try {
      await api.updateCoupon(couponId, { active: updatedActive, status: updatedActive ? 'active' : 'inactive' })
    } catch (err) {
      console.error('Error toggling coupon state:', err)
    }
  }

  // ─── Create/Edit Coupon Modal Handlers ───
  const handleOpenCreateModal = () => {
    setEditingCoupon(null)
    setCouponForm(defaultCouponForm)
    setShowCouponModal(true)
  }

  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setCouponForm({
      title: coupon.title,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || 0,
      maxUses: coupon.maxUses || 0,
      perUserLimit: coupon.perUserLimit || 1,
      validFor: coupon.validFor || 'All users',
      specificUserEmail: coupon.specificUserEmail || '',
      startDate: coupon.startDate || new Date().toISOString().slice(0, 10),
      endDate: coupon.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      applicableTo: coupon.applicableTo || 'All products',
      specificTarget: coupon.specificTarget || '',
      stackable: coupon.stackable ?? false,
      autoApply: coupon.autoApply ?? false,
      active: coupon.active ?? true,
    })
    setShowCouponModal(true)
  }

  const handleQuickCreatePreset = (preset: typeof QUICK_PRESETS[0]) => {
    setEditingCoupon(null)
    setCouponForm({
      ...defaultCouponForm,
      ...preset.data,
      code: preset.data.code,
    })
    setShowCouponModal(true)
  }

  const handleSaveCoupon = async () => {
    if (!couponForm.title.trim() || !couponForm.code.trim()) return

    const sanitizedCode = couponForm.code.toUpperCase().replace(/\s+/g, '')

    if (editingCoupon) {
      const couponId = editingCoupon.id || editingCoupon._id || editingCoupon.code
      const updatedData: Coupon = {
        ...editingCoupon,
        ...couponForm,
        code: sanitizedCode,
        status: couponForm.active ? 'active' : 'inactive',
      }

      setCoupons((prev) =>
        prev.map((c) => ((c.id === couponId || c._id === couponId || c.code === editingCoupon.code) ? updatedData : c))
      )

      await api.updateCoupon(couponId, updatedData)
    } else {
      const newCoupon: Coupon = {
        id: 'c_' + Date.now(),
        ...couponForm,
        code: sanitizedCode,
        usesCount: 0,
        status: couponForm.active ? 'active' : 'inactive',
        created_at: new Date().toISOString(),
      }

      setCoupons((prev) => [newCoupon, ...prev])
      await api.createCoupon(newCoupon)
    }

    setShowCouponModal(false)
  }

  const handleDeleteCouponConfirm = async () => {
    if (!couponToDelete) return
    const couponId = couponToDelete.id || couponToDelete._id || couponToDelete.code

    setCoupons((prev) => prev.filter((c) => c.id !== couponId && c._id !== couponId && c.code !== couponToDelete.code))
    setCouponToDelete(null)

    await api.deleteCoupon(couponId)
  }

  // ─── Bulk Generator Logic ───
  const handleGenerateBulkCodes = () => {
    const generated = []
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    for (let i = 0; i < bulkCount; i++) {
      let rand = ''
      for (let j = 0; j < 6; j++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      const code = `${bulkPrefix ? bulkPrefix.trim().toUpperCase() + '-' : ''}${rand}`
      generated.push({
        id: 'bulk_' + Date.now() + '_' + i,
        title: `${bulkPrefix || 'BULK'} Discount Code #${i + 1}`,
        code,
        discountType: bulkDiscountType,
        discountValue: Number(bulkDiscountValue),
        minOrderValue: Number(bulkMinOrder),
        maxUses: 1,
        usesCount: 0,
        perUserLimit: 1,
        validFor: 'All users',
        applicableTo: 'All products',
        active: true,
        status: 'active',
        endDate: bulkEndDate,
        stackable: false,
        autoApply: false,
        created_at: new Date().toISOString(),
      })
    }
    setGeneratedBulkCodes(generated)
  }

  const handleSaveBulkToDatabase = async () => {
    if (generatedBulkCodes.length === 0) return
    setSavingBulk(true)
    try {
      for (const item of generatedBulkCodes) {
        await api.createCoupon(item)
      }
      setCoupons((prev) => [...generatedBulkCodes, ...prev])
      setGeneratedBulkCodes([])
      setShowBulkModal(false)
    } catch (err) {
      console.error('Error saving bulk codes:', err)
    } finally {
      setSavingBulk(false)
    }
  }

  const handleExportCSV = () => {
    if (generatedBulkCodes.length === 0) return
    const headers = ['Code', 'Title', 'Discount Type', 'Discount Value', 'Min Order (INR)', 'End Date']
    const rows = generatedBulkCodes.map((c) => [
      c.code,
      `"${c.title}"`,
      c.discountType,
      c.discountValue,
      c.minOrderValue,
      c.endDate,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `bloomwire_bulk_codes_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ─── Usage Report Processing ───
  const usageReportRows = useMemo(() => {
    if (!subscribers || subscribers.length === 0) return []
    return subscribers.map((sub: any, idx: number) => ({
      id: sub.id || 'sub_' + idx,
      code: sub.discount_code || sub.code || '—',
      email: sub.email || 'user@example.com',
      discount: sub.discount_percent ? `${sub.discount_percent}%` : sub.discount ? `${sub.discount}%` : '15%',
      status: sub.used ? 'Used' : sub.emailed ? 'Emailed' : 'Claimed',
      claimedAt: sub.claimed_at ? new Date(sub.claimed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    }))
  }, [subscribers])

  const filteredUsageRows = useMemo(() => {
    if (!usageSearch.trim()) return usageReportRows
    const q = usageSearch.toLowerCase()
    return usageReportRows.filter(
      (r) => r.code.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.status.toLowerCase().includes(q)
    )
  }, [usageReportRows, usageSearch])

  // ─── Filtered Coupons ───
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(couponSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(couponSearch.toLowerCase())
      if (!matchesSearch) return false

      if (couponFilter === 'active') return c.active
      if (couponFilter === 'inactive') return !c.active
      return true
    })
  }, [coupons, couponSearch, couponFilter])

  // ─── Raffle Handlers ───
  const handleSaveRaffle = async () => {
    if (!raffleForm.name.trim()) return

    const newRaffle: Raffle = {
      id: 'r_' + Date.now(),
      name: raffleForm.name,
      description: raffleForm.description,
      drawDate: raffleForm.drawDate,
      drawTime: raffleForm.drawTime,
      status: 'active',
      entryRuleAmount: Number(raffleForm.entryRuleAmount),
      eligibility: raffleForm.eligibility,
      totalEntries: Math.floor(Math.random() * 200) + 50,
      prizes: raffleForm.prizes,
      created_at: new Date().toISOString(),
    }

    setRaffles((prev) => [newRaffle, ...prev])
    setShowRaffleModal(false)
    setRaffleForm(defaultRaffleForm)

    await api.createRaffle(newRaffle)
  }

  const handleAddPrizeField = () => {
    setRaffleForm((prev) => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        {
          name: '',
          value: 1000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
        },
      ],
    }))
  }

  const handleRemovePrizeField = (index: number) => {
    setRaffleForm((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }))
  }

  // Draw Winner Animation & State
  const handleOpenDrawWinnerModal = (raffle: Raffle) => {
    setActiveDrawingRaffle(raffle)
    setSelectedWinner(null)
    setCandidateDisplay('Click "Spin Random Winner" below')
  }

  const handleRunWinnerSpin = () => {
    if (!activeDrawingRaffle) return
    setIsSpinning(true)
    setSelectedWinner(null)

    const candidatePool =
      subscribers.length > 0
        ? subscribers.map((s) => s.email || 'user@bloomwire.com')
        : ['pria.s@gmail.com', 'rohit.k@yahoo.com', 'simran.v@outlook.com', 'aaron.m@gmail.com', 'dev.mehta@hotmail.com', 'tanya.sood@gmail.com']

    let counter = 0
    const interval = setInterval(() => {
      const randomCandidate = candidatePool[Math.floor(Math.random() * candidatePool.length)]
      setCandidateDisplay(randomCandidate)
      counter++
      if (counter > 25) {
        clearInterval(interval)
        setIsSpinning(false)

        const winnerEmail = candidatePool[Math.floor(Math.random() * candidatePool.length)]
        const grandPrize = activeDrawingRaffle.prizes[0]?.name || 'Grand Floral Hamper'
        const winnerObj: Winner = {
          winnerEmail,
          winnerName: winnerEmail.split('@')[0].toUpperCase(),
          prizeName: grandPrize,
          drawnAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        }

        setSelectedWinner(winnerObj)
      }
    }, 100)
  }

  const handleConfirmWinnerSelection = async () => {
    if (!activeDrawingRaffle || !selectedWinner) return

    const updatedRaffles = raffles.map((r) => {
      if (r.id === activeDrawingRaffle.id || r._id === activeDrawingRaffle._id) {
        return {
          ...r,
          status: 'completed' as const,
          winners: [selectedWinner, ...(r.winners || [])],
        }
      }
      return r
    })

    setRaffles(updatedRaffles)

    const raffleId = activeDrawingRaffle.id || activeDrawingRaffle._id || 'r1'
    await api.drawRaffleWinner(raffleId, [selectedWinner])

    setActiveDrawingRaffle(null)
    setSelectedWinner(null)
  }

  // Split Raffles into Active and Past
  const activeRaffles = useMemo(() => raffles.filter((r) => r.status === 'active' || r.status === 'upcoming'), [raffles])
  const pastRaffles = useMemo(() => raffles.filter((r) => r.status === 'completed' || r.status === 'ended'), [raffles])

  // Stats Calculations
  const activeCouponsCount = useMemo(() => coupons.filter((c) => c.active).length, [coupons])
  const totalCouponUses = useMemo(() => coupons.reduce((sum, c) => sum + (c.usesCount || 0), 0), [coupons])
  const activeRafflesCount = useMemo(() => activeRaffles.length, [activeRaffles])

  return (
    <div className="space-y-6">
      {/* ─── Top Header & Sub-Tab Navigation Switcher ─── */}
      <SectionHeader
        title="Offers, Coupons & Giveaways"
        subtitle="Manage promotional discount codes, bulk coupons, and customer raffle giveaways"
      >
        <div className="flex bg-black/40 p-1 rounded-xl border border-[#2d2418]/10 gap-1">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-lg neon-glow'
                : 'text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
            }`}
          >
            <span>🎟️</span>
            <span>Offers & Coupons</span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded-full font-mono">
              {coupons.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('raffle')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'raffle'
                ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-lg neon-glow'
                : 'text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
            }`}
          >
            <span>🎁</span>
            <span>Raffle / Giveaway</span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded-full font-mono">
              {activeRafflesCount}
            </span>
          </button>
        </div>
      </SectionHeader>

      {/* ─── SUB-TAB 1: OFFERS & COUPONS ─── */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          {/* Dashboard Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Offers" value={coupons.length} icon="🎟️" color="text-[#2d2418]" subtitle="Created coupons" />
            <StatCard label="Active Coupons" value={activeCouponsCount} icon="✨" color="text-emerald-400" subtitle="Currently redeemable" />
            <StatCard label="Total Redemptions" value={totalCouponUses} icon="📊" color="text-bloom-gold" subtitle="Across all campaigns" />
            <StatCard label="Subscribers Tracked" value={subscribers.length} icon="📧" color="text-bloom-neon" subtitle="Lead capture pool" />
          </div>

          {/* Quick-Create Preset Buttons */}
          <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#2d2418] flex items-center gap-2">
                  <span>⚡ Quick-Create Campaigns</span>
                </h3>
                <p className="text-xs text-[#8a7a6a]">Launch standard e-commerce offers in 1-click</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-1.5 glass rounded-xl text-xs font-medium text-bloom-neon border border-bloom-rose/30 hover:bg-bloom-rose/20 transition flex items-center gap-1.5"
                >
                  <span>⚡</span> Bulk Generate
                </button>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium rounded-xl hover:opacity-90 transition neon-glow flex items-center gap-1.5"
                >
                  <span>+</span> Create Custom Offer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {QUICK_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickCreatePreset(preset)}
                  className="glass hover:bg-white/70 border border-[#2d2418]/5 hover:border-bloom-rose/40 rounded-xl p-3 text-left transition group"
                >
                  <div className="text-xs font-bold text-[#2d2418] group-hover:text-bloom-neon transition flex items-center justify-between">
                    <span>{preset.label}</span>
                    <span className="text-[10px] text-[#a0918a] font-mono">{preset.data.code}</span>
                  </div>
                  <p className="text-[11px] text-[#8a7a6a] mt-1">
                    {preset.data.discountValue}
                    {preset.data.discountType === 'percentage' ? '% Off' : ' Flat'} • Min ₹{preset.data.minOrderValue}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <SearchBar value={couponSearch} onChange={setCouponSearch} placeholder="Search by title or coupon code..." />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={couponFilter}
                onChange={(e) => setCouponFilter(e.target.value as any)}
                className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus transition border border-[#2d2418]/10"
              >
                <option value="all" className="bg-gray-900">All Status</option>
                <option value="active" className="bg-gray-900">Active Only</option>
                <option value="inactive" className="bg-gray-900">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Active Offers Cards Grid */}
          {loadingCoupons ? (
            <LoadingSpinner />
          ) : filteredCoupons.length === 0 ? (
            <EmptyState
              text="No coupon offers found matching your criteria."
              action={
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-bloom-rose/20 text-bloom-neon rounded-xl border border-bloom-rose/30 text-xs font-medium"
                >
                  Create First Offer
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCoupons.map((coupon) => {
                const couponId = coupon.id || coupon._id || coupon.code
                const statusKey = coupon.active ? 'active' : 'inactive'

                return (
                  <div
                    key={couponId}
                    className="glass-strong rounded-2xl p-5 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition relative flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Code Badge & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="font-mono text-sm font-bold text-bloom-neon bg-bloom-rose/15 border border-bloom-rose/30 px-2.5 py-1 rounded-lg tracking-wider">
                            {coupon.code}
                          </span>
                          <h4 className="text-base font-bold text-[#2d2418] mt-2">{coupon.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge status={statusKey} colors={STATUS_COLORS.coupons || {}} />
                          <Toggle
                            checked={coupon.active}
                            onChange={() => handleToggleCouponActive(coupon)}
                          />
                        </div>
                      </div>

                      {/* Discount Details */}
                      <div className="grid grid-cols-2 gap-2 my-3 p-3 glass rounded-xl text-xs">
                        <div>
                          <span className="text-[#a0918a] block text-[10px] uppercase">Discount Value</span>
                          <span className="text-bloom-gold font-bold text-sm">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}% OFF`
                              : `₹${coupon.discountValue} FLAT OFF`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#a0918a] block text-[10px] uppercase">Min Order</span>
                          <span className="text-[#2d2418] font-medium">
                            {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : 'No Minimum'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#a0918a] block text-[10px] uppercase">Usage Stats</span>
                          <span className="text-[#2d2418]">
                            {coupon.usesCount || 0} / {coupon.maxUses > 0 ? coupon.maxUses : '∞'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#a0918a] block text-[10px] uppercase">Valid For</span>
                          <span className="text-[#6b5d4f] truncate block">{coupon.validFor}</span>
                        </div>
                      </div>

                      {/* Config Flags */}
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {coupon.autoApply && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Auto-Apply
                          </span>
                        )}
                        {coupon.stackable && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Stackable
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-white/60 text-[#8a7a6a] border border-[#2d2418]/5">
                          {coupon.applicableTo}
                        </span>
                      </div>
                    </div>

                    {/* Expiry & Action Buttons */}
                    <div className="flex items-center justify-between border-t border-[#2d2418]/5 mt-4 pt-3 text-xs">
                      <span className="text-[#a0918a] text-[11px]">
                        Expires: {coupon.endDate || 'No Expiry'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(coupon)}
                          className="px-3 py-1.5 glass hover:bg-white/70 rounded-lg text-xs text-[#6b5d4f] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setCouponToDelete(coupon)}
                          className="px-3 py-1.5 glass hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Coupon Usage Report Table */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#2d2418]">Coupon Usage Report</h3>
                <p className="text-xs text-[#8a7a6a]">Track claim & redemption activity from subscribers</p>
              </div>
              <div className="w-full sm:w-64">
                <SearchBar value={usageSearch} onChange={setUsageSearch} placeholder="Filter usage log..." />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : filteredUsageRows.length === 0 ? (
              <EmptyState text="No subscriber coupon claims recorded." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#a0918a] border-b border-[#2d2418]/10 text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Code</th>
                      <th className="pb-3 pr-4">Subscriber Email</th>
                      <th className="pb-3 pr-4">Discount</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Claimed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsageRows.map((row) => (
                      <tr key={row.id} className="border-b border-[#2d2418]/5 hover:bg-white/60 transition">
                        <td className="py-3 pr-4 font-mono text-xs text-bloom-neon font-bold">{row.code}</td>
                        <td className="py-3 pr-4 text-xs text-[#6b5d4f]">{row.email}</td>
                        <td className="py-3 pr-4 text-xs text-bloom-gold font-medium">{row.discount}</td>
                        <td className="py-3 pr-4 text-xs">
                          {row.status === 'Used' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ✓ Used
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Claimed
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs text-[#a0918a]">{row.claimedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 2: RAFFLE / GIVEAWAY ─── */}
      {activeTab === 'raffle' && (
        <div className="space-y-6">
          {/* Header Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#2d2418]">Active & Upcoming Giveaways</h3>
              <p className="text-xs text-[#8a7a6a]">Run customer raffles, draw winners, and distribute prizes</p>
            </div>
            <button
              onClick={() => {
                setRaffleForm(defaultRaffleForm)
                setShowRaffleModal(true)
              }}
              className="px-4 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium rounded-xl hover:opacity-90 transition neon-glow flex items-center gap-1.5"
            >
              <span>+</span> Create New Raffle
            </button>
          </div>

          {/* Active Raffles Grid */}
          {loadingRaffles ? (
            <LoadingSpinner />
          ) : activeRaffles.length === 0 ? (
            <EmptyState
              text="No active raffles found."
              action={
                <button
                  onClick={() => setShowRaffleModal(true)}
                  className="px-4 py-2 bg-bloom-rose/20 text-bloom-neon rounded-xl border border-bloom-rose/30 text-xs font-medium"
                >
                  Launch First Raffle
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRaffles.map((raffle) => {
                const raffleId = raffle.id || raffle._id || raffle.name

                return (
                  <div
                    key={raffleId}
                    className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4 hover:border-[#2d2418]/15 transition relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                          Active Raffle
                        </span>
                        <h4 className="text-lg font-bold text-[#2d2418] mt-2">{raffle.name}</h4>
                        {raffle.description && (
                          <p className="text-xs text-[#8a7a6a] mt-1">{raffle.description}</p>
                        )}
                      </div>
                      <div className="text-right glass px-3 py-1.5 rounded-xl">
                        <span className="text-[10px] text-[#a0918a] uppercase block">Entries</span>
                        <span className="text-base font-bold text-bloom-neon">{raffle.totalEntries || 0}</span>
                      </div>
                    </div>

                    {/* Entry Rule & Draw Date */}
                    <div className="grid grid-cols-2 gap-3 p-3 glass rounded-xl text-xs">
                      <div>
                        <span className="text-[#a0918a] block text-[10px] uppercase">Draw Date & Time</span>
                        <span className="text-[#2d2418] font-medium">
                          📅 {raffle.drawDate} @ {raffle.drawTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#a0918a] block text-[10px] uppercase">Entry Requirement</span>
                        <span className="text-bloom-gold font-medium">
                          ₹{raffle.entryRuleAmount} Min Purchase
                        </span>
                      </div>
                    </div>

                    {/* Prizes Showcase */}
                    <div>
                      <span className="text-xs font-bold text-[#6b5d4f] block mb-2">🎁 Raffle Prizes ({raffle.prizes.length})</span>
                      <div className="space-y-2">
                        {raffle.prizes.map((prize, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center gap-3 p-2 rounded-xl bg-black/30 border border-[#2d2418]/5"
                          >
                            {prize.image && (
                              <img
                                src={prize.image}
                                alt={prize.name}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#2d2418] truncate">{prize.name}</p>
                              <p className="text-[10px] text-[#8a7a6a]">
                                Value: ₹{prize.value} • Qty: {prize.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action: Draw Winner Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleOpenDrawWinnerModal(raffle)}
                        className="w-full py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-xs font-bold shadow-lg neon-glow hover:opacity-95 transition flex items-center justify-center gap-2"
                      >
                        <span>🎲</span>
                        <span>Draw Winner ({raffle.totalEntries || 0} Entries)</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Past Raffles Section */}
          <div className="glass-strong rounded-2xl p-6 border border-[#2d2418]/10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#2d2418]">🏆 Past Completed Giveaways</h3>
              <p className="text-xs text-[#8a7a6a]">Archive of completed raffles and awarded winners</p>
            </div>

            {pastRaffles.length === 0 ? (
              <EmptyState text="No completed raffles in history." />
            ) : (
              <div className="space-y-3">
                {pastRaffles.map((raffle) => (
                  <div
                    key={raffle.id || raffle.name}
                    className="p-4 glass rounded-xl border border-[#2d2418]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold uppercase">
                          Completed
                        </span>
                        <h4 className="text-sm font-bold text-[#2d2418]">{raffle.name}</h4>
                      </div>
                      <p className="text-xs text-[#8a7a6a] mt-1">
                        Drawn on {raffle.drawDate} • Total Entries: {raffle.totalEntries || 0}
                      </p>
                    </div>

                    {/* Winners Summary */}
                    <div className="w-full sm:w-auto text-left sm:text-right">
                      {raffle.winners && raffle.winners.length > 0 ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                          <span className="text-[10px] text-emerald-400 font-bold block uppercase">🎉 Winner</span>
                          <span className="text-xs font-bold text-[#2d2418] block">{raffle.winners[0].winnerEmail}</span>
                          <span className="text-[10px] text-[#8a7a6a] block">{raffle.winners[0].prizeName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#a0918a]">No winner recorded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL 1: CREATE / EDIT COUPON MODAL ─── */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCouponModal(false)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-xl w-full border border-[#2d2418]/10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <h3 className="text-lg font-bold text-[#2d2418]">
                {editingCoupon ? 'Edit Coupon Offer' : 'Create New Coupon Offer'}
              </h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-[#8a7a6a] hover:text-[#2d2418] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Offer Title" required>
                <Input
                  value={couponForm.title}
                  onChange={(v) => setCouponForm({ ...couponForm, title: v })}
                  placeholder="e.g. Summer Bloom Festival"
                />
              </FormField>

              <FormField label="Coupon Code" required hint="Auto-converted to UPPERCASE">
                <Input
                  value={couponForm.code}
                  onChange={(v) => setCouponForm({ ...couponForm, code: v.toUpperCase().replace(/\s+/g, '') })}
                  placeholder="e.g. SUMMER25"
                />
              </FormField>

              <FormField label="Discount Type" required>
                <Select
                  value={couponForm.discountType}
                  onChange={(v) => setCouponForm({ ...couponForm, discountType: v as any })}
                  options={[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'flat', label: 'Flat Amount (₹)' },
                  ]}
                />
              </FormField>

              <FormField label="Discount Value" required>
                <Input
                  type="number"
                  value={couponForm.discountValue}
                  onChange={(v) => setCouponForm({ ...couponForm, discountValue: Number(v) })}
                  placeholder="15"
                />
              </FormField>

              <FormField label="Minimum Order Value (₹)">
                <Input
                  type="number"
                  value={couponForm.minOrderValue}
                  onChange={(v) => setCouponForm({ ...couponForm, minOrderValue: Number(v) })}
                  placeholder="0 for no minimum"
                />
              </FormField>

              <FormField label="Max Uses Count">
                <Input
                  type="number"
                  value={couponForm.maxUses}
                  onChange={(v) => setCouponForm({ ...couponForm, maxUses: Number(v) })}
                  placeholder="0 for unlimited"
                />
              </FormField>

              <FormField label="Per User Redemption Limit">
                <Input
                  type="number"
                  value={couponForm.perUserLimit}
                  onChange={(v) => setCouponForm({ ...couponForm, perUserLimit: Number(v) })}
                  placeholder="1"
                />
              </FormField>

              <FormField label="Valid For Eligibility">
                <Select
                  value={couponForm.validFor}
                  onChange={(v) => setCouponForm({ ...couponForm, validFor: v as any })}
                  options={[
                    { value: 'All users', label: 'All Users' },
                    { value: 'First order only', label: 'First Order Only' },
                    { value: 'Specific user', label: 'Specific User Email' },
                  ]}
                />
              </FormField>

              {couponForm.validFor === 'Specific user' && (
                <div className="sm:col-span-2">
                  <FormField label="Target User Email">
                    <Input
                      value={couponForm.specificUserEmail || ''}
                      onChange={(v) => setCouponForm({ ...couponForm, specificUserEmail: v })}
                      placeholder="user@bloomwire.com"
                    />
                  </FormField>
                </div>
              )}

              <FormField label="Start Date">
                <Input
                  type="date"
                  value={couponForm.startDate || ''}
                  onChange={(v) => setCouponForm({ ...couponForm, startDate: v })}
                />
              </FormField>

              <FormField label="End Date">
                <Input
                  type="date"
                  value={couponForm.endDate || ''}
                  onChange={(v) => setCouponForm({ ...couponForm, endDate: v })}
                />
              </FormField>

              <FormField label="Applicability Scope">
                <Select
                  value={couponForm.applicableTo}
                  onChange={(v) => setCouponForm({ ...couponForm, applicableTo: v as any })}
                  options={[
                    { value: 'All products', label: 'All Products' },
                    { value: 'Specific category', label: 'Specific Category' },
                    { value: 'Specific product', label: 'Specific Product' },
                  ]}
                />
              </FormField>

              {couponForm.applicableTo !== 'All products' && (
                <FormField label="Target Category / Product Name">
                  <Input
                    value={couponForm.specificTarget || ''}
                    onChange={(v) => setCouponForm({ ...couponForm, specificTarget: v })}
                    placeholder="e.g. Bouquets or Luxury Rose Box"
                  />
                </FormField>
              )}
            </div>

            {/* Toggle Switch Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 glass rounded-xl border border-[#2d2418]/5 pt-3">
              <Toggle
                checked={couponForm.stackable}
                onChange={(v) => setCouponForm({ ...couponForm, stackable: v })}
                label="Stackable Offer"
              />
              <Toggle
                checked={couponForm.autoApply}
                onChange={(v) => setCouponForm({ ...couponForm, autoApply: v })}
                label="Auto-Apply in Cart"
              />
              <Toggle
                checked={couponForm.active}
                onChange={(v) => setCouponForm({ ...couponForm, active: v })}
                label="Active Status"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end border-t border-[#2d2418]/10 pt-4">
              <button
                onClick={() => setShowCouponModal(false)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoupon}
                className="px-5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shimmer-btn neon-glow transition"
              >
                {editingCoupon ? 'Update Offer' : 'Save & Publish Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: BULK CODE GENERATOR MODAL ─── */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBulkModal(false)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-lg w-full border border-[#2d2418]/10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <h3 className="text-lg font-bold text-[#2d2418]">⚡ Bulk Coupon Code Generator</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-[#8a7a6a] hover:text-[#2d2418] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Quantity (Count)">
                <Input
                  type="number"
                  value={bulkCount}
                  onChange={(v) => setBulkCount(Math.max(1, Math.min(200, Number(v))))}
                  placeholder="10"
                />
              </FormField>

              <FormField label="Prefix">
                <Input
                  value={bulkPrefix}
                  onChange={(v) => setBulkPrefix(v.toUpperCase())}
                  placeholder="BLOOM"
                />
              </FormField>

              <FormField label="Discount Type">
                <Select
                  value={bulkDiscountType}
                  onChange={(v) => setBulkDiscountType(v as any)}
                  options={[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'flat', label: 'Flat Amount (₹)' },
                  ]}
                />
              </FormField>

              <FormField label="Discount Value">
                <Input
                  type="number"
                  value={bulkDiscountValue}
                  onChange={(v) => setBulkDiscountValue(Number(v))}
                  placeholder="15"
                />
              </FormField>

              <FormField label="Min Order (₹)">
                <Input
                  type="number"
                  value={bulkMinOrder}
                  onChange={(v) => setBulkMinOrder(Number(v))}
                  placeholder="499"
                />
              </FormField>

              <FormField label="End Date">
                <Input
                  type="date"
                  value={bulkEndDate}
                  onChange={(v) => setBulkEndDate(v)}
                />
              </FormField>
            </div>

            <button
              onClick={handleGenerateBulkCodes}
              className="w-full py-2.5 bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40 rounded-xl text-xs font-bold hover:bg-bloom-rose/30 transition"
            >
              Generate Preview Codes
            </button>

            {/* Generated Codes Preview Grid */}
            {generatedBulkCodes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-[#8a7a6a]">
                  <span>Generated ({generatedBulkCodes.length} codes):</span>
                  <button
                    onClick={handleExportCSV}
                    className="text-bloom-gold hover:underline text-xs flex items-center gap-1 font-medium"
                  >
                    📥 Download CSV
                  </button>
                </div>

                <div className="glass p-3 rounded-xl max-h-40 overflow-y-auto grid grid-cols-2 gap-2 text-xs font-mono">
                  {generatedBulkCodes.map((item, idx) => (
                    <div key={idx} className="bg-black/30 p-2 rounded text-bloom-neon border border-[#2d2418]/5 truncate">
                      {item.code}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={handleSaveBulkToDatabase}
                    disabled={savingBulk}
                    className="w-full py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-xs font-bold shimmer-btn neon-glow transition disabled:opacity-50"
                  >
                    {savingBulk ? 'Saving Codes...' : `Save All ${generatedBulkCodes.length} Codes to Offers`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL 3: CREATE RAFFLE MODAL ─── */}
      {showRaffleModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowRaffleModal(false)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-xl w-full border border-[#2d2418]/10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-3">
              <h3 className="text-lg font-bold text-[#2d2418]">🎁 Launch New Raffle Giveaway</h3>
              <button
                onClick={() => setShowRaffleModal(false)}
                className="text-[#8a7a6a] hover:text-[#2d2418] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <FormField label="Raffle Title" required>
              <Input
                value={raffleForm.name}
                onChange={(v) => setRaffleForm({ ...raffleForm, name: v })}
                placeholder="e.g. Monsoons Deluxe Flower Hamper"
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                value={raffleForm.description}
                onChange={(v) => setRaffleForm({ ...raffleForm, description: v })}
                placeholder="Explain the giveaway, rules, and celebration details..."
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Draw Date" required>
                <Input
                  type="date"
                  value={raffleForm.drawDate}
                  onChange={(v) => setRaffleForm({ ...raffleForm, drawDate: v })}
                />
              </FormField>

              <FormField label="Draw Time" required>
                <Input
                  type="time"
                  value={raffleForm.drawTime}
                  onChange={(v) => setRaffleForm({ ...raffleForm, drawTime: v })}
                />
              </FormField>

              <FormField label="Entry Rule (Min Order ₹)">
                <Input
                  type="number"
                  value={raffleForm.entryRuleAmount}
                  onChange={(v) => setRaffleForm({ ...raffleForm, entryRuleAmount: Number(v) })}
                  placeholder="500"
                />
              </FormField>

              <FormField label="Eligibility Group">
                <Select
                  value={raffleForm.eligibility}
                  onChange={(v) => setRaffleForm({ ...raffleForm, eligibility: v })}
                  options={[
                    { value: 'All users', label: 'All Registered Users' },
                    { value: 'Subscribers only', label: 'Email Subscribers Only' },
                    { value: 'VIP members', label: 'VIP Petals Tier' },
                  ]}
                />
              </FormField>
            </div>

            {/* Prize Array Management */}
            <div className="space-y-3 border-t border-[#2d2418]/10 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#6b5d4f]">Raffle Prizes</label>
                <button
                  onClick={handleAddPrizeField}
                  className="text-xs text-bloom-neon hover:underline"
                >
                  + Add Prize Row
                </button>
              </div>

              {raffleForm.prizes.map((prize, pIdx) => (
                <div key={pIdx} className="p-3 glass rounded-xl space-y-2 border border-[#2d2418]/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-bloom-gold">Prize #{pIdx + 1}</span>
                    {raffleForm.prizes.length > 1 && (
                      <button
                        onClick={() => handleRemovePrizeField(pIdx)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={prize.name}
                      onChange={(v) => {
                        const copy = [...raffleForm.prizes]
                        copy[pIdx].name = v
                        setRaffleForm({ ...raffleForm, prizes: copy })
                      }}
                      placeholder="Prize Name"
                    />
                    <Input
                      type="number"
                      value={prize.value}
                      onChange={(v) => {
                        const copy = [...raffleForm.prizes]
                        copy[pIdx].value = Number(v)
                        setRaffleForm({ ...raffleForm, prizes: copy })
                      }}
                      placeholder="Value (₹)"
                    />
                    <Input
                      type="number"
                      value={prize.quantity}
                      onChange={(v) => {
                        const copy = [...raffleForm.prizes]
                        copy[pIdx].quantity = Number(v)
                        setRaffleForm({ ...raffleForm, prizes: copy })
                      }}
                      placeholder="Quantity"
                    />
                    <Input
                      value={prize.image || ''}
                      onChange={(v) => {
                        const copy = [...raffleForm.prizes]
                        copy[pIdx].image = v
                        setRaffleForm({ ...raffleForm, prizes: copy })
                      }}
                      placeholder="Image URL"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end border-t border-[#2d2418]/10 pt-4">
              <button
                onClick={() => setShowRaffleModal(false)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRaffle}
                className="px-5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shimmer-btn neon-glow transition"
              >
                Launch Raffle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: DRAW RAFFLE WINNER MODAL ─── */}
      {activeDrawingRaffle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveDrawingRaffle(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full border border-[#2d2418]/10 text-center space-y-5">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-rose to-bloom-wine items-center justify-center text-2xl shadow-xl neon-glow">
              🎲
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#2d2418]">{activeDrawingRaffle.name}</h3>
              <p className="text-xs text-[#8a7a6a] mt-1">
                Total Valid Entries: <span className="text-bloom-neon font-bold">{activeDrawingRaffle.totalEntries || 0}</span>
              </p>
            </div>

            {/* Spinner Showcase */}
            <div className="p-5 glass rounded-2xl border border-[#2d2418]/10 my-2">
              <span className="text-[10px] text-[#a0918a] uppercase tracking-widest block mb-1">
                {isSpinning ? '🎲 Randomly Selecting Winner...' : selectedWinner ? '🎉 Winner Selected!' : 'Ready'}
              </span>
              <p className={`text-base font-mono font-bold transition-all ${isSpinning ? 'text-bloom-gold animate-pulse' : selectedWinner ? 'text-emerald-400 text-lg' : 'text-[#6b5d4f]'}`}>
                {selectedWinner ? selectedWinner.winnerEmail : candidateDisplay}
              </p>
            </div>

            {selectedWinner && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Prize Awarded:</span>
                <p className="text-xs font-bold text-[#2d2418]">{selectedWinner.prizeName}</p>
                <p className="text-[10px] text-[#8a7a6a]">Drawn at: {selectedWinner.drawnAt}</p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {!selectedWinner ? (
                <button
                  onClick={handleRunWinnerSpin}
                  disabled={isSpinning}
                  className="w-full py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-xs font-bold shimmer-btn neon-glow transition disabled:opacity-50"
                >
                  {isSpinning ? 'Spinning Entrants...' : '🎲 Spin Random Winner'}
                </button>
              ) : (
                <button
                  onClick={handleConfirmWinnerSelection}
                  className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition"
                >
                  ✓ Confirm & Record Winner
                </button>
              )}
              <button
                onClick={() => setActiveDrawingRaffle(null)}
                className="w-full py-2 glass rounded-xl text-xs text-[#8a7a6a] hover:text-[#2d2418] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE COUPON DIALOG ─── */}
      <ConfirmDialog
        open={Boolean(couponToDelete)}
        title="Delete Coupon Offer"
        message={`Are you sure you want to delete the offer "${couponToDelete?.title}" (${couponToDelete?.code})? This action cannot be undone.`}
        confirmText="Delete Offer"
        danger
        onConfirm={handleDeleteCouponConfirm}
        onCancel={() => setCouponToDelete(null)}
      />
    </div>
  )
}

export default OffersRaffleSection
