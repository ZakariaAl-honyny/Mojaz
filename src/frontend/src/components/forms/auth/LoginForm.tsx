'use client';

import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import { useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  identifier: z.string().min(5),
  password: z.string().min(8),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', {
        identifier: data.identifier,
        password: data.password,
        method: data.identifier.includes('@') ? 0 : 1 // AuthMethod Enum
      });
      
      const { accessToken, refreshToken, user } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 bg-white/10 dark:bg-black/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(0,108,53,0.3)]">
          M
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          {t('login.title')}
        </h2>
        <p className="text-neutral-400 font-medium">
          {t('login.subtitle')}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-neutral-300 font-semibold ml-1">{t('login.identifier')}</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('identifier')} 
              data-testid="login-identifier"
              className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all" 
              placeholder={t('login.placeholderIdentifier')} 
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-400 font-medium ml-1">{t('errors.identifierRequired')}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
             <Label className="text-neutral-300 font-semibold">{t('login.password')}</Label>
             <Link href="/forgot-password" className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors">
               {t('login.forgotPassword')}
             </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('password')} 
              type="password" 
              data-testid="login-password"
              className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all" 
              placeholder={t('login.placeholderPassword')}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 font-medium ml-1">{t('errors.passwordRequired')}</p>}
        </div>

        <Button 
          type="submit" 
          data-testid="login-submit" 
          disabled={isLoading}
          className="w-full h-16 text-xl font-black bg-primary-600 hover:bg-primary-700 transition-all rounded-[1.5rem] shadow-xl shadow-primary-900/40 active:scale-[0.97] group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {t('login.submit')}
              <ArrowRight className="ms-2 w-6 h-6 group-hover:translate-x-1 group-rtl:rotate-180 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
