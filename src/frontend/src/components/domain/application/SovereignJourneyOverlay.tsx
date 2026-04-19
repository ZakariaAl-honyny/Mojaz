"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MedicalVerificationFlow } from "./MedicalVerificationFlow";
import { TheoryTestSimulator } from "./TheoryTestSimulator";
import { X, ShieldIcon, Activity, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SovereignJourneyOverlayProps {
  type: "medical" | "theory";
  applicationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SovereignJourneyOverlay({ type, applicationId, onClose, onSuccess }: SovereignJourneyOverlayProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-950/90 backdrop-blur-3xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl"
      >
        <div className="absolute -top-20 left-0 right-0 flex justify-between items-center px-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/40">
                 {type === "medical" ? <Activity className="w-6 h-6 text-white" /> : <ClipboardCheck className="w-6 h-6 text-white" />}
              </div>
              <div className="text-start">
                 <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none mb-1">Active Sovereign Session</p>
                 <p className="text-xl font-black text-white uppercase tracking-tight">{type === "medical" ? "Internal Health Verification" : "Theory Examination"}</p>
              </div>
           </div>
           
           <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:rotate-90"
           >
              <X className="w-6 h-6" />
           </Button>
        </div>

        {type === "medical" ? (
          <MedicalVerificationFlow 
            applicationId={applicationId} 
            onComplete={onSuccess} 
          />
        ) : (
          <TheoryTestSimulator 
            onComplete={(score) => {
              if (score >= 2) onSuccess();
              else onClose();
            }} 
          />
        )}
      </motion.div>
    </div>
  );
}
