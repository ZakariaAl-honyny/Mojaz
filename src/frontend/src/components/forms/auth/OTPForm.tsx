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
      if (!userId) throw new Error('User ID missing');
      
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
      if (!userId) throw new Error('User ID missing');
      
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
      <Card className="border-destructive">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-semibold">{t('verify.invalidSession')}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/register')}>
            {t('verify.backToRegister')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-xl dark:bg-neutral-900/90 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600" />
        <CardHeader className="pt-8 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/20">
            <ShieldCheck className="w-8 h-8 text-primary-500" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('verify.title')}</CardTitle>
          <CardDescription className="text-base px-2">
            {t('verify.description')} <span className="font-semibold text-neutral-900 dark:text-neutral-100">{destination}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-2">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm flex items-center gap-2 dark:bg-emerald-950/20"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between gap-2 dir-ltr">
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
                onFocus={() => setActiveInput(idx)}
                data-testid={`otp-input-${idx}`}
                className={cn(
                  "w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 bg-neutral-50 transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none dark:bg-neutral-800",
                  activeInput === idx ? "border-primary-500 shadow-sm" : "border-neutral-200 dark:border-neutral-700",
                  digit && "border-primary-500"
                )}
              />
            ))}
          </div>

          <Button 
            onClick={handleVerify}
            data-testid="otp-confirm"
            className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg rounded-gov shadow-lg"
            disabled={isLoading || otp.join('').length < 6}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('verify.confirm')}
          </Button>

          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-neutral-500">{t('verify.didntReceive')}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className={cn(
                  "text-primary-500 hover:text-primary-600 font-semibold p-0 h-auto",
                  cooldown > 0 && "text-neutral-400 opacity-50 cursor-not-allowed"
                )}
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <RefreshCw className={cn("w-4 h-4 mr-1", cooldown > 0 ? "" : "animate-pulse")} />
                )}
                {cooldown > 0 
                  ? `${t('verify.resendIn')} ${cooldown}${t('verify.seconds')}` 
                  : t('verify.resendAction')
                }
              </Button>
            </div>
            
            <button
              onClick={() => router.back()}
              className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3 h-3 rtl:rotate-180" />
              {t('verify.changeRegistrationInfo')}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
