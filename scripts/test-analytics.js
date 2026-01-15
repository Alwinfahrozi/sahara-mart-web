/**
 * Test Analytics Functions
 * Tests if analytics APIs are working correctly
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testAnalytics() {
  console.log('\n🧪 TESTING ANALYTICS ENDPOINTS\n');
  console.log('='.repeat(60));

  // Test 1: Today's sales
  console.log('\n📊 Test 1: GET /api/analytics/today');
  try {
    const todayRes = await fetch(`${baseUrl}/api/analytics/today`);
    const todayData = await todayRes.json();

    if (todayRes.ok) {
      console.log('✅ Success!');
      console.log('Today Stats:', JSON.stringify(todayData.stats, null, 2));
    } else {
      console.log('❌ Failed:', todayData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: This week's sales
  console.log('\n📊 Test 2: GET /api/analytics/weekly');
  try {
    const weekRes = await fetch(`${baseUrl}/api/analytics/weekly`);
    const weekData = await weekRes.json();

    if (weekRes.ok) {
      console.log('✅ Success!');
      console.log('Week Stats:', JSON.stringify(weekData.stats, null, 2));
      console.log('Trend Data Points:', weekData.trend?.length || 0);
    } else {
      console.log('❌ Failed:', weekData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: This month's sales
  console.log('\n📊 Test 3: GET /api/analytics/monthly');
  try {
    const monthRes = await fetch(`${baseUrl}/api/analytics/monthly`);
    const monthData = await monthRes.json();

    if (monthRes.ok) {
      console.log('✅ Success!');
      console.log('Month Stats:', JSON.stringify(monthData.stats, null, 2));
      console.log('Trend Data Points:', monthData.trend?.length || 0);
    } else {
      console.log('❌ Failed:', monthData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Top products
  console.log('\n📊 Test 4: GET /api/analytics/top-products');
  try {
    const topRes = await fetch(`${baseUrl}/api/analytics/top-products?limit=5&period=month`);
    const topData = await topRes.json();

    if (topRes.ok) {
      console.log('✅ Success!');
      console.log('Top Products:', topData.products?.length || 0);
      if (topData.products?.length > 0) {
        console.log('First Product:', JSON.stringify(topData.products[0], null, 2));
      }
    } else {
      console.log('❌ Failed:', topData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ TESTING COMPLETE!\n');
  console.log('If all tests passed with data, dashboard should work.');
  console.log('If tests show 0 values, check:');
  console.log('  1. Run database/DEPLOY_ANALYTICS.sql in Supabase');
  console.log('  2. Reload schema in Supabase Settings → API');
  console.log('  3. Make sure orders exist with delivered status');
  console.log('');
}

// Run tests
testAnalytics().catch(console.error);
