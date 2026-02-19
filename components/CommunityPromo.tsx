"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Rocket, TrendingUp, Gift, ExternalLink, Sparkles } from "lucide-react";

interface CommunityPromoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityPromo({ isOpen, onClose }: CommunityPromoProps) {
  const handleJoinClick = () => {
    window.open("https://www.skool.com/diwan-automation-6064/about", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-gradient-to-br from-card to-background border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-full bg-border/50 hover:bg-border transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted" />
              </button>

              {/* Content */}
              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-secondary to-secondary-light rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary text-sm font-bold rounded-full mb-3">
                      مجاني 100%
                    </span>
                    <h2 className="text-2xl font-black text-foreground mb-2">
                      ديوان الأتمتة
                    </h2>
                    <p className="text-muted">
                      انضم لمجتمع المستقبل في الأتمتة والذكاء الاصطناعي
                    </p>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6"
                >
                  <p className="text-foreground text-sm leading-relaxed">
                    مجتمع مجاني نتعلم فيه مع بعض خطوة بخطوة، ونشارك الخبرات اللي تفتح أبواب دخل وفرص وظيفية مستقبلية.
                    <span className="text-primary font-semibold"> المجال ترند والموجة الأكبر قادمة!</span>
                  </p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  {[
                    { icon: Users, text: "مجتمع داعم ومتطور", color: "text-blue-500" },
                    { icon: TrendingUp, text: "رواتب تبدأ من 10K", color: "text-green-500" },
                    { icon: Rocket, text: "فرص وظيفية مستقبلية", color: "text-purple-500" },
                    { icon: Gift, text: "الانضمام مجاني", color: "text-orange-500" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl"
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <motion.button
                    onClick={handleJoinClick}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-secondary to-secondary-light text-white font-bold text-lg rounded-xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>انضم الآن مجاناً</span>
                    <ExternalLink className="w-5 h-5" />
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 text-muted hover:text-foreground font-medium transition-colors"
                  >
                    لاحقاً
                  </button>
                </motion.div>

                {/* Footer note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-xs text-muted mt-4"
                >
                  حياك الله معنا في ديوان الأتمتة 🚀
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
