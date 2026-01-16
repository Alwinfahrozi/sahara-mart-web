@echo off
REM ============================================================================
REM Production Testing Script for Sahara Mart - ALL TESTS (No Pause)
REM ============================================================================

REM Change to script directory
cd /d "%~dp0"

set PRODUCTION_URL=https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app

echo.
echo ========================================================================
echo  SAHARA MART - PRODUCTION TESTING SUITE (ALL TESTS)
echo ========================================================================
echo.
echo Production URL: %PRODUCTION_URL%
echo.
echo Running ALL tests without pause...
echo This will take approximately 5-7 minutes.
echo.
echo ========================================================================
echo.

REM ============================================================================
echo [1/3] E2E TESTS (28 tests - Most Important)
echo ========================================================================
echo.

set NEXT_PUBLIC_BASE_URL=%PRODUCTION_URL%
node scripts\test-e2e.js

echo.
echo ========================================================================
echo E2E TESTS COMPLETED
echo ========================================================================
echo.

REM ============================================================================
echo [2/3] LOAD TESTS (4 scenarios)
echo ========================================================================
echo Warning: This will take 3-5 minutes
echo.

set NEXT_PUBLIC_BASE_URL=%PRODUCTION_URL%
node scripts\test-load.js

echo.
echo ========================================================================
echo LOAD TESTS COMPLETED
echo ========================================================================
echo.

REM ============================================================================
echo [3/3] SECURITY TESTS (30+ tests)
echo ========================================================================
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
