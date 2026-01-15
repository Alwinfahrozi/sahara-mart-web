# 📊 PENJELASAN DASHBOARD ANALYTICS

## 🎯 PERBEDAAN 3 CARDS

Dashboard memiliki 3 kartu yang menampilkan data berbeda berdasarkan **PERIODE WAKTU**:

---

### 1️⃣ HARI INI (Today)

**Warna:** 🔵 Biru

**Menampilkan:**
- Revenue (Pendapatan)
- Orders (Jumlah pesanan)
- Items (Total barang terjual)
- Profit (Keuntungan)
- Margin (%)

**Filter:**
```sql
DATE(created_at) = CURRENT_DATE
AND status = 'delivered'
```

**Artinya:**
Order yang **dibuat DAN delivered HARI INI SAJA**.

**Contoh (Hari ini: 14 Januari 2026, Selasa):**
- ✅ Order created 14 Jan, delivered 14 Jan → **MASUK**
- ❌ Order created 14 Jan, pending → **TIDAK MASUK** (belum delivered)
- ❌ Order created 13 Jan, delivered 14 Jan → **TIDAK MASUK** (created kemarin)
- ❌ Order created 15 Jan → **TIDAK MASUK** (besok)

**Gunakan untuk:**
- Monitoring penjualan real-time hari ini
- Target harian
- Perbandingan dengan kemarin

---

### 2️⃣ MINGGU INI (This Week)

**Warna:** 🟢 Hijau

**Menampilkan:**
- Revenue (Pendapatan)
- Orders (Jumlah pesanan)
- Items (Total barang terjual)
- Profit (Keuntungan)
- Margin (%)

**Filter:**
```sql
created_at >= DATE_TRUNC('week', CURRENT_DATE)
AND status = 'delivered'
```

**Artinya:**
Order yang **dibuat MINGGU INI (Senin-Minggu) DAN sudah delivered**.

**Contoh (Hari ini: 14 Januari 2026, Selasa):**

Minggu ini dimulai dari: **Senin, 13 Januari 2026**

- ✅ Order 13 Jan (Senin) delivered → **MASUK**
- ✅ Order 14 Jan (Selasa) delivered → **MASUK**
- ✅ Order 15 Jan (Rabu) delivered → **MASUK**
- ❌ Order 12 Jan (Minggu lalu) delivered → **TIDAK MASUK**
- ❌ Order 14 Jan pending → **TIDAK MASUK** (belum delivered)

**Grafik "Trend 4 Minggu Terakhir":**
Menampilkan perbandingan 4 minggu:
- Minggu 1: 6-12 Jan → Rp 500.000
- Minggu 2: 13-19 Jan (minggu ini) → Rp 121.000
- Minggu 3: 20-26 Jan → Rp 0 (belum terjadi)
- Minggu 4: 27 Jan - 2 Feb → Rp 0 (belum terjadi)

**Gunakan untuk:**
- Target mingguan
- Perbandingan performa antar minggu
- Planning stock mingguan

---

### 3️⃣ BULAN INI (This Month)

**Warna:** 🟣 Ungu

**Menampilkan:**
- Revenue (Pendapatan)
- Orders (Jumlah pesanan)
- Items (Total barang terjual)
- Profit (Keuntungan)
- Margin (%)

**Filter:**
```sql
created_at >= DATE_TRUNC('month', CURRENT_DATE)
AND status = 'delivered'
```

**Artinya:**
Order yang **dibuat BULAN INI (1-31) DAN sudah delivered**.

**Contoh (Hari ini: 14 Januari 2026, Selasa):**

Bulan ini dimulai dari: **1 Januari 2026**

- ✅ Order 5 Jan delivered → **MASUK**
- ✅ Order 14 Jan delivered → **MASUK**
- ✅ Order 20 Jan delivered → **MASUK**
- ❌ Order 30 Des delivered → **TIDAK MASUK** (bulan lalu)
- ❌ Order 14 Jan pending → **TIDAK MASUK** (belum delivered)

**Grafik "Top 5 Produk Terlaris (Bulan Ini)":**
Menampilkan produk dengan penjualan terbanyak bulan ini:
1. NICE KILOAN → 1 pcs, Rp 45.000, Profit Rp 11.000
2. ARDILES → 1 pcs, Rp 71.000, Profit Rp 28.000
3. jasa kado → ...

**Gunakan untuk:**
- Target bulanan
- Laporan ke owner/investor
- Planning stock bulan depan
- Analisa produk terlaris

---

## ❓ KENAPA ANGKANYA SAMA?

Jika ketiga card menunjukkan angka yang sama (misal: Rp 121.000), artinya:

**Order hanya ada 1, dibuat hari ini, di minggu ini, di bulan ini.**

**Contoh:**
- Order created: **14 Januari 2026** (Selasa)
- Status: **delivered**
- Total: **Rp 121.000**

**Breakdown:**
- ✅ Hari ini = 14 Jan → **MASUK** (created 14 Jan)
- ✅ Minggu ini = 13-19 Jan → **MASUK** (14 Jan ada di range ini)
- ✅ Bulan ini = 1-31 Jan → **MASUK** (14 Jan ada di range ini)

**Jadi ketiga card menghitung order yang SAMA!**

---

## 🔄 SCENARIO: LEBIH BANYAK ORDER

### Skenario 1: Order di hari berbeda

**Orders:**
- 10 Jan: 5 orders, Rp 500.000 delivered
- 13 Jan: 3 orders, Rp 300.000 delivered
- 14 Jan: 2 orders, Rp 200.000 delivered (TODAY)

**Dashboard (14 Jan, Selasa):**
- 🔵 **Hari Ini:** Rp 200.000 (hanya 14 Jan)
- 🟢 **Minggu Ini:** Rp 500.000 (13 Jan + 14 Jan, minggu dimulai 13 Jan/Senin)
- 🟣 **Bulan Ini:** Rp 1.000.000 (10 Jan + 13 Jan + 14 Jan)

---

### Skenario 2: Order banyak tapi pending

**Orders:**
- 14 Jan: 10 orders, Rp 2.000.000, **status = pending** ❌
- 14 Jan: 2 orders, Rp 300.000, **status = delivered** ✅

**Dashboard (14 Jan):**
- 🔵 **Hari Ini:** Rp 300.000 (hanya yang delivered)
- 🟢 **Minggu Ini:** Rp 300.000
- 🟣 **Bulan Ini:** Rp 300.000

**Kenapa Rp 2.000.000 tidak masuk?**
Karena status masih **pending**, belum **delivered**!

---

## 🎯 PERUBAHAN SETELAH UPDATE SQL

### ❌ SEBELUM (Filter Lama):
```sql
WHERE status NOT IN ('cancelled')
```

**Masalah:**
- Menghitung **semua status** kecuali cancelled
- Termasuk: pending, confirmed, processing, shipped, delivered
- **Order pending ikut dihitung** → SALAH!

**Hasil:**
- Order pending Rp 121.000 → Dashboard: Rp 121.000 ❌

---

### ✅ SEKARANG (Filter Baru):
```sql
WHERE status = 'delivered'
```

**Benar:**
- Hanya menghitung status **delivered**
- Tidak termasuk: pending, confirmed, processing, shipped
- **Hanya order yang sudah selesai**

**Hasil:**
- Order pending Rp 121.000 → Dashboard: Rp 0 ✅
- Order delivered Rp 121.000 → Dashboard: Rp 121.000 ✅

---

## 📋 FLOW ORDER STATUS

```
pending → confirmed → processing → shipped → delivered
   ↓          ↓           ↓          ↓          ↓
Rp 0       Rp 0        Rp 0       Rp 0    Rp 121.000
(belum)    (belum)     (belum)    (belum)   (MASUK!)
```

**Dashboard hanya menghitung saat status = delivered!**

---

## 🧪 TESTING

### Test 1: Order Baru (Pending)
1. Create order → status = 'pending'
2. Check dashboard → **Rp 0** ✅ (benar, belum delivered)

### Test 2: Update ke Delivered
1. Update order → status = 'delivered'
2. Check dashboard → **Rp 121.000** ✅ (benar, sudah delivered)

### Test 3: Kembali ke Pending
1. Update order → status = 'pending'
2. Check dashboard → **Rp 0** ✅ (benar, belum delivered lagi)

### Test 4: Multiple Orders
1. Order A: 14 Jan, delivered → **Masuk**
2. Order B: 14 Jan, pending → **Tidak masuk**
3. Order C: 13 Jan, delivered → **Masuk minggu ini & bulan ini**
4. Order D: 5 Jan, delivered → **Masuk bulan ini saja**

---

## 📊 VISUALIZATION

```
┌─────────────────────────────────────────────────────────────┐
│                    JANUARI 2026                             │
├─────────────────────────────────────────────────────────────┤
│ Sen Sen Rab Kam Jum Sab Min | Sen Sen Rab Kam Jum Sab Min  │
│                  1   2   3  |  4   5   6   7   8   9  10   │
│                                                             │
│  Week 1: 30 Des - 5 Jan     |  Week 2: 6-12 Jan            │
│  Orders: 20 → Rp 2.000.000  |  Orders: 15 → Rp 1.500.000   │
│                                                             │
│  13  14  15  16  17  18  19 |  20  21  22  23  24  25  26  │
│  ★   ●                      |                              │
│  Week 3: 13-19 Jan (NOW!)   |  Week 4: 20-26 Jan           │
│  Orders: 5 → Rp 500.000     |  Orders: 0 → Rp 0            │
│        ↑                    |                              │
│    Today: 14 Jan            |                              │
│    Orders: 2 → Rp 200.000   |                              │
└─────────────────────────────────────────────────────────────┘

LEGEND:
★ = Minggu dimulai (Senin)
● = Hari ini (14 Jan, Selasa)

DASHBOARD:
🔵 Hari Ini: Rp 200.000 (14 Jan saja)
🟢 Minggu Ini: Rp 500.000 (Week 3: 13-19 Jan)
🟣 Bulan Ini: Rp 4.200.000 (Total semua week)
```

---

## 💡 TIPS

### 1. Monitoring Real-Time
Gunakan card **"Hari Ini"** untuk monitoring penjualan real-time.

### 2. Target Harian
Set target: "Minimal Rp 500.000/hari"
Check card "Hari Ini" apakah sudah tercapai.

### 3. Target Mingguan
Set target: "Minimal Rp 3.000.000/minggu"
Check card "Minggu Ini" dan grafik trend.

### 4. Target Bulanan
Set target: "Minimal Rp 10.000.000/bulan"
Check card "Bulan Ini".

### 5. Analisa Produk
Lihat "Top 5 Produk Terlaris" untuk:
- Restock produk populer
- Promosi produk kurang laku
- Planning inventory

---

## 🔧 CARA UPDATE

### Step 1: Deploy SQL Baru
```bash
# Run di Supabase SQL Editor:
database/DEPLOY_ANALYTICS_DELIVERED_ONLY.sql
```

### Step 2: Reload Schema
```
Supabase → Settings → API → Reload schema
```

### Step 3: Refresh Dashboard
```
Ctrl + Shift + R (hard refresh)
```

### Step 4: Test
```
1. Create order → pending → Check dashboard (Rp 0)
2. Update order → delivered → Check dashboard (Rp 121.000)
3. Success! ✅
```

---

**Last Updated:** 2026-01-14
**Status:** Ready to deploy
