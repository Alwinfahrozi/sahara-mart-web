import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get total product count
    const { count: totalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get products from the last 48 hours
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { count: recentCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoDaysAgo.toISOString());

    // Get sample of recent products
    const { data: recentProducts } = await supabase
      .from('products')
      .select('id, name, sku, price, category_id, created_at')
      .gte('created_at', twoDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Check for products with missing data
    const { count: incompleteCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or('name.is.null,price.is.null,category_id.is.null');

    // Get category distribution for recent uploads
    const { data: categoryDist } = await supabase
      .from('products')
      .select('category_id, categories(name)')
      .gte('created_at', twoDaysAgo.toISOString())
      .not('category_id', 'is', null);

    const categoryMap = new Map();
    if (categoryDist) {
      categoryDist.forEach((p: any) => {
        const catName = p.categories?.name || 'Unknown';
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
      });
    }

    const categoryStats = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        totalProducts: totalCount || 0,
        recentUploads: recentCount || 0,
        incompleteProducts: incompleteCount || 0,
        expectedCount: 6000,
        status:
          (totalCount || 0) >= 6000
            ? 'SUCCESS'
            : (totalCount || 0) > 0
            ? 'PARTIAL'
            : 'NO_DATA',
      },
      recentProducts: recentProducts || [],
      categoryStats,
    });
  } catch (error: any) {
    console.error('Error checking upload status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
