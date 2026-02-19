"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import UploadZone from "@/components/UploadZone";
import LoadingState from "@/components/LoadingState";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import SkillsQuestionnaire from "@/components/SkillsQuestionnaire";
import ResumePreview from "@/components/ResumePreview";
import RateLimitModal from "@/components/RateLimitModal";
import { generatePDF, downloadPDF } from "@/lib/pdf-generator";

type Stage =
  | "landing"
  | "upload"
  | "extracting"
  | "job-description"
  | "comparing"
  | "skills-questionnaire"
  | "rewriting"
  | "preview";

interface ResumeData {
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

interface MissingSkill {
  name: string;
  importance: "required" | "preferred";
}

interface SkillAnswer {
  skill: string;
  hasSkill: boolean;
  yearsOfExperience?: number;
}

interface JobAnalysis {
  missingSkills: MissingSkill[];
  matchingSkills: string[];
  irrelevantSkills: string[];
}

const LOCAL_STORAGE_KEY = "arzaq_last_usage";
const RATE_LIMIT_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Rate limiting enabled for production
const DISABLE_RATE_LIMIT = false;

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [skillAnswers, setSkillAnswers] = useState<SkillAnswer[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const uploadRef = useRef<HTMLDivElement>(null);

  // Check rate limit on mount
  useEffect(() => {
    checkLocalRateLimit();
  }, []);

  const checkLocalRateLimit = useCallback(() => {
    // Skip rate limiting during development
    if (DISABLE_RATE_LIMIT) {
      return true;
    }

    const lastUsage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastUsage) {
      const elapsed = Date.now() - parseInt(lastUsage, 10);
      if (elapsed < RATE_LIMIT_DURATION) {
        const remaining = Math.ceil((RATE_LIMIT_DURATION - elapsed) / 1000);
        setRemainingTime(remaining);
        return false;
      }
    }
    return true;
  }, []);

  const recordLocalUsage = useCallback(() => {
    // Skip recording during development
    if (DISABLE_RATE_LIMIT) {
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
  }, []);

  const handleStartClick = useCallback(() => {
    setStage("upload");
    // Smooth scroll to upload section
    setTimeout(() => {
      uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    // Check rate limit before processing
    if (!checkLocalRateLimit()) {
      setShowRateLimitModal(true);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setStage("extracting");

    // Brief loading animation, then move to job description input
    setTimeout(() => {
      setStage("job-description");
    }, 1000);
  }, [checkLocalRateLimit]);

  const handleJobDescriptionSubmit = useCallback(async (description: string | null) => {
    if (!file) return;

    setJobDescription(description);

    if (!description) {
      // Skip job analysis, go directly to general rewrite
      setStage("rewriting");

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("action", "rewrite");

        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "rate_limited") {
            setRemainingTime(data.remainingTime);
            setShowRateLimitModal(true);
            setStage("job-description");
            return;
          }
          throw new Error(data.error || "Failed to rewrite resume");
        }

        recordLocalUsage();
        setResumeData(data.resumeData);
        setStage("preview");
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setStage("job-description");
      }
    } else {
      // Analyze job description and compare with resume
      setStage("comparing");

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("action", "compare");
        formData.append("jobDescription", description);

        const response = await fetch("/api/compare-job", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "rate_limited") {
            setRemainingTime(data.remainingTime);
            setShowRateLimitModal(true);
            setStage("job-description");
            return;
          }
          throw new Error(data.error || "Failed to analyze job match");
        }

        setJobAnalysis(data.jobAnalysis);

        // If there are missing skills, show questionnaire
        if (data.jobAnalysis.missingSkills && data.jobAnalysis.missingSkills.length > 0) {
          setStage("skills-questionnaire");
        } else {
          // No missing skills, go directly to rewrite
          await handleSkillsComplete([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setStage("job-description");
      }
    }
  }, [file, recordLocalUsage]);

  const handleSkillsComplete = useCallback(async (answers: SkillAnswer[]) => {
    if (!file || !jobDescription) return;

    setSkillAnswers(answers);
    setStage("rewriting");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("action", "rewrite-for-job");
      formData.append("jobDescription", jobDescription);
      formData.append("skillAnswers", JSON.stringify(answers));

      const response = await fetch("/api/compare-job", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "rate_limited") {
          setRemainingTime(data.remainingTime);
          setShowRateLimitModal(true);
          setStage("skills-questionnaire");
          return;
        }
        throw new Error(data.error || "Failed to generate tailored resume");
      }

      recordLocalUsage();
      setResumeData(data.resumeData);
      setStage("preview");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setStage("skills-questionnaire");
    }
  }, [file, jobDescription, recordLocalUsage]);

  const handleDownload = useCallback(async () => {
    if (!resumeData) return;

    setIsDownloading(true);

    try {
      const blob = await generatePDF(resumeData);
      const filename = `${resumeData.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      downloadPDF(blob, filename);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  }, [resumeData]);

  const handleStartOver = useCallback(() => {
    setStage("landing");
    setFile(null);
    setJobDescription(null);
    setJobAnalysis(null);
    setSkillAnswers([]);
    setResumeData(null);
    setError(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isLoading = ["extracting", "comparing", "rewriting"].includes(stage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Landing Page */}
      {stage === "landing" && (
        <LandingPage onStartClick={handleStartClick} />
      )}

      {/* Main App Flow */}
      {stage !== "landing" && (
        <main
          ref={uploadRef}
          className="flex-1 flex flex-col items-center justify-center px-4 py-12 min-h-[80vh]"
        >
          <AnimatePresence mode="wait">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-center max-w-md"
              >
                {error}
              </motion.div>
            )}

            {/* Upload Stage */}
            {stage === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl text-center"
              >
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  ارفع سيرتك الذاتية
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  ارفع ملف PDF وسنقوم بتحليله وتحسينه باستخدام الذكاء الاصطناعي
                </p>
                <UploadZone onFileSelect={handleFileSelect} isLoading={isLoading} />
              </motion.div>
            )}

            {/* Loading - Extracting */}
            {stage === "extracting" && (
              <motion.div
                key="extracting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LoadingState stage="extracting" />
              </motion.div>
            )}

            {/* Job Description Input */}
            {stage === "job-description" && (
              <motion.div
                key="job-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <JobDescriptionInput
                  onSubmit={handleJobDescriptionSubmit}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {/* Loading - Comparing */}
            {stage === "comparing" && (
              <motion.div
                key="comparing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LoadingState stage="analyzing" />
              </motion.div>
            )}

            {/* Skills Questionnaire */}
            {stage === "skills-questionnaire" && jobAnalysis && (
              <motion.div
                key="skills-questionnaire"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SkillsQuestionnaire
                  missingSkills={jobAnalysis.missingSkills}
                  onComplete={handleSkillsComplete}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {/* Loading - Rewriting */}
            {stage === "rewriting" && (
              <motion.div
                key="rewriting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LoadingState stage="rewriting" />
              </motion.div>
            )}

            {/* Resume Preview */}
            {stage === "preview" && resumeData && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResumePreview
                  resumeData={resumeData}
                  onDownload={handleDownload}
                  onStartOver={handleStartOver}
                  isDownloading={isDownloading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-card">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted">
          <p>أرزاق - خدمة مجانية لتحسين السير الذاتية</p>
          <p className="mt-1">لا نقوم بحفظ أي بيانات - خصوصيتك مهمة لنا</p>
        </div>
      </footer>

      {/* Rate Limit Modal */}
      <RateLimitModal
        isOpen={showRateLimitModal}
        onClose={() => setShowRateLimitModal(false)}
        remainingTime={remainingTime}
      />
    </div>
  );
}
