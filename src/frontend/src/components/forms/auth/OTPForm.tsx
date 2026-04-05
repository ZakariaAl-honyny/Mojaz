'use client';

import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Loader2, ShieldCheck, Timer, RefreshCw} from 'lucide-react';
import apiClient from '@/lib/api-client';
import {useRouter} from '@/i18n/routing';

export default function OTPForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const type = searchParams.get('type') || 'Email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const onSubmit = async () => {
    const code = otp.join('');
    if (code.length < 6) return;

    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/verify-otp', {
        userId,
        code,
        type: type === 'Email' ? 0 : 1 // OtpType Enum
      });
      router.push('/login?verified=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      await apiClient.post('/auth/resend-otp', {
        userId,
        type: type === 'Email' ? 0 : 1
      });
      setTimeLeft(60);
    } catch (err) {
      setError('Resend failed.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-neutral-100 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-500">
          <ShieldCheck className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{t('otp.title')}</h2>
        <p className="text-neutral-500 font-medium">
          {t('otp.subtitle')} <span className="text-neutral-900 font-bold">{type === 'Email' ? 'البريد الإلكتروني' : 'الجوال'}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-3" dir="ltr">
        {otp.map((digit, i) => (
          <Input
            key={i}
            id={`otp-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500"
          />
        ))}
      </div>

      <div className="space-y-4">
        <Button 
          onClick={onSubmit} 
          className="w-full h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 transition-all rounded-2xl shadow-lg" 
          disabled={isLoading || otp.join('').length < 6}
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : t('otp.submit')}
        </Button>

        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          {timeLeft > 0 ? (
            <div className="flex items-center gap-2 text-neutral-500 bg-neutral-100 px-4 py-2 rounded-full">
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <Button variant="ghost" className="gap-2 text-primary-500 hover:text-primary-600" onClick={resendOtp} disabled={isResending}>
              {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {t('otp.resend')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
