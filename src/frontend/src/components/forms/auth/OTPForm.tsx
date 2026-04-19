'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { OtpPurpose } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { ShieldCheck, RefreshCw, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OTPForm() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get('userId');
  const method = searchParams.get('method') || 'email';
  const destination = searchParams.get('dest') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60); // 60 seconds cooldown
  
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
    
    // Auto focus next
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

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError(t('verify.invalidCode'));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (!userId) throw new Error(t('verify.invalidSession'));
      
      const response = await authService.verifyOtp({
        userId,
        code,
        type: OtpPurpose.Registration
      });

      if (response.success) {
        setSuccess(t('verify.success'));
        // Wait a bit then redirect to login or dashboard
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 2000);
      } else {
        setError(response.message || t('errors.verificationFailed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    try {
      if (!userId) throw new Error(t('verify.invalidSession'));
      
      const response = await authService.resendOtp({
        userId,
        type: OtpPurpose.Registration
      });

      if (response.success) {
        setSuccess(t('verify.otpResent'));
        setCooldown(60); // Reset cooldown
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || t('errors.resendFailed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('errors.genericError'));
    } finally {
      setIsResending(false);
    }
  };

  if (!userId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full gov-glass-panel p-12 text-center"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]" />
        <p className="text-white font-black uppercase tracking-widest text-sm mb-8">{t('verify.invalidSession')}</p>
        <Button 
          variant="outline" 
          className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest text-[11px]" 
          onClick={() => router.push('/register')}
        >
          {t('verify.backToRegister')}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 gov-glass-panel p-8 md:p-12 rounded-[2.5rem]"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-[0_20px_40px_rgba(0,108,53,0.3)]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-3xl font-black tracking-tighter text-white font-arabic leading-none">
          {t('verify.title')}
        </h2>
        <p className="text-neutral-400 font-medium text-sm">
          {t('verify.description')} <span className="text-primary font-bold">{destination}</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium text-center"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 bg-primary/10 border border-primary/20 text-primary-400 text-sm rounded-2xl font-medium text-center"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10">
        <div className="flex justify-between gap-3 md:gap-4 dir-ltr">
          {otp.map((digit, idx) => (
            <motion.input
              key={idx}
              whileFocus={{ scale: 1.05, y: -4 }}
              ref={(el) => { inputsRef.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onFocus={() => setActiveInput(idx)}
              data-testid={`otp-input-${idx}`}
              className={cn(
                "w-full aspect-[4/5] md:h-20 text-center text-2xl md:text-3xl font-black rounded-2xl bg-white/5 border-2 transition-all outline-none",
                activeInput === idx 
                  ? "border-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                  : "border-white/10 text-neutral-400",
                digit && "border-primary/50 text-primary bg-primary/5"
              )}
            />
          ))}
        </div>

        <div className="space-y-6">
          <Button 
            onClick={handleVerify}
            data-testid="otp-confirm"
            disabled={isLoading || otp.join('').length < 6}
            className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 transition-all rounded-[1.5rem] shadow-xl shadow-primary/20 active:scale-[0.97] group"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{t('common.loading')}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full relative">
                <span>{t('verify.confirm')}</span>
              </div>
            )}
          </Button>

          <div className="flex flex-col items-center gap-4">
             <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 text-sm font-medium">{t('verify.didntReceive')}</span>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || isResending}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                    cooldown > 0 ? "text-neutral-700 cursor-not-allowed" : "text-primary hover:text-primary-300"
                  )}
                >
                  {isResending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : cooldown > 0 ? (
                    `${t('verify.resendIn')} ${cooldown}s`
                  ) : (
                    t('verify.resendAction')
                  )}
                </button>
             </div>

             <button
               onClick={() => router.back()}
               className="group flex items-center gap-2 text-neutral-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
             >
               <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 group-rtl:rotate-180 transition-transform" />
               {t('verify.changeRegistrationInfo')}
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


