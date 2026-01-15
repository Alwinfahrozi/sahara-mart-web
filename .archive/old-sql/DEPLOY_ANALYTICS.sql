-- ============================================================
-- DEPLOY ANALYTICS FUNCTIONS & VIEWS
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1: CREATE ANALYTICS FUNCTIONS
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
    ROUND(COALESCE(AVG(o.profit_margin), 0), 2) as avg_profit_margin
  FROM orders o
  WHERE DATE(o.created_at) = CURRENT_DATE
    AND (o.is_deleted = FALSE OR o.is_deleted IS NULL)
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
    ROUND(COALESCE(AVG(o.profit_margin), 0), 2) as avg_profit_margin
  FROM orders o
  WHERE o.created_at >= DATE_TRUNC('week', CURRENT_DATE)
    AND (o.is_deleted = FALSE OR o.is_deleted IS NULL)
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
    ROUND(COALESCE(AVG(o.profit_margin), 0), 2) as avg_profit_margin
  FROM orders o
  WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND (o.is_deleted = FALSE OR o.is_deleted IS NULL)
    AND o.status NOT IN ('cancelled');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STEP 2: CREATE ANALYTICS VIEWS
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
WHERE (is_deleted = FALSE OR is_deleted IS NULL)
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
WHERE (is_deleted = FALSE OR is_deleted IS NULL)
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
WHERE (is_deleted = FALSE OR is_deleted IS NULL)
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
WHERE (o.is_deleted = FALSE OR o.is_deleted IS NULL)
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
WHERE (o.is_deleted = FALSE OR o.is_deleted IS NULL)
  AND o.status NOT IN ('cancelled')
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;

-- ============================================================
-- STEP 3: TEST FUNCTIONS
-- ============================================================

-- Test today's sales
SELECT 'Testing get_today_sales()' as test_name;
SELECT * FROM get_today_sales();

-- Test this week's sales
SELECT 'Testing get_this_week_sales()' as test_name;
SELECT * FROM get_this_week_sales();

-- Test this month's sales
SELECT 'Testing get_this_month_sales()' as test_name;
SELECT * FROM get_this_month_sales();

-- ============================================================
-- STEP 4: VERIFY VIEWS
-- ============================================================

-- Check daily sales
SELECT 'Testing daily_sales view' as test_name;
SELECT * FROM daily_sales LIMIT 5;

-- Check weekly sales
SELECT 'Testing weekly_sales view' as test_name;
SELECT * FROM weekly_sales LIMIT 5;

-- Check monthly sales
SELECT 'Testing monthly_sales view' as test_name;
SELECT * FROM monthly_sales LIMIT 5;

-- Check top selling products
SELECT 'Testing top_selling_products view' as test_name;
SELECT * FROM top_selling_products LIMIT 5;

-- ============================================================
-- STEP 5: CHECK EXISTING ORDERS
-- ============================================================

-- Show all orders with their stats
SELECT
  order_number,
  customer_name,
  status,
  total_items,
  subtotal,
  total_profit,
  profit_margin,
  created_at,
  is_deleted
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================
-- EXPECTED RESULTS
-- ============================================================

-- ✅ Functions created: get_today_sales, get_this_week_sales, get_this_month_sales
-- ✅ Views created: daily_sales, weekly_sales, monthly_sales, top_selling_products, sales_by_category
-- ✅ Test queries show data from existing orders
-- ✅ Dashboard should now show correct revenue/profit

-- ============================================================
-- IMPORTANT NOTES
-- ============================================================

-- 1. Fixed is_deleted filter to handle NULL values: (is_deleted = FALSE OR is_deleted IS NULL)
-- 2. Added COALESCE to prevent NULL in AVG calculation
-- 3. All functions exclude 'cancelled' orders only
-- 4. Functions count ALL other statuses: pending, confirmed, processing, shipped, delivered

-- ============================================================
-- AFTER RUNNING THIS:
-- ============================================================

-- 1. Go to Supabase Dashboard → Settings → API
-- 2. Click "Reload schema" button
-- 3. Refresh your admin dashboard page
-- 4. Dashboard should now show correct data!

-- ============================================================
