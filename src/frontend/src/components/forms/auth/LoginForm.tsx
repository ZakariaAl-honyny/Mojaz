'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Mail, Lock, Loader2} from 'lucide-react';
import {useAuthStore} from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import {useRouter} from '@/i18n/routing';

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

  const {register, handleSubmit, formState: {errors}} = useForm<LoginValues>({
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
      
      const {accessToken, refreshToken, user} = response.data.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-neutral-100">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-neutral-900">{t('login.title')}</h2>
        <p className="text-neutral-500 font-medium">{t('login.subtitle')}</p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl font-medium animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-neutral-700 font-semibold">{t('login.identifier')}</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('identifier')} 
              className="ps-12 h-12 rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500 transition-shadow" 
              placeholder={t('login.placeholderIdentifier')} 
            />
          </div>
          {errors.identifier && <p className="text-xs text-error font-medium">{t('errors.identifierRequired')}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
             <Label className="text-neutral-700 font-semibold">{t('login.password')}</Label>
             <a href="/forgot-password" className="text-xs font-bold text-primary-500 hover:text-primary-600 underline">هل نسيت كلمة المرور؟</a>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
            <Input 
              {...register('password')} 
              type="password" 
              className="ps-12 h-12 rounded-xl border-neutral-200 focus:ring-2 focus:ring-primary-500 transition-shadow" 
            />
          </div>
          {errors.password && <p className="text-xs text-error font-medium">{t('errors.passwordRequired')}</p>}
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 transition-all rounded-2xl shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : t('login.submit')}
        </Button>
      </form>
    </div>
  );
}
