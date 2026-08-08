import { Link } from 'react-router-dom'
import { useToastStore } from '../store/toastStore'
import { CheckCircleIcon, HeartIcon, ShareIcon, UserIcon, XIcon } from './Icons'

const TYPE_CONFIG = {
  success: { Icon: CheckCircleIcon, color: 'text-emerald-600', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  error: { Icon: XIcon, color: 'text-red-500', border: 'border-red-500/30', bg: 'bg-red-500/10' },
  info: { Icon: ShareIcon, color: 'text-bloom-neon', border: 'border-bloom-rose/30', bg: 'bg-bloom-rose/10' },
  wishlist: { Icon: HeartIcon, color: 'text-bloom-rose', border: 'border-bloom-rose/40', bg: 'bg-bloom-rose/10' },
  cart: { Icon: CheckCircleIcon, color: 'text-bloom-rose', border: 'border-gray-100', bg: 'bg-bloom-rose/10' },
  auth: { Icon: UserIcon, color: 'text-bloom-neon', border: 'border-bloom-neon/30', bg: 'bg-bloom-neon/10' },
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  const cartToasts = toasts.filter((t) => t.type === 'cart')
  const standardToasts = toasts.filter((t) => t.type !== 'cart')

  return (
    <>
      {/* Bottom-Center Cart Toasts */}
      {cartToasts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
          {cartToasts.map((t) => (
            <div
              key={t.id}
              className="bg-white shadow-lg border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center gap-3 pointer-events-auto w-full animate-fade-up"
            >
              <div className="w-8 h-8 rounded-full bg-bloom-rose/10 flex items-center justify-center shrink-0">
                <CheckCircleIcon size={18} className="text-bloom-rose" />
              </div>
              <p className="text-sm font-medium text-[#2D2D2D] flex-1">
                {t.message || '✓ Added to cart'}
              </p>
              <Link
                to="/cart"
                onClick={() => removeToast(t.id)}
                className="text-sm font-semibold text-bloom-rose hover:underline shrink-0"
              >
                View Cart
              </Link>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[#9A9A9A] hover:text-[#2D2D2D] transition p-1"
                aria-label="Close toast"
              >
                <XIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Top-Right / Bottom-Right Standard Toasts */}
      {standardToasts.length > 0 && (
        <div className="fixed top-6 right-4 sm:bottom-6 sm:right-6 sm:top-auto z-[200] flex flex-col gap-3 pointer-events-none">
          {standardToasts.map((t) => {
            const config = TYPE_CONFIG[t.type] || TYPE_CONFIG.success
            return (
              <div
                key={t.id}
                className={`glass-strong rounded-2xl px-5 py-3.5 flex items-center gap-3 ${config.border} border shadow-xl animate-fade-up pointer-events-auto cursor-pointer min-w-[220px] sm:min-w-[260px] max-w-[calc(100vw-2rem)] sm:max-w-[360px]`}
                onClick={() => removeToast(t.id)}
              >
                <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                  <config.Icon size={18} className={config.color} />
                </div>
                <p className="text-sm text-[#2D2D2D] font-medium leading-snug">{t.message}</p>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
