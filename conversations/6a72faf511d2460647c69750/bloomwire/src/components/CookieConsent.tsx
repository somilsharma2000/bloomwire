import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Don't show cookie consent on admin pages
    if (location.pathname.startsWith('/admin')) return
    const consent = localStorage.getItem('bloomwire-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('bloomwire-cookie-consent', 'accepted')
    setShow(false)
  }

  const handleDecline = () => {
    localStorage.setItem('bloomwire-cookie-consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] animate-slide-up">
      <div className="bg-[#FFF8F3]/95 backdrop-blur-md border-t border-[#2d2418]/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#6b5d4f] leading-relaxed flex-1 text-center sm:text-left">
            We use essential local storage for your cart and login session. We do not use third-party tracking cookies.{' '}
            <Link to="/privacy" className="text-bloom-rose hover:underline font-medium">Privacy Policy</Link>
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="text-xs text-[#a0918a] hover:text-[#2d2418] transition px-3 py-2 font-medium"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="text-xs font-medium bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-lg px-4 py-2 hover:scale-[1.02] transition shadow-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
