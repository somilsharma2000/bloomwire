import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.getBlogPosts?.().then((res: any) => {
      if (res?.success && res.data) setPosts(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF8F3] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-[#F8F4FD] rounded-full blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-[#FEF9E7] rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h1 className="font-serif text-4xl text-[#2D2D2D] text-center mb-4">Bloomwire Blog</h1>
        <p className="text-[#9A9A9A] italic font-serif text-sm text-center mb-12">✿ Stories, tips, and floral inspiration ✿</p>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-100 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🌸</p>
            <p className="text-[#6B6B6B] text-lg font-serif">Blog posts coming soon</p>
            <p className="text-[#9A9A9A] text-sm mt-2">We're working on sharing our floral journey with you.</p>
            <Link to="/" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium shadow-sm hover:scale-[1.02] transition">Back to Home</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post, i) => (
              <Link key={i} to={`/blog/${post.slug}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                {post.featuredImage && (
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition" loading="lazy" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  {post.category && <span className="text-xs px-3 py-1 bg-[#FDF2F8] text-bloom-rose rounded-full">{post.category}</span>}
                  <span className="text-xs text-[#9A9A9A]">{post.readTime || '3 min read'}</span>
                </div>
                <h2 className="font-serif text-2xl text-[#2D2D2D] mb-2 group-hover:text-bloom-rose transition">{post.title}</h2>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-[#9A9A9A]">By {post.author || 'Bloomwire Team'}</span>
                  {post.publishedAt && <span className="text-xs text-[#9A9A9A]">• {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
