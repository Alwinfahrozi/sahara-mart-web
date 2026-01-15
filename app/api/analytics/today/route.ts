import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/analytics/today - Today's Sales Summary
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Call PostgreSQL function
    const { data, error } = await supabase.rpc('get_today_sales');

    if (error) {
      console.error('Error fetching today sales:', error);
      return NextResponse.json(
        { error: 'Failed to fetch today sales' },
        { status: 500 }
      );
    }

    // RPC returns array with single row
    const stats = data && data.length > 0 ? data[0] : {
      total_orders: 0,
      total_items: 0,
      total_revenue: 0,
      total_profit: 0,
      avg_profit_margin: 0,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/analytics/today:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
