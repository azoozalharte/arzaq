import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { analyzeJobMatch, rewriteResumeForJob, SkillAnswer } from "@/lib/openai";
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
    const jobDescription = formData.get("jobDescription") as string | null;
    const skillAnswersJson = formData.get("skillAnswers") as string | null;

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
    if (action === "compare") {
      // Compare resume with job description
      if (!jobDescription) {
        return NextResponse.json(
          { error: "Job description is required for comparison" },
          { status: 400 }
        );
      }

      const jobAnalysis = await analyzeJobMatch(resumeText, jobDescription);
      return NextResponse.json({
        jobAnalysis,
        resumeText // Return resume text for later use
      });
    } else if (action === "rewrite-for-job") {
      // Rewrite resume tailored for the job
      if (!jobDescription) {
        return NextResponse.json(
          { error: "Job description is required" },
          { status: 400 }
        );
      }

      const skillAnswers: SkillAnswer[] = skillAnswersJson
        ? JSON.parse(skillAnswersJson)
        : [];

      const resumeData = await rewriteResumeForJob(resumeText, jobDescription, skillAnswers);

      // Record usage after successful rewrite
      await recordUsage(ip);

      return NextResponse.json({ resumeData });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'compare' or 'rewrite-for-job'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing job comparison:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
