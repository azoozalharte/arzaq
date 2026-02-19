import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const { allowed, remainingTime } = await checkRateLimit(ip);

    return NextResponse.json({
      allowed,
      remainingTime,
    });
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return NextResponse.json(
      { allowed: true, remainingTime: 0 },
      { status: 200 }
    );
  }
}
