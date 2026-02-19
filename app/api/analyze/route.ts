import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { analyzeResume, rewriteResume } from "@/lib/openai";
import { checkRateLimit, recordUsage, getClientIP } from "@/lib/rate-limiter";

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const ip = getClientIP(request);
    const { allowed, remainingTime } = await checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "rate_limited",
          remainingTime
        },
        { status: 429 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const action = formData.get("action") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromPDF(buffer);

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the PDF" },
        { status: 400 }
      );
    }

    // Perform the requested action
    if (action === "analyze") {
      const analysis = await analyzeResume(resumeText);
      return NextResponse.json({ analysis });
    } else if (action === "rewrite") {
      const resumeData = await rewriteResume(resumeText);

      // Record usage after successful rewrite
      await recordUsage(ip);

      return NextResponse.json({ resumeData });
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
