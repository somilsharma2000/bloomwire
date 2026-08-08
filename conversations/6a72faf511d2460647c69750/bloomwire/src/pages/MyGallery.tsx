import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/authStore'
import { useSEO } from '../hooks/useSEO'

export default function MyGallery() {
  useSEO({ title: 'Bloomwire — My Gallery | Your Unboxing Photos', description: 'Your private gallery of approved unboxing photos.', canonicalPath: '/#/my-gallery' })
  const { user } = useAuth()
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState('')

  const fetchGallery = async () => {
    if (!user?.email) return
    setLoading(true)
    const res = await api.getUserGallery(user.email)
    if (res.success) setGallery(res.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchGallery() }, [user?.email])

  const togglePublic = async (galleryId: string, currentPublic: boolean) => {
    setTogglingId(galleryId)
    await api.toggleGalleryPublic(galleryId, !currentPublic)
    setGallery(prev => prev.map(g => g._id === galleryId ? { ...g, isPublic: !currentPublic } : g))
    setTogglingId('')
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 relative z-10">
        <div className="w-10 h-10 border-4 border-bloom-rose border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">My Gallery</h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/60 border border-[#2d2418]/10 text-[#8a7a6a]">
            🔒 Private — only you can see this
          </span>
        </div>
      </div>

      {/* Empty state */}
      {gallery.length === 0 ? (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📸</div>
          <h2 className="text-xl font-serif font-medium mb-2">No unboxing photos yet</h2>
          <p className="text-sm text-[#a0918a] mb-6 max-w-sm mx-auto">
            Share your first unboxing to earn 50 Petals! Your approved photos will appear here in your private gallery.
          </p>
          <Link to="/rewards" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shimmer-btn neon-glow transition">
            Share Your Unboxing →
          </Link>
        </div>
      ) : (
        <>
          {/* Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item: any) => (
              <div key={item._id} className="glass rounded-2xl overflow-hidden group relative">
                {/* Media */}
                <div className="aspect-square overflow-hidden">
                  {item.mediaType === 'video' ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={item.mediaUrl} alt={item.caption || 'Unboxing photo'} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>

                {/* Info overlay */}
                <div className="p-3">
                  {item.caption && (
                    <p className="text-xs text-[#8a7a6a] mb-2 line-clamp-2">{item.caption}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-bloom-gold font-medium">+50 🌸</span>
                    <span className="text-xs text-[#a0918a]">
                      {item.created_date ? new Date(item.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                    </span>
                  </div>

                  {/* Public toggle */}
                  <button
                    onClick={() => togglePublic(item._id, item.isPublic)}
                    disabled={togglingId === item._id}
                    className={`mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition ${
                      item.isPublic
                        ? 'bg-bloom-mint/20 text-bloom-mint border border-bloom-mint/30'
                        : 'bg-white/60 text-[#a0918a] border border-[#2d2418]/10 hover:bg-white/70'
                    } disabled:opacity-50`}
                  >
                    {togglingId === item._id ? 'Updating…' : item.isPublic ? '🌍 Visible on public gallery' : '🔒 Private — Tap to share'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-xs text-[#a0918a] mt-6 text-center">
            Your uploads are private — only you and Bloomwire admin can see them. Toggle "Share" to feature your photos on the public gallery.
          </p>
        </>
      )}
    </div>
  )
}
