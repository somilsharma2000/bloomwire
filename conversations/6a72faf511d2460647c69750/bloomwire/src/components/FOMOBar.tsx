import { useState, useEffect } from 'react'

const MESSAGES = [
  'Handcrafted in Jaipur — shipped across India 🌸',
  'Free shipping on orders above ₹499',
  'New customers get 15% off with code BLOOM15',
  '5% back in Petals on every order',
  'Each bloom is hand-twisted by artisans — no machines',
]

export default function FOMOBar() {
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const initialTimer = setTimeout(() => setVisible(true), 4000)

    let rotateTimer: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      rotateTimer = setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
        scheduleNext()
      }, 8000) // Rotate every 8 seconds
    }

    scheduleNext()

    const stored = localStorage.getItem('bloomwire-fomo-dismissed')
    if (stored === 'true') setDismissed(true)

    return () => {
      clearTimeout(initialTimer)
      clearTimeout(rotateTimer)
    }
  }, [])

  if (dismissed || !visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="bg-[#fff0f3]/95 backdrop-blur-md border-t border-[#2d2418]/10 px-4 py-2.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-[#2d2418] font-medium flex items-center gap-2">
            <span className="text-bloom-rose font-bold">✦</span>
            {MESSAGES[msgIndex]}
          </p>
          <button
            onClick={() => {
              setDismissed(true)
              localStorage.setItem('bloomwire-fomo-dismissed', 'true')
            }}
            className="text-[#8a7a6a] hover:text-[#2d2418] transition flex-shrink-0"
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
