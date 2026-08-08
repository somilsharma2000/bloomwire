import { useState, useMemo, useEffect } from 'react'
import {
  StatCard,
  SearchBar,
  SectionHeader,
  EmptyState,
  Toggle,
  FormField,
  Input,
  Textarea,
  Select,
  ConfirmDialog,
} from './shared'
import { products, type Product } from '../../data/products'

export interface AdminProduct extends Product {
  status?: 'Active' | 'Draft'
  mrp?: number
  salePrice?: number
  materials?: string
  dimensions?: string
  careInstructions?: string
  makerName?: string
  makerCity?: string
  makerQuote?: string
  colors?: string
  isBestseller?: boolean
}

type SubTab = 'grid' | 'stock' | 'categories'

const LOCAL_STORAGE_KEY = 'bloomwire_admin_products_catalog'

const AVAILABLE_BADGES = [
  'Bestseller',
  'Trending',
  'Hot Seller',
  'Staff Pick',
  'Top Gift',
  'Petals Special',
  'Limited',
  'Low Maintenance',
  'Popular',
]

function loadCatalog(): AdminProduct[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Failed to load products from localStorage:', err)
  }

  return products.map((p) => ({
    ...p,
    status: 'Active',
    mrp: p.originalPrice || Math.round(p.price * 1.25),
    salePrice: p.price,
    materials: 'Velvet Chenille Pipe Cleaners, Flexible Floral Wire, Satin Ribbon',
    dimensions: 'Approx. 25cm x 15cm x 15cm',
    careInstructions: 'Keep away from moisture and direct flame. Dust softly with a dry brush.',
    makerName: 'Aarti Sharma',
    makerCity: 'Jaipur',
    makerQuote: 'Hand-shaped with love and patience to retain eternal blooms.',
    colors: p.tags ? p.tags.slice(0, 3).join(', ') : 'Multi',
    isBestseller: p.badges?.includes('Bestseller') || p.tags?.includes('Bestseller') || false,
  }))
}

function saveCatalog(items: AdminProduct[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to save products to localStorage:', err)
  }
}

export default function ProductsSection() {
  const [productList, setProductList] = useState<AdminProduct[]>(() => loadCatalog())
  const [activeTab, setActiveTab] = useState<SubTab>('grid')

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock-asc'>('name')

  // Notification notice
  const [notice, setNotice] = useState<string | null>(null)

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Bouquets',
    price: '',
    mrp: '',
    salePrice: '',
    stock: '10',
    sku: '',
    images: '',
    materials: 'Velvet Chenille Pipe Cleaners, Flexible Floral Wire, Satin Ribbon',
    dimensions: '25cm x 15cm x 15cm',
    careInstructions: 'Keep away from moisture and direct flame. Dust softly with a dry brush.',
    makerName: 'Aarti Sharma',
    makerCity: 'Jaipur',
    makerQuote: 'Hand-shaped with love and patience to retain eternal blooms.',
    badges: [] as string[],
    featured: false,
    isBestseller: false,
    status: 'Active' as 'Active' | 'Draft',
    colors: '',
  })

  // Quick Stock Editing in Stock Sub-Tab
  const [editingStockSlug, setEditingStockSlug] = useState<string | null>(null)
  const [stockInputValue, setStockInputValue] = useState<string>('')

  // Delete Confirm Dialog
  const [deleteTargetSlug, setDeleteTargetSlug] = useState<string | null>(null)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  // Sync to local storage whenever productList changes
  useEffect(() => {
    saveCatalog(productList)
  }, [productList])

  // Dynamic category options
  const categoryList = useMemo(() => {
    const cats = new Set<string>()
    productList.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats).sort()
  }, [productList])

  const categorySelectOptions = useMemo(() => {
    return [
      { value: 'All', label: 'All Categories' },
      ...categoryList.map((c) => ({ value: c, label: c })),
    ]
  }, [categoryList])

  const modalCategoryOptions = useMemo(() => {
    const defaults = ['Bouquets', 'Potted Decor', 'Keychains', 'Single Flowers', 'Gift Bundles', 'DIY Kits']
    const combined = Array.from(new Set([...defaults, ...categoryList]))
    return combined.map((c) => ({ value: c, label: c }))
  }, [categoryList])

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return productList
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCat = categoryFilter === 'All' || p.category === categoryFilter
        return matchesSearch && matchesCat
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'stock-asc') return a.stock - b.stock
        return 0
      })
  }, [productList, searchQuery, categoryFilter, sortBy])

  // Overview stats
  const totalProducts = productList.length
  const activeProducts = productList.filter((p) => (p.status || 'Active') === 'Active').length
  const lowStockCount = productList.filter((p) => p.stock < 5).length
  const totalCategories = categoryList.length

  // Calculate Petals Earned (5% of price rounded)
  const calculatedPetals = useMemo(() => {
    const numericPrice = parseFloat(formData.price) || 0
    return Math.round(numericPrice * 0.05)
  }, [formData.price])

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingSlug(null)
    setFormData({
      name: '',
      description: '',
      category: categoryList[0] || 'Bouquets',
      price: '999',
      mrp: '1299',
      salePrice: '999',
      stock: '15',
      sku: `BW-${Math.floor(100 + Math.random() * 900)}`,
      images: 'https://media.base44.com/images/public/6a72faf2ba70adb989a373b9/5ebab43fd_generated_image.png',
      materials: 'Velvet Chenille Pipe Cleaners, Flexible Floral Wire, Satin Ribbon',
      dimensions: '25cm x 15cm x 15cm',
      careInstructions: 'Keep away from moisture and direct flame. Dust softly with a dry brush.',
      makerName: 'Aarti Sharma',
      makerCity: 'Jaipur',
      makerQuote: 'Hand-shaped with love and patience to retain eternal blooms.',
      badges: ['Trending'],
      featured: false,
      isBestseller: false,
      status: 'Active',
      colors: 'Pastel Rose, Soft Cream',
    })
    setIsModalOpen(true)
  }

  // Open Edit Product Modal
  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingSlug(product.slug)
    const imagesStr =
      product.images && product.images.length > 0
        ? product.images.join('\n')
        : product.image || ''

    setFormData({
      name: product.name,
      description: product.description || product.longDescription || '',
      category: product.category || 'Bouquets',
      price: String(product.price ?? ''),
      mrp: String(product.mrp ?? product.originalPrice ?? ''),
      salePrice: String(product.salePrice ?? product.price ?? ''),
      stock: String(product.stock ?? 0),
      sku: product.sku || '',
      images: imagesStr,
      materials: product.materials || 'Velvet Chenille Pipe Cleaners, Flexible Floral Wire, Satin Ribbon',
      dimensions: product.dimensions || '25cm x 15cm x 15cm',
      careInstructions: product.careInstructions || 'Keep away from moisture and direct flame. Dust softly with a dry brush.',
      makerName: product.makerName || 'Aarti Sharma',
      makerCity: product.makerCity || 'Jaipur',
      makerQuote: product.makerQuote || 'Hand-shaped with love and patience to retain eternal blooms.',
      badges: product.badges || [],
      featured: Boolean(product.featured),
      isBestseller: Boolean(product.isBestseller || product.badges?.includes('Bestseller')),
      status: product.status || 'Active',
      colors: typeof product.colors === 'string' ? product.colors : (product.tags || []).join(', '),
    })
    setIsModalOpen(true)
  }

  // Toggle Badge in Form
  const handleBadgeToggle = (badge: string) => {
    setFormData((prev) => {
      const exists = prev.badges.includes(badge)
      const newBadges = exists
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge]

      const isBestsellerNow = newBadges.includes('Bestseller')
      return {
        ...prev,
        badges: newBadges,
        isBestseller: isBestsellerNow,
      }
    })
  }

  // Save Modal Form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Product Name is required.')
      return
    }
    const numPrice = parseFloat(formData.price)
    if (isNaN(numPrice) || numPrice < 0) {
      alert('Valid Price is required.')
      return
    }

    const imageArray = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    const primaryImage =
      imageArray[0] ||
      'https://media.base44.com/images/public/6a72faf2ba70adb989a373b9/5ebab43fd_generated_image.png'

    let updatedBadges = [...formData.badges]
    if (formData.isBestseller && !updatedBadges.includes('Bestseller')) {
      updatedBadges.push('Bestseller')
    } else if (!formData.isBestseller && updatedBadges.includes('Bestseller')) {
      updatedBadges = updatedBadges.filter((b) => b !== 'Bestseller')
    }

    const numMrp = parseFloat(formData.mrp) || Math.round(numPrice * 1.25)
    const numSalePrice = parseFloat(formData.salePrice) || numPrice

    if (editingSlug) {
      // Edit existing product
      const updatedList = productList.map((p) => {
        if (p.slug === editingSlug) {
          return {
            ...p,
            name: formData.name.trim(),
            description: formData.description.trim(),
            longDescription: formData.description.trim(),
            category: formData.category,
            price: numPrice,
            originalPrice: numMrp,
            mrp: numMrp,
            salePrice: numSalePrice,
            stock: parseInt(formData.stock, 10) || 0,
            sku: formData.sku.trim() || p.sku,
            image: primaryImage,
            images: imageArray.length > 0 ? imageArray : [primaryImage],
            materials: formData.materials,
            dimensions: formData.dimensions,
            careInstructions: formData.careInstructions,
            makerName: formData.makerName,
            makerCity: formData.makerCity || 'Jaipur',
            makerQuote: formData.makerQuote,
            badges: updatedBadges,
            featured: formData.featured,
            isBestseller: formData.isBestseller,
            status: formData.status,
            colors: formData.colors,
            petalsEarned: calculatedPetals,
          }
        }
        return p
      })
      setProductList(updatedList)
    } else {
      // Add new product
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${Date.now()}`
      const newProduct: AdminProduct = {
        slug,
        name: formData.name.trim(),
        price: numPrice,
        originalPrice: numMrp,
        mrp: numMrp,
        salePrice: numSalePrice,
        category: formData.category,
        description: formData.description.trim(),
        longDescription: formData.description.trim(),
        image: primaryImage,
        images: imageArray.length > 0 ? imageArray : [primaryImage],
        rating: 0,
        reviewCount: 0,
        stock: parseInt(formData.stock, 10) || 0,
        sku: formData.sku.trim() || `BW-${Math.floor(100 + Math.random() * 900)}`,
        tags: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
        featured: formData.featured,
        isBestseller: formData.isBestseller,
        badges: updatedBadges,
        petalsEarned: calculatedPetals,
        status: formData.status,
        materials: formData.materials,
        dimensions: formData.dimensions,
        careInstructions: formData.careInstructions,
        makerName: formData.makerName,
        makerCity: formData.makerCity || 'Jaipur',
        makerQuote: formData.makerQuote,
        colors: formData.colors,
      }
      setProductList([newProduct, ...productList])
    }

    setIsModalOpen(false)
    setNotice('Product catalog is managed via code. Changes require deployment.')
  }

  // Quick Inline Stock Edit
  const handleStartStockEdit = (product: AdminProduct) => {
    setEditingStockSlug(product.slug)
    setStockInputValue(String(product.stock))
  }

  const handleSaveStockInline = (slug: string) => {
    const val = parseInt(stockInputValue, 10)
    if (isNaN(val) || val < 0) {
      setEditingStockSlug(null)
      return
    }

    const updated = productList.map((p) => {
      if (p.slug === slug) {
        return { ...p, stock: val }
      }
      return p
    })

    setProductList(updated)
    setEditingStockSlug(null)
    setNotice('Product catalog is managed via code. Changes require deployment.')
  }

  // Delete Product
  const handleConfirmDelete = () => {
    if (!deleteTargetSlug) return
    const updated = productList.filter((p) => p.slug !== deleteTargetSlug)
    setProductList(updated)
    setDeleteTargetSlug(null)
    setNotice('Product catalog is managed via code. Changes require deployment.')
  }

  // Reset to static products catalog
  const handleResetCatalog = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setProductList(loadCatalog())
    setResetConfirmOpen(false)
    setNotice('Catalog reset to static default state.')
  }

  return (
    <div className="space-y-6 text-[#2d2418] font-sans">
      {/* ─── Top Header & Controls ─── */}
      <SectionHeader
        title="Products Management"
        subtitle={`Manage catalog items, track inventory levels, and configure categories (${totalProducts} items total)`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-3 py-2 text-xs glass rounded-xl hover:bg-white/70 text-[#8a7a6a] hover:text-[#2d2418] transition flex items-center gap-1.5"
            title="Reset catalog to static defaults"
          >
            <span>🔄</span> Reset Catalog
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-bloom-rose hover:bg-bloom-rose/80 text-white shadow-lg transition flex items-center gap-2"
          >
            <span>➕</span> Add Product
          </button>
        </div>
      </SectionHeader>

      {/* ─── Notification Banner ─── */}
      {notice && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-sm flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold">{notice}</p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Changes are temporarily saved to browser local storage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-100 transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── Overview Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={totalProducts}
          icon="🌸"
          color="text-bloom-neon"
          subtitle="Items in database"
        />
        <StatCard
          label="Active Status"
          value={activeProducts}
          icon="✅"
          color="text-emerald-400"
          subtitle={`${totalProducts - activeProducts} draft item(s)`}
        />
        <StatCard
          label="Low Stock Alert"
          value={lowStockCount}
          icon="⚠️"
          color={lowStockCount > 0 ? 'text-red-400' : 'text-[#8a7a6a]'}
          subtitle="Fewer than 5 units remaining"
        />
        <StatCard
          label="Categories"
          value={totalCategories}
          icon="🏷️"
          color="text-bloom-gold"
          subtitle="Product lines"
        />
      </div>

      {/* ─── Navigation Sub-Tabs ─── */}
      <div className="flex items-center justify-between gap-4 border-b border-[#2d2418]/10 pb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'grid'
                ? 'bg-bloom-rose text-white shadow-md'
                : 'glass text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
            }`}
          >
            <span>🛍️</span> Product Grid ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'stock'
                ? 'bg-bloom-rose text-white shadow-md'
                : 'glass text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
            }`}
          >
            <span>📦</span> Stock Management
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500/30 text-red-300 rounded-full border border-red-500/40">
                {lowStockCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-bloom-rose text-white shadow-md'
                : 'glass text-[#8a7a6a] hover:text-[#2d2418] hover:bg-white/60'
            }`}
          >
            <span>📁</span> Categories ({totalCategories})
          </button>
        </div>

        {/* Filter controls on Grid & Stock tabs */}
        {activeTab !== 'categories' && (
          <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, SKU..."
              />
            </div>
            <div className="w-40">
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categorySelectOptions}
              />
            </div>
            {activeTab === 'grid' && (
              <div className="w-40">
                <Select
                  value={sortBy}
                  onChange={(v) => setSortBy(v as any)}
                  options={[
                    { value: 'name', label: 'Sort by Name' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'stock-asc', label: 'Stock: Low to High' },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ─── TAB 1: PRODUCT LIST (GRID VIEW) ─── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'grid' && (
        <>
          {filteredProducts.length === 0 ? (
            <EmptyState
              text="No products found matching your active filters."
              action={
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('All')
                  }}
                  className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white/20 text-sm font-medium transition"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((p) => {
                const primaryImg = p.image || p.images?.[0]
                const mrpVal = p.mrp || p.originalPrice
                const isLowStock = p.stock < 5 && p.stock > 0
                const isOutOfStock = p.stock === 0
                const isActive = (p.status || 'Active') === 'Active'

                return (
                  <div
                    key={p.slug}
                    className="glass rounded-2xl border border-[#2d2418]/10 hover:border-white/25 transition-all flex flex-col justify-between overflow-hidden group hover:shadow-2xl hover:shadow-bloom-rose/10"
                  >
                    <div>
                      {/* Image Preview & Badges Header */}
                      <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8a7a6a] text-sm">
                            No Image
                          </div>
                        )}

                        {/* Top Overlay Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-gray-500/30 text-[#6b5d4f] border-gray-500/40'
                            }`}
                          >
                            {isActive ? 'Active' : 'Draft'}
                          </span>
                          {p.featured && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bloom-rose/30 text-bloom-neon border border-bloom-rose/50 backdrop-blur-md">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2 z-10">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                              isOutOfStock
                                ? 'bg-red-950/80 text-red-300 border-red-500/50'
                                : isLowStock
                                ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {isOutOfStock
                              ? 'Out of Stock'
                              : isLowStock
                              ? `Low Stock (${p.stock})`
                              : `${p.stock} in stock`}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#8a7a6a]">
                          <span className="font-medium text-bloom-neon uppercase tracking-wider">
                            {p.category}
                          </span>
                          <span className="text-[11px] font-mono text-[#a0918a]">{p.sku}</span>
                        </div>

                        <h3 className="font-semibold text-base text-[#2d2418] group-hover:text-bloom-neon transition-colors line-clamp-1">
                          {p.name}
                        </h3>

                        {/* Price & MRP */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#2d2418]">₹{p.price}</span>
                          {mrpVal && mrpVal > p.price && (
                            <span className="text-xs text-[#a0918a] line-through">
                              ₹{mrpVal}
                            </span>
                          )}
                          <span className="text-[10px] text-bloom-gold font-medium ml-auto">
                            +{p.petalsEarned || Math.round(p.price * 0.05)} Petals
                          </span>
                        </div>

                        {/* Badges list */}
                        {p.badges && p.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {p.badges.map((b) => (
                              <span
                                key={b}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-white/60 border border-[#2d2418]/10 text-[#6b5d4f]"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 pt-0 border-t border-[#2d2418]/5 mt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="flex-1 py-1.5 px-3 rounded-xl glass border border-[#2d2418]/10 hover:border-bloom-rose/50 hover:bg-bloom-rose/10 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
                      >
                        <span>✏️</span> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTargetSlug(p.slug)}
                        className="py-1.5 px-3 rounded-xl glass border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 hover:text-red-300 transition"
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ─── TAB 2: STOCK MANAGEMENT SUB-TAB ─── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'stock' && (
        <div className="glass rounded-2xl border border-[#2d2418]/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d2418]/10">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2d2418]">Stock Level Control</h3>
              <p className="text-xs text-[#8a7a6a]">
                Click any stock quantity to edit inline. Low stock (&lt;5 units) items are highlighted in red.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8a7a6a]">Low Stock Alert Count: </span>
              <span className="text-sm font-bold text-red-400">{lowStockCount} items</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs uppercase text-[#8a7a6a] border-b border-[#2d2418]/10">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Quantity (Click to edit)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isLow = p.stock < 5 && p.stock > 0
                  const isOut = p.stock === 0
                  const isEditingThis = editingStockSlug === p.slug

                  return (
                    <tr
                      key={p.slug}
                      className={`border-b border-[#2d2418]/5 transition-colors ${
                        isOut
                          ? 'bg-red-950/20 hover:bg-red-950/30'
                          : isLow
                          ? 'bg-red-500/10 hover:bg-red-500/15'
                          : 'hover:bg-white/60'
                      }`}
                    >
                      {/* Product details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || p.images?.[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-[#2d2418]/10"
                          />
                          <div>
                            <p className="font-semibold text-[#2d2418] line-clamp-1">{p.name}</p>
                            <p className="text-xs font-mono text-[#a0918a]">SKU: {p.sku}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#6b5d4f] text-xs font-medium">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-[#2d2418] font-semibold">₹{p.price}</td>

                      {/* Stock Inline Edit */}
                      <td className="py-3 px-4">
                        {isEditingThis ? (
                          <div className="flex items-center gap-2 max-w-[140px]">
                            <Input
                              type="number"
                              min={0}
                              value={stockInputValue}
                              onChange={(v) => setStockInputValue(v)}
                            />
                            <button
                              onClick={() => handleSaveStockInline(p.slug)}
                              className="px-2 py-1 bg-bloom-rose text-white text-xs font-bold rounded-lg hover:bg-bloom-rose/80"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartStockEdit(p)}
                            className={`group px-3 py-1.5 rounded-lg border flex items-center gap-2 font-mono font-bold text-sm transition ${
                              isOut
                                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-white/60 text-emerald-400 border-[#2d2418]/10 hover:border-emerald-500/40 hover:bg-white/70'
                            }`}
                            title="Click to quickly edit stock"
                          >
                            <span>{p.stock} units</span>
                            <span className="text-xs text-[#8a7a6a] group-hover:text-[#2d2418]">✏️</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            isOut
                              ? 'bg-red-950/80 text-red-300 border-red-500/50'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock (<5)' : 'In Stock'}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const updated = productList.map((item) =>
                                item.slug === p.slug ? { ...item, stock: item.stock + 5 } : item
                              )
                              setProductList(updated)
                              setNotice('Product catalog is managed via code. Changes require deployment.')
                            }}
                            className="px-2.5 py-1 glass hover:bg-white/70 text-xs font-bold rounded-lg text-emerald-400 border border-emerald-500/30"
                            title="Add +5 units to stock"
                          >
                            +5 Stock
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="px-2.5 py-1 glass hover:bg-white/70 text-xs font-bold rounded-lg text-[#6b5d4f] border border-[#2d2418]/10"
                          >
                            Edit Item
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ─── TAB 3: CATEGORY MANAGEMENT SUB-TAB ─── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl border border-[#2d2418]/10 p-5">
            <h3 className="text-lg font-serif font-bold text-[#2d2418] mb-1">
              Categories Breakdown
            </h3>
            <p className="text-xs text-[#8a7a6a]">
              Overview of all active product categories and item distribution across the store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryList.map((catName) => {
              const catProducts = productList.filter((p) => p.category === catName)
              const catStockSum = catProducts.reduce((sum, p) => sum + p.stock, 0)
              const avgPrice =
                catProducts.length > 0
                  ? Math.round(
                      catProducts.reduce((sum, p) => sum + p.price, 0) / catProducts.length
                    )
                  : 0

              return (
                <div
                  key={catName}
                  className="glass rounded-2xl border border-[#2d2418]/10 p-5 hover:border-bloom-rose/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg text-[#2d2418] font-serif">{catName}</h4>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/30">
                        {catProducts.length} Product{catProducts.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* Category metrics */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="glass p-3 rounded-xl border border-[#2d2418]/5">
                        <span className="text-[#8a7a6a] block text-[10px] uppercase">
                          Total Stock
                        </span>
                        <span className="text-base font-bold text-[#2d2418]">
                          {catStockSum} units
                        </span>
                      </div>
                      <div className="glass p-3 rounded-xl border border-[#2d2418]/5">
                        <span className="text-[#8a7a6a] block text-[10px] uppercase">
                          Average Price
                        </span>
                        <span className="text-base font-bold text-bloom-gold">
                          ₹{avgPrice}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail previews */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                      {catProducts.slice(0, 4).map((p) => (
                        <img
                          key={p.slug}
                          src={p.image || p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-[#2d2418]/10"
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCategoryFilter(catName)
                      setActiveTab('grid')
                    }}
                    className="w-full py-2 rounded-xl glass border border-[#2d2418]/10 hover:border-[#2d2418]/15 hover:bg-white/70 text-xs font-semibold text-[#2d2418] transition flex items-center justify-center gap-2"
                  >
                    <span>🔍</span> Filter Products ({catProducts.length})
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ─── ADD / EDIT PRODUCT MODAL ─── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative glass-strong rounded-2xl border border-[#2d2418]/15 p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto my-auto text-[#2d2418] shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2d2418]/10 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2d2418]">
                  {editingSlug ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-[#8a7a6a] mt-1">
                  Configure product details, images, artisans, and status in the catalog.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8a7a6a] hover:text-[#2d2418] text-2xl font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/70 transition"
              >
                ×
              </button>
            </div>

            {/* Static Code Deployment Warning */}
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span>
                Product catalog is managed via code. Changes require deployment (fallback saved to localStorage).
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon border-b border-[#2d2418]/5 pb-1">
                  1. Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField label="Product Name" required>
                      <Input
                        value={formData.name}
                        onChange={(v) => setFormData({ ...formData, name: v })}
                        placeholder="e.g., Velvet Sunset Rose Bouquet"
                      />
                    </FormField>
                  </div>

                  <FormField label="Category">
                    <Select
                      value={formData.category}
                      onChange={(v) => setFormData({ ...formData, category: v })}
                      options={modalCategoryOptions}
                    />
                  </FormField>

                  <FormField label="SKU">
                    <Input
                      value={formData.sku}
                      onChange={(v) => setFormData({ ...formData, sku: v })}
                      placeholder="e.g., BOU-SUN-01"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Description">
                      <Textarea
                        value={formData.description}
                        onChange={(v) => setFormData({ ...formData, description: v })}
                        placeholder="Detailed product story and description..."
                        rows={3}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon border-b border-[#2d2418]/5 pb-1">
                  2. Pricing & Stock
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField label="Price (₹)" required>
                    <Input
                      type="number"
                      min={0}
                      value={formData.price}
                      onChange={(v) => setFormData({ ...formData, price: v })}
                      placeholder="1299"
                    />
                  </FormField>

                  <FormField label="MRP (₹)">
                    <Input
                      type="number"
                      min={0}
                      value={formData.mrp}
                      onChange={(v) => setFormData({ ...formData, mrp: v })}
                      placeholder="1599"
                    />
                  </FormField>

                  <FormField label="Sale Price (₹)">
                    <Input
                      type="number"
                      min={0}
                      value={formData.salePrice}
                      onChange={(v) => setFormData({ ...formData, salePrice: v })}
                      placeholder="1299"
                    />
                  </FormField>

                  <FormField label="Stock Quantity">
                    <Input
                      type="number"
                      min={0}
                      value={formData.stock}
                      onChange={(v) => setFormData({ ...formData, stock: v })}
                      placeholder="20"
                    />
                  </FormField>

                  <div className="sm:col-span-2 md:col-span-4">
                    <FormField
                      label="Petals Earned (Read-Only)"
                      hint="Automatically calculated as 5% of product price rounded"
                    >
                      <Input
                        value={`${calculatedPetals} Petals`}
                        onChange={() => {}}
                        disabled
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Media & Options */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon border-b border-[#2d2418]/5 pb-1">
                  3. Media & Colors
                </h4>
                <FormField
                  label="Image URLs"
                  hint="First line URL is the primary display image; put additional URLs on new lines."
                >
                  <Textarea
                    value={formData.images}
                    onChange={(v) => setFormData({ ...formData, images: v })}
                    placeholder="https://media.base44.com/.../image1.png&#10;https://media.base44.com/.../image2.png"
                    rows={3}
                  />
                </FormField>

                <FormField label="Available Colors (comma-separated)">
                  <Input
                    value={formData.colors}
                    onChange={(v) => setFormData({ ...formData, colors: v })}
                    placeholder="Rose Red, Blush Pink, Sunset Orange"
                  />
                </FormField>
              </div>

              {/* Specs & Care */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon border-b border-[#2d2418]/5 pb-1">
                  4. Materials & Care
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Materials">
                    <Input
                      value={formData.materials}
                      onChange={(v) => setFormData({ ...formData, materials: v })}
                      placeholder="Velvet Chenille, Wire, Ribbon"
                    />
                  </FormField>

                  <FormField label="Dimensions">
                    <Input
                      value={formData.dimensions}
                      onChange={(v) => setFormData({ ...formData, dimensions: v })}
                      placeholder="25cm x 15cm x 15cm"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Care Instructions">
                      <Textarea
                        value={formData.careInstructions}
                        onChange={(v) => setFormData({ ...formData, careInstructions: v })}
                        placeholder="Dust softly with dry brush. Keep away from water."
                        rows={2}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Artisan / Maker */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon border-b border-[#2d2418]/5 pb-1">
                  5. Artisan Maker Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Maker Name">
                    <Input
                      value={formData.makerName}
                      onChange={(v) => setFormData({ ...formData, makerName: v })}
                      placeholder="Aarti Sharma"
                    />
                  </FormField>

                  <FormField label="Maker City">
                    <Input
                      value={formData.makerCity}
                      onChange={(v) => setFormData({ ...formData, makerCity: v })}
                      placeholder="Jaipur"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Maker Quote">
                      <Input
                        value={formData.makerQuote}
                        onChange={(v) => setFormData({ ...formData, makerQuote: v })}
                        placeholder="Hand-shaped with love and patience..."
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Badges & Status Toggles */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-bloom-neon border-b border-[#2d2418]/5 pb-1">
                  6. Badges & Display Toggles
                </h4>

                <div>
                  <label className="block text-sm font-medium text-[#8a7a6a] mb-2">
                    Badges (Multi-select)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_BADGES.map((badge) => {
                      const isSelected = formData.badges.includes(badge)
                      return (
                        <button
                          key={badge}
                          type="button"
                          onClick={() => handleBadgeToggle(badge)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                            isSelected
                              ? 'bg-bloom-rose text-white border-bloom-rose shadow-md'
                              : 'glass text-[#8a7a6a] border-[#2d2418]/10 hover:border-white/30'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {badge}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="glass p-3 rounded-xl border border-[#2d2418]/10">
                    <Toggle
                      checked={formData.featured}
                      onChange={(v) => setFormData({ ...formData, featured: v })}
                      label="Is Featured"
                    />
                  </div>

                  <div className="glass p-3 rounded-xl border border-[#2d2418]/10">
                    <Toggle
                      checked={formData.isBestseller}
                      onChange={(v) => {
                        let newBadges = [...formData.badges]
                        if (v && !newBadges.includes('Bestseller')) {
                          newBadges.push('Bestseller')
                        } else if (!v) {
                          newBadges = newBadges.filter((b) => b !== 'Bestseller')
                        }
                        setFormData({
                          ...formData,
                          isBestseller: v,
                          badges: newBadges,
                        })
                      }}
                      label="Is Bestseller"
                    />
                  </div>

                  <div className="glass p-3 rounded-xl border border-[#2d2418]/10">
                    <Toggle
                      checked={formData.status === 'Active'}
                      onChange={(v) => setFormData({ ...formData, status: v ? 'Active' : 'Draft' })}
                      label={`Status: ${formData.status}`}
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#2d2418]/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl glass hover:bg-white/70 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-bloom-rose hover:bg-bloom-rose/80 text-sm font-bold text-white shadow-lg transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ─── CONFIRM DIALOGS ─── */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deleteTargetSlug)}
        title="Delete Product"
        message="Are you sure you want to delete this product from the catalog? This action will save to local storage."
        confirmText="Delete Product"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetSlug(null)}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Reset Product Catalog"
        message="Are you sure you want to reset all products back to the original static codebase state?"
        confirmText="Reset Catalog"
        danger
        onConfirm={handleResetCatalog}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </div>
  )
}
