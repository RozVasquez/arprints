# Supabase Pricing Tables SQL

This file contains the SQL schema and sample data for the AR Prints pricing system. You can copy and paste this into the Supabase SQL editor to set up your tables.

---

```sql
-- 1. Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT 'gray',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL UNIQUE, -- e.g., "photo-prints", "rush-id"
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT 'gray',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Pricing Options Table
CREATE TABLE IF NOT EXISTS pricing_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(200), -- e.g., "3R", "Classic White", "Black and White (One Side)"
  quantity VARCHAR(100) NOT NULL, -- e.g., "2 pc", "10 pcs", "Short Size"
  price VARCHAR(50) NOT NULL, -- e.g., "₱45.00", "₱3.00/page"
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_options_product_id ON pricing_options(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON product_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_pricing_options_sort_order ON pricing_options(sort_order);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_categories_updated_at 
  BEFORE UPDATE ON product_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_options_updated_at 
  BEFORE UPDATE ON pricing_options 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data
INSERT INTO product_categories (name, title, description, color, sort_order) VALUES
('photos', 'Photos', 'Photo printing services', 'purple', 1),
('photocards', 'Photo Cards', 'Photo card printing services', 'green', 2),
('instaxInspired', 'Instax Inspired', 'Instax-style photo printing', 'yellow', 3),
('photoStrips', 'Photo Strips', 'Photo strip printing services', 'blue', 4),
('documentPrinting', 'Document Printing', 'Document printing services', 'gray', 5);

-- Add more sample data as needed...

-- Enable Row Level Security (RLS)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_options ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access to product_categories" ON product_categories
  FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pricing_options" ON pricing_options
  FOR SELECT USING (true);

-- Admin full access policies (adjust for production)
CREATE POLICY "Allow all operations on product_categories" ON product_categories
  FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL USING (true);
CREATE POLICY "Allow all operations on pricing_options" ON pricing_options
  FOR ALL USING (true);
``` 