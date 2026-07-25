# BloomWire - Luxury Flower E-Commerce

**Where Luxury Blooms** 🌹

A premium handcrafted flower delivery platform for the Indian market, built with React, TypeScript, and Supabase.

## Brand: TACTILE BOTANICA

- **Tagline:** Where Luxury Blooms
- **Aesthetic:** Luxury botanical, tactile, earthy elegance
- **Colors:** Sienna, Sage, Obsidian, Linen
- **Feel:** Premium, handcrafted, artisanal

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Update with your Supabase and Razorpay credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Backend:** Supabase (PostgreSQL)
- **Payments:** Razorpay
- **Emails:** Resend
- **Icons:** Lucide React

## Features

### 📱 Shopping
- Browse flowers by category & occasion
- Advanced filtering and search
- Product reviews and ratings
- Persistent shopping cart
- Coupon code system
- Spin wheel discount game

### 🎁 Personalization
- Gift messages (free)
- Ribbon color selection
- Premium gift wrapping (+₹49)
- Customizable arrangements

### 💳 Payments
- Razorpay integration (cards, UPI, net banking)
- INR currency only
- Free delivery above ₹499
- Order tracking

### 👑 Loyalty (Pettles Program)
- Earn points on purchases
- Bonus points for reviews, photos, stories
- 4 tier system: Seed → Sprout → Bloom → Garden
- Redeem points for discounts

### 📸 Community
- Customer photo uploads
- Customer testimonials
- Instagram creator partnership
- Story sharing

### 🏢 B2B
- Wholesale program
- Minimum 100 units
- Bulk pricing
- Business inquiries

### 👨‍💼 Admin Panel
- Order management
- Product management
- Coupon tracking by creator
- Content moderation
- Sales analytics
- Password protected

## Database Schema

### Core Tables
- `orders` - Customer orders with full details
- `products` - Product catalog (if using dynamic data)
- `coupons` - Discount codes with creator tracking
- `reviews` - Product reviews with approval status
- `customer_photos` - Photo wall uploads
- `customer_stories` - Customer testimonials
- `loyalty_points` - Points ledger per customer
- `instagram_claims` - Instagram discount claims
- `wholesale_inquiries` - B2B inquiries
- `contact_submissions` - Contact form entries
- `newsletter_subscribers` - Email list

## Pages

### Public
- **Home** - Hero, shop by occasion/category, featured products, testimonials, newsletter
- **Shop** - Browse, filter, sort, search products
- **Product Detail** - Images, personalization options, reviews, related products
- **Cart** - Line items, checkout, coupon codes, spin wheel
- **Checkout** - Address, payment, order confirmation
- **About** - Brand story, values, mission
- **FAQ** - Accordion Q&A
- **Policies** - Shipping, Privacy, Terms, Refund
- **Wholesale** - B2B inquiry form
- **Contact** - Contact form with business info
- **Creator** - Instagram partnership program
- **Rewards** - Pettles loyalty program details

### Protected
- **Admin** - Password-protected dashboard with full CRUD

## Policies

- **No returns** - Fresh flowers are perishable
- **Humorous cancellation policy** - "Only if you have a breakup with your partner"
- **Freshness guarantee** - All flowers guaranteed fresh
- **24/7 availability** - Always open

## Contact

📧 **Email:** bloomwire2000@gmail.com
📍 **Address:** JAGDAMBA NAGAR, JAIPUR
⏰ **Hours:** 24/7
💳 **Currency:** INR (₹) only

## Getting Started for Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase database with provided schema
4. Configure environment variables
5. Run dev server: `npm run dev`
6. Admin panel at `/admin` (default password: admin123)

## License

Proprietory - TACTILE BOTANICA
