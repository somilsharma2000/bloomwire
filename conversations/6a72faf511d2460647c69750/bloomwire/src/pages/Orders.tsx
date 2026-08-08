import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useOrderStore, type Order } from '../store/orderStore'
import { useAuth } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { useCart } from '../store/cartStore'
import {
  TruckIcon,
  CheckCircleIcon,
  GiftIcon,
  FlameIcon,
  ArrowRightIcon,
  ClockIcon,
  PetalIcon,
  ChevronDownIcon,
  SearchIcon,
  CartIcon,
  SparkleIcon,
  CheckIcon,
} from '../components/Icons'

/**
 * Generate a clean, self-contained HTML invoice for the order
 */
function generateInvoiceHTML(order: Order): string {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const formattedDelivery = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bloomwire Invoice - ${order.id}</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0a0a0f; color: #f3f4f6; margin: 0; padding: 32px 16px; min-height: 100vh; }
    .invoice-box { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid rgba(45, 36, 24, 0.1); border-radius: 20px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(45, 36, 24, 0.08); padding-bottom: 24px; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .brand { font-family: Georgia, serif; font-size: 32px; font-weight: 700; color: #ff4081; letter-spacing: -0.5px; }
    .tagline { color: #9ca3af; font-size: 13px; margin-top: 4px; }
    .invoice-details { text-align: right; }
    .invoice-details h2 { margin: 0; font-size: 24px; color: #f5c563; font-weight: 700; }
    .invoice-details p { margin: 4px 0 0; font-size: 13px; color: #9ca3af; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .info-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; }
    .info-card h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #ff4081; margin: 0 0 12px 0; font-weight: 700; }
    .info-card p { margin: 4px 0; font-size: 14px; color: #d1d5db; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; }
    td { padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 14px; color: #e5e7eb; }
    .item-cell { display: flex; align-items: center; gap: 12px; }
    .item-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }
    .totals-container { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-table { width: 320px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #9ca3af; }
    .totals-row.grand-total { border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 12px; margin-top: 8px; font-size: 18px; font-weight: 700; color: #ffffff; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
    .status-processing { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-shipped { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .status-out-for-delivery { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
    .status-delivered { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .footer { text-align: center; border-top: 1px solid rgba(45, 36, 24, 0.08); padding-top: 24px; font-size: 13px; color: #6b7280; }
    @media print {
      body { background: #ffffff; color: #111827; padding: 0; }
      .invoice-box { background: #ffffff; border: none; box-shadow: none; color: #111827; }
      .info-card, .totals-table { background: #f9fafb; border-color: #e5e7eb; }
      th, td { border-color: #e5e7eb; color: #111827; }
      .brand { color: #e91e63; }
      .totals-row.grand-total { color: #111827; border-color: #d1d5db; }
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div>
        <div class="brand">Bloomwire</div>
        <div class="tagline">Handcrafted Chenille Floral Art</div>
      </div>
      <div class="invoice-details">
        <h2>TAX INVOICE</h2>
        <p>Invoice #: <strong>${order.id}</strong></p>
        <p>Order Date: ${formattedDate}</p>
        <p style="margin-top: 6px;">
          <span class="badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
        </p>
      </div>
    </div>

    <div class="grid">
      <div class="info-card">
        <h3>Shipping Address</h3>
        <p><strong>${order.shippingAddress.name || 'Customer'}</strong></p>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
        <p>Phone: ${order.shippingAddress.phone}</p>
        <p>Email: ${order.shippingAddress.email}</p>
      </div>

      <div class="info-card">
        <h3>Order Details</h3>
        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>Delivery Option:</strong> ${order.deliveryTier.toUpperCase()} (${order.deliveryCost === 0 ? 'FREE' : '₹' + order.deliveryCost})</p>
        <p><strong>Est. Delivery:</strong> ${formattedDelivery}</p>
        ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> <code style="color:#ff4081">${order.trackingNumber}</code></p>` : ''}
        <p><strong>Petals Earned:</strong> <span style="color:#f5c563">+${order.petalsEarned} Petals</span></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>
              <div class="item-cell">
                <img src="${item.image}" alt="${item.name}" class="item-img" />
                <div>
                  <strong>${item.name}</strong>
                </div>
              </div>
            </td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: right;">₹${item.price}</td>
            <td style="text-align: right;"><strong>₹${item.price * item.qty}</strong></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals-container">
      <div class="totals-table">
        <div class="totals-row">
          <span>Items Subtotal</span>
          <span>₹${order.subtotal}</span>
        </div>
        <div class="totals-row">
          <span>Shipping Fee</span>
          <span>${order.shipping === 0 ? 'FREE' : '₹' + order.shipping}</span>
        </div>
        ${
          order.giftWrap
            ? `
        <div class="totals-row">
          <span>Gift Wrap & Handwritten Note</span>
          <span>₹${order.giftWrapFee}</span>
        </div>`
            : ''
        }
        ${
          order.deliveryCost > 0
            ? `
        <div class="totals-row">
          <span>Delivery Option (${order.deliveryTier.toUpperCase()})</span>
          <span>₹${order.deliveryCost}</span>
        </div>`
            : ''
        }
        <div class="totals-row grand-total">
          <span>Total Paid</span>
          <span style="color: #ff4081;">₹${order.total}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing Bloomwire! Each stem is lovingly handcrafted to bloom for years with proper care.</p>
      <p style="margin-top: 4px;">Need assistance? Contact support at <strong>orders@bloomwire.in</strong></p>
    </div>
  </div>
</body>
</html>`
}

const TRACKING_STAGES = [
  {
    key: 'Processing',
    label: 'Processing',
    sublabel: 'Order Confirmed & Prepared',
    description: 'Your handcrafted stems are being artfully arranged in our floral studio.',
    icon: FlameIcon,
  },
  {
    key: 'Shipped',
    label: 'Shipped',
    sublabel: 'In Transit with Express Courier',
    description: 'Package dispatched and secured with protective velvet wrapping.',
    icon: GiftIcon,
  },
  {
    key: 'Out for Delivery',
    label: 'Out for Delivery',
    sublabel: 'Arriving Today',
    description: 'Our delivery agent is nearby and en route to your shipping address.',
    icon: TruckIcon,
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    sublabel: 'Handed Over with Love',
    description: 'Order delivered successfully. Enjoy your long-lasting blooms!',
    icon: CheckCircleIcon,
  },
] as const

const getStageIndex = (status: Order['status']): number => {
  switch (status) {
    case 'Processing':
      return 0
    case 'Shipped':
      return 1
    case 'Out for Delivery':
      return 2
    case 'Delivered':
      return 3
    case 'Cancelled':
      return -1
    default:
      return 0
  }
}

export default function Orders() {
  const user = useAuth((s) => s.user)
  const getUserOrders = useOrderStore((s) => s.getUserOrders)
  const allOrders = useOrderStore((s) => s.orders)
  const cancelOrder = useOrderStore((s) => s.cancelOrder)
  const fetchOrders = useOrderStore((s) => s.fetchOrders)


  // Fetch orders from backend on mount
  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email)
    }
  }, [user?.email, fetchOrders])
  const addPetals = useAuth((s) => s.addPetals)

  const addItemToCart = useCart((s) => s.addItem)
  const showToast = useToastStore((s) => s.showToast)

  const [expandedTracking, setExpandedTracking] = useState<Record<string, boolean>>({})
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All')

  // Get orders for logged in user only (security: no guest fallback)
  const userOrders = useMemo(() => {
    if (user?.email) {
      return getUserOrders(user.email)
    }
    return []
  }, [user?.email, getUserOrders, allOrders])

  // Filter orders by search term and status tab
  const filteredOrders = useMemo(() => {
    return userOrders.filter((order) => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter
      const term = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(term)) ||
        order.items.some((item) => item.name.toLowerCase().includes(term))

      return matchesStatus && matchesSearch
    })
  }, [userOrders, statusFilter, searchTerm])

  const toggleTracking = (orderId: string) => {
    setExpandedTracking((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum)
    setCopiedTracking(trackingNum)
    showToast('Tracking number copied to clipboard', 'info')
    setTimeout(() => setCopiedTracking(null), 2500)
  }

  const handleBuyAgain = (order: Order) => {
    order.items.forEach((item) => {
      addItemToCart({
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty,
      })
    })
    showToast(`Added ${order.items.length} item${order.items.length > 1 ? 's' : ''} to collection!`, 'cart')
  }

  const handleCancelOrder = (orderId: string) => {
    const reversedPetals = cancelOrder(orderId)
      if (reversedPetals > 0) {
        // Deduct petals from user balance — may go negative
        addPetals(-reversedPetals)
        showToast(`Order cancelled. ${reversedPetals} Petals reversed.`, 'info')
      }
    showToast(`Order #${orderId} has been cancelled`, 'info')
  }

  const handleDownloadInvoice = (order: Order) => {
    try {
      const htmlString = generateInvoiceHTML(order)
      const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `Bloomwire_Invoice_${order.id}.html`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
      showToast(`Invoice #${order.id} downloaded!`, 'success')
    } catch {
      showToast('Failed to download invoice', 'error')
    }
  }


  // Render Status Badge
  const renderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Processing
          </span>
        )
      case 'Shipped':
        return (
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <TruckIcon size={12} />
            Shipped
          </span>
        )
      case 'Out for Delivery':
        return (
          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <SparkleIcon size={12} />
            Out for Delivery
          </span>
        )
      case 'Delivered':
        return (
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <CheckCircleIcon size={12} />
            Delivered
          </span>
        )
      case 'Cancelled':
        return (
          <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm">
            Cancelled
          </span>
        )
    }
  }

  // Empty State Rendering
  if (userOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center relative z-10 animate-fade-up">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-bloom-rose/20 to-bloom-wine/10 border border-bloom-rose/30 flex items-center justify-center mx-auto mb-6 neon-glow">
          <GiftIcon size={48} className="text-bloom-neon animate-float-soft" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-3 text-[#2d2418]">No Orders Yet</h1>
        <p className="text-[#8a7a6a] mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          You haven't placed any orders yet. Discover our handcrafted lasting flowers and start creating long-lasting floral memories today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition"
          >
            Start Shopping <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#2d2418]/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-bloom-rose/10 border border-bloom-rose/20 text-bloom-neon">
              <TruckIcon size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2418] tracking-tight">
              Your Orders
            </h1>
            <span className="px-3 py-1 bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40 text-xs font-bold rounded-full">
              {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <p className="text-sm text-[#8a7a6a]">
            Track deliveries, reorder your favorite stems, or download tax invoices.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7a6a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, product, or tracking..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F3]/80 border border-[#2d2418]/10 rounded-full text-sm text-[#2d2418] placeholder-[#a0918a] focus:outline-none focus:border-bloom-rose/60 focus:ring-1 focus:ring-bloom-rose/60 transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {(['All', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map((tab) => {
          const count =
            tab === 'All' ? userOrders.length : userOrders.filter((o) => o.status === tab).length
          const isActive = statusFilter === tab

          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white border-bloom-rose/60 neon-glow'
                  : 'glass text-[#8a7a6a] hover:text-[#2d2418] border-[#2d2418]/10 hover:border-[#2d2418]/15'
              }`}
            >
              {tab}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/80 text-[#2d2418]' : 'bg-white/60 text-[#8a7a6a]'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filtered Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass rounded-2xl p-6 sm:p-12 text-center border border-[#2d2418]/10 my-8">
          <ClockIcon size={36} className="text-[#a0918a] mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-1">No Matching Orders</h3>
          <p className="text-sm text-[#8a7a6a] mb-4">
            No orders found matching your search query or filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('All')
            }}
            className="text-xs text-bloom-neon hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isTrackingOpen = !!expandedTracking[order.id]
            const currentStageIdx = getStageIndex(order.status)
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
            const formattedEstDelivery = new Date(order.estimatedDelivery).toLocaleDateString(
              'en-IN',
              { day: 'numeric', month: 'short', year: 'numeric' }
            )

            return (
              <div
                key={order.id}
                className="glass-strong rounded-2xl border border-[#2d2418]/10 hover:border-bloom-rose/30 transition-all duration-300 overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-5 bg-white/[0.02] border-b border-[#2d2418]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-bloom-neon tracking-wider bg-bloom-rose/10 px-2.5 py-1 rounded-md border border-bloom-rose/20">
                      #{order.id}
                    </span>
                    <span className="text-xs text-[#8a7a6a] flex items-center gap-1">
                      <ClockIcon size={12} /> Placed on {formattedDate}
                    </span>
                    {order.trackingNumber && (
                      <button
                        onClick={() => handleCopyTracking(order.trackingNumber!)}
                        className="text-xs font-mono text-[#8a7a6a] hover:text-[#2d2418] glass px-2 py-0.5 rounded border border-[#2d2418]/10 flex items-center gap-1 transition"
                        title="Click to copy tracking number"
                      >
                        {copiedTracking === order.trackingNumber ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-sans">
                            <CheckIcon size={12} /> Copied
                          </span>
                        ) : (
                          <>TRK: {order.trackingNumber}</>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {renderStatusBadge(order.status)}
                    <span className="text-xs text-[#8a7a6a] border-l border-[#2d2418]/10 pl-3">
                      Est. Delivery:{' '}
                      <strong className="text-[#2d2418] font-medium">{formattedEstDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Items Row & Summary */}
                <div className="p-5 sm:p-6 border-b border-[#2d2418]/10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Items Thumbnails + List */}
                    <div className="lg:col-span-8 space-y-3">
                      <p className="text-xs text-[#8a7a6a] font-medium uppercase tracking-wider mb-2">
                        Ordered Items ({order.items.reduce((acc, i) => acc + i.qty, 0)})
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 glass rounded-xl border border-[#2d2418]/10 hover:border-[#2d2418]/15 transition min-w-[220px] flex-1 sm:flex-initial"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-[#2d2418]/10 flex-shrink-0"
                            />
                            <div className="min-w-0 pr-2">
                              <h4 className="text-xs sm:text-sm font-medium text-[#2d2418] truncate max-w-[160px]">
                                {item.name}
                              </h4>
                              <p className="text-xs text-[#8a7a6a] mt-0.5">
                                Qty: <strong className="text-[#2d2418]">{item.qty}</strong> × ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost & Delivery Breakdown */}
                    <div className="lg:col-span-4 glass rounded-xl p-4 border border-[#2d2418]/10 flex flex-col justify-between h-full">
                      <div className="space-y-1.5 text-xs text-[#8a7a6a] mb-3">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="text-[#2d2418]">₹{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Tier:</span>
                          <span className="text-[#2d2418] capitalize">{order.deliveryTier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span className="text-[#2d2418] uppercase">{order.paymentMethod}</span>
                        </div>
                        {order.giftWrap && (
                          <div className="flex justify-between text-bloom-rose">
                            <span>Gift Wrap Fee:</span>
                            <span>₹{order.giftWrapFee}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#2d2418]/10 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-[#8a7a6a] block">Total Amount</span>
                          <span className="text-lg font-bold text-[#2d2418]">₹{order.total}</span>
                        </div>
                        {order.petalsEarned > 0 && (
                          <div className="px-2.5 py-1 bg-bloom-gold/10 text-bloom-gold border border-bloom-gold/30 rounded-full text-[11px] font-semibold flex items-center gap-1">
                            <PetalIcon size={12} /> +{order.petalsEarned} Petals
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Tracking Timeline (When Expanded) */}
                {isTrackingOpen && (
                  <div className="p-6 bg-[#FFF8F3]/60 border-b border-[#2d2418]/10 animate-fade-down">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-serif font-bold text-[#2d2418] flex items-center gap-2">
                        <TruckIcon size={18} className="text-bloom-neon" /> Live Order Tracking
                      </h3>
                      {order.trackingNumber && (
                        <span className="text-xs text-[#8a7a6a]">
                          Carrier Tracking ID:{' '}
                          <code className="text-bloom-gold font-mono">{order.trackingNumber}</code>
                        </span>
                      )}
                    </div>

                    {order.status === 'Cancelled' ? (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                        <p className="text-sm text-red-400 font-medium mb-1">
                          This order was cancelled.
                        </p>
                        <p className="text-xs text-[#8a7a6a]">
                          If you have any questions regarding refunds or re-ordering, please reach out to orders@bloomwire.in.
                        </p>
                      </div>
                    ) : (
                      <div className="relative py-2">
                        {/* Timeline Stages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                          {TRACKING_STAGES.map((stage, idx) => {
                            const isCompleted = idx < currentStageIdx
                            const isCurrent = idx === currentStageIdx
                            const StageIcon = stage.icon

                            return (
                              <div
                                key={stage.key}
                                className={`flex flex-col p-4 rounded-xl border transition-all ${
                                  isCurrent
                                    ? 'bg-bloom-rose/10 border-bloom-rose/50 neon-border'
                                    : isCompleted
                                    ? 'glass border-emerald-500/30'
                                    : 'bg-white/[0.02] border-[#2d2418]/10 opacity-60'
                                }`}
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                      isCompleted
                                        ? 'bg-emerald-500 text-[#2d2418]'
                                        : isCurrent
                                        ? 'bg-gradient-to-r from-bloom-rose to-bloom-wine text-white animate-pulse'
                                        : 'bg-white/70 text-[#a0918a]'
                                    }`}
                                  >
                                    {isCompleted ? <CheckIcon size={16} /> : <StageIcon size={16} />}
                                  </div>
                                  <div>
                                    <h4
                                      className={`text-xs font-bold uppercase tracking-wider ${
                                        isCurrent
                                          ? 'text-bloom-neon'
                                          : isCompleted
                                          ? 'text-emerald-400'
                                          : 'text-[#8a7a6a]'
                                      }`}
                                    >
                                      {stage.label}
                                    </h4>
                                    <span className="text-[10px] text-[#8a7a6a] block">
                                      {isCompleted
                                        ? 'Completed'
                                        : isCurrent
                                        ? 'Current Status'
                                        : 'Pending'}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-xs text-[#6b5d4f] font-medium mb-1">
                                  {stage.sublabel}
                                </p>
                                <p className="text-[11px] text-[#8a7a6a] leading-snug">
                                  {stage.description}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Action Buttons Footer */}
                <div className="p-4 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => toggleTracking(order.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                      isTrackingOpen
                        ? 'bg-bloom-rose text-white shadow-md'
                        : 'glass text-[#6b5d4f] hover:text-[#2d2418] hover:border-bloom-rose/30'
                    }`}
                  >
                    <TruckIcon size={14} />
                    {isTrackingOpen ? 'Hide Tracking' : 'Track Order'}
                    <ChevronDownIcon
                      size={14}
                      className={`transition-transform duration-200 ${
                        isTrackingOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Buy Again */}
                    <button
                      onClick={() => handleBuyAgain(order)}
                      className="px-4 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium rounded-full shimmer-btn hover:scale-105 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <CartIcon size={14} /> Buy Again
                    </button>

                    {/* Download Invoice */}
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="px-4 py-2 glass text-[#6b5d4f] hover:text-[#2d2418] text-xs font-medium rounded-full hover:border-[#2d2418]/15 transition flex items-center gap-1.5"
                    >
                      <GiftIcon size={14} className="text-bloom-gold" /> Download Invoice
                    </button>

                    {/* Cancel Order (Only if Processing) */}
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-medium rounded-full transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom Floating Navigation or Continue Shopping */}
      <div className="mt-12 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 glass text-[#6b5d4f] hover:text-[#2d2418] rounded-full text-sm font-medium hover:bg-white/70 transition"
        >
          <PetalIcon size={16} className="text-bloom-rose" /> Browse More Collections
        </Link>
      </div>
    </div>
  )
}
