-- ============================================================
-- FIX order_items table
-- Problem: Table has 'subtotal' column (NOT NULL)
--          but API uses 'line_subtotal'
-- ============================================================

-- Option 1: Rename 'subtotal' to 'line_subtotal' (recommended)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'order_items' AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE order_items RENAME COLUMN subtotal TO line_subtotal;
        RAISE NOTICE '✅ Renamed: subtotal → line_subtotal';
    END IF;
END $$;

-- Make sure line_subtotal allows NULL or has default
ALTER TABLE order_items ALTER COLUMN line_subtotal DROP NOT NULL;
ALTER TABLE order_items ALTER COLUMN line_subtotal SET DEFAULT 0;

-- Add any other missing columns
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS order_id UUID;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id UUID;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_sku TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image_url TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_cost DECIMAL(10,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS line_cost DECIMAL(12,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS line_profit DECIMAL(12,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS line_profit_margin DECIMAL(5,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Show final schema
SELECT
    column_name,
    data_type,
    CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- ============================================================
-- DONE! Next:
-- 1. Settings → API → Reload schema
-- 2. Test order creation again
-- ============================================================
