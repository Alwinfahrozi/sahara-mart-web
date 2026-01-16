@echo off
REM ============================================================================
REM Production Testing Script for Sahara Mart
REM ============================================================================

REM Change to script directory
cd /d "%~dp0"

echo.
echo ========================================================================
echo  SAHARA MART - PRODUCTION TESTING SUITE
echo ========================================================================
echo.
echo Production URL: https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app
echo.
echo This script will run tests against your live production website.
echo.

set PRODUCTION_URL=https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app

echo ========================================================================
echo  1. E2E TESTS (28 tests - Most Important)
echo ========================================================================
echo Running End-to-End tests...
echo.

set NEXT_PUBLIC_BASE_URL=%PRODUCTION_URL%
node scripts\test-e2e.js

echo.
echo ========================================================================
echo  E2E TESTS COMPLETED
echo ========================================================================
echo.
echo Press any key to continue with Load Tests, or Ctrl+C to stop...
pause >nul

echo.
echo ========================================================================
echo  2. LOAD TESTS (4 scenarios - Optional)
echo ========================================================================
echo Running Load tests...
echo Warning: This will take 3-5 minutes
echo.

set NEXT_PUBLIC_BASE_URL=%PRODUCTION_URL%
node scripts\test-load.js

echo.
echo ========================================================================
echo  LOAD TESTS COMPLETED
echo ========================================================================
echo.
echo Press any key to continue with Security Tests, or Ctrl+C to stop...
pause >nul

echo.
echo ========================================================================
echo  3. SECURITY TESTS (30+ tests - Optional)
echo ========================================================================
echo Running Security tests...
echo.

set NEXT_PUBLIC_BASE_URL=%PRODUCTION_URL%
node scripts\test-security.js

echo.
echo ========================================================================
echo  ALL TESTS COMPLETED
echo ========================================================================
echo.
echo Production URL: %PRODUCTION_URL%
echo.
echo Check the results above to ensure:
echo - E2E: Pass rate >= 95%% (27+ of 28 tests)
echo - Load: Average response time ^< 2s
echo - Security: Score >= 9.0/10
echo.
echo ========================================================================
echo.
pause
