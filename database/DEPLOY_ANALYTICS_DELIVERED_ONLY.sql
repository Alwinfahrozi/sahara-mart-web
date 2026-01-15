-- ============================================================
-- DEPLOY ANALYTICS FUNCTIONS - DELIVERED ORDERS ONLY
-- Run this in Supabase SQL Editor
-- ============================================================
--
-- PERUBAHAN UTAMA:
-- Sekarang hanya menghitung order dengan status = 'delivered'
-- Sebelumnya: Semua status kecuali 'cancelled'
-- Sekarang: HANYA 'delivered'
--
-- ============================================================

-- ============================================================
-- STEP 1: UPDATE ANALYTICS FUNCTIONS (DELIVERED ONLY)
-- ============================================================

-- Function: Get today's sales summary (DELIVERED ONLY)
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
    AND o.status = 'delivered';  -- ✅ HANYA DELIVERED!
END;
$$ LANGUAGE plpgsql;

-- Function: Get this week's sales summary (DELIVERED ONLY)
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
    AND o.status = 'delivered';  -- ✅ HANYA DELIVERED!
END;
$$ LANGUAGE plpgsql;

-- Function: Get this month's sales summary (DELIVERED ONLY)
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
    AND o.status = 'delivered';  -- ✅ HANYA DELIVERED!
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STEP 2: UPDATE ANALYTICS VIEWS (DELIVERED ONLY)
-- ============================================================

-- View: Daily Sales Summary (DELIVERED ONLY)
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
  AND status = 'delivered'  -- ✅ HANYA DELIVERED!
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- View: Weekly Sales Summary (DELIVERED ONLY)
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
  AND status = 'delivered'  -- ✅ HANYA DELIVERED!
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- View: Monthly Sales Summary (DELIVERED ONLY)
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
  AND status = 'delivered'  -- ✅ HANYA DELIVERED!
GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month_start DESC;

-- View: Top Selling Products (DELIVERED ONLY)
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
  AND o.status = 'delivered'  -- ✅ HANYA DELIVERED!
GROUP BY oi.product_id, oi.product_name, oi.product_sku
ORDER BY total_quantity_sold DESC;

-- View: Sales by Category (DELIVERED ONLY)
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
  AND o.status = 'delivered'  -- ✅ HANYA DELIVERED!
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;

-- ============================================================
-- STEP 3: TEST FUNCTIONS
-- ============================================================

-- Test today's sales
SELECT 'Testing get_today_sales() - DELIVERED ONLY' as test_name;
SELECT * FROM get_today_sales();

-- Test this week's sales
SELECT 'Testing get_this_week_sales() - DELIVERED ONLY' as test_name;
SELECT * FROM get_this_week_sales();

-- Test this month's sales
SELECT 'Testing get_this_month_sales() - DELIVERED ONLY' as test_name;
SELECT * FROM get_this_month_sales();

-- ============================================================
-- STEP 4: VERIFY WITH ACTUAL ORDER
-- ============================================================

-- Show all orders and their status
SELECT
  order_number,
  customer_name,
  status,
  total_items,
  subtotal,
  total_profit,
  profit_margin,
  DATE(created_at) as order_date,
  is_deleted
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- Count orders by status
SELECT
  status,
  COUNT(*) as count,
  SUM(total_profit) as total_profit
FROM orders
WHERE (is_deleted = FALSE OR is_deleted IS NULL)
GROUP BY status
ORDER BY count DESC;

-- ============================================================
-- EXPECTED RESULTS
-- ============================================================

-- SEBELUM UPDATE (status = pending):
-- Dashboard: Rp 121.000 (SALAH - seharusnya Rp 0)
--
-- SETELAH UPDATE (status = pending):
-- Dashboard: Rp 0 (BENAR - pending belum delivered)
--
-- SETELAH UPDATE STATUS KE DELIVERED:
-- Dashboard: Rp 121.000 (BENAR - sudah delivered)

-- ============================================================
-- PENJELASAN 3 CARDS
-- ============================================================

/*
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ HARI INI (Today)                                         │
├─────────────────────────────────────────────────────────────┤
│ Revenue: Rp 0                                               │
│ Orders: 0                                                   │
│ Items: 0                                                    │
│ Profit: Rp 0                                                │
│ Margin: 0.0%                                                │
├─────────────────────────────────────────────────────────────┤
│ 📅 Filter: DATE(created_at) = CURRENT_DATE                  │
│ 📦 Status: HANYA 'delivered'                                │
│                                                             │
│ Artinya: Order yang DELIVERED HARI INI SAJA                │
│                                                             │
│ Contoh:                                                     │
│ - Order created 14 Jan, delivered 14 Jan → MASUK ✅         │
│ - Order created 14 Jan, delivered 15 Jan → TIDAK MASUK ❌   │
│ - Order created 13 Jan, delivered 14 Jan → TIDAK MASUK ❌   │
│                                                             │
│ Note: Dihitung dari created_at, bukan completed_at         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2️⃣ MINGGU INI (This Week)                                   │
├─────────────────────────────────────────────────────────────┤
│ Revenue: Rp 121.000                                         │
│ Orders: 1                                                   │
│ Items: 3                                                    │
│ Profit: Rp 41.000                                           │
│ Margin: 33.9%                                               │
├─────────────────────────────────────────────────────────────┤
│ 📅 Filter: created_at >= START OF THIS WEEK (Senin)        │
│ 📦 Status: HANYA 'delivered'                                │
│                                                             │
│ Artinya: Order yang DELIVERED MINGGU INI (Senin-Minggu)    │
│                                                             │
│ Contoh (hari ini Selasa, 14 Jan):                          │
│ - Order 13 Jan (Senin) delivered → MASUK ✅                 │
│ - Order 14 Jan (Selasa) delivered → MASUK ✅                │
│ - Order 12 Jan (Minggu lalu) delivered → TIDAK MASUK ❌     │
│                                                             │
│ Grafik: Menampilkan 4 minggu terakhir                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3️⃣ BULAN INI (This Month)                                   │
├─────────────────────────────────────────────────────────────┤
│ Revenue: Rp 121.000                                         │
│ Orders: 1                                                   │
│ Items: 3                                                    │
│ Profit: Rp 41.000                                           │
│ Margin: 33.9%                                               │
├─────────────────────────────────────────────────────────────┤
│ 📅 Filter: created_at >= START OF THIS MONTH (1 Jan)       │
│ 📦 Status: HANYA 'delivered'                                │
│                                                             │
│ Artinya: Order yang DELIVERED BULAN INI (1-31 Jan)         │
│                                                             │
│ Contoh (bulan ini: Januari 2026):                          │
│ - Order 5 Jan delivered → MASUK ✅                          │
│ - Order 14 Jan delivered → MASUK ✅                         │
│ - Order 30 Des delivered → TIDAK MASUK ❌                   │
│                                                             │
│ Best for: Melihat total penjualan bulan berjalan           │
└─────────────────────────────────────────────────────────────┘

KENAPA ANGKANYA SAMA?
- Karena order created 14 Jan (Selasa minggu ini, bulan ini)
- Minggu ini = 13-19 Jan (mencakup 14 Jan) ✅
- Bulan ini = 1-31 Jan (mencakup 14 Jan) ✅
- Hari ini = 14 Jan saja (hanya kalau created_at = 14 Jan) ✅

JIKA ADA LEBIH BANYAK ORDER:
- Hari ini: 5 orders (hari ini saja)
- Minggu ini: 30 orders (total 7 hari)
- Bulan ini: 100 orders (total ~30 hari)
*/

-- ============================================================
-- AFTER RUNNING THIS
-- ============================================================

/*
1. Go to Supabase Dashboard → Settings → API
2. Click "Reload schema" button
3. Refresh admin dashboard page
4. Dashboard now shows ONLY DELIVERED orders!

TEST SCENARIO:
1. Create order → status = 'pending'
   Dashboard: Rp 0 ✅ (benar, belum delivered)

2. Update order → status = 'delivered'
   Dashboard: Rp 121.000 ✅ (benar, sudah delivered)

3. Update order → status = 'pending' lagi
   Dashboard: Rp 0 ✅ (benar, belum delivered lagi)
*/
