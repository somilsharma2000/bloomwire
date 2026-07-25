import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Heart, MessageSquare } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [giftMessage, setGiftMessage] = useState('')
  const [ribbonColor, setRibbonColor] = useState('red')
  const [premiumWrapping, setPremiumWrapping] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  // Mock product data
  const product = {
    id: '1',
    name: 'Romance Red Bouquet',
    price: 999,
    rating: 4.8,
    reviewCount: 245,
    soldCount: 1203,
    description:
      'A stunning arrangement of 12 premium red roses wrapped in luxurious kraft paper with a silk ribbon. Perfect for anniversaries and romantic occasions. Each stem is hand-selected for freshness and beauty.',
    images: ['🌹', '🌹', '🌹'],
    stock: 45,
  }

  const reviews = [
    {
      name: 'Priya M.',
      rating: 5,
      title: 'Perfect Anniversary Gift',
      content: 'The flowers were incredibly fresh and beautifully arranged. My partner loved it!',
      date: '2024-07-20',
    },
  ]

  const ribbonColors = [
    { name: 'Red', value: 'red' },
    { name: 'White', value: 'white' },
    { name: 'Gold', value: 'gold' },
    { name: 'Pink', value: 'pink' },
  ]

  const handleAddToCart = () => {
    addItem(product as any, quantity, {
      giftMessage,
      ribbonColor,
      premiumWrapping,
    })
    // Show toast notification
    alert('Added to cart!')
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="bg-gradient-to-br from-sage/30 to-sienna/30 rounded-lg h-96 flex items-center justify-center text-9xl mb-4">
              {product.images[0]}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-sage/30 to-sienna/30 rounded-lg h-24 flex items-center justify-center text-4xl cursor-pointer hover:border-2 hover:border-sienna transition"
                >
                  {img}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-serif text-4xl text-obsidian mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-sienna text-sienna'
                        : 'text-sienna/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-obsidian/70">
                {product.rating} ({product.reviewCount} reviews)
              </span>
              <span className="text-sienna font-medium">Sold: {product.soldCount}</span>
            </div>

            <p className="text-3xl text-sienna font-bold mb-6">₹{product.price}</p>
            <p className="text-obsidian/80 text-lg mb-8">{product.description}</p>

            {/* Personalization */}
            <div className="bg-linen rounded-lg p-6 mb-8 border-2 border-sienna/20">
              <h3 className="font-serif text-xl text-obsidian mb-4">Personalize Your Gift</h3>

              {/* Gift Message */}
              <div className="mb-6">
                <label className="block text-obsidian font-medium mb-2">Gift Message (Free)</label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Add a personal touch..."
                  maxLength={150}
                  className="form-input h-20 resize-none"
                />
                <p className="text-sm text-obsidian/70 mt-1">{giftMessage.length}/150</p>
              </div>

              {/* Ribbon Color */}
              <div className="mb-6">
                <label className="block text-obsidian font-medium mb-2">Ribbon Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {ribbonColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setRibbonColor(color.value)}
                      className={`p-3 rounded-lg border-2 transition ${
                        ribbonColor === color.value
                          ? 'border-sienna bg-sienna/10'
                          : 'border-sienna/30 hover:border-sienna'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Wrapping */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="premium-wrap"
                  checked={premiumWrapping}
                  onChange={(e) => setPremiumWrapping(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="premium-wrap" className="cursor-pointer">
                  <span className="font-medium text-obsidian">Premium Gift Wrapping</span>
                  <span className="text-sienna ml-2 font-bold">+₹49</span>
                </label>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-3 bg-white border-2 border-sienna/30 rounded-lg px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-sienna font-bold hover:bg-sienna/10 px-2 py-1 rounded"
                >
                  −
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-sienna font-bold hover:bg-sienna/10 px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-tactile flex-1">
                Add to Cart
              </button>
              <button className="p-3 border-2 border-sienna rounded-lg hover:bg-sienna/10 transition">
                <Heart className="w-6 h-6 text-sienna" />
              </button>
            </div>

            {/* Stock Info */}
            <div className="text-sm text-obsidian/70">
              <p>✓ {product.stock} in stock</p>
              <p>✓ Free delivery on orders above ₹499</p>
              <p>✓ Freshness guaranteed on all flowers</p>
            </div>
          </div>
        </div>

        {/* Related Products & Reviews */}
        <div className="border-t-2 border-sienna/20 pt-12">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowReviews(false)}
              className={`font-medium transition ${
                !showReviews ? 'text-sienna border-b-2 border-sienna' : 'text-obsidian/70'
              }`}
            >
              Related Products
            </button>
            <button
              onClick={() => setShowReviews(true)}
              className={`font-medium transition flex items-center gap-2 ${
                showReviews ? 'text-sienna border-b-2 border-sienna' : 'text-obsidian/70'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Reviews
            </button>
          </div>

          {!showReviews ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border-2 border-sienna/20 overflow-hidden hover:shadow-lg transition">
                  <div className="h-40 bg-gradient-to-br from-sage/30 to-sienna/30 flex items-center justify-center text-5xl">
                    🌹
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-obsidian mb-2">Related Bouquet</h4>
                    <p className="text-sienna font-bold">₹999</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, i) => (
                <div key={i} className="border-b border-sienna/20 pb-6">
                  <div className="flex gap-2 mb-2">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-sienna text-sienna" />
                    ))}
                  </div>
                  <h4 className="font-serif text-lg text-obsidian mb-1">{review.title}</h4>
                  <p className="text-obsidian/70 mb-2">{review.content}</p>
                  <p className="text-sm text-obsidian/50">
                    {review.name} • {review.date}
                  </p>
                </div>
              ))}
              <button className="btn-tactile">Write a Review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
