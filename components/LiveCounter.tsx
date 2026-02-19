"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";

interface LiveCounterProps {
  className?: string;
}

export default function LiveCounter({ className = "" }: LiveCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Fetch initial count
    fetchCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const response = await fetch("/api/counter");
      const data = await response.json();

      if (data.count !== count && count !== null) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }

      setCount(data.count);
    } catch (error) {
      console.error("Error fetching counter:", error);
    }
  };

  // Format number with Arabic-Indic numerals or commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString("ar-SA");
  };

  if (count === null) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-32 h-8 bg-border/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
    >
      <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border border-primary/10 rounded-2xl backdrop-blur-sm">
        {/* Icon */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          {/* Live indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
        </div>

        {/* Counter */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`text-3xl font-black text-primary tabular-nums ${
                  isAnimating ? "text-secondary" : ""
                }`}
              >
                {formatNumber(count)}
              </motion.span>
            </AnimatePresence>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-sm text-muted font-medium">
            سيرة ذاتية تم تحسينها
          </span>
        </div>
      </div>
    </motion.div>
  );
}
