import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.getBlogPost?.(slug).then((res: any) => {
      if (res?.success && res.data) setPost(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center">
        <p className="text-[#9A9A9A] font-serif text-lg">Loading...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🌸</p>
          <p className="text-[#6B6B6B] text-lg font-serif">Post not found</p>
          <Link to="/blog" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-xl font-medium">Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link to="/blog" className="text-bloom-rose text-sm hover:underline mb-6 inline-block">← Back to Blog</Link>

        {post.category && <span className="text-xs px-3 py-1 bg-[#FDF2F8] text-bloom-rose rounded-full inline-block mb-4">{post.category}</span>}

        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-[#9A9A9A]">By {post.author || 'Bloomwire Team'}</span>
          {post.publishedAt && <span className="text-sm text-[#9A9A9A]">• {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          {post.readTime && <span className="text-sm text-[#9A9A9A]">• {post.readTime}</span>}
        </div>

        {post.featuredImage && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
            <img src={post.featuredImage} alt={post.title} className="w-full h-[400px] object-cover" loading="lazy" />
          </div>
        )}

        {post.excerpt && <p className="text-[#6B6B6B] text-lg font-serif italic mb-8 leading-relaxed">{post.excerpt}</p>}

        <div className="prose prose-lg max-w-none text-[#2D2D2D] leading-relaxed whitespace-pre-wrap">{post.content}</div>
      </div>
    </div>
  )
}
