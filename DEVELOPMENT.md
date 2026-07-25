# BloomWire - Development Guide

## Project Structure

```
bloomwire/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── context/
│   │   └── CartContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── WholesalePage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── PolicyPage.tsx
│   │   ├── CreatorPage.tsx
│   │   ├── RewardsPage.tsx
│   │   └── AdminPanel.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
├── .env.example
└── README.md
```

## Key Components

### Context: CartContext
- Manages shopping cart state
- Persists cart to localStorage
- Provides methods: addItem, removeItem, updateQuantity, clearCart

### Layout: Navbar & Footer
- Sticky navbar with cart count
- Links to all pages
- Mobile-responsive hamburger menu
- Footer with quick links and contact info

### Pages
Each page is a full-featured component with:
- Form validation
- Loading states
- Toast notifications (alerts for MVP)
- Responsive design
- Tailwind styling with brand colors

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_RESEND_API_KEY=your-resend-key
VITE_ADMIN_PASSWORD=your-admin-password
```

## Tailwind Color System

```css
--sienna: #A0522D (primary, warm brown)
--sage: #9CAF88 (accent, soft green)
--obsidian: #0F0F0F (dark text)
--linen: #F8F6F1 (background, cream)
--accent: #D4A574 (gold accent)
```

## Styling Classes

```tsx
// Buttons
.btn-tactile        // Primary button with shadow
.btn-tactile-outline // Outline button

// Forms
.form-input        // Standard form input

// Animations
.scroll-reveal     // Fade in on scroll
.animate-fade-in   // Fade animation
```

## API Integration Notes

### Supabase
- All form submissions insert into respective tables
- Admin can view/manage all data
- Real-time updates for orders and reviews

### Razorpay (TODO)
- Initialize payment on checkout
- Handle success/failure callbacks
- Store payment details securely

### Resend (TODO)
- Send order confirmation emails
- Send shipping updates
- Send newsletter emails
- Welcome emails for new subscribers

## Admin Panel

**URL:** `/admin`
**Default Password:** `admin123` (change via env)

**Features:**
- Dashboard with KPIs
- Order management
- Product CRUD
- Coupon management with creator tracking
- Review/photo/story approval queues
- Sales analytics
- Customer insights

## Next Steps / TODOs

1. **Connect to real Supabase database**
   - Set up tables with provided schema
   - Enable RLS policies
   - Set up realtime subscriptions

2. **Implement payment processing**
   - Initialize Razorpay
   - Handle payment callbacks
   - Store transaction data

3. **Email notifications**
   - Set up Resend templates
   - Send confirmations and updates
   - Newsletter functionality

4. **Product images**
   - Store in Supabase storage
   - Implement image optimization
   - Lazy loading

5. **Advanced features**
   - Search algorithms (Supabase full-text search)
   - Email verification
   - SMS notifications (Twilio)
   - Live chat support

6. **Performance**
   - Image optimization
   - Code splitting
   - Caching strategies
   - Analytics (Vercel Analytics)

7. **SEO**
   - Meta tags
   - Sitemap
   - Structured data
   - Open Graph tags

## Brand Guidelines

### Typography
- **Headings:** Playfair Display (serif, elegant)
- **Body:** Inter (sans-serif, clean)

### Color Palette
- Primary: Sienna (#A0522D) - warm, luxury
- Secondary: Sage (#9CAF88) - nature, calm
- Text: Obsidian (#0F0F0F) - high contrast
- Background: Linen (#F8F6F1) - cream, warm

### Voice & Tone
- Premium and luxurious
- Warm and approachable
- Humorous (see "breakup" policy)
- Artisan and handcrafted feel

### Emoji Usage
- 🌹 Flowers
- 💐 Arrangements
- 💝 Gifts
- ✨ Luxury/special
- 🎁 Offers/rewards

## Support

For questions or bugs, reach out to the dev team or create an issue in the repo.
