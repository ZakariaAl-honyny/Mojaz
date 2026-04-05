'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Mail, Phone, Loader2, ArrowLeft} from 'lucide-react';
import apiClient from '@/lib/api-client';
import {useRouter} from '@/i18n/routing';

const forgotPasswordSchema = z.object({
  identifier: z.string().min(5),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: (identifier: string) => void;
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {register, handleSubmit, formState: {errors}} = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/forgot-password', {
        identifier: data.identifier,
        method: data.identifier.includes('@') ? 0 : 1 // 0=Email, 1=SMS
      });
      onSuccess(data.identifier);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send recovery code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-neutral-100">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-neutral-900">{t('forgotPassword.title')}</h2>
        <p className="text-neutral-500 font-medium">{t('forgotPassword.subtitle')}</p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl font-medium animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-neutral-700 font-semibold">{t('forgotPassword.identifier')}</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('identifier')} 
              className="ps-12 h-12 rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500 transition-shadow" 
              placeholder={t('forgotPassword.identifier')} 
            />
          </div>
          {errors.identifier && <p className="text-xs text-error font-medium">{errors.identifier.message}</p>}
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 transition-all rounded-2xl shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : t('forgotPassword.submit')}
        </Button>

        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push('/login')} className="text-neutral-500 hover:text-primary-600 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" />
            {t('forgotPassword.backToLogin')}
          </Button>
        </div>
      </form>
    </div>
  );
}
