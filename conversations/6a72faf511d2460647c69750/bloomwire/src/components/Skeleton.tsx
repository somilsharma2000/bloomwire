import React from 'react'

interface SkeletonLineProps {
  className?: string
  width?: string
  height?: string
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
}) => {
  return (
    <div
      className={`bg-gray-100 animate-pulse rounded-lg ${width} ${height} ${className}`}
    />
  )
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col gap-3">
      {/* Aspect-square pulsing image placeholder */}
      <div className="w-full aspect-square bg-gray-100 rounded-lg animate-pulse" />

      {/* Title line */}
      <SkeletonLine width="w-3/4" height="h-4" />

      {/* Price line */}
      <SkeletonLine width="w-1/3" height="h-4" />
    </div>
  )
}

export default ProductCardSkeleton
