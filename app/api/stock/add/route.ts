import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/stock/add
 * Add stock to a product and create log entry
 *
 * Body:
 * {
 *   productId: string (UUID)
 *   quantityToAdd: number (positive integer)
 *   reason: string
 *   notes?: string (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantityToAdd, reason, notes } = body;

    // Validation
    if (!productId || !quantityToAdd || !reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'productId, quantityToAdd, and reason are required',
        },
        { status: 400 }
      );
    }

    if (typeof quantityToAdd !== 'number' || quantityToAdd <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid quantity',
          message: 'quantityToAdd must be a positive number',
        },
        { status: 400 }
      );
    }

    // Get user from auth header (for performed_by field)
    const authHeader = request.headers.get('authorization');
    let performedBy: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      performedBy = user?.id || null;
    }

    // Step 1: Get current product stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, sku, stock')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: productError?.message || 'Product does not exist',
        },
        { status: 404 }
      );
    }

    const quantityBefore = product.stock;
    const quantityAfter = quantityBefore + quantityToAdd;

    // Step 2: Update product stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: quantityAfter })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product stock:', updateError);
      throw updateError;
    }

    // Step 3: Create stock log entry
    const { data: stockLog, error: logError } = await supabase
      .from('stock_logs')
      .insert({
        product_id: productId,
        type: 'addition',
        quantity_before: quantityBefore,
        quantity_change: quantityToAdd,
        quantity_after: quantityAfter,
        reason,
        notes,
        performed_by: performedBy,
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating stock log:', logError);
      // Don't fail the request if log creation fails, but warn
      console.warn('Stock updated but log creation failed');
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${quantityToAdd} units to ${product.name}`,
      data: {
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          quantityBefore,
          quantityAdded: quantityToAdd,
          quantityAfter,
        },
        log: stockLog,
      },
    });
  } catch (error: any) {
    console.error('Add stock error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add stock',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
