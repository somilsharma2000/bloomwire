import { useState, useEffect } from 'react'

function CloseIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
}

function ArrowLeft({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
}

function ArrowRight({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
}

interface LightboxProps {
  images: { src: string; name: string; category: string }[]
  onClose: () => void
  startIndex: number
}

export default function Lightbox({ images, onClose, startIndex }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [images.length, onClose])

  const current = images[index]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF8F3]/95 backdrop-blur-lg animate-fade-in" onClick={onClose}>
      <button className="absolute top-6 right-6 text-[#a0918a] hover:text-[#2d2418] transition z-10" onClick={onClose}><CloseIcon size={32} /></button>
      
      <button className="absolute left-4 sm:left-8 text-[#a0918a] hover:text-[#2d2418] transition z-10 p-2" onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length) }}><ArrowLeft size={36} /></button>
      
      <div className="max-w-4xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
        <img src={current.src} alt={current.name} className="max-w-full max-h-[75vh] rounded-2xl object-contain animate-scale-in shadow-2xl" loading="lazy" />
        <div className="text-center mt-4">
          <p className="text-[#2d2418] font-serif text-xl">{current.name}</p>
          <p className="text-[#8a7a6a] text-sm">{current.category}</p>
          <p className="text-[#a0918a] text-xs mt-2">{index + 1} / {images.length}</p>
        </div>
      </div>
      
      <button className="absolute right-4 sm:right-8 text-[#a0918a] hover:text-[#2d2418] transition z-10 p-2" onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length) }}><ArrowRight size={36} /></button>
    </div>
  )
}
