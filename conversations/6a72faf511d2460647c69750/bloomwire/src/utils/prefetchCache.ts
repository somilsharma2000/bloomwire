import type { Product } from '../data/products'

// 1. Product Data Cache
const productCache = new Map<string, Product>()

export function prefetchProduct(product: Product) {
  if (!product || !product.slug) return
  if (!productCache.has(product.slug)) {
    productCache.set(product.slug, product)
  }
  // Preload product main image and gallery images
  if (product.image) {
    preloadImage(product.image)
  }
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => preloadImage(img))
  }
}

export function getPrefetchedProduct(slug: string): Product | undefined {
  return productCache.get(slug)
}

// 2. Image Preloader
const preloadedImages = new Set<string>()

export function preloadImage(src: string) {
  if (!src || preloadedImages.has(src)) return
  preloadedImages.add(src)
  const img = new Image()
  img.src = src
}

// 3. Route Component Loaders & Preloading
type RouteLoader = () => Promise<any>

const routeLoaders: Record<string, RouteLoader> = {
  '/': () => import('../pages/Home'),
  '/shop': () => import('../pages/Shop'),
  '/cart': () => import('../pages/Cart'),
  '/checkout': () => import('../pages/Checkout'),
  '/gallery': () => import('../pages/Gallery'),
  '/about': () => import('../pages/About'),
  '/faq': () => import('../pages/FAQ'),
  '/contact': () => import('../pages/Contact'),
  '/creators': () => import('../pages/Creators'),
  '/rewards': () => import('../pages/Rewards'),
  '/terms': () => import('../pages/Terms'),
}

const preloadedRoutes = new Set<string>()

export function prefetchRoute(path: string) {
  if (!path) return
  const cleanPath = path.split('?')[0].split('#')[0]
  if (preloadedRoutes.has(cleanPath)) return

  if (cleanPath.startsWith('/product/')) {
    if (!preloadedRoutes.has('/product')) {
      preloadedRoutes.add('/product')
      import('../pages/ProductDetail').catch(() => {})
    }
    return
  }

  const loader = routeLoaders[cleanPath]
  if (loader) {
    preloadedRoutes.add(cleanPath)
    loader().catch(() => {})
  }
}

export { routeLoaders }

// 4. Checkout Data Cache & Prefetching
export interface CheckoutPrefetchData {
  name: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  paymentMethod: string
}

let checkoutDataCache: Partial<CheckoutPrefetchData> | null = null

export function prefetchCheckoutData(user?: { name?: string; email?: string } | null) {
  let parsedSaved: Record<string, string> = {}
  try {
    const savedForm = localStorage.getItem('bloomwire_checkout_saved_form')
    if (savedForm) {
      parsedSaved = JSON.parse(savedForm)
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  checkoutDataCache = {
    name: user?.name || parsedSaved.name || '',
    email: user?.email || parsedSaved.email || '',
    address: parsedSaved.address || '',
    city: parsedSaved.city || 'Jaipur',
    state: parsedSaved.state || 'Rajasthan',
    pincode: parsedSaved.pincode || '560001',
    phone: parsedSaved.phone || '',
    paymentMethod: parsedSaved.paymentMethod || 'cod',
  }
}

export function getPrefetchedCheckoutData(): Partial<CheckoutPrefetchData> {
  if (!checkoutDataCache) {
    prefetchCheckoutData(null)
  }
  return checkoutDataCache || {}
}

export function saveCheckoutData(data: Partial<CheckoutPrefetchData>) {
  checkoutDataCache = { ...checkoutDataCache, ...data }
  try {
    localStorage.setItem('bloomwire_checkout_saved_form', JSON.stringify(data))
  } catch (e) {
    // Ignore localStorage errors
  }
}
