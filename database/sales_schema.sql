-- ============================================================
-- SALES TRACKING SCHEMA
-- Database: Supabase PostgreSQL
-- Created: 2026-01-13
-- Purpose: Track orders, sales, profit margins, and analytics
-- ============================================================

-- ============================================================
-- TABLE: orders
-- Purpose: Master table untuk semua transaksi penjualan
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE, -- Format: ORD-20260113-001

  -- Customer Info (dari WhatsApp checkout)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_notes TEXT,

  -- Order Summary
  total_items INT NOT NULL DEFAULT 0, -- Total quantity produk
  subtotal DECIMAL(12,2) NOT NULL, -- Total harga produk
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL, -- subtotal + shipping

  -- Profit Calculation
  total_cost DECIMAL(12,2) DEFAULT 0, -- Total modal (original_price * qty)
  total_profit DECIMAL(12,2) DEFAULT 0, -- total_amount - total_cost
  profit_margin DECIMAL(5,2) DEFAULT 0, -- (profit / total_amount) * 100

  -- Order Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_method TEXT DEFAULT 'whatsapp', -- whatsapp, cash, transfer

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE, -- Saat order selesai (delivered)

  -- Metadata
  whatsapp_message TEXT, -- Copy of WhatsApp message sent
  admin_notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- TABLE: order_items
-- Purpose: Detail produk dalam setiap order (line items)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

  -- Product Snapshot (saat order dibuat)
  product_name TEXT NOT NULL, -- Nama produk saat itu
  product_sku TEXT, -- SKU saat itu
  product_image_url TEXT, -- Image URL saat itu

  -- Pricing (snapshot)
  unit_price DECIMAL(10,2) NOT NULL, -- Harga jual saat itu
  unit_cost DECIMAL(10,2), -- Harga modal saat itu (original_price)
  quantity INT NOT NULL DEFAULT 1,

  -- Calculations
  line_subtotal DECIMAL(12,2) NOT NULL, -- unit_price * quantity
  line_cost DECIMAL(12,2), -- unit_cost * quantity
  line_profit DECIMAL(12,2), -- line_subtotal - line_cost
  line_profit_margin DECIMAL(5,2), -- (line_profit / line_subtotal) * 100

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES for Performance
-- ============================================================

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_completed_at ON orders(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_is_deleted ON orders(is_deleted);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_created_at ON order_items(created_at DESC);

-- ============================================================
-- TRIGGERS for Auto-Update
-- ============================================================

-- Trigger: Update orders.updated_at on change
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Trigger: Update order_items.updated_at on change
CREATE OR REPLACE FUNCTION update_order_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_items_updated_at();

-- Trigger: Auto-calculate order totals when items change
CREATE OR REPLACE FUNCTION recalculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update order totals based on all items
  UPDATE orders o
  SET
    total_items = (
      SELECT COALESCE(SUM(quantity), 0)
      FROM order_items
      WHERE order_id = o.id
    ),
    subtotal = (
      SELECT COALESCE(SUM(line_subtotal), 0)
      FROM order_items
      WHERE order_id = o.id
    ),
    total_cost = (
      SELECT COALESCE(SUM(line_cost), 0)
      FROM order_items
      WHERE order_id = o.id
    ),
    total_profit = (
      SELECT COALESCE(SUM(line_profit), 0)
      FROM order_items
      WHERE order_id = o.id
    ),
    total_amount = (
      SELECT COALESCE(SUM(line_subtotal), 0) + COALESCE(o.shipping_cost, 0)
      FROM order_items
      WHERE order_id = o.id
    ),
    profit_margin = CASE
      WHEN (SELECT COALESCE(SUM(line_subtotal), 0) FROM order_items WHERE order_id = o.id) > 0
      THEN ROUND(
        ((SELECT COALESCE(SUM(line_profit), 0) FROM order_items WHERE order_id = o.id) /
        (SELECT COALESCE(SUM(line_subtotal), 0) FROM order_items WHERE order_id = o.id)) * 100,
        2
      )
      ELSE 0
    END
  WHERE o.id = COALESCE(NEW.order_id, OLD.order_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalculate_order_totals
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_order_totals();

-- ============================================================
-- VIEWS for Analytics
-- ============================================================

-- View: Daily Sales Summary
CREATE OR REPLACE VIEW daily_sales AS
SELECT
  DATE(created_at) as sale_date,
  COUNT(*) as total_orders,
  SUM(total_items) as total_items_sold,
  SUM(subtotal) as total_revenue,
  SUM(total_cost) as total_cost,
  SUM(total_profit) as total_profit,
  ROUND(AVG(profit_margin), 2) as avg_profit_margin,
  ROUND(AVG(total_amount), 2) as avg_order_value
FROM orders
WHERE is_deleted = FALSE
  AND status NOT IN ('cancelled')
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- View: Weekly Sales Summary
CREATE OR REPLACE VIEW weekly_sales AS
SELECT
  DATE_TRUNC('week', created_at)::DATE as week_start,
  COUNT(*) as total_orders,
  SUM(total_items) as total_items_sold,
  SUM(subtotal) as total_revenue,
  SUM(total_cost) as total_cost,
  SUM(total_profit) as total_profit,
  ROUND(AVG(profit_margin), 2) as avg_profit_margin,
  ROUND(AVG(total_amount), 2) as avg_order_value
FROM orders
WHERE is_deleted = FALSE
  AND status NOT IN ('cancelled')
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- View: Monthly Sales Summary
CREATE OR REPLACE VIEW monthly_sales AS
SELECT
  DATE_TRUNC('month', created_at)::DATE as month_start,
  TO_CHAR(created_at, 'YYYY-MM') as month_label,
  COUNT(*) as total_orders,
  SUM(total_items) as total_items_sold,
  SUM(subtotal) as total_revenue,
  SUM(total_cost) as total_cost,
  SUM(total_profit) as total_profit,
  ROUND(AVG(profit_margin), 2) as avg_profit_margin,
  ROUND(AVG(total_amount), 2) as avg_order_value
FROM orders
WHERE is_deleted = FALSE
  AND status NOT IN ('cancelled')
GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month_start DESC;

-- View: Top Selling Products
CREATE OR REPLACE VIEW top_selling_products AS
SELECT
  oi.product_id,
  oi.product_name,
  oi.product_sku,
  COUNT(DISTINCT oi.order_id) as times_ordered,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.line_subtotal) as total_revenue,
  SUM(oi.line_profit) as total_profit,
  ROUND(AVG(oi.line_profit_margin), 2) as avg_profit_margin,
  MAX(oi.created_at) as last_sold_at
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.is_deleted = FALSE
  AND o.status NOT IN ('cancelled')
GROUP BY oi.product_id, oi.product_name, oi.product_sku
ORDER BY total_quantity_sold DESC;

-- View: Sales by Category
CREATE OR REPLACE VIEW sales_by_category AS
SELECT
  c.id as category_id,
  c.name as category_name,
  COUNT(DISTINCT oi.order_id) as total_orders,
  SUM(oi.quantity) as total_items_sold,
  SUM(oi.line_subtotal) as total_revenue,
  SUM(oi.line_profit) as total_profit,
  ROUND(AVG(oi.line_profit_margin), 2) as avg_profit_margin
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
JOIN orders o ON o.id = oi.order_id
WHERE o.is_deleted = FALSE
  AND o.status NOT IN ('cancelled')
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;

-- ============================================================
-- FUNCTIONS for Common Queries
-- ============================================================

-- Function: Get today's sales summary
CREATE OR REPLACE FUNCTION get_today_sales()
RETURNS TABLE (
  total_orders BIGINT,
  total_items BIGINT,
  total_revenue NUMERIC,
  total_profit NUMERIC,
  avg_profit_margin NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(o.total_items), 0)::BIGINT as total_items,
    COALESCE(SUM(o.subtotal), 0) as total_revenue,
    COALESCE(SUM(o.total_profit), 0) as total_profit,
    ROUND(AVG(o.profit_margin), 2) as avg_profit_margin
  FROM orders o
  WHERE DATE(o.created_at) = CURRENT_DATE
    AND o.is_deleted = FALSE
    AND o.status NOT IN ('cancelled');
END;
$$ LANGUAGE plpgsql;

-- Function: Get this week's sales summary
CREATE OR REPLACE FUNCTION get_this_week_sales()
RETURNS TABLE (
  total_orders BIGINT,
  total_items BIGINT,
  total_revenue NUMERIC,
  total_profit NUMERIC,
  avg_profit_margin NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(o.total_items), 0)::BIGINT as total_items,
    COALESCE(SUM(o.subtotal), 0) as total_revenue,
    COALESCE(SUM(o.total_profit), 0) as total_profit,
    ROUND(AVG(o.profit_margin), 2) as avg_profit_margin
  FROM orders o
  WHERE o.created_at >= DATE_TRUNC('week', CURRENT_DATE)
    AND o.is_deleted = FALSE
    AND o.status NOT IN ('cancelled');
END;
$$ LANGUAGE plpgsql;

-- Function: Get this month's sales summary
CREATE OR REPLACE FUNCTION get_this_month_sales()
RETURNS TABLE (
  total_orders BIGINT,
  total_items BIGINT,
  total_revenue NUMERIC,
  total_profit NUMERIC,
  avg_profit_margin NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(o.total_items), 0)::BIGINT as total_items,
    COALESCE(SUM(o.subtotal), 0) as total_revenue,
    COALESCE(SUM(o.total_profit), 0) as total_profit,
    ROUND(AVG(o.profit_margin), 2) as avg_profit_margin
  FROM orders o
  WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND o.is_deleted = FALSE
    AND o.status NOT IN ('cancelled');
END;
$$ LANGUAGE plpgsql;

-- Function: Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  today_date TEXT;
  order_count INT;
  new_number TEXT;
BEGIN
  -- Format: ORD-YYYYMMDD-XXX
  today_date := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');

  -- Count today's orders
  SELECT COUNT(*) INTO order_count
  FROM orders
  WHERE order_number LIKE 'ORD-' || today_date || '-%';

  -- Generate new number
  new_number := 'ORD-' || today_date || '-' || LPAD((order_count + 1)::TEXT, 3, '0');

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================================

-- Enable RLS on tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can do everything (authenticated users only)
CREATE POLICY orders_admin_all ON orders
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY order_items_admin_all ON order_items
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA (for testing)
-- ============================================================

-- Uncomment to insert sample orders for testing
/*
-- Sample Order 1
INSERT INTO orders (
  order_number,
  customer_name,
  customer_phone,
  customer_address,
  total_items,
  subtotal,
  shipping_cost,
  total_amount,
  total_cost,
  total_profit,
  profit_margin,
  status,
  payment_status
) VALUES (
  'ORD-20260113-001',
  'Budi Santoso',
  '081234567890',
  'Jl. Merdeka No. 123, Jakarta',
  5,
  125000,
  10000,
  135000,
  95000,
  30000,
  22.22,
  'completed',
  'paid'
);

-- Sample Order Items for Order 1
INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  product_sku,
  unit_price,
  unit_cost,
  quantity,
  line_subtotal,
  line_cost,
  line_profit,
  line_profit_margin
) VALUES (
  (SELECT id FROM orders WHERE order_number = 'ORD-20260113-001'),
  (SELECT id FROM products LIMIT 1),
  'Minyak Goreng Bimoli 1L',
  'MG-BIM-1L',
  25000,
  19000,
  3,
  75000,
  57000,
  18000,
  24.00
),
(
  (SELECT id FROM orders WHERE order_number = 'ORD-20260113-001'),
  (SELECT id FROM products LIMIT 1 OFFSET 1),
  'Susu UHT Indomilk 1L',
  'SUSU-IND-1L',
  25000,
  19000,
  2,
  50000,
  38000,
  12000,
  24.00
);
*/

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if tables created
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('orders', 'order_items');

-- Check if views created
-- SELECT table_name FROM information_schema.views
-- WHERE table_schema = 'public'
-- AND table_name IN ('daily_sales', 'weekly_sales', 'monthly_sales', 'top_selling_products', 'sales_by_category');

-- Check if functions created
-- SELECT routine_name FROM information_schema.routines
-- WHERE routine_schema = 'public'
-- AND routine_name IN ('get_today_sales', 'get_this_week_sales', 'get_this_month_sales', 'generate_order_number');

-- ============================================================
-- END OF SCHEMA
-- ============================================================
