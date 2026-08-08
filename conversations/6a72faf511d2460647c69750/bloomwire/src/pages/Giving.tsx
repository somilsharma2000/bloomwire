import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Giving() {
  const [totalDonated, setTotalDonated] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.getTotalDonations?.().then((res: any) => {
      if (res?.success && res.data?.total !== undefined) {
        setTotalDonated(res.data.total)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const dogPhotos = [
    { url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80', name: 'Bella', caption: 'Meet Bella — rescued and recovering at Dog Home Foundation' },
    { url: 'https://images.unsplash.com/photo-1587300003388-59208cc204dc?w=600&q=80', name: 'Shadow', caption: 'Meet Shadow — rescued and recovering at Dog Home Foundation' },
    { url: 'https://images.unsplash.com/photo-1583511655826-0590255a0f9e?w=600&q=80', name: 'Cookie', caption: 'Meet Cookie — rescued and recovering at Dog Home Foundation' },
    { url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80', name: 'Rocky', caption: 'Meet Rocky — rescued and recovering at Dog Home Foundation' },
    { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80', name: 'Milo', caption: 'Meet Milo — rescued and recovering at Dog Home Foundation' },
    { url: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=600&q=80', name: 'Luna', caption: 'Meet Luna — rescued and recovering at Dog Home Foundation' },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F3] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-[#FDF2F8] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute top-60 right-10 w-[350px] h-[350px] bg-[#FFF0E8] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-[300px] h-[300px] bg-[#F8F4FD] rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-16">
          <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl mb-8">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80" alt="Dog Home Foundation rescue dog" className="w-full h-[300px] sm:h-[400px] object-cover" loading="lazy" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2D2D2D] mb-4">Every Bloom Gives a Dog a Home</h1>
          <p className="text-[#9A9A9A] italic font-serif text-sm">✿ Where flowers bloom, so does hope ✿</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-12 max-w-3xl mx-auto">
          <p className="text-[#2D2D2D] text-lg leading-relaxed font-serif">Bloomwire was born in Jaipur. Just 350km away, Dog Home Foundation in Jodhpur cares for over 800 injured, ill, and stray animals — completely free of cost.</p>
          <p className="text-[#6B6B6B] text-base leading-relaxed mt-4">When you buy from Bloomwire, 2% of every order goes directly to their shelter. Because flowers and dogs both deserve a home.</p>
          <div className="flex gap-4 mt-6">
            <a href="https://doghomefoundation.com" target="_blank" rel="noopener noreferrer" className="text-bloom-rose hover:underline text-sm font-medium">Visit Dog Home Foundation →</a>
            <a href="https://www.instagram.com/doghomefoundation" target="_blank" rel="noopener noreferrer" className="text-bloom-rose hover:underline text-sm font-medium">Follow on Instagram →</a>
          </div>
        </div>

        <div className="text-center mb-16">
          <p className="text-[#6B6B6B] text-sm uppercase tracking-wider mb-2">Total Donated by Bloomwire Customers</p>
          <p className="font-serif text-5xl sm:text-6xl text-bloom-rose font-bold">₹{loading ? '...' : totalDonated.toLocaleString('en-IN')}</p>
          <p className="text-[#9A9A9A] text-sm mt-2">Growing with every order 🌸</p>
        </div>

        <div className="mb-16">
          <h2 className="font-serif text-2xl text-[#2D2D2D] text-center mb-8">Dogs You're Helping 🐾</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dogPhotos.map((dog, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm bg-white">
                <img src={dog.url} alt={dog.name} className="w-full h-48 object-cover" loading="lazy" />
                <p className="text-xs text-[#6B6B6B] p-3 text-center">{dog.caption}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12 max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-xl text-[#2D2D2D] mb-4">Quarterly Transparency</h3>
          {totalDonated > 0 ? (
            <p className="text-[#2D2D2D] text-lg">Q1 2026: <span className="text-bloom-rose font-bold">₹{totalDonated.toLocaleString('en-IN')}</span> donated to Dog Home Foundation</p>
          ) : (
            <p className="text-[#6B6B6B] text-base">Our first donation will appear here after our first 100 orders 🌸</p>
          )}
        </div>

        <div className="text-center">
          <Link to="/shop" className="inline-block px-8 py-4 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shadow-lg shadow-rose-200/50 hover:scale-[1.02] transition-all duration-200">Shop now to contribute 🌸</Link>
          <p className="text-[#9A9A9A] text-xs mt-4">🐾 2% of every order supports Dog Home Foundation, Jodhpur — caring for 800+ stray animals</p>
        </div>
      </div>
    </div>
  )
}
