# ⚡ QUICK START - Manual Setup (12 menit)

**Tanggal:** 16 Januari 2026
**Durasi Total:** 12 menit
**Tujuan:** Aktivasi semua fitur yang sudah di-deploy

---

## 📋 CHECKLIST OVERVIEW

```
✅ Task 1: Barcode SQL Migration    (2 min)  ⚡ BARU!
✅ Task 2: Analytics SQL Execution  (5 min)  📊 Dashboard
✅ Task 3: Supabase Storage Setup   (5 min)  🖼️ Upload Gambar
─────────────────────────────────────────────
Total:                              12 min   🚀 DONE!
```

---

## 🔴 TASK 1: BARCODE SQL MIGRATION (2 menit)

### Kenapa Penting?
Barcode system sudah di-code dan deployed, tapi kolom database belum ada!
Tanpa ini: Barcode scanner tidak akan berfungsi.

### Step-by-Step:

#### 1. Buka Supabase Dashboard
- URL: https://supabase.com/dashboard
- Login dengan akun Supabase Anda
- Pilih project: **Sahara Mart** (atau nama project Anda)

#### 2. Buka SQL Editor
- Di sidebar kiri, klik **"SQL Editor"**
- Klik tombol **"New query"** (hijau, kanan atas)

#### 3. Copy SQL Migration
Buka file: `database/add_barcode_column.sql`

**Atau copy langsung dari sini:**

```sql
-- ================================================
-- ADD BARCODE COLUMN TO PRODUCTS TABLE
-- ================================================

-- Step 1: Add barcode column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS barcode VARCHAR(255);

-- Step 2: Create index for faster barcode search
CREATE INDEX IF NOT EXISTS idx_products_barcode
ON public.products(barcode);

-- Step 3: Add comment
COMMENT ON COLUMN public.products.barcode IS 'Product barcode for scanning (EAN-13, UPC, Code128, etc)';

-- ================================================
-- VERIFY CHANGES
-- ================================================

-- Check column was added
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name = 'barcode';

-- Check index was created
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products'
  AND indexname = 'idx_products_barcode';

-- Sample: View products with their barcodes
SELECT
  id,
  name,
  sku,
  barcode,
  stock,
  price
FROM public.products
LIMIT 5;
```

#### 4. Paste & Run
- Paste SQL ke editor
- Klik tombol **"RUN"** (hijau, kanan bawah)
- Tunggu beberapa detik

#### 5. Verifikasi Success
Anda akan melihat 3 result tabs:
- **Tab 1:** Column info (barcode | character varying | 255 | YES)
- **Tab 2:** Index info (idx_products_barcode)
- **Tab 3:** Sample products (dengan kolom barcode, mungkin NULL)

✅ **SUCCESS!** Barcode column siap digunakan!

---

## 🔴 TASK 2: ANALYTICS SQL EXECUTION (5 menit)

### Kenapa Penting?
Dashboard admin butuh function ini untuk hitung:
- Total Penjualan (delivered orders only)
- Total Revenue
- Total Profit
- Weekly/Monthly stats

Tanpa ini: Dashboard akan show Rp 0 atau error.

### Step-by-Step:

#### 1. Buka SQL Editor (Masih di Supabase)
- Klik **"New query"** lagi

#### 2. Copy Analytics SQL
Buka file: `database/DEPLOY_ANALYTICS_DELIVERED_ONLY.sql`

**Atau copy langsung dari sini:**

```sql
-- ================================================
-- ANALYTICS FUNCTION - DELIVERED ORDERS ONLY
-- ================================================
-- Purpose: Calculate accurate sales stats
-- Only count orders with status = 'delivered'
-- ================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.get_analytics_stats(date, date);

-- Create analytics function
CREATE OR REPLACE FUNCTION public.get_analytics_stats(
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_orders BIGINT,
  total_revenue NUMERIC,
  total_profit NUMERIC,
  total_items_sold BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT o.id)::BIGINT as total_orders,
    COALESCE(SUM(o.total_amount), 0)::NUMERIC as total_revenue,
    COALESCE(SUM(
      (SELECT SUM(oi.quantity * (p.price - COALESCE(p.original_price, p.price)))
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = o.id)
    ), 0)::NUMERIC as total_profit,
    COALESCE(SUM(
      (SELECT SUM(oi.quantity)
       FROM order_items oi
       WHERE oi.order_id = o.id)
    ), 0)::BIGINT as total_items_sold
  FROM orders o
  WHERE o.status = 'delivered'
    AND o.created_at::date BETWEEN start_date AND end_date;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_analytics_stats(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_analytics_stats(date, date) TO anon;

-- Test the function
SELECT * FROM get_analytics_stats(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE);

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check function exists
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_analytics_stats';

-- Test with different date ranges
SELECT 'Today' as period, * FROM get_analytics_stats(CURRENT_DATE, CURRENT_DATE);
SELECT 'This Week' as period, * FROM get_analytics_stats(CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE);
SELECT 'This Month' as period, * FROM get_analytics_stats(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE);
```

#### 3. Paste & Run
- Paste SQL ke editor
- Klik **"RUN"**
- Tunggu execution selesai

#### 4. Verifikasi Success
Anda akan melihat beberapa result tabs:
- **Function created:** Success message
- **Test results:** Stats untuk 30 hari terakhir
- **Verification:** Function exists
- **Period tests:** Today, This Week, This Month stats

**Note:** Jika belum ada order dengan status "delivered", semua angka akan 0 - **INI NORMAL!**

✅ **SUCCESS!** Analytics function aktif!

#### 5. Reload Supabase Schema (PENTING!)
- Di Supabase Dashboard, klik **Settings** (gear icon, bottom left)
- Klik **API**
- Scroll ke bawah
- Klik tombol **"Reload schema"**
- Tunggu beberapa detik

Ini perlu agar Supabase REST API detect function baru.

---

## 🔴 TASK 3: SUPABASE STORAGE SETUP (5 menit)

### Kenapa Penting?
Admin perlu upload gambar produk!
Tanpa ini: Upload gambar akan error.

### Step-by-Step:

#### 1. Buka Storage Menu
- Di Supabase Dashboard, klik **"Storage"** (sidebar kiri)

#### 2. Create New Bucket
- Klik tombol **"New bucket"** (hijau, kanan atas)

**Configuration:**
- **Bucket name:** `product-images` (EXACT - jangan typo!)
- **Public bucket:** ✅ **CHECK** (SANGAT PENTING!)
- **File size limit:** 50 MB (default OK)
- **Allowed MIME types:** Leave empty (allow all images)

Klik **"Create bucket"**

#### 3. Setup Policy 1 - Public Read Access
Setelah bucket dibuat:
- Klik bucket **"product-images"**
- Klik tab **"Policies"**
- Klik **"New policy"**

**Pilih template:**
- Template: **"Allow public read access"**
- Policy name: `Public Read Access`
- Klik **"Review"**
- Klik **"Save policy"**

#### 4. Setup Policy 2 - Authenticated Upload
- Klik **"New policy"** lagi

**Pilih template:**
- Template: **"Allow authenticated users to upload"**
- Policy name: `Authenticated Upload`
- Klik **"Review"**
- Klik **"Save policy"**

#### 5. Setup Policy 3 - Authenticated Delete
- Klik **"New policy"** lagi

**Pilih template:**
- Template: **"Allow authenticated users to delete"**
- Policy name: `Authenticated Delete`
- Klik **"Review"**
- Klik **"Save policy"**

#### 6. Test Upload (Optional)
- Di bucket **"product-images"**, klik **"Upload file"**
- Upload 1 test image (JPG/PNG)
- Setelah upload, klik image
- Klik **"Copy URL"**
- Paste URL di browser baru
- Image harus muncul (public access works!)

✅ **SUCCESS!** Storage siap untuk upload gambar!

---

## ✅ VERIFICATION CHECKLIST

### Task 1: Barcode ✅
- [ ] SQL executed without errors
- [ ] Column `barcode` exists in `products` table
- [ ] Index `idx_products_barcode` created
- [ ] Sample query shows products with barcode column

**Test di website:**
1. Buka `/admin/products`
2. Lihat barcode scanner box (warna biru)
3. Ketik test barcode → Enter
4. Search harus jalan (walaupun no results OK)

### Task 2: Analytics ✅
- [ ] SQL executed without errors
- [ ] Function `get_analytics_stats` created
- [ ] Test queries return results
- [ ] Schema reloaded in Supabase

**Test di website:**
1. Buka `/admin/login`
2. Login as admin
3. Dashboard harus load (tanpa error)
4. Stats bisa 0 jika belum ada delivered order (NORMAL!)

### Task 3: Storage ✅
- [ ] Bucket `product-images` created
- [ ] Bucket is PUBLIC
- [ ] 3 policies created (Read, Upload, Delete)
- [ ] Test upload works
- [ ] Uploaded image accessible via URL

**Test di website:**
1. Buka `/admin/products/new`
2. Drag & drop image ke upload area
3. Image preview muncul
4. Save product
5. Image harus muncul di product list

---

## 🎉 ALL DONE!

**Selamat! Semua manual setup selesai dalam 12 menit!**

### What's Working Now:
✅ Barcode scanner di admin products
✅ Dashboard analytics (stats real-time)
✅ Image upload untuk products
✅ Semua 30+ features aktif 100%

### Next Steps:
**Pilihan Anda:**
- **Test everything:** Verifikasi semua features works
- **Week 1 Roadmap:** Start security audit & API completion
- **Use the system:** Upload real products & test orders

---

## 🆘 TROUBLESHOOTING

### Problem: Barcode SQL error "column already exists"
**Solution:** Sudah dijalankan sebelumnya - SKIP, sudah OK!

### Problem: Analytics function error
**Solution:**
1. Check syntax - copy paste exact dari guide
2. Check permissions - harus login sebagai project owner
3. Reload schema after execution

### Problem: Storage bucket error "name already exists"
**Solution:** Bucket sudah ada - SKIP ke step policies saja

### Problem: Image upload error 403 Forbidden
**Solution:**
1. Check bucket is PUBLIC (di bucket settings)
2. Check policies created (Read, Upload, Delete)
3. Clear browser cache & retry

### Problem: Dashboard shows Rp 0
**Solution:**
- NORMAL jika belum ada order dengan status "delivered"
- Create test order → Update status to "delivered" → Refresh dashboard

---

## 📞 NEED HELP?

Stuck? Check:
- `BARCODE_SETUP.md` - Barcode detailed guide
- `SUPABASE_STORAGE_SETUP.md` - Storage detailed guide
- `DEPLOY_NOW.md` - Deployment troubleshooting

---

**Last Updated:** 16 Januari 2026
**Status:** Ready to Execute! 🚀
