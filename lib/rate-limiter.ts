import { Redis } from "@upstash/redis";

// Initialize Redis client (will be undefined if env vars are not set)
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.warn("Redis not configured, using fallback rate limiting");
}

const RATE_LIMIT_DURATION = 2 * 60 * 60; // 2 hours in seconds

// TODO: Set to false when you want to enable rate limiting
const DISABLE_RATE_LIMIT = true;

// In-memory fallback for development
const memoryStore = new Map<string, number>();

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remainingTime: number;
}> {
  // Skip rate limiting during development
  if (DISABLE_RATE_LIMIT) {
    return { allowed: true, remainingTime: 0 };
  }

  const key = `ratelimit:${ip}`;
  const now = Math.floor(Date.now() / 1000);

  if (redis) {
    try {
      const lastUsed = await redis.get<number>(key);

      if (lastUsed) {
        const elapsed = now - lastUsed;
        if (elapsed < RATE_LIMIT_DURATION) {
          return {
            allowed: false,
            remainingTime: RATE_LIMIT_DURATION - elapsed,
          };
        }
      }

      return { allowed: true, remainingTime: 0 };
    } catch (error) {
      console.error("Redis error:", error);
      // Fall through to memory store
    }
  }

  // Fallback to memory store
  const lastUsed = memoryStore.get(key);
  if (lastUsed) {
    const elapsed = now - lastUsed;
    if (elapsed < RATE_LIMIT_DURATION) {
      return {
        allowed: false,
        remainingTime: RATE_LIMIT_DURATION - elapsed,
      };
    }
  }

  return { allowed: true, remainingTime: 0 };
}

export async function recordUsage(ip: string): Promise<void> {
  const key = `ratelimit:${ip}`;
  const now = Math.floor(Date.now() / 1000);

  if (redis) {
    try {
      await redis.set(key, now, { ex: RATE_LIMIT_DURATION });
      return;
    } catch (error) {
      console.error("Redis error:", error);
      // Fall through to memory store
    }
  }

  // Fallback to memory store
  memoryStore.set(key, now);
}

export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback
  return "127.0.0.1";
}
