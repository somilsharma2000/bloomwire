import { useEffect, useState, useCallback } from 'react'

interface IntroAnimationProps {
  onComplete: () => void
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [exiting, setExiting] = useState(false)

  const handleSkip = useCallback(() => {
    sessionStorage.setItem('bloomwire_intro_played', 'true')
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Sequence 5: 2.5s - start slide up & fade out
    const exitTimer = setTimeout(() => {
      setExiting(true)
    }, 2500)

    // Sequence 6: 3.0s - complete & unmount
    const completeTimer = setTimeout(() => {
      sessionStorage.setItem('bloomwire_intro_played', 'true')
      onComplete()
    }, 3000)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [handleSkip, onComplete])

  const wordLetters = 'BLOOMWIRE™'.split('')

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#FFF8F3] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${
        exiting ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      style={{ perspective: '1000px' }}
    >
      {/* Radial ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,182,193,0.35)_0%,transparent_70%)] pointer-events-none" />

      {/* 3D Extruded Word Container */}
      <div className="relative flex items-center justify-center gap-1 sm:gap-2 md:gap-3 z-10 px-4">
        {wordLetters.map((letter, index) => (
          <span
            key={index}
            className="intro-letter text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-wider select-none"
            style={{
              transformStyle: 'preserve-3d',
              animationDelay: `${300 + index * 100}ms`,
              background: 'linear-gradient(135deg, #e91e63 0%, #f06292 50%, #c2185b 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <div className="intro-tagline mt-6 sm:mt-8 z-10 text-center px-4">
        <p className="text-sm sm:text-base lg:text-lg font-serif italic text-[#8a5a3c] tracking-widest uppercase font-semibold">
          Hand-Twisted Blooms That Last
        </p>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 px-4 py-2 rounded-full bg-white/80 border border-[#2d2418]/15 text-xs sm:text-sm font-medium text-[#6b5d4f] hover:text-[#2d2418] hover:border-bloom-rose/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md flex items-center gap-2 backdrop-blur-sm"
        aria-label="Skip Intro Animation"
      >
        <span>Skip</span>
        <span className="text-[10px] opacity-70 uppercase bg-[#2d2418]/10 text-[#2d2418] px-1.5 py-0.5 rounded font-mono">ESC</span>
      </button>
    </div>
  )
}
