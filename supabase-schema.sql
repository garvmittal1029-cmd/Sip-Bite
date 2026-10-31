-- Sip & Bite — Supabase SQL Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 350,
  prep_time TEXT DEFAULT '4-6 mins',
  is_signature BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  ingredients TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  promo_code TEXT,
  grand_total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  order_status TEXT DEFAULT 'Placed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_delivery TEXT
);

-- 3. Offers / Coupons Table
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0,
  description TEXT,
  badge TEXT,
  active BOOLEAN DEFAULT TRUE,
  valid_until TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- 6. Public read policies
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public offers are viewable by everyone" ON offers FOR SELECT USING (true);
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view own order" ON orders FOR SELECT USING (true);
CREATE POLICY "Public can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- 7. Service role full access
CREATE POLICY "Admin full access on products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on offers" ON offers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on enquiries" ON enquiries FOR ALL USING (auth.role() = 'service_role');
