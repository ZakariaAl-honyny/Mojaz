'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { authService } from '@/services/auth.service';
import { RegistrationMethod } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { Phone, User, Lock, AlertCircle, Loader2, ArrowLeft, ShieldCheck, KeySquare } from 'lucide-react';

const phoneRegisterSchema = z.object({
  fullName: z.string().min(3, 'يجب أن يكون الاسم الكامل 3 أحرف على الأقل'),
  phone: z.string().regex(/^\+967[0-9]{9}$/, 'أدخل رقم هاتف يمني صحيح يبدأ بـ +967 (مثال: +967777123456)'),
  password: z.string().min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل (يُنصح بمزيج من الأرقام والحروف)'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'يجب عليك تأكيد الموافقة على الشروط للمتابعة'),
}).refine(data => data.password === data.confirmPassword, {
  message: "تأكيد كلمة المرور غير متطابق مع كلمة المرور المدخلة",
  path: ['confirmPassword'],
});

type PhoneRegisterFormValues = z.infer<typeof phoneRegisterSchema>;

export function PhoneRegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PhoneRegisterFormValues>({
    resolver: zodResolver(phoneRegisterSchema),
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: PhoneRegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await authService.register({
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        method: RegistrationMethod.Phone,
        preferredLanguage: 'ar',
        termsAccepted: data.termsAccepted,
      });

      if (response.success && response.data?.userId) {
        router.push(`/register/verify?userId=${response.data.userId}&method=phone&dest=${encodeURIComponent(data.phone)}`);
      } else {
        setServerError(response.message || 'عذراً، تعذر إنشاء الحساب حالياً. يرجى مراجعة البيانات والمحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'حدث خطأ تقني غير متوقع. يرجى المحاولة لاحقاً أو الاتصال بالدعم الفني.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 font-arabic" dir="rtl">
      <AnimatePresence mode="wait">
        {serverError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex items-start gap-6 shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-md flex-shrink-0 border border-red-500/10">
               <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
               <p className="text-lg font-black text-red-900">حدث خطأ أثناء التسجيل</p>
               <p className="text-sm font-bold text-red-700/80 leading-relaxed max-w-lg">{serverError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-10">
        {/* Full Name */}
        <div className="group space-y-4">
          <Label className="text-sm font-black text-[#1a3a8f] mr-4 flex items-center gap-3">
            <User className="w-4.5 h-4.5" />
            الاسم الكامل (كما هو في الوثيقة الشخصية)
          </Label>
          <div className="relative">
            <Input
              placeholder="مثال: صالح محمد علي المحبشي"
              className={cn(
                "h-16 bg-neutral-100/50 border-none rounded-[1.5rem] px-8 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all shadow-inner", 
                errors.fullName && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 font-bold mr-4">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="group space-y-4">
          <Label className="text-sm font-black text-[#1a3a8f] mr-4 flex items-center gap-3">
            <Phone className="w-4.5 h-4.5" />
            رقم الهاتف الجوال (يمني)
          </Label>
          <div className="relative">
            <Input
              placeholder="+9677XXXXXXXX"
              dir="ltr"
              className={cn(
                "h-16 bg-neutral-100/50 border-none rounded-[1.5rem] px-8 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all text-left font-mono shadow-inner", 
                errors.phone && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 font-bold mr-4">
               {errors.phone.message}
            </p>
          )}
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="group space-y-4">
            <Label className="text-sm font-black text-[#1a3a8f] mr-4 flex items-center gap-3">
              <Lock className="w-4.5 h-4.5" />
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                className={cn(
                  "h-16 bg-neutral-100/50 border-none rounded-[1.5rem] px-8 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all shadow-inner", 
                  errors.password && "ring-4 ring-red-500/10 bg-red-50/50"
                )}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-bold mr-4 leading-relaxed">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="group space-y-4">
            <Label className="text-sm font-black text-[#1a3a8f] mr-4 flex items-center gap-3">
              <KeySquare className="w-4.5 h-4.5" />
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                className={cn(
                  "h-16 bg-neutral-100/50 border-none rounded-[1.5rem] px-8 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all shadow-inner", 
                  errors.confirmPassword && "ring-4 ring-red-500/10 bg-red-50/50"
                )}
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-bold mr-4 leading-relaxed">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className={cn(
        "flex items-start gap-8 p-10 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden",
        termsAccepted ? "bg-[#1a3a8f]/5 border-[#1a3a8f]/20 shadow-lg shadow-blue-900/5" : "bg-neutral-50 border-neutral-100"
      )}>
        <Checkbox 
          id="terms-phone" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
          className={cn(
            "w-10 h-10 rounded-2xl transition-all border-neutral-200 flex-shrink-0 mt-1",
            "data-[state=checked]:bg-[#1a3a8f] data-[state=checked]:border-[#1a3a8f] data-[state=checked]:scale-110"
          )}
        />
        <div className="flex-1 space-y-2">
          <label
            htmlFor="terms-phone"
            className="text-lg font-bold text-neutral-500 cursor-pointer select-none leading-[1.6]"
          >
            أقر بأنني اطلعت على جميع <Link href="/terms" className="text-[#1a3a8f] font-black underline underline-offset-8 decoration-2 decoration-[#1a3a8f]/10 hover:decoration-[#1a3a8f] transition-all">الشروط والأحكام</Link> وسياسة الخصوصية المعمول بها في <span className="text-[#1a3a8f] font-black">الإدارة العامة للمرور</span> وأوافق عليها جملةً وتفصيلاً.
          </label>
          {errors.termsAccepted && (
            <p className="mt-4 text-sm text-red-500 font-black flex items-center gap-2">
               <AlertCircle className="w-4 h-4" />
               {errors.termsAccepted.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-20 text-2xl font-black bg-[#1a3a8f] hover:bg-[#00215a] text-white transition-all rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(26,58,143,0.4)] active:scale-[0.98] group relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                 key="loading"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="flex items-center gap-6"
              >
                <Loader2 className="w-10 h-10 animate-spin" />
                <span>جاري المعالجة...</span>
              </motion.div>
            ) : (
              <motion.div 
                 key="content"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex items-center justify-center gap-8 w-full"
              >
                <span>إنشاء الحساب اليمني الموحد</span>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-2">
                   <ArrowLeft className="w-8 h-8" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      <div className="pt-8 border-t border-neutral-100 flex items-center justify-center gap-6">
         <ShieldCheck className="w-6 h-6 text-emerald-600" />
         <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">اتصال آمن • معايير سيادية 2024</p>
      </div>
    </form>
  );
}

export default PhoneRegistrationForm;