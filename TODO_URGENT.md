# ⚡ TODO URGENT - Week 1 Action Items

**Week:** 16-22 Januari 2026
**Priority:** 🔴 CRITICAL
**Goal:** Production-ready & secure for soft launch

---

## 📊 WEEK 1 PROGRESS

```
Day 1-2: Security Fixes        ░░░░░░░░░░░░░░░░░░░░  0%
Day 3-4: Complete APIs         ░░░░░░░░░░░░░░░░░░░░  0%
Day 5-7: Legal & Testing       ░░░░░░░░░░░░░░░░░░░░  0%
────────────────────────────────────────────────────
Overall Week 1:                ░░░░░░░░░░░░░░░░░░░░  0%
```

---

## 🔴 DAY 1-2: SECURITY FIXES (Deadline: 17 Jan)

### Priority: CRITICAL ⚡

#### Task 1.1: Security Audit
- [ ] Run security scan (npm audit)
- [ ] Check for vulnerable dependencies
- [ ] Review authentication flow
- [ ] Check for exposed secrets
- [ ] Review RLS policies in Supabase

**Time:** 2 hours
**Assigned:** Developer

---

#### Task 1.2: Remove Sensitive Data
- [ ] Clean test files (remove real data)
- [ ] Remove hardcoded credentials
- [ ] Check git history for secrets
- [ ] Add .env.example (template file)
- [ ] Update .gitignore

**Files to Check:**
- `/scripts/test-*.js`
- `/database/*.sql`
- Any test data files

**Time:** 1 hour

---

#### Task 1.3: API Rate Limiting
- [ ] Install rate limiter middleware
- [ ] Apply to public APIs:
  - `/api/orders` - 10 requests/minute
  - `/api/products` - 100 requests/minute
- [ ] Test rate limiting works
- [ ] Add rate limit error messages

**Code:**
```typescript
// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests
  message: 'Terlalu banyak permintaan, coba lagi nanti'
});
```

**Time:** 2 hours

---

#### Task 1.4: CSRF Protection
- [ ] Implement CSRF tokens
- [ ] Add to forms (checkout, admin)
- [ ] Verify token on API calls
- [ ] Test CSRF protection

**Time:** 2 hours

---

#### Task 1.5: SQL Injection Review
- [ ] Review all database queries
- [ ] Ensure parameterized queries
- [ ] Test with SQL injection attempts
- [ ] Document safe query patterns

**Time:** 1 hour

---

### 📋 Day 1-2 Checklist:
- [ ] Security audit complete
- [ ] No sensitive data in repo
- [ ] Rate limiting active
- [ ] CSRF protection enabled
- [ ] SQL injection prevented
- [ ] Security report documented

**Total Time:** ~8 hours (1 day work)

---

## 🔴 DAY 3-4: COMPLETE APIS (Deadline: 19 Jan)

### Priority: CRITICAL ⚡

#### Task 2.1: DELETE Product API
- [ ] Create DELETE `/api/products/[id]`
- [ ] Soft delete (set is_deleted = true)
- [ ] Check if product has orders
- [ ] Return proper error if has orders
- [ ] Test delete endpoint

**File:** `app/api/products/[id]/route.ts`

**Code:**
```typescript
export async function DELETE(req, { params }) {
  const { id } = params;

  // Check if product has orders
  const { data: orders } = await supabase
    .from('order_items')
    .select('id')
    .eq('product_id', id)
    .limit(1);

  if (orders && orders.length > 0) {
    return NextResponse.json(
      { error: 'Produk tidak bisa dihapus karena ada di order' },
      { status: 400 }
    );
  }

  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ is_deleted: true })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Produk berhasil dihapus' });
}
```

**Time:** 1 hour

---

#### Task 2.2: Categories CRUD API
- [ ] POST `/api/categories` - Create category
- [ ] PUT `/api/categories/[id]` - Update category
- [ ] DELETE `/api/categories/[id]` - Delete category
- [ ] Validation (name required, unique)
- [ ] Test all endpoints

**File:** `app/api/categories/route.ts`

**Code:**
```typescript
// POST - Create category
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, description, icon } = body;

  // Validation
  if (!name) {
    return NextResponse.json(
      { error: 'Name required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug, description, icon })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
```

**Time:** 2 hours

---

#### Task 2.3: API Documentation
- [ ] Create `API_DOCUMENTATION.md`
- [ ] Document all 12+ endpoints
- [ ] Request/response examples
- [ ] Error codes list
- [ ] Rate limiting info

**Time:** 2 hours

---

### 📋 Day 3-4 Checklist:
- [ ] DELETE product works
- [ ] Categories CRUD complete
- [ ] All APIs tested
- [ ] API documentation done
- [ ] Postman collection exported

**Total Time:** ~5 hours (1 day work)

---

## 🔴 DAY 5-7: LEGAL PAGES & TESTING (Deadline: 22 Jan)

### Priority: HIGH ⚡

#### Task 3.1: Enhanced Legal Pages
- [ ] Privacy Policy - detailed
- [ ] Terms of Service - detailed
- [ ] FAQ - 20+ questions
- [ ] Return & Refund Policy (NEW)
- [ ] Shipping Policy (NEW)
- [ ] Cookie Policy (NEW)

**Files:**
- `app/privacy/page.tsx` - Update
- `app/terms/page.tsx` - Update
- `app/faq/page.tsx` - Update
- `app/return-policy/page.tsx` - NEW
- `app/shipping-policy/page.tsx` - NEW

**Time:** 3 hours

---

#### Task 3.2: Return & Refund Policy Page

**Content:**
```markdown
# Kebijakan Pengembalian & Penukaran

## Syarat & Ketentuan
- Produk masih dalam kondisi baik
- Kemasan lengkap
- Maksimal 7 hari setelah diterima

## Proses Pengembalian
1. Hubungi customer service
2. Kirim foto produk
3. Tunggu approval
4. Kirim produk ke alamat kami
5. Refund diproses 3-5 hari kerja
```

**Time:** 1 hour

---

#### Task 3.3: End-to-End Testing

**Test Scenarios:**

**A. Public Website (30 tests)**
- [ ] Homepage loads
- [ ] Search works
- [ ] Filter works
- [ ] Product detail
- [ ] Add to cart
- [ ] Cart quantity update
- [ ] Remove from cart
- [ ] Checkout flow
- [ ] Order tracking
- [ ] All legal pages accessible

**B. Admin Panel (30 tests)**
- [ ] Admin login
- [ ] Dashboard stats
- [ ] Products: view, add, edit, delete
- [ ] Orders: view, update status, delete
- [ ] Bulk upload CSV
- [ ] Image upload
- [ ] Stock management (critical!)
- [ ] Analytics reports

**C. Stock Management (10 tests)**
- [ ] Order creates → stock reduces
- [ ] Insufficient stock → error
- [ ] Order cancelled → stock restores
- [ ] Order deleted → stock restores
- [ ] No double restoration

**Time:** 4 hours

---

#### Task 3.4: Load Testing
- [ ] Install k6 or Artillery
- [ ] Test 100 concurrent users
- [ ] Test API endpoints
- [ ] Monitor response times
- [ ] Fix performance issues

**Command:**
```bash
npm install -g k6
k6 run load-test.js
```

**Time:** 2 hours

---

#### Task 3.5: Security Testing
- [ ] Test SQL injection
- [ ] Test XSS attacks
- [ ] Test CSRF attacks
- [ ] Test authentication bypass
- [ ] Fix any vulnerabilities

**Time:** 2 hours

---

### 📋 Day 5-7 Checklist:
- [ ] All legal pages complete
- [ ] 70+ tests passed
- [ ] Load testing passed
- [ ] Security testing passed
- [ ] Test report documented

**Total Time:** ~12 hours (2 days work)

---

## 📊 WEEK 1 SUMMARY

### Time Allocation:
```
Day 1-2: Security         8 hours  ████████░░░░░░░░░░░░
Day 3-4: APIs             5 hours  █████░░░░░░░░░░░░░░░
Day 5-7: Legal & Testing 12 hours  ████████████░░░░░░░░
────────────────────────────────────────────────────────
Total:                   25 hours  (3 days full-time)
```

### Expected Outcome:
✅ Production-ready platform
✅ Secure & tested
✅ All APIs complete
✅ Legal compliance
✅ Performance optimized

---

## 🎯 SUCCESS CRITERIA

**Week 1 is successful if:**
- [ ] Zero security vulnerabilities (npm audit clean)
- [ ] All APIs documented & working
- [ ] 100% test pass rate (70+ tests)
- [ ] Legal pages approved
- [ ] Load test < 2s response time
- [ ] Ready for soft launch announcement

---

## 🚨 BLOCKERS & RISKS

### Potential Blockers:
1. **Security issues found** → Must fix before launch
2. **API bugs** → Could delay testing
3. **Performance issues** → Need optimization

### Mitigation:
- Daily standup to track progress
- Early testing to catch issues
- Backup plan if major bug found

---

## 📋 DAILY STANDUP TEMPLATE

**Date:** _______________

**Yesterday:**
- Completed: _______________
- Blockers: _______________

**Today:**
- Working on: _______________
- Need help with: _______________

**Risks:**
- _______________

---

## 🎉 WEEK 1 DELIVERABLES

### Documentation:
1. Security audit report
2. API documentation (API_DOCUMENTATION.md)
3. Test report (70+ tests)
4. Load test report
5. Security test report

### Code:
1. DELETE product API
2. Categories CRUD APIs
3. Rate limiting middleware
4. CSRF protection
5. Enhanced legal pages

### Testing:
1. All tests passing (70+)
2. Load test successful
3. Security scan clean
4. No critical bugs

---

## 🚀 AFTER WEEK 1

**If All Complete:**
→ Proceed to Phase 2 (Authentication Enhancement)

**If Blockers Exist:**
→ Extend Week 1, delay Phase 2

**Soft Launch Criteria:**
- Week 1 100% complete ✅
- Supabase Storage setup ✅
- Analytics SQL running ✅
- Production tested ✅

---

## 📞 NEED HELP?

**Stuck on Security?**
→ Review: OWASP Top 10
→ Tool: npm audit, Snyk

**Stuck on APIs?**
→ Review: Supabase docs
→ Test: Postman/Insomnia

**Stuck on Testing?**
→ Review: TESTING_GUIDE.md
→ Tool: Jest, Playwright

---

**Let's ship Week 1! 🚀**

*This is your action plan. Check off tasks as you complete them.*