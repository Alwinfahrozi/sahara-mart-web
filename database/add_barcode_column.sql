-- ================================================
-- ADD BARCODE COLUMN TO PRODUCTS TABLE
-- ================================================

-- Step 1: Add barcode column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS barcode VARCHAR(255);

-- Step 2: Create index for faster barcode search
CREATE INDEX IF NOT EXISTS idx_products_barcode
ON public.products(barcode);

-- Step 3: Add unique constraint (optional - uncomment if barcodes must be unique)
-- ALTER TABLE public.products
-- ADD CONSTRAINT unique_barcode UNIQUE (barcode);

-- Step 4: Add comment
COMMENT ON COLUMN public.products.barcode IS 'Product barcode for scanning (EAN-13, UPC, Code128, etc)';

-- ================================================
-- VERIFY CHANGES
-- ================================================

-- Check column was added
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name = 'barcode';

-- Check index was created
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products'
  AND indexname = 'idx_products_barcode';

-- Sample: View products with their barcodes
SELECT
  id,
  name,
  sku,
  barcode,
  stock,
  price
FROM public.products
LIMIT 5;

-- ================================================
-- OPTIONAL: Migrate existing SKU to barcode
-- (Uncomment if you want to copy SKU values to barcode)
-- ================================================

-- Update products with barcode from SKU (if barcode is null)
-- UPDATE public.products
-- SET barcode = sku
-- WHERE barcode IS NULL AND sku IS NOT NULL;

-- ================================================
-- DONE!
-- ================================================

SELECT
  'Barcode column added successfully!' as status,
  COUNT(*) as total_products,
  COUNT(barcode) as products_with_barcode
FROM public.products;
