"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShieldAlert, History } from "lucide-react";
import { motion } from "framer-motion";

interface ExistingApplicationBannerProps {
  applicationNumber: string;
  status: string | number;
}

export function ExistingApplicationBanner({
  applicationNumber,
  status,
}: ExistingApplicationBannerProps) {
  const router = useRouter();
  const { resetWizard } = useWizardStore();

  const handleViewApplication = () => {
    resetWizard();
    router.push(`/applications/${applicationNumber}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className="max-w-3xl mx-auto mt-12 border border-blue-50 bg-white shadow-[0_40px_100px_-20px_rgba(26,58,143,0.12)] rounded-[4rem] overflow-hidden font-arabic relative" dir="rtl">
        {/* Institutional Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a3a8f]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="text-center pb-6 pt-16 relative z-10">
          <div className="mx-auto mb-10 w-24 h-24 rounded-[2rem] bg-[#1a3a8f]/5 flex items-center justify-center shadow-inner group relative">
            <ShieldAlert className="w-12 h-12 text-[#1a3a8f] relative z-20" />
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-[#1a3a8f]/10 rounded-[2rem] -z-10" 
            />
          </div>
          <CardTitle className="text-3xl font-black text-neutral-900 tracking-tight">
             لديك معاملة سيادية قائمة مسبقاً
          </CardTitle>
          <p className="text-sm font-black text-[#1a3a8f]/40 uppercase tracking-[0.4em] mt-2">نظام التحقق من التعددية</p>
        </CardHeader>

        <CardContent className="text-center space-y-12 pb-20 px-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto bg-neutral-50/50 p-8 rounded-[2.5rem] border border-neutral-100">
             <div className="space-y-1 flex flex-col items-center">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3 h-3" />
                    رقم المعاملة
                </span>
                <p className="text-2xl font-black text-[#1a3a8f] tracking-tighter">{applicationNumber}</p>
             </div>
             <div className="space-y-1 flex flex-col items-center">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">المرحلة الحالية</span>
                <div className="px-5 py-1.5 rounded-full bg-[#1a3a8f] text-white text-[11px] font-black shadow-lg shadow-blue-900/20">
                   {status}
                </div>
             </div>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
              <p className="text-neutral-500 font-bold leading-relaxed text-lg">
                عذراً، تمنع الأنظمة السيادية فتح أكثر من معاملة واحدة لنفس المتقدم في آن واحد. يرجى المتابعة عبر رقم المعاملة المسجل أعلاه.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    onClick={handleViewApplication}
                    className="h-16 px-12 rounded-2xl bg-[#1a3a8f] text-white font-black hover:bg-blue-900 shadow-2xl shadow-blue-900/30 transition-all duration-700 hover:scale-105 group relative overflow-hidden flex-1 sm:flex-none min-w-[240px]"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                        متابعة معالجة الطلب القائم
                        <ArrowLeft className="w-5 h-5 transition-transform duration-700 group-hover:-translate-x-2" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="h-16 px-10 rounded-2xl text-neutral-400 font-black hover:bg-neutral-100 transition-all duration-700"
                  >
                    العودة للرئيسية
                  </Button>
              </div>
          </div>
        </CardContent>

        {/* Security Footer Accent */}
        <div className="h-2 bg-gradient-to-r from-transparent via-[#1a3a8f]/20 to-transparent" />
      </Card>
    </motion.div>
  );
}
