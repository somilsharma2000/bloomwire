import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function OrderSuccess() {
  const location = useLocation()
  
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // Get order data from navigation state or localStorage
    const state = location.state as any
    if (state?.orderId) {
      setOrderData(state)
    } else {
      // Try to get from sessionStorage
      const stored = sessionStorage.getItem('bloomwire-last-order')
      if (stored) {
        try { setOrderData(JSON.parse(stored)) } catch {}
      }
    }
  }, [location])

  if (!orderData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4 gradient-text-cool">Order Placed! 🎉</h1>
        <p className="text-[#8a7a6a] mb-8">Thank you for your order. We'll send a confirmation shortly.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/shop" className="px-6 py-3 rounded-xl bg-bloom-rose text-white font-medium hover:bg-bloom-rose/80 transition">Continue Shopping</Link>
          <Link to="/" className="px-6 py-3 rounded-xl glass text-[#2d2418] hover:bg-white/60 transition">Back to Home</Link>
        </div>
      </div>
    )
  }

  const { orderId, items, total, paymentMethod, estimatedDelivery } = orderData
    const donationAmount = orderData?.total ? Math.round(orderData.total * 0.02) : 0
  const [copied, setCopied] = useState(false)
  const shareMessage = 'I just bought handcrafted flowers from Bloomwire and 2% went to feeding stray dogs in Rajasthan! Check them out: bloomwire.in'
  const handleShare = () => { navigator.clipboard.writeText(shareMessage); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const waMessage = `Hello Bloomwire! 🌸\nI just placed an order.\nOrder ID: ${orderId}\nTotal: ₹${total}\nPayment: ${paymentMethod?.toUpperCase()}\n\nPlease confirm my order.`
  const waLink = `https://wa.me/919414027836?text=${encodeURIComponent(waMessage)}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 relative z-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-3 gradient-text-cool">Order Placed Successfully!</h1>
        <p className="text-[#8a7a6a]">Thank you for supporting handmade craft. 🌸</p>
      </div>

      <div className="glass rounded-2xl border border-[#2d2418]/10 p-6 mb-6">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#2d2418]/10">
          <div>
            <p className="text-xs text-[#a0918a] uppercase tracking-wider">Order ID</p>
            <p className="text-lg font-bold text-[#2d2418]">{orderId || 'ORD-XXXXXX'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#a0918a] uppercase tracking-wider">Total Paid</p>
            <p className="text-lg font-bold text-bloom-gold">₹{total || 0}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-[#a0918a] uppercase tracking-wider mb-2">Items</p>
          {items && items.length > 0 ? items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span className="text-[#6b5d4f]">{item.name} × {item.qty}</span>
              <span className="text-[#8a7a6a]">₹{item.price * item.qty}</span>
            </div>
          )) : <p className="text-sm text-[#8a7a6a]">Order details saved</p>}
        </div>

        <div className="pt-4 border-t border-[#2d2418]/10">
          <p className="text-xs text-[#a0918a] uppercase tracking-wider mb-1">Estimated Delivery</p>
          <p className="text-sm text-[#2d2418]">{estimatedDelivery || '4-7 business days (Standard delivery)'}</p>
          <p className="text-xs text-[#a0918a] mt-1">Handmade to order — crafted within 1-2 days, then shipped</p>
        </div>
      </div>

      {donationAmount > 0 && (
        <div className="bg-[#FDF2F8] rounded-2xl border border-bloom-rose/15 p-6 mb-6 text-center">
          <p className="text-sm text-[#6B6B6B] mb-2">You just contributed <span className="text-bloom-rose font-bold">₹{donationAmount}</span> toward feeding and sheltering dogs at Dog Home Foundation, Jodhpur. 🐾</p>
          <p className="text-xs text-[#9A9A9A] mb-3">Total donated by Bloomwire customers so far. 🌸</p>
          <button onClick={handleShare} className="px-5 py-2.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl text-sm font-medium hover:scale-[1.02] transition shadow-sm">
            {copied ? 'Copied!' : 'Share your impact'}
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3 rounded-xl bg-[#25D366] text-black font-medium text-center hover:bg-[#20ba5a] transition flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Confirm on WhatsApp
        </a>
        <Link to="/shop" className="flex-1 px-6 py-3 rounded-xl bg-bloom-rose text-white font-medium text-center hover:bg-bloom-rose/80 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
