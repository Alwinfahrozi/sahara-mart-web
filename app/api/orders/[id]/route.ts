import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/orders/[id] - Get Order Detail
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH /api/orders/[id] - Update Order Status
// ============================================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;
    const body = await request.json();

    const {
      status,
      payment_status,
      admin_notes,
      shipping_cost,
    } = body;

    // Get current order status before update
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status, subtotal, order_items(*)')
      .eq('id', id)
      .single();

    // Build update object
    const updates: any = {};

    if (status) {
      updates.status = status;

      // Auto-set completed_at when status = 'delivered'
      if (status === 'delivered') {
        updates.completed_at = new Date().toISOString();
      }

      // ===== RESTORE STOCK: If status changed to 'cancelled', restore product stock =====
      if (status === 'cancelled' && currentOrder && currentOrder.status !== 'cancelled') {
        console.log('🔄 Order cancelled, restoring product stock...');

        if (currentOrder.order_items && currentOrder.order_items.length > 0) {
          for (const item of currentOrder.order_items) {
            // Get current product stock
            const { data: product } = await supabase
              .from('products')
              .select('stock')
              .eq('id', item.product_id)
              .single();

            if (product) {
              const restoredStock = product.stock + item.quantity;

              // Restore stock
              const { error: stockError } = await supabase
                .from('products')
                .update({ stock: restoredStock })
                .eq('id', item.product_id);

              if (stockError) {
                console.error('⚠️ Error restoring stock for product:', item.product_id, stockError);
              } else {
                console.log(`✅ Stock restored for product ${item.product_name}: ${product.stock} → ${restoredStock}`);
              }
            }
          }
        }
      }
    }

    if (payment_status) {
      updates.payment_status = payment_status;
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    if (shipping_cost !== undefined) {
      updates.shipping_cost = shipping_cost;
      // Recalculate total_amount
      if (currentOrder) {
        updates.total_amount = currentOrder.subtotal + shipping_cost;
      }
    }

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error in PATCH /api/orders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/orders/[id] - Soft Delete Order
// ============================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    // Get order details before deletion to restore stock
    const { data: order } = await supabase
      .from('orders')
      .select('status, order_items(*)')
      .eq('id', id)
      .single();

    // ===== RESTORE STOCK: If order is not cancelled, restore product stock =====
    if (order && order.status !== 'cancelled') {
      console.log('🔄 Order deleted, restoring product stock...');

      if (order.order_items && order.order_items.length > 0) {
        for (const item of order.order_items) {
          // Get current product stock
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (product) {
            const restoredStock = product.stock + item.quantity;

            // Restore stock
            const { error: stockError } = await supabase
              .from('products')
              .update({ stock: restoredStock })
              .eq('id', item.product_id);

            if (stockError) {
              console.error('⚠️ Error restoring stock for product:', item.product_id, stockError);
            } else {
              console.log(`✅ Stock restored for product ${item.product_name}: ${product.stock} → ${restoredStock}`);
            }
          }
        }
      }
    }

    // Soft delete order
    const { error } = await supabase
      .from('orders')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json(
        { error: 'Failed to delete order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/orders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
