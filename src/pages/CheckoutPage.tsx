import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice, validateEmail, validatePhone, generateOrderId } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getTotal, getSubtotal, clearCart } = useCart()
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderId, setOrderId] = useState('')

  const subtotal = getSubtotal()
  const deliveryFee = subtotal >= 499 ? 0 : 50
  const total = getTotal()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required'
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required'
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async () => {
    setLoading(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newOrderId = generateOrderId()
      setOrderId(newOrderId)

      // Here you would integrate with Razorpay
      // For now, we'll simulate success

      // Clear cart
      clearCart()
      setStep('success')
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-obsidian mb-4">Cart is empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="btn-tactile"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === 'success' ? (
          // Success State
          <div className="text-center py-12">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
            <h1 className="font-serif text-4xl text-obsidian mb-4">Order Confirmed!</h1>
            <p className="text-lg text-obsidian/70 mb-8">
              Thank you for your order. Your flowers will be delivered fresh and beautiful.
            </p>
            <div className="bg-linen rounded-lg border-2 border-sienna p-6 mb-8 max-w-md mx-auto">
              <p className="text-sm text-obsidian/70 mb-2">Order ID</p>
              <p className="font-serif text-2xl text-sienna font-bold mb-4">{orderId}</p>
              <p className="text-sm text-obsidian/70">
                A confirmation email has been sent to {formData.email}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="btn-tactile block w-full"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="btn-tactile-outline block w-full"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold transition ${
                  step === 'details' || step === 'payment' || step === 'success'
                    ? 'bg-sienna text-linen'
                    : 'bg-sienna/30 text-obsidian'
                }`}
              >
                1
              </div>
              <div className="h-1 w-12 bg-sienna/30"></div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold transition ${
                  step === 'payment' || step === 'success'
                    ? 'bg-sienna text-linen'
                    : 'bg-sienna/30 text-obsidian'
                }`}
              >
                2
              </div>
              <div className="h-1 w-12 bg-sienna/30"></div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold transition ${
                  step === 'success' ? 'bg-sienna text-linen' : 'bg-sienna/30 text-obsidian'
                }`}
              >
                3
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                {step === 'details' && (
                  <form onSubmit={handleDetailsSubmit} className="space-y-6">
                    <h2 className="font-serif text-2xl text-obsidian mb-6">Delivery Details</h2>

                    <div>
                      <label className="block text-obsidian font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="form-input"
                        placeholder="Your full name"
                      />
                      {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-obsidian font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="form-input"
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-obsidian font-medium mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="form-input"
                          placeholder="10-digit mobile"
                        />
                        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-obsidian font-medium mb-2">Address *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="form-input"
                        placeholder="Street address"
                      />
                      {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-obsidian font-medium mb-2">City *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="form-input"
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-obsidian font-medium mb-2">Postal Code *</label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="form-input"
                          placeholder="6-digit PIN"
                        />
                        {errors.postalCode && <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>

                    <button type="submit" className="btn-tactile w-full">
                      Continue to Payment
                    </button>
                  </form>
                )}

                {step === 'payment' && (
                  <div>
                    <h2 className="font-serif text-2xl text-obsidian mb-6">Payment Method</h2>
                    <div className="space-y-4">
                      <button className="w-full p-4 border-2 border-sienna rounded-lg hover:bg-sienna/10 transition text-left font-medium">
                        💳 Card Payment
                      </button>
                      <button className="w-full p-4 border-2 border-sienna rounded-lg hover:bg-sienna/10 transition text-left font-medium">
                        🏦 Net Banking
                      </button>
                      <button className="w-full p-4 border-2 border-sienna rounded-lg hover:bg-sienna/10 transition text-left font-medium">
                        📱 UPI
                      </button>
                    </div>
                    <p className="text-sm text-obsidian/70 mt-6 mb-6">
                      Powered by Razorpay. Your payment information is secure and encrypted.
                    </p>
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={loading}
                      className="btn-tactile w-full"
                    >
                      {loading ? 'Processing...' : 'Pay ' + formatPrice(total)}
                    </button>
                    <button
                      onClick={() => setStep('details')}
                      className="btn-tactile-outline w-full mt-3"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg border-2 border-sienna/20 p-6 sticky top-24">
                  <h3 className="font-serif text-xl text-obsidian mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6 border-b border-sienna/20 pb-6">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-obsidian/70">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6 border-b border-sienna/20 pb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian/70">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian/70">Delivery</span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-serif text-lg text-obsidian">Total</span>
                    <span className="font-serif text-2xl text-sienna font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
