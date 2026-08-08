import os

# 1. Wishlist and Share Section
wishlist_share_content = """/*
================================================================================
SECTION 1: WISHLIST & SHARE BUTTONS WITH SOCIAL SHARE PANEL
================================================================================
Replace the placeholder Wishlist / Share div (around line 303-306 in ProductDetail.tsx)
with this fully functional JSX section.

INSTRUCTIONS FOR INTEGRATION:
1. Ensure the following imports exist at the top of ProductDetail.tsx:
   import { useWatchlist } from '../store/watchlistStore'
   import { HeartIcon, ShareIcon, WhatsAppIcon, InstagramIcon, CheckIcon } from '../components/Icons'

2. Add the following state hooks and handlers inside the ProductDetail component:
   const { toggle: toggleWatchlist, isInList } = useWatchlist()
   const isWishlisted = isInList(product.slug)
   
   const [wishlistToast, setWishlistToast] = useState<string | null>(null)
   const [shareToast, setShareToast] = useState<string | null>(null)
   const [showSharePanel, setShowSharePanel] = useState(false)

   const handleWishlistToggle = () => {
     toggleWatchlist({
       slug: product.slug,
       name: product.name,
       price: product.price,
       image: product.image,
     })
     const active = !isWishlisted
     setWishlistToast(active ? 'Added to Wishlist! ❤️' : 'Removed from Wishlist')
     setTimeout(() => setWishlistToast(null), 2500)
   }

   const handleCopyLink = () => {
     navigator.clipboard.writeText(window.location.href)
     setShareToast('Copied to Clipboard! 📋')
     setTimeout(() => setShareToast(null), 2500)
   }

   const handleWhatsAppShare = () => {
     const shareUrl = encodeURIComponent(window.location.href)
     const text = encodeURIComponent(`Check out ${product.name} on Bloomwire - handcrafted everlasting pipe cleaner flowers! ✨`)
     window.open(`https://api.whatsapp.com/send?text=${text}%20${shareUrl}`, '_blank')
   }

   const handleInstagramShare = () => {
     navigator.clipboard.writeText(window.location.href)
     setShareToast('Link Copied! Open Instagram to share in Story or DM 🌸')
     setTimeout(() => setShareToast(null), 3000)
   }
================================================================================
*/

{/* Wishlist & Share Action Bar */}
<div className="space-y-3 mb-8">
  <div className="flex gap-3">
    {/* Wishlist Button */}
    <button
      onClick={handleWishlistToggle}
      className={`flex-1 glass rounded-xl py-2.5 px-4 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
        isWishlisted
          ? 'bg-bloom-rose/20 text-bloom-rose border border-bloom-rose/50 shadow-[0_0_15px_rgba(233,30,99,0.3)]'
          : 'text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <HeartIcon
        size={18}
        fill={isWishlisted ? 'currentColor' : 'none'}
        className={`transition-transform duration-300 ${isWishlisted ? 'scale-110 text-bloom-rose' : ''}`}
      />
      <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
    </button>

    {/* Share Button */}
    <button
      onClick={() => setShowSharePanel(!showSharePanel)}
      className={`flex-1 glass rounded-xl py-2.5 px-4 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
        showSharePanel
          ? 'bg-white/15 text-bloom-neon border border-bloom-rose/40'
          : 'text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <ShareIcon size={18} className={showSharePanel ? 'text-bloom-neon' : ''} />
      <span>{showSharePanel ? 'Close Share' : 'Share'}</span>
    </button>
  </div>

  {/* Toast Notifications */}
  {(wishlistToast || shareToast) && (
    <div className="glass-strong rounded-xl px-4 py-2.5 text-xs font-medium text-white border border-bloom-rose/40 shadow-lg flex items-center justify-between animate-fade-up bg-gradient-to-r from-bloom-rose/20 to-bloom-wine/20">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-bloom-neon animate-ping" />
        {wishlistToast || shareToast}
      </span>
      <button
        onClick={() => { setWishlistToast(null); setShareToast(null); }}
        className="text-gray-400 hover:text-white text-sm cursor-pointer"
      >
        ✕
      </button>
    </div>
  )}

  {/* Social Share Expandable Panel */}
  {showSharePanel && (
    <div className="glass-strong rounded-2xl p-4 border border-bloom-rose/30 shadow-xl animate-fade-up space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
        Share Bloomwire Creation
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* WhatsApp Share */}
        <button
          onClick={handleWhatsAppShare}
          className="glass hover:bg-emerald-500/20 hover:border-emerald-500/40 text-gray-200 hover:text-emerald-400 rounded-xl py-2 px-3 text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
        >
          <WhatsAppIcon size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>WhatsApp</span>
        </button>

        {/* Instagram Share */}
        <button
          onClick={handleInstagramShare}
          className="glass hover:bg-pink-500/20 hover:border-pink-500/40 text-gray-200 hover:text-pink-400 rounded-xl py-2 px-3 text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
        >
          <InstagramIcon size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
          <span>Instagram</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="glass hover:bg-bloom-rose/20 hover:border-bloom-rose/40 text-gray-200 hover:text-bloom-neon rounded-xl py-2 px-3 text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
        >
          <ShareIcon size={18} className="text-bloom-neon group-hover:scale-110 transition-transform" />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  )}
</div>
"""

# Write wishlist share section
with open('/tmp/wishlist-share-section.txt', 'w') as f:
    f.write(wishlist_share_content)

print("Written /tmp/wishlist-share-section.txt")
