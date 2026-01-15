import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured') === 'true';
  
  // Build query
  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug, icon)', { count: 'exact' })
    .eq('is_active', true);
  
  // Apply filters
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }
  
  if (search) {
    // Search in name, SKU, and description
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  if (featured) {
    query = query.eq('is_featured', true);
  }
  
  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// POST: Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();

    // Validation - check required fields
    if (!body.name || !body.category_id || body.price === undefined || body.stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category_id, price, stock' },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof body.stock !== 'number' || body.stock < 0) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative number' },
        { status: 400 }
      );
    }

    // Generate slug from product name
    const slug = body.slug || generateUniqueSlug(body.name);

    // Insert product
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        slug: slug,
        category_id: body.category_id,
        price: body.price,
        original_price: body.original_price || null,
        stock: body.stock,
        weight: body.weight || '',
        sku: body.sku || null,
        description: body.description || '',
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
      })
      .select('*, categories(id, name, slug, icon)')
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data,
        message: 'Produk berhasil ditambahkan'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}