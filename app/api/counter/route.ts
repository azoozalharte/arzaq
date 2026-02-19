import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Redis client
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.warn("Redis not configured for counter");
}

const COUNTER_KEY = "arzaq:resume_count";

// GET - Retrieve current count
export async function GET() {
  try {
    if (!redis) {
      // Return a default count if Redis is not configured
      return NextResponse.json({ count: 1247 });
    }

    const count = await redis.get<number>(COUNTER_KEY) || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting counter:", error);
    return NextResponse.json({ count: 0 });
  }
}

// POST - Increment counter
export async function POST() {
  try {
    if (!redis) {
      return NextResponse.json({ count: 1248 });
    }

    const newCount = await redis.incr(COUNTER_KEY);
    return NextResponse.json({ count: newCount });
  } catch (error) {
    console.error("Error incrementing counter:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
