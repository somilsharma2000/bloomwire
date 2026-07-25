import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Gift } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice, calculateDeliveryFee } from '@/lib/utils'

const CartPage = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const navigate = useNavigate()

  const subtotal = getSubtotal()
  const deliveryFee = calculateDeliveryFee(subtotal)
  const total = getTotal()

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Mock coupon validation
      setAppliedCoupon({
        code: couponCode,
        discount: Math.floor(subtotal * 0.1),
      })
    }
  }

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gift className="w-24 h-24 text-sienna/20 mx-auto mb-6" />
          <h1 className="font-serif text-4xl text-obsidian mb-4">Your cart is empty</h1>
          <p className="text-obsidian/70 mb-8">Explore our collection and find the perfect bouquet</p>
          <Link to="/shop" className="btn-tactile">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-obsidian mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-lg border-2 border-sienna/20 p-6 flex gap-6">
                <div className="h-32 w-32 bg-gradient-to-br from-sage/30 to-sienna/30 rounded-lg flex items-center justify-center text-5xl flex-shrink-0">
                  {item.product.price}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-obsidian mb-2">{item.product.name}</h3>
                  {item.personalization.giftMessage && (
                    <p className="text-sm text-obsidian/70 mb-2">
                      Message: "{item.personalization.giftMessage}"
                    </p>
                  )}
                  {item.personalization.ribbonColor && (
                    <p className="text-sm text-obsidian/70 mb-2">
                      Ribbon: {item.personalization.ribbonColor}
                    </p>
                  )}
                  {item.personalization.premiumWrapping && (
                    <p className="text-sm text-sienna font-medium mb-2">✓ Premium Wrapping (+₹49)</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 border border-sienna/30 rounded hover:bg-sienna/10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 border border-sienna/30 rounded hover:bg-sienna/10"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sienna font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-obsidian/40 hover:text-obsidian transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6 sticky top-24">
              <h2 className="font-serif text-2xl text-obsidian mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 border-b border-sienna/20 pb-6">
                <div className="flex justify-between">
                  <span className="text-obsidian/70">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian/70">Delivery</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-serif text-xl text-obsidian">Total</span>
                  <span className="font-serif text-2xl text-sienna">
                    {formatPrice(total - (appliedCoupon?.discount || 0))}
                  </span>
                </div>
                <p className="text-sm text-green-600">✓ Free delivery on orders above ₹499</p>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-obsidian mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="form-input flex-1"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-sienna text-linen rounded font-medium hover:bg-sienna/90 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Spin Wheel */}
              <button
                onClick={() => setShowSpinWheel(true)}
                className="btn-tactile-outline w-full mb-4"
              >
                Try Spin Wheel for Discount
              </button>

              <button onClick={handleCheckout} className="btn-tactile w-full">
                Proceed to Checkout
              </button>

              <Link to="/shop" className="block text-center mt-4 text-sienna hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
