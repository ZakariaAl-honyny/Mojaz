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
import { Phone, User, Lock, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { Link } from '@/i18n/routing';

const phoneRegisterSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^\+9665[0-9]{8}$/, 'Enter a valid Saudi phone number (+9665xxxxxxxx)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PhoneRegisterFormValues = z.infer<typeof phoneRegisterSchema>;

export function PhoneRegistrationForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PhoneRegisterFormValues>({
    resolver: zodResolver(phoneRegisterSchema),
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: PhoneRegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        method: RegistrationMethod.Phone,
        preferredLanguage: 'ar',
        termsAccepted: data.termsAccepted,
      });

      if (response.success && response.data?.userId) {
        router.push(`/register/verify?userId=${response.data.userId}&method=phone&dest=${encodeURIComponent(data.phone)}`);
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-md dark:bg-neutral-900/80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary-500">
            {t('register.phoneTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('register.phoneSubtitle')}
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
              <Label htmlFor="phoneFullName">{t('register.fullName')}</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phoneFullName"
                  placeholder={t('register.fullNamePlaceholder')}
                  className={cn("ps-10 h-11", errors.fullName && "border-destructive")}
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('register.phone')}</Label>
              <div className="relative">
                <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phone"
                  placeholder="+9665xxxxxxxx"
                  className={cn("ps-10 h-11 font-mono", errors.phone && "border-destructive")}
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonePassword">{t('register.password')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phonePassword"
                  type="password"
                  placeholder="••••••••"
                  className={cn("ps-10 h-11", errors.password && "border-destructive")}
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneConfirmPassword">{t('register.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phoneConfirmPassword"
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
                id="phoneTerms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="phoneTerms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('register.acceptTerms')}{' '}
                  <Link href="/terms" className="text-primary-500 hover:underline">{t('register.termsLink')}</Link>
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
            <Link href="/login" className="text-primary-500 font-semibold hover:underline">
              {t('register.loginLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
