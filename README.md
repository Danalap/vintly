# Vintly - Secondhand Fashion Marketplace

A peer-to-peer marketplace for buying and selling pre-owned clothing, built with Next.js, Tailwind CSS, and Supabase.

![Vintly Preview](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop)

## Features

- 🛍️ **Browse & Discover** - Filter by size, price, brand, and condition
- 💰 **Sell Your Style** - List items with up to 8 photos
- 🔒 **Secure Transactions** - Stripe-powered payments with buyer protection
- ⭐ **Trust & Safety** - Seller ratings and reviews
- 📱 **Mobile-First** - Responsive design for all devices

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **Payments:** Stripe Connect (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   cd "seconf hand"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to the SQL Editor and run the schema from `supabase/schema.sql`
   - Create storage buckets: `avatars` and `products`

4. **Configure environment variables:**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Database Schema

The Supabase schema includes:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles extending Supabase Auth |
| `products` | Clothing listings with attributes |
| `images` | Product photos (up to 8 per item) |
| `orders` | Transaction records |
| `reviews` | Buyer reviews for sellers |
| `product_likes` | Saved/favorited items |
| `seller_follows` | Follow relationships |

All tables include Row Level Security (RLS) policies for data protection.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles + Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page with product grid
├── supabase/
│   └── schema.sql       # Database schema
├── tailwind.config.ts   # Tailwind configuration
└── package.json
```

## Next Steps

- [ ] Implement Supabase authentication
- [ ] Build product detail pages
- [ ] Add listing creation flow
- [ ] Integrate Stripe Connect for payments
- [ ] Add in-app messaging
- [ ] Implement search functionality

## License

MIT


