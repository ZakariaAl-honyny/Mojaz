'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Lock, KeyRound, Loader2, CheckCircle2} from 'lucide-react';
import apiClient from '@/lib/api-client';
import {useRouter} from '@/i18n/routing';

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "Code must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  identifier: string;
}

export default function ResetPasswordForm({ identifier }: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {register, handleSubmit, formState: {errors}} = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/reset-password', {
        identifier, // Use identifier to find user in backend
        otp: data.otp,
        newPassword: data.newPassword
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please verify the code.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-neutral-100 flex flex-col items-center py-20">
        <CheckCircle2 className="w-20 h-20 text-success mb-4" />
        <h2 className="text-3xl font-bold text-neutral-900">{t('resetPassword.success')}</h2>
        <p className="text-neutral-500 font-medium mt-2">{t('forgotPassword.backToLogin')}</p>
        <Button onClick={() => router.push('/login')} className="mt-8 px-10 h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 transition-all rounded-2xl shadow-lg">
          {t('auth.login.submit') || 'Login'}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-neutral-100">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-neutral-900">{t('resetPassword.title')}</h2>
        <p className="text-neutral-500 font-medium">{t('resetPassword.subtitle')}</p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl font-medium animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-neutral-700 font-semibold">{t('resetPassword.otp')}</Label>
          <div className="relative group">
            <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('otp')} 
              className="ps-12 h-12 rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500 transition-shadow tracking-[0.5em] font-mono text-lg" 
              placeholder="000000"
              maxLength={6}
            />
          </div>
          {errors.otp && <p className="text-xs text-error font-medium">{errors.otp.message}</p>}
        </div>

        <div className="space-y-3">
           <Label className="text-neutral-700 font-semibold">{t('resetPassword.newPassword')}</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
              <Input 
                {...register('newPassword')} 
                type="password" 
                className="ps-12 h-12 rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500 transition-shadow" 
              />
            </div>
            {errors.newPassword && <p className="text-xs text-error font-medium">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-3">
           <Label className="text-neutral-700 font-semibold">{t('resetPassword.confirmPassword')}</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
              <Input 
                {...register('confirmPassword')} 
                type="password" 
                className="ps-12 h-12 rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500 transition-shadow" 
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-error font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 transition-all rounded-2xl shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : t('resetPassword.submit')}
        </Button>
      </form>
    </div>
  );
}
