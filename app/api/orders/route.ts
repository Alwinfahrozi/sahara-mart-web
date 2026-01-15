import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIdentifier, RATE_LIMITS, createRateLimitHeaders } from '@/lib/rateLimiter';
import { requireCsrfToken } from '@/lib/csrf';

// ============================================================
// POST /api/orders - Create New Order
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // ===== CSRF PROTECTION: Prevent CSRF attacks =====
    const csrfError = await requireCsrfToken(request);
    if (csrfError) {
      return csrfError;
    }

    // ===== RATE LIMITING: Prevent API abuse =====
    const identifier = getClientIdentifier(request);
    const rateLimitResult = rateLimit(identifier, RATE_LIMITS.orders);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const supabase = await createServerClient();
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      customer_address,
      customer_notes,
      cart, // [ { product_id, quantity } ]
      shipping_cost = 0,
      payment_method = 'whatsapp',
      whatsapp_message,
      honeypot, // Anti-bot honeypot field
    } = body;

    // ===== ANTI-BOT: Honeypot Check =====
    // If honeypot field is filled, it's likely a bot
    if (honeypot) {
      console.warn('🤖 Honeypot triggered - possible bot submission');
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // ===== VALIDATION: Required Fields =====
    if (!customer_name || !customer_phone || !cart || cart.length === 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'customer_name, customer_phone, and cart are required',
        },
        { status: 400 }
      );
    }

    // ===== VALIDATION: Cart Size =====
    if (cart.length > 50) {
      return NextResponse.json(
        { error: 'Cart terlalu banyak item. Maksimal 50 produk per order.' },
        { status: 400 }
      );
    }

    // ===== ANTI-SPAM: Check for duplicate orders (same items in last 5 minutes) =====
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Get recent orders from same phone number
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('id, created_at, order_items(product_id, quantity)')
      .eq('customer_phone', customer_phone)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(3);

    if (!recentOrdersError && recentOrders && recentOrders.length > 0) {
      // Check if cart items are exactly the same
      const cartSignature = JSON.stringify(
        cart.map((item: any) => ({ id: item.product_id, qty: item.quantity })).sort()
      );

      for (const recentOrder of recentOrders) {
        const recentSignature = JSON.stringify(
          (recentOrder.order_items || [])
            .map((item: any) => ({ id: item.product_id, qty: item.quantity }))
            .sort()
        );

        if (cartSignature === recentSignature) {
          console.warn('⚠️ Duplicate order detected:', { phone: customer_phone, recentOrderId: recentOrder.id });
          return NextResponse.json(
            {
              error: 'Duplicate order detected',
              message: 'Order yang sama sudah dibuat dalam 5 menit terakhir. Mohon tunggu beberapa saat.',
            },
            { status: 429 }
          );
        }
      }

      // Check rate limiting: max 3 orders per 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count: recentCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('customer_phone', customer_phone)
        .gte('created_at', tenMinutesAgo);

      if ((recentCount || 0) >= 3) {
        console.warn('⚠️ Rate limit exceeded:', { phone: customer_phone, count: recentCount });
        return NextResponse.json(
          {
            error: 'Too many orders',
            message: 'Maksimal 3 pesanan dalam 10 menit. Mohon tunggu sebentar.',
          },
          { status: 429 }
        );
      }
    }

    // Generate order number
    let orderNumber: string;
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.warn('⚠️ Database function failed, generating order number manually:', orderNumberError);

      // Fallback: Generate order number manually
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD

      // Count today's orders manually
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const { count, error: countError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfDay);

      if (countError) {
        console.error('Error counting orders:', countError);
        // Use random number as last resort
        const randomNum = Math.floor(Math.random() * 1000);
        orderNumber = `ORD-${dateStr}-${String(randomNum).padStart(3, '0')}`;
      } else {
        const orderCount = (count || 0) + 1;
        orderNumber = `ORD-${dateStr}-${String(orderCount).padStart(3, '0')}`;
      }

      console.log('✅ Generated order number manually:', orderNumber);
    } else {
      orderNumber = orderNumberData as string;
      console.log('✅ Generated order number from DB function:', orderNumber);
    }

    // Fetch product details for all cart items
    const productIds = cart.map((item: any) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError || !products) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch product details' },
        { status: 500 }
      );
    }

    // Create product lookup map
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate order totals
    let subtotal = 0;
    let totalCost = 0;
    const orderItems = [];

    for (const cartItem of cart) {
      const product = productMap.get(cartItem.product_id);

      // ===== VALIDATION: Product Exists =====
      if (!product) {
        return NextResponse.json(
          { error: `Produk tidak ditemukan: ${cartItem.product_id}` },
          { status: 404 }
        );
      }

      // ===== VALIDATION: Quantity =====
      if (cartItem.quantity <= 0) {
        return NextResponse.json(
          { error: `Quantity harus lebih dari 0 untuk produk: ${product.name}` },
          { status: 400 }
        );
      }

      if (cartItem.quantity > 100) {
        return NextResponse.json(
          { error: `Quantity terlalu banyak. Maksimal 100 per produk.` },
          { status: 400 }
        );
      }

      // ===== VALIDATION: Stock Availability =====
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          {
            error: `Stok tidak cukup untuk produk: ${product.name}`,
            message: `Stok tersedia: ${product.stock}, diminta: ${cartItem.quantity}`,
          },
          { status: 400 }
        );
      }

      const quantity = cartItem.quantity;
      const unitPrice = product.price;
      const unitCost = product.original_price || 0;
      const lineSubtotal = unitPrice * quantity;
      const lineCost = unitCost * quantity;
      const lineProfit = lineSubtotal - lineCost;
      const lineProfitMargin =
        lineSubtotal > 0
          ? Math.round((lineProfit / lineSubtotal) * 100 * 100) / 100
          : 0;

      subtotal += lineSubtotal;
      totalCost += lineCost;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        product_image_url: product.image_url,
        unit_price: unitPrice,
        unit_cost: unitCost,
        quantity: quantity,
        line_subtotal: lineSubtotal,
        line_cost: lineCost,
        line_profit: lineProfit,
        line_profit_margin: lineProfitMargin,
      });
    }

    const totalAmount = subtotal + shipping_cost;
    const totalProfit = totalAmount - totalCost - shipping_cost;
    const profitMargin =
      totalAmount > 0
        ? Math.round((totalProfit / totalAmount) * 100 * 100) / 100
        : 0;

    // ===== VALIDATION: Minimum Order Amount =====
    const MINIMUM_ORDER = 5000; // Rp 5.000
    if (subtotal < MINIMUM_ORDER) {
      return NextResponse.json(
        {
          error: 'Minimum order not met',
          message: `Minimum pemesanan adalah Rp ${MINIMUM_ORDER.toLocaleString('id-ID')}. Total saat ini: Rp ${subtotal.toLocaleString('id-ID')}`,
        },
        { status: 400 }
      );
    }

    // Log order creation for monitoring
    console.log('📝 Creating order:', {
      orderNumber,
      phone: customer_phone,
      items: cart.length,
      subtotal,
      totalAmount,
      clientIP,
    });

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_address,
        customer_notes,
        total_items: cart.reduce((sum: number, item: any) => sum + item.quantity, 0),
        subtotal,
        shipping_cost,
        total_amount: totalAmount,
        total_cost: totalCost,
        total_profit: totalProfit,
        profit_margin: profitMargin,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method,
        whatsapp_message,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError?.message },
        { status: 500 }
      );
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items', details: itemsError.message },
        { status: 500 }
      );
    }

    // ===== UPDATE STOCK: Reduce product stock for each item =====
    console.log('📦 Updating product stock...');
    for (const cartItem of cart) {
      const product = productMap.get(cartItem.product_id);
      if (!product) continue;

      const newStock = product.stock - cartItem.quantity;

      // Update stock in database
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', cartItem.product_id);

      if (stockError) {
        console.error('⚠️ Error updating stock for product:', cartItem.product_id, stockError);
        // Don't rollback order, just log the error
        // Stock can be corrected manually later if needed
      } else {
        console.log(`✅ Stock updated for product ${product.name}: ${product.stock} → ${newStock}`);
      }
    }

    // Fetch complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq('id', order.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete order:', fetchError);
      return NextResponse.json(
        { error: 'Order created but failed to fetch details' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: completeOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/orders - List Orders
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);

    // Query params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // filter by status
    const orderNumber = searchParams.get('order_number'); // search by order number
    const customerPhone = searchParams.get('customer_phone'); // search by phone

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*)
      `,
        { count: 'exact' }
      )
      // NOTE: is_deleted filter commented out until column is added to database
      // Run database/quick-fix-orders.sql to add missing columns
      // .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (orderNumber) {
      query = query.ilike('order_number', `%${orderNumber}%`);
    }

    if (customerPhone) {
      query = query.ilike('customer_phone', `%${customerPhone}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
