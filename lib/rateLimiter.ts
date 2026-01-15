/**
 * Rate Limiter Utility
 * Simple in-memory rate limiter for API endpoints
 * For production, consider Redis-based solution for distributed systems
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (will reset on server restart)
const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number; // max requests per interval
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.interval;

  // Get or create entry
  let entry = store[identifier];

  // Create new entry if doesn't exist or window expired
  if (!entry || entry.resetTime <= now) {
    entry = {
      count: 0,
      resetTime: now + config.interval,
    };
    store[identifier] = entry;
  }

  // Increment count
  entry.count++;

  // Calculate remaining
  const remaining = Math.max(0, config.uniqueTokenPerInterval - entry.count);

  // Check if limit exceeded
  const success = entry.count <= config.uniqueTokenPerInterval;

  return {
    success,
    limit: config.uniqueTokenPerInterval,
    remaining,
    reset: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or fallback to random ID
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (works with Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (ip) {
    return ip;
  }

  // Fallback: use user agent + accept language (not perfect but better than nothing)
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLanguage = request.headers.get('accept-language') || 'unknown';
  return `${userAgent}-${acceptLanguage}`;
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Public endpoints
  public: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 100, // 100 requests per minute
  },

  // Order creation (stricter)
  orders: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 orders per minute
  },

  // Search/filter operations
  search: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 50, // 50 searches per minute
  },

  // Admin operations
  admin: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 200, // 200 requests per minute
  },

  // Authentication attempts
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
  },
} as const;

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
