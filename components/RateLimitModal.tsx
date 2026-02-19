"use client";

import { Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingTime: number; // in seconds
}

export default function RateLimitModal({
  isOpen,
  onClose,
  remainingTime,
}: RateLimitModalProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    setTimeLeft(remainingTime);
  }, [remainingTime]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, onClose]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                انتظر قليلاً
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-border/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-warning" />
              </div>

              <p className="text-foreground mb-2">
                لقد استخدمت الخدمة مؤخراً
              </p>
              <p className="text-muted text-sm mb-6">
                يمكنك تحسين سيرة ذاتية واحدة كل ساعتين
              </p>

              {/* Timer */}
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-muted mb-2">الوقت المتبقي</p>
                <p className="text-4xl font-bold text-primary font-mono">
                  {formatTime(timeLeft)}
                </p>
              </div>

              <p className="text-xs text-muted mt-4">
                سيتم تحديث الصفحة تلقائياً عند انتهاء الوقت
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={onClose}
                className="w-full py-3 bg-border/50 hover:bg-border text-foreground font-medium rounded-xl transition-colors"
              >
                حسناً، فهمت
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
