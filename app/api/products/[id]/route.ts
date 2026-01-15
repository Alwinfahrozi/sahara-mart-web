import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }  // ✅ CHANGED: params is now Promise
) {
  try {
    const supabase = await createServerClient();

    // ✅ AWAIT params first!
    const { id } = await context.params;

    // Validate ID is a number
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Fetch product with category info (JOIN)
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    // Handle not found
    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Increment views count (optional - for analytics)
    await supabase
      .from('products')
      .update({ views_count: (product.views_count || 0) + 1 })
      .eq('id', productId);

    return NextResponse.json({ 
      data: product,
      success: true 
    });

  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
// 2. PUT: Untuk Update/Edit Produk
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;
    const productId = parseInt(id);
    const body = await request.json();

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Update data ke Supabase
    const { data, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        category_id: body.category_id,
        price: body.price,
        original_price: body.original_price,
        stock: body.stock,
        weight: body.weight,
        sku: body.sku,
        description: body.description,
        is_active: body.is_active, // Bisa untuk mengaktifkan kembali
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Produk berhasil diperbarui', 
      data 
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// 3. DELETE: Untuk Soft Delete (Menonaktifkan Produk)
// Kita tidak menghapus permanen agar riwayat order aman
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Set is_active = false (Soft Delete)
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Produk berhasil dinonaktifkan (Soft Delete)' 
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}