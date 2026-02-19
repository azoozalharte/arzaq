"use client";

import { motion } from "framer-motion";

interface LoadingStateProps {
  stage: "extracting" | "analyzing" | "rewriting" | "generating";
}

const stageMessages = {
  extracting: "جاري قراءة سيرتك الذاتية...",
  analyzing: "جاري تحليل المحتوى...",
  rewriting: "جاري إعادة الكتابة باحترافية...",
  generating: "جاري إنشاء ملف PDF...",
};

const stageProgress = {
  extracting: 25,
  analyzing: 50,
  rewriting: 75,
  generating: 90,
};

export default function LoadingState({ stage }: LoadingStateProps) {
  const progress = stageProgress[stage];
  const message = stageMessages[stage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto text-center"
    >
      {/* Animated Icon */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <motion.div
          className="absolute inset-0 border-4 border-border rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-primary rounded-full"
          style={{ borderRightColor: "transparent", borderBottomColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
      </div>

      {/* Message */}
      <motion.p
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-medium text-foreground mb-4"
      >
        {message}
      </motion.p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Hint */}
      <p className="text-sm text-muted mt-6">
        نستخدم الذكاء الاصطناعي لتحسين سيرتك الذاتية
      </p>
    </motion.div>
  );
}
