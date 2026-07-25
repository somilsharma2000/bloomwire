import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const faqs = [
    {
      id: 'ordering-1',
      category: 'Ordering',
      question: 'How do I place an order?',
      answer: 'Simply browse our collection, select your flowers, personalize with a message and ribbon color, add to cart, and checkout. We accept payments via Razorpay (cards, UPI, net banking).',
    },
    {
      id: 'ordering-2',
      category: 'Ordering',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, and net banking through Razorpay. All transactions are secure and encrypted.',
    },
    {
      id: 'ordering-3',
      category: 'Ordering',
      question: 'Can I schedule delivery for a specific date?',
      answer: 'Yes! During checkout, you can select your preferred delivery date. We ensure same-day and next-day delivery in most areas.',
    },
    {
      id: 'delivery-1',
      category: 'Delivery',
      question: 'What is your delivery charge?',
      answer: 'Delivery is FREE on orders above ₹499. For orders below ₹499, delivery charge is ₹50.',
    },
    {
      id: 'delivery-2',
      category: 'Delivery',
      question: 'Where do you deliver?',
      answer: 'We primarily deliver in Jaipur and surrounding areas. For bulk orders outside our regular delivery zone, contact our wholesale team.',
    },
    {
      id: 'delivery-3',
      category: 'Delivery',
      question: 'How do I track my delivery?',
      answer: 'After confirmation, you'll receive an order tracking link via email and SMS. You can track your delivery in real-time.',
    },
    {
      id: 'freshness-1',
      category: 'Freshness',
      question: 'How long will the flowers stay fresh?',
      answer: 'Our premium flowers typically stay fresh for 5-7 days with proper care. We include care instructions with every order.',
    },
    {
      id: 'freshness-2',
      category: 'Freshness',
      question: 'What if flowers arrive damaged?',
      answer: 'While we take utmost care, if flowers arrive damaged, contact us within 2 hours. We offer replacements or full refunds as per our policy.',
    },
    {
      id: 'custom-1',
      category: 'Customization',
      question: 'Can I customize my bouquet?',
      answer: 'Absolutely! You can add a personalized gift message (free), choose ribbon color, and opt for premium gift wrapping (+₹49).',
    },
    {
      id: 'custom-2',
      category: 'Customization',
      question: 'Can I create a custom arrangement?',
      answer: 'Yes! Contact our team at bloomwire2000@gmail.com with your requirements, and we'll create a bespoke arrangement for you.',
    },
  ]

  const categories = [...new Set(faqs.map((f) => f.category))]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-center text-obsidian/70 text-lg mb-12">Find answers to common questions about our flowers and services</p>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="font-serif text-2xl text-sienna mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-sienna text-linen rounded-full flex items-center justify-center text-sm font-bold">?</span>
                {category}
              </h2>
              <div className="space-y-4">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg border-2 border-sienna/20">
                      <button
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-linen/50 transition"
                      >
                        <h3 className="font-medium text-obsidian text-left">{faq.question}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-sienna flex-shrink-0 transition-transform ${
                            expandedId === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedId === faq.id && (
                        <div className="px-6 pb-4 text-obsidian/70 border-t border-sienna/20 pt-4">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 bg-sienna text-linen rounded-lg p-8 text-center">
          <h2 className="font-serif text-2xl mb-4">Still have questions?</h2>
          <p className="mb-6">Our team is here to help 24/7</p>
          <a href="/contact" className="inline-block bg-linen text-sienna px-8 py-3 rounded-lg font-medium hover:bg-linen/90 transition">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default FAQPage
