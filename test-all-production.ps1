# ============================================================================
# Production Testing Script for Sahara Mart - ALL TESTS (PowerShell)
# ============================================================================

$PRODUCTION_URL = "https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app"

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " SAHARA MART - PRODUCTION TESTING SUITE (ALL TESTS)" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Production URL: $PRODUCTION_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Running ALL tests without pause..."
Write-Host "This will take approximately 5-7 minutes."
Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
Write-Host "[1/3] E2E TESTS (28 tests - Most Important)" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

$env:NEXT_PUBLIC_BASE_URL = $PRODUCTION_URL
node scripts/test-e2e.js

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "E2E TESTS COMPLETED" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
Write-Host "[2/3] LOAD TESTS (4 scenarios)" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "Warning: This will take 3-5 minutes" -ForegroundColor Yellow
Write-Host ""

$env:NEXT_PUBLIC_BASE_URL = $PRODUCTION_URL
node scripts/test-load.js

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "LOAD TESTS COMPLETED" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
Write-Host "[3/3] SECURITY TESTS (30+ tests)" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

$env:NEXT_PUBLIC_BASE_URL = $PRODUCTION_URL
node scripts/test-security.js

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " ALL TESTS COMPLETED" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Production URL: $PRODUCTION_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check the results above to ensure:" -ForegroundColor White
Write-Host "- E2E: Pass rate >= 95% (27+ of 28 tests)" -ForegroundColor White
Write-Host "- Load: Average response time < 2s" -ForegroundColor White
Write-Host "- Security: Score >= 9.0/10" -ForegroundColor White
Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
