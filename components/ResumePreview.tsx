"use client";

import { Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

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

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownload: () => void;
  onStartOver: () => void;
  isDownloading: boolean;
}

// Helper function to check if a value is valid
const isValidValue = (value: string | undefined): boolean => {
  if (!value || value.trim() === "") return false;
  const placeholders = [
    "not provided",
    "not available",
    "n/a",
    "unknown",
    "none",
  ];
  return !placeholders.some((p) => value.toLowerCase().includes(p));
};

export default function ResumePreview({
  resumeData,
  onDownload,
  onStartOver,
  isDownloading,
}: ResumePreviewProps) {
  const contactParts = [
    resumeData.contact.email,
    resumeData.contact.phone,
    resumeData.contact.location,
  ].filter((item) => isValidValue(item));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">سيرتك الذاتية المحسّنة</h2>
        <p className="text-muted mt-2">
          تم إعادة كتابة سيرتك الذاتية بشكل احترافي متوافق مع ATS
        </p>
      </div>

      {/* Resume Preview Card - Clean ATS-friendly design */}
      <div className="bg-white border border-gray-300 shadow-lg overflow-hidden" dir="ltr">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-black uppercase tracking-wide">
            {resumeData.fullName}
          </h3>
          <p className="text-gray-600 mt-2 text-lg">{resumeData.title}</p>
          {contactParts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-600">
              {contactParts.map((item, index) => (
                <span key={index}>
                  {item}
                  {index < contactParts.length - 1 && <span className="mx-2">|</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 text-left">
          {/* Summary */}
          {isValidValue(resumeData.summary) && (
            <div>
              <h4 className="text-sm font-bold text-black uppercase tracking-wide border-b border-black pb-2 mb-4">
                Professional Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-black uppercase tracking-wide border-b border-black pb-2 mb-4">
                Professional Experience
              </h4>
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-black text-base">{exp.position}</p>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      {isValidValue(exp.duration) && (
                        <span className="text-sm text-gray-600">{exp.duration}</span>
                      )}
                    </div>
                    {exp.achievements && exp.achievements.filter(isValidValue).length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {exp.achievements.filter(isValidValue).map((achievement, i) => (
                          <li key={i} className="text-gray-700 flex items-start gap-3">
                            <span className="text-black mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-black uppercase tracking-wide border-b border-black pb-2 mb-4">
                Education
              </h4>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-bold text-black">{edu.degree}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    {isValidValue(edu.year) && (
                      <span className="text-sm text-gray-600">{edu.year}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.filter(isValidValue).length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-black uppercase tracking-wide border-b border-black pb-2 mb-4">
                Skills
              </h4>
              <p className="text-gray-700">
                {resumeData.skills.filter(isValidValue).join("  •  ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownload}
          disabled={isDownloading}
          className="
            flex items-center justify-center gap-2 px-8 py-4
            bg-secondary hover:bg-secondary-light
            text-white font-medium rounded-xl
            transition-all duration-300
            hover:shadow-lg hover:shadow-secondary/20
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
              <span>جاري التحميل...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>تحميل PDF</span>
            </>
          )}
        </motion.button>

        <button
          onClick={onStartOver}
          className="
            flex items-center justify-center gap-2 px-8 py-4
            bg-card hover:bg-border/50
            text-foreground font-medium rounded-xl
            border border-border
            transition-all duration-300
          "
        >
          <RefreshCw className="w-5 h-5" />
          <span>البدء من جديد</span>
        </button>
      </div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted">
          يمكنك تحسين سيرة ذاتية جديدة بعد ساعتين
        </p>
      </motion.div>
    </motion.div>
  );
}
