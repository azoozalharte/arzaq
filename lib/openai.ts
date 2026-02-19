import OpenAI from "openai";

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface ResumeAnalysis {
  strengths: string[];
  improvements: string[];
}

export interface ResumeData {
  fullName: string;
  title: string;
  summary: string;
  experience: {
    company: string;
    position: string;
    duration: string;
    achievements: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
  contact: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert resume analyst. Analyze the given resume and provide:
1. 3-5 key strengths
2. 3-5 areas for improvement

Respond in Arabic. Be specific and actionable in your feedback.
Format your response as JSON with this structure:
{
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}`
      },
      {
        role: "user",
        content: `Analyze this resume:\n\n${resumeText}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as ResumeAnalysis;
}

export async function rewriteResume(resumeText: string): Promise<ResumeData> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer. Rewrite the given resume in professional English.

IMPORTANT RULES:
1. Only include information that exists in the original resume
2. NEVER use placeholder text like "Not Provided", "N/A", "Unknown", etc.
3. If a date/year is not available, use an empty string ""
4. If contact info is not available, use an empty string ""
5. Make content ATS-friendly with strong action verbs
6. Quantify achievements where possible

Extract and enhance:
- Full name
- Professional title
- Professional summary (2-3 compelling sentences)
- Work experience with quantified achievements
- Education
- Skills

Respond with JSON in this exact structure:
{
  "fullName": "Full Name",
  "title": "Professional Title",
  "summary": "Professional summary paragraph",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Start - End or empty string if not available",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "year": "Year or empty string if not available"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "contact": {
    "email": "email or empty string",
    "phone": "phone or empty string",
    "location": "location or empty string"
  }
}`
      },
      {
        role: "user",
        content: `Rewrite this resume professionally:\n\n${resumeText}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as ResumeData;
}

export interface JobAnalysis {
  missingSkills: {
    name: string;
    importance: "required" | "preferred";
  }[];
  matchingSkills: string[];
  irrelevantSkills: string[];
}

export interface SkillAnswer {
  skill: string;
  hasSkill: boolean;
  yearsOfExperience?: number;
}

export async function analyzeJobMatch(
  resumeText: string,
  jobDescription: string
): Promise<JobAnalysis> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert career advisor and resume analyst. Analyze the resume against the job description.

Your task:
1. Identify skills mentioned in the job description that are NOT in the resume (missingSkills)
2. Identify skills that match between the resume and job description (matchingSkills)
3. Identify skills in the resume that are NOT relevant to this specific job (irrelevantSkills)

For missing skills, categorize them as:
- "required": Skills that are mandatory or essential for the role
- "preferred": Skills that are nice-to-have or preferred

Be thorough and specific. Focus on technical skills, tools, technologies, and methodologies.

Respond in JSON format:
{
  "missingSkills": [
    {"name": "Skill Name", "importance": "required" | "preferred"}
  ],
  "matchingSkills": ["Skill 1", "Skill 2"],
  "irrelevantSkills": ["Skill that doesn't match job", ...]
}`
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`
      }
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as JobAnalysis;
}

export async function rewriteResumeForJob(
  resumeText: string,
  jobDescription: string,
  skillAnswers: SkillAnswer[]
): Promise<ResumeData> {
  // Build the skills context from user answers
  const confirmedSkills = skillAnswers
    .filter(a => a.hasSkill)
    .map(a => `${a.skill} (${a.yearsOfExperience} years experience)`)
    .join(", ");

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer specializing in ATS-optimized resumes. Rewrite the given resume to be tailored for the specific job.

IMPORTANT RULES:
1. Only include information that exists in the original resume OR confirmed skills provided
2. NEVER use placeholder text like "Not Provided", "N/A", "Unknown", etc.
3. If a date/year is not available, use an empty string ""
4. Make content ATS-friendly with strong action verbs
5. Quantify achievements where possible
6. REMOVE any skills from the resume that are NOT relevant to this specific job
7. ADD the confirmed skills the user has, integrating them naturally
8. Tailor the professional summary to match the job requirements
9. Reorder skills to prioritize those most relevant to the job

Confirmed additional skills from the applicant: ${confirmedSkills || "None"}

Extract and enhance:
- Full name
- Professional title (adjust to be more relevant to the target job)
- Professional summary (tailored to the job, 2-3 compelling sentences)
- Work experience with quantified achievements
- Education
- Skills (only job-relevant skills, ordered by relevance)

Respond with JSON in this exact structure:
{
  "fullName": "Full Name",
  "title": "Professional Title",
  "summary": "Professional summary paragraph tailored to the job",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Start - End or empty string if not available",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "year": "Year or empty string if not available"
    }
  ],
  "skills": ["Most Relevant Skill", "Second Most Relevant", ...],
  "contact": {
    "email": "email or empty string",
    "phone": "phone or empty string",
    "location": "location or empty string"
  }
}`
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nOriginal Resume:\n${resumeText}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as ResumeData;
}

export { getOpenAI };
