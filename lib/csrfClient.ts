/**
 * CSRF Client Helper
 * Helper functions for client-side CSRF token handling
 */

let cachedToken: string | null = null;

/**
 * Fetch CSRF token from server
 * Caches the token for performance
 */
export async function fetchCsrfToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const response = await fetch('/api/csrf');
    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    cachedToken = data.token;
    return data.token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

/**
 * Create headers with CSRF token
 * Use this when making POST/PUT/DELETE requests
 */
export async function createCsrfHeaders(): Promise<HeadersInit> {
  const token = await fetchCsrfToken();

  return {
    'x-csrf-token': token,
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch with CSRF protection
 * Wrapper around fetch that automatically adds CSRF token
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method?.toUpperCase() || 'GET';

  // Only add CSRF token for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const token = await fetchCsrfToken();

    options.headers = {
      ...options.headers,
      'x-csrf-token': token,
    };
  }

  return fetch(url, options);
}

/**
 * Clear cached token
 * Call this after logout or when token expires
 */
export function clearCsrfToken(): void {
  cachedToken = null;
}
