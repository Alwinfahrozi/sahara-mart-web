-- ============================================================
-- FIX STORAGE POLICIES - Run di Supabase SQL Editor
-- ============================================================
-- Error: "new row violates row-level security policy"
-- Fix: Update WITH CHECK expression untuk INSERT policy
-- ============================================================

-- STEP 1: Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Admin Access 16wjy3a_0" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access 16wjy3a_1" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access 16wjy3a_2" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access 16wjy3a_3" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access 16wjy3a_0" ON storage.objects;

-- Drop any other existing policies for product-images bucket
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- ============================================================
-- STEP 2: Create correct policies
-- ============================================================

-- Policy 1: Public can READ images (anon users)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy 2: Authenticated users can INSERT (upload)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Policy 3: Authenticated users can UPDATE
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Policy 4: Authenticated users can DELETE
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- ============================================================
-- STEP 3: Verify policies created
-- ============================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname LIKE '%product-images%'
    OR policyname LIKE '%Public Read%'
    OR policyname LIKE '%Authenticated%'
  )
ORDER BY policyname;

-- ============================================================
-- Expected output:
-- ============================================================
-- 4 policies:
-- 1. Public Read Access (SELECT, public)
-- 2. Authenticated Upload (INSERT, authenticated)
-- 3. Authenticated Update (UPDATE, authenticated)
-- 4. Authenticated Delete (DELETE, authenticated)
-- ============================================================

-- ============================================================
-- TESTING (Optional - run after policies created)
-- ============================================================

-- Test: Check if policies work
-- This will show which operations are allowed:
SELECT
  'Policies created successfully!' as status,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname IN (
    'Public Read Access',
    'Authenticated Upload',
    'Authenticated Update',
    'Authenticated Delete'
  );

-- ============================================================
-- DONE!
-- ============================================================
-- After running this:
-- 1. Go to admin panel
-- 2. Try upload image again
-- 3. Should work now! ✅
-- ============================================================
