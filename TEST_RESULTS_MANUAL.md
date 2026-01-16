# 📋 MANUAL TEST RESULTS - Sahara Mart

**Project:** Sahara Mart E-Commerce Website
**Date:** 16 Januari 2026
**Tested By:** Development Team
**Test Environment:** Development (Local)
**Status:** ✅ READY FOR TESTING

---

## 🎯 TESTING INSTRUCTIONS

### Prerequisites:
1. Start development server:
   ```bash
   npm run dev
   ```

2. Server should be running at: `http://localhost:3000`

3. Ensure Supabase connection is active

4. Run automated tests:
   ```bash
   node scripts/test-e2e.js
   ```

---

## ✅ TEST CHECKLIST (70+ Tests)

### 📱 PUBLIC WEBSITE TESTS (25 tests)

#### Homepage Tests (5 tests)
- [ ] **TEST-001:** Navigate to `http://localhost:3000` - Homepage loads successfully (Status 200)
- [ ] **TEST-002:** Verify hero section with "Sahara Mart" branding is visible
- [ ] **TEST-003:** Confirm at least 4 featured products are displayed
- [ ] **TEST-004:** Click all navigation menu items (Beranda, Katalog, Tentang, Kontak)
- [ ] **TEST-005:** Toggle mobile hamburger menu (resize browser < 768px)

**Expected Result:** All homepage elements load and function correctly

---

#### Product Catalog Tests (8 tests)
- [ ] **TEST-006:** Navigate to `/katalog` - Catalog page loads with products grid
- [ ] **TEST-007:** Click "Next Page" and "Previous Page" buttons - Pagination works
- [ ] **TEST-008:** Enter "mie" in search box - Relevant products appear
- [ ] **TEST-009:** Select category from dropdown - Products filter correctly
- [ ] **TEST-010:** Verify product cards show: image, name, price, stock status
- [ ] **TEST-011:** Find a product with 0 stock - "Stok Habis" badge displays
- [ ] **TEST-012:** Confirm all prices are formatted as "Rp X.XXX"
- [ ] **TEST-013:** Scroll page - Images lazy load (check network tab)

**Expected Result:** Catalog features work smoothly, search and filters function properly

---

#### Product Detail Tests (5 tests)
- [ ] **TEST-014:** Click any product card - Detail page opens
- [ ] **TEST-015:** Verify product info: name, price, description, stock, category
- [ ] **TEST-016:** Click "Tambah ke Keranjang" - Toast notification appears
- [ ] **TEST-017:** Increase/decrease quantity - Value updates correctly
- [ ] **TEST-018:** Scroll to bottom - Related products section visible

**Expected Result:** Product details display correctly, add to cart works

---

#### Shopping Cart Tests (7 tests)
- [ ] **TEST-019:** Navigate to `/keranjang` - Cart page loads
- [ ] **TEST-020:** Verify cart items match previously added products
- [ ] **TEST-021:** Click "+" button - Quantity increases, total updates
- [ ] **TEST-022:** Click "Hapus" button - Item removes, total recalculates
- [ ] **TEST-023:** Add 3 items at different quantities - Total = sum of (price × qty)
- [ ] **TEST-024:** Refresh page (F5) - Cart persists (localStorage)
- [ ] **TEST-025:** Click "Checkout via WhatsApp" - WhatsApp opens with order details

**Expected Result:** Cart functions correctly, calculations accurate, WhatsApp integration works

---

### 🔐 ADMIN PANEL TESTS (20 tests)

#### Admin Authentication Tests (4 tests)
- [ ] **TEST-026:** Navigate to `/admin/login` - Login page loads
- [ ] **TEST-027:** Enter valid credentials - Login successful, redirect to dashboard
- [ ] **TEST-028:** Enter invalid credentials - Error message displayed
- [ ] **TEST-029:** Try `/admin` without login - Redirected to login page

**Expected Result:** Authentication system works, protected routes secured

---

#### Dashboard Tests (4 tests)
- [ ] **TEST-030:** After login, verify dashboard loads with stats cards
- [ ] **TEST-031:** Confirm "Today's Stats" shows: total orders, revenue, profit
- [ ] **TEST-032:** Check analytics charts render (bar/line charts visible)
- [ ] **TEST-033:** Click sidebar menu items - Navigate to different admin pages

**Expected Result:** Dashboard displays correct statistics and navigation works

---

#### Product Management Tests (8 tests)
- [ ] **TEST-034:** Navigate to `/admin/products` - Products list loads
- [ ] **TEST-035:** Click "Tambah Produk" - Create form appears, fill and submit - Product created
- [ ] **TEST-036:** Click edit icon on product - Edit form appears, modify and save - Product updated
- [ ] **TEST-037:** Click delete icon - Confirmation modal, confirm - Product deleted
- [ ] **TEST-038:** Click image upload - Select file - Image uploads (check Supabase Storage)
- [ ] **TEST-039:** Upload CSV file with products - All products imported successfully
- [ ] **TEST-040:** Use search box - Products filter in real-time
- [ ] **TEST-041:** Click "Scan Barcode" - Camera activates (allow permission)

**Expected Result:** Full CRUD operations work, CSV import successful, barcode scanner activates

---

#### Order Management Tests (4 tests)
- [ ] **TEST-042:** Navigate to `/admin/orders` - Orders list loads
- [ ] **TEST-043:** Click view icon on order - Order details modal opens
- [ ] **TEST-044:** Change order status dropdown - Status updates, stock restored if cancelled
- [ ] **TEST-045:** Delete an order - Order deleted, stock restored
- [ ] **TEST-046:** Use status filter - Orders filter by status

**Expected Result:** Order management works, stock restoration functions correctly

---

### 🔌 API TESTS (15 tests)

#### Products API Tests (5 tests)
Open browser DevTools (F12) → Console, run these:

```javascript
// TEST-047: GET products
fetch('/api/products').then(r => r.json()).then(console.log)
// Expected: Array of products

// TEST-048: Pagination
fetch('/api/products?page=1&limit=10').then(r => r.json()).then(console.log)
// Expected: Array with max 10 products

// TEST-049: Search
fetch('/api/products?search=mie').then(r => r.json()).then(console.log)
// Expected: Products matching "mie"

// TEST-050: Create product (requires auth)
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test Product', price: 10000, stock: 100 })
}).then(r => r.json()).then(console.log)
// Expected: New product created OR 401 if not authenticated

// TEST-051: Rate limiting (run 110 times rapidly)
for(let i=0; i<110; i++) fetch('/api/products?limit=1')
// Expected: After 100 requests, receive 429 (Too Many Requests)
```

**Expected Result:** All API endpoints respond correctly, rate limiting works

---

#### Orders API Tests (5 tests)

```javascript
// TEST-052: Create order (requires CSRF)
fetch('/api/csrf').then(r => r.json()).then(async (data) => {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': data.token
    },
    body: JSON.stringify({
      customer_name: 'Test User',
      customer_phone: '08123456789',
      customer_address: 'Test Address',
      items: [{ product_id: 1, quantity: 1, price: 10000 }]
    })
  })
  return res.json()
}).then(console.log)
// Expected: Order created, stock reduced

// TEST-053: Check stock reduced
// After creating order above, verify product stock decreased by ordered quantity

// TEST-054: Order with insufficient stock
// Try creating order with quantity > available stock
// Expected: 400 error "Insufficient stock"

// TEST-055: Update order status
fetch('/api/orders/ORDER_ID', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'cancelled' })
}).then(r => r.json()).then(console.log)
// Expected: Status updated, stock restored if cancelled

// TEST-056: Rate limiting (run 15 times rapidly)
for(let i=0; i<15; i++) fetch('/api/orders')
// Expected: After 10 requests, receive 429
```

**Expected Result:** Order operations work, stock management functions, rate limiting effective

---

#### CSRF Protection Tests (3 tests)

```javascript
// TEST-057: Get CSRF token
fetch('/api/csrf').then(r => r.json()).then(console.log)
// Expected: { token: "...", header: "x-csrf-token" }

// TEST-058: POST without CSRF (should fail)
fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
}).then(r => r.json()).then(console.log)
// Expected: 403 error "CSRF token validation failed"

// TEST-059: POST with valid CSRF (should succeed)
// See TEST-052 above for working example
```

**Expected Result:** CSRF protection blocks unauthorized POST requests

---

### 🔒 SECURITY TESTS (8 tests)

- [ ] **SEC-001:** Run `npm audit` - No critical vulnerabilities
- [ ] **SEC-002:** Check `.env.local` not in git - File in `.gitignore`
- [ ] **SEC-003:** Verify rate limiting - 100 req/min for products, 10 req/min for orders
- [ ] **SEC-004:** Test CSRF protection - POST requests require token
- [ ] **SEC-005:** Check SQL injection - API sanitizes input
- [ ] **SEC-006:** Verify XSS protection - React escapes output
- [ ] **SEC-007:** Check authentication - Admin routes require login
- [ ] **SEC-008:** Inspect headers - Security headers present (X-Frame-Options, etc.)

**Expected Result:** Security score 9.0/10 maintained, no critical vulnerabilities

---

### 📄 LEGAL PAGES TESTS (5 tests)

- [ ] **TEST-062:** Navigate to `/privacy` - Privacy Policy loads, 10 sections visible
- [ ] **TEST-063:** Navigate to `/terms` - Terms of Service loads, 20 sections visible
- [ ] **TEST-064:** Navigate to `/faq` - FAQ loads, search works, 51 questions visible
- [ ] **TEST-065:** Navigate to `/return-policy` - Return Policy loads, 11 sections visible
- [ ] **TEST-066:** Navigate to `/shipping-policy` - Shipping Policy loads, 12 sections visible

**Expected Result:** All legal pages load correctly, content well-formatted, cross-links work

---

### 📱 MOBILE RESPONSIVENESS TESTS (5 tests)

- [ ] **TEST-067:** Resize browser to 375px (iPhone) - Layout adapts, no horizontal scroll
- [ ] **TEST-068:** Click mobile menu (hamburger icon) - Menu slides in from left
- [ ] **TEST-069:** Open cart on mobile - Items stack vertically, buttons accessible
- [ ] **TEST-070:** Open admin panel on tablet (768px) - Sidebar collapses, layout responsive
- [ ] **TEST-071:** Fill forms on mobile - Inputs properly sized, keyboard doesn't overlap

**Expected Result:** Fully responsive on mobile (375px), tablet (768px), desktop (1024px+)

---

### ⚡ PERFORMANCE TESTS (5 tests)

Use Chrome DevTools → Lighthouse (F12 → Lighthouse tab):

- [ ] **PERF-001:** Run Lighthouse on homepage - Performance score > 90
- [ ] **PERF-002:** Check First Contentful Paint - < 1.5 seconds
- [ ] **PERF-003:** Check Time to Interactive - < 3.5 seconds
- [ ] **PERF-004:** Network tab - API responses < 500ms
- [ ] **PERF-005:** Check bundle size - JavaScript < 500KB (gzipped)

**Expected Result:** Performance metrics meet targets, page loads fast

---

## 📊 TEST RESULTS SUMMARY

### Test Execution:
- **Total Tests:** 71
- **Passed:** ___ / 71
- **Failed:** ___ / 71
- **Pass Rate:** ____%

### Critical Issues Found:
1. ___________
2. ___________
3. ___________

### Known Issues:
- Server must be running (`npm run dev`) for tests to pass
- Supabase connection required
- Some tests require manual intervention (login, file upload)

---

## 🎯 ACCEPTANCE CRITERIA

### ✅ PASS Criteria:
- [x] Pass rate ≥ 95% (67+ of 71 tests)
- [x] No CRITICAL bugs
- [x] Performance score ≥ 90
- [x] Security score = 9.0/10
- [x] Mobile responsive on all devices
- [x] All legal pages complete

### ❌ FAIL Criteria:
- [ ] Pass rate < 95%
- [ ] Any CRITICAL bugs
- [ ] Performance score < 80
- [ ] Security vulnerabilities
- [ ] Broken core features

---

## 📝 HOW TO RUN TESTS

### Option 1: Automated (Recommended)
```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, run tests
node scripts/test-e2e.js

# 3. Check results in console
```

### Option 2: Manual
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Go through each test case in this document
4. Check boxes as you complete each test
5. Document any failures

### Option 3: Automated with Production
```bash
# Test against deployed site
NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app node scripts/test-e2e.js
```

---

## 🐛 BUG REPORT TEMPLATE

If any tests fail, use this template:

```
BUG-XXX: [Short Title]

Severity: [CRITICAL/HIGH/MEDIUM/LOW]
Test Case: TEST-XXX
Status: [Open/Fixed]

Steps to Reproduce:
1. Go to...
2. Click on...
3. Observe...

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happens]

Screenshots:
[Attach if applicable]

Environment:
- Browser: Chrome 120
- OS: Windows 11
- URL: http://localhost:3000/...
```

---

## ✅ SIGN-OFF

When all tests pass:

**Tested By:** _______________
**Date:** _______________
**Pass Rate:** ____%
**Status:** ✅ APPROVED / ❌ REJECTED

**Comments:**
_________________________________
_________________________________
_________________________________

---

*Test Results Document*
*Version: 1.0*
*Date: 16 Januari 2026*
