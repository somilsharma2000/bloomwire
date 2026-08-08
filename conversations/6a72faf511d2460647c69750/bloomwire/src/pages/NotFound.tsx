import { useNavigate, Link } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center relative overflow-hidden bg-[#FFF8F3] px-4 py-16 text-center">
      {/* Pastel Blobs Background Pattern */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FDF2F8] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-[#FFF0E8] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-[#F8F4FD] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 left-8 w-72 h-72 bg-[#F0F8F0] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#FEF9E7] rounded-full blur-[150px] opacity-60 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        {/* Wilted Flower Emoji */}
        <div className="text-7xl sm:text-8xl mb-6 transform -rotate-12 animate-float">
          🥀
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] font-bold mb-3 tracking-tight">
          This flower hasn't bloomed yet
        </h1>

        {/* Subtext */}
        <p className="text-[#6B6B6B] text-base sm:text-lg mb-8 leading-relaxed max-w-sm">
          The page you're looking for might have been moved or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200"
          >
            Back to Home
          </button>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-7 py-3 bg-white text-[#2D2D2D] font-medium rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-all duration-200"
          >
            Browse our flowers
          </Link>
        </div>
      </div>
    </div>
  )
}
