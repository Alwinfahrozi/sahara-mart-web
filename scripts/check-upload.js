const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkUploadStatus() {
  try {
    console.log('='.repeat(60));
    console.log('📊 PRODUCT UPLOAD STATUS REPORT');
    console.log('='.repeat(60));
    console.log();

    // Get total product count
    const { count: totalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting products:', countError);
      return;
    }

    console.log('Total Products in Database:', totalCount || 0);
    console.log();

    // Get products from the last 48 hours
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { count: recentCount, error: recentError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoDaysAgo.toISOString());

    console.log('Recent Uploads (Last 48 Hours):', recentCount || 0);
    console.log();

    // Get sample of recent products
    const { data: recentProducts } = await supabase
      .from('products')
      .select('*')
      .gte('created_at', twoDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentProducts && recentProducts.length > 0) {
      console.log('Sample of Recent Products (First 5):');
      console.log('-'.repeat(60));
      recentProducts.forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.name}`);
        console.log(`   SKU: ${p.sku || 'N/A'}`);
        console.log(`   Price: Rp ${(p.price || 0).toLocaleString('id-ID')}`);
        console.log(`   Category ID: ${p.category_id || 'N/A'}`);
        console.log(`   Created: ${new Date(p.created_at).toLocaleString('id-ID')}`);
        console.log();
      });
    }

    // Check for products with missing data
    const { count: incompleteCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or('name.is.null,price.is.null,category_id.is.null');

    console.log('Products with Missing Data:', incompleteCount || 0);
    console.log();

    // Get category distribution for recent uploads
    const { data: categoryDist } = await supabase
      .from('products')
      .select('category_id, categories(name)')
      .gte('created_at', twoDaysAgo.toISOString())
      .not('category_id', 'is', null);

    if (categoryDist && categoryDist.length > 0) {
      const catMap = new Map();
      categoryDist.forEach(p => {
        const catName = p.categories?.name || 'Unknown';
        catMap.set(catName, (catMap.get(catName) || 0) + 1);
      });

      console.log('Recent Products by Category:');
      console.log('-'.repeat(60));
      Array.from(catMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([cat, count]) => {
          console.log(`  ${cat}: ${count} products`);
        });
      console.log();
    }

    console.log('='.repeat(60));
    console.log('✅ UPLOAD STATUS SUMMARY');
    console.log('='.repeat(60));

    if (totalCount >= 6000) {
      console.log('✅ Status: SUCCESS - All data appears to be uploaded');
      console.log(`   Expected: ~6000 products`);
      console.log(`   Found: ${totalCount} products`);
      console.log(`   Recent uploads: ${recentCount} products`);
    } else if (totalCount > 0 && totalCount < 6000) {
      console.log('⚠️  Status: PARTIAL - Some data may be missing');
      console.log(`   Expected: ~6000 products`);
      console.log(`   Found: ${totalCount} products`);
      console.log(`   Missing: ~${6000 - totalCount} products`);
    } else {
      console.log('❌ Status: NO DATA - Upload may have failed');
    }

    if (incompleteCount > 0) {
      console.log(`⚠️  Warning: ${incompleteCount} products have missing required fields`);
    }

    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error checking upload status:', error);
  }
}

checkUploadStatus();
