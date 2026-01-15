# 📦 STOCK MANAGEMENT SYSTEM - Setup Guide

## ✨ Features

1. **Notifikasi Otomatis** - Alert di dashboard saat stok ≤ 5
2. **Halaman Manajemen Stok** - Kelola stok rendah & habis
3. **Tambah Stok** - Form untuk menambah stok dengan alasan
4. **Riwayat Log Stok** - Semua perubahan stok tercatat
5. **API Lengkap** - Endpoints untuk notifications, add stock, dan logs

---

## 🗄️ Step 1: Setup Database

### 1.1 Buka Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select project: **Sahara Mart**
3. Klik **SQL Editor** (di sidebar kiri)

### 1.2 Jalankan SQL Script

1. Klik **"+ New Query"**
2. Copy seluruh isi file: `database/create_stock_logs_table.sql`
3. Paste ke SQL Editor
4. Klik **"Run"** (atau press Ctrl+Enter)

### 1.3 Verify Tables & Views Created

Setelah run berhasil, check:

```sql
-- Check stock_logs table
SELECT * FROM public.stock_logs LIMIT 5;

-- Check low stock view
SELECT * FROM public.low_stock_products;

-- Check out of stock view
SELECT * FROM public.out_of_stock_products;

-- Check stock movement summary
SELECT * FROM public.stock_movement_summary;
```

✅ Jika semua query berhasil, database setup **DONE!**

---

## 📋 Step 2: Struktur Database

### Tabel: `stock_logs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `product_id` | UUID | FK ke products |
| `type` | VARCHAR(20) | Tipe: addition, reduction, adjustment, order, return |
| `quantity_before` | INTEGER | Stok sebelum perubahan |
| `quantity_change` | INTEGER | Perubahan (+/-) |
| `quantity_after` | INTEGER | Stok setelah perubahan |
| `reason` | TEXT | Alasan perubahan |
| `notes` | TEXT | Catatan tambahan |
| `performed_by` | UUID | Admin yang melakukan |
| `order_id` | UUID | FK ke orders (jika dari order) |
| `created_at` | TIMESTAMPTZ | Waktu perubahan |

### Views:

1. **low_stock_products** - Produk dengan stok ≤ 5 dan > 0
2. **out_of_stock_products** - Produk dengan stok = 0
3. **stock_movement_summary** - Ringkasan pergerakan stok 30 hari

---

## 🚀 Step 3: Test Features

### 3.1 Test Notifikasi Dashboard

1. Buka Admin Dashboard: `https://yourdomain.com/admin`
2. Jika ada produk dengan stok ≤ 5, akan muncul **banner orange** di atas
3. Banner menampilkan:
   - Jumlah produk stok menipis
   - Jumlah produk stok habis
   - Button "Kelola Stok" → ke halaman Stock Management

### 3.2 Test Halaman Stock Management

1. Klik menu **"Stok"** di sidebar admin
2. Atau langsung: `https://yourdomain.com/admin/stock`
3. Halaman menampilkan:
   - **3 Summary Cards**: Stok Menipis, Stok Habis, Total Kritis
   - **List Produk Stok Menipis** (jika ada)
   - **List Produk Stok Habis** (jika ada)
   - **Riwayat Perubahan Stok** (10 terakhir)

### 3.3 Test Tambah Stok

1. Di halaman Stock Management
2. Klik **"+ Tambah"** atau **"Restock"** di card produk
3. Modal muncul dengan form:
   - Jumlah yang ditambah (required)
   - Alasan (dropdown: Restock bulanan, Pembelian supplier, dll)
   - Catatan (optional)
4. Klik **"Simpan"**
5. Check:
   - ✅ Toast success muncul
   - ✅ Stok produk bertambah
   - ✅ Muncul di riwayat log

### 3.4 Test API Endpoints

**Get Stock Notifications:**
```bash
GET /api/stock/notifications
```
Response:
```json
{
  "success": true,
  "data": {
    "lowStockProducts": [...],
    "outOfStockProducts": [...],
    "summary": {
      "totalLowStock": 3,
      "totalOutOfStock": 1,
      "totalCritical": 4
    }
  }
}
```

**Add Stock:**
```bash
POST /api/stock/add
Content-Type: application/json

{
  "productId": "uuid-here",
  "quantityToAdd": 50,
  "reason": "Restock bulanan",
  "notes": "Pembelian dari supplier ABC"
}
```

**Get Stock Logs:**
```bash
GET /api/stock/logs?limit=20&offset=0
```

---

## 🔧 Step 4: Customize (Optional)

### 4.1 Ubah Threshold Stok Rendah

Default: Stok ≤ 5 dianggap rendah

**Ubah di:**
1. API: `app/api/stock/notifications/route.ts` line 34
   ```ts
   .lte('stock', 5) // Ganti 5 jadi nilai lain
   ```

2. View: `database/create_stock_logs_table.sql` line 104
   ```sql
   WHERE p.stock <= 5 -- Ganti 5 jadi nilai lain
   ```

### 4.2 Tambah Tipe Log Baru

Edit: `database/create_stock_logs_table.sql` line 17

```sql
type VARCHAR(20) NOT NULL CHECK (type IN (
  'addition',      -- Tambah stok
  'reduction',     -- Kurang stok
  'adjustment',    -- Penyesuaian
  'order',         -- Dari pesanan
  'return',        -- Retur
  'damaged'        -- Rusak (NEW!)
))
```

### 4.3 Tambah Auto-Notification Email

Di `app/api/stock/notifications/route.ts`, tambahkan:

```ts
// Send email notification if critical
if (totalCritical > 0) {
  await sendEmailNotification({
    to: 'admin@saharamart.com',
    subject: `⚠️ ${totalCritical} Produk Perlu Restock`,
    body: `Ada ${totalCritical} produk yang perlu direstock segera.`
  });
}
```

---

## 📊 Step 5: Monitoring & Analytics

### Query Berguna:

**1. Top 10 Produk Sering Restock:**
```sql
SELECT
  p.name,
  COUNT(*) as restock_count,
  SUM(sl.quantity_change) as total_added
FROM stock_logs sl
JOIN products p ON sl.product_id = p.id
WHERE sl.type = 'addition'
  AND sl.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, p.name
ORDER BY restock_count DESC
LIMIT 10;
```

**2. Total Perubahan Stok Hari Ini:**
```sql
SELECT
  type,
  COUNT(*) as count,
  SUM(ABS(quantity_change)) as total_units
FROM stock_logs
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY type;
```

**3. Produk Paling Cepat Habis:**
```sql
SELECT
  p.name,
  p.stock,
  SUM(CASE WHEN sl.type = 'order' THEN ABS(sl.quantity_change) ELSE 0 END) as sold_last_7days,
  ROUND(p.stock::DECIMAL / NULLIF(SUM(CASE WHEN sl.type = 'order' THEN ABS(sl.quantity_change) ELSE 0 END), 0) * 7, 1) as days_until_out
FROM products p
LEFT JOIN stock_logs sl ON p.id = sl.product_id
  AND sl.created_at >= NOW() - INTERVAL '7 days'
WHERE p.stock > 0
GROUP BY p.id, p.name, p.stock
HAVING SUM(CASE WHEN sl.type = 'order' THEN ABS(sl.quantity_change) ELSE 0 END) > 0
ORDER BY days_until_out ASC
LIMIT 10;
```

---

## ✅ Checklist Deployment

- [ ] SQL script dijalankan di Supabase
- [ ] Verify tabel `stock_logs` ada
- [ ] Verify 3 views ada (low_stock, out_of_stock, stock_movement)
- [ ] Test API `/api/stock/notifications`
- [ ] Test API `/api/stock/add`
- [ ] Test API `/api/stock/logs`
- [ ] Test halaman `/admin/stock`
- [ ] Test alert banner di dashboard
- [ ] Test tambah stok via modal
- [ ] Test riwayat log muncul

---

## 🐛 Troubleshooting

### Problem: "Table already exists"

**Solution:**
```sql
-- Drop table first
DROP TABLE IF EXISTS public.stock_logs CASCADE;

-- Then run the create script again
```

### Problem: "RLS policies conflict"

**Solution:**
```sql
-- Drop all policies
DROP POLICY IF EXISTS "Admin can view all stock logs" ON public.stock_logs;
DROP POLICY IF EXISTS "Admin can insert stock logs" ON public.stock_logs;

-- Then run the policy creation again
```

### Problem: "View does not exist"

**Solution:**
```sql
-- Recreate views
CREATE OR REPLACE VIEW public.low_stock_products AS ...
```

---

## 📞 Support

Jika ada masalah:
1. Check browser console (F12) untuk error
2. Check Supabase logs: Dashboard → Logs
3. Check API response di Network tab

---

**🎉 Stock Management System Ready!**

Last Updated: 16 Januari 2026
Status: Production Ready ✅
