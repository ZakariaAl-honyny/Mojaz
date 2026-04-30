'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, Loader2, CheckCircle2, ArrowLeft, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const resetPasswordSchema = z.object({
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
  const [success, setSuccess] = useState<string | null>(null);

  // OTP State (6 separate inputs)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer State
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await authService.forgotPassword({
        identifier: identifier.trim(),
        method: identifier.includes('@') ? 1 : 2
      });
      setSuccess('تم إعادة إرسال الرمز بنجاح');
      setCooldown(60);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر إعادة الإرسال حالياً.');
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: ResetPasswordValues) => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('يرجى إدخال رمز التحقق كاملاً (6 أرقام)');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({
        identifier: identifier.trim(),
        code,
        newPassword: data.newPassword
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'الرمز المدخل غير صحيح أو منتهي الصلاحية.');
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

        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden max-w-xs mx-auto">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3 }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-arabic bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100 relative overflow-hidden" dir="rtl">
      {/* Institutional Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="text-center space-y-2">
        <div className="transition-transform duration-700 cursor-pointer inline-block">
          <img
            src="/images/logo.png"
            alt="Mojaz Logo"
            className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 object-contain"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1a3a8f]">إتمام التغيير</h2>
        <p className="text-neutral-400 font-bold text-sm leading-relaxed max-w-sm mx-auto">
          أدخل رمز التحقق المرسل إلى <br />
          <span className="text-[#1a3a8f] font-black">{identifier}</span>
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
            <p>{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-emerald-500/5 text-emerald-700 text-sm font-bold leading-relaxed flex items-center gap-4 border border-emerald-500/10 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OTP Fields */}
        <div className="space-y-6 group">
          <Label className="text-[#1a3a8f] font-black text-sm me-2 flex items-center gap-3">
            <Sparkles className="w-4.5 h-4.5" />
            رمز التحقق (OTP)
          </Label>
          <div className="flex justify-center gap-2 md:gap-3" dir="ltr">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputsRef.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={() => setActiveInput(idx)}
                className={cn(
                  "w-12 h-16 md:w-14 md:h-20 text-center text-3xl font-black rounded-xl transition-all duration-300 outline-none border border-neutral-100 bg-neutral-50/50",
                  activeInput === idx ? "bg-white text-[#1a3a8f] shadow-lg ring-2 ring-[#1a3a8f]/20 border-[#1a3a8f]/30 scale-105" : "text-neutral-300",
                  digit && "bg-white text-[#1a3a8f] border-[#1a3a8f]/10 shadow-sm"
                )}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4 group">
            <Label className="text-[#1a3a8f] font-black text-sm me-2 flex items-center gap-3">
              <Lock className="w-4.5 h-4.5" />
              كلمة المرور الجديدة
            </Label>
            <Input
              {...register('newPassword')}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(
                "h-12 bg-neutral-100/50 border-none rounded-xl text-[#1a3a8f] px-6 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-start shadow-inner",
                errors.newPassword && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
            />
            {errors.newPassword && <p className="text-xs text-red-500 font-bold me-2">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-4 group">
            <Label className="text-[#1a3a8f] font-black text-sm me-2 flex items-center gap-3">
              <ShieldCheck className="w-4.5 h-4.5" />
              تأكيد الكلمة
            </Label>
            <Input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(
                "h-12 bg-neutral-100/50 border-none rounded-xl text-[#1a3a8f] px-6 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-start shadow-inner",
                errors.confirmPassword && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 font-bold me-2">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Button
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
            className="w-full h-16 bg-[#1a3a8f] hover:bg-[#00215a] text-lg font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/40 active:scale-[0.98] transition-all group overflow-hidden"
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

          <button
            type="button"
            onClick={onResend}
            disabled={cooldown > 0 || isResending}
            className={cn(
              "h-12 transition-all duration-500 flex items-center justify-center gap-3 px-8 rounded-xl font-black text-xs",
              cooldown > 0 ? "bg-neutral-50 text-neutral-300 border border-neutral-100 cursor-not-allowed" : "bg-[#1a3a8f]/5 text-[#1a3a8f] border border-[#1a3a8f]/10 hover:bg-[#1a3a8f] hover:text-white"
            )}
          >
            {isResending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className={cn("w-5 h-5", cooldown === 0 && "animate-spin-slow")} />
            )}
            {cooldown > 0
              ? `إعادة إرسال الرمز متاح خلال ${cooldown} ثانية`
              : 'أعد إرسال رمز التحقق الآن'
            }
          </button>
        </div>
      </form>
    </div>
  );
}
