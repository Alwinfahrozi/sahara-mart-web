import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();
    const { products } = body;

    // Validation
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: products must be a non-empty array' },
        { status: 400 }
      );
    }

    const errors: any[] = [];
    const successful: any[] = [];

    // Process each product
    for (const [index, product] of products.entries()) {
      try {
        // Validate required fields
        if (!product.name || !product.category_id || product.price === undefined || product.stock === undefined) {
          errors.push({
            row: index + 1,
            product: product.name || 'Unknown',
            error: 'Missing required fields: name, category_id, price, stock'
          });
          continue;
        }

        // Validate data types
        if (typeof product.price !== 'number' || product.price < 0) {
          errors.push({
            row: index + 1,
            product: product.name,
            error: 'Price must be a positive number'
          });
          continue;
        }

        if (typeof product.stock !== 'number' || product.stock < 0) {
          errors.push({
            row: index + 1,
            product: product.name,
            error: 'Stock must be a non-negative number'
          });
          continue;
        }

        // Generate slug from product name
        const slug = product.slug || generateUniqueSlug(product.name);

        // Insert product
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: product.name,
            slug: slug,
            category_id: product.category_id,
            price: product.price,
            original_price: product.original_price || null,
            stock: product.stock,
            weight: product.weight || '',
            sku: product.sku || null,
            description: product.description || '',
            image_url: product.image_url || null,
            is_active: product.is_active ?? true,
            is_featured: product.is_featured ?? false,
          })
          .select()
          .single();

        if (error) {
          errors.push({
            row: index + 1,
            product: product.name,
            error: error.message
          });
        } else {
          successful.push(data);
        }

      } catch (err: any) {
        errors.push({
          row: index + 1,
          product: product.name || 'Unknown',
          error: err.message
        });
      }
    }

    return NextResponse.json({
      message: `Bulk upload complete: ${successful.length} succeeded, ${errors.length} failed`,
      summary: {
        total: products.length,
        successful: successful.length,
        failed: errors.length,
      },
      successful,
      errors,
    });

  } catch (error: any) {
    console.error('Error in bulk upload:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
