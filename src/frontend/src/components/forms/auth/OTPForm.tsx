'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { OtpPurpose } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { ShieldCheck, RefreshCw, ArrowLeft, Loader2, AlertCircle, CheckCircle2, MessageSquareText, ShieldAlert } from 'lucide-react';

export default function OTPForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get('userId');
  const method = searchParams.get('type') || 'Email';
  // Get destination from URL params (passed from registration)
  const destination = searchParams.get('destination') || searchParams.get('dest') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus the last filled input or the next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputsRef.current[focusIndex]?.focus();
    setActiveInput(focusIndex);

    // Auto-verify if 6 digits are pasted
    if (pastedData.length === 6) {
      setTimeout(() => handleVerify(), 100);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('يرجى إستكمال إدخال الرمز المكون من 6 أرقام');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (!destination) throw new Error('Destination missing');

      const response = await authService.verifyOtp({
        destination: destination,
        code,
        purpose: OtpPurpose.Registration
      });

      if (response.success) {
        setSuccess('تم توثيق الحساب بنجاح. جاري المتابعة...');
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 2000);
      } else {
        setError(response.message || 'الرمز المدخل غير صحيح أو منتهي الصلاحية');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ تقني أثناء التحقق. يرجى المحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    try {
      if (!userId) throw new Error('User ID missing');

      const response = await authService.resendOtp({
        destination: destination,
        purpose: OtpPurpose.Registration
      });

      if (response.success) {
        setSuccess('تم إعادة إرسال الرمز بنجاح');
        setCooldown(60);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'تعذر إعادة الإرسال. يرجى الانتظار قليلاً.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل الاتصال بالخادم. يرجى التحقق من الإنترنت.');
    } finally {
      setIsResending(false);
    }
  };

  if (!userId) {
    return (
      <div className="space-y-10 text-center py-10 font-arabic">
        <div className="w-24 h-24 bg-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-500/20">
          <ShieldAlert className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-red-700">حدث خطأ في الجلسة</h3>
          <p className="text-neutral-500 font-bold text-lg max-w-sm mx-auto leading-relaxed">
            عذراً، انتهت صلاحية جلسة التحقق الحالية. يرجى إعادة محاولة التسجيل.
          </p>
        </div>
        <Button
          onClick={() => router.push('/register')}
          className="w-full h-14 md:h-16 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-base md:text-lg font-black rounded-xl md:rounded-2xl transition-all shadow-xl shadow-blue-900/20"
        >
          العودة للتسجيل
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-arabic bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100 relative overflow-hidden" dir="rtl">
      {/* Subtle branding accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="text-center space-y-2">
        <div className="transition-transform duration-700 cursor-pointer inline-block">
          <img
            src="/images/logo.png"
            alt="Mojaz Logo"
            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 object-contain"
          />
        </div>
        <h2 className="text-lg md:text-xl font-black tracking-tight text-[#1a3a8f]">رمز التحقق</h2>
        <p className="text-neutral-400 font-bold text-xs leading-relaxed max-w-sm mx-auto">
          أدخل رمز التحقق المكون من 6 أرقام المرسل إلى: <br />
          <span className="text-[#1a3a8f] font-black text-[10px] md:text-xs block mt-1 opacity-80 select-all">{destination}</span>
        </p>
      </div>

      <div className="space-y-10">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-2xl bg-red-500/5 text-red-700 text-sm font-bold leading-relaxed flex items-start gap-4 border border-red-500/10 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              {error}
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
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-2 md:gap-3" dir="ltr">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputsRef.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              onFocus={() => setActiveInput(idx)}
              className={cn(
                  "w-12 h-16 md:w-14 md:h-20 text-center text-3xl font-black rounded-xl transition-all duration-300 outline-none border border-neutral-100 bg-neutral-50/50",
                  activeInput === idx ? "bg-white text-[#1a3a8f] shadow-lg ring-2 ring-[#1a3a8f]/20 border-[#1a3a8f]/30 scale-105" : "text-neutral-300",
                  digit && "bg-white text-[#1a3a8f] border-[#1a3a8f]/10 shadow-sm"
                )}
            />
          ))}
        </div>

        <Button
          onClick={handleVerify}
          className="w-full h-14 md:h-16 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-base md:text-lg font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-50 group overflow-hidden"
          disabled={isLoading || otp.join('').length < 6}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>جاري التوثيق...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 w-full">
              <span>تأكيد الرمز</span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
          )}
        </Button>

        <div className="text-center space-y-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm font-bold text-neutral-400">لم يصلك الرمز؟ تأكد من البيانات أو اطلب واحداً جديداً</p>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className={cn(
                "h-12 transition-all duration-500 flex items-center justify-center gap-3 px-8 rounded-xl font-black text-xs",
                cooldown > 0 ? "bg-neutral-50 text-neutral-300 border border-neutral-100 cursor-not-allowed" : "bg-[#1a3a8f]/5 text-[#1a3a8f] border border-[#1a3a8f]/10 hover:bg-[#1a3a8f] hover:text-white"
              )}
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className={cn("w-4 h-4", cooldown > 0 ? "" : "animate-spin-slow")} />
              )}
              {cooldown > 0
                ? `إعادة الإرسال خلال ${cooldown} ثانية`
                : 'إعادة إرسال الرمز'
              }
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-3 text-sm font-black text-neutral-400 hover:text-[#1a3a8f] transition-all py-2 border-b-2 border-transparent hover:border-[#1a3a8f]/10"
          >
            <span>العودة لتعديل بيانات الاتصال</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
