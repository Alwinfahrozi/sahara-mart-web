# 🚨 DATABASE SETUP REQUIRED

## ❌ Current Problem

Your orders are NOT being created because the database schema is missing required columns and functions.

**Symptoms:**
- ❌ Order creation fails (no order number in WhatsApp)
- ❌ Orders don't appear in admin panel
- ❌ Console shows "column does not exist" errors

---

## ✅ Solution: Run SQL Setup

### Option 1: Quick Fix (5 minutes) ⚡

If you just want to get it working quickly:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: Sahara Mart

2. **Go to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run Quick Fix SQL**
   - Open file: `database/quick-fix-orders.sql`
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" button

4. **Verify**
   ```bash
   node scripts/verify-database.js
   ```

---

### Option 2: Full Schema (10 minutes) 📚

For complete setup with analytics and functions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run Full Schema**
   - Open file: `database/sales_schema.sql`
   - Copy ALL the SQL code (490 lines)
   - Paste into Supabase SQL Editor
   - Click "Run" button

4. **Verify**
   ```bash
   node scripts/verify-database.js
   ```

---

## 📋 What Gets Fixed

Running the SQL will add these to your database:

### Missing Columns in `orders` table:
- ✅ `is_deleted` - For soft delete
- ✅ `profit_margin` - Profit percentage
- ✅ `total_cost` - Cost basis
- ✅ `total_profit` - Profit amount
- ✅ `whatsapp_message` - Message copy
- ✅ `admin_notes` - Internal notes
- ✅ `completed_at` - Completion timestamp

### Missing Columns in `order_items` table:
- ✅ `unit_cost` - Cost per unit
- ✅ `line_cost` - Line cost
- ✅ `line_profit` - Line profit
- ✅ `line_profit_margin` - Line profit %

### Missing Function:
- ✅ `generate_order_number()` - Auto-generate order numbers (ORD-20260114-001)

### Bonus (Full Schema Only):
- ✅ Views for analytics
- ✅ Triggers for auto-updates
- ✅ Indexes for performance
- ✅ Sales tracking functions

---

## 🧪 How to Test

### Step 1: Verify Database
```bash
cd C:/Users/HP/sahara-mart-web
node scripts/verify-database.js
```

**Expected Output:**
```
✅ Orders table exists
✅ Order items table exists
✅ generate_order_number function exists
✅ is_deleted column exists
✅ Test order created successfully!
✅ All checks passed! Database is ready.
```

---

### Step 2: Test Order Creation

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Create test order:**
   - Browse katalog
   - Add product to cart (click "🛒 Tambah Keranjang")
   - Go to cart (click cart icon in header)
   - Fill customer form:
     - Nama: Your Name
     - WhatsApp: Your Phone
     - Alamat: Your Address
   - Click "Checkout via WhatsApp"

4. **Verify success:**
   - ✅ Alert shows: "Order Number: ORD-20260114-XXX"
   - ✅ WhatsApp opens with order number in message
   - ✅ Redirects to tracking page
   - ✅ Cart badge shows 0

---

### Step 3: Check Admin Panel

1. **Open admin panel:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Login** (use your Supabase credentials)

3. **Go to Orders:**
   ```
   http://localhost:3000/admin/orders
   ```

4. **Verify:**
   - ✅ Order appears in list
   - ✅ No console errors
   - ✅ Order details correct
   - ✅ Status shows "Pending"

---

## 🔍 Current Database Status

Based on verification script:

| Component | Status | Fix |
|-----------|--------|-----|
| Orders table | ✅ Exists | - |
| Order items table | ✅ Exists | - |
| Products table | ✅ 6369 products | - |
| `generate_order_number()` | ❌ Missing | Run SQL |
| `is_deleted` column | ❌ Missing | Run SQL |
| `profit_margin` column | ❌ Missing | Run SQL |
| Other profit columns | ❌ Missing | Run SQL |

---

## 💡 Why This Happened

Your database was created with a basic schema, but the application code expects a more complete schema with:
- Sales tracking columns
- Profit calculation columns
- Order number generation function
- Soft delete capability

The SQL scripts in the `database/` folder contain the complete schema that matches the application code.

---

## 🆘 Troubleshooting

### Issue 1: "Permission denied"

**Solution:** Make sure you're logged into Supabase with admin privileges.

---

### Issue 2: "Function already exists"

**Solution:** No problem! The script uses `CREATE OR REPLACE`, so it will update existing functions.

---

### Issue 3: "Column already exists"

**Solution:** No problem! The script uses `ADD COLUMN IF NOT EXISTS`, so it will skip existing columns.

---

### Issue 4: Orders still not appearing

**Check these:**

1. **Console logs** (F12 in browser):
   - Look for "📨 Response status: XXX"
   - If status is not 201, check error message

2. **Network tab** (F12 → Network):
   - Check `/api/orders` POST request
   - Look at response body for errors

3. **Supabase logs** (Dashboard → Logs):
   - Check for SQL errors
   - Check for permission errors

4. **Run verification again:**
   ```bash
   node scripts/verify-database.js
   ```

---

## 📞 Need Help?

If you're still having issues after running the SQL:

1. Check the verification script output
2. Check browser console for errors
3. Check Supabase dashboard logs
4. Verify all columns exist using:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'orders';
   ```

---

## ✅ Success Checklist

Before testing the application:

- [ ] Ran SQL script in Supabase SQL Editor
- [ ] Verification script shows all checks passed
- [ ] No errors in Supabase dashboard
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console is open (F12) to see logs

After testing:

- [ ] Order created successfully (alert shows order number)
- [ ] WhatsApp message contains order number
- [ ] Order appears in admin panel
- [ ] Tracking page shows order details
- [ ] No console errors

---

## 🎯 Summary

**Current Status:** ❌ Database schema incomplete
**Required Action:** ✅ Run SQL script in Supabase
**Time Required:** 5-10 minutes
**Files to Use:** `database/quick-fix-orders.sql` OR `database/sales_schema.sql`
**Verification:** `node scripts/verify-database.js`

**After Fix:** Everything will work! 🎉

---

**Last Updated:** 2026-01-14
**Next Step:** Run the SQL script now! 👆
