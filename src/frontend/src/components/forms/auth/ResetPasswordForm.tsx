'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, KeyRound, Loader2, CheckCircle2, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "يجب أن يكون رمز التحقق 6 أرقام"),
  newPassword: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "تأكيد كلمة المرور غير متطابق",
  path: ["confirmPassword"]
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  identifier: string;
}

export default function ResetPasswordForm({ identifier }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/reset-password', {
        identifier,
        otp: data.otp,
        newPassword: data.newPassword
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في إعادة تعيين كلمة المرور. يرجى التأكد من الرمز المدخل والمحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-12 font-arabic text-center flex flex-col items-center py-16" dir="rtl">
        <motion.div 
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/40 relative"
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-[2rem] animate-ping opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        
        <div className="space-y-4">
            <h2 className="text-4xl font-black text-[#1a3a8f] tracking-tight">تم التحديث بنجاح</h2>
            <p className="text-neutral-500 font-bold text-lg max-w-sm mx-auto leading-relaxed">
              تم تغيير كلمة المرور بنجاح. جاري توجيهك لصفحة تسجيل الدخول بأمان...
            </p>
        </div>

        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden max-w-xs">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 3 }}
               className="h-full bg-emerald-500"
            />
        </div>

        <Button onClick={() => router.push('/login')} className="w-full h-20 text-2xl font-black bg-[#1a3a8f] hover:bg-[#00215a] text-white rounded-[2.5rem] shadow-2xl shadow-blue-900/40 transition-all active:scale-[0.98]">
          دخـول الآن
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-arabic" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-[#1a3a8f] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-900/40 border border-white/20">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1a3a8f]">إتمام التغيير</h2>
        <p className="text-neutral-500 font-bold text-sm leading-relaxed max-w-sm mx-auto">
          أدخل رمز التحقق المكون من 6 أرقام وقم بتعيين كلمة المرور الجديدة.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-red-500/5 text-red-700 text-sm font-bold leading-relaxed flex items-start gap-4 border border-red-500/10 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* OTP Field */}
        <div className="space-y-4 group">
          <Label className="text-[#1a3a8f] font-black text-sm mr-2 flex items-center gap-3">
            <Sparkles className="w-4.5 h-4.5" />
            رمز التحقق (OTP)
          </Label>
          <div className="relative">
            <Input 
              {...register('otp')} 
              className={cn(
                "h-16 bg-neutral-100/50 border-none rounded-2xl text-[#1a3a8f] px-8 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-center tracking-[1em] text-2xl shadow-inner",
                errors.otp && "ring-4 ring-red-500/10 bg-red-50/50"
              )} 
              placeholder="000000"
              maxLength={6}
            />
          </div>
          {errors.otp && <p className="text-xs text-red-500 font-bold mr-2">{errors.otp.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* New Password */}
            <div className="space-y-4 group">
              <Label className="text-[#1a3a8f] font-black text-sm mr-2 flex items-center gap-3">
                <Lock className="w-4.5 h-4.5" />
                كلمة المرور الجديدة
              </Label>
              <Input 
                {...register('newPassword')} 
                type="password" 
                placeholder="••••••••"
                className={cn(
                    "h-16 bg-neutral-100/50 border-none rounded-2xl text-[#1a3a8f] px-8 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-right shadow-inner",
                    errors.newPassword && "ring-4 ring-red-500/10 bg-red-50/50"
                )} 
              />
              {errors.newPassword && <p className="text-xs text-red-500 font-bold mr-2">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-4 group">
              <Label className="text-[#1a3a8f] font-black text-sm mr-2 flex items-center gap-3">
                <ShieldCheck className="w-4.5 h-4.5" />
                تأكيد الكلمة
              </Label>
              <Input 
                {...register('confirmPassword')} 
                type="password" 
                placeholder="••••••••"
                className={cn(
                    "h-16 bg-neutral-100/50 border-none rounded-2xl text-[#1a3a8f] px-8 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-right shadow-inner",
                    errors.confirmPassword && "ring-4 ring-red-500/10 bg-red-50/50"
                )} 
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 font-bold mr-2">{errors.confirmPassword.message}</p>}
            </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-20 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-xl font-black rounded-[2.5rem] shadow-2xl shadow-blue-900/40 active:scale-[0.98] transition-all group overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>جاري التحديث...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6 w-full">
              <span>تأكيد تعيين كلمة المرور</span>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-2">
                 <ArrowLeft className="w-7 h-7" />
              </div>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
