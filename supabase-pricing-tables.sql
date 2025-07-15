-- Pricing Tables for AR Prints

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Types Table (e.g., 3D, Glittered, Matte, etc.)
CREATE TABLE IF NOT EXISTS product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  size TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Options Table
CREATE TABLE IF NOT EXISTS pricing_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL, -- e.g., "Classic White", "Classic Colored", "Instax Design"
  quantity TEXT NOT NULL, -- e.g., "10 pcs", "30 pcs"
  price DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO product_categories (name, title, description, sort_order) VALUES
('photocards', 'Photo Cards', 'High-quality printed photo cards', 1),
('instax', 'Instax Inspired', 'Instant camera style prints', 2),
('strips', 'Photo Strips', 'Classic photo strip designs', 3)
ON CONFLICT (name) DO NOTHING;

-- Insert default product types
INSERT INTO product_types (category_id, name, description, size, color, sort_order) VALUES
-- Photo Cards
((SELECT id FROM product_categories WHERE name = 'photocards'), '3D', '3D photo cards', '2.1" x 3.4"', 'red', 1),
((SELECT id FROM product_categories WHERE name = 'photocards'), 'Glittered Finish', 'Glittered finish photo cards', '2.1" x 3.4"', 'green', 2),
((SELECT id FROM product_categories WHERE name = 'photocards'), 'Matte or Glossy Finish', 'Matte or glossy finish photo cards', '2.1" x 3.4"', 'violet', 3),

-- Instax
((SELECT id FROM product_categories WHERE name = 'instax'), 'MINI', 'Instax Mini style', '1.2" x 3.5"', 'yellow', 1),
((SELECT id FROM product_categories WHERE name = 'instax'), 'SQUARE', 'Instax Square style', '2.8" x 3.4"', 'orange', 2),
((SELECT id FROM product_categories WHERE name = 'instax'), 'WIDE', 'Instax Wide style', '4.25" x 3.4"', 'blue', 3),

-- Strips
((SELECT id FROM product_categories WHERE name = 'strips'), 'Classic Strips', 'Classic photo strips', '2" x 6"', 'blue', 1),
((SELECT id FROM product_categories WHERE name = 'strips'), 'Classic Mini', 'Classic mini photo strips', '1.2" x 3.5"', 'green', 2)
ON CONFLICT DO NOTHING;

-- Insert default pricing options
INSERT INTO pricing_options (product_type_id, option_name, quantity, price, sort_order) VALUES
-- 3D Photo Cards
((SELECT id FROM product_types WHERE name = '3D' AND category_id = (SELECT id FROM product_categories WHERE name = 'photocards')), 'Standard', '9 cards', 80.00, 1),
((SELECT id FROM product_types WHERE name = '3D' AND category_id = (SELECT id FROM product_categories WHERE name = 'photocards')), 'Standard', '18 cards', 140.00, 2),

-- Glittered Photo Cards
((SELECT id FROM product_types WHERE name = 'Glittered Finish' AND category_id = (SELECT id FROM product_categories WHERE name = 'photocards')), 'Standard', '9 cards', 80.00, 1),
((SELECT id FROM product_types WHERE name = 'Glittered Finish' AND category_id = (SELECT id FROM product_categories WHERE name = 'photocards')), 'Standard', '18 cards', 140.00, 2),

-- Matte/Glossy Photo Cards
((SELECT id FROM product_types WHERE name = 'Matte or Glossy Finish' AND category_id = (SELECT id FROM product_categories WHERE name = 'photocards')), 'Standard', '9 cards', 70.00, 1),
((SELECT id FROM product_types WHERE name = 'Matte or Glossy Finish' AND category_id = (SELECT id FROM product_categories WHERE name = 'photocards')), 'Standard', '18 cards', 120.00, 2),

-- Instax MINI
((SELECT id FROM product_types WHERE name = 'MINI' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic White', '10 pcs', 60.00, 1),
((SELECT id FROM product_types WHERE name = 'MINI' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic White', '30 pcs', 100.00, 2),
((SELECT id FROM product_types WHERE name = 'MINI' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic Colored', '10 pcs', 60.00, 3),
((SELECT id FROM product_types WHERE name = 'MINI' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic Colored', '30 pcs', 120.00, 4),
((SELECT id FROM product_types WHERE name = 'MINI' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Instax Design', '10 pcs', 70.00, 5),
((SELECT id FROM product_types WHERE name = 'MINI' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Instax Design', '30 pcs', 150.00, 6),

-- Instax SQUARE
((SELECT id FROM product_types WHERE name = 'SQUARE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic White', '8 pcs', 60.00, 1),
((SELECT id FROM product_types WHERE name = 'SQUARE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic White', '24 pcs', 120.00, 2),
((SELECT id FROM product_types WHERE name = 'SQUARE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic Colored', '8 pcs', 70.00, 3),
((SELECT id FROM product_types WHERE name = 'SQUARE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic Colored', '24 pcs', 140.00, 4),
((SELECT id FROM product_types WHERE name = 'SQUARE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Instax Design', '8 pcs', 80.00, 5),
((SELECT id FROM product_types WHERE name = 'SQUARE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Instax Design', '24 pcs', 160.00, 6),

-- Instax WIDE
((SELECT id FROM product_types WHERE name = 'WIDE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic White', '5 pcs', 60.00, 1),
((SELECT id FROM product_types WHERE name = 'WIDE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic White', '15 pcs', 120.00, 2),
((SELECT id FROM product_types WHERE name = 'WIDE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic Colored', '5 pcs', 70.00, 3),
((SELECT id FROM product_types WHERE name = 'WIDE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Classic Colored', '15 pcs', 140.00, 4),
((SELECT id FROM product_types WHERE name = 'WIDE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Instax Design', '5 pcs', 80.00, 5),
((SELECT id FROM product_types WHERE name = 'WIDE' AND category_id = (SELECT id FROM product_categories WHERE name = 'instax')), 'Instax Design', '15 pcs', 160.00, 6),

-- Classic Strips
((SELECT id FROM product_types WHERE name = 'Classic Strips' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'Classic Colors', '2 pcs', 30.00, 1),
((SELECT id FROM product_types WHERE name = 'Classic Strips' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'Classic Colors', '5 pcs', 50.00, 2),
((SELECT id FROM product_types WHERE name = 'Classic Strips' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'with Design', '2 pcs', 40.00, 3),
((SELECT id FROM product_types WHERE name = 'Classic Strips' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'with Design', '5 pcs', 60.00, 4),

-- Classic Mini Strips
((SELECT id FROM product_types WHERE name = 'Classic Mini' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'Classic', '4 pcs', 30.00, 1),
((SELECT id FROM product_types WHERE name = 'Classic Mini' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'Classic', '8 pcs', 50.00, 2),
((SELECT id FROM product_types WHERE name = 'Classic Mini' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'with Design', '4 pcs', 40.00, 3),
((SELECT id FROM product_types WHERE name = 'Classic Mini' AND category_id = (SELECT id FROM product_categories WHERE name = 'strips')), 'with Design', '10 pcs', 70.00, 4)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_types_category_id ON product_types(category_id);
CREATE INDEX IF NOT EXISTS idx_pricing_options_product_type_id ON pricing_options(product_type_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_sort_order ON product_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_types_sort_order ON product_types(sort_order);
CREATE INDEX IF NOT EXISTS idx_pricing_options_sort_order ON pricing_options(sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_options ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to product_categories" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to product_types" ON product_types
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to pricing_options" ON pricing_options
  FOR SELECT USING (true);

-- Create policies for admin full access (you'll need to implement proper auth)
CREATE POLICY "Allow admin full access to product_categories" ON product_categories
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to product_types" ON product_types
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to pricing_options" ON pricing_options
  FOR ALL USING (true); 