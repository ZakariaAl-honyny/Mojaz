"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Upload, CheckCircle2, ShieldCheck, FileText, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalVerificationFlowProps {
  applicationId: string;
  onComplete: () => void;
}

export function MedicalVerificationFlow({ applicationId, onComplete }: MedicalVerificationFlowProps) {
  const t = useTranslations("application.medical");
  const [step, setStep] = useState<"upload" | "processing" | "verified">("upload");
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setStep("processing");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep("verified"), 1500);
      }
    }, 100);
  };

  return (
    <Card className="gov-glass-panel rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
      <CardContent className="p-12">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary-600/20 rounded-[2rem] border border-primary-500/30 flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-10 h-10 text-primary-400" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                  {t("title") || "Medical Verification"}
                </h2>
                <p className="text-neutral-400 max-w-md mx-auto text-lg leading-relaxed">
                  {t("description") || "Your medical results must be electronically verified or manually uploaded from an approved center."}
                </p>
              </div>

              <div 
                className="relative group cursor-pointer"
                onClick={simulateUpload}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center gap-6 transition-all duration-500 group-hover:border-primary-500/50 group-hover:bg-white/10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:text-primary-400 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white mb-2">{t("uploadTitle") || "Upload Medical Report"}</p>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">PDF, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                <ShieldCheck className="w-6 h-6 text-primary-500 shrink-0" />
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {t("securityNotice") || "All medical data is encrypted and shared only with licensed government verification authorities."}
                </p>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 space-y-12 text-center"
            >
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="8" 
                  />
                  <motion.circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="url(#sovereign-gradient)" 
                    strokeWidth="8" 
                    strokeDasharray="283"
                    animate={{ strokeDashoffset: 283 - (283 * uploadProgress) / 100 }}
                  />
                  <defs>
                    <linearGradient id="sovereign-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span className="text-4xl font-black text-white">{uploadProgress}%</span>
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Validating</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white">{t("processingTitle") || "Authenticating Certificate"}</h3>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-xs font-black text-neutral-500 uppercase tracking-widest">
                    <Clock className="w-4 h-4 animate-spin" />
                    Checking ID Link
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="flex items-center gap-2 text-xs font-black text-neutral-500 uppercase tracking-widest">
                    <FileText className="w-4 h-4" />
                    Optical Parsing
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "verified" && (
            <motion.div 
              key="verified"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 space-y-12 text-center"
            >
              <div className="relative mx-auto w-32 h-32">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-full h-full bg-primary-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,108,53,0.4)]"
                >
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 border-2 border-primary-500 rounded-[2.5rem]" 
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tight">{t("verifiedTitle") || "Health Standards Met"}</h3>
                <p className="text-neutral-400 text-lg">{t("verifiedSub") || "Certificate MOJ-MED-99214 has been successfully validated."}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 {[
                   { label: "Vision", val: "Passed", icon: CheckCircle2 },
                   { label: "Blood", val: "A+", icon: CheckCircle2 },
                   { label: "General", val: "Fitness", icon: CheckCircle2 }
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2">
                      <item.icon className="w-5 h-5 text-primary-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{item.label}</span>
                      <span className="font-black text-white">{item.val}</span>
                   </div>
                 ))}
              </div>

              <Button 
                onClick={onComplete}
                className="h-16 px-12 rounded-[1.5rem] bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(0,108,53,0.3)] hover:scale-105 active:scale-95 transition-all w-full"
              >
                {t("continue") || "Proceed to Driving Test"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
