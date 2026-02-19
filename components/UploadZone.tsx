"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function UploadZone({ onFileSelect, isLoading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (file.type !== "application/pdf") {
      setError("يرجى رفع ملف PDF فقط");
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("حجم الملف يجب أن يكون أقل من 10 ميجابايت");
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label
          htmlFor="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative flex flex-col items-center justify-center w-full h-64
            border-2 border-dashed rounded-2xl cursor-pointer
            transition-all duration-300 ease-out
            ${isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
            }
            ${isLoading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="hidden"
            disabled={isLoading}
          />

          <AnimatePresence mode="wait">
            {selectedFile && !error ? (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  transition-colors duration-300
                  ${isDragging ? "bg-primary/10" : "bg-border/50"}
                `}>
                  <Upload className={`
                    w-8 h-8 transition-colors duration-300
                    ${isDragging ? "text-primary" : "text-muted"}
                  `} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    اسحب ملف PDF هنا
                  </p>
                  <p className="text-sm text-muted mt-1">
                    أو اضغط للاختيار من جهازك
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>PDF</span>
                  <span className="w-1 h-1 bg-muted rounded-full"></span>
                  <span>حتى 10 ميجابايت</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </label>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
