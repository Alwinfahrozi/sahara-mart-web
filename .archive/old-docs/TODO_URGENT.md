# ⚡ TODO URGENT - FIX SEKARANG!

**Priority:** CRITICAL 🔴
**Timeline:** This Week
**Status:** Ready to Execute

---

## 🔴 DAY 1: SECURITY FIXES (2 Hours)

### Task 1.1: Remove .env.local from Git (15 min)

```bash
# Step 1: Add to .gitignore
echo ".env.local" >> .gitignore

# Step 2: Remove from git tracking
git rm --cached .env.local

# Step 3: Commit
git add .gitignore
git commit -m "chore: remove .env.local from version control"

# Step 4: Push
git push origin master
```

**Verify:** `.env.local` should NOT appear in GitHub

---

### Task 1.2: Regenerate Supabase Keys (10 min)

1. **Go to:** https://supabase.com/dashboard
2. **Select:** Sahara Mart project
3. **Click:** Settings → API
4. **Click:** "Regenerate" pada:
   - Anon (public) key
   - Service role key
5. **Copy** keys yang baru
6. **Update** `.env.local` dengan keys baru

**Verify:** Old keys tidak bisa akses database lagi

---

### Task 1.3: Clean Up Test Files (5 min)

```bash
# Remove test page
rm -rf app/test-db

# Remove temp files
rm -rf tmpclaude-*

# Remove old documentation
rm -rf *.md.bak

# Commit
git add .
git commit -m "chore: remove test files and temp data"
git push
```

**Verify:** No test files in production

---

### Task 1.4: Standardize WhatsApp Number (30 min)

**Current:** Multiple numbers di codebase

**Action:**
```bash
# Search for all WhatsApp numbers
grep -r "wa.me" app/
grep -r "whatsapp" app/
grep -r "082" app/

# Replace dengan:
# +62 822-6756-7946
# or 6282267567946 (tanpa +/-)
```

**Files to Update:**
1. `app/keranjang/page.tsx` - Checkout WhatsApp link
2. `app/hubungi/page.tsx` - Contact page
3. `app/tracking/[orderNumber]/page.tsx` - Support button
4. `components/Header.tsx` - If exists
5. `components/Footer.tsx` - If exists

**Verify:** All links go to same number

---

## 🔴 DAY 2: COMPLETE APIs (3 Hours)

### Task 2.1: Implement DELETE Product (1 hour)

**File:** `app/api/products/[id]/route.ts`

**Add this code:**
```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();
    const { id } = params;

    // Soft delete: set is_deleted = true
    const { error } = await supabase
      .from('products')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Test:**
```bash
# Use curl or Postman
curl -X DELETE http://localhost:3000/api/products/[product-id]
```

---

### Task 2.2: Add Delete Button di Admin (30 min)

**File:** `app/admin/products/page.tsx`

**Find the table row, add delete button:**
```typescript
<button
  onClick={() => handleDelete(product.id)}
  className="text-red-600 hover:text-red-800"
>
  🗑️ Hapus
</button>
```

**Add handler:**
```typescript
async function handleDelete(id: string) {
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    toast.success('Produk berhasil dihapus');
    fetchProducts(); // Refresh list
  } else {
    toast.error('Gagal menghapus produk');
  }
}
```

---

### Task 2.3: Create Category CRUD APIs (1.5 hours)

**Create file:** `app/api/categories/route.ts`

```typescript
import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/categories - Already exists ✅

// POST /api/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { name, description } = await request.json();

    const { data, error } = await supabase
      .from('categories')
      .insert({ name, description })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Category created', category: data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Create file:** `app/api/categories/[id]/route.ts`

```typescript
// PUT /api/categories/[id] - Update
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { name, description } = await request.json();

  const { data, error } = await supabase
    .from('categories')
    .update({ name, description })
    .eq('id', params.id)
    .select()
    .single();

  // ... error handling
}

// DELETE /api/categories/[id] - Delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', params.id);

  // ... error handling
}
```

**Test:** Create/Update/Delete categories

---

## 🔴 DAY 3-4: LEGAL PAGES (4 Hours)

### Task 3.1: Create Privacy Policy (1.5 hours)

**Create:** `app/kebijakan-privasi/page.tsx`

```typescript
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Kebijakan Privasi</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Terakhir diperbarui: 14 Januari 2026
        </p>

        <h2>1. Informasi yang Kami Kumpulkan</h2>
        <p>
          Sahara Mart mengumpulkan informasi berikut saat Anda menggunakan layanan kami:
        </p>
        <ul>
          <li>Nama lengkap</li>
          <li>Nomor WhatsApp</li>
          <li>Alamat pengiriman</li>
          <li>Riwayat pesanan</li>
        </ul>

        <h2>2. Penggunaan Informasi</h2>
        <p>
          Informasi yang kami kumpulkan digunakan untuk:
        </p>
        <ul>
          <li>Memproses pesanan Anda</li>
          <li>Mengirim konfirmasi pesanan via WhatsApp</li>
          <li>Mengirim produk ke alamat yang Anda berikan</li>
          <li>Meningkatkan layanan kami</li>
        </ul>

        <h2>3. Keamanan Data</h2>
        <p>
          Kami menggunakan enkripsi SSL dan menyimpan data di server Supabase
          yang telah tersertifikasi untuk melindungi informasi Anda.
        </p>

        <h2>4. Cookies</h2>
        <p>
          Website kami menggunakan cookies untuk menyimpan keranjang belanja
          Anda di browser.
        </p>

        <h2>5. Hak Anda</h2>
        <p>Anda berhak untuk:</p>
        <ul>
          <li>Mengakses data pribadi Anda</li>
          <li>Meminta penghapusan data</li>
          <li>Memperbarui informasi Anda</li>
        </ul>

        <h2>6. Hubungi Kami</h2>
        <p>
          Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami di:
          <br />
          WhatsApp: +62 822-6756-7946
          <br />
          Email: saharamart12@gmail.com
        </p>
      </div>
    </div>
  );
}
```

---

### Task 3.2: Create Terms & Conditions (1.5 hours)

**Create:** `app/syarat-ketentuan/page.tsx`

```typescript
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Syarat & Ketentuan</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Terakhir diperbarui: 14 Januari 2026
        </p>

        <h2>1. Penerimaan Syarat</h2>
        <p>
          Dengan menggunakan website Sahara Mart, Anda menyetujui syarat
          dan ketentuan berikut.
        </p>

        <h2>2. Pemesanan</h2>
        <ul>
          <li>Minimal pemesanan: Rp 5.000</li>
          <li>Pesanan dikonfirmasi via WhatsApp</li>
          <li>Pembayaran dilakukan setelah konfirmasi</li>
        </ul>

        <h2>3. Harga</h2>
        <p>
          Harga yang tertera sudah termasuk PPN. Ongkos kirim dihitung
          saat konfirmasi pesanan.
        </p>

        <h2>4. Pembayaran</h2>
        <ul>
          <li>Transfer Bank</li>
          <li>Cash on Delivery (COD)</li>
          <li>E-wallet (GoPay, OVO, Dana)</li>
        </ul>

        <h2>5. Pengiriman</h2>
        <ul>
          <li>Wilayah Tapanuli Selatan: 1-2 hari</li>
          <li>Luar kota: 3-7 hari</li>
          <li>Gratis ongkir untuk belanja minimum Rp 100.000</li>
        </ul>

        <h2>6. Pengembalian</h2>
        <ul>
          <li>Barang rusak/cacat: 100% refund</li>
          <li>Barang salah kirim: ganti produk yang benar</li>
          <li>Waktu klaim: maksimal 2x24 jam setelah terima barang</li>
        </ul>

        <h2>7. Pembatalan Pesanan</h2>
        <ul>
          <li>Bisa dibatalkan sebelum barang dikirim</li>
          <li>Refund 100% jika belum dikirim</li>
          <li>Hubungi CS untuk pembatalan</li>
        </ul>

        <h2>8. Hubungi Kami</h2>
        <p>
          WhatsApp: +62 822-6756-7946<br />
          Email: saharamart12@gmail.com<br />
          Alamat: Hapesong Baru, Batang Toru, Tapanuli Selatan
        </p>
      </div>
    </div>
  );
}
```

---

### Task 3.3: Create FAQ Page (1 hour)

**Create:** `app/faq/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'Bagaimana cara berbelanja di Sahara Mart?',
      answer: 'Pilih produk → Tambah ke keranjang → Isi data customer → Checkout via WhatsApp → Tunggu konfirmasi dari admin.'
    },
    {
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Kami menerima transfer bank (BRI, BCA, Mandiri), e-wallet (GoPay, OVO, Dana), dan COD.'
    },
    {
      question: 'Berapa lama pengiriman?',
      answer: 'Untuk wilayah Tapanuli Selatan 1-2 hari. Luar kota 3-7 hari kerja.'
    },
    {
      question: 'Apakah ada minimal pembelian?',
      answer: 'Ya, minimal pembelian Rp 5.000. Gratis ongkir untuk belanja di atas Rp 100.000.'
    },
    {
      question: 'Bagaimana cara melacak pesanan?',
      answer: 'Gunakan order number yang dikirim via WhatsApp, lalu masuk ke halaman Tracking di website.'
    },
    {
      question: 'Bisa retur barang tidak?',
      answer: 'Bisa! Untuk barang rusak/cacat atau salah kirim. Hubungi CS maksimal 2x24 jam setelah terima barang.'
    },
    {
      question: 'Apakah barang selalu tersedia?',
      answer: 'Stok update real-time. Jika stok habis, akan ada notifikasi saat checkout.'
    },
    {
      question: 'Bagaimana cara membatalkan pesanan?',
      answer: 'Hubungi CS via WhatsApp sebelum barang dikirim. Refund 100% jika belum dikirim.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600 text-center mb-12">
        Pertanyaan yang sering ditanyakan
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-800">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Masih ada pertanyaan?</h3>
        <p className="text-gray-600 mb-4">
          Hubungi customer service kami via WhatsApp
        </p>
        <a
          href="https://wa.me/6282267567946?text=Halo%20Sahara%20Mart%2C%20saya%20butuh%20bantuan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Chat Admin
        </a>
      </div>
    </div>
  );
}
```

---

### Task 3.4: Update Footer Links (30 min)

**File:** `components/Footer.tsx` (create if not exists)

Add links to:
- Kebijakan Privasi
- Syarat & Ketentuan
- FAQ
- Hubungi Kami

---

## 🔴 DAY 5: TESTING (2 Hours)

### Task 5.1: End-to-End Testing

**Test Flow:**
```
1. Browse products ✅
2. Add to cart ✅
3. Update quantity ✅
4. Remove from cart ✅
5. Checkout ✅
6. Receive WhatsApp ✅
7. Track order ✅
8. Admin sees order ✅
9. Admin updates status ✅
10. Customer sees update ✅
```

### Task 5.2: Security Testing

```bash
# Test SQL injection
curl -X POST http://localhost:3000/api/orders \
  -d '{"customer_name": "'; DROP TABLE orders--"}'

# Test XSS
curl -X POST http://localhost:3000/api/orders \
  -d '{"customer_name": "<script>alert(1)</script>"}'

# Expected: Both should be sanitized
```

### Task 5.3: Performance Testing

```bash
# Load test
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:3000

# Expected: < 500ms response time
```

---

## ✅ CHECKLIST FINAL

### Security ✅
- [ ] .env.local removed from git
- [ ] Supabase keys regenerated
- [ ] No test files in production
- [ ] WhatsApp number standardized

### APIs ✅
- [ ] DELETE product implemented
- [ ] Category CRUD complete
- [ ] All APIs tested

### Legal ✅
- [ ] Privacy policy live
- [ ] Terms & conditions live
- [ ] FAQ page live
- [ ] Footer updated

### Testing ✅
- [ ] End-to-end flow works
- [ ] Security tests passed
- [ ] Performance acceptable

---

## 🚀 DEPLOYMENT

After all tasks completed:

```bash
# 1. Final commit
git add .
git commit -m "feat: security fixes, complete APIs, add legal pages"
git push origin master

# 2. Deploy to Vercel
vercel --prod

# 3. Verify production
curl https://saharamart.com
curl https://saharamart.com/kebijakan-privasi
curl https://saharamart.com/syarat-ketentuan
curl https://saharamart.com/faq

# 4. Test checkout flow in production
```

---

## 📞 SUPPORT

If you get stuck:
1. Check error logs in Vercel dashboard
2. Check Supabase logs
3. Use browser DevTools (F12)
4. Read documentation files (AUDIT_REPORT.md, ROADMAP.md)

---

**Created:** 2026-01-14
**Status:** Ready to execute
**Estimated Time:** 2-3 days
**Priority:** CRITICAL 🔴
