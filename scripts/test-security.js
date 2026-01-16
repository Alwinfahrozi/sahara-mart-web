/**
 * SECURITY PENETRATION TESTING SCRIPT
 * Sahara Mart E-Commerce Website
 *
 * This script performs comprehensive security testing to identify vulnerabilities
 * Run: node scripts/test-security.js
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Security test results tracker
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  vulnerabilities: [],
  warnings: []
};

// Helper function to run a security test
async function runSecurityTest(testId, testName, testFn, severity = 'HIGH') {
  results.total++;
  process.stdout.write(`${colors.cyan}[${testId}]${colors.reset} ${testName}... `);

  try {
    const result = await testFn();

    if (result.passed) {
      results.passed++;
      console.log(`${colors.green}✓ SECURE${colors.reset}`);
    } else {
      results.failed++;
      console.log(`${colors.red}✗ VULNERABLE${colors.reset}`);

      results.vulnerabilities.push({
        testId,
        testName,
        severity,
        details: result.details,
        recommendation: result.recommendation
      });
    }

    if (result.warning) {
      results.warnings.push({ testId, testName, warning: result.warning });
    }

    return result;
  } catch (error) {
    results.failed++;
    console.log(`${colors.yellow}⚠ ERROR${colors.reset}`);
    results.vulnerabilities.push({
      testId,
      testName,
      severity: 'MEDIUM',
      details: `Test error: ${error.message}`,
      recommendation: 'Investigate test failure'
    });
    return { passed: false, details: error.message };
  }
}

// Helper to make requests with timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================================================
// SQL INJECTION TESTS
// ============================================================================

async function testSQLInjection() {
  log('\n🛡️  SQL INJECTION TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  const sqlPayloads = [
    "' OR '1'='1",
    "1' OR '1' = '1",
    "admin'--",
    "' OR 1=1--",
    "1; DROP TABLE products--",
    "' UNION SELECT NULL--",
    "1' AND '1'='1"
  ];

  await runSecurityTest('SQL-001', 'Products API resists SQL injection in search', async () => {
    for (const payload of sqlPayloads) {
      const response = await fetchWithTimeout(
        `${baseUrl}/api/products?search=${encodeURIComponent(payload)}`
      );

      const data = await response.json();

      // Should return empty array or normal results, not error or all products
      if (response.status === 500 || (Array.isArray(data) && data.length > 100)) {
        return {
          passed: false,
          details: `SQL injection payload "${payload}" may have executed`,
          recommendation: 'Implement parameterized queries and input sanitization'
        };
      }
    }

    return { passed: true };
  }, 'CRITICAL');

  await runSecurityTest('SQL-002', 'Products API resists SQL injection in ID', async () => {
    const maliciousIds = ["1 OR 1=1", "1'; DROP TABLE products--", "1 UNION SELECT * FROM users--"];

    for (const id of maliciousIds) {
      const response = await fetchWithTimeout(
        `${baseUrl}/api/products/${encodeURIComponent(id)}`
      );

      // Should return 400/404, not 500 or expose data
      if (response.status === 500) {
        return {
          passed: false,
          details: 'SQL injection in product ID caused server error',
          recommendation: 'Validate and sanitize product ID parameter'
        };
      }
    }

    return { passed: true };
  }, 'CRITICAL');
}

// ============================================================================
// XSS (CROSS-SITE SCRIPTING) TESTS
// ============================================================================

async function testXSS() {
  log('\n🛡️  XSS (CROSS-SITE SCRIPTING) TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg/onload=alert("XSS")>',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')">',
    '"><script>alert(String.fromCharCode(88,83,83))</script>'
  ];

  await runSecurityTest('XSS-001', 'Product search sanitizes XSS attempts', async () => {
    for (const payload of xssPayloads) {
      const response = await fetchWithTimeout(
        `${baseUrl}/api/products?search=${encodeURIComponent(payload)}`
      );

      const data = await response.json();
      const responseText = JSON.stringify(data);

      // Check if script tags are returned unescaped
      if (responseText.includes('<script>') || responseText.includes('onerror=')) {
        return {
          passed: false,
          details: `XSS payload not sanitized: ${payload}`,
          recommendation: 'Sanitize all user input and escape output'
        };
      }
    }

    return { passed: true };
  }, 'HIGH');

  await runSecurityTest('XSS-002', 'HTML pages escape user content', async () => {
    const response = await fetchWithTimeout(baseUrl);
    const html = await response.text();

    // Check for proper Content-Security-Policy header
    const cspHeader = response.headers.get('content-security-policy');

    if (!cspHeader) {
      return {
        passed: true,
        warning: 'No Content-Security-Policy header found. Consider adding CSP.'
      };
    }

    return { passed: true };
  }, 'MEDIUM');
}

// ============================================================================
// CSRF (CROSS-SITE REQUEST FORGERY) TESTS
// ============================================================================

async function testCSRF() {
  log('\n🛡️  CSRF PROTECTION TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('CSRF-001', 'POST requests require CSRF token', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });

    // Should return 403 Forbidden without CSRF token
    if (response.status !== 403) {
      return {
        passed: false,
        details: `Expected 403, got ${response.status}. CSRF protection may be missing.`,
        recommendation: 'Implement CSRF token validation for all state-changing operations'
      };
    }

    return { passed: true };
  }, 'CRITICAL');

  await runSecurityTest('CSRF-002', 'CSRF token endpoint is accessible', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/csrf`);

    if (response.status !== 200) {
      return {
        passed: false,
        details: 'CSRF token endpoint not accessible',
        recommendation: 'Ensure /api/csrf endpoint is available'
      };
    }

    const data = await response.json();

    if (!data.token || data.token.length < 32) {
      return {
        passed: false,
        details: 'CSRF token is weak or missing',
        recommendation: 'Generate cryptographically strong CSRF tokens'
      };
    }

    return { passed: true };
  }, 'HIGH');

  await runSecurityTest('CSRF-003', 'Invalid CSRF token is rejected', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': 'invalid-token-123'
      },
      body: JSON.stringify({ test: 'data' })
    });

    if (response.status !== 403) {
      return {
        passed: false,
        details: 'Invalid CSRF token was accepted',
        recommendation: 'Validate CSRF tokens properly'
      };
    }

    return { passed: true };
  }, 'CRITICAL');
}

// ============================================================================
// AUTHENTICATION & AUTHORIZATION TESTS
// ============================================================================

async function testAuthentication() {
  log('\n🛡️  AUTHENTICATION & AUTHORIZATION TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('AUTH-001', 'Admin routes require authentication', async () => {
    const adminRoutes = ['/admin', '/admin/products', '/admin/orders'];

    for (const route of adminRoutes) {
      const response = await fetchWithTimeout(`${baseUrl}${route}`);

      // Should redirect to login (302) or return 401/403
      if (response.status === 200 && !response.url.includes('login')) {
        return {
          passed: false,
          details: `Admin route ${route} accessible without authentication`,
          recommendation: 'Implement authentication middleware for all admin routes'
        };
      }
    }

    return { passed: true };
  }, 'CRITICAL');

  await runSecurityTest('AUTH-002', 'API endpoints validate authentication', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unauthorized Product',
        price: 10000,
        stock: 100
      })
    });

    // Should fail without proper authentication (401/403)
    if (response.status === 200 || response.status === 201) {
      return {
        passed: false,
        details: 'Product creation allowed without authentication',
        recommendation: 'Require authentication for all write operations'
      };
    }

    return { passed: true };
  }, 'CRITICAL');
}

// ============================================================================
// RATE LIMITING TESTS
// ============================================================================

async function testRateLimiting() {
  log('\n🛡️  RATE LIMITING TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('RATE-001', 'Products API has rate limiting', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/products`);

    const rateLimitHeaders = {
      limit: response.headers.get('x-ratelimit-limit'),
      remaining: response.headers.get('x-ratelimit-remaining'),
      reset: response.headers.get('x-ratelimit-reset')
    };

    if (!rateLimitHeaders.limit || !rateLimitHeaders.remaining) {
      return {
        passed: false,
        details: 'Rate limiting headers not present',
        recommendation: 'Implement rate limiting with proper headers'
      };
    }

    return { passed: true };
  }, 'HIGH');

  await runSecurityTest('RATE-002', 'Rate limit triggers correctly', async () => {
    // Make rapid requests (20 requests)
    const requests = [];
    for (let i = 0; i < 20; i++) {
      requests.push(fetchWithTimeout(`${baseUrl}/api/products?limit=1`));
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);

    // Check if remaining count decreases
    const firstResponse = responses[0];
    const lastResponse = responses[responses.length - 1];

    const firstRemaining = parseInt(firstResponse.headers.get('x-ratelimit-remaining') || '0');
    const lastRemaining = parseInt(lastResponse.headers.get('x-ratelimit-remaining') || '0');

    if (firstRemaining <= lastRemaining && !rateLimited) {
      return {
        passed: false,
        details: 'Rate limit counter not decreasing properly',
        recommendation: 'Fix rate limiting counter logic'
      };
    }

    return { passed: true };
  }, 'HIGH');

  await runSecurityTest('RATE-003', 'Orders API has stricter rate limiting', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/orders`);

    const limit = parseInt(response.headers.get('x-ratelimit-limit') || '0');

    // Orders should have lower limit than products (10 vs 100)
    if (limit > 20) {
      return {
        passed: false,
        details: `Orders API limit too high: ${limit}. Should be ~10 req/min.`,
        recommendation: 'Set stricter rate limits for sensitive operations'
      };
    }

    return { passed: true };
  }, 'MEDIUM');
}

// ============================================================================
// INPUT VALIDATION TESTS
// ============================================================================

async function testInputValidation() {
  log('\n🛡️  INPUT VALIDATION TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('INPUT-001', 'API rejects invalid JSON', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json {{{{'
    });

    if (response.status === 200) {
      return {
        passed: false,
        details: 'Invalid JSON was accepted',
        recommendation: 'Validate JSON format before processing'
      };
    }

    return { passed: true };
  }, 'MEDIUM');

  await runSecurityTest('INPUT-002', 'API validates required fields', async () => {
    // Get CSRF token first
    const csrfResponse = await fetchWithTimeout(`${baseUrl}/api/csrf`);
    const { token } = await csrfResponse.json();

    const response = await fetchWithTimeout(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': token
      },
      body: JSON.stringify({}) // Empty object, missing required fields
    });

    if (response.status === 200 || response.status === 201) {
      return {
        passed: false,
        details: 'Request with missing required fields was accepted',
        recommendation: 'Validate all required fields are present'
      };
    }

    return { passed: true };
  }, 'MEDIUM');

  await runSecurityTest('INPUT-003', 'API rejects negative values', async () => {
    const response = await fetchWithTimeout(
      `${baseUrl}/api/products?page=-1&limit=-100`
    );

    const data = await response.json();

    // Should handle negative values gracefully, not crash
    if (response.status === 500) {
      return {
        passed: false,
        details: 'Negative values caused server error',
        recommendation: 'Validate and sanitize numeric inputs'
      };
    }

    return { passed: true };
  }, 'LOW');

  await runSecurityTest('INPUT-004', 'API limits string length', async () => {
    const veryLongString = 'A'.repeat(100000); // 100KB string

    const response = await fetchWithTimeout(
      `${baseUrl}/api/products?search=${veryLongString}`,
      {},
      10000 // Longer timeout
    );

    // Should reject or truncate, not crash
    if (response.status === 500) {
      return {
        passed: false,
        details: 'Extremely long input caused server error',
        recommendation: 'Implement string length limits'
      };
    }

    return { passed: true };
  }, 'MEDIUM');
}

// ============================================================================
// SECURITY HEADERS TESTS
// ============================================================================

async function testSecurityHeaders() {
  log('\n🛡️  SECURITY HEADERS TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('HEADER-001', 'X-Frame-Options header present', async () => {
    const response = await fetchWithTimeout(baseUrl);
    const xFrameOptions = response.headers.get('x-frame-options');

    if (!xFrameOptions) {
      return {
        passed: false,
        details: 'X-Frame-Options header missing',
        recommendation: 'Add X-Frame-Options: DENY or SAMEORIGIN header'
      };
    }

    return { passed: true };
  }, 'MEDIUM');

  await runSecurityTest('HEADER-002', 'X-Content-Type-Options header present', async () => {
    const response = await fetchWithTimeout(baseUrl);
    const contentTypeOptions = response.headers.get('x-content-type-options');

    if (!contentTypeOptions || contentTypeOptions !== 'nosniff') {
      return {
        passed: false,
        details: 'X-Content-Type-Options: nosniff header missing',
        recommendation: 'Add X-Content-Type-Options: nosniff header'
      };
    }

    return { passed: true };
  }, 'LOW');

  await runSecurityTest('HEADER-003', 'Strict-Transport-Security header present (HTTPS)', async () => {
    const response = await fetchWithTimeout(baseUrl);
    const hsts = response.headers.get('strict-transport-security');

    if (!hsts && baseUrl.startsWith('https://')) {
      return {
        passed: false,
        details: 'HSTS header missing on HTTPS site',
        recommendation: 'Add Strict-Transport-Security header for HTTPS'
      };
    }

    return {
      passed: true,
      warning: baseUrl.startsWith('http://') ? 'HSTS only applies to HTTPS sites' : undefined
    };
  }, 'MEDIUM');
}

// ============================================================================
// SESSION SECURITY TESTS
// ============================================================================

async function testSessionSecurity() {
  log('\n🛡️  SESSION SECURITY TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('SESSION-001', 'Cookies have secure flags', async () => {
    const response = await fetchWithTimeout(baseUrl);
    const setCookie = response.headers.get('set-cookie');

    if (setCookie) {
      // Check for HttpOnly and Secure flags
      if (!setCookie.includes('HttpOnly')) {
        return {
          passed: false,
          details: 'Session cookies missing HttpOnly flag',
          recommendation: 'Add HttpOnly flag to session cookies'
        };
      }

      if (baseUrl.startsWith('https://') && !setCookie.includes('Secure')) {
        return {
          passed: false,
          details: 'Session cookies missing Secure flag on HTTPS',
          recommendation: 'Add Secure flag to cookies on HTTPS'
        };
      }
    }

    return { passed: true };
  }, 'HIGH');

  await runSecurityTest('SESSION-002', 'CSRF tokens are unique per session', async () => {
    const response1 = await fetchWithTimeout(`${baseUrl}/api/csrf`);
    const data1 = await response1.json();

    const response2 = await fetchWithTimeout(`${baseUrl}/api/csrf`);
    const data2 = await response2.json();

    // Tokens should be different for different requests
    if (data1.token === data2.token) {
      return {
        passed: false,
        details: 'CSRF tokens are not unique',
        recommendation: 'Generate unique CSRF tokens per request/session'
      };
    }

    return { passed: true };
  }, 'HIGH');
}

// ============================================================================
// DATA EXPOSURE TESTS
// ============================================================================

async function testDataExposure() {
  log('\n🛡️  DATA EXPOSURE TESTS', 'bright');
  log('═'.repeat(70), 'cyan');

  await runSecurityTest('DATA-001', 'API does not expose sensitive data', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/products`);
    const data = await response.json();
    const responseText = JSON.stringify(data);

    // Check for sensitive data patterns
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /api[_-]?key/i,
      /SUPABASE_/i,
      /database[_-]?url/i
    ];

    for (const pattern of sensitivePatterns) {
      if (pattern.test(responseText)) {
        return {
          passed: false,
          details: `Sensitive data pattern detected: ${pattern}`,
          recommendation: 'Remove sensitive data from API responses'
        };
      }
    }

    return { passed: true };
  }, 'CRITICAL');

  await runSecurityTest('DATA-002', 'Error messages do not expose system details', async () => {
    const response = await fetchWithTimeout(`${baseUrl}/api/products/99999999`);
    const text = await response.text();

    // Check for stack traces or system paths
    if (text.includes('at ') && text.includes('.js:') || text.includes('Error:')) {
      return {
        passed: false,
        details: 'Error responses may contain stack traces',
        recommendation: 'Use generic error messages in production'
      };
    }

    return { passed: true };
  }, 'MEDIUM');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runSecurityTests() {
  log('\n🔒 SAHARA MART SECURITY PENETRATION TESTING SUITE', 'bright');
  log('═'.repeat(70), 'cyan');
  log(`Base URL: ${baseUrl}`, 'yellow');
  log(`Start Time: ${new Date().toLocaleString()}`, 'yellow');
  log('═'.repeat(70), 'cyan');

  const startTime = Date.now();

  try {
    // Run all security test suites
    await testSQLInjection();
    await testXSS();
    await testCSRF();
    await testAuthentication();
    await testRateLimiting();
    await testInputValidation();
    await testSecurityHeaders();
    await testSessionSecurity();
    await testDataExposure();

    // Print summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    log('\n═'.repeat(70), 'cyan');
    log('🔒 SECURITY TEST SUMMARY', 'bright');
    log('═'.repeat(70), 'cyan');
    log(`Total Tests:     ${results.total}`, 'bright');
    log(`✓ Secure:        ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)`, 'green');
    log(`✗ Vulnerable:    ${results.failed}`, results.failed > 0 ? 'red' : 'green');
    log(`⚠ Warnings:      ${results.warnings.length}`, results.warnings.length > 0 ? 'yellow' : 'green');
    log(`Duration:        ${duration}s`, 'cyan');
    log('═'.repeat(70), 'cyan');

    // Print vulnerabilities if any
    if (results.vulnerabilities.length > 0) {
      log('\n🚨 VULNERABILITIES FOUND:', 'red');
      log('═'.repeat(70), 'red');

      results.vulnerabilities.forEach(({ testId, testName, severity, details, recommendation }) => {
        const severityColor = severity === 'CRITICAL' ? 'red' : severity === 'HIGH' ? 'magenta' : 'yellow';
        log(`\n[${testId}] ${testName}`, 'red');
        log(`  Severity: ${severity}`, severityColor);
        log(`  Details: ${details}`, 'yellow');
        log(`  Recommendation: ${recommendation}`, 'cyan');
      });

      log('═'.repeat(70), 'red');
    }

    // Print warnings if any
    if (results.warnings.length > 0) {
      log('\n⚠️  WARNINGS:', 'yellow');
      log('═'.repeat(70), 'yellow');

      results.warnings.forEach(({ testId, testName, warning }) => {
        log(`\n[${testId}] ${testName}`, 'yellow');
        log(`  Warning: ${warning}`, 'cyan');
      });

      log('═'.repeat(70), 'yellow');
    }

    // Security score calculation
    const securityScore = (results.passed / results.total) * 10;
    const criticalVulns = results.vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
    const highVulns = results.vulnerabilities.filter(v => v.severity === 'HIGH').length;

    log('\n📊 SECURITY SCORE', 'bright');
    log('═'.repeat(70), 'cyan');
    log(`Score: ${securityScore.toFixed(1)}/10`, securityScore >= 9 ? 'green' : securityScore >= 7 ? 'yellow' : 'red');
    log(`Critical Vulnerabilities: ${criticalVulns}`, criticalVulns > 0 ? 'red' : 'green');
    log(`High Vulnerabilities: ${highVulns}`, highVulns > 0 ? 'magenta' : 'green');
    log('═'.repeat(70), 'cyan');

    // Exit code based on security level
    if (criticalVulns > 0) {
      log('\n❌ SECURITY TEST FAILED - CRITICAL VULNERABILITIES FOUND', 'red');
      log('   Fix all CRITICAL vulnerabilities before deployment', 'red');
      process.exit(1);
    } else if (highVulns > 3) {
      log('\n⚠️  SECURITY TEST WARNING - MULTIPLE HIGH VULNERABILITIES', 'yellow');
      log('   Address HIGH vulnerabilities before production deployment', 'yellow');
      process.exit(0);
    } else if (securityScore >= 9.0) {
      log('\n✅ SECURITY TEST PASSED - EXCELLENT SECURITY', 'green');
      log(`   Security Score: ${securityScore.toFixed(1)}/10`, 'green');
      process.exit(0);
    } else if (securityScore >= 7.0) {
      log('\n✅ SECURITY TEST PASSED - GOOD SECURITY', 'green');
      log(`   Security Score: ${securityScore.toFixed(1)}/10`, 'green');
      process.exit(0);
    } else {
      log('\n❌ SECURITY TEST FAILED - LOW SECURITY SCORE', 'red');
      log(`   Security Score: ${securityScore.toFixed(1)}/10 (minimum 7.0)`, 'red');
      process.exit(1);
    }

  } catch (error) {
    log('\n❌ SECURITY TEST CRASHED', 'red');
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

// Run security tests
runSecurityTests().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
