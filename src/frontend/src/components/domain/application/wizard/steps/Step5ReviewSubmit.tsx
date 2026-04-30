'use client';

import { useWizardStore } from '@/stores/wizard-store';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileKey2, User, MapPin, CheckCircle2, ShieldCheck, Phone, CreditCard, History, Info, Mail, Fingerprint, Calendar, Globe, Clock, Stethoscope, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import applicationService from '@/services/application.service';
import { useQuery } from '@tanstack/react-query';
import WizardStepHeader from '../WizardStepHeader';
import { cn } from '@/lib/utils';
import { SERVICES_CONFIG } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export function Step5ReviewSubmit() {
  const { step1, step2, step3, step4, declarationAccepted, setDeclaration } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  const { data: centersData } = useQuery({
    queryKey: ['driving-centers'],
    queryFn: async () => {
      const response = await applicationService.getExamCenters();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const selectedCenter = centersData?.find((c: any) => c.id === step4.preferredCenterId);
  const selectedService = SERVICES_CONFIG.find(s => s.type === step1.serviceType);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 font-arabic" dir="rtl">
      <WizardStepHeader 
         title="مراجعة وتأكيد بيانات المعاملة"
         subtitle="يرجى مراجعة كافة البيانات المدخلة بعناية قبل الإرسال النهائي للنظام المركزي. التوقيع الرقمي مطلوب في نهاية الصفحة."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service Type Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-700 rounded-[2.5rem] overflow-hidden group">
              <CardContent className="p-10 flex items-start gap-8 relative">
                <div className="absolute top-0 end-0 w-40 h-40 bg-[#1a3a8f]/5 rounded-full -translate-y-20 translate-x-20 blur-3xl group-hover:bg-[#1a3a8f]/10 transition-colors" />
                <div className="p-6 rounded-2xl bg-[#1a3a8f]/5 text-[#1a3a8f] group-hover:bg-[#1a3a8f] group-hover:text-white transition-all duration-700 shadow-sm">
                  <FileKey2 className="w-8 h-8" />
                </div>
                <div className="relative space-y-2">
                  <p className="text-[10px] font-black text-[#1a3a8f]/40 uppercase tracking-[0.3em] mb-1">مسار الخدمة</p>
                  <p className="text-2xl font-black text-neutral-900 leading-tight">
                    {selectedService?.title || 'خدمة غير محددة'}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>اتصال مشفر وآمن</span>
                  </div>
                </div>
              </CardContent>
            </Card>
        </motion.div>

        {/* License Category Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-700 rounded-[2.5rem] overflow-hidden group">
              <CardContent className="p-10 flex items-start gap-8 relative">
                <div className="absolute top-0 end-0 w-40 h-40 bg-emerald-500/5 rounded-full -translate-y-20 translate-x-20 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                <div className="p-6 rounded-2xl bg-emerald-500/5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="relative space-y-2">
                  <p className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.3em] mb-1">فئة المعاملة</p>
                  <p className="text-2xl font-black text-neutral-900 leading-tight">
                    رخصة فئة ({step2.categoryCode})
                  </p>
                  <p className="text-xs font-bold text-neutral-400">مصنف وفق اللائحة الوطنية</p>
                </div>
              </CardContent>
            </Card>
        </motion.div>

        {/* Personal Profile Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
            <Card className="bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-700 rounded-[2.5rem] overflow-hidden group">
              <CardContent className="p-10 relative">
                <div className="flex items-center gap-6 mb-10 pb-6 border-b border-neutral-50">
                    <div className="p-5 rounded-2xl bg-blue-500/5 text-[#1a3a8f] shadow-sm">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-neutral-900">بيانات المتقدم الرسمية</h3>
                        <p className="text-sm font-bold text-neutral-400">ملخص الهوية الوطنية المسجل في المعاملة</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Fingerprint className="w-3.5 h-3.5" />
                        الرقم الوطني
                      </div>
                      <p className="text-xl font-black text-neutral-900">{step3.nationalId}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Calendar className="w-3.5 h-3.5" />
                        تاريخ الميلاد
                      </div>
                      <p className="text-xl font-black text-neutral-900">{step3.dateOfBirth}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Phone className="w-3.5 h-3.5" />
                        رقم التواصل
                      </div>
                      <p className="text-xl font-black text-neutral-900 lg:text-start">{step3.mobileNumber}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Mail className="w-3.5 h-3.5" />
                        البريد الإلكتروني
                      </div>
                      <p className="text-xl font-black text-neutral-900 truncate">{step3.email}</p>
                   </div>
                   <div className="space-y-2 lg:col-span-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <MapPin className="w-3.5 h-3.5" />
                        العنوان المسجل
                      </div>
                      <p className="text-xl font-black text-neutral-900 line-clamp-1">{step3.address}, {step3.city}, {step3.region}</p>
                   </div>
                </div>
              </CardContent>
            </Card>
        </motion.div>

        {/* Logistic & Preference Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="md:col-span-2">
            <Card className="bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-700 rounded-[2.5rem] overflow-hidden group">
              <CardContent className="p-10 relative">
                <div className="flex items-center gap-6 mb-10 pb-6 border-b border-neutral-50">
                    <div className="p-5 rounded-2xl bg-amber-500/5 text-amber-600 shadow-sm">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-neutral-900">تفضيلات الفحص والمركز</h3>
                        <p className="text-sm font-bold text-neutral-400">جدولة وتنسيق الاختبارات السيادية</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Building2 className="w-3.5 h-3.5" />
                        مركز الفحص المختار
                      </div>
                      <p className="text-xl font-black text-neutral-900">{selectedCenter?.nameAr || 'غير محدد'}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Globe className="w-3.5 h-3.5" />
                        لغة الاختبار
                      </div>
                      <p className="text-xl font-black text-neutral-900">{step4.testLanguage === 'ar' ? 'اللغة العربية' : 'English - الإنجليزية'}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                        <Clock className="w-3.5 h-3.5" />
                        توقيت الحضور المفضل
                      </div>
                      <p className="text-xl font-black text-neutral-900">
                        {
                          step4.appointmentPreference === 'Morning' ? 'الفترة الصباحية' :
                          step4.appointmentPreference === 'Afternoon' ? 'الفترة المسائية' :
                          step4.appointmentPreference === 'Evening' ? 'الفترة الليلية' : 'توقيت آلي'
                        }
                      </p>
                   </div>
                   {step4.specialNeedsDeclaration && (
                       <div className="space-y-2 lg:col-span-3 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                          <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2">
                            <Stethoscope className="w-4 h-4" />
                            ملاحظات المتطلبات الخاصة
                          </div>
                          <p className="text-lg font-bold text-amber-900/80 italic leading-relaxed">"{step4.specialNeedsNote}"</p>
                       </div>
                   )}
                </div>
              </CardContent>
            </Card>
        </motion.div>
      </div>

      {/* Sovereign Declaration */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="pt-16 border-t border-neutral-100">
        <div className={cn(
          "group relative flex items-start gap-8 p-12 rounded-[3.5rem] transition-all duration-1000",
          declarationAccepted 
            ? "bg-emerald-500/5 border border-emerald-500/10 shadow-2xl shadow-emerald-500/5" 
            : "bg-[#1a3a8f]/5 border border-[#1a3a8f]/10 shadow-inner"
        )}>
          {/* Decorative Corner Icon for Unchecked State */}
          {!declarationAccepted && (
              <div className="absolute top-10 end-12 text-[#1a3a8f] opacity-10 rotate-12 scale-[3] pointer-events-none">
                  <ShieldCheck className="w-16 h-16" />
              </div>
          )}

          <div className="relative z-10 pt-2">
              <Checkbox
                id="declaration"
                name="declaration"
                checked={declarationAccepted}
                onCheckedChange={(checked) => setDeclaration(checked === true)}
                className={cn(
                  "w-10 h-10 rounded-xl transition-all duration-700 border-2",
                  declarationAccepted 
                    ? "border-emerald-500 bg-emerald-500 data-[state=checked]:bg-emerald-600 shadow-2xl shadow-emerald-500/40 scale-110" 
                    : "border-[#1a3a8f]/20 bg-white data-[state=checked]:bg-[#1a3a8f] hover:border-[#1a3a8f]/40"
                )}
              />
          </div>
          
          <div className="space-y-4 relative z-10 cursor-pointer" onClick={() => setDeclaration(!declarationAccepted)}>
            <Label htmlFor="declaration" className="cursor-pointer text-2xl font-black text-neutral-900 select-none leading-none block">
              إقرار صحة المعلومات والالتزام بالقوانين السيادية
            </Label>
            <p className={cn(
              "text-lg font-bold leading-relaxed transition-colors duration-700 max-w-4xl",
              declarationAccepted ? "text-emerald-900/70" : "text-neutral-500"
            )}>
              أقر بصفتي المتقدم للمعاملة أن كافة البيانات الواردة أعلاه صحيحة ومطابقة للواقع، وأتحمل كامل المسؤولية القانونية والجنائية في حال ثبوت عدم دقة البيانات. كما أتعهد بالالتزام بكافة اللوائح والأنظمة الصادرة عن الإدارة العامة للمرور - الجمهورية اليمنية.
            </p>
          </div>
          
          <AnimatePresence>
              {declarationAccepted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    className="absolute top-10 end-12 shadow-2xl p-6 rounded-[2rem] bg-white text-emerald-500 transition-all duration-1000 border border-emerald-100"
                  >
                    <ShieldCheck className="w-12 h-12" />
                  </motion.div>
              )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="pt-10 flex flex-col items-center gap-4 text-neutral-400 opacity-60">
          <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">نظام التوثيق الرقمي الموحد • وزارة الداخلية</span>
          </div>
          <p className="text-[9px] font-bold">الموافقة على الإقرار بمثابة توقيع إلكتروني معتمد رسمياً</p>
      </div>
    </div>
  );
}