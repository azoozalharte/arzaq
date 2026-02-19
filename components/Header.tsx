"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`
        sticky top-0 z-50 w-full transition-all duration-300
        ${scrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
        }
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary tracking-tight">أرزاق</h1>
            <p className="text-xs text-muted font-medium">حسّن سيرتك الذاتية بالذكاء الاصطناعي</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="text-secondary font-bold text-sm">مجاني ١٠٠٪</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
