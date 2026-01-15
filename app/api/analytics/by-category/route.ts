import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/analytics/by-category - Sales by Category
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    const { data: categoryStats, error } = await supabase
      .from('sales_by_category')
      .select('*')
      .order('total_revenue', { ascending: false });

    if (error) {
      console.error('Error fetching sales by category:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sales by category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: categoryStats || [] });
  } catch (error) {
    console.error('Error in GET /api/analytics/by-category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
