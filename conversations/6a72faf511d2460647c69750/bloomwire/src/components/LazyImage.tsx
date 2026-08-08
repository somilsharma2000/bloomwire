import { useState, useEffect, useRef } from "react"
import type { ImgHTMLAttributes } from "react"

export interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (containerRef.current) {
            observer.unobserve(containerRef.current)
          }
        }
      },
      { rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 rounded-lg ${containerClassName}`}
    >
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`${className} transition-opacity duration-300 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse pointer-events-none rounded-lg" />
      )}
    </div>
  )
}

export default LazyImage
