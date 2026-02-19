"use client";

import { CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisResultProps {
  strengths: string[];
  improvements: string[];
  onContinue: () => void;
}

export default function AnalysisResult({
  strengths,
  improvements,
  onContinue,
}: AnalysisResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">نتائج التحليل</h2>
        <p className="text-muted mt-2">
          اكتشفنا نقاط القوة والتحسين في سيرتك الذاتية
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">نقاط القوة</h3>
          </div>
          <ul className="space-y-3">
            {strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0"></span>
                <span className="text-foreground">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">نقاط التحسين</h3>
          </div>
          <ul className="space-y-3">
            {improvements.map((improvement, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 bg-warning rounded-full mt-2 shrink-0"></span>
                <span className="text-foreground">{improvement}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={onContinue}
          className="
            flex items-center gap-2 px-8 py-4
            bg-primary hover:bg-primary-light
            text-white font-medium rounded-xl
            transition-all duration-300
            hover:shadow-lg hover:shadow-primary/20
            active:scale-[0.98]
          "
        >
          <span>متابعة لإعادة الكتابة</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}
