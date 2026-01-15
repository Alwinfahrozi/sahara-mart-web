-- ================================================
-- STOCK LOGS TABLE
-- Untuk mencatat semua perubahan stok produk
-- ================================================

-- Drop table if exists (untuk development)
-- DROP TABLE IF EXISTS public.stock_logs CASCADE;

-- Create stock_logs table
CREATE TABLE IF NOT EXISTS public.stock_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('addition', 'reduction', 'adjustment', 'order', 'return')),
  quantity_before INTEGER NOT NULL,
  quantity_change INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reason TEXT,
  notes TEXT,
  performed_by UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stock_logs_product_id ON public.stock_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_created_at ON public.stock_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_logs_type ON public.stock_logs(type);

-- Add RLS (Row Level Security)
ALTER TABLE public.stock_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin dapat melihat semua logs
CREATE POLICY "Admin can view all stock logs"
  ON public.stock_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admin dapat insert stock logs
CREATE POLICY "Admin can insert stock logs"
  ON public.stock_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE public.stock_logs IS 'Log history untuk semua perubahan stok produk';
COMMENT ON COLUMN public.stock_logs.type IS 'Tipe perubahan: addition (tambah), reduction (kurang), adjustment (penyesuaian), order (dari pesanan), return (retur)';
COMMENT ON COLUMN public.stock_logs.quantity_before IS 'Jumlah stok sebelum perubahan';
COMMENT ON COLUMN public.stock_logs.quantity_change IS 'Perubahan stok (positif = tambah, negatif = kurang)';
COMMENT ON COLUMN public.stock_logs.quantity_after IS 'Jumlah stok setelah perubahan';
COMMENT ON COLUMN public.stock_logs.reason IS 'Alasan perubahan stok';
COMMENT ON COLUMN public.stock_logs.notes IS 'Catatan tambahan';
COMMENT ON COLUMN public.stock_logs.performed_by IS 'Admin yang melakukan perubahan';

-- ================================================
-- SAMPLE DATA (Optional - untuk testing)
-- ================================================

-- Insert sample log (uncomment jika mau test)
/*
INSERT INTO public.stock_logs (product_id, type, quantity_before, quantity_change, quantity_after, reason)
SELECT
  id,
  'addition',
  stock,
  10,
  stock + 10,
  'Restock bulanan'
FROM public.products
LIMIT 1;
*/

-- ================================================
-- VIEWS FOR REPORTING
-- ================================================

-- View: Products with low stock (≤ 5)
CREATE OR REPLACE VIEW public.low_stock_products AS
SELECT
  p.id,
  p.name,
  p.sku,
  p.stock,
  p.price,
  c.name as category_name,
  p.image_url,
  p.created_at,
  p.updated_at
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.stock <= 5 AND p.stock > 0
ORDER BY p.stock ASC, p.name ASC;

-- View: Out of stock products
CREATE OR REPLACE VIEW public.out_of_stock_products AS
SELECT
  p.id,
  p.name,
  p.sku,
  p.stock,
  p.price,
  c.name as category_name,
  p.image_url,
  p.created_at,
  p.updated_at
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.stock = 0
ORDER BY p.name ASC;

-- View: Stock movement summary (last 30 days)
CREATE OR REPLACE VIEW public.stock_movement_summary AS
SELECT
  p.id as product_id,
  p.name as product_name,
  p.sku,
  p.stock as current_stock,
  COUNT(sl.id) as total_movements,
  SUM(CASE WHEN sl.quantity_change > 0 THEN sl.quantity_change ELSE 0 END) as total_added,
  SUM(CASE WHEN sl.quantity_change < 0 THEN ABS(sl.quantity_change) ELSE 0 END) as total_reduced,
  MAX(sl.created_at) as last_movement_date
FROM public.products p
LEFT JOIN public.stock_logs sl ON p.id = sl.product_id
  AND sl.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, p.name, p.sku, p.stock
ORDER BY total_movements DESC;

-- Grant access to views
GRANT SELECT ON public.low_stock_products TO authenticated;
GRANT SELECT ON public.out_of_stock_products TO authenticated;
GRANT SELECT ON public.stock_movement_summary TO authenticated;

-- ================================================
-- DONE!
-- ================================================

-- Verify table was created
SELECT
  'stock_logs table created successfully!' as status,
  COUNT(*) as total_logs
FROM public.stock_logs;
