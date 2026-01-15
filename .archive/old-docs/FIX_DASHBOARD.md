# 🔧 FIX DASHBOARD - STEP BY STEP

**Masalah:** Dashboard menampilkan Rp 0 padahal ada order dengan profit Rp 41.000

**Penyebab:** Fungsi-fungsi analytics belum di-deploy ke database Supabase

---

## LANGKAH-LANGKAH FIX

### 1️⃣ Deploy Analytics Functions ke Supabase

**File:** `database/DEPLOY_ANALYTICS.sql`

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project "Sahara Mart"
3. Klik "SQL Editor" di sidebar kiri
4. Klik "New Query"
5. Copy SELURUH ISI file `database/DEPLOY_ANALYTICS.sql`
6. Paste ke SQL Editor
7. Klik "Run" (atau Ctrl+Enter)
8. Tunggu sampai selesai (akan muncul hasil test di bawah)

**Expected Output:**
```
✅ Function created: get_today_sales
✅ Function created: get_this_week_sales
✅ Function created: get_this_month_sales
✅ View created: daily_sales
✅ View created: weekly_sales
✅ View created: monthly_sales
✅ View created: top_selling_products
✅ View created: sales_by_category
```

**PENTING:** Setelah run SQL, Anda akan melihat test results showing data dari order yang sudah ada!

---

### 2️⃣ Reload Supabase Schema Cache

**Lokasi:** Supabase Dashboard → Settings → API

1. Masih di Supabase Dashboard
2. Klik "Settings" (gear icon) di sidebar
3. Klik "API"
4. Scroll ke bawah
5. Cari tombol **"Reload schema"** atau **"Reload"**
6. Klik tombol tersebut
7. Tunggu beberapa detik

**Kenapa penting?** Supabase cache fungsi-fungsi database. Tanpa reload, API masih akan error meskipun fungsi sudah dibuat.

---

### 3️⃣ Test Analytics API (Optional)

**Command:**
```bash
npm run dev
# Di terminal lain:
node scripts/test-analytics.js
```

**Expected Output:**
```
🧪 TESTING ANALYTICS ENDPOINTS
============================================================

📊 Test 1: GET /api/analytics/today
✅ Success!
Today Stats: {
  "total_orders": "1",
  "total_items": "2",
  "total_revenue": "41000",
  "total_profit": "8000",
  "avg_profit_margin": "19.51"
}

📊 Test 2: GET /api/analytics/weekly
✅ Success!
Week Stats: { ... }

📊 Test 3: GET /api/analytics/monthly
✅ Success!
Month Stats: { ... }

✅ TESTING COMPLETE!
```

---

### 4️⃣ Refresh Admin Dashboard

1. Buka browser
2. Go to: http://localhost:3000/admin
3. Tekan **Ctrl+Shift+R** (hard refresh untuk clear cache)
4. Dashboard sekarang harus menampilkan data yang benar!

**Expected Result:**
```
Hari Ini:
- Pendapatan: Rp 41.000
- Profit: Rp 8.000
- Margin: 19,51%

Minggu Ini:
- Pendapatan: Rp 41.000
- Profit: Rp 8.000

Bulan Ini:
- Pendapatan: Rp 41.000
- Profit: Rp 8.000
```

---

## TROUBLESHOOTING

### ❌ Masih Rp 0 setelah deploy?

**Check 1: Verifikasi fungsi sudah dibuat**
```sql
-- Run di Supabase SQL Editor:
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'get_%_sales';
```

Harus return 3 fungsi:
- get_today_sales
- get_this_week_sales
- get_this_month_sales

**Check 2: Test fungsi langsung**
```sql
-- Run di Supabase SQL Editor:
SELECT * FROM get_today_sales();
SELECT * FROM get_this_week_sales();
SELECT * FROM get_this_month_sales();
```

Jika return empty (0 values), cek order Anda:

**Check 3: Verifikasi order data**
```sql
-- Run di Supabase SQL Editor:
SELECT
  order_number,
  status,
  total_items,
  subtotal,
  total_profit,
  is_deleted,
  DATE(created_at) as order_date,
  CURRENT_DATE as today
FROM orders
WHERE order_number = 'ORD-20260113-001';
```

**Possible Issues:**
1. `is_deleted` = TRUE → Order dihapus (soft delete)
2. `status` = 'cancelled' → Order dibatalkan
3. `created_at` bukan hari ini → Cek pakai get_this_week_sales() atau get_this_month_sales()
4. `total_profit` = NULL → Perlu recalculate

---

### ❌ Error: "function get_today_sales() does not exist"

**Artinya:** SQL script belum di-run atau reload schema belum dilakukan.

**Fix:**
1. Run `database/DEPLOY_ANALYTICS.sql` lagi di Supabase
2. **PASTI** reload schema di Settings → API
3. Restart Next.js dev server (`npm run dev`)

---

### ❌ Error: "could not serialize access due to concurrent update"

**Artinya:** Ada race condition di trigger recalculate_order_totals.

**Fix:** Sudah di-handle di code, coba refresh lagi.

---

## PENJELASAN TEKNIS

### Apa yang dilakukan DEPLOY_ANALYTICS.sql?

1. **Create Functions:**
   - `get_today_sales()` - Count orders created TODAY
   - `get_this_week_sales()` - Count orders created THIS WEEK
   - `get_this_month_sales()` - Count orders created THIS MONTH

2. **Create Views:**
   - `daily_sales` - Aggregate by day
   - `weekly_sales` - Aggregate by week
   - `monthly_sales` - Aggregate by month
   - `top_selling_products` - Best sellers
   - `sales_by_category` - Sales per kategori

3. **Filter Logic:**
   ```sql
   WHERE (is_deleted = FALSE OR is_deleted IS NULL)
     AND status NOT IN ('cancelled')
   ```

   **Artinya:**
   - Exclude soft-deleted orders
   - Exclude cancelled orders
   - INCLUDE: pending, confirmed, processing, shipped, **delivered**

4. **Profit Calculation:**
   ```sql
   total_revenue = SUM(subtotal)  -- Total harga jual
   total_profit = SUM(total_profit)  -- Total profit (sudah dihitung di order)
   avg_profit_margin = AVG(profit_margin)  -- Average margin %
   ```

---

## VERIFICATION CHECKLIST

Setelah fix, check semua ini:

- [ ] SQL script berhasil run tanpa error
- [ ] Reload schema sudah dilakukan
- [ ] Test analytics script menunjukkan data (not 0)
- [ ] Dashboard menampilkan revenue/profit yang benar
- [ ] Grafik minggu ini menunjukkan data
- [ ] Top products menampilkan produk yang terjual
- [ ] Total orders count sesuai dengan orders page

---

## EXPECTED TIMELINE

**Total Time:** 5-10 menit

1. Deploy SQL: 2 menit
2. Reload schema: 30 detik
3. Test API: 1 menit
4. Refresh dashboard: 10 detik
5. Verify: 2 menit

---

## NOTES

### Perubahan dari sales_schema.sql:

**Original:**
```sql
WHERE o.is_deleted = FALSE
```

**Fixed:**
```sql
WHERE (o.is_deleted = FALSE OR o.is_deleted IS NULL)
```

**Kenapa?** Karena jika `is_deleted` column belum ada atau berisi NULL, filter `= FALSE` akan exclude order tersebut. Dengan `OR is_deleted IS NULL`, kita handle semua case.

---

**Last Updated:** 2026-01-14
**Status:** Ready to deploy
**Impact:** HIGH - Fixes critical dashboard issue

---

## SETELAH DASHBOARD FIX

Order baru yang masuk akan otomatis:
1. ✅ Masuk ke analytics
2. ✅ Update dashboard real-time
3. ✅ Tampil di grafik
4. ✅ Masuk ke top products

**Tidak perlu run script lagi!** Functions & views persistent di database.
