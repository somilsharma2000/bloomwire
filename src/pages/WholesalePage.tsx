import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const WholesalePage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    estimatedMonthlyVolume: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('wholesale_inquiries')
        .insert([{ ...formData, status: 'new' }])

      if (error) throw error
      setSubmitted(true)
      setFormData({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        businessType: '',
        estimatedMonthlyVolume: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-4 text-center">Wholesale Program</h1>
        <p className="text-center text-obsidian/70 text-lg mb-12">
          Partner with TACTILE BOTANICA for bulk flower orders
        </p>

        {submitted ? (
          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-8 text-center">
            <h2 className="font-serif text-2xl text-green-700 mb-4">Thank You!</h2>
            <p className="text-green-700 mb-4">
              Your wholesale inquiry has been received. Our team will contact you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-tactile"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8 mb-8">
                <h3 className="font-serif text-2xl text-sienna mb-4">Wholesale Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-sienna font-bold">✓</span>
                    <span className="text-obsidian/70">Minimum Order: 100 units</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sienna font-bold">✓</span>
                    <span className="text-obsidian/70">Premium pricing for bulk orders</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sienna font-bold">✓</span>
                    <span className="text-obsidian/70">Dedicated account manager</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sienna font-bold">✓</span>
                    <span className="text-obsidian/70">Flexible delivery schedules</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sienna font-bold">✓</span>
                    <span className="text-obsidian/70">Custom arrangements available</span>
                  </li>
                </ul>
              </div>

              <div className="bg-obsidian text-linen rounded-lg p-8">
                <h3 className="font-serif text-2xl mb-4">Quick Contact</h3>
                <p className="mb-4">📧 bloomwire2000@gmail.com</p>
                <p className="mb-4">📍 JAGDAMBA NAGAR, JAIPUR</p>
                <p>⏰ Available 24/7</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-obsidian font-medium mb-2">Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="form-input"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-obsidian font-medium mb-2">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="form-input"
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-obsidian font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="email@business.com"
                  />
                </div>
                <div>
                  <label className="block text-obsidian font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="Contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-obsidian font-medium mb-2">Business Type *</label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  <option value="florist">Florist</option>
                  <option value="event-planner">Event Planner</option>
                  <option value="hotel">Hotel/Restaurant</option>
                  <option value="retail">Retail Store</option>
                  <option value="corporate">Corporate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-obsidian font-medium mb-2">Estimated Monthly Volume *</label>
                <input
                  type="text"
                  required
                  value={formData.estimatedMonthlyVolume}
                  onChange={(e) => setFormData({ ...formData, estimatedMonthlyVolume: e.target.value })}
                  className="form-input"
                  placeholder="e.g., 500-1000 units"
                />
              </div>

              <div>
                <label className="block text-obsidian font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input h-28 resize-none"
                  placeholder="Tell us about your business..."
                />
              </div>

              <button type="submit" disabled={loading} className="btn-tactile w-full">
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default WholesalePage
