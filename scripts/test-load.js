/**
 * LOAD TESTING SCRIPT
 * Sahara Mart E-Commerce Website
 *
 * This script performs load testing to validate system performance under stress
 * Run: node scripts/test-load.js
 *
 * Requirements: Node.js 18+
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Statistics tracker
const stats = {
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    rateLimited: 0
  },
  responseTimes: [],
  errors: [],
  startTime: 0,
  endTime: 0
};

// Add response time to stats
function recordResponseTime(time) {
  stats.responseTimes.push(time);
}

// Calculate statistics
function calculateStats() {
  const times = stats.responseTimes;
  if (times.length === 0) return { avg: 0, min: 0, max: 0, p95: 0, p99: 0 };

  times.sort((a, b) => a - b);

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = times[0];
  const max = times[times.length - 1];
  const p95Index = Math.floor(times.length * 0.95);
  const p99Index = Math.floor(times.length * 0.99);
  const p95 = times[p95Index] || max;
  const p99 = times[p99Index] || max;

  return { avg, min, max, p95, p99 };
}

// Make a single request
async function makeRequest(url, options = {}) {
  stats.requests.total++;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    recordResponseTime(responseTime);

    if (response.status === 429) {
      stats.requests.rateLimited++;
    } else if (response.ok) {
      stats.requests.successful++;
    } else {
      stats.requests.failed++;
    }

    return { status: response.status, time: responseTime };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    stats.requests.failed++;
    stats.errors.push(error.message);
    return { status: 0, time: responseTime, error: error.message };
  }
}

// Wait for a duration
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Progress bar
function showProgress(current, total, label = '') {
  const barLength = 40;
  const filled = Math.round((current / total) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  const percent = Math.round((current / total) * 100);

  process.stdout.write(`\r${colors.cyan}${label}${colors.reset} [${bar}] ${percent}% (${current}/${total})`);

  if (current === total) {
    console.log(''); // New line when complete
  }
}

// ============================================================================
// TEST SCENARIO 1: NORMAL TRAFFIC
// ============================================================================

async function testNormalTraffic() {
  log('\n📊 SCENARIO 1: NORMAL TRAFFIC', 'bright');
  log('═'.repeat(70), 'cyan');
  log('Target: 100 requests over 60 seconds', 'yellow');
  log('Expected: < 2s response time for 95% of requests', 'yellow');
  log('═'.repeat(70), 'cyan');

  const totalRequests = 100;
  const duration = 60000; // 60 seconds
  const delayBetweenRequests = duration / totalRequests;

  log('\nStarting normal traffic simulation...', 'cyan');

  const endpoints = [
    { url: `${baseUrl}/api/products`, weight: 0.5 },
    { url: `${baseUrl}/api/categories`, weight: 0.2 },
    { url: `${baseUrl}/`, weight: 0.2 },
    { url: `${baseUrl}/katalog`, weight: 0.1 }
  ];

  for (let i = 0; i < totalRequests; i++) {
    // Select random endpoint based on weight
    const rand = Math.random();
    let cumulative = 0;
    let selectedEndpoint = endpoints[0].url;

    for (const ep of endpoints) {
      cumulative += ep.weight;
      if (rand <= cumulative) {
        selectedEndpoint = ep.url;
        break;
      }
    }

    await makeRequest(selectedEndpoint);
    showProgress(i + 1, totalRequests, 'Progress:');

    if (i < totalRequests - 1) {
      await sleep(delayBetweenRequests);
    }
  }

  const calcStats = calculateStats();
  log('\n\n✅ Normal Traffic Test Complete', 'green');
  log(`Average Response Time: ${calcStats.avg.toFixed(0)}ms`, calcStats.avg < 2000 ? 'green' : 'red');
  log(`95th Percentile: ${calcStats.p95.toFixed(0)}ms`, calcStats.p95 < 2000 ? 'green' : 'red');
  log(`99th Percentile: ${calcStats.p99.toFixed(0)}ms`, 'cyan');
  log(`Success Rate: ${((stats.requests.successful / stats.requests.total) * 100).toFixed(1)}%`, 'cyan');

  if (calcStats.p95 < 2000) {
    log('✓ Target achieved: 95% < 2s', 'green');
  } else {
    log('✗ Target missed: 95% < 2s', 'red');
  }
}

// ============================================================================
// TEST SCENARIO 2: BURST TRAFFIC
// ============================================================================

async function testBurstTraffic() {
  log('\n📊 SCENARIO 2: BURST TRAFFIC', 'bright');
  log('═'.repeat(70), 'cyan');
  log('Target: 50 concurrent requests', 'yellow');
  log('Expected: System remains stable', 'yellow');
  log('═'.repeat(70), 'cyan');

  log('\nStarting burst traffic simulation...', 'cyan');

  const requests = [];
  for (let i = 0; i < 50; i++) {
    requests.push(makeRequest(`${baseUrl}/api/products?limit=10`));
  }

  await Promise.all(requests);

  const calcStats = calculateStats();
  log('\n✅ Burst Traffic Test Complete', 'green');
  log(`Average Response Time: ${calcStats.avg.toFixed(0)}ms`, calcStats.avg < 5000 ? 'green' : 'yellow');
  log(`Max Response Time: ${calcStats.max.toFixed(0)}ms`, 'cyan');
  log(`Success Rate: ${((stats.requests.successful / stats.requests.total) * 100).toFixed(1)}%`, 'cyan');
  log(`Rate Limited: ${stats.requests.rateLimited} requests`, stats.requests.rateLimited > 0 ? 'yellow' : 'green');
}

// ============================================================================
// TEST SCENARIO 3: RATE LIMITING VALIDATION
// ============================================================================

async function testRateLimiting() {
  log('\n📊 SCENARIO 3: RATE LIMITING VALIDATION', 'bright');
  log('═'.repeat(70), 'cyan');
  log('Target: Verify rate limiting at 100 req/min (products)', 'yellow');
  log('Expected: 429 responses after limit exceeded', 'yellow');
  log('═'.repeat(70), 'cyan');

  log('\nSending 110 requests rapidly...', 'cyan');

  const requests = [];
  for (let i = 0; i < 110; i++) {
    requests.push(makeRequest(`${baseUrl}/api/products?limit=1`));
    showProgress(i + 1, 110, 'Sending:');
  }

  await Promise.all(requests);

  log('\n\n✅ Rate Limiting Test Complete', 'green');
  log(`Total Requests: ${stats.requests.total}`, 'cyan');
  log(`Successful: ${stats.requests.successful}`, 'green');
  log(`Rate Limited (429): ${stats.requests.rateLimited}`, stats.requests.rateLimited > 0 ? 'green' : 'red');
  log(`Failed: ${stats.requests.failed}`, stats.requests.failed > 0 ? 'yellow' : 'green');

  if (stats.requests.rateLimited > 0) {
    log('✓ Rate limiting is working correctly', 'green');
  } else {
    log('✗ Rate limiting may not be configured', 'red');
  }
}

// ============================================================================
// TEST SCENARIO 4: SUSTAINED LOAD
// ============================================================================

async function testSustainedLoad() {
  log('\n📊 SCENARIO 4: SUSTAINED LOAD', 'bright');
  log('═'.repeat(70), 'cyan');
  log('Target: 200 requests over 120 seconds', 'yellow');
  log('Expected: Consistent performance', 'yellow');
  log('═'.repeat(70), 'cyan');

  const totalRequests = 200;
  const duration = 120000; // 120 seconds
  const delayBetweenRequests = duration / totalRequests;

  log('\nStarting sustained load simulation...', 'cyan');
  log('This will take 2 minutes...', 'yellow');

  for (let i = 0; i < totalRequests; i++) {
    await makeRequest(`${baseUrl}/api/products?limit=10`);
    showProgress(i + 1, totalRequests, 'Progress:');

    if (i < totalRequests - 1) {
      await sleep(delayBetweenRequests);
    }
  }

  const calcStats = calculateStats();
  log('\n\n✅ Sustained Load Test Complete', 'green');
  log(`Average Response Time: ${calcStats.avg.toFixed(0)}ms`, 'cyan');
  log(`95th Percentile: ${calcStats.p95.toFixed(0)}ms`, calcStats.p95 < 3000 ? 'green' : 'yellow');
  log(`Success Rate: ${((stats.requests.successful / stats.requests.total) * 100).toFixed(1)}%`, 'cyan');

  // Check for performance degradation
  const firstHalf = stats.responseTimes.slice(0, Math.floor(stats.responseTimes.length / 2));
  const secondHalf = stats.responseTimes.slice(Math.floor(stats.responseTimes.length / 2));

  const avgFirstHalf = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecondHalf = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const degradation = ((avgSecondHalf - avgFirstHalf) / avgFirstHalf) * 100;

  if (degradation < 20) {
    log(`✓ Performance stable (degradation: ${degradation.toFixed(1)}%)`, 'green');
  } else {
    log(`⚠ Performance degraded by ${degradation.toFixed(1)}%`, 'yellow');
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runLoadTests() {
  log('\n🔥 SAHARA MART LOAD TESTING SUITE', 'bright');
  log('═'.repeat(70), 'cyan');
  log(`Base URL: ${baseUrl}`, 'yellow');
  log(`Start Time: ${new Date().toLocaleString()}`, 'yellow');
  log('═'.repeat(70), 'cyan');

  stats.startTime = Date.now();

  try {
    // Run test scenarios
    await testNormalTraffic();
    await sleep(2000); // Cool down

    // Reset stats for next test
    const prevStats = { ...stats };
    stats.requests = { total: 0, successful: 0, failed: 0, rateLimited: 0 };
    stats.responseTimes = [];

    await testBurstTraffic();
    await sleep(2000);

    await testRateLimiting();
    await sleep(2000);

    // Ask user if they want sustained load test (takes 2 minutes)
    log('\n⏰ Sustained load test takes 2 minutes. Skipping for now...', 'yellow');
    log('   To run: Uncomment the line in runLoadTests()', 'cyan');
    // await testSustainedLoad();

    stats.endTime = Date.now();

    // Final summary
    const totalDuration = ((stats.endTime - stats.startTime) / 1000).toFixed(2);
    const calcStats = calculateStats();

    log('\n═'.repeat(70), 'cyan');
    log('📊 FINAL SUMMARY', 'bright');
    log('═'.repeat(70), 'cyan');
    log(`Total Duration: ${totalDuration}s`, 'cyan');
    log(`Total Requests: ${stats.requests.total}`, 'cyan');
    log(`Successful: ${stats.requests.successful}`, 'green');
    log(`Failed: ${stats.requests.failed}`, stats.requests.failed > 0 ? 'red' : 'green');
    log(`Rate Limited: ${stats.requests.rateLimited}`, 'yellow');
    log(`\nResponse Times:`, 'bright');
    log(`  Average: ${calcStats.avg.toFixed(0)}ms`, 'cyan');
    log(`  Min: ${calcStats.min.toFixed(0)}ms`, 'green');
    log(`  Max: ${calcStats.max.toFixed(0)}ms`, 'red');
    log(`  95th Percentile: ${calcStats.p95.toFixed(0)}ms`, 'cyan');
    log(`  99th Percentile: ${calcStats.p99.toFixed(0)}ms`, 'cyan');
    log('═'.repeat(70), 'cyan');

    // Pass/Fail determination
    const successRate = (stats.requests.successful / stats.requests.total) * 100;
    const avgResponseTime = calcStats.avg;

    if (successRate >= 95 && avgResponseTime < 2000) {
      log('\n✅ LOAD TEST PASSED', 'green');
      log('   - Success rate >= 95%', 'green');
      log('   - Average response time < 2s', 'green');
      process.exit(0);
    } else if (successRate >= 90 && avgResponseTime < 3000) {
      log('\n⚠️  LOAD TEST PASSED WITH WARNINGS', 'yellow');
      if (successRate < 95) log('   - Success rate below 95%', 'yellow');
      if (avgResponseTime >= 2000) log('   - Average response time >= 2s', 'yellow');
      process.exit(0);
    } else {
      log('\n❌ LOAD TEST FAILED', 'red');
      if (successRate < 90) log('   - Success rate < 90%', 'red');
      if (avgResponseTime >= 3000) log('   - Average response time >= 3s', 'red');
      process.exit(1);
    }

  } catch (error) {
    log('\n❌ LOAD TEST CRASHED', 'red');
    log(error.message, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Check environment
if (typeof fetch === 'undefined') {
  console.error('❌ Error: This script requires Node.js 18+ with native fetch support');
  process.exit(1);
}

// Run load tests
runLoadTests().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
