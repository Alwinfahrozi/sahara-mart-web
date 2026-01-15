import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/analytics/monthly - This Month's Sales Summary
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Call PostgreSQL function for this month
    const { data: thisMonthData, error: thisMonthError } = await supabase.rpc(
      'get_this_month_sales'
    );

    if (thisMonthError) {
      console.error('Error fetching this month sales:', thisMonthError);
      return NextResponse.json(
        { error: 'Failed to fetch this month sales' },
        { status: 500 }
      );
    }

    const thisMonthStats = thisMonthData && thisMonthData.length > 0 ? thisMonthData[0] : {
      total_orders: 0,
      total_items: 0,
      total_revenue: 0,
      total_profit: 0,
      avg_profit_margin: 0,
    };

    // Get last 12 months trend from view
    const { data: trendData, error: trendError } = await supabase
      .from('monthly_sales')
      .select('*')
      .order('month_start', { ascending: false })
      .limit(12);

    if (trendError) {
      console.error('Error fetching monthly trend:', trendError);
      return NextResponse.json(
        { error: 'Failed to fetch monthly trend' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      stats: thisMonthStats,
      trend: trendData || [],
    });
  } catch (error) {
    console.error('Error in GET /api/analytics/monthly:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
