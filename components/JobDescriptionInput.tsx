"use client";

import { useState } from "react";
import { Briefcase, ArrowLeft, SkipForward } from "lucide-react";
import { motion } from "framer-motion";

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string | null) => void;
  isLoading: boolean;
}

export default function JobDescriptionInput({
  onSubmit,
  isLoading,
}: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = () => {
    onSubmit(jobDescription.trim() || null);
  };

  const handleSkip = () => {
    onSubmit(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">الوصف الوظيفي</h2>
        <p className="text-muted mt-2">
          أضف الوصف الوظيفي للوظيفة المستهدفة لتخصيص سيرتك الذاتية
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          الصق الوصف الوظيفي هنا
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="مثال: نبحث عن مطور برمجيات لديه خبرة في React و Node.js..."
          className="w-full h-48 p-4 border border-border rounded-xl bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          dir="auto"
        />
        <p className="text-xs text-muted mt-2">
          سنقوم بتحليل الوصف الوظيفي ومطابقة سيرتك الذاتية معه
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isLoading || !jobDescription.trim()}
          className="
            flex items-center justify-center gap-2 px-8 py-4
            bg-primary hover:bg-primary-light
            text-white font-medium rounded-xl
            transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          <span>تحليل ومطابقة</span>
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <button
          onClick={handleSkip}
          disabled={isLoading}
          className="
            flex items-center justify-center gap-2 px-8 py-4
            bg-card hover:bg-border/50
            text-foreground font-medium rounded-xl
            border border-border
            transition-all duration-300
            disabled:opacity-60
          "
        >
          <span>تخطي (تحسين عام)</span>
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
