import { useState, useMemo } from 'react'
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
  Input,
  Select,
  FormField
} from './shared'
import { api } from '../../lib/api'

export interface OrdersSectionProps {
  orders?: any[]
  loading?: boolean
  onRefresh?: () => void
  onNavigate?: (tab: string) => void
}

// ─── Constants & Options ───
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Packed', label: 'Packed' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Out for Delivery', label: 'Out for Delivery' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Returned', label: 'Returned' },
]

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date: Newest First' },
  { value: 'date-asc', label: 'Date: Oldest First' },
  { value: 'total-desc', label: 'Total: High to Low' },
  { value: 'total-asc', label: 'Total: Low to High' },
]

const COURIER_OPTIONS = [
  { value: 'Delhivery', label: 'Delhivery' },
  { value: 'Bluedart', label: 'Bluedart' },
  { value: 'Xpressbees', label: 'Xpressbees' },
  { value: 'Speed Post', label: 'Speed Post' },
  { value: 'Other', label: 'Other Courier' },
]

const PIPELINE_STEPS = [
  'Processing',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
]

// ─── Helper Functions ───
const getOrderId = (order: any): string => {
  return order?.id || order?.orderId || order?.paymentId || order?._id || 'N/A'
}

const getOrderEmail = (order: any): string => {
  return order?.userEmail || order?.email || order?.customerEmail || order?.shippingAddress?.email || 'N/A'
}

const getOrderPhone = (order: any): string => {
  return order?.shippingAddress?.phone || order?.phone || order?.userPhone || ''
}

const getOrderDate = (order: any): string => {
  const d = order?.createdAt || order?.created_at || order?.date || order?.timestamp
  if (!d) return 'N/A'
  try {
    const dateObj = new Date(d)
    if (isNaN(dateObj.getTime())) return String(d)
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return String(d)
  }
}

const getOrderTimestamp = (order: any): number => {
  const d = order?.createdAt || order?.created_at || order?.date || order?.timestamp
  if (!d) return 0
  const t = new Date(d).getTime()
  return isNaN(t) ? 0 : t
}

const getOrderTotal = (order: any): number => {
  if (typeof order?.total === 'number') return order.total
  if (typeof order?.amount === 'number') return order.amount
  if (typeof order?.subtotal === 'number') {
    return order.subtotal + (order.shipping || 0) + (order.giftWrapFee || 0) - (order.discount || 0)
  }
  return 0
}

const getOrderItems = (order: any): any[] => {
  if (Array.isArray(order?.items)) return order.items
  return []
}

const getOrderItemsCount = (order: any): number => {
  const items = getOrderItems(order)
  if (items.length === 0) return order?.itemsCount || order?.itemCount || 0
  return items.reduce((sum: number, item: any) => sum + (item.qty || item.quantity || 1), 0)
}

const getOrderStatus = (order: any): string => {
  return order?.status || 'Processing'
}

export default function OrdersSection({
  orders = [],
  loading = false,
  onRefresh,
  onNavigate
}: OrdersSectionProps) {
  // ─── Filter, Sort & Pagination State ───
  const [search, setSearch] = useState('')
  const [statusFilter, setOrderFilter] = useState('all')
  const [sortOption, setSortOption] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // ─── Selected Order / Modal State ───
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [updatingId, setUpdatingId] = useState<string>('')
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string>('')

  // Modal Update Status controls
  const [modalStatus, setModalStatus] = useState<string>('Processing')
  const [modalCourier, setModalCourier] = useState<string>('Delhivery')
  const [modalCustomCourier, setModalCustomCourier] = useState<string>('')
  const [modalTracking, setModalTracking] = useState<string>('')
  const [modalReason, setModalReason] = useState<string>('')

  // Confirm cancel dialog state
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)

  // ─── Stats Calculations ───
  const stats = useMemo(() => {
    const totalOrders = orders.length
    let totalRevenue = 0
    let processingCount = 0
    let deliveredCount = 0
    let inTransitCount = 0

    for (const o of orders) {
      const st = getOrderStatus(o)
      const tot = getOrderTotal(o)
      if (st !== 'Cancelled') totalRevenue += tot
      if (st === 'Processing') processingCount++
      if (st === 'Delivered') deliveredCount++
      if (st === 'Shipped' || st === 'Out for Delivery') inTransitCount++
    }

    return {
      totalOrders,
      totalRevenue,
      processingCount,
      deliveredCount,
      inTransitCount
    }
  }, [orders])

  // ─── Filtered & Sorted Orders ───
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Search filter (order ID or customer email)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(o => {
        const id = getOrderId(o).toLowerCase()
        const email = getOrderEmail(o).toLowerCase()
        const phone = getOrderPhone(o).toLowerCase()
        return id.includes(q) || email.includes(q) || phone.includes(q)
      })
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(o => getOrderStatus(o) === statusFilter)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'date-desc') return getOrderTimestamp(b) - getOrderTimestamp(a)
      if (sortOption === 'date-asc') return getOrderTimestamp(a) - getOrderTimestamp(b)
      if (sortOption === 'total-desc') return getOrderTotal(b) - getOrderTotal(a)
      if (sortOption === 'total-asc') return getOrderTotal(a) - getOrderTotal(b)
      return 0
    })

    return result
  }, [orders, search, statusFilter, sortOption])

  // Reset page to 1 when filters change
  const handleSearchChange = (v: string) => {
    setSearch(v)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (v: string) => {
    setOrderFilter(v)
    setCurrentPage(1)
  }

  const handleSortChange = (v: string) => {
    setSortOption(v)
    setCurrentPage(1)
  }

  // ─── Pagination Calculations ───
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, currentPage, pageSize])

  // ─── Export CSV ───
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return

    const headers = [
      'Order ID',
      'Date',
      'Customer Email',
      'Customer Phone',
      'Items Count',
      'Subtotal',
      'Shipping',
      'Discount',
      'Gift Wrap Fee',
      'Total',
      'Payment Method',
      'Status',
      'Tracking Number',
      'Shipping Address'
    ]

    const csvRows = [headers.join(',')]

    for (const o of filteredOrders) {
      const id = getOrderId(o)
      const date = getOrderDate(o)
      const email = getOrderEmail(o)
      const phone = getOrderPhone(o)
      const itemsCount = getOrderItemsCount(o)
      const subtotal = o?.subtotal || 0
      const shipping = o?.shipping || 0
      const discount = o?.discount || 0
      const giftWrapFee = o?.giftWrapFee || 0
      const total = getOrderTotal(o)
      const paymentMethod = o?.paymentMethod || o?.payment_method || 'Online'
      const status = getOrderStatus(o)
      const tracking = o?.trackingNumber || o?.tracking_number || ''
      
      const addr = o?.shippingAddress
        ? `${o.shippingAddress.name || ''}, ${o.shippingAddress.address || ''}, ${o.shippingAddress.city || ''}, ${o.shippingAddress.state || ''} - ${o.shippingAddress.pincode || ''}`
        : ''

      const clean = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`

      const row = [
        clean(id),
        clean(date),
        clean(email),
        clean(phone),
        itemsCount,
        subtotal,
        shipping,
        discount,
        giftWrapFee,
        total,
        clean(paymentMethod),
        clean(status),
        clean(tracking),
        clean(addr)
      ]

      csvRows.push(row.join(','))
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `bloomwire-orders-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ─── Modal Open Helper ───
  const openOrderModal = (order: any) => {
    setSelectedOrder(order)
    const currentSt = getOrderStatus(order)
    setModalStatus(currentSt)
    setModalTracking(order?.trackingNumber || order?.tracking_number || '')
    setModalCourier('Delhivery')
    setModalCustomCourier('')
    setModalReason('')
    setUpdateSuccessMsg('')
  }

  const closeOrderModal = () => {
    setSelectedOrder(null)
    setUpdateSuccessMsg('')
  }

  // ─── Status Update Handler ───
  const handleSaveStatusUpdate = async () => {
    if (!selectedOrder) return
    const orderId = getOrderId(selectedOrder)
    setUpdatingId(orderId)
    setUpdateSuccessMsg('')

    try {
      let trackingPayload = modalTracking
      if (modalStatus === 'Shipped') {
        const courierName = modalCourier === 'Other' ? modalCustomCourier : modalCourier
        if (courierName) {
          trackingPayload = modalTracking ? `${courierName}: ${modalTracking}` : courierName
        }
      } else if (modalStatus === 'Cancelled') {
        if (modalReason) {
          trackingPayload = `Reason: ${modalReason}`
        }
      }

      let res
      if (modalStatus === 'Cancelled') {
        res = await api.cancelOrder(orderId)
        if (!res.success) {
          res = await api.updateOrderStatus(orderId, modalStatus, trackingPayload)
        }
      } else {
        res = await api.updateOrderStatus(orderId, modalStatus, trackingPayload)
      }

      if (res.success !== false) {
        // Update local state
        const updatedOrder = {
          ...selectedOrder,
          status: modalStatus,
          trackingNumber: trackingPayload || modalTracking
        }
        setSelectedOrder(updatedOrder)
        setUpdateSuccessMsg(`Status successfully updated to ${modalStatus}!`)
        
        // Trigger parent refresh
        if (onRefresh) onRefresh()
      } else {
        alert(`Failed to update order status: ${res.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      alert(`Error updating order status: ${err.message}`)
    } finally {
      setUpdatingId('')
    }
  }

  // ─── WhatsApp Integration ───
  const handleWhatsApp = () => {
    if (!selectedOrder) return
    const phone = getOrderPhone(selectedOrder)
    if (!phone) {
      alert('Customer phone number is not available for this order.')
      return
    }

    const clean = phone.replace(/\D/g, '')
    const fullPhone = clean.length === 10 ? `91${clean}` : clean
    const orderId = getOrderId(selectedOrder)
    const status = getOrderStatus(selectedOrder)
    const total = getOrderTotal(selectedOrder)
    const tracking = selectedOrder?.trackingNumber || selectedOrder?.tracking_number || ''

    let msg = `Hi! This is Bloomwire regarding your order #${orderId}.\n`
    msg += `Status: ${status}\n`
    msg += `Total Amount: ₹${total.toLocaleString('en-IN')}\n`
    if (tracking) {
      msg += `Tracking Info: ${tracking}\n`
    }
    msg += `\nThank you for choosing Bloomwire! Let us know if you have any questions.`

    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  // ─── Print GST Invoice ───
  const handlePrintInvoice = () => {
    if (!selectedOrder) return
    const order = selectedOrder
    const orderId = getOrderId(order)
    const orderDate = getOrderDate(order)
    const email = getOrderEmail(order)
    const phone = getOrderPhone(order)
    const addr = order?.shippingAddress || {}
    const items = getOrderItems(order)
    const total = getOrderTotal(order)
    const subtotal = order?.subtotal || (total > 0 ? Math.round(total / 1.18 * 100) / 100 : 0)
    const shipping = order?.shipping || 0
    const discount = order?.discount || 0
    const giftWrapFee = order?.giftWrapFee || 0
    const taxAmount = Math.max(0, total - subtotal)
    const cgst = (taxAmount / 2).toFixed(2)
    const sgst = (taxAmount / 2).toFixed(2)

    const printWin = window.open('', '_blank', 'width=850,height=900')
    if (!printWin) {
      alert('Please allow popups in your browser to print the invoice.')
      return
    }

    const itemsTableRows = items.length > 0
      ? items.map((item: any, idx: number) => {
          const qty = item.qty || item.quantity || 1
          const price = item.price || 0
          const lineTotal = qty * price
          return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${idx + 1}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #111827;">${item.name || item.title || 'Bloomwire Floral Product'}</div>
                ${item.slug ? `<div style="font-size: 11px; color: #6b7280;">Item Code: ${item.slug}</div>` : ''}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #4b5563;">0603.11</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 600;">${qty}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${price.toLocaleString('en-IN')}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${lineTotal.toLocaleString('en-IN')}</td>
            </tr>
          `
        }).join('')
      : `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #111827;">Order Package Items</div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #4b5563;">0603.11</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 600;">1</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${subtotal.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN')}</td>
        </tr>
      `

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Bloomwire GST Invoice #${orderId}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; background: #fff; margin: 0; padding: 24px; font-size: 13px; line-height: 1.5; }
            .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header-flex { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e11d48; padding-bottom: 20px; margin-bottom: 24px; }
            .brand-name { font-size: 28px; font-weight: 800; color: #e11d48; letter-spacing: 0.5px; margin: 0; }
            .brand-tag { font-size: 12px; color: #6b7280; font-weight: 500; margin-top: 2px; }
            .invoice-title { font-size: 20px; font-weight: 700; color: #111827; text-align: right; text-transform: uppercase; letter-spacing: 1px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
            .meta-box { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 14px; }
            .meta-title { font-size: 11px; font-weight: 700; color: #e11d48; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { background: #1f2937; color: #ffffff; text-align: left; padding: 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
            .summary-flex { display: flex; justify-content: flex-end; }
            .summary-table { width: 320px; border-collapse: collapse; }
            .summary-table td { padding: 6px 12px; }
            .total-row td { border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; font-size: 16px; font-weight: 800; color: #e11d48; padding-top: 10px; padding-bottom: 10px; }
            .footer-notes { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 11px; }
            @media print {
              body { padding: 0; }
              .invoice-card { border: none; box-shadow: none; padding: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header-flex">
              <div>
                <h1 class="brand-name">BLOOMWIRE</h1>
                <div class="brand-tag">Artisanal Floral Designs & Luxury Gifts</div>
                <div style="margin-top: 8px; font-size: 11px; color: #4b5563;">
                  <strong>GSTIN:</strong> Not GST Registered | <strong>PAN:</strong> N/A<br/>
                  Bloomwire Logistics Hub, Bandra West, Mumbai 400050<br/>
                  Email: support@bloomwire.com | Web: www.bloomwire.com
                </div>
              </div>
              <div>
                <div class="invoice-title">Tax Invoice</div>
                <div style="text-align: right; margin-top: 8px; font-size: 12px; color: #374151;">
                  <div><strong>Invoice #:</strong> INV-${orderId}</div>
                  <div><strong>Order #:</strong> #${orderId}</div>
                  <div><strong>Invoice Date:</strong> ${orderDate}</div>
                </div>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-box">
                <div class="meta-title">Billed To / Shipping Address</div>
                <div style="font-weight: 700; color: #111827; font-size: 14px;">${addr.name || 'Valued Customer'}</div>
                <div style="color: #4b5563; margin-top: 4px;">
                  ${addr.address ? `${addr.address}<br/>` : ''}
                  ${addr.city ? `${addr.city}, ` : ''}${addr.state ? `${addr.state} ` : ''}${addr.pincode ? `- ${addr.pincode}` : ''}
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #4b5563;">
                  <strong>Email:</strong> ${email}<br/>
                  <strong>Phone:</strong> ${phone || 'N/A'}
                </div>
              </div>

              <div class="meta-box">
                <div class="meta-title">Payment & Shipping Summary</div>
                <div style="font-size: 12px; color: #374151;">
                  <div style="margin-bottom: 4px;"><strong>Payment Method:</strong> ${order?.paymentMethod || order?.payment_method || 'Online / Razorpay'}</div>
                  <div style="margin-bottom: 4px;"><strong>Payment Status:</strong> ${order?.isPaid !== false ? 'PAID' : 'Pending'}</div>
                  <div style="margin-bottom: 4px;"><strong>Order Status:</strong> ${getOrderStatus(order)}</div>
                  ${order?.deliveryTier ? `<div style="margin-bottom: 4px;"><strong>Delivery Tier:</strong> ${order.deliveryTier.toUpperCase()}</div>` : ''}
                  ${order?.trackingNumber ? `<div><strong>Tracking Number:</strong> ${order.trackingNumber}</div>` : ''}
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">#</th>
                  <th>Item Description</th>
                  <th style="width: 80px; text-align: center;">HSN</th>
                  <th style="width: 50px; text-align: center;">Qty</th>
                  <th style="width: 110px; text-align: right;">Unit Price</th>
                  <th style="width: 110px; text-align: right;">Taxable Value</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <div class="summary-flex">
              <table class="summary-table">
                <tr>
                  <td style="text-align: right; color: #4b5563;">Subtotal (Taxable):</td>
                  <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                ${shipping > 0 ? `
                  <tr>
                    <td style="text-align: right; color: #4b5563;">Shipping Charges:</td>
                    <td style="text-align: right;">₹${shipping.toLocaleString('en-IN')}</td>
                  </tr>
                ` : ''}
                ${giftWrapFee > 0 ? `
                  <tr>
                    <td style="text-align: right; color: #4b5563;">Gift Wrap Fee:</td>
                    <td style="text-align: right;">₹${giftWrapFee.toLocaleString('en-IN')}</td>
                  </tr>
                ` : ''}
                ${discount > 0 ? `
                  <tr>
                    <td style="text-align: right; color: #059669;">Discount Applied:</td>
                    <td style="text-align: right; color: #059669;">-₹${discount.toLocaleString('en-IN')}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td style="text-align: right; color: #6b7280; font-size: 11px;">CGST (9%):</td>
                  <td style="text-align: right; color: #6b7280; font-size: 11px;">₹${cgst}</td>
                </tr>
                <tr>
                  <td style="text-align: right; color: #6b7280; font-size: 11px;">SGST (9%):</td>
                  <td style="text-align: right; color: #6b7280; font-size: 11px;">₹${sgst}</td>
                </tr>
                <tr class="total-row">
                  <td style="text-align: right;">Grand Total:</td>
                  <td style="text-align: right;">₹${total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <div class="footer-notes">
              <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Thank you for shopping with Bloomwire!</div>
              <div>This is an official computer generated Tax Invoice issued by Bloomwire Inc. No signature required.</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 400);
            }
          </script>
        </body>
      </html>
    `

    printWin.document.write(htmlContent)
    printWin.document.close()
  }

  // ─── Table Columns Configuration ───
  const tableColumns = [
    {
      key: 'id',
      label: 'Order #',
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-bloom-neon">
          #{getOrderId(row)}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row: any) => (
        <span className="text-xs text-[#6b5d4f] whitespace-nowrap">
          {getOrderDate(row)}
        </span>
      )
    },
    {
      key: 'email',
      label: 'Customer Email',
      render: (row: any) => (
        <span
          className="text-xs text-[#6b5d4f] truncate max-w-[180px] block cursor-pointer hover:text-bloom-neon transition"
          title={getOrderEmail(row)}
          onClick={(e) => {
            if (onNavigate && getOrderEmail(row) !== 'N/A') {
              e.stopPropagation()
              onNavigate('users')
            }
          }}
        >
          {getOrderEmail(row)}
        </span>
      )
    },
    {
      key: 'items',
      label: 'Items',
      render: (row: any) => (
        <span className="text-xs text-[#6b5d4f]">
          {getOrderItemsCount(row)} {getOrderItemsCount(row) === 1 ? 'item' : 'items'}
        </span>
      )
    },
    {
      key: 'total',
      label: 'Total',
      render: (row: any) => (
        <span className="text-xs font-bold text-[#2d2418] whitespace-nowrap">
          ₹{getOrderTotal(row).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'payment',
      label: 'Payment Method',
      render: (row: any) => (
        <span className="text-xs text-[#8a7a6a] capitalize">
          {row.paymentMethod || row.payment_method || 'Online'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <Badge status={getOrderStatus(row)} colors={STATUS_COLORS.orders || {}} />
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            openOrderModal(row)
          }}
          className="px-3 py-1.5 glass rounded-xl text-xs font-medium text-bloom-neon hover:bg-white/70 hover:border-bloom-neon/40 border border-transparent transition-all whitespace-nowrap"
        >
          View Details
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* ─── Header & Top Actions ─── */}
      <SectionHeader
        title="Orders Management"
        subtitle={`Track, fulfill, and manage ${orders.length} customer orders`}
      >
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-3.5 py-2 glass rounded-xl text-xs font-medium text-[#6b5d4f] hover:text-[#2d2418] hover:bg-white/70 transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Refresh Orders"
            >
              <span className={`text-sm ${loading ? 'animate-spin' : ''}`}>🔄</span>
              Refresh
            </button>
          )}

          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-xs font-medium hover:opacity-90 transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-40"
          >
            <span>📥</span> Export CSV ({filteredOrders.length})
          </button>
        </div>
      </SectionHeader>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          color="text-[#2d2418]"
        />
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon="💰"
          color="text-emerald-400"
        />
        <StatCard
          label="Processing"
          value={stats.processingCount}
          icon="⏳"
          color="text-yellow-400"
          subtitle="Requires fulfillment"
        />
        <StatCard
          label="Delivered"
          value={stats.deliveredCount}
          icon="✅"
          color="text-emerald-400"
        />
      </div>

      {/* ─── Controls: Search, Filters & Sort ─── */}
      <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-5">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by Order #, Email, or Phone..."
            />
          </div>

          {/* Status filter */}
          <div className="md:col-span-4">
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={STATUS_OPTIONS}
            />
          </div>

          {/* Sort dropdown */}
          <div className="md:col-span-3">
            <Select
              value={sortOption}
              onChange={handleSortChange}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        {/* Filter Summary Bar */}
        {(search || statusFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#2d2418]/5 text-xs text-[#8a7a6a]">
            <div>
              Showing {filteredOrders.length} of {orders.length} orders
              {statusFilter !== 'all' && <span className="ml-1 text-bloom-neon">({statusFilter})</span>}
            </div>
            <button
              onClick={() => {
                setSearch('')
                setOrderFilter('all')
                setCurrentPage(1)
              }}
              className="text-bloom-rose hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ─── Orders Table ─── */}
      <div className="glass-strong rounded-2xl p-4 border border-[#2d2418]/5">
        {loading ? (
          <LoadingSpinner />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            text={
              search || statusFilter !== 'all'
                ? 'No orders match your filter criteria.'
                : 'No orders found.'
            }
            action={
              (search || statusFilter !== 'all') ? (
                <button
                  onClick={() => {
                    setSearch('')
                    setOrderFilter('all')
                  }}
                  className="px-4 py-2 glass rounded-xl text-xs text-bloom-neon hover:bg-white/70 transition"
                >
                  Reset Filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            <AdminTable
              columns={tableColumns}
              rows={paginatedOrders}
              keyField="id"
              emptyText="No orders to display"
              onRowClick={openOrderModal}
            />

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2d2418]/10 text-xs">
              <span className="text-[#8a7a6a]">
                Showing{' '}
                <strong className="text-[#2d2418]">
                  {(currentPage - 1) * pageSize + 1}
                </strong>{' '}
                to{' '}
                <strong className="text-[#2d2418]">
                  {Math.min(currentPage * pageSize, filteredOrders.length)}
                </strong>{' '}
                of <strong className="text-[#2d2418]">{filteredOrders.length}</strong> orders
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 glass rounded-xl text-[#6b5d4f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/70 transition font-medium"
                >
                  ← Prev
                </button>
                <span className="px-3 py-1.5 text-[#8a7a6a]">
                  Page <strong className="text-[#2d2418]">{currentPage}</strong> of{' '}
                  <strong className="text-[#2d2418]">{totalPages}</strong>
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 glass rounded-xl text-[#6b5d4f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/70 transition font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── ORDER DETAIL MODAL ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={closeOrderModal}
          />

          {/* Modal Card */}
          <div className="relative glass-strong rounded-2xl border border-[#2d2418]/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl z-10 my-auto text-[#2d2418] space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#2d2418]/10 gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-serif font-bold text-[#2d2418]">
                    Order #{getOrderId(selectedOrder)}
                  </h3>
                  <Badge
                    status={getOrderStatus(selectedOrder)}
                    colors={STATUS_COLORS.orders || {}}
                  />
                </div>
                <p className="text-xs text-[#8a7a6a] mt-1">
                  Placed on: {getOrderDate(selectedOrder)}
                </p>
              </div>

              <button
                onClick={closeOrderModal}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/70 transition"
              >
                ✕
              </button>
            </div>

            {/* Success Alert Banner */}
            {updateSuccessMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center justify-between">
                <span>✅ {updateSuccessMsg}</span>
                <button onClick={() => setUpdateSuccessMsg('')} className="text-emerald-400 hover:underline">
                  Dismiss
                </button>
              </div>
            )}

            {/* Quick Action Bar (WhatsApp & Print Invoice) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass rounded-xl border border-[#2d2418]/5">
              <div className="text-xs text-[#8a7a6a]">
                Quick Actions
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleWhatsApp}
                  className="px-3.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                >
                  <span>💬</span> WhatsApp Customer
                </button>

                <button
                  onClick={handlePrintInvoice}
                  className="px-3.5 py-1.5 bg-bloom-rose/20 hover:bg-bloom-rose/30 text-bloom-neon border border-bloom-rose/30 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print GST Invoice
                </button>
              </div>
            </div>

            {/* Visual Status Timeline / Pipeline */}
            <div className="p-4 glass rounded-xl border border-[#2d2418]/5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a7a6a]">
                Fulfillment Timeline
              </h4>

              {['Cancelled', 'Returned'].includes(getOrderStatus(selectedOrder)) ? (
                <div className={`p-3 rounded-xl border text-xs ${
                  getOrderStatus(selectedOrder) === 'Cancelled'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                }`}>
                  ⚠️ This order has been marked as <strong>{getOrderStatus(selectedOrder)}</strong>.
                  {selectedOrder.trackingNumber && (
                    <div className="mt-1 text-[#6b5d4f]">{selectedOrder.trackingNumber}</div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                  {PIPELINE_STEPS.map((step, idx) => {
                    const currentSt = getOrderStatus(selectedOrder)
                    const activeIdx = PIPELINE_STEPS.indexOf(currentSt)
                    const isDone = activeIdx >= idx
                    const isCurrent = currentSt === step

                    return (
                      <div key={step} className="flex flex-col items-center text-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-bloom-rose text-white ring-4 ring-bloom-rose/30 scale-110'
                              : isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-gray-800 text-[#a0918a] border border-gray-700'
                          }`}
                        >
                          {isDone ? (isCurrent ? '●' : '✓') : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-2 font-medium ${
                            isCurrent
                              ? 'text-bloom-neon font-bold'
                              : isDone
                              ? 'text-[#6b5d4f]'
                              : 'text-[#8a7a6a]'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Customer Info & Address Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 glass rounded-xl border border-[#2d2418]/5 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-bloom-rose">
                  Customer Details
                </h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-[#a0918a] text-xs block">Email</span>
                    <span className="font-medium text-[#2d2418]">{getOrderEmail(selectedOrder)}</span>
                  </div>
                  <div>
                    <span className="text-[#a0918a] text-xs block">Phone</span>
                    <span className="font-medium text-[#2d2418]">
                      {getOrderPhone(selectedOrder) || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 glass rounded-xl border border-[#2d2418]/5 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-bloom-rose">
                  Shipping Address
                </h4>
                {selectedOrder.shippingAddress ? (
                  <div className="text-xs text-[#6b5d4f] space-y-0.5">
                    <p className="font-semibold text-[#2d2418] text-sm">
                      {selectedOrder.shippingAddress.name || 'Valued Customer'}
                    </p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#a0918a]">No explicit shipping address recorded.</p>
                )}
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div className="p-4 glass rounded-xl border border-[#2d2418]/5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a7a6a]">
                Order Items ({getOrderItemsCount(selectedOrder)})
              </h4>

              {getOrderItems(selectedOrder).length === 0 ? (
                <p className="text-xs text-[#a0918a] italic">Item list unavailable.</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {getOrderItems(selectedOrder).map((item: any, idx: number) => {
                    const qty = item.qty || item.quantity || 1
                    const price = item.price || 0
                    const lineTotal = qty * price

                    return (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#2d2418]/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg glass flex items-center justify-center text-lg">
                              🌸
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#2d2418]">{item.name || item.title || 'Product'}</p>
                            <p className="text-[#a0918a] text-[11px]">
                              Qty: {qty} × ₹{price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <span className="font-semibold text-[#2d2418]">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Financial Totals & Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Totals */}
              <div className="p-4 glass rounded-xl border border-[#2d2418]/5 space-y-2 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-[#8a7a6a] mb-1">
                  Financial Summary
                </h4>
                <div className="flex justify-between text-[#8a7a6a]">
                  <span>Subtotal:</span>
                  <span className="text-[#2d2418] font-medium">
                    ₹{(selectedOrder.subtotal || getOrderTotal(selectedOrder)).toLocaleString('en-IN')}
                  </span>
                </div>
                {selectedOrder.shipping !== undefined && (
                  <div className="flex justify-between text-[#8a7a6a]">
                    <span>Shipping Fee:</span>
                    <span className="text-[#2d2418] font-medium">
                      {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}
                    </span>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                {selectedOrder.giftWrapFee > 0 && (
                  <div className="flex justify-between text-[#8a7a6a]">
                    <span>Gift Wrap Fee:</span>
                    <span>+₹{selectedOrder.giftWrapFee}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#2d2418]/10 text-sm font-bold text-[#2d2418]">
                  <span>Grand Total:</span>
                  <span className="text-bloom-neon">
                    ₹{getOrderTotal(selectedOrder).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment & Petals */}
              <div className="p-4 glass rounded-xl border border-[#2d2418]/5 space-y-3 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-[#8a7a6a]">
                  Payment & Rewards
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a7a6a]">Payment Method:</span>
                    <span className="font-medium text-[#2d2418] capitalize">
                      {selectedOrder.paymentMethod || selectedOrder.payment_method || 'Online / Razorpay'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a7a6a]">Payment Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      selectedOrder.isPaid !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {selectedOrder.isPaid !== false ? 'PAID' : 'PENDING'}
                    </span>
                  </div>
                  {selectedOrder.petalsEarned !== undefined && (
                    <div className="flex items-center justify-between pt-2 border-t border-[#2d2418]/5">
                      <span className="text-[#8a7a6a]">Petals Earned:</span>
                      <span className="text-bloom-neon font-bold">
                        🌸 +{selectedOrder.petalsEarned} Petals
                      </span>
                    </div>
                  )}
                  {(selectedOrder.trackingNumber || selectedOrder.tracking_number) && (
                    <div className="pt-2 border-t border-[#2d2418]/5">
                      <span className="text-[#8a7a6a] block text-[11px]">Tracking Number:</span>
                      <span className="font-mono text-xs text-blue-400 break-all">
                        {selectedOrder.trackingNumber || selectedOrder.tracking_number}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Update Order Status Form */}
            <div className="p-4 glass-strong rounded-xl border border-bloom-rose/30 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon flex items-center gap-2">
                <span>⚡</span> Update Order Status
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormField label="New Order Status">
                  <Select
                    value={modalStatus}
                    onChange={(val) => setModalStatus(val)}
                    options={STATUS_OPTIONS.filter(o => o.value !== 'all')}
                  />
                </FormField>

                {modalStatus === 'Shipped' && (
                  <FormField label="Courier Partner">
                    <Select
                      value={modalCourier}
                      onChange={(val) => setModalCourier(val)}
                      options={COURIER_OPTIONS}
                    />
                  </FormField>
                )}
              </div>

              {/* Conditional Courier Name (Other) */}
              {modalStatus === 'Shipped' && modalCourier === 'Other' && (
                <FormField label="Custom Courier Name">
                  <Input
                    value={modalCustomCourier}
                    onChange={(val) => setModalCustomCourier(val)}
                    placeholder="Enter courier name (e.g. DTDC, Porter)"
                  />
                </FormField>
              )}

              {/* Conditional Tracking Number Input */}
              {modalStatus === 'Shipped' && (
                <FormField label="AWB / Tracking Number">
                  <Input
                    value={modalTracking}
                    onChange={(val) => setModalTracking(val)}
                    placeholder="e.g. DELH123456789"
                  />
                </FormField>
              )}

              {/* Conditional Cancellation Reason Input */}
              {modalStatus === 'Cancelled' && (
                <FormField label="Cancellation Reason">
                  <Input
                    value={modalReason}
                    onChange={(val) => setModalReason(val)}
                    placeholder="e.g. Customer requested, Out of stock..."
                  />
                </FormField>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveStatusUpdate}
                  disabled={updatingId === getOrderId(selectedOrder)}
                  className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-xs font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingId === getOrderId(selectedOrder) && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Save Status Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action will mark the status as Cancelled."
        onConfirm={() => {
          setCancelConfirmOpen(false)
          setModalStatus('Cancelled')
          handleSaveStatusUpdate()
        }}
        onCancel={() => setCancelConfirmOpen(false)}
        confirmText="Confirm Cancel"
        danger
      />
    </div>
  )
}

// Named export for flexible importing
export { OrdersSection }
