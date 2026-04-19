'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import { Mail, Phone, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import apiClient from '@/lib/api-client';
import {useRouter} from '@/i18n/routing';
import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';

export default function RegisterForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerSchema = z.object({
    fullName: z.string().min(5, t('errors.fullNameMin')),
    method: z.enum(['Email', 'Phone']),
    identifier: z.string().min(5, t('errors.identifierRequired')), // Email or Phone
    password: z.string().min(8, t('errors.passwordMin')),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('errors.passwordsMismatch'),
    path: ["confirmPassword"],
  });
  type RegisterValues = z.infer<typeof registerSchema>;


  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterValues>({
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
      const { userId } = response.data.data;
      
      // Redirect to OTP verification
      router.push(`/verify-otp?userId=${userId}&type=${payload.method === 0 ? 'Email' : 'Phone'}`);
    } catch (err: any) {
      setError(err.response?.data?.message || t('errors.registrationFailed'));
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
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(0,108,53,0.2)] border border-white/20 relative group-hover:scale-110 transition-transform duration-700 p-2">
           <img src="/images/logo.png" alt={t("common.logoAlt")} className="h-full w-full object-contain mx-auto drop-shadow-lg" />
           <div className="absolute inset-0 bg-white/5 rounded-[1.5rem] animate-pulse" />
        </div>
        <h2 className="text-3xl md:text-3xl font-black tracking-tighter text-neutral-900 dark:text-white font-arabic leading-none">
          {t('register.title')}
        </h2>
        <p className="text-neutral-500 font-bold text-sm font-arabic">
          {t('register.subtitle')}
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
        {/* Full Name */}
        <div className="space-y-3">
          <Label className="text-neutral-300 font-semibold ms-1">{t('register.fullName')}</Label>
          <div className="relative group">
            <User className="absolute start-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
            <Input 
              {...register('fullName')} 
              data-testid="register-fullname" 
              className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-arabic" 
              placeholder={t('register.placeholderName')} 
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-400 font-medium ms-1">{errors.fullName.message}</p>}
        </div>

        {/* Method Toggle */}
        <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
          <button 
            type="button" 
            className={cn(
              "flex-1 h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
              method === 'Email' ? "bg-primary text-white shadow-lg" : "text-neutral-500 hover:text-white"
            )}
            onClick={() => setValue('method', 'Email')}
          >
            {t('register.emailMethod')}
          </button>
          <button 
            type="button" 
            className={cn(
              "flex-1 h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
              method === 'Phone' ? "bg-primary text-white shadow-lg" : "text-neutral-500 hover:text-white"
            )}
            onClick={() => setValue('method', 'Phone')}
          >
            {t('register.phoneMethod')}
          </button>
        </div>

        {/* Identifier (Email/Phone) */}
        <div className="space-y-3">
          <Label className="text-neutral-300 font-semibold ms-1">
            {method === 'Email' ? t('register.email') : t('register.phone')}
          </Label>
          <div className="relative group">
            {method === 'Email' ? (
              <Mail className="absolute start-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
            ) : (
              <Phone className="absolute start-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
            )}
            <Input 
              {...register('identifier')} 
              data-testid="register-identifier" 
              dir="ltr"
              className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-english" 
              placeholder={method === 'Email' ? t('login.placeholderEmail') : t('login.placeholderPhone')} 
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-400 font-medium ms-1">{errors.identifier.message}</p>}
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-neutral-300 font-semibold ms-1">{t('register.password')}</Label>
            <div className="relative group">
              <Lock className="absolute start-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
              <Input 
                {...register('password')} 
                data-testid="register-password" 
                type="password" 
                dir="ltr"
                className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary/50 transition-all font-english" 
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-neutral-300 font-semibold ms-1">{t('register.confirmPassword')}</Label>
            <div className="relative group">
              <Lock className="absolute start-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
              <Input 
                {...register('confirmPassword')} 
                data-testid="register-confirm-password" 
                type="password" 
                dir="ltr"
                className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary/50 transition-all font-english" 
              />
            </div>
          </div>
        </div>
        {(errors.password || errors.confirmPassword) && (
          <p className="text-xs text-red-400 font-medium ms-1">
            {errors.password?.message || errors.confirmPassword?.message}
          </p>
        )}

        <Button 
          type="submit" 
          data-testid="register-submit" 
          disabled={isLoading}
          className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 transition-all rounded-[1.5rem] shadow-xl shadow-primary/20 active:scale-[0.97] mt-2 group"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full relative">
              <span>{t('register.submit')}</span>
              <ArrowRight className="absolute end-6 w-6 h-6 group-hover:translate-x-1 group-rtl:rotate-180 transition-transform" />
            </div>
          )}
        </Button>
      </form>
    </motion.div>
  );
}


