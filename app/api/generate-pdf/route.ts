import { NextRequest, NextResponse } from "next/server";

// We'll use a simpler approach - generate PDF on the client side
// This endpoint just validates the data structure

export async function POST(request: NextRequest) {
  try {
    const { resumeData } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: "No resume data provided" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ["fullName", "title", "summary"];
    for (const field of requiredFields) {
      if (!resumeData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Return validated data
    return NextResponse.json({
      success: true,
      resumeData,
    });
  } catch (error) {
    console.error("Error validating resume data:", error);
    return NextResponse.json(
      { error: "Failed to validate resume data" },
      { status: 500 }
    );
  }
}
