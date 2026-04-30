'use client';

import { useState } from 'react';
import { PreferencesForm } from '@/components/domain/user/PreferencesForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, ShieldCheck, UserCog, Settings, BellRing, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotificationPreferences {
  enableEmail: boolean;
  enableSms: boolean;
  enablePush: boolean;
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // In a real app, these would come from the API
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableEmail: true,
    enableSms: true,
    enablePush: true
  });

  const handleSavePreferences = async (newPreferences: NotificationPreferences) => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setPreferences(newPreferences);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-10 font-arabic pb-16" dir="rtl">
      {/* Institutional Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 px-4">
         <div className="flex items-center gap-6">
            <div className="w-1.5 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-3">
                مركز التحكم والسيادة
              </h1>
              <p className="text-neutral-500 font-bold text-sm max-w-xl leading-relaxed">
                إدارة الهوية الرقمية وتفضيلات الأمن والتنبيهات الخاصة بحسابك الرسمي.
              </p>
            </div>
         </div>

         {saveSuccess && (
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl shadow-xl shadow-emerald-900/5 transition-all"
           >
             <CheckCircle2 className="w-5 h-5" />
             <span className="text-sm font-black">تمت مزامنة التفضيلات بنجاح</span>
           </motion.div>
         )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
         {/* Sidebar Controls */}
         <div className="lg:col-span-1 space-y-6">
            <Card className="border border-neutral-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
               <CardContent className="p-4 space-y-2">
                  {[
                    { label: 'الأمن والتنبيهات', icon: BellRing, active: true },
                    { label: 'الهوية الرقمية', icon: UserCog, active: false },
                    { label: 'الخصوصية والسيادة', icon: ShieldCheck, active: false },
                    { label: 'إدارة الجلسات', icon: Lock, active: false },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest",
                        item.active 
                          ? "bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/10" 
                          : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
               </CardContent>
            </Card>

            <div className="bg-[#D4A017]/5 border border-[#D4A017]/20 rounded-[2.5rem] p-8 space-y-4">
               <div className="w-12 h-12 bg-[#D4A017]/10 rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-[#D4A017]" />
               </div>
               <h4 className="font-black text-[#D4A017] text-lg tracking-tight">نصيحة أمنية</h4>
               <p className="text-xs font-bold text-[#D4A017]/70 leading-relaxed">
                  احرص دائماً على تفعيل كافة قنوات التنبيه لضمان استلام إشعارات الأمان الفورية في حال حدوث أي محاولة دخول لحسابك.
               </p>
            </div>
         </div>

         {/* Main Settings Content */}
         <div className="lg:col-span-2">
            <PreferencesForm
              initialPreferences={preferences}
              onSave={handleSavePreferences}
            />
         </div>
      </div>

      <div className="flex justify-center pt-8 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">إدارة أمن المعلومات - مركز التحقق والاستجابة</span>
         </div>
      </div>
    </div>
  );
}