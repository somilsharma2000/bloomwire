export interface Product {
  slug: string
  name: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  description: string
  longDescription: string
  image: string
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  sku: string
  tags: string[]
  featured: boolean
  badges: string[]
  petalsEarned: number
}

const IMG_BASE = 'https://media.base44.com/images/public/6a72faf2ba70adb989a373b9/'

export const HERO_IMAGES = {
  flatLay: `${IMG_BASE}ff37ec194_generated_image.png`,
  crafting: `${IMG_BASE}4c4703c8e_generated_image.png`,
  homeDecor: `${IMG_BASE}904fab912_generated_image.png`,
  workspace: `${IMG_BASE}dc81e8f7d_generated_image.png`,
  giftWrap: `${IMG_BASE}c7c2a4433_generated_image.png`,
  shelves: `${IMG_BASE}546e370a4_generated_image.png`,
}

export interface CategoryItem {
  id: string
  name: string
  iconName: string
  description: string
  count?: number
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'bouquets',
    name: 'Bouquets',
    iconName: 'FlowerIcon',
    description: 'Hand-crafted multi-stem arrangements that resistant to fading and stay plush for years with proper care.',
    count: 4,
  },
  {
    id: 'potted-decor',
    name: 'Potted Decor',
    iconName: 'PlantIcon',
    description: 'Charming mini plush blooms set in aesthetic clay and ceramic pots for desk & room accents.',
    count: 2,
  },
  {
    id: 'keychains',
    name: 'Keychains',
    iconName: 'KeyIcon',
    description: 'Miniature fuzzy flower charms for bags, keys, and accessories.',
    count: 2,
  },
  {
    id: 'single-flowers',
    name: 'Single Flowers',
    iconName: 'SparkleIcon',
    description: 'Individual statement stems to customize your own bouquet or gift as token of love.',
    count: 2,
  },
  {
    id: 'gift-bundles',
    name: 'Gift Bundles',
    iconName: 'GiftIcon',
    description: 'Curated gift boxes complete with fairy lights, custom card, and ribbon gift wrapping.',
    count: 2,
  },
  {
    id: 'diy-kits',
    name: 'DIY Kits',
    iconName: 'ScissorsIcon',
    description: 'All-inclusive pipe cleaner crafting kits with step-by-step video guides and floral wire.',
    count: 2,
  },
]

// categories moved after products definition (TDZ fix)

export const freeKeychain: Product = {
  slug: 'complimentary-keychain',
  name: 'Bonus Bloom Keychain',
  price: 0,
  originalPrice: 199,
  category: 'Keychains',
  subcategory: 'Reward Items',
  description: 'Exclusive reward keychain charm claimed with Petals.',
  longDescription: 'Handcrafted pipe cleaner charm with vibrant plush petals and durable metal alloy ring. Lightweight and durable for bags, keys, and backpacks.',
  image: `${IMG_BASE}af6ed7668_generated_image.png`,
  images: [`${IMG_BASE}af6ed7668_generated_image.png`],
  rating: 0,
  reviewCount: 0,
  stock: 50,
  sku: 'RWD-KEY-01',
  tags: ['Reward', 'Keychain', 'Accessory'],
  featured: false,
  badges: ['Petals Special'],
  petalsEarned: 0,
}

export const freeFlower: Product = {
  slug: 'complimentary-flower-stem',
  name: 'Bonus Long-Lasting Stem',
  price: 0,
  originalPrice: 299,
  category: 'Single Flowers',
  subcategory: 'Reward Items',
  description: 'Exclusive single flower reward stem claimed with Petals.',
  longDescription: 'Hand-shaped velvet pipe cleaner single bloom stem with flexible green wire core and rich color gradient. Resistant to wilting, retains shape with proper care.',
  image: `${IMG_BASE}4c2c8d86b_generated_image.png`,
  images: [`${IMG_BASE}4c2c8d86b_generated_image.png`],
  rating: 0,
  reviewCount: 0,
  stock: 30,
  sku: 'RWD-FLW-01',
  tags: ['Reward', 'Single Flower'],
  featured: false,
  badges: ['Petals Special'],
  petalsEarned: 0,
}

export const freePot: Product = {
  slug: 'complimentary-clay-pot',
  name: 'Bonus Ceramic Daisy Pot',
  price: 0,
  originalPrice: 499,
  category: 'Potted Decor',
  subcategory: 'Reward Items',
  description: 'Exclusive potted decor reward claimed with Petals.',
  longDescription: 'Adorable desk companion featuring plush handcrafted white daisies nestled in a mini ceramic pot filled with faux moss.',
  image: `${IMG_BASE}973bd399e_generated_image.png`,
  images: [`${IMG_BASE}973bd399e_generated_image.png`],
  rating: 0,
  reviewCount: 0,
  stock: 20,
  sku: 'RWD-POT-01',
  tags: ['Reward', 'Potted Decor'],
  featured: false,
  badges: ['Petals Special'],
  petalsEarned: 0,
}

export const REWARD_PRODUCTS = {
  freeKeychain,
  freeFlower,
  freePot,
}

export const rewardProducts = [freeKeychain, freeFlower, freePot]

export const products: Product[] = [
  // Bouquets (4)
  {
    slug: 'velvet-sunset-rose-bouquet',
    name: 'Velvet Sunset Rose Bouquet',
    price: 1299,
    originalPrice: 1599,
    category: 'Bouquets',
    subcategory: 'Arrangements',
    description: 'Handcrafted gradient roses in warm sunset hues with soft velvet wire finish.',
    longDescription: 'An exquisite arrangement of 7 handcrafted pipe cleaner roses featuring deep wine red, blush pink, and warm terracotta gradients. Wrapped in translucent matte tissue with a satin bow, perfect for romantic surprises and anniversaries.',
    image: `${IMG_BASE}5ebab43fd_generated_image.png`,
    images: [
      `${IMG_BASE}5ebab43fd_generated_image.png`,
      `${IMG_BASE}ff37ec194_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 25,
    sku: 'BOU-SUN-01',
    tags: ['Bestseller', 'Roses', 'Romantic', 'Handmade'],
    featured: true,
    badges: ['Bestseller', 'Popular'],
    petalsEarned: 65,
  },
  {
    slug: 'pastel-tulip-dream-bouquet',
    name: 'Pastel Tulip Dream Bouquet',
    price: 1099,
    originalPrice: 1399,
    category: 'Bouquets',
    subcategory: 'Arrangements',
    description: 'Charming blend of pastel pink, soft lavender, and cream plush tulips.',
    longDescription: 'Inspired by spring cottage gardens, this 9-stem tulip bouquet features ultra-soft chenille stem craftsmanship. Stem wires are fully bendable, allowing you to re-arrange stems inside any vase.',
    image: `${IMG_BASE}d189b46d8_generated_image.png`,
    images: [
      `${IMG_BASE}d189b46d8_generated_image.png`,
      `${IMG_BASE}c7c2a4433_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 18,
    sku: 'BOU-TUL-02',
    tags: ['Tulips', 'Pastel', 'Spring', 'Soft'],
    featured: true,
    badges: ['Trending'],
    petalsEarned: 55,
  },
  {
    slug: 'midnight-lavender-mist-bouquet',
    name: 'Midnight Lavender Mist Bouquet',
    price: 1499,
    originalPrice: 1799,
    category: 'Bouquets',
    subcategory: 'Arrangements',
    description: 'Deep violet roses paired with delicate lavender sprigs and eucalyptus accents.',
    longDescription: 'A moody Gen-Z aesthetic bouquet crafted with rich violet, electric magenta, and deep indigo chenille wires. Comes in premium dark gift wrapping complete with fairy light string attachment.',
    image: `${IMG_BASE}fab763177_generated_image.png`,
    images: [
      `${IMG_BASE}fab763177_generated_image.png`,
      `${IMG_BASE}dc81e8f7d_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 12,
    sku: 'BOU-LAV-03',
    tags: ['Gen Z Favorite', 'Lavender', 'Moody', 'Glow'],
    featured: true,
    badges: ['Staff Pick', 'Limited'],
    petalsEarned: 75,
  },
  {
    slug: 'ethereal-sunflower-medley-bouquet',
    name: 'Ethereal Sunflower Medley',
    price: 1199,
    originalPrice: 1499,
    category: 'Bouquets',
    subcategory: 'Arrangements',
    description: 'Radiant golden sunflowers surrounded by white daisies and baby bloom stems.',
    longDescription: 'Bring instant sunshine into any room with 3 large golden chenille sunflowers surrounded by plush white daisies and lush green leaf fillers. Designed to last for years without shedding or fading with proper care.',
    image: `${IMG_BASE}d6002713c_generated_image.png`,
    images: [
      `${IMG_BASE}d6002713c_generated_image.png`,
      `${IMG_BASE}904fab912_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 20,
    sku: 'BOU-SUNFL-04',
    tags: ['Sunflowers', 'Bright', 'Cheerful', 'Gift'],
    featured: false,
    badges: ['Top Gift'],
    petalsEarned: 60,
  },

  // Potted Decor (2)
  {
    slug: 'cozy-daisy-clay-pot',
    name: 'Cozy Daisy Clay Pot',
    price: 799,
    originalPrice: 999,
    category: 'Potted Decor',
    subcategory: 'Desktop Plants',
    description: 'Aesthetic terracotta pot with handcrafted plush white and gold daisies.',
    longDescription: 'Perfect for desk aesthetics and nightstand decor! Features 5 plush hand-twisted daisy blooms set inside an authentic terracotta mini pot filled with earthy faux moss base.',
    image: `${IMG_BASE}973bd399e_generated_image.png`,
    images: [
      `${IMG_BASE}973bd399e_generated_image.png`,
      `${IMG_BASE}546e370a4_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 35,
    sku: 'POT-DAI-01',
    tags: ['Desk Decor', 'Daisies', 'Terracotta', 'Cute'],
    featured: true,
    badges: ['Hot Seller'],
    petalsEarned: 40,
  },
  {
    slug: 'mini-succulent-bloom-pot',
    name: 'Mini Succulent & Bloom Pot',
    price: 699,
    originalPrice: 899,
    category: 'Potted Decor',
    subcategory: 'Desktop Plants',
    description: 'Cute fuzzy pipe cleaner succulent trio with vibrant pink bloom accents.',
    longDescription: 'Zero watering needed! Three distinct chenille succulent shapes with soft plush gradient tips, potted in a smooth ceramic container. Ideal workspace pick-me-up.',
    image: `${IMG_BASE}b576dc7d1_generated_image.png`,
    images: [
      `${IMG_BASE}b576dc7d1_generated_image.png`,
      `${IMG_BASE}dc81e8f7d_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 40,
    sku: 'POT-SUC-02',
    tags: ['Succulent', 'Desk Accents', 'Minimalist'],
    featured: false,
    badges: ['Low Maintenance'],
    petalsEarned: 35,
  },

  // Keychains (2)
  {
    slug: 'bloom-charm-keychain-cherry',
    name: 'Bloom Charm Keychain - Cherry',
    price: 299,
    originalPrice: 399,
    category: 'Keychains',
    subcategory: 'Bag Charms',
    description: 'Fuzzy double cherry and blossom charm with golden spring ring.',
    longDescription: 'Level up your tote bag, backpack, or keys! Hand-twisted twin cherry plush charm crafted with high-density velvet chenille wire and sturdy metal keyring clip.',
    image: `${IMG_BASE}af6ed7668_generated_image.png`,
    images: [
      `${IMG_BASE}af6ed7668_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 60,
    sku: 'KEY-CHR-01',
    tags: ['Bag Charm', 'Cherry', 'Gen Z', 'Accessory'],
    featured: true,
    badges: ['Trending'],
    petalsEarned: 15,
  },
  {
    slug: 'petal-sparkle-keychain-daisy',
    name: 'Petal Sparkle Keychain - Daisy',
    price: 249,
    originalPrice: 349,
    category: 'Keychains',
    subcategory: 'Bag Charms',
    description: 'Miniature white and yellow daisy charm with bead tassel.',
    longDescription: 'A delicate 3-inch daisy charm featuring fuzzy petals, pastel glass accent bead, and durable brass clasp. Light, durable, and super cute.',
    image: `${IMG_BASE}92148c843_generated_image.png`,
    images: [
      `${IMG_BASE}92148c843_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 45,
    sku: 'KEY-DAI-02',
    tags: ['Daisy', 'Keychain', 'Gift Idea'],
    featured: false,
    badges: ['Budget Friendly'],
    petalsEarned: 12,
  },

  // Single Flowers (2)
  {
    slug: 'long-lasting-red-rose-stem',
    name: 'Long-Lasting Red Rose Stem',
    price: 399,
    originalPrice: 499,
    category: 'Single Flowers',
    subcategory: 'Single Stems',
    description: 'Single classic red rose stem made with ultra-soft plush chenille.',
    longDescription: 'A single timeless red rose stem that will never wilt. Hand-curled velvet petal layering with realistic wire leaf detail and flexible stem.',
    image: `${IMG_BASE}4c2c8d86b_generated_image.png`,
    images: [
      `${IMG_BASE}4c2c8d86b_generated_image.png`,
      `${IMG_BASE}ff37ec194_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 50,
    sku: 'STM-ROS-01',
    tags: ['Rose', 'Single Stem', 'Classic', 'Red'],
    featured: false,
    badges: ['Classic'],
    petalsEarned: 20,
  },
  {
    slug: 'soft-pink-peony-stem',
    name: 'Soft Pink Peony Stem',
    price: 349,
    originalPrice: 449,
    category: 'Single Flowers',
    subcategory: 'Single Stems',
    description: 'Voluminous multi-layered pink peony bloom with realistic stem.',
    longDescription: 'Features over 20 hand-shaped chenille petals assembled into a lush, fluffy peony bloom in baby pink gradient.',
    image: `${IMG_BASE}1e90ba954_generated_image.png`,
    images: [
      `${IMG_BASE}1e90ba954_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 30,
    sku: 'STM-PEO-02',
    tags: ['Peony', 'Pink', 'Soft', 'Custom Bouquet'],
    featured: false,
    badges: ['Customer Favorite'],
    petalsEarned: 17,
  },

  // Gift Bundles (2)
  {
    slug: 'ultimate-bloom-gift-box',
    name: 'Ultimate Bloom Gift Box',
    price: 2199,
    originalPrice: 2699,
    category: 'Gift Bundles',
    subcategory: 'Deluxe Bundles',
    description: 'Full bouquet + potted mini bloom + cherry keychain in fairy light gift box.',
    longDescription: 'The ultimate gift for someone special! Includes 1 Velvet Sunset Rose Bouquet, 1 Cozy Daisy Clay Pot, 1 Cherry Bloom Keychain, warm LED string lights, and a handwritten floral gift card in a luxury magnetic gift box.',
    image: `${IMG_BASE}7ece90627_generated_image.png`,
    images: [
      `${IMG_BASE}7ece90627_generated_image.png`,
      `${IMG_BASE}c7c2a4433_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 15,
    sku: 'BND-ULT-01',
    tags: ['Gift Set', 'Fairy Lights', 'Luxury Box', 'Best Value'],
    featured: true,
    badges: ['Ultimate Gift', 'Top Rated'],
    petalsEarned: 110,
  },
  {
    slug: 'romantic-velvet-couple-bundle',
    name: 'Romantic Velvet Couple Bundle',
    price: 1899,
    originalPrice: 2299,
    category: 'Gift Bundles',
    subcategory: 'Deluxe Bundles',
    description: 'Pair of matching red and pink rose bouquets with photo clip stand.',
    longDescription: 'Designed for couples and anniversaries. Includes two complementary hand-crafted rose arrangements and a custom wooden photo holder frame.',
    image: `${IMG_BASE}5adb36cd1_generated_image.png`,
    images: [
      `${IMG_BASE}5adb36cd1_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 18,
    sku: 'BND-CPL-02',
    tags: ['Couples', 'Anniversary', 'Gift Box'],
    featured: false,
    badges: ['Romantic Choice'],
    petalsEarned: 95,
  },

  // DIY Kits (2)
  {
    slug: 'starter-flower-craft-kit',
    name: 'Starter Flower Craft Kit',
    price: 899,
    originalPrice: 1199,
    category: 'DIY Kits',
    subcategory: 'Craft Kits',
    description: '100 premium pipe cleaners, floral wire, tape, and step-by-step video guide.',
    longDescription: 'Unleash your inner artist! Includes 100 extra-fluffy chenille stems in 10 pastel colors, floral tape, stem wires, hot glue stick, and QR code access to 5 step-by-step video tutorials.',
    image: `${IMG_BASE}0e0327f62_generated_image.png`,
    images: [
      `${IMG_BASE}0e0327f62_generated_image.png`,
      `${IMG_BASE}4c4703c8e_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 30,
    sku: 'KIT-STR-01',
    tags: ['DIY', 'Craft', 'Tutorials', 'Creative'],
    featured: true,
    badges: ['Fun DIY'],
    petalsEarned: 45,
  },
  {
    slug: 'master-artisan-bouquet-diy-box',
    name: 'Master Artisan Bouquet DIY Box',
    price: 1299,
    originalPrice: 1599,
    category: 'DIY Kits',
    subcategory: 'Craft Kits',
    description: '250 pipe cleaners, wrapping paper, ribbons, and masterclass course access.',
    longDescription: 'Everything needed to build 3 complete full-sized flower bouquets from scratch! Contains 250 high-density pipe cleaners, wrapping sheets, floral wire cutter, satin ribbons, and masterclass access.',
    image: `${IMG_BASE}5bd38c25e_generated_image.png`,
    images: [
      `${IMG_BASE}5bd38c25e_generated_image.png`,
      `${IMG_BASE}4c4703c8e_generated_image.png`,
    ],
    rating: 0,
    reviewCount: 0,
    stock: 22,
    sku: 'KIT-MST-02',
    tags: ['Pro Craft', 'Masterclass', 'DIY Bouquet'],
    featured: false,
    badges: ['Complete Box'],
    petalsEarned: 65,
  },
]


// Moved here to avoid temporal dead zone — must be after products
export const categories = CATEGORIES.map(cat => ({
  ...cat,
  count: products.filter(p => p.category === cat.name && p.price > 0).length
}))
