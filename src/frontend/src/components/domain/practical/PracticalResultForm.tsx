'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  FileBadge,
  Clock,
  ShieldCheck,
  User,
  Car,
  AlertTriangle,
  ArrowLeft,
  Settings
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { practicalService } from '@/services/practical.service';
import { submitPracticalResultSchema, SubmitPracticalResultFormValues } from '@/lib/validations/practical.schema';
import { cn } from '@/lib/utils';

interface PracticalResultFormProps {
  applicationId: string;
  onSuccess?: () => void;
}

export function PracticalResultForm({ applicationId, onSuccess }: PracticalResultFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SubmitPracticalResultFormValues>({
    resolver: zodResolver(submitPracticalResultSchema),
    defaultValues: {
      isAbsent: false,
      requiresAdditionalTraining: false,
      needsManualTransmissionEndorsement: false,
    },
  });

  const isAbsent = watch('isAbsent');
  const requiresTraining = watch('requiresAdditionalTraining');

  const onSubmit = async (data: SubmitPracticalResultFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await practicalService.submitResult(applicationId, {
        score: data.score || 0,
        isAbsent: data.isAbsent,
        notes: data.notes,
        examinerNotes: data.examinerNotes,
        vehicleUsed: data.vehicleUsed,
        requiresAdditionalTraining: data.requiresAdditionalTraining,
        additionalHoursRequired: data.additionalHoursRequired,
        needsManualTransmissionEndorsement: data.needsManualTransmissionEndorsement,
      });

      if (res.success) {
        toast.success("تم تسجيل نتيجة الاختبار العملي بنجاح.");
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(res.message || "حدث خطأ أثناء تسجيل النتيجة.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ في النظام.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-3xl rounded-[3rem] overflow-hidden font-arabic" dir="rtl">
      <CardHeader className="bg-[#1a3a8f]/5 p-10 border-b border-[#1a3a8f]/10 text-center space-y-4">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-[#1a3a8f]/10">
          <FileBadge className="w-10 h-10 text-[#1a3a8f]" />
        </div>
        <CardTitle className="text-3xl font-black text-[#1a3a8f] tracking-tighter">رصد نتيجة الاختبار العملي</CardTitle>
        <CardDescription className="text-lg font-bold text-neutral-500">سجل أداء المتقدم في اختبار القيادة الميداني</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-10 md:p-16 space-y-10">
          {/* Attendance Checkbox */}
          <div className={cn(
            "flex items-center gap-5 p-8 rounded-3xl border-4 transition-all group cursor-pointer active:scale-[0.98]",
            isAbsent ? "border-red-500 bg-red-500/5" : "border-neutral-50 bg-neutral-50/50 hover:border-[#1a3a8f]/20"
          )} onClick={() => {}}>
            <Controller
              name="isAbsent"
              control={control}
              render={({ field }) => (
                <div onClick={() => field.onChange(!field.value)} className={cn(
                  "w-10 h-10 rounded-xl border-4 flex items-center justify-center transition-all",
                  field.value ? "bg-red-500 border-red-500 shadow-lg shadow-red-500/30" : "border-neutral-200 bg-white"
                )}>
                  {field.value && <AlertCircle className="w-6 h-6 text-white" />}
                </div>
              )}
            />
            <Label htmlFor="isAbsent" className={cn("text-xl font-black cursor-pointer select-none", isAbsent ? "text-red-900" : "text-neutral-700")}>
              إثبات غياب المتقدم عن الاختبار
            </Label>
          </div>

          {!isAbsent ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Score & Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-sm font-black text-[#1a3a8f] mr-2">درجة الاختبار (0 - 100)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="أدخل الدرجة..."
                      {...register('score', { valueAsNumber: true })}
                      className="h-16 bg-neutral-50 border-neutral-100 rounded-2xl px-6 font-black text-2xl text-center focus:ring-4 focus:ring-[#1a3a8f]/10"
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 font-black">/ 100</div>
                  </div>
                  {errors.score && (
                    <p className="text-sm font-bold text-red-500 px-2">{errors.score.message}</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Label className="text-sm font-black text-[#1a3a8f] mr-2 text-start">المركبة المستخدمة</Label>
                  <div className="relative">
                    <Input
                      placeholder="رقم اللوحة أو نوع المركبة..."
                      {...register('vehicleUsed')}
                      className="h-16 bg-neutral-50 border-neutral-100 rounded-2xl px-12 font-bold text-lg focus:ring-4 focus:ring-[#1a3a8f]/10"
                    />
                    <Car className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-300" />
                  </div>
                </div>
              </div>

              {/* Manual Endorsement */}
              <div className="flex items-center gap-5 p-8 bg-amber-50 rounded-3xl border-2 border-amber-100 group cursor-pointer active:scale-[0.98] transition-all" onClick={() => {}}>
                <Controller
                  name="needsManualTransmissionEndorsement"
                  control={control}
                  render={({ field }) => (
                    <div onClick={() => field.onChange(!field.value)} className={cn(
                      "w-10 h-10 rounded-xl border-4 flex items-center justify-center transition-all",
                      field.value ? "bg-amber-600 border-amber-600 shadow-lg" : "border-amber-200 bg-white"
                    )}>
                      {field.value && <Settings className="w-6 h-6 text-white animate-spin-slow" />}
                    </div>
                  )}
                />
                <div className="space-y-1">
                  <Label className="text-xl font-black text-amber-900 cursor-pointer select-none">رخصة قيادة ناقل حركة يدوي (عادي)</Label>
                  <p className="text-sm font-bold text-amber-700/60">تفعيل هذا الخيار يعني قدرة المتقدم على قيادة اليدوي</p>
                </div>
              </div>
            </motion.div>
          ) : (
             <div className="p-16 bg-red-400/5 border-4 border-dashed border-red-500/10 rounded-[3rem] text-center space-y-6">
                <AlertTriangle className="w-20 h-20 text-red-500 opacity-20 mx-auto" />
                <p className="text-xl font-black text-red-900/40">تم تحديد حالة الغياب - لا يمكن رصد درجات</p>
             </div>
          )}

          {/* Notes Sections */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-sm font-black text-[#1a3a8f] mr-2">ملاحظات عامة (تظهر للمتقدم)</Label>
              <Textarea
                placeholder="قدم نصائح أو أذكر أسباب النتيجة للمتقدم..."
                {...register('notes')}
                rows={3}
                className="min-h-[120px] rounded-2xl border-neutral-100 bg-neutral-50 px-6 py-4 font-bold text-lg focus:ring-4 focus:ring-[#1a3a8f]/10"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-black text-amber-600 mr-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                ملاحظات الفاحص السرية (للاستخدام الداخلي فقط)
              </Label>
              <Textarea
                placeholder="دون ملاحظاتك المهنية حول سلوك المتقدم..."
                {...register('examinerNotes')}
                rows={3}
                className="min-h-[120px] rounded-2xl border-amber-100 bg-amber-50/50 px-6 py-4 font-bold text-lg focus:ring-4 focus:ring-amber-500/10"
              />
            </div>
          </div>

          {/* Additional Training Section */}
          <div className={cn(
            "border-4 rounded-[2.5rem] p-10 transition-all space-y-8",
            requiresTraining ? "bg-[#1a3a8f] border-[#1a3a8f] shadow-2xl shadow-blue-900/30" : "bg-neutral-50/50 border-neutral-50"
          )}>
            <div className="flex items-center gap-5 cursor-pointer" onClick={() => {}}>
              <Controller
                name="requiresAdditionalTraining"
                control={control}
                render={({ field }) => (
                  <div onClick={() => field.onChange(!field.value)} className={cn(
                    "w-12 h-12 rounded-2xl border-4 flex items-center justify-center transition-all shadow-md",
                    field.value ? "bg-white border-white" : "border-neutral-200 bg-white"
                  )}>
                    {field.value && <Clock className="w-7 h-7 text-[#1a3a8f]" />}
                  </div>
                )}
              />
              <div className="space-y-1 text-start">
                 <Label className={cn("text-2xl font-black select-none", requiresTraining ? "text-white" : "text-neutral-700")}>توصية بساعات تدريب إضافية</Label>
                 <p className={cn("text-sm font-bold", requiresTraining ? "text-white/60" : "text-neutral-400")}>في حال رسوب المتقدم أو حاجته لتقوية مهاراته الميدانية</p>
              </div>
            </div>

            {requiresTraining && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-6 border-t border-white/10 space-y-4"
              >
                <Label className="text-sm font-black text-white/80 mr-2">عدد الساعات المقترحة</Label>
                <div className="relative max-w-[200px]">
                  <Input
                    type="number"
                    placeholder="مثلاً: 10"
                    {...register('additionalHoursRequired', { valueAsNumber: true })}
                    className="h-16 bg-white/10 border-white/20 text-white rounded-2xl px-6 font-black text-2xl text-center focus:ring-4 focus:ring-white/20"
                  />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black">ساعة</span>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-[#1a3a8f]/5 p-10 border-t border-[#1a3a8f]/10 flex justify-end gap-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-20 px-10 rounded-[2rem] font-black text-neutral-400 hover:text-[#1a3a8f] hover:bg-white transition-all text-lg"
          >
            إلغاء التعديلات
          </Button>
          
          <Button 
            type="submit" 
            className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#002868] text-sm md:text-base text-white font-black transition-all flex items-center gap-3 md:gap-4 group" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 md:h-6 md:h-6 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <span>اعتماد النتيجة</span>
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
