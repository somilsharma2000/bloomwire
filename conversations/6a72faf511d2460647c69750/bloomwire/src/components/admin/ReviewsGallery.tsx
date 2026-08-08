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
  STATUS_COLORS,
  Toggle,
} from './shared'
import { api } from '../../lib/api'

export interface Submission {
  _id: string
  userEmail: string
  mediaUrl: string
  mediaType?: 'image' | 'video' | string
  caption?: string
  status: 'pending' | 'approved' | 'rejected' | string
  petalsAwarded?: number
  created_date?: string
  createdAt?: string
  featured?: boolean
  rejectReason?: string
}

export interface ReviewItem {
  id: string
  productName?: string
  productSlug?: string
  reviewerName?: string
  userName?: string
  userEmail?: string
  rating: number
  title?: string
  comment?: string
  text?: string
  date?: string
  created_date?: string
  verified?: boolean
  isVerified?: boolean
  status?: 'pending' | 'approved' | 'rejected' | string
  rejectReason?: string
}

export interface ReviewsGalleryProps {
  submissions?: Submission[]
  loading?: boolean
  onRefresh?: () => void
  onApprove?: (id: string) => Promise<void> | void
  onReject?: (id: string) => Promise<void> | void
}

type SubTab = 'reviews' | 'gallery' | 'unboxing'

// ─── Empty defaults (real data only) ───
const SAMPLE_REVIEWS: ReviewItem[] = []

const SAMPLE_GALLERY: Submission[] = []

// ─── Helpers ───
function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-sm">
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

function isVideoMedia(url?: string, type?: string) {
  if (type === 'video') return true
  if (!url) return false
  return /\.(mp4|webm|ogg|mov)$/i.test(url)
}

function isApprovedWithinLastWeek(dateStr?: string) {
  if (!dateStr) return false
  try {
    const subDate = new Date(dateStr)
    const now = new Date()
    const diffDays = (now.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= 7
  } catch {
    return false
  }
}

export function ReviewsGallerySection({
  submissions = [],
  loading = false,
  onRefresh,
  onApprove,
  onReject,
}: ReviewsGalleryProps) {
  const [subTab, setSubTab] = useState<SubTab>('reviews')

  // ─── REVIEWS STATE ───
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewSearch, setReviewSearch] = useState('')
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all')
  const [reviewVerifiedFilter, setReviewVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [reviewViewMode, setReviewViewMode] = useState<'cards' | 'table'>('cards')

  // Review Modals / Actions State
  const [rejectingReviewId, setRejectingReviewId] = useState<string | null>(null)
  const [rejectReasonInput, setRejectReasonInput] = useState('')
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const [bulkApproving, setBulkApproving] = useState(false)

  // ─── GALLERY STATE ───
  const [galleryItems, setGalleryItems] = useState<Submission[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [gallerySearch, setGallerySearch] = useState('')
  const [galleryStatusFilter, setGalleryStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [galleryFeaturedOnly, setGalleryFeaturedOnly] = useState(false)
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null)

  // ─── MEDIA LIGHTBOX STATE ───
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type?: string; caption?: string; email?: string } | null>(null)

  // ─── UNBOXING ACTION LOADING STATE ───
  const [unboxingActionId, setUnboxingActionId] = useState<string | null>(null)

  // ─── FETCH DATA ───
  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const res = await api.getAllReviews()
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((item: any) => ({
          id: item.id || item._id || `rev-${Math.random().toString(36).substr(2, 7)}`,
          productName: item.productName || item.product_name || item.productSlug || 'Bloomwire Flower Set',
          productSlug: item.productSlug || item.productId,
          reviewerName: item.reviewerName || item.userName || item.name || item.userEmail || 'Anonymous Buyer',
          userEmail: item.userEmail || item.email,
          rating: Number(item.rating || 5),
          title: item.title || '',
          comment: item.comment || item.text || item.review || '',
          date: item.date || item.created_date || item.createdAt || new Date().toISOString(),
          verified: item.verified ?? item.isVerified ?? true,
          status: item.status || 'pending',
          rejectReason: item.rejectReason,
        }))
        setReviews(formatted)
      } else {
        setReviews(SAMPLE_REVIEWS)
      }
    } catch {
      setReviews(SAMPLE_REVIEWS)
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchGallery = async () => {
    setGalleryLoading(true)
    try {
      const res = await api.getAllSubmissions()
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setGalleryItems(res.data)
      } else {
        setGalleryItems(SAMPLE_GALLERY)
      }
    } catch {
      setGalleryItems(SAMPLE_GALLERY)
    } finally {
      setGalleryLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    fetchGallery()
  }, [])

  // Refresh handler across sub-tabs
  const handleGlobalRefresh = () => {
    if (subTab === 'reviews') fetchReviews()
    else if (subTab === 'gallery') fetchGallery()
    else if (onRefresh) onRefresh()
  }

  // ─── FILTERED REVIEWS ───
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const st = r.status || 'pending'
      if (reviewStatusFilter !== 'all' && st !== reviewStatusFilter) return false
      if (reviewRatingFilter !== 'all' && r.rating !== Number(reviewRatingFilter)) return false
      const isVer = Boolean(r.verified || r.isVerified)
      if (reviewVerifiedFilter === 'verified' && !isVer) return false
      if (reviewVerifiedFilter === 'unverified' && isVer) return false

      if (reviewSearch.trim()) {
        const term = reviewSearch.toLowerCase()
        const name = (r.reviewerName || r.userEmail || '').toLowerCase()
        const prod = (r.productName || r.productSlug || '').toLowerCase()
        const text = (r.comment || r.title || '').toLowerCase()
        if (!name.includes(term) && !prod.includes(term) && !text.includes(term)) {
          return false
        }
      }
      return true
    })
  }, [reviews, reviewStatusFilter, reviewRatingFilter, reviewVerifiedFilter, reviewSearch])

  // Review Stats
  const reviewStats = useMemo(() => {
    const pending = reviews.filter((r) => (r.status || 'pending') === 'pending').length
    const approved = reviews.filter((r) => r.status === 'approved').length
    const total = reviews.length
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : '—'
    return { pending, approved, total, avgRating }
  }, [reviews])

  // ─── REVIEW ACTIONS ───
  const handleApproveReview = async (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
  }

  const handleOpenRejectReviewModal = (id: string) => {
    setRejectingReviewId(id)
    setRejectReasonInput('')
  }

  const handleConfirmRejectReview = () => {
    if (!rejectingReviewId) return
    setReviews((prev) =>
      prev.map((r) =>
        r.id === rejectingReviewId
          ? { ...r, status: 'rejected', rejectReason: rejectReasonInput.trim() || 'Moderated by admin' }
          : r
      )
    )
    setRejectingReviewId(null)
    setRejectReasonInput('')
  }

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
    setDeletingReviewId(null)
  }

  const handleApproveAllReviews = async () => {
    setBulkApproving(true)
    const pendingInFiltered = filteredReviews.filter((r) => (r.status || 'pending') === 'pending')
    const pendingIds = new Set(pendingInFiltered.map((r) => r.id))
    setReviews((prev) => prev.map((r) => (pendingIds.has(r.id) ? { ...r, status: 'approved' } : r)))
    setTimeout(() => setBulkApproving(false), 300)
  }

  // ─── FILTERED GALLERY ───
  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item) => {
      if (galleryStatusFilter !== 'all' && item.status !== galleryStatusFilter) return false
      if (galleryFeaturedOnly && !item.featured) return false
      if (gallerySearch.trim()) {
        const term = gallerySearch.toLowerCase()
        const email = (item.userEmail || '').toLowerCase()
        const cap = (item.caption || '').toLowerCase()
        if (!email.includes(term) && !cap.includes(term)) return false
      }
      return true
    })
  }, [galleryItems, galleryStatusFilter, galleryFeaturedOnly, gallerySearch])

  const galleryStats = useMemo(() => {
    const total = galleryItems.length
    const pending = galleryItems.filter((g) => g.status === 'pending').length
    const approved = galleryItems.filter((g) => g.status === 'approved').length
    const featured = galleryItems.filter((g) => g.featured).length
    return { total, pending, approved, featured }
  }, [galleryItems])

  // ─── GALLERY ACTIONS ───
  const handleApproveGallery = async (id: string) => {
    await api.approveSubmission(id)
    await api.toggleGalleryPublic(id, true)
    setGalleryItems((prev) => prev.map((g) => (g._id === id ? { ...g, status: 'approved' } : g)))
  }

  const handleRejectGallery = async (id: string) => {
    await api.rejectSubmission(id)
    setGalleryItems((prev) => prev.map((g) => (g._id === id ? { ...g, status: 'rejected' } : g)))
  }

  const handleToggleFeaturedGallery = (id: string) => {
    setGalleryItems((prev) =>
      prev.map((g) => (g._id === id ? { ...g, featured: !g.featured } : g))
    )
  }

  const handleDeleteGallery = (id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g._id !== id))
    setDeletingGalleryId(null)
  }

  // ─── UNBOXING SUBMISSIONS STATS & WEEKLY WARNING ───
  const unboxingStats = useMemo(() => {
    const list = submissions || []
    const pending = list.filter((s) => s.status === 'pending').length
    const approved = list.filter((s) => s.status === 'approved').length
    const petals = list
      .filter((s) => s.status === 'approved')
      .reduce((acc, s) => acc + (s.petalsAwarded || 50), 0)
    return { pending, approved, petals, total: list.length }
  }, [submissions])

  // Set of user emails who already have an approved submission in the past 7 days
  const usersWithApprovedSubmissionThisWeek = useMemo(() => {
    const set = new Set<string>()
    if (!submissions || !Array.isArray(submissions)) return set
    for (const sub of submissions) {
      if (sub.status === 'approved') {
        const d = sub.created_date || sub.createdAt
        if (isApprovedWithinLastWeek(d) && sub.userEmail) {
          set.add(sub.userEmail.toLowerCase().trim())
        }
      }
    }
    return set
  }, [submissions])

  // Unboxing Approval Handler wrapper
  const handleUnboxingApprove = async (id: string) => {
    if (!onApprove) return
    setUnboxingActionId(id)
    try {
      await onApprove(id)
    } finally {
      setUnboxingActionId(null)
    }
  }

  // Unboxing Reject Handler wrapper
  const handleUnboxingReject = async (id: string) => {
    if (!onReject) return
    setUnboxingActionId(id)
    try {
      await onReject(id)
    } finally {
      setUnboxingActionId(null)
    }
  }

  // ─── ADMIN TABLE COLUMNS FOR REVIEWS ───
  const reviewTableColumns = [
    {
      key: 'productName',
      label: 'Product',
      render: (row: ReviewItem) => (
        <div>
          <p className="font-semibold text-rose-300 text-xs">{row.productName}</p>
          {row.verified && <span className="text-[10px] text-emerald-400 font-medium">✓ Verified Buyer</span>}
        </div>
      ),
    },
    {
      key: 'reviewerName',
      label: 'Reviewer',
      render: (row: ReviewItem) => (
        <div>
          <p className="text-xs font-medium text-[#2d2418]">{row.reviewerName || 'Anonymous'}</p>
          {row.userEmail && <p className="text-[10px] text-[#a0918a]">{row.userEmail}</p>}
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row: ReviewItem) => renderStars(row.rating),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row: ReviewItem) => (
        <p className="text-xs text-[#6b5d4f] max-w-xs truncate" title={row.comment}>
          {row.comment}
        </p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: ReviewItem) => <Badge status={row.status || 'pending'} colors={STATUS_COLORS.submissions} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: ReviewItem) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'approved' && (
            <button
              onClick={() => handleApproveReview(row.id)}
              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium transition"
            >
              Approve
            </button>
          )}
          {row.status !== 'rejected' && (
            <button
              onClick={() => handleOpenRejectReviewModal(row.id)}
              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition"
            >
              Reject
            </button>
          )}
          <button
            onClick={() => setDeletingReviewId(row.id)}
            className="p-1 text-[#8a7a6a] hover:text-red-400 text-xs transition"
            title="Delete review"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* ─── Header & Sub-Tab Navigation ─── */}
      <SectionHeader
        title="Reviews & Gallery Management"
        subtitle="Moderate product reviews, customer gallery photos, and unboxing reward submissions"
      >
        <button
          onClick={handleGlobalRefresh}
          className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-[#6b5d4f] hover:text-[#2d2418] hover:bg-white/70 transition flex items-center gap-1.5"
          title="Refresh current section"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </SectionHeader>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass-strong rounded-2xl border border-[#2d2418]/10">
        <button
          onClick={() => setSubTab('reviews')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
            subTab === 'reviews'
              ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-lg neon-glow font-semibold'
              : 'text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
          }`}
        >
          <span>⭐</span>
          <span>Pending Reviews</span>
          {reviewStats.pending > 0 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {reviewStats.pending}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('gallery')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
            subTab === 'gallery'
              ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-lg neon-glow font-semibold'
              : 'text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
          }`}
        >
          <span>🖼️</span>
          <span>Gallery</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/70 text-[#6b5d4f]">
            {galleryStats.total}
          </span>
        </button>

        <button
          onClick={() => setSubTab('unboxing')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
            subTab === 'unboxing'
              ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white shadow-lg neon-glow font-semibold'
              : 'text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
          }`}
        >
          <span>📦</span>
          <span>Unboxing Submissions</span>
          {unboxingStats.pending > 0 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {unboxingStats.pending}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PENDING REVIEWS                                                */}
      {/* ========================================================================= */}
      {subTab === 'reviews' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Pending Moderation" value={reviewStats.pending} icon="⏳" color="text-amber-400" subtitle="Awaiting review approval" />
            <StatCard label="Approved Reviews" value={reviewStats.approved} icon="✓" color="text-emerald-400" subtitle="Visible on product pages" />
            <StatCard label="Average Rating" value={`${reviewStats.avgRating} ★`} icon="⭐" color="text-yellow-400" subtitle="Across all submissions" />
            <StatCard label="Total Reviews" value={reviewStats.total} icon="📝" color="text-[#2d2418]" subtitle="All time submitted" />
          </div>

          {/* Filters & Controls */}
          <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <SearchBar
                value={reviewSearch}
                onChange={setReviewSearch}
                placeholder="Search by reviewer, product, or review text..."
              />

              {/* Status Filter */}
              <select
                value={reviewStatusFilter}
                onChange={(e) => setReviewStatusFilter(e.target.value as any)}
                className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus border border-[#2d2418]/10 bg-gray-900"
              >
                <option value="pending" className="bg-gray-900">Status: Pending Only</option>
                <option value="all" className="bg-gray-900">Status: All Reviews</option>
                <option value="approved" className="bg-gray-900">Status: Approved</option>
                <option value="rejected" className="bg-gray-900">Status: Rejected</option>
              </select>

              {/* Rating Filter */}
              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value)}
                className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus border border-[#2d2418]/10 bg-gray-900"
              >
                <option value="all" className="bg-gray-900">Rating: All Stars</option>
                <option value="5" className="bg-gray-900">5 Stars (★★★★★)</option>
                <option value="4" className="bg-gray-900">4 Stars (★★★★☆)</option>
                <option value="3" className="bg-gray-900">3 Stars (★★★☆☆)</option>
                <option value="2" className="bg-gray-900">2 Stars (★★☆☆☆)</option>
                <option value="1" className="bg-gray-900">1 Star (★☆☆☆☆)</option>
              </select>

              {/* Verified Filter */}
              <select
                value={reviewVerifiedFilter}
                onChange={(e) => setReviewVerifiedFilter(e.target.value as any)}
                className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus border border-[#2d2418]/10 bg-gray-900"
              >
                <option value="all" className="bg-gray-900">Verification: All</option>
                <option value="verified" className="bg-gray-900">Verified Buyers Only</option>
                <option value="unverified" className="bg-gray-900">Unverified Only</option>
              </select>
            </div>

            {/* Bulk Actions & View Switch */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-[#2d2418]/10">
                <button
                  onClick={() => setReviewViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    reviewViewMode === 'cards' ? 'bg-bloom-rose text-white font-bold' : 'text-[#8a7a6a]'
                  }`}
                  title="Card View"
                >
                  Cards
                </button>
                <button
                  onClick={() => setReviewViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    reviewViewMode === 'table' ? 'bg-bloom-rose text-white font-bold' : 'text-[#8a7a6a]'
                  }`}
                  title="Table View"
                >
                  Table
                </button>
              </div>

              <button
                onClick={handleApproveAllReviews}
                disabled={bulkApproving || filteredReviews.filter((r) => (r.status || 'pending') === 'pending').length === 0}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <span>✓✓</span>
                <span>Approve All Pending ({filteredReviews.filter((r) => (r.status || 'pending') === 'pending').length})</span>
              </button>
            </div>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <LoadingSpinner />
          ) : filteredReviews.length === 0 ? (
            <EmptyState text="No reviews match your filter criteria." />
          ) : reviewViewMode === 'table' ? (
            <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/10">
              <AdminTable
                columns={reviewTableColumns}
                rows={filteredReviews}
                keyField="id"
                emptyText="No reviews available."
              />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => {
                const isApproved = review.status === 'approved'
                const isRejected = review.status === 'rejected'

                return (
                  <div
                    key={review.id}
                    className="glass-strong rounded-2xl p-5 border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition-all space-y-3"
                  >
                    {/* Top row: Product, Verified Badge, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d2418]/5 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-rose-300 tracking-wide">
                          🌸 {review.productName}
                        </span>
                        {review.verified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span>✓</span> Verified Buyer
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#a0918a]">{formatDate(review.date)}</span>
                        <Badge status={review.status || 'pending'} colors={STATUS_COLORS.submissions} />
                      </div>
                    </div>

                    {/* Reviewer & Rating */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bloom-rose/40 to-bloom-wine/40 border border-[#2d2418]/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                          {(review.reviewerName || 'A')[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#2d2418]">{review.reviewerName || 'Anonymous'}</p>
                          {review.userEmail && <p className="text-[10px] text-[#a0918a]">{review.userEmail}</p>}
                        </div>
                      </div>

                      <div>{renderStars(review.rating)}</div>
                    </div>

                    {/* Review Title & Comment */}
                    <div className="bg-black/30 rounded-xl p-3.5 border border-[#2d2418]/5 space-y-1">
                      {review.title && <p className="text-xs font-bold text-gray-200">{review.title}</p>}
                      <p className="text-xs text-[#6b5d4f] leading-relaxed whitespace-pre-wrap">
                        {review.comment || 'No review comment provided.'}
                      </p>
                    </div>

                    {/* Rejection Reason Display if rejected */}
                    {isRejected && review.rejectReason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-xs text-red-300">
                        <span className="font-semibold">Rejection reason:</span> {review.rejectReason}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {!isApproved && (
                        <button
                          onClick={() => handleApproveReview(review.id)}
                          className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium transition flex items-center gap-1"
                        >
                          <span>✓</span> Approve
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          onClick={() => handleOpenRejectReviewModal(review.id)}
                          className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-medium transition flex items-center gap-1"
                        >
                          <span>✕</span> Reject
                        </button>
                      )}

                      <button
                        onClick={() => setDeletingReviewId(review.id)}
                        className="px-3 py-1.5 glass hover:bg-white/70 text-[#8a7a6a] hover:text-red-400 rounded-xl text-xs transition"
                        title="Delete review"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: GALLERY                                                         */}
      {/* ========================================================================= */}
      {subTab === 'gallery' && (
        <div className="space-y-6">
          {/* Gallery Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Gallery Items" value={galleryStats.total} icon="🖼️" color="text-[#2d2418]" subtitle="Customer uploaded media" />
            <StatCard label="Featured Items" value={galleryStats.featured} icon="⭐" color="text-amber-400" subtitle="Promoted on homepage" />
            <StatCard label="Public / Approved" value={galleryStats.approved} icon="✓" color="text-emerald-400" subtitle="Visible to visitors" />
            <StatCard label="Pending Approval" value={galleryStats.pending} icon="⏳" color="text-amber-300" subtitle="Awaiting moderation" />
          </div>

          {/* Controls */}
          <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <SearchBar
                value={gallerySearch}
                onChange={setGallerySearch}
                placeholder="Search gallery by email or caption..."
              />

              <select
                value={galleryStatusFilter}
                onChange={(e) => setGalleryStatusFilter(e.target.value as any)}
                className="px-3 py-2 glass rounded-xl text-xs text-[#2d2418] glow-focus border border-[#2d2418]/10 bg-gray-900"
              >
                <option value="all" className="bg-gray-900">Status: All Media</option>
                <option value="pending" className="bg-gray-900">Status: Pending</option>
                <option value="approved" className="bg-gray-900">Status: Approved</option>
                <option value="rejected" className="bg-gray-900">Status: Rejected</option>
              </select>

              <Toggle
                checked={galleryFeaturedOnly}
                onChange={setGalleryFeaturedOnly}
                label="Featured Only"
              />
            </div>
          </div>

          {/* Gallery Grid */}
          {galleryLoading ? (
            <LoadingSpinner />
          ) : filteredGallery.length === 0 ? (
            <EmptyState text="No gallery items found matching your filters." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGallery.map((item) => {
                const isVideo = isVideoMedia(item.mediaUrl, item.mediaType)

                return (
                  <div
                    key={item._id}
                    className="glass-strong rounded-2xl border border-[#2d2418]/10 overflow-hidden flex flex-col justify-between hover:border-[#2d2418]/15 transition-all group"
                  >
                    {/* Media Preview Container */}
                    <div className="relative aspect-square bg-black/60 overflow-hidden cursor-pointer">
                      {isVideo ? (
                        <div
                          onClick={() =>
                            setPreviewMedia({
                              url: item.mediaUrl,
                              type: 'video',
                              caption: item.caption,
                              email: item.userEmail,
                            })
                          }
                          className="w-full h-full flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition"
                        >
                          <video
                            src={item.mediaUrl}
                            className="w-full h-full object-cover pointer-events-none"
                            muted
                            loop
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-[#2d2418]/15 flex items-center justify-center text-[#2d2418] text-xl group-hover:scale-110 transition">
                              ▶
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.caption || 'Customer Gallery'}
                          onClick={() =>
                            setPreviewMedia({
                              url: item.mediaUrl,
                              type: 'image',
                              caption: item.caption,
                              email: item.userEmail,
                            })
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}

                      {/* Top Badges Overlay */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                        <Badge status={item.status} colors={STATUS_COLORS.submissions} />

                        {/* Featured Star Toggle Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFeaturedGallery(item._id)
                          }}
                          className={`pointer-events-auto p-1.5 rounded-full border backdrop-blur-md transition ${
                            item.featured
                              ? 'bg-amber-500/80 text-[#2d2418] border-amber-300 shadow-md'
                              : 'bg-black/50 text-[#8a7a6a] hover:text-amber-300 border-[#2d2418]/10'
                          }`}
                          title={item.featured ? 'Unfeature item' : 'Feature item'}
                        >
                          ⭐
                        </button>
                      </div>

                      {/* Video tag indicator bottom-left */}
                      {isVideo && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-[#2d2418] border border-[#2d2418]/10">
                          🎥 Video
                        </span>
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[#2d2418] truncate" title={item.userEmail}>
                          👤 {item.userEmail}
                        </p>
                        <p className="text-xs text-[#8a7a6a] line-clamp-2 leading-relaxed">
                          {item.caption || 'No caption provided.'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#2d2418]/5 space-y-3">
                        <p className="text-[10px] text-[#a0918a]">{formatDate(item.created_date || item.createdAt)}</p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-1.5 pt-1">
                          <div className="flex items-center gap-1.5">
                            {item.status !== 'approved' && (
                              <button
                                onClick={() => handleApproveGallery(item._id)}
                                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium transition"
                              >
                                Approve
                              </button>
                            )}

                            {item.status !== 'rejected' && (
                              <button
                                onClick={() => handleRejectGallery(item._id)}
                                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition"
                              >
                                Reject
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => setDeletingGalleryId(item._id)}
                            className="p-1 text-[#a0918a] hover:text-red-400 text-xs transition"
                            title="Delete submission"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: UNBOXING SUBMISSIONS                                          */}
      {/* ========================================================================= */}
      {subTab === 'unboxing' && (
        <div className="space-y-6">
          {/* Stats Header (as specified by prompt) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Pending Submissions"
              value={unboxingStats.pending}
              icon="⏳"
              color="text-amber-400"
              subtitle="Awaiting unboxing review"
            />
            <StatCard
              label="Approved Submissions"
              value={unboxingStats.approved}
              icon="✓"
              color="text-emerald-400"
              subtitle="Reward criteria verified"
            />
            <StatCard
              label="Total Petals Awarded"
              value={`🌸 ${unboxingStats.petals}`}
              icon="🎁"
              color="text-rose-400"
              subtitle="Distributed to active creators"
            />
          </div>

          {/* Unboxing Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : !submissions || submissions.length === 0 ? (
            <EmptyState text="No unboxing video/photo submissions currently available." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub) => {
                const isVideo = isVideoMedia(sub.mediaUrl, sub.mediaType)
                const userEmailClean = (sub.userEmail || '').toLowerCase().trim()
                const hasWeeklyWarning = usersWithApprovedSubmissionThisWeek.has(userEmailClean)
                const isProcessing = unboxingActionId === sub._id

                return (
                  <div
                    key={sub._id}
                    className="glass-strong rounded-2xl border border-[#2d2418]/10 overflow-hidden hover:border-[#2d2418]/15 transition flex flex-col justify-between"
                  >
                    {/* Media Preview Box */}
                    <div className="relative aspect-video bg-black/60 overflow-hidden cursor-pointer">
                      {isVideo ? (
                        <video
                          src={sub.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={sub.mediaUrl}
                          alt={sub.caption || 'Unboxing submission'}
                          onClick={() =>
                            setPreviewMedia({
                              url: sub.mediaUrl,
                              type: 'image',
                              caption: sub.caption,
                              email: sub.userEmail,
                            })
                          }
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      )}

                      {/* Top status overlay */}
                      <div className="absolute top-2 right-2 pointer-events-none">
                        <Badge status={sub.status} colors={STATUS_COLORS.submissions} />
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[#2d2418] truncate" title={sub.userEmail}>
                            👤 {sub.userEmail}
                          </p>
                          <span className="text-[10px] text-[#a0918a]">
                            {formatDate(sub.created_date || sub.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-[#6b5d4f] leading-relaxed bg-black/20 p-2.5 rounded-xl border border-[#2d2418]/5">
                          {sub.caption || 'No unboxing caption provided.'}
                        </p>

                        {/* Petals Award Info */}
                        <div className="flex items-center gap-2 text-xs text-rose-300 font-medium">
                          <span>🌸 Reward:</span>
                          <span className="bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 text-rose-200">
                            +{sub.petalsAwarded || 50} Petals
                          </span>
                        </div>

                        {/* WEEKLY WARNING DISPLAY */}
                        {hasWeeklyWarning && (
                          <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-start gap-2">
                            <span className="text-sm">⚠️</span>
                            <div>
                              <p className="font-semibold">Weekly Reward Limit Notice</p>
                              <p className="text-[11px] text-amber-200/80">
                                This user already has an approved submission within the past 7 days.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions: APPROVE / REJECT */}
                      <div className="pt-3 border-t border-[#2d2418]/5 flex items-center gap-3">
                        <button
                          onClick={() => handleUnboxingApprove(sub._id)}
                          disabled={isProcessing}
                          className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <>
                              <span>✓</span> Approve (+Petals)
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleUnboxingReject(sub._id)}
                          disabled={isProcessing}
                          className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <>
                              <span>✕</span> Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS & DIALOGS                                                          */}
      {/* ========================================================================= */}

      {/* 1. Reject Review Dialog */}
      {rejectingReviewId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRejectingReviewId(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full border border-[#2d2418]/10 space-y-4">
            <h3 className="text-lg font-bold text-[#2d2418]">Reject Review</h3>
            <p className="text-xs text-[#8a7a6a]">
              Provide an optional reason for rejecting this product review.
            </p>
            <textarea
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="e.g. Inappropriate language, spam, or off-topic content..."
              rows={3}
              className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#2d2418] placeholder-gray-600 glow-focus resize-none"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setRejectingReviewId(null)}
                className="px-4 py-2 glass rounded-xl text-xs hover:bg-white/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectReview}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
              >
                Reject Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Confirm Delete Review Dialog */}
      <ConfirmDialog
        open={Boolean(deletingReviewId)}
        title="Delete Review"
        message="Are you sure you want to permanently remove this review? This action cannot be undone."
        confirmText="Delete"
        danger={true}
        onConfirm={() => deletingReviewId && handleDeleteReview(deletingReviewId)}
        onCancel={() => setDeletingReviewId(null)}
      />

      {/* 3. Confirm Delete Gallery Dialog */}
      <ConfirmDialog
        open={Boolean(deletingGalleryId)}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this media item from the gallery?"
        confirmText="Delete"
        danger={true}
        onConfirm={() => deletingGalleryId && handleDeleteGallery(deletingGalleryId)}
        onCancel={() => setDeletingGalleryId(null)}
      />

      {/* 4. Media Lightbox Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPreviewMedia(null)} />
          <div className="relative glass-strong rounded-2xl p-4 max-w-2xl w-full border border-[#2d2418]/15 space-y-3 z-10">
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2418]/10">
              <p className="text-xs font-semibold text-[#2d2418]">👤 {previewMedia.email || 'Media Preview'}</p>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-[#8a7a6a] hover:text-[#2d2418] p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
              {previewMedia.type === 'video' ? (
                <video src={previewMedia.url} controls autoPlay className="max-h-[60vh] w-auto rounded-xl" />
              ) : (
                <img src={previewMedia.url} alt="Full Preview" className="max-h-[60vh] w-auto object-contain rounded-xl" />
              )}
            </div>

            {previewMedia.caption && (
              <p className="text-xs text-[#6b5d4f] p-3 bg-black/40 rounded-xl border border-[#2d2418]/5">
                {previewMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewsGallerySection
