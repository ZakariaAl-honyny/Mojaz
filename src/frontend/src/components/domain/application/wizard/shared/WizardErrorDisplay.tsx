'use client';

import React from 'react';
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface WizardErrorDisplayProps {
  error: any;
  onRetry: () => void;
  errorMessage?: string;
  retryLabel?: string;
}

export default function WizardErrorDisplay({
  error,
  onRetry,
  errorMessage = 'حدث خطأ تقني غير متوقع في معالجة البيانات السيادية.',
  retryLabel = 'إعادة محاولة الاتصال بالنظام المركزي'
}: WizardErrorDisplayProps) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      role="alert"
      className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/10 mb-12 font-arabic shadow-2xl shadow-red-500/5 relative overflow-hidden"
      dir="rtl"
    >
      {/* Institutional Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-red-500/10 flex items-center justify-center rounded-[1.5rem] shadow-inner">
             <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
          <div className="space-y-1">
             <span className="text-[10px] font-black text-red-600/40 uppercase tracking-[0.4em]">تنبيه النظام المركزي</span>
             <p className="text-xl font-black text-red-900 leading-tight">
               {errorMessage}
             </p>
             <p className="text-xs font-bold text-red-600/60 capitalize">كود الخطأ المرجعي: {error?.code || 'ERR_SOVEREIGN_TIMEOUT'}</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            onRetry();
          }}
          className="h-16 px-10 rounded-2xl bg-white border-red-500/20 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 font-black transition-all duration-700 w-full md:w-auto shadow-sm group"
        >
          <RefreshCw className="w-5 h-5 ml-3 group-hover:rotate-180 transition-transform duration-700" />
          {retryLabel}
        </Button>
      </div>
    </motion.div>
  );
}
