/**
 * CSRF Protection Utility
 * Simple CSRF token generation and validation
 * Protects against Cross-Site Request Forgery attacks
 */

import { cookies } from 'next/headers';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_LENGTH = 32;

/**
 * Generate a random CSRF token
 */
function generateToken(): string {
  const array = new Uint8Array(TOKEN_LENGTH);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Node.js environment
    const crypto = require('crypto');
    return crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token
 * Used server-side to generate token for forms
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!token) {
    token = generateToken();
    cookieStore.set(CSRF_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
  }

  return token;
}

/**
 * Validate CSRF token from request
 * Used in API routes to verify token
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Get token from cookie
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  // Both must exist and match
  if (!headerToken || !cookieToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(headerToken, cookieToken);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks by always comparing full strings
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF protection middleware for API routes
 * Call this at the beginning of your POST/PUT/DELETE handlers
 */
export async function requireCsrfToken(request: Request): Promise<Response | null> {
  const isValid = await validateCsrfToken(request);

  if (!isValid) {
    return new Response(
      JSON.stringify({
        error: 'CSRF token validation failed',
        message: 'Invalid or missing CSRF token',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null; // No error, continue
}

/**
 * Client-side helper to get CSRF token from cookie
 */
export function getCsrfTokenClient(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(new RegExp('(^| )' + CSRF_TOKEN_NAME + '=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Refresh CSRF token
 * Call this after login/logout to get fresh token
 */
export async function refreshCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = generateToken();

  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return token;
}
