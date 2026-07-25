import { useParams } from 'react-router-dom'

const PolicyPage = () => {
  const { slug } = useParams()

  const policies: Record<string, { title: string; content: JSX.Element }> = {
    shipping: {
      title: 'Shipping Policy',
      content: (
        <div className="space-y-6 text-obsidian/80 leading-relaxed">
          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">1. Delivery Areas</h3>
            <p>
              BloomWire currently delivers to Jaipur and surrounding areas. For wholesale orders outside our regular delivery zone, please contact our team.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">2. Delivery Timeline</h3>
            <p>
              • Same-day delivery available for orders placed before 12 PM
            </p>
            <p>• Next-day delivery for orders placed after 12 PM</p>
            <p>• Scheduled delivery for future dates available at checkout</p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">3. Delivery Charges</h3>
            <p>• Free delivery on orders above ₹499</p>
            <p>• ₹50 delivery charge on orders below ₹499</p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">4. Shipment Tracking</h3>
            <p>You'll receive an order confirmation and tracking link via email and SMS. Track your delivery in real-time.</p>
          </section>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-6 text-obsidian/80 leading-relaxed">
          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">1. Data Collection</h3>
            <p>
              We collect personal information only when necessary to process orders, improve our services, and communicate with you. This includes name, email, phone, address, and payment information.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">2. Data Security</h3>
            <p>
              All payment information is encrypted and processed securely through Razorpay. We never store full credit card details.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">3. Use of Information</h3>
            <p>
              Your information is used to:
            </p>
            <p>• Process and deliver your orders</p>
            <p>• Send order updates and confirmations</p>
            <p>• Improve our services</p>
            <p>• Send promotional emails (you can opt out anytime)</p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">4. Third-Party Sharing</h3>
            <p>
              We do not sell or share your personal data with third parties, except with delivery partners necessary to fulfill your order.
            </p>
          </section>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-6 text-obsidian/80 leading-relaxed">
          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">1. Use of Website</h3>
            <p>
              By using BloomWire's website, you agree to abide by these terms. We reserve the right to modify terms at any time.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">2. Product Availability</h3>
            <p>
              All products are subject to availability. In case of unavailability, we will notify you and offer alternatives or full refunds.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">3. Pricing</h3>
            <p>
              Prices are in INR (₹) and subject to change without notice. All prices include applicable taxes.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">4. User Conduct</h3>
            <p>
              You agree not to use our website for any illegal or unauthorized purpose. Violations may result in account suspension.
            </p>
          </section>
        </div>
      ),
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      content: (
        <div className="space-y-6 text-obsidian/80 leading-relaxed">
          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">🌹 Our Humorous Policy</h3>
            <p className="text-lg font-medium text-sienna italic">
              "Cancellations allowed only if you have a breakup with your partner."
            </p>
            <p className="mt-3">
              We're joking... but only a little! We understand life happens, and we're here to help.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">1. No Returns Policy</h3>
            <p>
              As fresh flowers are perishable items, we do not accept returns. However, if flowers arrive damaged or in poor condition, we offer replacements or refunds within 2 hours of delivery.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">2. Cancellations</h3>
            <p>• Cancellations must be requested before order is confirmed (before payment)</p>
            <p>• If order has been packed or is out for delivery, cancellation may not be possible</p>
            <p>• For confirmed cancellations, full refund will be processed within 5-7 business days</p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-sienna mb-3">3. Freshness Guarantee</h3>
            <p>
              We guarantee all flowers are fresh at the time of delivery. If not satisfied with the quality, contact us immediately with photos.
            </p>
          </section>
        </div>
      ),
    },
  }

  const policy = policies[slug || 'shipping']

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-obsidian mb-4">Policy Not Found</h1>
          <a href="/" className="btn-tactile">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-12 text-center">{policy.title}</h1>
        <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 md:p-12">
          {policy.content}
        </div>
      </div>
    </div>
  )
}

export default PolicyPage
