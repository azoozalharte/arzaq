"use client";

import { useState } from "react";
import { HelpCircle, ArrowLeft, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MissingSkill {
  name: string;
  importance: "required" | "preferred";
}

interface SkillAnswer {
  skill: string;
  hasSkill: boolean;
  yearsOfExperience?: number;
}

interface SkillsQuestionnaireProps {
  missingSkills: MissingSkill[];
  onComplete: (answers: SkillAnswer[]) => void;
  isLoading: boolean;
}

export default function SkillsQuestionnaire({
  missingSkills,
  onComplete,
  isLoading,
}: SkillsQuestionnaireProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SkillAnswer[]>([]);
  const [hasCurrentSkill, setHasCurrentSkill] = useState<boolean | null>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(1);

  const currentSkill = missingSkills[currentIndex];
  const isLastSkill = currentIndex === missingSkills.length - 1;
  const progress = ((currentIndex + 1) / missingSkills.length) * 100;

  const handleSkillAnswer = (hasSkill: boolean) => {
    setHasCurrentSkill(hasSkill);
    if (!hasSkill) {
      // Move to next skill immediately if they don't have it
      proceedToNext(hasSkill, undefined);
    }
  };

  const proceedToNext = (hasSkill: boolean, years?: number) => {
    const newAnswer: SkillAnswer = {
      skill: currentSkill.name,
      hasSkill,
      yearsOfExperience: years,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (isLastSkill) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
      setHasCurrentSkill(null);
      setYearsOfExperience(1);
    }
  };

  const handleYearsSubmit = () => {
    proceedToNext(true, yearsOfExperience);
  };

  if (missingSkills.length === 0) {
    // No missing skills, proceed directly
    onComplete([]);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">أسئلة سريعة</h2>
        <p className="text-muted mt-2">
          نحتاج بعض المعلومات لتحسين سيرتك الذاتية
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>السؤال {currentIndex + 1} من {missingSkills.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          {hasCurrentSkill === null ? (
            // Ask if they have the skill
            <>
              <div className="text-center mb-6">
                <span className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium mb-4
                  ${currentSkill.importance === "required"
                    ? "bg-error/10 text-error"
                    : "bg-warning/10 text-warning"}
                `}>
                  {currentSkill.importance === "required" ? "مطلوب" : "مفضل"}
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  هل لديك خبرة في:
                </h3>
                <p className="text-2xl font-bold text-primary mt-2">
                  {currentSkill.name}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSkillAnswer(true)}
                  className="
                    flex items-center gap-2 px-8 py-4
                    bg-secondary hover:bg-secondary-light
                    text-white font-medium rounded-xl
                    transition-all duration-300
                  "
                >
                  <Check className="w-5 h-5" />
                  <span>نعم</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSkillAnswer(false)}
                  className="
                    flex items-center gap-2 px-8 py-4
                    bg-border hover:bg-muted/20
                    text-foreground font-medium rounded-xl
                    transition-all duration-300
                  "
                >
                  <X className="w-5 h-5" />
                  <span>لا</span>
                </motion.button>
              </div>
            </>
          ) : (
            // Ask for years of experience
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  كم سنة خبرة لديك في:
                </h3>
                <p className="text-2xl font-bold text-primary mt-2">
                  {currentSkill.name}
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setYearsOfExperience(Math.max(1, yearsOfExperience - 1))}
                    className="w-12 h-12 rounded-full bg-border hover:bg-muted/20 flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-primary">
                      {yearsOfExperience}
                    </span>
                    <span className="text-muted mr-2">
                      {yearsOfExperience === 1 ? "سنة" : "سنوات"}
                    </span>
                  </div>
                  <button
                    onClick={() => setYearsOfExperience(yearsOfExperience + 1)}
                    className="w-12 h-12 rounded-full bg-border hover:bg-muted/20 flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap justify-center">
                  {[1, 2, 3, 5, 7, 10].map((year) => (
                    <button
                      key={year}
                      onClick={() => setYearsOfExperience(year)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${yearsOfExperience === year
                          ? "bg-primary text-white"
                          : "bg-border hover:bg-muted/20 text-foreground"}
                      `}
                    >
                      {year}+
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleYearsSubmit}
                  disabled={isLoading}
                  className="
                    flex items-center gap-2 px-8 py-4
                    bg-primary hover:bg-primary-light
                    text-white font-medium rounded-xl
                    transition-all duration-300
                  "
                >
                  <span>{isLastSkill ? "إنهاء" : "التالي"}</span>
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
