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

import { motion } from 'framer-motion';

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
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
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 gov-glass-panel p-8 md:p-12 rounded-[2.5rem]"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(30,58,138,0.3)]">
          M
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          {t('forgotPassword.title')}
        </h2>
        <p className="text-neutral-400 font-medium">
          {t('forgotPassword.subtitle')}
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium text-center"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <Label className="text-neutral-300 font-semibold ml-1">{t('forgotPassword.identifier')}</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('identifier')} 
              className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 transition-all font-medium" 
              placeholder={t('forgotPassword.identifier')} 
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-400 font-medium ml-1">{errors.identifier.message}</p>}
        </div>

        <div className="space-y-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-16 text-xl font-black bg-primary-600 hover:bg-primary-700 transition-all rounded-[1.5rem] shadow-xl shadow-primary-900/40 active:scale-[0.97]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('forgotPassword.submit')}
          </Button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => router.push('/login')} 
              className="group flex items-center gap-2 mx-auto text-neutral-500 hover:text-primary-400 font-black uppercase tracking-widest text-[11px] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 group-rtl:rotate-180 transition-transform" />
              {t('forgotPassword.backToLogin')}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

