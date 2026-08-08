import React, { useState } from 'react'
import { api } from '../lib/api'
import { useOrderStore, type Order } from '../store/orderStore'

export default function TrackOrder() {
  const [orderIdInput, setOrderIdInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderIdInput.trim() || !emailInput.trim()) {
      setErrorMessage('Please enter both Order ID and Email address.')
      return
    }

    setLoading(true)
    setSearched(true)
    setErrorMessage(null)
    setOrder(null)

    const cleanEmail = emailInput.trim().toLowerCase()
    const cleanOrderId = orderIdInput.trim().toLowerCase()

    let foundOrder: Order | null = null

    try {
      const res = await api.getUserOrders(cleanEmail)
      let list: any[] = []
      if (Array.isArray(res)) {
        list = res
      } else if (res && res.success && Array.isArray(res.data)) {
        list = res.data
      } else if (res && res.orders && Array.isArray(res.orders)) {
        list = res.orders
      }

      const match = list.find((o: any) => {
        const id = (o.id || o.order_id || '').toString().trim().toLowerCase()
        return id === cleanOrderId
      })

      if (match) {
        foundOrder = {
          id: match.id || match.order_id || orderIdInput.trim(),
          userEmail: match.userEmail || match.user_email || cleanEmail,
          items: (match.items || []).map((i: any) => ({
            slug: i.slug || i.product_slug || '',
            name: i.name || i.product_name || 'Handcrafted Flower',
            price: i.price || 0,
            image: i.image || i.product_image || '',
            qty: i.qty || i.quantity || 1,
          })),
          subtotal: match.subtotal || 0,
          shipping: match.shipping || match.deliveryCost || 0,
          giftWrap: match.giftWrap || false,
          giftWrapFee: match.giftWrapFee || 0,
          deliveryTier: match.deliveryTier || match.delivery_tier || 'standard',
          giftNote: match.giftNote || match.gift_note || '',
          giftWrapInstructions: match.giftWrapInstructions || '',
          orderNotes: match.orderNotes || match.order_notes || '',
          deliveryCost: match.deliveryCost || match.delivery_cost || 0,
          total: match.total || 0,
          petalsEarned: match.petalsEarned || match.petals_earned || 0,
          paymentMethod: match.paymentMethod || match.payment_method || 'Online',
          status: match.status || 'Processing',
          trackingNumber: match.trackingNumber || match.tracking_number,
          shippingAddress: match.shippingAddress || match.shipping_address || {
            name: 'Customer',
            email: cleanEmail,
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
          },
          createdAt: match.createdAt || match.created_date || new Date().toISOString(),
          estimatedDelivery: match.estimatedDelivery || new Date(Date.now() + 4 * 86400000).toISOString(),
        }
      }
    } catch (err) {
      console.warn('[TrackOrder] API fetch failed:', err)
    }

    // Fallback to local Zustand store
    if (!foundOrder) {
      const localOrders = useOrderStore.getState().orders
      const matchLocal = localOrders.find(
        (o) =>
          o.id.trim().toLowerCase() === cleanOrderId &&
          o.userEmail.trim().toLowerCase() === cleanEmail
      )
      if (matchLocal) {
        foundOrder = matchLocal
      }
    }

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      setErrorMessage('No order found with these details. Please check your Order ID and email.')
    }
    setLoading(false)
  }

  // Calculate timeline stages
  const getTimelineSteps = (status: string, createdAt: string, trackingNumber?: string) => {
    const isCancelled = status === 'Cancelled'
    const statusLower = status.toLowerCase()

    const isProcessingDone = !isCancelled && ['processing', 'shipped', 'out for delivery', 'delivered'].includes(statusLower)
    const isShippedDone = !isCancelled && ['shipped', 'out for delivery', 'delivered'].includes(statusLower)
    const isDeliveredDone = !isCancelled && statusLower === 'delivered'

    const orderDateFormatted = new Date(createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    return [
      {
        title: 'Order Placed',
        description: `Order received on ${orderDateFormatted}`,
        completed: true,
      },
      {
        title: 'Processing',
        description: 'Your handcrafted stems are being prepared in our studio',
        completed: isProcessingDone,
      },
      {
        title: 'Shipped',
        description: trackingNumber ? `Tracking #: ${trackingNumber}` : 'Dispatched with express courier',
        completed: isShippedDone,
      },
      {
        title: 'Delivered',
        description: 'Package delivered successfully',
        completed: isDeliveredDone,
      },
    ]
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-12 px-4 sm:px-6 lg:px-8 text-[#2D2D2D]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2D2D]">Track Your Order</h1>
          <p className="text-[#6B6B6B] mt-2 text-sm sm:text-base">
            Enter your Order ID and Email address to view live tracking information.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="orderId" className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-1">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                placeholder="e.g. ORD-123456"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#2D2D2D] bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email used for the order"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#2D2D2D] bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B] focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white font-medium shadow-md hover:opacity-95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching Order...</span>
                </>
              ) : (
                <span>Track Order</span>
              )}
            </button>
          </form>

          {searched && errorMessage && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-[#C2185B] text-sm text-center font-medium">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Tracking Details */}
        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in space-y-8">
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-[#9A9A9A]">Order Number</span>
                <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">{order.id}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-semibold text-[#9A9A9A]">Status</span>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-[#FDF2F8] text-[#C2185B]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF8F3] p-4 rounded-xl border border-rose-100/50">
              <div>
                <p className="text-xs text-[#6B6B6B] font-medium">Estimated Delivery</p>
                <p className="font-medium text-[#2D2D2D]">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="text-xs text-[#6B6B6B] font-medium">Tracking Number</p>
                  <p className="font-medium text-[#C2185B] font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* Visual Vertical Timeline */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2D2D2D] mb-6">
                Progress Timeline
              </h3>

              <div className="relative pl-6 space-y-8">
                {getTimelineSteps(order.status, order.createdAt, order.trackingNumber).map((step, idx, arr) => (
                  <div key={step.title} className="relative flex items-start gap-4">
                    {/* Vertical Connecting Line */}
                    {idx < arr.length - 1 && (
                      <div
                        className={`absolute top-3 left-[9px] -bottom-8 w-0.5 ${
                          step.completed && arr[idx + 1].completed ? 'bg-[#C2185B]' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    {/* Timeline Dot */}
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center -ml-6 ${
                        step.completed
                          ? 'bg-[#C2185B] text-white shadow-sm ring-4 ring-rose-100'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.completed && (
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>

                    {/* Step Details */}
                    <div>
                      <p className={`font-medium text-sm ${step.completed ? 'text-[#2D2D2D]' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2D2D2D] mb-4">
                Items In Order ({order.items.reduce((sum, i) => sum + i.qty, 0)})
              </h3>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#2D2D2D]">{item.name}</p>
                        <p className="text-xs text-[#6B6B6B]">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#2D2D2D]">₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center font-bold text-base text-[#2D2D2D]">
                <span>Total Amount</span>
                <span className="text-[#C2185B]">₹{order.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
