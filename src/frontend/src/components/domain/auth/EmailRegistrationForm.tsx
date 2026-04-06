'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { RegistrationMethod } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { Mail, User, Lock, AlertCircle, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function EmailRegistrationForm() {
  const t = useTranslations('auth');
  const commonT = useTranslations('common');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        method: RegistrationMethod.Email,
        preferredLanguage: 'ar', // Or get from context
        termsAccepted: data.termsAccepted,
      });

      if (response.success && response.data?.userId) {
        // Redirect to OTP verification with userId
        router.push(`/register/verify?userId=${response.data.userId}&method=email&dest=${data.email}`);
      } else {
        setError(response.message || t('errors.registrationFailed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-md dark:bg-neutral-900/80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary-500">
            {t('register.emailTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('register.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">{t('register.fullName')}</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="fullName"
                  placeholder={t('register.fullNamePlaceholder')}
                  className={cn("ps-10 h-11", errors.fullName && "border-destructive")}
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('register.email')}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@mojaz.gov.sa"
                  className={cn("ps-10 h-11", errors.email && "border-destructive")}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('register.password')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={cn("ps-10 h-11", errors.password && "border-destructive")}
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={cn("ps-10 h-11", errors.confirmPassword && "border-destructive")}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start space-x-2 space-x-reverse py-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('register.acceptTerms')}{' '}
                  <a href="/terms" className="text-primary-500 hover:underline">{t('register.termsLink')}</a>
                </label>
                {errors.termsAccepted && <p className="text-[10px] text-destructive">{errors.termsAccepted.message}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary-500 hover:bg-primary-600 transition-all text-white font-semibold rounded-gov shadow-lg active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('register.processing')}
                </>
              ) : (
                t('register.submit')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 mt-2">
          <p className="text-sm text-neutral-500">
            {t('register.alreadyHaveAccount')}{' '}
            <a href="/login" className="text-primary-500 font-semibold hover:underline">
              {t('register.loginLink')}
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
