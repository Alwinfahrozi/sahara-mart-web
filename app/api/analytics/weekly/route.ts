import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/analytics/weekly - This Week's Sales Summary
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Call PostgreSQL function for this week
    const { data: thisWeekData, error: thisWeekError } = await supabase.rpc(
      'get_this_week_sales'
    );

    if (thisWeekError) {
      console.error('Error fetching this week sales:', thisWeekError);
      return NextResponse.json(
        { error: 'Failed to fetch this week sales' },
        { status: 500 }
      );
    }

    const thisWeekStats = thisWeekData && thisWeekData.length > 0 ? thisWeekData[0] : {
      total_orders: 0,
      total_items: 0,
      total_revenue: 0,
      total_profit: 0,
      avg_profit_margin: 0,
    };

    // Get last 4 weeks trend from view
    const { data: trendData, error: trendError } = await supabase
      .from('weekly_sales')
      .select('*')
      .order('week_start', { ascending: false })
      .limit(4);

    if (trendError) {
      console.error('Error fetching weekly trend:', trendError);
      return NextResponse.json(
        { error: 'Failed to fetch weekly trend' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      stats: thisWeekStats,
      trend: trendData || [],
    });
  } catch (error) {
    console.error('Error in GET /api/analytics/weekly:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
