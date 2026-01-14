# Vintly - Functionality Specification

> **Haute Couture Resale Marketplace**
> A curated peer-to-peer (P2P) marketplace for buying and selling pre-owned haute couture and luxury designer fashion.

---

## 1. Overview

### Vision
Connect discerning collectors with rare, authenticated designer garments from the world's most prestigious fashion houses (Chanel, Dior, Hermès, Valentino, etc.).

### Target Platform
- Web (Desktop & Mobile responsive)
- Mobile-first design approach

### Target Market
- High-end designer fashion
- Price range: $500 - $50,000+
- Focus on authentication and trust

---

## 2. User Roles

### 2.1 Buyer (Collector)
Users who browse and purchase luxury items.

**Capabilities:**
- Browse collection without account
- Create account to purchase
- Save/favorite items
- Filter and search products
- Contact sellers via messaging
- Purchase items (delivery or pickup)
- Track orders
- Leave reviews after purchase
- Follow sellers

### 2.2 Seller (Consigner)
Users who list and sell their luxury items.

**Capabilities:**
- Create listings with up to 8 photos
- Use AI photo enhancement
- Set pricing (platform takes 10% fee)
- Choose fulfillment methods (shipping/pickup)
- Manage listings (active, sold, archived)
- Respond to buyer inquiries
- Track sales and earnings
- Receive payouts via Stripe Connect

### 2.3 Admin
Platform administrators.

**Capabilities:**
- Manage all listings
- Authenticate items
- Manage users
- Handle disputes
- View analytics

---

## 3. Core Features

### 3.1 Homepage

| Feature | Description |
|---------|-------------|
| Hero Section | Brand messaging, CTA buttons for browsing and selling |
| Featured Collection | Curated product grid |
| Quick Filters | Size, color, brand, price range |
| Mobile Filter Modal | Full-screen filter interface on mobile |
| Product Cards | Image, title, price, brand, size, condition badge, like button |
| Statistics | Number of pieces, authentication rate, fashion houses |

### 3.2 Browse/Discovery Page

| Feature | Description |
|---------|-------------|
| Search Bar | Keyword search across title, brand, description |
| Category Filter | All, Handbags, Dresses, Outerwear, Tops, Shoes, Jewelry, Accessories |
| Designer Filter | Multi-select designer brands |
| Size Filter | XXS, XS, S, M, L, XL, XXL, XXXL, One Size |
| Color Filter | Visual color swatches with labels |
| Condition Filter | New with Tags, Like New, Excellent, Good |
| Price Range Filter | Preset ranges + custom slider |
| Sort Options | Newest, Price Low-High, Price High-Low, Most Popular |
| Results Count | Dynamic count of filtered results |
| Grid Layout | 2-4 columns responsive grid |

### 3.3 Product Detail Page

| Feature | Description |
|---------|-------------|
| Image Gallery | Main image + thumbnails, navigation arrows, zoom |
| Product Info | Title, brand, price, size, color, category, condition |
| Description | Full item description with details |
| Condition Badge | Visual indicator of item condition |
| Authentication Badge | Verified/authenticated status |
| Acquire Now Button | Opens checkout flow |
| Contact Seller Button | Opens chat interface |
| Save/Favorite Button | Add to favorites |
| Share Button | Share product link |
| Seller Card | Avatar, name, rating, "View Profile" button |
| Trust Signals | Authenticated, Insured Shipping, Easy Returns icons |
| Likes Count | Number of users who saved this item |

### 3.4 Seller Profile Modal

| Feature | Description |
|---------|-------------|
| Profile Header | Avatar, name, verified badge, location, member since |
| Statistics | Total sales, rating, response time |
| Bio | Seller description |
| Listings Tab | Grid of seller's active listings |
| Reviews Tab | List of buyer reviews with ratings |

### 3.5 Chat/Messaging

| Feature | Description |
|---------|-------------|
| Chat Panel | Slide-in panel from right |
| Seller Info | Avatar, name, response time indicator |
| Product Context | Shows the product being discussed |
| Message Thread | Timestamped messages with sender indication |
| Quick Replies | Pre-defined common questions |
| Image Sharing | Ability to share additional photos |
| Real-time Updates | Live message delivery |

### 3.6 Checkout Flow

| Step | Features |
|------|----------|
| **1. Shipping Method** | Choose between Insured Delivery ($45) or Local Pickup (Free) |
| **2. Shipping Details** | Full address form (name, address, city, state, zip, country) |
| **3. Payment** | Order summary, payment method selection, card details |
| **4. Confirmation** | Order number, confirmation message, next steps |

**Additional Checkout Features:**
- Order summary with breakdown (item, shipping, insurance)
- Trust badges (Authenticated, Secure Payment)
- Edit capability for shipping details
- Progress indicator

### 3.7 Sell/Listing Creation

| Step | Features |
|------|----------|
| **1. Photos** | Upload up to 8 photos, drag to reorder, AI enhancement option |
| **2. Details** | Title (150 char), description, category, designer, size, color |
| **3. Condition** | Select condition with descriptions |
| **4. Pricing** | Set price, view earnings after fee, select shipping size |
| **5. Shipping** | Enable pickup/delivery, set pickup location, free shipping option |
| **6. Review** | Preview listing, checklist of completed fields |

**AI Photo Enhancement:**
- One-click enhancement
- Side-by-side comparison (original vs enhanced)
- Accept or revert option
- Batch enhancement for all photos

### 3.8 Seller Dashboard

| Feature | Description |
|---------|-------------|
| Listings Management | View active, sold, draft, archived listings |
| Messages Inbox | Conversations with buyers, unread count |
| Sales Overview | Total sales, earnings, pending payouts |
| Edit Listings | Modify existing listings |
| Delete Listings | Remove listings with confirmation |

### 3.9 Favorites/Saved Items

| Feature | Description |
|---------|-------------|
| Favorites List | Grid of saved items |
| Quick Remove | Remove from favorites |
| Price Alerts | Notify when price drops (planned) |
| Availability Status | Show if item is sold |

### 3.10 User Authentication

| Feature | Description |
|---------|-------------|
| Sign Up | Email/password registration |
| Sign In | Email/password login |
| OAuth | Social login (Google, Apple) - planned |
| Password Reset | Email-based password recovery |
| Email Verification | Confirm email address |
| Profile Setup | Username, bio, avatar upload |

### 3.11 User Profile

| Feature | Description |
|---------|-------------|
| Profile Info | Username, bio, avatar, location |
| Seller Status | Enable/disable seller mode |
| Rating & Reviews | Display buyer reviews |
| Verification Badge | Identity verification status |
| Stripe Connect | Payment account setup |

---

## 4. Product Data Model

### 4.1 Product Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| seller_id | UUID | Reference to seller |
| title | String (150) | Product title |
| description | Text | Full description |
| price | Decimal | Listed price |
| category | Enum | Product category |
| size | Enum | Size (XXS to XXXL, One Size) |
| condition | Enum | Condition rating |
| brand | String | Designer/brand name |
| color | String | Primary color |
| status | Enum | draft, available, sold, archived |
| shipping_weight | Enum | small, medium, large |
| views_count | Integer | Number of views |
| likes_count | Integer | Number of favorites |
| created_at | Timestamp | Listing creation date |
| updated_at | Timestamp | Last modification date |

### 4.2 Categories

- Gowns
- Dresses
- Suits & Tailoring
- Outerwear
- Handbags
- Shoes
- Fine Jewelry
- Watches
- Accessories
- Tops & Blouses

### 4.3 Conditions

| Value | Label | Description |
|-------|-------|-------------|
| new_with_tags | New with Tags | Unworn, original tags and packaging intact |
| like_new | Pristine | Worn once or twice, flawless condition |
| good | Excellent | Gently worn, professionally maintained |
| fair | Good | Visible wear, well-preserved |

### 4.4 Featured Designers

- Chanel
- Dior
- Hermès
- Valentino
- Christian Louboutin
- Gucci
- Balmain
- Givenchy
- Saint Laurent
- Oscar de la Renta
- Prada
- Versace

---

## 5. Order/Transaction Flow

### 5.1 Order Lifecycle

```
1. Buyer initiates purchase
2. Select shipping method (delivery/pickup)
3. Enter shipping details (if delivery)
4. Enter payment information
5. Payment processed (Stripe)
6. Order created (status: pending)
7. Seller notified
8. Payment confirmed (status: paid)
9. Item marked as sold
10. Seller ships item (status: shipped)
11. Buyer receives item (status: delivered)
12. Buyer can leave review
13. Seller payout released
```

### 5.2 Order Statuses

| Status | Description |
|--------|-------------|
| pending | Order created, awaiting payment |
| paid | Payment confirmed |
| shipped | Item shipped, tracking provided |
| delivered | Item delivered to buyer |
| cancelled | Order cancelled |
| refunded | Payment refunded |

### 5.3 Pricing Breakdown

| Component | Description |
|-----------|-------------|
| Item Price | Seller's listed price |
| Shipping Cost | $0 (pickup) or $45 (white-glove delivery) |
| Insurance | $25 authentication & insurance fee |
| Platform Fee | 10% of item price (deducted from seller earnings) |

---

## 6. Messaging System

### 6.1 Conversation Model

| Field | Description |
|-------|-------------|
| id | Unique conversation ID |
| product_id | Related product |
| seller_id | Seller user ID |
| buyer_id | Buyer user ID |
| last_message | Preview of last message |
| last_message_time | Timestamp of last message |
| unread_count | Unread messages for seller |

### 6.2 Message Model

| Field | Description |
|-------|-------------|
| id | Unique message ID |
| conversation_id | Parent conversation |
| sender_id | Message sender |
| content | Message text |
| timestamp | Send time |
| read | Read status |

---

## 7. Review System

### 7.1 Review Model

| Field | Description |
|-------|-------------|
| id | Unique review ID |
| order_id | Related order |
| reviewer_id | Buyer who left review |
| seller_id | Seller being reviewed |
| rating | 1-5 stars |
| comment | Review text |
| created_at | Review date |

### 7.2 Rating Calculation

- Seller rating = Average of all review ratings
- Rating count = Total number of reviews
- Displayed as X.X out of 5 stars

---

## 8. Favorites/Likes System

### 8.1 Favorite Model

| Field | Description |
|-------|-------------|
| user_id | User who favorited |
| product_id | Favorited product |
| created_at | When favorited |

### 8.2 Features

- Toggle favorite on/off
- View all favorites in one place
- Remove favorites
- Favorites persist across sessions
- Product cards show filled heart if favorited

---

## 9. Seller Follows System

### 9.1 Follow Model

| Field | Description |
|-------|-------------|
| follower_id | User who is following |
| seller_id | Seller being followed |
| created_at | When followed |

### 9.2 Features (Planned)

- Follow/unfollow sellers
- View followed sellers
- Notifications when followed sellers list new items

---

## 10. Authentication Features

### 10.1 Account Features

| Feature | Description |
|---------|-------------|
| Stripe Connect | Seller payment account |
| Identity Verification | KYC for sellers |
| Email Verification | Confirm email ownership |
| Verification Badge | Displayed on verified sellers |

### 10.2 Trust Signals

- Verified Seller badge
- Authentication certificate per item
- Provenance documentation
- Secure payment processing
- Buyer protection guarantee

---

## 11. Admin Features

### 11.1 Dashboard

| Feature | Description |
|---------|-------------|
| Listings Management | View, approve, reject, remove listings |
| User Management | View, suspend, ban users |
| Authentication Queue | Items pending authentication |
| Order Management | View, manage orders |
| Analytics | Sales, users, listings metrics |

### 11.2 Authentication Workflow (Planned)

1. Seller submits item
2. Item enters authentication queue
3. Expert reviews photos and details
4. Item approved/rejected
5. If approved, listing goes live
6. Authentication certificate generated

---

## 12. Notifications (Planned)

### 12.1 Notification Types

| Type | Trigger |
|------|---------|
| New Message | Buyer sends message |
| New Order | Buyer purchases item |
| Order Shipped | Seller ships item |
| Order Delivered | Item delivered |
| New Review | Buyer leaves review |
| Price Drop | Favorited item price reduced |
| New Listing | Followed seller lists item |
| Item Sold | Favorited item is sold |

### 12.2 Channels

- In-app notifications
- Email notifications
- Push notifications (mobile)

---

## 13. Mobile-Specific Features

### 13.1 Mobile Optimizations

| Feature | Description |
|---------|-------------|
| Bottom Sheet Filters | Full-screen filter modal |
| Swipe Image Gallery | Touch-friendly image browsing |
| Sticky CTAs | Fixed bottom action buttons |
| Optimized Forms | Mobile-friendly input fields |
| Touch Targets | 44px minimum touch areas |

### 13.2 Camera Integration (Planned)

- Direct photo capture for listings
- Barcode/tag scanning
- Live photo enhancement preview

---

## 14. Design System

### 14.1 Color Palette

| Name | Use |
|------|-----|
| Cream | Backgrounds, light surfaces |
| Sand | Secondary backgrounds, cards |
| Charcoal | Text, buttons, dark elements |
| Terracotta | Accents, CTAs, favorites |
| Sage | Success states, verification |

### 14.2 Typography

| Element | Style |
|---------|-------|
| Display | Serif, elegant for headings |
| Body | Sans-serif, clean for content |
| Labels | Small, uppercase tracking |

### 14.3 Components

- Product Cards
- Filter Chips
- Buttons (Primary, Secondary, Ghost)
- Input Fields
- Modals
- Badges
- Avatar
- Rating Stars
- Progress Indicators

---

## 15. Success Metrics (KPIs)

| Metric | Target |
|--------|--------|
| Sell-Through Rate | 60% within 60 days |
| Average Transaction Value | $2,500+ |
| Collector Retention | 40% repeat purchases |
| Authentication Accuracy | 100% guarantee |
| Seller Response Time | < 24 hours |
| Platform Uptime | 99.9% |

---

## 16. Future Features (Roadmap)

### Phase 1 - Core
- [ ] Full Supabase integration
- [ ] Real authentication
- [ ] Stripe payments
- [ ] Image cloud storage

### Phase 2 - Enhancement
- [ ] Real-time messaging
- [ ] Push notifications
- [ ] Advanced search (Algolia)
- [ ] Analytics dashboard

### Phase 3 - Growth
- [ ] Mobile apps (React Native)
- [ ] Seller verification program
- [ ] Affiliate program
- [ ] International shipping

### Phase 4 - Advanced
- [ ] AI-powered pricing suggestions
- [ ] Virtual try-on
- [ ] Authentication AI
- [ ] Auction format

---

*Last Updated: January 2026*

