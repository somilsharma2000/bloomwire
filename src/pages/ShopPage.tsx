import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Star, ChevronDown } from 'lucide-react'

const ShopPage = () => {
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([299, 4999])

  const selectedCategory = searchParams.get('category')
  const selectedOccasion = searchParams.get('occasion')
  const searchQuery = searchParams.get('q')

  // Mock product data
  const allProducts = [
    {
      id: '1',
      name: 'Romance Red Bouquet',
      slug: 'romance-red-bouquet',
      price: 999,
      rating: 4.8,
      reviewCount: 245,
      category: 'bouquets',
      occasions: ['anniversary', 'just-because'],
      image: '🌹',
    },
    {
      id: '2',
      name: 'Sunrise Yellow Stems',
      slug: 'sunrise-yellow-stems',
      price: 499,
      rating: 4.9,
      reviewCount: 189,
      category: 'single-stems',
      occasions: ['birthday', 'thank-you'],
      image: '🌼',
    },
    {
      id: '3',
      name: 'Blissful Garden Arrangement',
      slug: 'blissful-garden-arrangement',
      price: 1499,
      rating: 5,
      reviewCount: 312,
      category: 'arrangements',
      occasions: ['wedding', 'anniversary'],
      image: '🌺',
    },
    {
      id: '4',
      name: 'Get Well Bundle',
      slug: 'get-well-bundle',
      price: 799,
      rating: 4.7,
      reviewCount: 156,
      category: 'gift-bundles',
      occasions: ['get-well'],
      image: '🌸',
    },
  ]

  const filteredAndSorted = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesOccasion = !selectedOccasion || product.occasions.includes(selectedOccasion)
      const matchesSearch =
        !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesCategory && matchesOccasion && matchesSearch && matchesPrice
    })

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // featured is default
        break
    }

    return filtered
  }, [selectedCategory, selectedOccasion, searchQuery, priceRange, sortBy])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-8">Shop</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-lg text-obsidian mb-4">Filters</h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="font-medium text-obsidian mb-3 block">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="299"
                    max="4999"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="299"
                    max="4999"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-obsidian/70">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-obsidian/70">{filteredAndSorted.length} products</p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pr-10 pl-4 py-2 border-2 border-sienna rounded-lg focus:outline-none focus:border-sienna/70"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSorted.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSorted.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border-2 border-sienna/20 overflow-hidden hover:shadow-xl hover:border-sienna transition-all group"
                  >
                    <div className="h-48 bg-gradient-to-br from-sage/30 to-sienna/30 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                      {product.image}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg text-obsidian mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sienna font-bold text-lg mb-2">₹{product.price}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-sienna text-sienna'
                                  : 'text-sienna/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-obsidian/70">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <button className="btn-tactile w-full text-sm">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-obsidian/70 text-lg">No products found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage
