# 🤖 SAYA (CLAUDE CODE) - TASK ASSIGNMENT
## Backend & Architecture Lead

**AI Role:** Lead Architect & Backend Specialist
**Branch Pattern:** `feature/claude-*`
**Responsibility:** Complex backend logic, architecture, git operations

---

## 📊 PROJECT STATUS CHECK (Updated: 2026-01-20)

### ✅ ALREADY COMPLETED (85%) - DO NOT REBUILD!

**Backend Infrastructure (DONE):**
- ✅ All Product APIs (`app/api/products/`) - Full CRUD operational
- ✅ Order Management APIs (`app/api/orders/`) - Complete
- ✅ Stock Management APIs (`app/api/stock/`) - With export & notifications
- ✅ Analytics APIs (`app/api/analytics/`) - Dashboard ready
- ✅ Category APIs (`app/api/categories/`) - Full management
- ✅ Image Upload API (`app/api/upload/`) - Working with Supabase Storage
- ✅ CSRF Protection (`lib/csrf.ts`) - Active
- ✅ Rate Limiting (`lib/rateLimiter.ts`) - Implemented
- ✅ Supabase Integration (`lib/supabase/`) - Client + Server + Storage
- ✅ Database types (`types/supabase.ts`) - Generated

**Database Tables (DONE):**
- ✅ products table - Complete with all fields
- ✅ categories table - Active
- ✅ orders table - Operational
- ✅ order_items table - Working
- ✅ stock_logs table - Tracking enabled
- ✅ admin users - Auth configured

**Authentication (DONE):**
- ✅ Admin authentication via Supabase Auth
- ✅ Protected admin routes
- ✅ Session management

### 🚧 REMAINING WORK (15%) - YOUR FOCUS!

**What You WILL Build (Not Exist Yet):**
1. ❌ Email notification system - **DOES NOT EXIST**
2. ❌ Invoice PDF generation - **DOES NOT EXIST**
3. ❌ Customer user accounts - **ADMIN ONLY currently**
4. ❌ Advanced search/autocomplete - **Basic search only**
5. ❌ Performance optimization - **NEEDS IMPROVEMENT**
6. ❌ Caching layer - **NOT IMPLEMENTED**

**CRITICAL VERIFICATION BEFORE CODING:**
```typescript
// ALWAYS run this check first:
await grep('email|resend|sendgrid', { path: 'lib/' })
// ✅ If empty → Safe to build email system

await grep('invoice|pdf|jspdf', { path: 'lib/' })
// ✅ If empty → Safe to build PDF generator

await grep('customers|customer_addresses', { path: 'app/api/' })
// ✅ If empty → Safe to build customer accounts
```

**If you find existing code:**
- 🔍 READ it carefully
- ♻️ REUSE existing patterns
- 🚫 DON'T rebuild from scratch

---

## ⚠️ CRITICAL: READ BEFORE STARTING ANY TASK

### 🔍 MANDATORY CODEBASE ANALYSIS PROMPT

**BEFORE implementing ANY task, you MUST run this analysis:**

```
STEP 1: UNDERSTAND CURRENT ARCHITECTURE
----------------------------------------
I need to understand the existing codebase before building [FEATURE_NAME].

1. Read existing related files:
   - Check app/api/ for existing similar endpoints
   - Review lib/ for existing utilities I can reuse
   - Examine types/ for existing type definitions
   - Look at components/ to understand UI integration points

2. Identify integration points:
   - Which existing API endpoints will be called?
   - Which database tables are involved?
   - Which components will consume my new API?
   - What authentication/authorization is needed?

3. Detect dependencies:
   - What files import from what I'm about to create?
   - What existing functions/utilities should I use?
   - Are there similar patterns I should follow?
   - What's the current error handling pattern?

4. Map data flow:
   - User action → Frontend → API → Database → Response
   - Trace how data flows through the system
   - Identify where my new code fits in this flow

STEP 2: VERIFY NO DUPLICATION
------------------------------
Before creating new files, check if functionality already exists:

Search for:
- Similar API endpoints (grep in app/api/)
- Existing utilities (search in lib/)
- Similar database queries
- Existing type definitions

If found → REUSE, don't recreate!

STEP 3: PLAN INTEGRATION
-------------------------
Map out EXACTLY how my new code will integrate:

1. Frontend Integration:
   - Which component files will call my API?
   - What props/parameters will they pass?
   - What response format do they expect?
   - Will Cursor AI need to update any UI?

2. Database Integration:
   - Which tables am I reading from?
   - Which tables am I writing to?
   - Are there foreign key relationships?
   - Do I need transactions?

3. Cross-Feature Integration:
   - Will my new feature affect existing features?
   - Do I need to update existing API endpoints?
   - Are there cascade effects I need to handle?

STEP 4: DOCUMENT INTEGRATION POINTS
------------------------------------
Before coding, create mental map:

INPUTS (what I receive):
- From frontend: [list parameters]
- From database: [list tables/fields]
- From other APIs: [list dependencies]

OUTPUTS (what I produce):
- To frontend: [response format]
- To database: [what I write]
- To other systems: [side effects]

STEP 5: VALIDATE UNDERSTANDING
-------------------------------
Ask yourself:
✓ Do I understand how this fits in existing architecture?
✓ Have I identified all integration points?
✓ Do I know which Cursor/Copilot code will connect to mine?
✓ Have I checked for duplicate functionality?
✓ Do I know the full data flow?

If NO to any → READ MORE FILES first!
```

### 📖 HOW TO USE THIS PROMPT

**Example: Before Building Email System**

```typescript
// WRONG APPROACH (Don't do this!):
// Just start coding without understanding existing code

// RIGHT APPROACH:
// 1. First, read these files to understand current architecture:

await read('app/api/orders/route.ts')
// → See how orders are created
// → Understand response format
// → See error handling pattern

await read('lib/supabase/client.ts')
// → Understand database connection pattern
// → See how other features use Supabase

await read('types/supabase.ts')
// → See existing type definitions
// → Understand database schema

await grep('sendEmail', { path: 'app/api/' })
// → Check if email sending already exists
// → Avoid duplication

await grep('toast.success', { path: 'app/' })
// → Understand how UI shows success messages
// → Know what Copilot will integrate

// 2. Map integration points:
/*
INTEGRATION MAP for Email System:

INPUTS:
- Order data from app/api/checkout/route.ts
- Customer email from order object
- Product details from order items

MY CODE WILL CREATE:
- lib/email/client.ts (new)
- app/api/email/send/route.ts (new)
- types/email.ts (new)

CURSOR AI WILL CONSUME:
- POST /api/email/send endpoint
- Response: { success: boolean, messageId: string }
- Will add UI notifications in components/

COPILOT WILL INTEGRATE:
- Add API call in checkout flow
- Add type imports
- Handle error states

DATA FLOW:
1. User completes checkout
2. app/api/checkout/route.ts creates order
3. Calls my POST /api/email/send
4. My code sends email via Resend
5. Returns success/failure
6. Copilot shows toast notification
7. Cursor updates UI state
*/

// 3. Now I can code with full context!
```

### 🎯 DETECTION CHECKLIST

Before implementing each task, verify:

**Architecture Understanding:**
- [ ] I've read all related existing files
- [ ] I understand current patterns and conventions
- [ ] I know where my code fits in the system
- [ ] I've identified reusable utilities

**Integration Detection:**
- [ ] I know which frontend files will call my API
- [ ] I know what database tables are involved
- [ ] I've identified all foreign key relationships
- [ ] I understand authentication flow

**Collaboration Awareness:**
- [ ] I know what Cursor AI will build (UI components)
- [ ] I know what Copilot will integrate (API calls, types)
- [ ] I've defined clear interfaces for them
- [ ] I've documented expected request/response formats

**No Duplication:**
- [ ] I've searched for similar functionality
- [ ] I'm not recreating existing utilities
- [ ] I'm following existing patterns
- [ ] I'm reusing existing types where possible

---

## 🎯 PRIMARY RESPONSIBILITIES

### 1. Backend Development
- API endpoint creation & management
- Database schema design & migrations
- Business logic implementation
- Server-side data processing
- Authentication & authorization logic

### 2. Architecture & Planning
- Feature architecture design
- Technical decision making
- System integration planning
- Performance optimization strategy
- Security implementation

### 3. Git Operations & Coordination
- Branch management & merging
- Conflict resolution
- Pull request reviews
- Code quality enforcement
- Deployment orchestration

### 4. Testing & Quality Assurance
- Integration testing
- Build validation
- Type safety verification
- Security audits
- Performance benchmarking

---

## 📋 TASK LIST (Priority Order)

### 🔴 SPRINT 1: Email & Invoice System (Days 1-2)

#### Task 1.1: Email Notification Infrastructure
**Branch:** `feature/claude-email-system`
**Priority:** HIGH
**Estimated Time:** 2-3 hours

**Implementation Details:**
```typescript
Files to Create:
├── lib/email/
│   ├── client.ts              // Email service client (Resend/SendGrid)
│   ├── templates/
│   │   ├── order-confirmation.ts   // Order email template
│   │   ├── low-stock-alert.ts      // Admin alert template
│   │   └── welcome.ts              // Customer welcome email
│   └── send.ts                // Email sending utility

├── app/api/email/
│   ├── send/route.ts          // Send email endpoint
│   └── templates/route.ts     // Template preview endpoint

└── types/email.ts             // Email type definitions
```

**Tasks:**
1. Install email service SDK (Resend recommended)
   ```bash
   npm install resend
   ```

2. Create email client configuration
   ```typescript
   // lib/email/client.ts
   import { Resend } from 'resend'

   if (!process.env.RESEND_API_KEY) {
     throw new Error('RESEND_API_KEY is not defined')
   }

   export const emailClient = new Resend(process.env.RESEND_API_KEY)
   ```

3. Build email templates with React Email components
   - Order confirmation template
   - Low stock alert template
   - Welcome email template

4. Create API endpoints for email sending
   - POST /api/email/send - Send transactional email
   - GET /api/email/templates - Preview templates

5. Integrate with existing flows:
   - After order creation → send confirmation
   - When stock < threshold → alert admin
   - New customer → welcome email

**Success Criteria:**
- ✅ Email service configured and tested
- ✅ Templates render correctly
- ✅ API endpoints functional
- ✅ Integration with order flow complete
- ✅ Error handling implemented
- ✅ Rate limiting applied

**Files NOT to Touch (Cursor's territory):**
- ❌ Frontend email notification UI
- ❌ Email success/error toasts
- ❌ UI components for email preferences

---

#### Task 1.2: Invoice PDF Generation System
**Branch:** `feature/claude-invoice-pdf`
**Priority:** HIGH
**Estimated Time:** 2-3 hours

**Implementation Details:**
```typescript
Files to Create:
├── lib/invoice/
│   ├── generator.ts           // PDF generation logic
│   ├── template.ts            // Invoice template
│   └── types.ts               // Invoice type definitions

├── app/api/invoice/
│   └── [orderId]/route.ts     // Generate & download invoice

└── types/invoice.ts           // Invoice interfaces
```

**Tasks:**
1. Install PDF generation library
   ```bash
   npm install jspdf jspdf-autotable
   ```

2. Create invoice generator utility
   ```typescript
   // lib/invoice/generator.ts
   import jsPDF from 'jspdf'
   import autoTable from 'jspdf-autotable'

   export async function generateInvoice(order: Order): Promise<Buffer> {
     const doc = new jsPDF()

     // Add company logo
     // Add invoice header
     // Add order details
     // Add items table
     // Add totals
     // Add footer

     return Buffer.from(doc.output('arraybuffer'))
   }
   ```

3. Create API endpoint for invoice generation
   ```typescript
   // app/api/invoice/[orderId]/route.ts
   export async function GET(
     req: Request,
     { params }: { params: { orderId: string } }
   ) {
     // Fetch order from database
     // Generate PDF
     // Return as downloadable file
   }
   ```

4. Add invoice email attachment capability
   - Integrate with email system
   - Attach PDF to order confirmation email

**Success Criteria:**
- ✅ PDF generates correctly with all order data
- ✅ Company branding included
- ✅ API endpoint returns downloadable PDF
- ✅ Email attachment working
- ✅ Error handling for missing orders
- ✅ Performance optimized (< 2 seconds)

**Files NOT to Touch (Cursor's territory):**
- ❌ Download button UI in admin/order detail
- ❌ Invoice preview modal
- ❌ Loading states for PDF generation

---

### 🟡 SPRINT 2: Performance Optimization (Days 3-4)

#### Task 2.1: Database Query Optimization
**Branch:** `feature/claude-db-optimization`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Implementation Details:**
```sql
Optimize queries in:
├── app/api/products/route.ts
├── app/api/orders/route.ts
├── app/api/analytics/route.ts
└── app/api/stock/route.ts
```

**Tasks:**
1. Analyze current database queries
   - Add query logging
   - Identify slow queries (> 100ms)
   - Check for N+1 query problems

2. Implement optimizations:
   ```typescript
   // BEFORE (slow)
   const products = await supabase.from('products').select('*')

   // AFTER (fast with pagination)
   const { data: products, count } = await supabase
     .from('products')
     .select('*, categories(*)', { count: 'exact' })
     .range(offset, offset + limit - 1)
     .order('created_at', { ascending: false })
   ```

3. Add database indexes (if needed)
   ```sql
   -- Run in Supabase SQL Editor
   CREATE INDEX IF NOT EXISTS idx_products_category
   ON products(category_id);

   CREATE INDEX IF NOT EXISTS idx_products_name
   ON products(name);

   CREATE INDEX IF NOT EXISTS idx_orders_created
   ON orders(created_at DESC);
   ```

4. Implement query result caching
   ```typescript
   // lib/cache.ts
   import { unstable_cache } from 'next/cache'

   export const getCachedProducts = unstable_cache(
     async () => await fetchProducts(),
     ['products'],
     { revalidate: 60 } // Cache for 60 seconds
   )
   ```

**Success Criteria:**
- ✅ All queries < 100ms
- ✅ Pagination implemented on all lists
- ✅ Indexes created for frequently queried fields
- ✅ Caching implemented for static data
- ✅ No N+1 query issues

---

#### Task 2.2: API Response Optimization
**Branch:** `feature/claude-api-optimization`
**Priority:** MEDIUM
**Estimated Time:** 1.5 hours

**Tasks:**
1. Implement response compression
   ```typescript
   // middleware.ts
   export function middleware(request: Request) {
     const response = NextResponse.next()
     response.headers.set('Content-Encoding', 'gzip')
     return response
   }
   ```

2. Add response caching headers
   ```typescript
   return new Response(JSON.stringify(data), {
     headers: {
       'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
       'Content-Type': 'application/json'
     }
   })
   ```

3. Optimize JSON payload sizes
   - Remove unnecessary fields
   - Implement field selection
   - Compress large responses

4. Implement API rate limiting
   ```typescript
   // Already have rateLimiter.ts, enhance it
   export const apiLimiter = createRateLimiter({
     windowMs: 60 * 1000, // 1 minute
     max: 100, // 100 requests per minute
   })
   ```

**Success Criteria:**
- ✅ Response times < 200ms
- ✅ Gzip compression active
- ✅ Cache headers configured
- ✅ Rate limiting prevents abuse
- ✅ Payload sizes minimized

---

### 🟢 SPRINT 3: Advanced Features (Days 5-6)

#### Task 3.1: User Account System Backend
**Branch:** `feature/claude-user-accounts`
**Priority:** MEDIUM
**Estimated Time:** 3 hours

**Implementation Details:**
```typescript
Files to Create:
├── app/api/auth/
│   ├── register/route.ts      // Customer registration
│   ├── profile/route.ts       // Profile management
│   └── addresses/route.ts     // Saved addresses

├── lib/auth/
│   ├── customer.ts            // Customer auth utilities
│   └── session.ts             // Session management

└── Database migrations:
    ├── customers table
    ├── addresses table
    └── order_history view
```

**Tasks:**
1. Extend Supabase auth for customers
   ```sql
   CREATE TABLE customers (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     phone TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE customer_addresses (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
     label TEXT NOT NULL, -- 'home', 'work', etc.
     full_address TEXT NOT NULL,
     district TEXT,
     city TEXT,
     postal_code TEXT,
     is_default BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. Create registration API
   ```typescript
   // app/api/auth/register/route.ts
   export async function POST(req: Request) {
     const { email, password, fullName, phone } = await req.json()

     // Validate input
     // Create Supabase auth user
     // Create customer record
     // Send welcome email
     // Return success with session
   }
   ```

3. Implement profile management
4. Add saved addresses functionality
5. Link orders to customer accounts

**Success Criteria:**
- ✅ Customer registration working
- ✅ Profile CRUD complete
- ✅ Address management functional
- ✅ Order history accessible
- ✅ Session management secure
- ✅ Email verification (optional)

**Files NOT to Touch (Cursor's territory):**
- ❌ Registration form UI
- ❌ Profile page UI
- ❌ Address book UI

---

#### Task 3.2: Advanced Search Backend
**Branch:** `feature/claude-search-enhancement`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Tasks:**
1. Implement full-text search in Supabase
   ```sql
   -- Add text search vector column
   ALTER TABLE products
   ADD COLUMN search_vector tsvector;

   -- Create index
   CREATE INDEX products_search_idx
   ON products USING GIN(search_vector);

   -- Update trigger
   CREATE OR REPLACE FUNCTION products_search_trigger()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.search_vector :=
       setweight(to_tsvector('indonesian', COALESCE(NEW.name, '')), 'A') ||
       setweight(to_tsvector('indonesian', COALESCE(NEW.description, '')), 'B') ||
       setweight(to_tsvector('indonesian', COALESCE(NEW.sku, '')), 'C');
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. Create search API with autocomplete
   ```typescript
   // app/api/search/route.ts
   export async function GET(req: Request) {
     const { searchParams } = new URL(req.url)
     const query = searchParams.get('q')

     const { data } = await supabase
       .from('products')
       .select('name, sku, category')
       .textSearch('search_vector', query, {
         type: 'websearch',
         config: 'indonesian'
       })
       .limit(10)

     return Response.json(data)
   }
   ```

3. Implement search suggestions endpoint
4. Add search analytics tracking

**Success Criteria:**
- ✅ Full-text search functional
- ✅ Search speed < 100ms
- ✅ Autocomplete suggestions accurate
- ✅ Supports Indonesian language
- ✅ Typo tolerance implemented

---

### 🔵 SPRINT 4: Final Testing & Deployment (Day 7)

#### Task 4.1: Comprehensive Testing
**Branch:** `dev` (no feature branch)
**Priority:** HIGH
**Estimated Time:** 3 hours

**Tasks:**
1. Run full build test
   ```bash
   npm run build
   ```

2. Type checking
   ```bash
   npx tsc --noEmit
   ```

3. ESLint validation
   ```bash
   npm run lint
   ```

4. API endpoint testing
   - Test all endpoints with Postman/Insomnia
   - Verify error handling
   - Check rate limiting
   - Validate CSRF protection

5. Database integrity check
   - Verify all foreign keys
   - Check for orphaned records
   - Validate data types

6. Security audit
   - Check for exposed secrets
   - Verify authentication on protected routes
   - Test CSRF protection
   - Validate input sanitization

**Success Criteria:**
- ✅ Build succeeds without errors
- ✅ No TypeScript errors
- ✅ ESLint passes (0 errors)
- ✅ All API endpoints tested
- ✅ Database integrity verified
- ✅ Security audit complete

---

#### Task 4.2: Production Deployment
**Branch:** `main`
**Priority:** HIGH
**Estimated Time:** 2 hours

**Tasks:**
1. Final code review
   - Review all merged PRs
   - Check code quality
   - Verify documentation

2. Merge dev → main
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff dev
   git push origin main
   ```

3. Deploy to Vercel
   - Configure environment variables
   - Set up custom domain (if applicable)
   - Enable analytics
   - Configure deployment settings

4. Post-deployment verification
   - Test all critical paths
   - Verify API endpoints
   - Check database connectivity
   - Monitor error logs

5. Setup monitoring
   - Configure error tracking (Sentry)
   - Setup uptime monitoring
   - Enable performance monitoring
   - Configure alerts

**Success Criteria:**
- ✅ Deployment successful
- ✅ All features working in production
- ✅ No critical errors
- ✅ Performance metrics acceptable
- ✅ Monitoring active

---

## 🚫 BOUNDARIES - DO NOT TOUCH

### Cursor AI's Territory (Frontend/UI)
- ❌ Any component files in `components/`
- ❌ Page layout and styling
- ❌ UI state management (useState, useEffect for UI)
- ❌ CSS/Tailwind styling
- ❌ Loading skeletons
- ❌ Toast notifications
- ❌ Modal components
- ❌ Form UI components
- ❌ Button styling
- ❌ Icons and images

### Copilot's Territory (Integration)
- ❌ Type definitions for UI components
- ❌ Client-side API calls from components
- ❌ Form validation in components
- ❌ Error handling in UI
- ❌ Loading states in components
- ❌ Frontend routing logic

### Your Safe Zone (Backend)
- ✅ All files in `app/api/`
- ✅ All files in `lib/` (except utils.ts)
- ✅ Database migrations
- ✅ Server-side utilities
- ✅ Authentication logic
- ✅ Email sending logic
- ✅ PDF generation
- ✅ Server-side validation
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ Git operations

---

## 📝 GIT WORKFLOW

### Branch Naming
```
feature/claude-{feature-name}

Examples:
✅ feature/claude-email-system
✅ feature/claude-invoice-pdf
✅ feature/claude-db-optimization
✅ feature/claude-user-accounts
```

### Commit Message Format
```
{type}({scope}): {description}

[optional body]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

Types: feat, fix, refactor, perf, test, docs, chore

Examples:
feat(api): Add email notification system
fix(auth): Resolve session timeout issue
perf(db): Optimize product query performance
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Refactoring
- [ ] Documentation

## Backend Changes
- List API endpoints added/modified
- Database changes
- New dependencies

## Testing Done
- [ ] Build succeeds
- [ ] Type checks pass
- [ ] ESLint passes
- [ ] Manual testing completed

## Integration Notes
- Notes for Cursor/Copilot about how to integrate
- API endpoint documentation
- Type definitions added

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No sensitive data exposed
```

---

## 🔍 CODE REVIEW CHECKLIST

Before merging any branch, verify:

### Security
- [ ] No exposed API keys or secrets
- [ ] Input validation on all endpoints
- [ ] Authentication required on protected routes
- [ ] CSRF protection active
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (no raw HTML rendering)

### Performance
- [ ] Database queries optimized
- [ ] No N+1 query issues
- [ ] Proper indexes in use
- [ ] Response caching where appropriate
- [ ] Efficient algorithms used

### Code Quality
- [ ] TypeScript strict mode compliant
- [ ] No `any` types (use proper types)
- [ ] Error handling comprehensive
- [ ] Logging implemented for debugging
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are focused and small

### Testing
- [ ] Build succeeds
- [ ] Type checks pass
- [ ] ESLint validation passes
- [ ] Manual testing completed
- [ ] Edge cases considered

---

## 📊 PROGRESS TRACKING

### Daily Checklist
- [ ] Review tasks for the day
- [ ] Create/switch to feature branch
- [ ] Implement assigned tasks
- [ ] Test locally
- [ ] Commit with proper message
- [ ] Push to remote
- [ ] Create PR (if ready)
- [ ] Update progress in standup

### Weekly Goals
- **Week 1:** Email + Invoice + Performance
- **Week 2:** User Accounts + Advanced Search
- **Week 3:** Payment Integration + Analytics
- **Week 4:** Testing + Deployment + Monitoring

---

## 🆘 ESCALATION

### When to Ask for Help
1. **Blocking Issues** - Can't proceed without resolution
2. **Architecture Decisions** - Unsure about implementation approach
3. **Conflicts** - Git merge conflicts that are unclear
4. **Performance Issues** - Unexpected slowness
5. **Security Concerns** - Potential vulnerability discovered

### How to Escalate
1. Document the issue clearly
2. Include error messages/logs
3. Describe what you've tried
4. Suggest potential solutions
5. Ask specific questions

---

## 📚 REFERENCE DOCUMENTATION

### Supabase
- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Full-Text Search](https://supabase.com/docs/guides/database/full-text-search)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

### Next.js
- [App Router Docs](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Email & PDF
- [Resend Docs](https://resend.com/docs)
- [jsPDF Documentation](https://artskydj.github.io/jsPDF/docs/)

---

**Last Updated:** 2026-01-20
**Assigned To:** SAYA (Claude Code)
**Status:** 🟢 Active
**Next Review:** Daily Standup

---

**🤖 This task list was generated specifically for Claude Code (SAYA) - Backend & Architecture Lead**
