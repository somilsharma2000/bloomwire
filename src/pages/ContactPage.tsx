import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{ ...formData, status: 'new' }])

      if (error) throw error
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-4 text-center">Get in Touch</h1>
        <p className="text-center text-obsidian/70 text-lg mb-16">
          We're here to help. Reach out anytime!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="space-y-8">
              <div className="bg-white rounded-lg border-2 border-sienna/20 p-8">
                <h3 className="font-serif text-2xl text-sienna mb-4">📧 Email</h3>
                <p className="text-obsidian/70">bloomwire2000@gmail.com</p>
                <p className="text-sm text-obsidian/50 mt-2">Response within 24 hours</p>
              </div>

              <div className="bg-white rounded-lg border-2 border-sienna/20 p-8">
                <h3 className="font-serif text-2xl text-sienna mb-4">📍 Address</h3>
                <p className="text-obsidian/70">JAGDAMBA NAGAR, JAIPUR</p>
              </div>

              <div className="bg-white rounded-lg border-2 border-sienna/20 p-8">
                <h3 className="font-serif text-2xl text-sienna mb-4">⏰ Hours</h3>
                <p className="text-obsidian/70">24/7 Available</p>
                <p className="text-sm text-obsidian/50 mt-2">We're always here for you</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-600 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
                <h2 className="font-serif text-2xl text-green-700 mb-4">Thank You!</h2>
                <p className="text-green-700 mb-6">
                  Your message has been received. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-tactile"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-obsidian font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-obsidian font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-obsidian font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="Contact number"
                  />
                </div>

                <div>
                  <label className="block text-obsidian font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-obsidian font-medium mb-2">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input h-32 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-tactile w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
