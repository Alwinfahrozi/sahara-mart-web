import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/stock/logs
 * Get stock movement logs with optional filters
 *
 * Query params:
 * - productId?: string (filter by product)
 * - type?: string (filter by type: addition, reduction, adjustment, order, return)
 * - limit?: number (default 50, max 200)
 * - offset?: number (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('stock_logs')
      .select(`
        id,
        type,
        quantity_before,
        quantity_change,
        quantity_after,
        reason,
        notes,
        created_at,
        products (
          id,
          name,
          sku,
          image_url,
          stock,
          categories (
            name,
            icon
          )
        ),
        orders (
          id,
          order_number
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Error fetching stock logs:', error);
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('stock_logs')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: logs || [],
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (totalCount || 0),
      },
    });
  } catch (error: any) {
    console.error('Stock logs error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stock logs',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
