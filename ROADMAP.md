# 🗓️ SAHARA MART - DEVELOPMENT ROADMAP

---

## 🎯 VISION

Menjadikan Sahara Mart sebagai **platform e-commerce minimarket terpercaya** dengan sistem otomatis dan pengalaman pelanggan yang profesional.

---

## 📅 PHASE 1: CRITICAL FIXES (Week 1)

**Goal:** Production-ready untuk soft launch

### Day 1-2: Security Fixes 🔴

- [ ] **Remove .env.local from git**
  ```bash
  echo ".env.local" >> .gitignore
  git rm --cached .env.local
  git commit -m "chore: remove sensitive files"
  ```

- [ ] **Regenerate Supabase keys**
  - Go to Supabase Dashboard → Settings → API
  - Regenerate anon key & service role key
  - Update .env.local (yang baru)

- [ ] **Remove test files**
  ```bash
  rm -rf app/test-db
  rm -rf tmpclaude-*
  git add .
  git commit -m "chore: remove test files"
  ```

- [ ] **Standardize WhatsApp number**
  - Find & replace all WhatsApp numbers
  - Use only: +62 822-6756-7946

**Expected:** No security vulnerabilities

---

### Day 3-4: Complete Missing APIs 🟡

- [ ] **Implement DELETE /api/products/[id]**
  ```typescript
  export async function DELETE(request: NextRequest) {
    // Soft delete: set is_deleted = true
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('products')
      .update({ is_deleted: true })
      .eq('id', id);

    return NextResponse.json({ success: !error });
  }
  ```

- [ ] **Add Category CRUD APIs**
  - POST /api/categories - Create category
  - PUT /api/categories/[id] - Update category
  - DELETE /api/categories/[id] - Delete category

- [ ] **Test all APIs**
  - Use Postman/Thunder Client
  - Document in API_DOCS.md

**Expected:** Complete CRUD operations

---

### Day 5-7: Legal & Content Pages 📄

- [ ] **Create Privacy Policy**
  ```bash
  mkdir app/kebijakan-privasi
  # Add page.tsx with Indonesian privacy policy
  ```

- [ ] **Create Terms & Conditions**
  ```bash
  mkdir app/syarat-ketentuan
  # Add page.tsx with T&C for e-commerce
  ```

- [ ] **Create FAQ Page**
  ```bash
  mkdir app/faq
  # Add common questions & answers
  ```

- [ ] **Update Footer**
  - Add links to legal pages
  - Add copyright notice
  - Add social media links

**Expected:** Legal compliance ready

---

## 📅 PHASE 2: AUTHENTICATION (Week 2-3)

**Goal:** Secure admin access & customer accounts

### Week 2: Admin Authentication

- [ ] **Setup Supabase Auth**
  ```typescript
  // lib/auth.ts
  export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }
  ```

- [ ] **Create middleware.ts**
  ```typescript
  export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Check authentication
      const token = request.cookies.get('sb-access-token');
      if (!token) {
        return NextResponse.redirect('/admin/login');
      }
    }
  }
  ```

- [ ] **Update admin/login page**
  - Add proper login form
  - Add error handling
  - Add remember me option

- [ ] **Add logout functionality**
  - Logout button di header
  - Clear session
  - Redirect to login

**Expected:** Only authenticated users can access admin

---

### Week 3: Customer Accounts (Optional)

- [ ] **Create users table**
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] **Add registration page**
  - /daftar - Registration form
  - Email verification

- [ ] **Add login page**
  - /masuk - Login form
  - Social login (Google, Facebook)

- [ ] **Add user dashboard**
  - /akun - User profile
  - /akun/pesanan - Order history
  - /akun/alamat - Address book

**Expected:** Customers can create accounts

---

## 📅 PHASE 3: PAYMENT INTEGRATION (Week 4-5)

**Goal:** Accept online payments

### Week 4: Midtrans Integration

- [ ] **Register Midtrans account**
  - Get Merchant ID
  - Get Client Key & Server Key

- [ ] **Install Midtrans SDK**
  ```bash
  npm install midtrans-client
  ```

- [ ] **Create payment API**
  ```typescript
  // app/api/payment/create/route.ts
  export async function POST(request: NextRequest) {
    const snap = new midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json(transaction);
  }
  ```

- [ ] **Update checkout flow**
  - Add payment method selection
  - Show Midtrans Snap popup
  - Handle payment callback

**Expected:** Accept credit card, e-wallet, bank transfer

---

### Week 5: Payment Verification

- [ ] **Create webhook handler**
  ```typescript
  // app/api/payment/webhook/route.ts
  export async function POST(request: NextRequest) {
    const notification = await request.json();

    // Verify signature
    // Update order payment_status
    // Send confirmation email
  }
  ```

- [ ] **Auto-update order status**
  - Paid → Confirmed
  - Failed → Cancelled

- [ ] **Add payment retry**
  - Allow customer to retry failed payment
  - Payment link expires in 24h

**Expected:** Automated payment verification

---

## 📅 PHASE 4: NOTIFICATIONS (Week 6)

**Goal:** Automated email & WhatsApp notifications

### Email Notifications

- [ ] **Setup SendGrid**
  ```bash
  npm install @sendgrid/mail
  ```

- [ ] **Create email templates**
  - Order confirmation
  - Order status updates
  - Payment confirmation
  - Shipping notification

- [ ] **Send emails automatically**
  ```typescript
  // lib/email.ts
  export async function sendOrderConfirmation(order: Order) {
    await sgMail.send({
      to: order.customer_email,
      from: 'noreply@saharamart.com',
      subject: 'Pesanan Anda Telah Diterima',
      html: orderConfirmationTemplate(order)
    });
  }
  ```

**Expected:** Customers receive email notifications

---

### WhatsApp Notifications (Optional)

- [ ] **Setup Fonnte/Wablas**
  - Get API key
  - Setup webhook

- [ ] **Send WhatsApp notifications**
  - Order confirmation
  - Status updates
  - Delivery notification

**Expected:** Automated WhatsApp messages

---

## 📅 PHASE 5: SEO & MARKETING (Week 7-8)

**Goal:** Improve search engine visibility

### Week 7: SEO Optimization

- [ ] **Add meta tags**
  ```typescript
  // app/layout.tsx
  export const metadata = {
    title: 'Sahara Mart - Minimarket Online Terpercaya',
    description: 'Belanja kebutuhan sehari-hari...',
    keywords: 'minimarket online, belanja online, ...',
    openGraph: {
      title: 'Sahara Mart',
      description: '...',
      images: ['/og-image.jpg']
    }
  };
  ```

- [ ] **Generate sitemap.xml**
  ```typescript
  // app/sitemap.ts
  export default function sitemap() {
    return [
      { url: 'https://saharamart.com', priority: 1.0 },
      { url: 'https://saharamart.com/katalog', priority: 0.8 },
      // ... all pages
    ];
  }
  ```

- [ ] **Add robots.txt**
  ```
  User-agent: *
  Allow: /
  Sitemap: https://saharamart.com/sitemap.xml
  ```

- [ ] **Add structured data**
  ```typescript
  // JSON-LD for products
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "price": product.price,
    // ...
  };
  ```

**Expected:** Better Google ranking

---

### Week 8: Marketing Tools

- [ ] **Add Google Analytics**
  ```typescript
  // app/layout.tsx
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
    strategy="afterInteractive"
  />
  ```

- [ ] **Add Facebook Pixel**
- [ ] **Add newsletter subscription**
- [ ] **Create social media content plan**

**Expected:** Track visitors & conversions

---

## 📅 PHASE 6: ADVANCED FEATURES (Month 3-4)

**Goal:** Professional e-commerce features

### Product Features

- [ ] **Product reviews & ratings**
  - Create reviews table
  - Add review form
  - Show average rating
  - Sort by rating

- [ ] **Product variants**
  - Size, color options
  - Variant pricing
  - Variant stock

- [ ] **Related products**
  - AI-based recommendations
  - "Customers also bought"

- [ ] **Product comparison**
  - Compare up to 3 products
  - Side-by-side features

---

### Inventory Management

- [ ] **Stock tracking**
  - Auto-decrement on order
  - Low stock alerts
  - Out of stock notifications

- [ ] **Inventory reports**
  - Stock movement
  - Reorder suggestions
  - Dead stock analysis

---

### Marketing Features

- [ ] **Discount codes**
  - Percentage & fixed amount
  - Minimum purchase
  - Expiry date

- [ ] **Flash sales**
  - Time-limited offers
  - Countdown timer
  - Limited quantity

- [ ] **Loyalty program**
  - Points system
  - Rewards catalog
  - Member tiers

---

### Shipping Integration

- [ ] **JNE/J&T/SiCepat API**
  - Auto calculate shipping cost
  - Multiple courier options
  - Tracking integration

- [ ] **Address validation**
  - Autocomplete address
  - Google Maps integration

---

## 📅 PHASE 7: MOBILE APP (Month 5-6)

**Goal:** Native mobile experience

### React Native App

- [ ] **Setup React Native project**
  ```bash
  npx react-native init SaharaMartApp
  ```

- [ ] **Implement core features**
  - Product browsing
  - Shopping cart
  - Checkout
  - Order tracking

- [ ] **Add push notifications**
  - Firebase Cloud Messaging
  - Order status updates

- [ ] **Publish to stores**
  - Google Play Store
  - Apple App Store

**Expected:** Mobile app for customers

---

## 📊 SUCCESS METRICS

### Phase 1 (Week 1):
- [ ] 0 security vulnerabilities
- [ ] 100% API coverage
- [ ] Legal pages live

### Phase 2 (Week 2-3):
- [ ] Admin authentication working
- [ ] 0 unauthorized access

### Phase 3 (Week 4-5):
- [ ] Online payment working
- [ ] 90% payment success rate

### Phase 4 (Week 6):
- [ ] Email open rate > 30%
- [ ] Customer receives updates

### Phase 5 (Week 7-8):
- [ ] Organic traffic +50%
- [ ] Google ranking < page 3

### Phase 6 (Month 3-4):
- [ ] Average rating > 4.0
- [ ] Return customer rate > 20%

### Phase 7 (Month 5-6):
- [ ] Mobile app downloads > 1,000
- [ ] App rating > 4.5

---

## 🎯 MILESTONES

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Soft Launch (WhatsApp only) | Week 1 | 🟡 In Progress |
| Admin Auth | Week 3 | ⚪ Not Started |
| Payment Integration | Week 5 | ⚪ Not Started |
| Email Notifications | Week 6 | ⚪ Not Started |
| SEO Optimization | Week 8 | ⚪ Not Started |
| Full Launch | Month 2 | ⚪ Not Started |
| Mobile App | Month 6 | ⚪ Not Started |

---

## 💰 BUDGET ESTIMATION

### Infrastructure:
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Domain: $15/year
- **Total: ~$50/month**

### Services:
- Midtrans: 2% transaction fee
- SendGrid: $15/month (40k emails)
- Fonnte (WhatsApp): $10/month
- **Total: ~$25/month + transaction fees**

### Development:
- Phase 1-2: 2 weeks
- Phase 3-4: 2 weeks
- Phase 5-6: 2 months
- Phase 7: 2 months
- **Total: ~6 months**

---

## 👥 TEAM REQUIREMENTS

### Current (Solo):
- ✅ Full-stack developer
- ✅ Basic design skills

### Needed for Scaling:
- Backend developer (API optimization)
- Frontend developer (React specialist)
- UI/UX designer
- Content writer
- Digital marketer
- Customer support

---

## 📞 SUPPORT & RESOURCES

**Documentation:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Midtrans: https://docs.midtrans.com

**Community:**
- Next.js Discord
- Supabase Discord
- Stack Overflow

**Tools:**
- Figma (design)
- GitHub (code)
- Vercel (deployment)
- Sentry (error tracking)

---

**Last Updated:** 2026-01-14
**Next Review:** Every 2 weeks
**Status:** Phase 1 in progress
