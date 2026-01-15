# 📋 SKEMA PEMESANAN LENGKAP - SAHARA MART

**Sistem**: WhatsApp Checkout dengan Database Tracking
**No. WhatsApp Toko**: 6282161173844

---

## 🛒 ALUR PEMESANAN DARI SISI PEMBELI (CUSTOMER)

### 1️⃣ BROWSING PRODUK

**Halaman**: Homepage (`/`) atau Katalog (`/katalog`)

```
Customer masuk ke website
    ↓
Lihat produk di Homepage (4 featured products)
    ↓
Atau klik "Katalog" untuk lihat semua 6,369 produk
    ↓
Filter berdasarkan:
  - Kategori (Sembako, Snack, Minuman, dll)
  - Rentang Harga (< 25rb, 25-50rb, dll)
  - Search (nama/SKU/deskripsi)
    ↓
Pagination: 24 produk per halaman
```

**Fitur di Halaman Katalog**:
- ✅ Filter kategori (dinamis dari database)
- ✅ Filter harga (5 range)
- ✅ Search box (multi-field)
- ✅ Pagination (266 halaman untuk 6,369 produk)
- ✅ Badge diskon (jika ada original_price)
- ✅ Badge stok terbatas (jika stok < 10)

---

### 2️⃣ MELIHAT DETAIL PRODUK

**Halaman**: `/produk/[id]`

```
Customer klik produk
    ↓
Lihat detail lengkap:
  - Foto produk (atau emoji 📦 jika belum ada)
  - Nama produk
  - Harga (+ harga coret jika diskon)
  - Berat
  - SKU
  - Deskripsi
  - Stok tersedia
  - Kategori
    ↓
Pilih quantity (max = stok tersedia)
```

**3 Tombol Action**:
1. **"Tambah ke Keranjang"** (Primary - merah)
   - Menambahkan produk ke cart (localStorage)
   - Muncul toast notification sukses
   - Badge di header auto update (angka item di cart)

2. **"Pesan via WhatsApp"** (Direct - hijau)
   - Langsung buka WhatsApp dengan template pesan
   - TIDAK masuk ke cart
   - TIDAK tersimpan di database

3. **"Beli Sekarang"** (Quick checkout)
   - Tambahkan ke cart + redirect ke keranjang

---

### 3️⃣ MENGELOLA KERANJANG

**Halaman**: `/keranjang`

```
Customer klik icon cart di header
    ↓
Melihat semua item di keranjang:
  - Foto produk
  - Nama + kategori
  - Harga satuan
  - Quantity (bisa +/- atau hapus)
  - Subtotal per item
  - Total keseluruhan
    ↓
Customer bisa:
  - Tambah/kurangi quantity
  - Hapus item tertentu
  - Kosongkan keranjang
  - Lanjut belanja (kembali ke katalog)
```

**Ringkasan Belanja**:
- Subtotal: Rp XXX
- Ongkir: "Akan dihitung saat checkout"
- **Total: Rp XXX** (besar, merah)

💡 Info: "Gratis Ongkir untuk belanja minimal Rp 100.000"

---

### 4️⃣ CHECKOUT VIA WHATSAPP

**Tombol**: "Checkout via WhatsApp" (hijau, prominent)

**Proses Backend** (`app/keranjang/page.tsx` baris 15-102):

```javascript
Customer klik "Checkout via WhatsApp"
    ↓
1. Build WhatsApp message (format):
   -----------------------------------
   Halo, saya ingin memesan:

   1. *Indomie Goreng 85g*
      Jumlah: 3 pcs
      Harga: Rp 3.500
      Subtotal: Rp 10.500

   2. *Aqua 600ml*
      Jumlah: 2 pcs
      Harga: Rp 4.000
      Subtotal: Rp 8.000

   *Total: Rp 18.500*

   Mohon konfirmasi ketersediaan produk dan ongkos kirim. Terima kasih!

   📋 *Order #ORD-20260113-XXXX*
   -----------------------------------
    ↓
2. CREATE ORDER di Database
   POST /api/orders
   Body: {
     customer_name: "WhatsApp Customer",
     customer_phone: "6282161173844",
     customer_address: "",
     customer_notes: "",
     cart: [
       { product_id: "xxx", quantity: 3 },
       { product_id: "yyy", quantity: 2 }
     ],
     shipping_cost: 0,
     payment_method: "whatsapp",
     whatsapp_message: "..." // pesan lengkap di atas
   }
    ↓
3. Database AUTO CALCULATE:
   - total_items (5 pcs)
   - subtotal (Rp 18.500)
   - total_amount (subtotal + shipping_cost)
   - total_cost (sum of product cost_price * qty)
   - total_profit (total_amount - total_cost)
   - profit_margin (%)
   - order_number (ORD-YYYYMMDD-XXXX)
   - status: "pending"
   - payment_status: "unpaid"
    ↓
4. Open WhatsApp Link:
   https://wa.me/6282161173844?text=[encoded_message]
    ↓
   Browser buka WhatsApp (web/app)
   Customer tinggal klik "Send" ✅
    ↓
5. Clear Cart & Redirect:
   - localStorage cart dihapus
   - Toast: "Order berhasil dibuat! Order #ORD-20260113-XXXX"
   - Redirect ke homepage
```

**Fallback**: Jika gagal create order di database, tetap buka WhatsApp (sistem resilient)

---

### 5️⃣ KOMUNIKASI DI WHATSAPP

**Yang Terjadi**:

```
Customer                           Admin (Toko Sahara)
    |                                      |
    |  Kirim pesan order via WA           |
    |----------------------------------->  |
    |                                      |
    |  <- "Terima pesanan, mohon tunggu"  |
    |                                      |
    |                                      | Cek stok produk
    |                                      | Hitung ongkir
    |                                      | Cek alamat pengiriman
    |                                      |
    |  <- "Total: Rp 18.500 + Rp 5.000    |
    |      ongkir = Rp 23.500"            |
    |                                      |
    |  "OK, kirim ke Jl. ABC No. 123"     |
    |----------------------------------->  |
    |                                      |
    |  <- "Pesanan diproses, kirim dalam  |
    |      1-2 jam"                        |
    |                                      |
    |                                      | Siapkan pesanan
    |                                      | Kirim ke customer
    |                                      |
    |  <- "Pesanan sudah dikirim!"        |
    |                                      |
```

**Customer Bayar**:
- COD (Cash on Delivery) - bayar saat terima
- Transfer bank (jika disepakati)

---

## 👨‍💼 ALUR PEMESANAN DARI SISI ADMIN

### 1️⃣ MENERIMA NOTIFIKASI WHATSAPP

```
Admin menerima pesan WhatsApp dari customer
    ↓
Lihat Order Number: #ORD-20260113-XXXX
    ↓
Login ke Admin Panel (https://sahara-mart.com/admin)
```

---

### 2️⃣ MELIHAT DAFTAR ORDER

**Halaman**: `/admin/orders`

**Dashboard Order** menampilkan:

```
┌─────────────────────────────────────────────┐
│  📦 Manajemen Pesanan                       │
├─────────────────────────────────────────────┤
│  STATISTIK:                                 │
│  [Total: 150] [Pending: 12] [Processing: 5]│
│  [Delivered: 133]                           │
├─────────────────────────────────────────────┤
│  FILTER:                                    │
│  [🔍 Search] [⚙️ Status Filter]             │
├─────────────────────────────────────────────┤
│  TABEL ORDER:                               │
│  ┌────────┬──────────┬───────┬───────┬────┐│
│  │ Order  │ Customer │ Items │ Total │ ... ││
│  ├────────┼──────────┼───────┼───────┼────┤│
│  │ORD-001 │ Budi     │ 5 pcs │ 18.5k │ ... ││
│  │ORD-002 │ Siti     │ 3 pcs │ 12.0k │ ... ││
│  └────────┴──────────┴───────┴───────┴────┘│
└─────────────────────────────────────────────┘
```

**Kolom Tabel**:
1. **Order** - Order number + tanggal
2. **Customer** - Nama + nomor telepon
3. **Items** - Jumlah item (X pcs)
4. **Total** - Total amount (Rp XXX)
5. **Profit** - Total profit + margin %
6. **Status** - Badge warna (Pending/Processing/Delivered/dll)
7. **Payment** - Badge pembayaran (Belum Bayar/Lunas)
8. **Action** - Link "Detail"

**Filter Options**:
- Search: order number atau nama customer
- Status: All, Pending, Confirmed, Processing, Shipped, Delivered, Cancelled

**Pagination**: 20 orders per halaman

---

### 3️⃣ MELIHAT DETAIL ORDER

**Halaman**: `/admin/orders/[id]`

**Klik "Detail"** → Melihat informasi lengkap:

```
┌──────────────────────────────────────────────────┐
│  ← Kembali        ORD-20260113-XXXX     [Delete] │
├──────────────────────────────────────────────────┤
│  CUSTOMER INFORMATION:                           │
│  👤 Nama: WhatsApp Customer (bisa diubah)        │
│  📞 Phone: 6282161173844                         │
│  📍 Alamat: (isi manual dari WA chat)            │
│  📝 Notes: (customer notes)                      │
├──────────────────────────────────────────────────┤
│  ORDER DETAILS:                                  │
│  📅 Created: 13 Jan 2026, 14:30                  │
│  📋 Payment Method: WhatsApp                     │
│  💬 WhatsApp Message: [lihat pesan lengkap]      │
├──────────────────────────────────────────────────┤
│  ORDER ITEMS:                                    │
│  ┌──────────────────────────────────────────┐   │
│  │ 1. Indomie Goreng 85g                    │   │
│  │    3 pcs × Rp 3.500 = Rp 10.500         │   │
│  │    Profit: Rp 1.500 (14.3%)             │   │
│  ├──────────────────────────────────────────┤   │
│  │ 2. Aqua 600ml                            │   │
│  │    2 pcs × Rp 4.000 = Rp 8.000          │   │
│  │    Profit: Rp 1.000 (12.5%)             │   │
│  └──────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│  FINANCIAL SUMMARY:                              │
│  Subtotal:      Rp 18.500                        │
│  Ongkir:        Rp 5.000 (bisa diubah)          │
│  ─────────────────────────                       │
│  Total:         Rp 23.500                        │
│  Cost:          Rp 15.000                        │
│  Profit:        Rp 8.500 (36.9%)                │
├──────────────────────────────────────────────────┤
│  UPDATE ORDER STATUS:                            │
│  Status: [Dropdown] Pending → Confirmed         │
│  Payment: [Dropdown] Unpaid → Paid              │
│  Admin Notes: [Textarea]                         │
│                                                   │
│  [💾 Save Changes]                               │
└──────────────────────────────────────────────────┘
```

---

### 4️⃣ MENGUPDATE STATUS ORDER

**Admin Flow**:

```
1. Baca WhatsApp dari customer
      ↓
2. Cek order di admin panel
      ↓
3. Konfirmasi stok + hitung ongkir
      ↓
4. Update Order:
   - Status: Pending → Confirmed
   - Isi alamat customer (dari WA chat)
   - Update shipping_cost (Rp 5.000)
   - Admin notes: "Ongkir Rp 5k, ready kirim"
   - SAVE
      ↓
5. Balas di WhatsApp:
   "Order #ORD-XXX confirmed!
    Total: Rp 23.500
    Alamat: [...]
    Estimasi kirim: 1-2 jam"
      ↓
6. Siapkan pesanan
      ↓
7. Update Order:
   - Status: Confirmed → Processing
   - SAVE
      ↓
8. Kirim pesanan
      ↓
9. Update Order:
   - Status: Processing → Shipped
   - SAVE
      ↓
10. Balas di WhatsApp:
    "Pesanan sudah dikirim!"
      ↓
11. Customer terima & bayar
      ↓
12. Update Order:
    - Status: Shipped → Delivered
    - Payment Status: Unpaid → Paid
    - SAVE
      ↓
✅ ORDER SELESAI!
```

---

### 5️⃣ STATUS ORDER LIFECYCLE

**6 Status Order**:

| Status | Warna | Icon | Arti |
|--------|-------|------|------|
| **Pending** | 🟡 Kuning | ⏰ | Baru masuk, belum dikonfirmasi |
| **Confirmed** | 🔵 Biru | ✅ | Admin sudah konfirmasi, stok OK |
| **Processing** | 🟣 Ungu | 📦 | Sedang disiapkan |
| **Shipped** | 🟢 Indigo | 🚚 | Sudah dikirim ke customer |
| **Delivered** | 🟢 Hijau | ✅ | Sudah sampai ke customer |
| **Cancelled** | 🔴 Merah | ❌ | Dibatalkan (stok habis/customer batal) |

**2 Status Payment**:

| Status | Warna | Icon | Arti |
|--------|-------|------|------|
| **Unpaid** | ⚪ Abu-abu | 💰 | Belum bayar |
| **Paid** | 🟢 Hijau | ✅ | Sudah lunas |

---

### 6️⃣ MENGHAPUS ORDER

**Tombol**: "Delete Order" (merah, pojok kanan atas)

```
Admin klik Delete
    ↓
Konfirmasi: "Hapus order #ORD-XXX?"
    ↓
Jika YES:
  - DELETE dari database (permanent)
  - Redirect ke /admin/orders
  - Toast: "Order berhasil dihapus!"
```

⚠️ **Warning**: Delete permanent, tidak bisa di-restore!

---

## 📊 ANALYTICS & REPORTING

### Dashboard Admin (`/admin`)

**Melihat Statistik Penjualan**:

```
┌────────────────────────────────────────────┐
│  💰 RINGKASAN PENJUALAN                    │
├────────────────────────────────────────────┤
│  TODAY          WEEK          MONTH        │
│  Revenue: 500k  Revenue: 3.5M Revenue: 15M │
│  Orders: 12     Orders: 85    Orders: 350  │
│  Profit: 180k   Profit: 1.2M  Profit: 5.4M │
├────────────────────────────────────────────┤
│  📈 TREND 4 MINGGU TERAKHIR                │
│  [Line chart revenue & profit]             │
├────────────────────────────────────────────┤
│  🏆 TOP 5 PRODUK TERLARIS                  │
│  1. Indomie Goreng - 1,250 pcs terjual     │
│  2. Aqua 600ml - 890 pcs                   │
│  3. Mie Sedaap Goreng - 720 pcs           │
│  ... dst                                   │
├────────────────────────────────────────────┤
│  📦 STATUS PRODUK                          │
│  Total: 6,369  Aktif: 6,300               │
│  Stok Menipis: 50  Stok Habis: 19         │
├────────────────────────────────────────────┤
│  📊 VISUALISASI DATA                       │
│  [Revenue Chart]  [Orders Chart]           │
│  [Category Pie Chart]                      │
└────────────────────────────────────────────┘
```

**Data Real-Time**:
- ✅ Update otomatis setiap ada order baru
- ✅ Profit tracking per produk
- ✅ Profit margin percentage
- ✅ Top products by quantity & revenue
- ✅ Sales trend by week/month
- ✅ Category performance

---

## 🔄 SUMMARY FLOW

### Customer Journey:
```
Browse → Detail → Add to Cart → Checkout → WhatsApp → Terima Barang → Bayar
```

### Admin Journey:
```
Terima WA → Cek Order di Admin → Update Status → Siapkan → Kirim → Delivered
```

---

## 📌 KEY POINTS

### Kelebihan Sistem:

1. **✅ Hybrid System**: Database + WhatsApp
   - Order tersimpan di database (tracking, analytics)
   - Customer tetap chat WA (familiar, personal)

2. **✅ Automatic Calculations**:
   - Subtotal, total, cost, profit auto-calculated
   - Profit margin per item & per order

3. **✅ Flexible**:
   - Admin bisa update shipping_cost manual
   - Admin bisa isi alamat dari WA chat
   - Admin bisa ubah customer info

4. **✅ Analytics Ready**:
   - Dashboard lengkap
   - Charts & graphs
   - Top products tracking

5. **✅ Resilient**:
   - Jika database gagal, WhatsApp tetap jalan
   - Fallback mechanisms

### Yang Perlu Dilakukan Manual:

1. **Admin harus**:
   - Isi alamat customer dari WA chat
   - Hitung ongkir manual (belum auto)
   - Update status order manual
   - Balas WA manual

2. **Customer harus**:
   - Kirim alamat via WA
   - Konfirmasi pesanan via WA
   - Bayar saat terima (COD)

---

## 🎯 RECOMMENDATIONS

### Untuk Admin:
1. Cek `/admin/orders` setiap ada WA masuk
2. Update status order secara berkala
3. Pantau dashboard untuk analytics
4. Gunakan filter untuk cari order spesifik

### Untuk Customer:
1. Checkout via WhatsApp (bukan Pesan WA langsung)
2. Sertakan alamat lengkap di WA
3. Simpan Order Number untuk tracking

---

**System Status**: ✅ Fully Functional
**Database**: Supabase PostgreSQL
**WhatsApp**: 6282161173844
**Live URL**: TBD (belum deploy)
