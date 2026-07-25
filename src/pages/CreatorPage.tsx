import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { generateCouponCode } from '@/lib/utils'
import { Copy, CheckCircle } from 'lucide-react'

const CreatorPage = () => {
  const [formData, setFormData] = useState({
    instagramHandle: '',
    email: '',
    postUrl: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newCoupon = generateCouponCode()

      const { error } = await supabase
        .from('instagram_claims')
        .insert([
          {
            instagram_handle: formData.instagramHandle,
            email: formData.email,
            post_url: formData.postUrl,
            coupon_code: newCoupon,
            is_verified: false,
          },
        ])

      if (error) throw error

      setCouponCode(newCoupon)
      setSubmitted(true)
      setFormData({
        instagramHandle: '',
        email: '',
        postUrl: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to generate coupon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-4 text-center">
          Creator Partnership Program
        </h1>
        <p className="text-center text-obsidian/70 text-lg mb-12">
          Tag us, get discount. Honor system for influencers and content creators.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits */}
          <div>
            <h2 className="font-serif text-2xl text-sienna mb-6">Program Benefits</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                <h3 className="font-serif text-lg text-sienna mb-2">🎁 Instant Discount Code</h3>
                <p className="text-obsidian/70">
                  Generate a unique coupon code for your followers to get discounts on their first purchase.
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                <h3 className="font-serif text-lg text-sienna mb-2">📱 Social Amplification</h3>
                <p className="text-obsidian/70">
                  We feature our favorite creator posts on our Instagram. More visibility for your content!
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                <h3 className="font-serif text-lg text-sienna mb-2">🌟 Creator Rewards</h3>
                <p className="text-obsidian/70">
                  Top creators get exclusive perks, free products, and collaboration opportunities.
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                <h3 className="font-serif text-lg text-sienna mb-2">💰 Commission Potential</h3>
                <p className="text-obsidian/70">
                  Earn a percentage of sales generated through your unique coupon code.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-600 rounded-lg p-8">
                <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                <h2 className="font-serif text-2xl text-green-700 mb-4">Your Coupon Ready!</h2>
                <p className="text-green-700 mb-6">
                  Share this code with your followers. Every purchase helps both your community and our mission to spread floral love!
                </p>

                <div className="bg-white border-2 border-green-600 rounded-lg p-4 mb-6">
                  <p className="text-sm text-obsidian/70 mb-2">Your Coupon Code</p>
                  <div className="flex items-center gap-3">
                    <code className="text-2xl font-bold text-sienna">{couponCode}</code>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-sienna/10 rounded transition"
                    >
                      <Copy className="w-5 h-5 text-sienna" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-2">✓ Copied to clipboard!</p>
                  )}
                </div>

                <p className="text-sm text-obsidian/70 mb-6">
                  Tag us @bloomwire on Instagram when posting with flowers from our collection. We feature the best content!
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-tactile w-full"
                >
                  Generate Another Code
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border-2 border-sienna/20 p-8">
                <h2 className="font-serif text-2xl text-sienna mb-6">Generate Your Code</h2>

                <div>
                  <label className="block text-obsidian font-medium mb-2">Instagram Handle *</label>
                  <div className="flex items-center">
                    <span className="text-obsidian/70 mr-2">@</span>
                    <input
                      type="text"
                      required
                      value={formData.instagramHandle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagramHandle: e.target.value.replace('@', ''),
                        })
                      }
                      className="form-input flex-1"
                      placeholder="yourhandle"
                    />
                  </div>
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
                  <label className="block text-obsidian font-medium mb-2">Instagram Post URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.postUrl}
                    onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                    className="form-input"
                    placeholder="https://instagram.com/p/..."
                  />
                  <p className="text-sm text-obsidian/70 mt-2">
                    Link to your latest post featuring BloomWire flowers
                  </p>
                </div>

                <button type="submit" disabled={loading} className="btn-tactile w-full">
                  {loading ? 'Generating...' : 'Generate Coupon Code'}
                </button>

                <p className="text-sm text-obsidian/70 text-center">
                  By submitting, you agree to tag @bloomwire in your posts and follow our community guidelines.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* How It Works */}
        <section className="mt-16 bg-linen rounded-lg p-8">
          <h2 className="font-serif text-2xl text-sienna mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-serif text-lg text-obsidian mb-2">Submit Info</h3>
              <p className="text-sm text-obsidian/70">
                Fill in your Instagram handle and email
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-serif text-lg text-obsidian mb-2">Get Code</h3>
              <p className="text-sm text-obsidian/70">
                Instant unique coupon code generated
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-serif text-lg text-obsidian mb-2">Share & Tag</h3>
              <p className="text-sm text-obsidian/70">
                Post BloomWire flowers and tag @bloomwire
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">4️⃣</div>
              <h3 className="font-serif text-lg text-obsidian mb-2">Earn Rewards</h3>
              <p className="text-sm text-obsidian/70">
                Get featured and earn from referrals
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CreatorPage
