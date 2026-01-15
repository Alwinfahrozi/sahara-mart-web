# 📦 STOCK MANAGEMENT - Sahara Mart

**Date:** 15 Januari 2026, 23:00 WIB
**Status:** ✅ COMPLETE & TESTED

---

## 🎯 Overview

Sistem manajemen stok otomatis yang mengurangi stok produk saat order dibuat dan mengembalikan stok saat order dibatalkan atau dihapus.

---

## ✅ Features Implemented

### 1. **Automatic Stock Deduction on Order Creation** 📉
Ketika customer membuat pesanan, stok produk otomatis berkurang.

**Location:** `app/api/orders/route.ts` (POST method)

**Flow:**
1. Customer membuat order dengan cart items
2. System validasi stok tersedia untuk setiap produk
3. Jika stok cukup, order dibuat
4. Stok setiap produk dikurangi sesuai quantity yang dipesan
5. Order berhasil dibuat dengan stok ter-update

**Example:**
```
Produk: INDOMIE GORENG
Stok sebelum order: 100
Quantity dipesan: 5
Stok setelah order: 95 ✅
```

---

### 2. **Stock Validation Before Order** ✋
Sistem tidak akan membuat order jika stok tidak cukup.

**Validation Checks:**
- ✅ Produk harus tersedia di database
- ✅ Quantity harus lebih dari 0
- ✅ Quantity maksimal 100 per produk
- ✅ **Stok harus cukup** (stock >= quantity)

**Error Response jika stok tidak cukup:**
```json
{
  "error": "Stok tidak cukup untuk produk: INDOMIE GORENG",
  "message": "Stok tersedia: 3, diminta: 5"
}
```

User akan mendapat notifikasi dan tidak bisa checkout sampai mereka mengurangi quantity atau menghapus produk dari cart.

---

### 3. **Automatic Stock Restoration on Order Cancellation** 🔄
Ketika admin membatalkan order (status → "cancelled"), stok dikembalikan.

**Location:** `app/api/orders/[id]/route.ts` (PATCH method)

**Flow:**
1. Admin mengubah status order dari "pending/processing" → "cancelled"
2. System deteksi perubahan status ke "cancelled"
3. System ambil semua order_items dari order tersebut
4. Stok setiap produk dikembalikan sesuai quantity yang dipesan
5. Order status berhasil diubah dengan stok ter-restore

**Example:**
```
Order #123: INDOMIE GORENG x 5
Stok saat ini: 95

Admin cancel order →
Stok dikembalikan: 95 + 5 = 100 ✅
```

**Important Notes:**
- ✅ Stok hanya dikembalikan jika status berubah dari non-cancelled → cancelled
- ✅ Jika order sudah cancelled, tidak akan restore lagi (prevent double restore)
- ✅ Logging untuk tracking: "Stock restored for product [name]: [old] → [new]"

---

### 4. **Automatic Stock Restoration on Order Deletion** 🗑️
Ketika admin menghapus order (soft delete), stok dikembalikan.

**Location:** `app/api/orders/[id]/route.ts` (DELETE method)

**Flow:**
1. Admin menghapus order dari admin panel
2. System ambil order details sebelum delete
3. Jika order status bukan "cancelled", restore stok
4. Stok setiap produk dikembalikan
5. Order di-soft delete (is_deleted = true)

**Example:**
```
Order #456: INDOMIE GORENG x 3
Stok saat ini: 95
Status: pending

Admin delete order →
Stok dikembalikan: 95 + 3 = 98 ✅
Order soft deleted (masih ada di database, tapi is_deleted = true)
```

**Important Notes:**
- ✅ Jika order sudah cancelled, tidak restore stok (sudah di-restore saat cancel)
- ✅ Prevent double restoration
- ✅ Soft delete (data tidak hilang, hanya ditandai is_deleted = true)

---

## 🔄 Stock Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CUSTOMER CREATES ORDER                │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌─────────────────────────────────┐
         │  Validate Stock Availability     │
         │  stock >= quantity ?             │
         └─────────────────────────────────┘
                  ↓              ↓
              ✅ YES          ❌ NO
                  ↓              ↓
         ┌────────────────┐  Return Error:
         │  Create Order  │  "Stok tidak cukup"
         └────────────────┘
                  ↓
         ┌────────────────┐
         │  Reduce Stock  │
         │  stock = stock - qty
         └────────────────┘
                  ↓
         ┌────────────────┐
         │  Order Created │
         │  Status: pending
         └────────────────┘


┌─────────────────────────────────────────────────────────┐
│              ADMIN CANCELS OR DELETES ORDER              │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌─────────────────────────────────┐
         │  Check Current Order Status      │
         │  status == 'cancelled' ?         │
         └─────────────────────────────────┘
                  ↓              ↓
             ❌ CANCELLED    ✅ NOT CANCELLED
                  ↓              ↓
         Skip restoration   ┌────────────────┐
         (already restored) │  Restore Stock │
                           │  stock = stock + qty
                           └────────────────┘
                                  ↓
                           ┌────────────────┐
                           │  Update Status │
                           │  or Soft Delete│
                           └────────────────┘
```

---

## 📝 Code Examples

### Example 1: Create Order (Stock Deduction)

**Request:**
```bash
POST /api/orders
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "08123456789",
  "customer_address": "Jl. Test No. 123",
  "cart": [
    {
      "product_id": 1,
      "quantity": 5
    },
    {
      "product_id": 2,
      "quantity": 3
    }
  ]
}
```

**What Happens:**
1. System fetch products ID 1 & 2
2. Validate stock:
   - Product 1: stock = 100, quantity = 5 → ✅ OK
   - Product 2: stock = 50, quantity = 3 → ✅ OK
3. Create order
4. Reduce stock:
   - Product 1: 100 - 5 = 95 ✅
   - Product 2: 50 - 3 = 47 ✅

**Console Logs:**
```
📦 Updating product stock...
✅ Stock updated for product INDOMIE GORENG: 100 → 95
✅ Stock updated for product INDOMIE SOTO: 50 → 47
```

---

### Example 2: Cancel Order (Stock Restoration)

**Request:**
```bash
PATCH /api/orders/123
Content-Type: application/json

{
  "status": "cancelled"
}
```

**What Happens:**
1. System get current order with status "pending"
2. Detect status change: pending → cancelled
3. Get order_items: [Product 1 x 5, Product 2 x 3]
4. Restore stock:
   - Product 1: 95 + 5 = 100 ✅
   - Product 2: 47 + 3 = 50 ✅
5. Update order status to "cancelled"

**Console Logs:**
```
🔄 Order cancelled, restoring product stock...
✅ Stock restored for product INDOMIE GORENG: 95 → 100
✅ Stock restored for product INDOMIE SOTO: 47 → 50
```

---

### Example 3: Delete Order (Stock Restoration)

**Request:**
```bash
DELETE /api/orders/456
```

**What Happens:**
1. System get order with status "pending"
2. Order not cancelled yet, so restore stock
3. Get order_items: [Product 1 x 3]
4. Restore stock:
   - Product 1: 95 + 3 = 98 ✅
5. Soft delete order (is_deleted = true)

**Console Logs:**
```
🔄 Order deleted, restoring product stock...
✅ Stock restored for product INDOMIE GORENG: 95 → 98
```

---

## 🧪 Testing Scenarios

### Test 1: Normal Order Creation ✅
1. Cek stok produk (misal: 100)
2. Buat order dengan quantity 5
3. Verifikasi stok berkurang jadi 95
4. ✅ PASS

### Test 2: Insufficient Stock ✅
1. Cek stok produk (misal: 3)
2. Coba buat order dengan quantity 5
3. Expect error: "Stok tidak cukup"
4. Verifikasi stok tetap 3 (tidak berubah)
5. ✅ PASS

### Test 3: Cancel Order ✅
1. Buat order (stok: 100 → 95)
2. Cancel order via admin
3. Verifikasi stok kembali jadi 100
4. ✅ PASS

### Test 4: Delete Order ✅
1. Buat order (stok: 100 → 95)
2. Delete order via admin
3. Verifikasi stok kembali jadi 100
4. Order soft deleted (is_deleted = true)
5. ✅ PASS

### Test 5: Double Cancel Prevention ✅
1. Buat order (stok: 100 → 95)
2. Cancel order (stok: 95 → 100)
3. Try cancel lagi (should not restore stock)
4. Verifikasi stok tetap 100 (tidak jadi 105)
5. ✅ PASS

### Test 6: Delete Already Cancelled Order ✅
1. Buat order (stok: 100 → 95)
2. Cancel order (stok: 95 → 100)
3. Delete order (should not restore stock again)
4. Verifikasi stok tetap 100
5. ✅ PASS

---

## 🔐 Edge Cases Handled

### 1. **Product Not Found**
- Error: "Produk tidak ditemukan"
- Stock tidak berubah
- Order tidak dibuat

### 2. **Insufficient Stock**
- Error: "Stok tidak cukup"
- Detail: "Stok tersedia: X, diminta: Y"
- Stock tidak berubah
- Order tidak dibuat

### 3. **Database Error During Stock Update**
- Order tetap dibuat (important!)
- Error logged di console
- Admin bisa koreksi stok manual nanti
- Tidak rollback order (prevent data loss)

### 4. **Multiple Items in Cart**
- Stock updated untuk semua items
- Jika 1 item gagal update stock, yang lain tetap jalan
- Error logged tapi order tetap valid

### 5. **Concurrent Orders (Race Condition)**
- Supabase PostgreSQL handle dengan transaction isolation
- If 2 orders dibuat bersamaan untuk produk yang sama:
  - Order pertama: success
  - Order kedua: jika stok sudah habis, dapat error "Stok tidak cukup"

---

## 📊 Database Impact

### Orders Table
- No changes needed ✅

### Order Items Table
- No changes needed ✅

### Products Table
- Column `stock` (integer) - updated automatically ✅

**Query Performance:**
- Stock update: 1 UPDATE query per product
- Stock restoration: 1 SELECT + 1 UPDATE per product
- Efficient dengan indexing pada `products.id`

---

## 🚨 Important Notes

### DO's ✅
- ✅ Always validate stock before creating order
- ✅ Log all stock changes for tracking
- ✅ Restore stock when order cancelled or deleted
- ✅ Check order status before restoring (prevent double restore)

### DON'Ts ❌
- ❌ Don't allow negative stock
- ❌ Don't restore stock twice (check if already cancelled)
- ❌ Don't rollback order if stock update fails (log error instead)
- ❌ Don't hard delete orders (use soft delete)

---

## 🔧 Configuration

### Minimum Order Amount
```typescript
const MINIMUM_ORDER = 5000; // Rp 5.000
```

### Max Quantity Per Product
```typescript
if (cartItem.quantity > 100) {
  return error; // Max 100 per product
}
```

### Max Items Per Order
```typescript
if (cart.length > 50) {
  return error; // Max 50 different products
}
```

---

## 📝 Logging

All stock changes are logged to console:

**Stock Deduction:**
```
📦 Updating product stock...
✅ Stock updated for product [NAME]: [OLD] → [NEW]
⚠️ Error updating stock for product: [ID] [ERROR]
```

**Stock Restoration:**
```
🔄 Order cancelled, restoring product stock...
✅ Stock restored for product [NAME]: [OLD] → [NEW]
⚠️ Error restoring stock for product: [ID] [ERROR]
```

---

## 🎯 Benefits

### For Business:
- ✅ Accurate inventory tracking
- ✅ Prevent overselling
- ✅ Automatic stock management
- ✅ No manual stock adjustment needed

### For Customers:
- ✅ Know real-time stock availability
- ✅ Can't order out-of-stock items
- ✅ Clear error messages when stock insufficient

### For Admin:
- ✅ Stock auto-updates on order
- ✅ Stock auto-restores on cancel/delete
- ✅ Detailed logging for troubleshooting
- ✅ Less manual work

---

## 🐛 Troubleshooting

### Problem: Stock not reducing after order
**Solution:** Check console logs for errors. Verify products table has `stock` column.

### Problem: Stock not restoring on cancel
**Solution:** Verify order status change is detected. Check console logs.

### Problem: Stock goes negative
**Solution:** Should not happen (validation prevents this). If happens, check race conditions.

### Problem: Double restoration (stock increases too much)
**Solution:** System prevents this by checking order status before restore.

---

## 🚀 Future Enhancements (Optional)

### Low Stock Alerts
- Email admin when product stock < threshold
- Show "Low Stock" badge on product cards

### Stock History
- Track all stock movements in separate table
- View stock history per product

### Reserved Stock
- Reserve stock when customer adds to cart
- Release after timeout (15 minutes)
- Prevent race conditions

### Bulk Stock Update
- Admin can adjust stock for multiple products
- CSV import for stock updates

---

## ✅ Summary

**Status:** ✅ FULLY IMPLEMENTED & TESTED

**Features:**
1. ✅ Auto stock deduction on order creation
2. ✅ Stock validation before order
3. ✅ Auto stock restoration on order cancellation
4. ✅ Auto stock restoration on order deletion
5. ✅ Prevent double restoration
6. ✅ Comprehensive error handling
7. ✅ Detailed logging

**Build Status:** ✅ Success (0 errors)

**Ready for:** Production ✅

---

**Last Updated:** 15 Januari 2026, 23:00 WIB
**Status:** COMPLETE ✅