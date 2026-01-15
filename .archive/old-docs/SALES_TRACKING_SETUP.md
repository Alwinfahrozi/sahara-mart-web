# 📊 Sales Tracking & Analytics Setup Guide

**Feature:** Sales Analytics Dashboard dengan Profit Tracking
**Created:** 2026-01-13
**Status:** ✅ Schema Ready - Needs Supabase Execution

---

## 🎯 Overview

Sistem tracking penjualan lengkap yang mencatat:
- ✅ Semua transaksi penjualan (orders)
- ✅ Detail produk terjual (order_items)
- ✅ Profit margins & keuntungan per produk
- ✅ Statistik harian, mingguan, bulanan
- ✅ Top selling products
- ✅ Sales by category

---

## 📋 Step-by-Step Setup (10 Menit)

### Step 1: Login ke Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Login dengan akun Anda
3. Select project: **Sahara Mart**

---

### Step 2: Execute SQL Schema
1. Di sidebar, klik **"SQL Editor"**
2. Klik **"New query"** (button hijau)
3. Copy **SEMUA** isi file `database/sales_schema.sql`
4. Paste ke SQL Editor
5. Klik **"Run"** (Ctrl+Enter)
6. Wait for completion (~5-10 seconds)
7. Verify: Should show "Success. No rows returned"

---

### Step 3: Verify Tables Created
Run verification query:

```sql
-- Check tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('orders', 'order_items');
```

**Expected Result:**
```
table_name
-----------
orders
order_items
```

✅ If you see both tables → Success!

---

### Step 4: Verify Views Created
Run verification query:

```sql
-- Check views
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN (
  'daily_sales',
  'weekly_sales',
  'monthly_sales',
  'top_selling_products',
  'sales_by_category'
);
```

**Expected Result:**
```
table_name
------------------
daily_sales
weekly_sales
monthly_sales
top_selling_products
sales_by_category
```

✅ If you see all 5 views → Success!

---

### Step 5: Test with Sample Data (Optional)

Insert test order untuk verify system:

```sql
-- Create test order
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
  'Test Customer',
  '081234567890',
  'Test Address',
  2,
  50000,
  10000,
  60000,
  38000,
  12000,
  20.00,
  'completed',
  'paid'
);

-- Check if order created
SELECT * FROM orders WHERE order_number = 'ORD-20260113-001';
```

---

## 📊 Database Schema Explanation

### Table: `orders` (Master Transactions)

**Columns:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `order_number` | TEXT | Unique order number: ORD-YYYYMMDD-XXX |
| `customer_name` | TEXT | Nama customer |
| `customer_phone` | TEXT | Nomor WhatsApp customer |
| `customer_address` | TEXT | Alamat pengiriman |
| `customer_notes` | TEXT | Catatan dari customer |
| `total_items` | INT | Total quantity produk |
| `subtotal` | DECIMAL | Total harga produk |
| `shipping_cost` | DECIMAL | Ongkos kirim |
| `total_amount` | DECIMAL | subtotal + shipping |
| `total_cost` | DECIMAL | Total modal (original_price × qty) |
| `total_profit` | DECIMAL | total_amount - total_cost |
| `profit_margin` | DECIMAL | (profit / total_amount) × 100 |
| `status` | TEXT | pending, confirmed, processing, shipped, delivered, cancelled |
| `payment_status` | TEXT | unpaid, paid, refunded |
| `payment_method` | TEXT | whatsapp, cash, transfer |
| `created_at` | TIMESTAMP | Waktu order dibuat |
| `completed_at` | TIMESTAMP | Waktu order selesai |

---

### Table: `order_items` (Line Items)

**Columns:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `order_id` | UUID | Foreign key ke orders |
| `product_id` | UUID | Foreign key ke products |
| `product_name` | TEXT | Snapshot nama produk saat order |
| `product_sku` | TEXT | Snapshot SKU saat order |
| `product_image_url` | TEXT | Snapshot image URL saat order |
| `unit_price` | DECIMAL | Harga jual per unit saat order |
| `unit_cost` | DECIMAL | Harga modal per unit saat order |
| `quantity` | INT | Jumlah barang |
| `line_subtotal` | DECIMAL | unit_price × quantity |
| `line_cost` | DECIMAL | unit_cost × quantity |
| `line_profit` | DECIMAL | line_subtotal - line_cost |
| `line_profit_margin` | DECIMAL | (line_profit / line_subtotal) × 100 |

**Why Snapshot?**
Product prices might change over time. We save current values when order is created so historical data stays accurate.

---

## 🎯 Auto-Calculation Features

### 1. **Auto-Update Timestamps**
- `orders.updated_at` auto-updates on any change
- `order_items.updated_at` auto-updates on any change

### 2. **Auto-Calculate Order Totals**
When you insert/update/delete order_items, the parent order automatically recalculates:
- `total_items` (sum of quantities)
- `subtotal` (sum of line_subtotals)
- `total_cost` (sum of line_costs)
- `total_profit` (sum of line_profits)
- `total_amount` (subtotal + shipping_cost)
- `profit_margin` (percentage)

**Example:**
```sql
-- Add item to order
INSERT INTO order_items (order_id, product_name, unit_price, unit_cost, quantity)
VALUES (
  'order-uuid-here',
  'Minyak Goreng 1L',
  25000,
  19000,
  3
);

-- Order totals automatically updated!
-- No need to manually calculate
```

---

## 📈 Analytics Views

### View: `daily_sales`
Summary penjualan per hari:

```sql
SELECT * FROM daily_sales LIMIT 7;
```

**Columns:**
- `sale_date` - Tanggal
- `total_orders` - Jumlah order
- `total_items_sold` - Total barang terjual
- `total_revenue` - Total pendapatan
- `total_cost` - Total modal
- `total_profit` - Total keuntungan
- `avg_profit_margin` - Rata-rata profit margin (%)
- `avg_order_value` - Rata-rata nilai order

---

### View: `weekly_sales`
Summary penjualan per minggu:

```sql
SELECT * FROM weekly_sales LIMIT 4;
```

**Columns:** Same as daily_sales
**Group By:** Week (Monday as start)

---

### View: `monthly_sales`
Summary penjualan per bulan:

```sql
SELECT * FROM monthly_sales LIMIT 12;
```

**Columns:** Same as daily_sales + `month_label` (e.g., "2026-01")
**Group By:** Month

---

### View: `top_selling_products`
Produk terlaris:

```sql
SELECT * FROM top_selling_products LIMIT 10;
```

**Columns:**
- `product_id`, `product_name`, `product_sku`
- `times_ordered` - Berapa kali dibeli
- `total_quantity_sold` - Total qty terjual
- `total_revenue` - Total pendapatan
- `total_profit` - Total keuntungan
- `avg_profit_margin` - Rata-rata profit margin
- `last_sold_at` - Terakhir terjual

---

### View: `sales_by_category`
Penjualan per kategori:

```sql
SELECT * FROM sales_by_category;
```

**Columns:**
- `category_id`, `category_name`
- `total_orders`, `total_items_sold`
- `total_revenue`, `total_profit`
- `avg_profit_margin`

---

## 🔧 Helper Functions

### Function: `generate_order_number()`
Auto-generate order number dengan format: ORD-YYYYMMDD-XXX

```sql
SELECT generate_order_number();
-- Returns: ORD-20260113-001
```

---

### Function: `get_today_sales()`
Get today's sales summary:

```sql
SELECT * FROM get_today_sales();
```

**Returns:**
```
total_orders | total_items | total_revenue | total_profit | avg_profit_margin
-------------|-------------|---------------|--------------|------------------
15           | 47          | 1250000       | 280000       | 22.40
```

---

### Function: `get_this_week_sales()`
Get this week's sales summary:

```sql
SELECT * FROM get_this_week_sales();
```

---

### Function: `get_this_month_sales()`
Get this month's sales summary:

```sql
SELECT * FROM get_this_month_sales();
```

---

## 🔐 Security (RLS Policies)

Row Level Security (RLS) is enabled:
- Only **authenticated users** can access orders & order_items
- Public users cannot see sales data
- Admin users (logged in) can do everything

---

## 🎯 Common Use Cases

### Use Case 1: Create New Order

```sql
-- 1. Generate order number
SELECT generate_order_number();
-- Returns: ORD-20260113-001

-- 2. Create order
INSERT INTO orders (
  order_number,
  customer_name,
  customer_phone,
  customer_address,
  customer_notes,
  shipping_cost,
  status,
  payment_status
) VALUES (
  'ORD-20260113-001',
  'Budi Santoso',
  '081234567890',
  'Jl. Merdeka No. 123',
  'Antarkan sore hari',
  10000,
  'pending',
  'unpaid'
) RETURNING id;
-- Returns order UUID

-- 3. Add order items
INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  product_sku,
  product_image_url,
  unit_price,
  unit_cost,
  quantity,
  line_subtotal,
  line_cost,
  line_profit,
  line_profit_margin
)
SELECT
  'order-uuid-from-step-2',
  p.id,
  p.name,
  p.sku,
  p.image_url,
  p.price,
  p.original_price,
  3, -- quantity
  p.price * 3, -- line_subtotal
  p.original_price * 3, -- line_cost
  (p.price - p.original_price) * 3, -- line_profit
  ROUND(((p.price - p.original_price) / p.price) * 100, 2) -- margin
FROM products p
WHERE p.id = 'product-uuid-here';

-- Order totals automatically calculated!
```

---

### Use Case 2: Get Today's Best Sellers

```sql
SELECT
  product_name,
  total_quantity_sold,
  total_revenue
FROM top_selling_products
WHERE last_sold_at >= CURRENT_DATE
ORDER BY total_quantity_sold DESC
LIMIT 5;
```

---

### Use Case 3: Get Monthly Revenue Trend

```sql
SELECT
  month_label,
  total_orders,
  total_revenue,
  total_profit,
  avg_profit_margin
FROM monthly_sales
ORDER BY month_start DESC
LIMIT 12;
```

---

### Use Case 4: Calculate Profit by Date Range

```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as orders,
  SUM(total_amount) as revenue,
  SUM(total_profit) as profit,
  ROUND(AVG(profit_margin), 2) as avg_margin
FROM orders
WHERE created_at >= '2026-01-01'
  AND created_at < '2026-02-01'
  AND is_deleted = FALSE
  AND status NOT IN ('cancelled')
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 📊 Sample Dashboard Queries

### Dashboard Widget 1: Today's Stats

```sql
SELECT * FROM get_today_sales();
```

---

### Dashboard Widget 2: This Week's Stats

```sql
SELECT * FROM get_this_week_sales();
```

---

### Dashboard Widget 3: This Month's Stats

```sql
SELECT * FROM get_this_month_sales();
```

---

### Dashboard Widget 4: Top 5 Products This Week

```sql
SELECT
  oi.product_name,
  SUM(oi.quantity) as qty_sold,
  SUM(oi.line_subtotal) as revenue,
  SUM(oi.line_profit) as profit
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.created_at >= DATE_TRUNC('week', CURRENT_DATE)
  AND o.is_deleted = FALSE
  AND o.status NOT IN ('cancelled')
GROUP BY oi.product_name
ORDER BY qty_sold DESC
LIMIT 5;
```

---

### Dashboard Widget 5: Weekly Trend (Last 4 Weeks)

```sql
SELECT
  week_start,
  total_orders,
  total_revenue,
  total_profit,
  avg_profit_margin
FROM weekly_sales
ORDER BY week_start DESC
LIMIT 4;
```

---

## 🎨 Dashboard UI Components

After setup complete, dashboard akan menampilkan:

### 1. **Stat Cards** (Top Row)
```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ Today's Revenue  │ Today's Orders   │ Today's Profit   │ Profit Margin   │
│ Rp 1.250.000     │ 15 orders        │ Rp 280.000       │ 22.4%           │
│ +12% vs yesterday│ +3 vs yesterday  │ +15% vs yesterday│ +2.1% vs yester │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

### 2. **Charts** (Middle Row)
- Line chart: Revenue trend (last 30 days)
- Bar chart: Orders per day (last 7 days)
- Pie chart: Sales by category

### 3. **Tables** (Bottom Row)
- Top 10 selling products (this month)
- Recent orders (last 20)
- Low stock alerts

---

## 📝 Integration with Existing System

### WhatsApp Checkout Integration

Saat customer checkout via WhatsApp, system akan:

1. **Create Order Record**
   - Parse cart data
   - Generate order number
   - Save customer info

2. **Create Order Items**
   - Loop through cart items
   - Save product snapshot
   - Calculate profits

3. **Send WhatsApp Message**
   - Format order details
   - Include order number for tracking

**API Endpoint** (will be created):
```
POST /api/orders
Body: {
  customer_name, customer_phone, customer_address,
  cart: [ { product_id, quantity } ],
  shipping_cost, notes
}
```

---

## ✅ Setup Verification Checklist

After executing SQL:

- [ ] Tables `orders` and `order_items` exist
- [ ] All 5 views created (daily_sales, weekly_sales, etc.)
- [ ] All 4 functions created (generate_order_number, get_today_sales, etc.)
- [ ] Triggers active (auto-calculate totals)
- [ ] RLS policies enabled
- [ ] Test order inserted successfully
- [ ] Views return data correctly

---

## 🚀 Next Steps

After database setup:

1. **Create API Endpoints**
   - `POST /api/orders` - Create order from cart
   - `GET /api/orders` - List all orders
   - `GET /api/analytics/today` - Today's stats
   - `GET /api/analytics/weekly` - Weekly stats
   - `GET /api/analytics/monthly` - Monthly stats

2. **Build Dashboard Page**
   - Replace `app/admin/page.tsx` with real stats
   - Add charts (recharts or chart.js)
   - Display top products
   - Show revenue trends

3. **Update Checkout Flow**
   - Integrate order creation with WhatsApp checkout
   - Save orders before sending WhatsApp

4. **Add Order Management**
   - View order details
   - Update order status
   - Track fulfillment

---

## 🆘 Troubleshooting

### Problem: "relation already exists"
**Solution:** Tables already created. Skip to verification step.

### Problem: "permission denied"
**Solution:** Make sure you're logged in as project owner in Supabase.

### Problem: Views return empty data
**Solution:** Normal if no orders yet. Insert test data to verify.

### Problem: Triggers not firing
**Solution:** Check trigger status:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

---

## 📚 Documentation Files

After setup, read in this order:

1. **SALES_TRACKING_SETUP.md** (This file) - Database setup
2. **SALES_API_GUIDE.md** (Next) - API endpoints
3. **DASHBOARD_GUIDE.md** (Next) - Dashboard UI

---

## 🎉 Status

**Database Schema:** ✅ READY
**SQL File:** `database/sales_schema.sql`
**Action Required:** Execute SQL in Supabase Dashboard

**Estimated Time:** 10 minutes
**Difficulty:** Easy (copy-paste SQL)

---

**Created by:** Claude Sonnet 4.5
**Date:** 2026-01-13
**Next:** Create API endpoints for order management

