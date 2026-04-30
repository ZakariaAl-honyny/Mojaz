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
import { handleApiError } from '@/lib/api-client';
import { RegistrationMethod } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { Mail, User, Lock, AlertCircle, Loader2, ArrowLeft, ShieldCheck, KeySquare } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(3, 'يجب أن يكون الاسم الكامل 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني المدخل غير صحيح'),
  password: z.string().min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل (يُنصح بمزيج من الأرقام والحروف)'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'يجب عليك تأكيد الموافقة على الشروط للمتابعة'),
}).refine(data => data.password === data.confirmPassword, {
  message: "تأكيد كلمة المرور غير متطابق مع كلمة المرور المدخلة",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function EmailRegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        method: RegistrationMethod.Email,
        preferredLanguage: 'ar',
        termsAccepted: data.termsAccepted,
      });

      if (response.success && response.data?.userId) {
        router.push(`/register/verify?userId=${response.data.userId}&method=email&dest=${encodeURIComponent(data.email)}`);
      } else {
        setServerError(response.message || 'عذراً، تعذر إنشاء الحساب حالياً. يرجى مراجعة البيانات والمحاولة مرة أخرى.');
      }
    } catch (err: any) {
      const apiError = handleApiError(err);
      setServerError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-arabic" dir="rtl">
      <AnimatePresence mode="wait">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-4 shadow-sm"
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

      <div className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <div className="group space-y-4">
          <Label className="text-sm font-black text-[#1a3a8f] me-4 flex items-center gap-3">
            <User className="w-4.5 h-4.5" />
            الاسم الكامل (كما هو في الوثيقة الشخصية)
          </Label>
          <div className="relative">
            <Input
              placeholder="مثال: محمد أحمد علي الكبسي"
              className={cn(
                "h-12 bg-neutral-100/50 border-none rounded-xl px-4 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all shadow-inner",
                errors.fullName && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 font-bold me-4">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="group space-y-4">
          <Label className="text-sm font-black text-[#1a3a8f] me-4 flex items-center gap-3">
            <Mail className="w-4.5 h-4.5" />
            عنوان البريد الإلكتروني
          </Label>
          <div className="relative">
            <Input
              type="email"
              placeholder="example@mojaz.com"
              className={cn(
                "h-12 bg-neutral-100/50 border-none rounded-xl px-4 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all text-start shadow-inner",
                errors.email && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-bold me-4">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group space-y-4">
            <Label className="text-sm font-black text-[#1a3a8f] me-4 flex items-center gap-3">
              <Lock className="w-4.5 h-4.5" />
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                className={cn(
                  "h-12 bg-neutral-100/50 border-none rounded-xl px-4 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all shadow-inner",
                  errors.password && "ring-4 ring-red-500/10 bg-red-50/50"
                )}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-bold me-4 leading-relaxed">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="group space-y-4">
            <Label className="text-sm font-black text-[#1a3a8f] me-4 flex items-center gap-3">
              <KeySquare className="w-4.5 h-4.5" />
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                className={cn(
                  "h-12 bg-neutral-100/50 border-none rounded-xl px-4 text-[#1a3a8f] font-black placeholder:text-neutral-300 focus-visible:ring-4 focus-visible:ring-[#1a3a8f]/10 transition-all shadow-inner",
                  errors.confirmPassword && "ring-4 ring-red-500/10 bg-red-50/50"
                )}
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-bold me-4 leading-relaxed">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className={cn(
        "flex flex-col gap-4 p-4 md:p-6 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden",
        termsAccepted ? "bg-[#1a3a8f]/5 border-[#1a3a8f]/20 shadow-lg shadow-blue-900/5" : "bg-neutral-50 border-neutral-100"
      )}>
        <div className="flex items-start gap-4">
          <Checkbox
            id="terms-email"
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
            className={cn(
              "w-6 h-6 rounded-lg transition-all border-neutral-200 flex-shrink-0 mt-0.5",
              "data-[state=checked]:bg-[#1a3a8f] data-[state=checked]:border-[#1a3a8f]"
            )}
          />
          <div className="flex-1 space-y-1">
            <label
              htmlFor="terms-email"
              className="text-xs md:text-sm font-bold text-neutral-500 cursor-pointer select-none leading-relaxed"
            >
              أقر بأنني اطلعت على جميع <Link href="/terms" className="text-[#1a3a8f] font-black underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/10 hover:decoration-[#1a3a8f] transition-all">الشروط والأحكام</Link> وسياسة الخصوصية المعمول بها في <span className="text-[#1a3a8f] font-black">الإدارة العامة للمرور</span> وأوافق عليها جملةً وتفصيلاً.
            </label>
            {errors.termsAccepted && (
              <p className="mt-2 text-sm text-red-500 font-black flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.termsAccepted.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-base md:text-lg font-black bg-[#1a3a8f] hover:bg-[#00215a] text-white transition-all rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] group relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جاري إنشاء ملفك...</span>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-4 w-full"
              >
                <span>إنشاء الحساب</span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      <div className="text-center pt-2 border-t border-neutral-100/50">
        <p className="text-sm font-bold text-neutral-500">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-[#1a3a8f] font-black underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/15 hover:decoration-[#1a3a8f] transition-all">
            تسجيل الدخول
          </Link>
        </p>
      </div>

    </form>
  );
}

export default EmailRegistrationForm;
