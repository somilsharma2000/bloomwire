import { Link } from 'react-router-dom'
import { ArrowRight, Star, TrendingUp } from 'lucide-react'

const HomePage = () => {
  const occasions = [
    { name: 'Birthday', emoji: '🎂' },
    { name: 'Anniversary', emoji: '💕' },
    { name: 'Wedding', emoji: '💒' },
    { name: 'Get Well', emoji: '🌸' },
    { name: 'Thank You', emoji: '🙏' },
    { name: 'Just Because', emoji: '✨' },
  ]

  const categories = [
    { name: 'Bouquets', image: '🌹' },
    { name: 'Single Stems', image: '🌷' },
    { name: 'Arrangements', image: '🌺' },
    { name: 'Gift Bundles', image: '🎁' },
  ]

  const testimonials = [
    {
      name: 'Priya M.',
      text: 'The flowers arrived fresh and beautifully arranged. Truly luxury packaging!',
      rating: 5,
    },
    {
      name: 'Raj K.',
      text: 'Best anniversary gift ever. My wife loved the personalized message.',
      rating: 5,
    },
    {
      name: 'Sneha P.',
      text: 'Premium quality flowers with excellent customer service. Highly recommended!',
      rating: 5,
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-linen to-sage/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl text-center">🌹</div>
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h1 className="font-serif text-6xl md:text-7xl text-sienna mb-4 font-bold">Where Luxury Blooms</h1>
          <p className="text-xl md:text-2xl text-obsidian/80 mb-8">TACTILE BOTANICA</p>
          <p className="text-lg text-obsidian/70 mb-12">Handcrafted luxury flowers for every moment that matters</p>
          <Link to="/shop" className="btn-tactile inline-flex items-center gap-2">
            Explore Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-center text-obsidian mb-12">Shop by Occasion</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion.name}
                to={`/shop?occasion=${occasion.name.toLowerCase()}`}
                className="p-6 text-center rounded-lg bg-white border-2 border-sienna/20 hover:border-sienna hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{occasion.emoji}</div>
                <h3 className="font-medium text-obsidian group-hover:text-sienna transition-colors">{occasion.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 md:py-24 px-4 bg-obsidian/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-center text-obsidian mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="group relative h-64 rounded-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-sienna flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                  {category.image}
                </div>
                <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-obsidian/40 transition-colors flex items-end p-6">
                  <h3 className="font-serif text-2xl text-white font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian">Featured Picks</h2>
            <Link to="/shop" className="btn-tactile-outline inline-flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border-2 border-sienna/20 overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-64 bg-gradient-to-br from-sage/30 to-sienna/30 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  🌹
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-obsidian mb-2">Luxury Bouquet</h3>
                  <p className="text-sienna font-bold mb-3">₹{Math.floor(Math.random() * 4000) + 299}</p>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Star key={j} className="w-4 h-4 fill-sienna text-sienna" />
                    ))}
                  </div>
                  <button className="btn-tactile w-full text-sm">Quick Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 px-4 bg-obsidian text-linen">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-12">Love Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-lg bg-linen/10 border border-linen/20">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-sienna text-sienna" />
                  ))}
                </div>
                <p className="text-linen/90 mb-4 italic">'{testimonial.text}'</p>
                <p className="font-serif text-lg text-sienna">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 px-4 bg-sienna text-linen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-8 h-8" />
              </div>
              <p className="text-4xl md:text-5xl font-bold mb-2">5000+</p>
              <p className="text-linen/80">Orders Fulfilled</p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8" />
              </div>
              <p className="text-4xl md:text-5xl font-bold mb-2">12000+</p>
              <p className="text-linen/80">Happy Customers</p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <ArrowRight className="w-8 h-8" />
              </div>
              <p className="text-4xl md:text-5xl font-bold mb-2">24/7</p>
              <p className="text-linen/80">Always Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian mb-6">Bloom with Us</h2>
          <p className="text-lg text-obsidian/70 mb-8">Subscribe for exclusive offers, new arrivals, and floral inspiration</p>
          <form className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input flex-1"
              required
            />
            <button type="submit" className="btn-tactile whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HomePage
