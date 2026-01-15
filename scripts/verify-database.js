/**
 * Database Verification Script
 * Checks if all required tables, columns, and functions exist
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl, supabaseKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');

  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseKey = line.split('=')[1].trim(); // Prefer service role key
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file');
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Sahara Mart Database...\n');

  // Test 1: Check if orders table exists
  console.log('1️⃣ Checking orders table...');
  const { data: ordersTest, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .limit(1);

  if (ordersError) {
    console.error('❌ Orders table error:', ordersError.message);
    console.log('   👉 Please run the SQL schema file: database/sales_schema.sql\n');
  } else {
    console.log('✅ Orders table exists\n');
  }

  // Test 2: Check if order_items table exists
  console.log('2️⃣ Checking order_items table...');
  const { data: itemsTest, error: itemsError } = await supabase
    .from('order_items')
    .select('id')
    .limit(1);

  if (itemsError) {
    console.error('❌ Order items table error:', itemsError.message);
    console.log('   👉 Please run the SQL schema file: database/sales_schema.sql\n');
  } else {
    console.log('✅ Order items table exists\n');
  }

  // Test 3: Check if generate_order_number function exists
  console.log('3️⃣ Checking generate_order_number function...');
  const { data: functionTest, error: functionError } = await supabase
    .rpc('generate_order_number');

  if (functionError) {
    console.error('❌ Function error:', functionError.message);
    console.log('   👉 Please run the SQL schema file: database/sales_schema.sql\n');
    console.log('   ℹ️  API will use fallback order number generation\n');
  } else {
    console.log('✅ generate_order_number function exists');
    console.log(`   Generated test order number: ${functionTest}\n`);
  }

  // Test 4: Check if is_deleted column exists in orders
  console.log('4️⃣ Checking orders.is_deleted column...');
  const { data: columnTest, error: columnError } = await supabase
    .from('orders')
    .select('is_deleted')
    .limit(1);

  if (columnError && columnError.code === '42703') {
    console.error('❌ Column is_deleted does not exist!');
    console.log('   👉 Run this SQL in Supabase SQL Editor:');
    console.log('   ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;\n');
  } else if (columnError) {
    console.error('❌ Error checking column:', columnError.message);
  } else {
    console.log('✅ is_deleted column exists\n');
  }

  // Test 5: Try creating a test order
  console.log('5️⃣ Testing order creation...');

  let orderError = null;

  // First, get a product to test with
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, original_price')
    .limit(1);

  if (productsError || !products || products.length === 0) {
    console.error('❌ Cannot test order creation - no products found');
    console.log('   👉 Please add products first using /admin/products\n');
    orderError = productsError || new Error('No products found');
  } else {
    const testProduct = products[0];
    console.log(`   Using test product: ${testProduct.name}`);

    // Generate order number (using fallback method)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    const testOrderNumber = `TEST-${dateStr}-${String(randomNum).padStart(3, '0')}`;

    const testOrder = {
      order_number: testOrderNumber,
      customer_name: 'Test Customer',
      customer_phone: '081234567890',
      customer_address: 'Test Address',
      total_items: 1,
      subtotal: testProduct.price,
      shipping_cost: 0,
      total_amount: testProduct.price,
      total_cost: testProduct.original_price || 0,
      total_profit: testProduct.price - (testProduct.original_price || 0),
      profit_margin: 0,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: 'whatsapp',
    };

    const { data: orderData, error: testOrderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();

    orderError = testOrderError;

    if (orderError) {
      console.error('❌ Order creation failed:', orderError.message);
      console.log('   Code:', orderError.code);
      console.log('   Details:', orderError.details);
      console.log('   👉 Check database schema and permissions\n');
    } else {
      console.log('✅ Test order created successfully!');
      console.log(`   Order Number: ${orderData.order_number}`);
      console.log(`   Order ID: ${orderData.id}\n`);

      // Clean up test order
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderData.id);

      if (deleteError) {
        console.log('⚠️  Could not delete test order - please remove manually\n');
      } else {
        console.log('✅ Test order cleaned up\n');
      }
    }
  }

  // Test 6: Check products table
  console.log('6️⃣ Checking products table...');
  const { count: productCount, error: productCountError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (productCountError) {
    console.error('❌ Products table error:', productCountError.message);
  } else {
    console.log(`✅ Products table exists with ${productCount || 0} products\n`);
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 VERIFICATION SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!ordersError && !itemsError && !functionError && !columnError && !orderError) {
    console.log('✅ All checks passed! Database is ready.\n');
    console.log('Next steps:');
    console.log('1. Start dev server: npm run dev');
    console.log('2. Test checkout flow');
    console.log('3. Check admin panel\n');
  } else {
    console.log('⚠️  Some checks failed. Please fix the issues above.\n');
    console.log('Quick fixes:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Open: database/sales_schema.sql');
    console.log('3. Copy and run the entire SQL script');
    console.log('4. Run this verification script again\n');
  }
}

// Run verification
verifyDatabase()
  .then(() => {
    console.log('✅ Verification complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
