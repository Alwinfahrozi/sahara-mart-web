import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/stock/notifications
 * Get all low stock products (stock <= 5) and out of stock products
 */
export async function GET(request: NextRequest) {
  try {
    // Get low stock products (stock <= 5 and > 0)
    const { data: lowStockProducts, error: lowStockError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        stock,
        price,
        image_url,
        categories (
          id,
          name,
          icon
        )
      `)
      .lte('stock', 5)
      .gt('stock', 0)
      .order('stock', { ascending: true });

    if (lowStockError) {
      console.error('Error fetching low stock products:', lowStockError);
      throw lowStockError;
    }

    // Get out of stock products (stock = 0)
    const { data: outOfStockProducts, error: outOfStockError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        stock,
        price,
        image_url,
        categories (
          id,
          name,
          icon
        )
      `)
      .eq('stock', 0)
      .order('name', { ascending: true });

    if (outOfStockError) {
      console.error('Error fetching out of stock products:', outOfStockError);
      throw outOfStockError;
    }

    // Calculate totals
    const totalLowStock = lowStockProducts?.length || 0;
    const totalOutOfStock = outOfStockProducts?.length || 0;
    const totalCritical = totalLowStock + totalOutOfStock;

    return NextResponse.json({
      success: true,
      data: {
        lowStockProducts: lowStockProducts || [],
        outOfStockProducts: outOfStockProducts || [],
        summary: {
          totalLowStock,
          totalOutOfStock,
          totalCritical,
        },
      },
    });
  } catch (error: any) {
    console.error('Stock notifications error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stock notifications',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
