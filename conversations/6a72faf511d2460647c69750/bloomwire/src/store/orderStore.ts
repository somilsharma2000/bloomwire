import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

export interface OrderItem {
  slug: string
  name: string
  price: number
  image: string
  qty: number
}

export interface Order {
  id: string
  userEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  giftWrap: boolean
  giftWrapFee: number
  deliveryTier: string
  giftNote: string
  giftWrapInstructions: string
  orderNotes: string
  deliveryCost: number
  total: number
  petalsEarned: number
  paymentMethod: string
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
  trackingNumber?: string
  isPaid?: boolean
  shippingAddress: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string }
  createdAt: string
  estimatedDelivery: string
}

interface OrderState {
  orders: Order[]
  loading: boolean
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery' | 'status' | 'trackingNumber'>) => string
  cancelOrder: (id: string) => number
  getOrder: (id: string) => Order | undefined
  getUserOrders: (email: string) => Order[]
  fetchOrders: (email: string) => Promise<void>
  syncOrderStatus: (orderId: string, status: string, trackingNumber?: string) => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,

      createOrder: (order) => {
        const id = `ORD-${Date.now().toString().slice(-6)}`
        const now = new Date()
        const est = new Date(now)
        est.setDate(est.getDate() + 4)
        const newOrder: Order = {
          ...order,
          id,
          status: 'Processing',
          createdAt: now.toISOString(),
          estimatedDelivery: est.toISOString(),
        }
        set((state) => ({ orders: [newOrder, ...state.orders] }))
        return id
      },

      cancelOrder: (id) => {
        let refund = 0
        const order = get().orders.find((o) => o.id === id)
        if (order) refund = order.total
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'Cancelled' as const } : o
          ),
        }))
        // Sync to backend
        api.cancelOrder(id).catch(() => {})
        return refund
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),
      getUserOrders: (email) => get().orders.filter((o) => o.userEmail === email),

      fetchOrders: async (email) => {
        set({ loading: true })
        try {
          const res = await api.getUserOrders(email)
          if (res.success && res.data && Array.isArray(res.data)) {
            // Merge backend orders with any local orders not yet synced
            const backendOrders = res.data.map((o: any) => ({
              id: o.id || o.order_id || `ORD-${o.created_date?.slice(-6) || Date.now().toString().slice(-6)}`,
              userEmail: o.userEmail || o.user_email || email,
              items: (o.items || []).map((i: any) => ({
                slug: i.slug || i.product_slug || '',
                name: i.name || i.product_name || '',
                price: i.price || 0,
                image: i.image || i.product_image || '',
                qty: i.qty || i.quantity || 1,
              })),
              subtotal: o.subtotal || 0,
              shipping: o.shipping || o.deliveryCost || 0,
              giftWrap: o.giftWrap || false,
              giftWrapFee: o.giftWrapFee || 0,
              deliveryTier: o.deliveryTier || o.delivery_tier || 'standard',
              giftNote: o.giftNote || o.gift_note || '',
              giftWrapInstructions: o.giftWrapInstructions || '',
              orderNotes: o.orderNotes || o.order_notes || '',
              deliveryCost: o.deliveryCost || o.delivery_cost || 0,
              total: o.total || 0,
              petalsEarned: o.petalsEarned || o.petals_earned || 0,
              paymentMethod: o.paymentMethod || o.payment_method || 'cod',
              status: o.status || 'Processing',
              trackingNumber: o.trackingNumber || o.tracking_number,
              isPaid: o.isPaid ?? (o.status === 'Processing' || o.status === 'Shipped' || o.status === 'Delivered'),
              shippingAddress: o.shippingAddress || o.shipping_address || { name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' },
              createdAt: o.createdAt || o.created_date || new Date().toISOString(),
              estimatedDelivery: o.estimatedDelivery || new Date(Date.now() + 4 * 86400000).toISOString(),
            })) as Order[]

            // Merge: keep local orders that aren't in backend yet
            const localOnly = get().orders.filter(
              (lo) => !backendOrders.some((bo) => bo.id === lo.id)
            )
            set({ orders: [...backendOrders, ...localOnly], loading: false })
          }
        } catch (err) {
          console.warn('[OrderStore] fetchOrders failed:', err)
        }
        set({ loading: false })
      },

      syncOrderStatus: (orderId, status, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: status as Order['status'], trackingNumber: trackingNumber || o.trackingNumber }
              : o
          ),
        }))
      },
    }),
    { name: 'bloomwire-order-storage' }
  )
)
