-- =============================================
-- VINTLY MARKETPLACE - SUPABASE DATABASE SCHEMA
-- =============================================
-- A peer-to-peer secondhand clothing marketplace
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with marketplace-specific fields
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    stripe_connect_id VARCHAR(255),
    is_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- =============================================
-- PRODUCTS TABLE
-- Clothing listings with all relevant attributes
-- =============================================
CREATE TYPE product_category AS ENUM (
    'tops',
    'bottoms',
    'dresses',
    'outerwear',
    'shoes',
    'accessories',
    'bags',
    'jewelry',
    'activewear',
    'swimwear',
    'other'
);

CREATE TYPE product_condition AS ENUM (
    'new_with_tags',
    'like_new',
    'good',
    'fair'
);

CREATE TYPE product_size AS ENUM (
    'XXS',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'XXXL',
    'ONE_SIZE'
);

CREATE TYPE product_status AS ENUM (
    'draft',
    'available',
    'sold',
    'archived'
);

CREATE TYPE shipping_weight AS ENUM (
    'small',
    'medium',
    'large'
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    category product_category NOT NULL,
    size product_size NOT NULL,
    condition product_condition NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(50),
    status product_status DEFAULT 'draft',
    shipping_weight shipping_weight DEFAULT 'medium',
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Available products are viewable by everyone" 
    ON products FOR SELECT 
    USING (status = 'available' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert their own products" 
    ON products FOR INSERT 
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products" 
    ON products FOR UPDATE 
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products" 
    ON products FOR DELETE 
    USING (auth.uid() = seller_id);

-- Index for faster filtering
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_size ON products(size);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- =============================================
-- IMAGES TABLE
-- Product photos (up to 8 per item)
-- =============================================
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    order_index INTEGER NOT NULL CHECK (order_index >= 0 AND order_index < 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, order_index)
);

-- Enable Row Level Security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policies for images
CREATE POLICY "Images are viewable if product is viewable" 
    ON images FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = images.product_id 
            AND (products.status = 'available' OR products.seller_id = auth.uid())
        )
    );

CREATE POLICY "Sellers can manage images for their products" 
    ON images FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = images.product_id 
            AND products.seller_id = auth.uid()
        )
    );

-- Index for faster lookups
CREATE INDEX idx_images_product ON images(product_id);

-- =============================================
-- ORDERS TABLE
-- Transaction records between buyers and sellers
-- =============================================
CREATE TYPE order_status AS ENUM (
    'pending',
    'paid',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Pricing
    item_price DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status & tracking
    status order_status DEFAULT 'pending',
    tracking_number VARCHAR(100),
    
    -- Shipping address (stored at time of order)
    shipping_address JSONB NOT NULL,
    
    -- Stripe payment
    stripe_payment_intent_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    
    -- Timestamps
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders (as buyer or seller)" 
    ON orders FOR SELECT 
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Authenticated users can create orders" 
    ON orders FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update order status" 
    ON orders FOR UPDATE 
    USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Indexes for orders
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =============================================
-- PRODUCT LIKES TABLE
-- Track which users liked which products
-- =============================================
CREATE TABLE product_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE product_likes ENABLE ROW LEVEL SECURITY;

-- Policies for product likes
CREATE POLICY "Users can view their own likes" 
    ON product_likes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own likes" 
    ON product_likes FOR ALL 
    USING (auth.uid() = user_id);

-- =============================================
-- SELLER FOLLOWS TABLE
-- Track which users follow which sellers
-- =============================================
CREATE TABLE seller_follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, seller_id),
    CHECK (follower_id != seller_id)
);

-- Enable Row Level Security
ALTER TABLE seller_follows ENABLE ROW LEVEL SECURITY;

-- Policies for follows
CREATE POLICY "Anyone can see follow relationships" 
    ON seller_follows FOR SELECT 
    USING (true);

CREATE POLICY "Users can manage their own follows" 
    ON seller_follows FOR ALL 
    USING (auth.uid() = follower_id);

-- =============================================
-- REVIEWS TABLE
-- Buyer reviews after delivery
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
    ON reviews FOR SELECT 
    USING (true);

CREATE POLICY "Buyers can create reviews for their orders" 
    ON reviews FOR INSERT 
    WITH CHECK (auth.uid() = reviewer_id);

-- Index for reviews
CREATE INDEX idx_reviews_seller ON reviews(seller_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update seller rating when a review is added
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 1)
            FROM reviews
            WHERE seller_id = NEW.seller_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE seller_id = NEW.seller_id
        )
    WHERE id = NEW.seller_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

-- Function to update product status when order is created
CREATE OR REPLACE FUNCTION mark_product_sold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'paid' THEN
        UPDATE products SET status = 'sold' WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mark_sold_on_payment
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'paid')
    EXECUTE FUNCTION mark_product_sold();

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products SET likes_count = likes_count + 1 WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products SET likes_count = likes_count - 1 WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_likes
    AFTER INSERT OR DELETE ON product_likes
    FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- =============================================
-- STORAGE BUCKETS (Run via Supabase Dashboard or API)
-- =============================================
-- Note: Create these buckets in Supabase Dashboard:
-- 1. "avatars" - for user profile pictures
-- 2. "products" - for product images

-- Example storage policies (apply via dashboard):
-- INSERT: authenticated users can upload to their own folder
-- SELECT: anyone can view images
-- DELETE: users can delete their own uploads







