import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/analytics/top-products - Top Selling Products
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get('limit') || '10');
    const period = searchParams.get('period'); // today, week, month, all

    let query = supabase
      .from('top_selling_products')
      .select('*')
      .order('total_quantity_sold', { ascending: false })
      .limit(limit);

    // Filter by period if specified
    if (period === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('last_sold_at', today);
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('last_sold_at', weekAgo.toISOString());
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('last_sold_at', monthAgo.toISOString());
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching top products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch top products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error('Error in GET /api/analytics/top-products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
