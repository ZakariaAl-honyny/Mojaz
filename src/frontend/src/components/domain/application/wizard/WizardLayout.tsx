'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardStepIndicator from './WizardStepIndicator';
import { useWizardStore } from '@/stores/wizard-store';
import { AutoSaveIndicator } from './shared/AutoSaveIndicator';
import { cn } from '@/lib/utils';

interface WizardLayoutProps {
  children: React.ReactNode;
}

export default function WizardLayout({ children }: WizardLayoutProps) {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-4 sm:px-6 lg:px-8 font-arabic relative overflow-hidden" dir="rtl">
      {/* Sovereignty Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#1a3a8f]/5 to-transparent -z-10" />
      <div className="absolute top-[20%] -right-20 w-96 h-96 bg-[#1a3a8f]/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-16 relative">
        {/* Institutional Progress Architecture */}
        <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(26,58,143,0.08)] border border-white">
          <WizardStepIndicator />
        </div>

        {/* Master Stage Container */}
        <motion.main
          key={currentStep}
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white shadow-[0_40px_120px_-30px_rgba(26,58,143,0.12)] rounded-[4rem] border border-neutral-100/50 overflow-visible relative"
        >
          {/* Subtle Institutional Content Guard */}
          <div className="p-10 sm:p-20">
            {children}
          </div>
        </motion.main>

        {/* Institutional Feedback Loop */}
        <div className="flex justify-center pb-12">
            <AutoSaveIndicator />
        </div>
      </div>
    </div>
  );
}
