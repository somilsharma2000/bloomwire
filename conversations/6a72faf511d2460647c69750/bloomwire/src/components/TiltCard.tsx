import React, { useState, useRef, useCallback, type MouseEvent, type ReactNode } from 'react'

export interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
}

const TiltCardComponent: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, x: 50, y: 50 })

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlowStyle({ opacity: 0.25, x: glowX, y: glowY })
  }, [maxTilt])

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlowStyle({ opacity: 0, x: 50, y: 50 })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out transform-gpu cursor-pointer ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {/* Glow Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
        style={{
          opacity: glowStyle.opacity,
          background: `radial-gradient(circle at ${glowStyle.x}% ${glowStyle.y}%, rgba(233, 30, 99, 0.4), transparent 60%)`,
        }}
      />
      {children}
    </div>
  )
}

export const TiltCard = React.memo(TiltCardComponent)

export default TiltCard
