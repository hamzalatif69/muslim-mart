-- ====================
-- MUSLIM MART DATABASE SCHEMA
-- ====================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    buy_price DECIMAL(10, 2) NOT NULL,
    sell_price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    paid_amount DECIMAL(10, 2) NOT NULL,
    return_amount DECIMAL(10, 2) DEFAULT 0,
    delivery BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Create policies for anon access (allow all operations)
CREATE POLICY "Enable all for anon on products" ON products
    FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable all for anon on sales" ON sales
    FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable all for anon on sale_items" ON sale_items
    FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Insert sample data
INSERT INTO products (name, category, buy_price, sell_price, stock)
VALUES
    ('T-Shirt', 'GARMENTS', 300, 500, 50),
    ('Saree', 'GARMENTS', 1500, 2500, 20),
    ('School Uniform', 'GARMENTS', 400, 700, 30),
    ('Apple (1kg)', 'FOOD_ITEMS', 200, 300, 100),
    ('Tomato (1kg)', 'FOOD_ITEMS', 80, 120, 50),
    ('Chips', 'FOOD_ITEMS', 50, 80, 200),
    ('Coca Cola (1L)', 'FOOD_ITEMS', 80, 120, 60),
    ('Chicken (1kg)', 'FOOD_ITEMS', 400, 600, 25),
    ('Rice (1kg)', 'FOOD_ITEMS', 100, 150, 150),
    ('Milk (1L)', 'FOOD_ITEMS', 120, 180, 80),
    ('Sports Shoes', 'SHOES', 2000, 3500, 15),
    ('Formal Shoes (Gents)', 'SHOES', 1500, 2500, 10),
    ('Heels (Ladies)', 'SHOES', 1200, 2000, 12),
    ('School Shoes (Kids)', 'SHOES', 800, 1300, 20),
    ('Mobile Phone', 'ELECTRONICS', 15000, 22000, 5),
    ('Washing Machine', 'HOME_APPLIANCES', 25000, 35000, 3),
    ('Samosa (1 plate)', 'CAFETERIA', 50, 80, 200),
    ('Coffee', 'CAFETERIA', 40, 60, 150),
    ('Chicken Biryani', 'CAFETERIA', 200, 350, 50),
    ('Play Ticket', 'PLAY_AREA', 100, 200, 500),
    ('Aspirin', 'MEDICINES', 10, 20, 100),
    ('Homeopathic Remedy', 'MEDICINES', 200, 350, 30),
    ('Face Cream', 'MEDICINES', 300, 500, 40)
ON CONFLICT DO NOTHING;
