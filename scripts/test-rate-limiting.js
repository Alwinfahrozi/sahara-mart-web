/**
 * Test Rate Limiting
 * Tests if rate limiting is working correctly
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testRateLimiting() {
  console.log('\n🧪 TESTING RATE LIMITING\n');
  console.log('='.repeat(60));

  // Test 1: Products API (100 requests/minute limit)
  console.log('\n📊 Test 1: Products API Rate Limiting');
  console.log('Limit: 100 requests/minute');
  console.log('Testing: Sending 105 requests rapidly...\n');

  let successCount = 0;
  let rateLimitedCount = 0;
  let firstRateLimitResponse = null;

  for (let i = 1; i <= 105; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/products?limit=1`);

      if (res.ok) {
        successCount++;
        if (i <= 5 || i > 100) {
          console.log(`✅ Request ${i}: Success (${res.status})`);
        } else if (i === 6) {
          console.log(`   ... (showing first 5 and last 5) ...`);
        }

        // Check headers
        if (i === 1) {
          console.log(`\nRate Limit Headers:`);
          console.log(`  X-RateLimit-Limit: ${res.headers.get('X-RateLimit-Limit') || 'N/A'}`);
          console.log(`  X-RateLimit-Remaining: ${res.headers.get('X-RateLimit-Remaining') || 'N/A'}`);
          console.log(`  X-RateLimit-Reset: ${res.headers.get('X-RateLimit-Reset') || 'N/A'}\n`);
        }
      } else if (res.status === 429) {
        rateLimitedCount++;
        if (!firstRateLimitResponse) {
          firstRateLimitResponse = i;
          const data = await res.json();
          console.log(`\n❌ Request ${i}: RATE LIMITED (429)`);
          console.log(`Message: ${data.message || data.error}`);
          console.log(`Retry After: ${data.retryAfter || 'N/A'} seconds`);
          console.log(`\nRate Limit Headers:`);
          console.log(`  X-RateLimit-Limit: ${res.headers.get('X-RateLimit-Limit')}`);
          console.log(`  X-RateLimit-Remaining: ${res.headers.get('X-RateLimit-Remaining')}`);
          console.log(`  X-RateLimit-Reset: ${res.headers.get('X-RateLimit-Reset')}\n`);
        } else if (i > 100) {
          console.log(`❌ Request ${i}: Rate limited`);
        }
      }

      // Small delay to simulate real requests
      await new Promise(resolve => setTimeout(resolve, 10));
    } catch (error) {
      console.log(`⚠️ Request ${i}: Error - ${error.message}`);
    }
  }

  console.log('\n' + '-'.repeat(60));
  console.log('Test 1 Results:');
  console.log(`  Total requests: 105`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Rate limited: ${rateLimitedCount}`);
  console.log(`  First rate limit at request: ${firstRateLimitResponse || 'None'}`);

  if (rateLimitedCount > 0 && successCount <= 100) {
    console.log('\n✅ PASS: Rate limiting is working!');
  } else {
    console.log('\n⚠️ UNEXPECTED: Rate limiting may not be working correctly');
  }

  // Test 2: Orders API (10 requests/minute limit)
  console.log('\n\n📊 Test 2: Orders API Rate Limiting');
  console.log('Limit: 10 requests/minute');
  console.log('Testing: Sending 15 POST requests...\n');

  let orderSuccessCount = 0;
  let orderRateLimitedCount = 0;

  for (let i = 1; i <= 15; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Intentionally incomplete to trigger validation error
          // We just want to test rate limiting, not create real orders
          customer_name: 'Test',
        }),
      });

      if (res.status === 400) {
        // Validation error (expected for incomplete data)
        orderSuccessCount++;
        console.log(`✅ Request ${i}: Passed rate limit (got validation error as expected)`);
      } else if (res.status === 429) {
        orderRateLimitedCount++;
        const data = await res.json();
        if (i === 11) {
          console.log(`\n❌ Request ${i}: RATE LIMITED (429)`);
          console.log(`Message: ${data.message || data.error}`);
        } else if (i > 11) {
          console.log(`❌ Request ${i}: Rate limited`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.log(`⚠️ Request ${i}: Error - ${error.message}`);
    }
  }

  console.log('\n' + '-'.repeat(60));
  console.log('Test 2 Results:');
  console.log(`  Total requests: 15`);
  console.log(`  Passed rate limit: ${orderSuccessCount}`);
  console.log(`  Rate limited: ${orderRateLimitedCount}`);

  if (orderRateLimitedCount > 0 && orderSuccessCount <= 10) {
    console.log('\n✅ PASS: Orders rate limiting is working!');
  } else {
    console.log('\n⚠️ UNEXPECTED: Orders rate limiting may not be working correctly');
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('✅ RATE LIMITING TESTS COMPLETE!\n');
  console.log('Summary:');
  console.log(`  Products API: ${rateLimitedCount > 0 ? '✅ WORKING' : '⚠️ CHECK'}`);
  console.log(`  Orders API: ${orderRateLimitedCount > 0 ? '✅ WORKING' : '⚠️ CHECK'}`);
  console.log('\nNote: Tests use actual API endpoints.');
  console.log('Make sure server is running: npm run dev');
  console.log('');
}

// Run tests
testRateLimiting().catch(console.error);
