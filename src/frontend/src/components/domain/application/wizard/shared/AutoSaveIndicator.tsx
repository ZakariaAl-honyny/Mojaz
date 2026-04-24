'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { Loader2, History, CloudOff, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AutoSaveIndicator() {
  const { lastSavedAt, isSaving, consecutiveSaveFailures } = useWizardStore();

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'الآن';
    if (minutes === 1) return 'منذ دقيقة واحدة';
    if (minutes < 11) return `منذ ${minutes} دقائق`;
    
    return new Date(date).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const lastSaved = formatLastSaved(lastSavedAt);

  return (
    <div className="font-arabic h-full flex items-center" dir="rtl">
      <AnimatePresence mode="wait">
        {consecutiveSaveFailures >= 3 ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 px-6 py-2 rounded-full bg-red-500/5 text-red-600 border border-red-500/10 animate-pulse"
          >
            <CloudOff className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">تعذر التزامن الآلي - تحقق من الشبكة</span>
          </motion.div>
        ) : isSaving ? (
          <motion.div 
            key="saving"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 text-[#1a3a8f]/60 bg-[#1a3a8f]/5 px-6 py-2 rounded-full border border-[#1a3a8f]/10"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">جاري تشفير وحفظ المسودة...</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div 
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 text-neutral-400 group cursor-default transition-all duration-700 hover:text-[#1a3a8f]"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center transition-all group-hover:bg-[#1a3a8f]/5 group-hover:scale-110">
                <BookmarkCheck className="w-4 h-4 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-[9px] font-black text-[#1a3a8f]/40 uppercase tracking-[0.4em]">الحالة: تم الحفظ</span>
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">آخر تزامن سحابي: {lastSaved}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-neutral-300 opacity-50"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">بانتظار التزامن الأول...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}