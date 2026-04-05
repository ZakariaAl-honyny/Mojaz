'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Mail, Phone, Lock, User, Loader2} from 'lucide-react';
import apiClient from '@/lib/api-client';
import {useRouter} from '@/i18n/routing';

const registerSchema = z.object({
  fullName: z.string().min(5),
  method: z.enum(['Email', 'Phone']),
  identifier: z.string().min(5), // Email or Phone
  password: z.string().min(8),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {register, handleSubmit, watch, formState: {errors}} = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { method: 'Email', termsAccepted: true }
  });

  const method = watch('method');

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        fullName: data.fullName,
        method: data.method === 'Email' ? 0 : 1, // RegistrationMethod Enum
        email: data.method === 'Email' ? data.identifier : null,
        phone: data.method === 'Phone' ? data.identifier : null,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsAccepted: true,
        preferredLanguage: 'ar'
      };

      const response = await apiClient.post('/auth/register', payload);
      const {userId} = response.data.data;
      
      // Redirect to OTP verification
      router.push(`/verify-otp?userId=${userId}&type=${payload.method === 0 ? 'Email' : 'Phone'}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-neutral-100">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{t('register.title')}</h1>
        <p className="text-neutral-500">{t('register.subtitle')}</p>
      </div>

      {error && (
        <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>{t('register.fullName')}</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 rtl:left-auto rtl:right-3" />
            <Input {...register('fullName')} className="ps-10 rtl:pe-10" placeholder="محمد أحمد" />
          </div>
          {errors.fullName && <p className="text-xs text-error">{t('errors.fullNameMin')}</p>}
        </div>

        <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg">
          <Button 
            type="button" 
            variant={method === 'Email' ? 'default' : 'ghost'} 
            className="flex-1 text-sm h-9"
            onClick={() => {}} // Method is controlled by form registration usually, here we hack it or use setValue
          >
            {t('register.emailMethod')}
          </Button>
          <Button 
            type="button" 
            variant={method === 'Phone' ? 'default' : 'ghost'} 
            className="flex-1 text-sm h-9"
            onClick={() => {}}
          >
            {t('register.phoneMethod')}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>{method === 'Email' ? t('register.email') : t('register.phone')}</Label>
          <div className="relative">
            {method === 'Email' ? (
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 rtl:left-auto rtl:right-3" />
            ) : (
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 rtl:left-auto rtl:right-3" />
            )}
            <Input {...register('identifier')} className="ps-10 rtl:pe-10" placeholder={method === 'Email' ? 'user@example.com' : '+9665...'} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('register.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 rtl:left-auto rtl:right-3" />
              <Input {...register('password')} type="password" className="ps-10 rtl:pe-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('register.confirmPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 rtl:left-auto rtl:right-3" />
              <Input {...register('confirmPassword')} type="password" className="ps-10 rtl:pe-10" />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg font-semibold bg-primary-500 hover:bg-primary-600 transition-all rounded-xl" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : t('register.submit')}
        </Button>
      </form>
    </div>
  );
}
